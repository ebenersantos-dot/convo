<?php
// ============================================================
// CONVO — Endpoint de contato (hospedagem compartilhada / PHP)
// ============================================================
// Equivalente PHP do backend Node (controller + model + rota).
// O .htaccess reescreve POST /api/contact para este arquivo,
// então o frontend (js/main.js) não muda nada.
//
// Fluxo: valida → salva no SQLite (fonte da verdade) →
// envia e-mail → marca email_enviado. Se o e-mail falhar,
// o lead permanece no banco com email_enviado = 0.
// ============================================================

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/mailer.php';

// --- Helpers -------------------------------------------------

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function sanitize($value, int $maxLen): string
{
    if (!is_string($value)) return '';
    return mb_substr(trim($value), 0, $maxLen, 'UTF-8');
}

// --- Só aceita POST ------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Método não permitido.']);
}

// --- Configuração ---------------------------------------------

$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    error_log('[convo] api/config.php não existe — copie de config.example.php');
    respond(500, ['ok' => false, 'error' => 'Erro de configuração do servidor.']);
}
$config = require $configFile;

// --- Lê e valida o corpo da requisição ------------------------

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) $body = [];

// Honeypot: campo invisível que humanos não preenchem.
// Bot preencheu → responde 200 (sem dar pista) e descarta.
if (!empty($body['website'])) {
    respond(200, ['ok' => true]);
}

// Mesmas regras do backend Node — mantenha os dois em sincronia
// com as opções reais do formulário.
$NIVEIS = ['iniciante', 'basico', 'intermediario', 'avancado'];
$DISPONIBILIDADES = ['manha', 'tarde', 'noite', 'variavel'];

$data = [
    'nome'            => sanitize($body['nome'] ?? '', 120),
    'whatsapp'        => sanitize($body['whatsapp'] ?? '', 30),
    'email'           => mb_strtolower(sanitize($body['email'] ?? '', 160), 'UTF-8'),
    'nivel'           => sanitize($body['nivel'] ?? '', 20),
    'disponibilidade' => sanitize($body['disponibilidade'] ?? '', 20),
    'mensagem'        => sanitize($body['mensagem'] ?? '', 2000),
];

if (mb_strlen($data['nome']) < 2) {
    respond(400, ['ok' => false, 'error' => 'Informe seu nome completo.']);
}
if (strlen(preg_replace('/\D/', '', $data['whatsapp'])) < 8) {
    respond(400, ['ok' => false, 'error' => 'Informe um WhatsApp válido.']);
}
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'error' => 'Informe um e-mail válido.']);
}
if (!in_array($data['nivel'], $NIVEIS, true)) {
    respond(400, ['ok' => false, 'error' => 'Selecione seu nível de inglês.']);
}
if (!in_array($data['disponibilidade'], $DISPONIBILIDADES, true)) {
    respond(400, ['ok' => false, 'error' => 'Selecione sua disponibilidade.']);
}
if (mb_strlen($data['mensagem']) < 5) {
    respond(400, ['ok' => false, 'error' => 'Descreva seu objetivo com o inglês.']);
}

// --- Banco de dados (SQLite via PDO) ---------------------------

try {
    // O banco fica FORA do public_html (um nível acima), então
    // não é acessível pela web. contact.php está em
    // public_html/api/ → dirname(__DIR__, 2) = pasta do domínio.
    $dataDir = dirname(__DIR__, 2) . '/convo_data';
    if (!is_dir($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    $db = new PDO('sqlite:' . $dataDir . '/convo.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('PRAGMA journal_mode = WAL;');

    $db->exec('
        CREATE TABLE IF NOT EXISTS contacts (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            nome            TEXT    NOT NULL,
            whatsapp        TEXT    NOT NULL,
            email           TEXT    NOT NULL,
            nivel           TEXT    NOT NULL,
            disponibilidade TEXT    NOT NULL,
            mensagem        TEXT    NOT NULL,
            ip              TEXT,
            email_enviado   INTEGER NOT NULL DEFAULT 0,
            criado_em       TEXT    NOT NULL DEFAULT (datetime(\'now\'))
        );
    ');

    // --- Rate limit: máx. 5 envios por IP a cada 15 minutos ----
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'desconhecido';
    $stmt = $db->prepare("
        SELECT COUNT(*) FROM contacts
        WHERE ip = ? AND criado_em > datetime('now', '-15 minutes')
    ");
    $stmt->execute([$ip]);
    if ((int) $stmt->fetchColumn() >= 5) {
        respond(429, ['ok' => false, 'error' => 'Muitos envios. Tente novamente em alguns minutos.']);
    }

    // --- Salva o contato (prepared statement = sem SQL injection)
    $stmt = $db->prepare('
        INSERT INTO contacts (nome, whatsapp, email, nivel, disponibilidade, mensagem, ip)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $data['nome'],
        $data['whatsapp'],
        $data['email'],
        $data['nivel'],
        $data['disponibilidade'],
        $data['mensagem'],
        $ip,
    ]);

    $id = (int) $db->lastInsertId();
    $contact = $db->query("SELECT * FROM contacts WHERE id = $id")->fetch(PDO::FETCH_ASSOC);

    // --- Notifica por e-mail ------------------------------------
    $sent = convo_send_contact_notification($config, $contact);
    if ($sent) {
        $db->prepare('UPDATE contacts SET email_enviado = 1 WHERE id = ?')->execute([$id]);
    }

    respond(201, ['ok' => true]);
} catch (Throwable $e) {
    error_log('[convo] Erro inesperado: ' . $e->getMessage());
    respond(500, ['ok' => false, 'error' => 'Erro interno. Tente novamente em instantes.']);
}
