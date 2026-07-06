// ============================================================
// CONVO — Controller de Contato
// ============================================================
// O controller é o "cérebro" da rota: valida a entrada,
// chama o model (banco) e o mailer, e monta a resposta HTTP.
// Ele não sabe SQL nem SMTP — só orquestra.
// ============================================================

const ContactModel = require("../models/contact_model");
const { sendContactNotification } = require("../config/mailer");

// Valores aceitos nos selects do formulário.
// Validar no backend é obrigatório: o HTML pode ser burlado.
const NIVEIS = ["iniciante", "basico", "intermediario", "avancado", "nao-sei"];
const DISPONIBILIDADES = ["manha", "tarde", "noite", "flexivel"];

// Regex simples de e-mail: algo@algo.algo — suficiente aqui,
// já que o e-mail real será verificado no primeiro retorno.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value, maxLen) {
    if (typeof value !== "string") return "";
    return value.trim().slice(0, maxLen);
}

// Valida o corpo da requisição. Retorna { data } ou { error }.
function validate(body) {
    const data = {
        nome: sanitize(body.nome, 120),
        whatsapp: sanitize(body.whatsapp, 30),
        email: sanitize(body.email, 160).toLowerCase(),
        nivel: sanitize(body.nivel, 20),
        disponibilidade: sanitize(body.disponibilidade, 20),
        mensagem: sanitize(body.mensagem, 2000),
    };

    if (data.nome.length < 2) return { error: "Informe seu nome completo." };
    if (data.whatsapp.replace(/\D/g, "").length < 8) return { error: "Informe um WhatsApp válido." };
    if (!EMAIL_RE.test(data.email)) return { error: "Informe um e-mail válido." };
    if (!NIVEIS.includes(data.nivel)) return { error: "Selecione seu nível de inglês." };
    if (!DISPONIBILIDADES.includes(data.disponibilidade)) return { error: "Selecione sua disponibilidade." };
    if (data.mensagem.length < 5) return { error: "Descreva seu objetivo com o inglês." };

    return { data };
}

// POST /api/contact
async function createContact(req, res) {
    try {
        // Honeypot: campo invisível que humanos não preenchem.
        // Se veio preenchido, é bot — responde 200 (para não dar
        // pista ao bot) e descarta em silêncio.
        if (req.body && req.body.website) {
            return res.json({ ok: true });
        }

        const { data, error } = validate(req.body || {});
        if (error) {
            return res.status(400).json({ ok: false, error: error });
        }

        // 1) Salva no banco — fonte da verdade.
        const contact = ContactModel.create(data);

        // 2) Notifica por e-mail. Se falhar, o lead não se perde:
        //    está no banco com email_enviado = 0.
        const sent = await sendContactNotification(contact);
        if (sent) ContactModel.markEmailSent(contact.id);

        return res.status(201).json({ ok: true });
    } catch (err) {
        console.error("[contact] Erro inesperado:", err);
        return res.status(500).json({
            ok: false,
            error: "Erro interno. Tente novamente em instantes.",
        });
    }
}

module.exports = { createContact };
