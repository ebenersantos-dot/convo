// ============================================================
// CONVO — Servidor Express
// Ponto de entrada do backend. Responsável por:
//   1. Servir os arquivos estáticos do site (index/, css/, js/, img/)
//   2. Expor a API REST (/api/contact)
// ============================================================

// dotenv carrega as variáveis do arquivo .env para process.env.
// Assim, senhas e configurações ficam fora do código-fonte.
require("dotenv").config();

const path = require("path");
const express = require("express");

const contactRoutes = require("./backend/routes/contact_routes");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares globais -----------------------------------

// Converte o corpo das requisições JSON em objeto JS (req.body).
// O limite evita payloads gigantes de bots.
app.use(express.json({ limit: "10kb" }));

// Cabeçalhos básicos de segurança (sem dependência extra).
app.use(function (req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
});

// CORS: em produção o Express serve o próprio site (mesma origem),
// então CORS quase não é usado. A exceção é desenvolvimento local
// (ex: Live Server na porta 5500 chamando a API na 3000).
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
    "http://localhost:5500,http://127.0.0.1:5500,https://letusconvo.com,https://www.letusconvo.com")
    .split(",")
    .map(function (o) { return o.trim(); });

app.use(function (req, res, next) {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
    // Requisição "preflight" do navegador — responde e encerra.
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

// --- Rotas da API ------------------------------------------

app.use("/api", contactRoutes);

// Healthcheck — útil para monitoramento no Hostinger.
app.get("/api/health", function (req, res) {
    res.json({ status: "ok", uptime: process.uptime() });
});

// --- Arquivos estáticos ------------------------------------

// Serve tudo a partir da raiz do projeto, então os caminhos
// relativos das páginas (../css/main.css) continuam funcionando.
app.use(express.static(path.join(__dirname), {
    extensions: ["html"],
}));

// Raiz do site → página inicial.
app.get("/", function (req, res) {
    res.redirect("/index/01-inicio-convo.html");
});

// --- Inicialização -----------------------------------------

app.listen(PORT, function () {
    console.log("CONVO server rodando em http://localhost:" + PORT);
});
