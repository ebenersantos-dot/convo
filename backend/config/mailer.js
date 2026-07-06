// ============================================================
// CONVO — Envio de e-mail (Nodemailer + Gmail)
// ============================================================
// Usa o SMTP do Gmail com uma "senha de app" (não a senha normal).
// Como gerar: conta Google letusconvo@gmail.com → Segurança →
// Verificação em duas etapas (ativar) → Senhas de app → criar.
// A senha vai no .env como EMAIL_PASS. Nunca no código.
// ============================================================

const nodemailer = require("nodemailer");

const EMAIL_USER = process.env.EMAIL_USER || "letusconvo@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || "letusconvo@gmail.com";

// Sem senha configurada (ex: desenvolvimento local), o envio é
// pulado — o contato continua sendo salvo no banco normalmente.
const enabled = Boolean(EMAIL_PASS);

const transporter = enabled
    ? nodemailer.createTransport({
          service: "gmail",
          auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      })
    : null;

// Monta e envia o e-mail de notificação de novo contato.
// Retorna true se enviou, false se pulou ou falhou.
async function sendContactNotification(contact) {
    if (!enabled) {
        console.warn("[mailer] EMAIL_PASS não definido — envio pulado (contato salvo no banco).");
        return false;
    }

    const text = [
        "Novo contato pelo site letusconvo.com",
        "",
        "Nome:            " + contact.nome,
        "WhatsApp:        " + contact.whatsapp,
        "E-mail:          " + contact.email,
        "Nível:           " + contact.nivel,
        "Disponibilidade: " + contact.disponibilidade,
        "",
        "Objetivo com o inglês:",
        contact.mensagem,
        "",
        "Recebido em: " + contact.criado_em + " (UTC)",
        "ID no banco: " + contact.id,
    ].join("\n");

    try {
        await transporter.sendMail({
            from: '"CONVO — Site" <' + EMAIL_USER + ">",
            to: EMAIL_TO,
            replyTo: contact.email, // "Responder" no Gmail vai direto para o lead
            subject: "Novo contato: " + contact.nome,
            text: text,
        });
        return true;
    } catch (err) {
        // Falha de e-mail não pode derrubar a requisição —
        // o contato já está salvo no banco.
        console.error("[mailer] Falha ao enviar e-mail:", err.message);
        return false;
    }
}

module.exports = { sendContactNotification };
