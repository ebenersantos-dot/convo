// ============================================================
// CONVO — Model de Contato
// ============================================================
// O model é a ÚNICA camada que fala com o banco.
// Controllers chamam estas funções; nunca escrevem SQL direto.
// Os "?" são placeholders (prepared statements) — o SQLite trata
// os valores como dados, nunca como SQL. Isso elimina SQL injection.
// ============================================================

const db = require("../config/database");

const ContactModel = {
    // Insere um novo contato e devolve o registro criado.
    create: function (data) {
        const stmt = db.prepare(`
            INSERT INTO contacts (nome, whatsapp, email, nivel, disponibilidade, mensagem)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            data.nome,
            data.whatsapp,
            data.email,
            data.nivel,
            data.disponibilidade,
            data.mensagem
        );
        return ContactModel.findById(result.lastInsertRowid);
    },

    // Marca que o e-mail de notificação foi enviado com sucesso.
    markEmailSent: function (id) {
        db.prepare("UPDATE contacts SET email_enviado = 1 WHERE id = ?").run(id);
    },

    findById: function (id) {
        return db.prepare("SELECT * FROM contacts WHERE id = ?").get(id);
    },

    // Lista todos os contatos, mais recentes primeiro.
    findAll: function () {
        return db.prepare("SELECT * FROM contacts ORDER BY criado_em DESC").all();
    },
};

module.exports = ContactModel;
