<?php
// ============================================================
// CONVO — Envio de e-mail via SMTP do Gmail (sem bibliotecas)
// ============================================================
// Cliente SMTP mínimo: abre conexão TLS com smtp.gmail.com:465,
// autentica com a senha de app e envia a mensagem.
// É o equivalente PHP do backend/config/mailer.js (Node).
// ============================================================

declare(strict_types=1);

/**
 * Lê a resposta do servidor SMTP.
 * Respostas podem ter várias linhas ("250-..."); a última linha
 * tem um espaço após o código ("250 ..."). Lê até encontrá-la.
 */
function convo_smtp_read($fp): string
{
    $response = '';
    while (($line = fgets($fp, 1024)) !== false) {
        $response .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }
    return $response;
}

/**
 * Envia um comando e confirma que o código de resposta é o esperado.
 * Retorna false em qualquer divergência — quem chama decide o que fazer.
 */
function convo_smtp_cmd($fp, string $command, string $expectedCode): bool
{
    fwrite($fp, $command . "\r\n");
    $response = convo_smtp_read($fp);
    return strpos($response, $expectedCode) === 0;
}

/**
 * Envia o e-mail de notificação de novo contato.
 * Retorna true se enviou, false se pulou ou falhou.
 * Falha de e-mail nunca derruba a requisição — o contato
 * já está salvo no banco.
 */
function convo_send_contact_notification(array $config, array $contact): bool
{
    if (empty($config['email_pass'])) {
        error_log('[convo mailer] email_pass vazio em config.php — envio pulado.');
        return false;
    }

    $user = $config['email_user'];
    $to   = $config['email_to'];

    $bodyLines = [
        'Novo contato pelo site letusconvo.com',
        '',
        'Nome:            ' . $contact['nome'],
        'WhatsApp:        ' . $contact['whatsapp'],
        'E-mail:          ' . $contact['email'],
        'Nível:           ' . $contact['nivel'],
        'Disponibilidade: ' . $contact['disponibilidade'],
        '',
        'Objetivo com o inglês:',
        $contact['mensagem'],
        '',
        'Recebido em: ' . $contact['criado_em'] . ' (UTC)',
        'ID no banco: ' . $contact['id'],
    ];
    $body = implode("\r\n", $bodyLines);

    // "Dot-stuffing": no protocolo SMTP, uma linha só com "."
    // encerra a mensagem. Linhas do corpo que começam com "."
    // precisam ser escapadas com ponto duplo.
    $body = preg_replace('/^\./m', '..', $body);

    // Assunto com acentos precisa de codificação MIME (UTF-8 base64).
    $subject = '=?UTF-8?B?' . base64_encode('Novo contato: ' . $contact['nome']) . '?=';

    $headers = implode("\r\n", [
        'From: CONVO - Site <' . $user . '>',
        'To: <' . $to . '>',
        'Reply-To: <' . $contact['email'] . '>',
        'Subject: ' . $subject,
        'Date: ' . date('r'),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ]);

    // Porta 465 = TLS implícito (a conexão já nasce criptografada).
    $fp = @stream_socket_client(
        'ssl://smtp.gmail.com:465',
        $errno,
        $errstr,
        15
    );

    if (!$fp) {
        error_log("[convo mailer] Falha de conexão SMTP: $errno $errstr");
        return false;
    }

    stream_set_timeout($fp, 15);

    try {
        // Saudação do servidor
        if (strpos(convo_smtp_read($fp), '220') !== 0) return false;

        // Sequência SMTP: identificar → autenticar → enviar
        if (!convo_smtp_cmd($fp, 'EHLO letusconvo.com', '250')) return false;
        if (!convo_smtp_cmd($fp, 'AUTH LOGIN', '334')) return false;
        if (!convo_smtp_cmd($fp, base64_encode($user), '334')) return false;
        if (!convo_smtp_cmd($fp, base64_encode($config['email_pass']), '235')) {
            error_log('[convo mailer] Autenticação recusada — confira a senha de app.');
            return false;
        }
        if (!convo_smtp_cmd($fp, "MAIL FROM:<$user>", '250')) return false;
        if (!convo_smtp_cmd($fp, "RCPT TO:<$to>", '250')) return false;
        if (!convo_smtp_cmd($fp, 'DATA', '354')) return false;

        // Mensagem termina com linha contendo apenas "."
        if (!convo_smtp_cmd($fp, $headers . "\r\n\r\n" . $body . "\r\n.", '250')) {
            return false;
        }

        convo_smtp_cmd($fp, 'QUIT', '221');
        return true;
    } finally {
        fclose($fp);
    }
}
