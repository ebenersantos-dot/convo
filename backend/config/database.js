// ============================================================
// CONVO — Conexão com o banco SQLite
// ============================================================
// Usa o módulo node:sqlite, EMBUTIDO no Node.js 22+.
// Vantagens: zero dependências, nada para compilar no deploy.
// SQLite guarda tudo em um único arquivo (backend/data/convo.db)
// — não precisa de servidor de banco rodando. Ideal pré-lançamento.
// Se um dia migrar para MySQL/Postgres, só este arquivo e os
// models mudam; controllers e rotas ficam iguais.
// ============================================================

const path = require("path");
const fs = require("fs");
const { DatabaseSync } = require("node:sqlite");

// Garante que a pasta backend/data/ existe antes de criar o .db.
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DB_PATH || path.join(dataDir, "convo.db");
const db = new DatabaseSync(dbPath);

// WAL = Write-Ahead Logging. Melhora performance de escrita
// e evita travamentos quando leituras e escritas acontecem juntas.
db.exec("PRAGMA journal_mode = WAL;");

// Cria a tabela de contatos se ainda não existir.
// IF NOT EXISTS torna seguro rodar em toda inicialização.
db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
        id             INTEGER PRIMARY KEY AUTOINCREMENT,
        nome           TEXT    NOT NULL,
        whatsapp       TEXT    NOT NULL,
        email          TEXT    NOT NULL,
        nivel          TEXT    NOT NULL,
        disponibilidade TEXT   NOT NULL,
        mensagem       TEXT    NOT NULL,
        email_enviado  INTEGER NOT NULL DEFAULT 0,
        criado_em      TEXT    NOT NULL DEFAULT (datetime('now'))
    );
`);

module.exports = db;
