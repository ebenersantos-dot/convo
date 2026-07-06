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

// --- Rotas limpas das páginas -------------------------------

// Mapa URL amigável → arquivo HTML. Uma única fonte da verdade:
// para adicionar uma página, basta acrescentar uma linha aqui.
const PAGES = {
    "/inicio": "01-inicio-convo.html",
    "/contato": "02-contato-convo.html",
    "/sobre": "03-sobre-convo.html",
    "/metodologia": "04-metodologia-convo.html",
};

Object.entries(PAGES).forEach(function ([route, file]) {
    app.get(route, function (req, res) {
        res.sendFile(path.join(__dirname, "index", file));
    });

    // URLs antigas (/index/01-inicio-convo.html) redirecionam
    // permanentemente (301) para as novas — preserva links e SEO.
    app.get("/index/" + file, function (req, res) {
        res.redirect(301, route);
    });
});

// Raiz do site → página inicial.
app.get("/", function (req, res) {
    res.redirect("/inicio");
});

// --- Arquivos estáticos ------------------------------------

// Serve css/, js/, img/ etc. a partir da raiz do projeto.
app.use(express.static(path.join(__dirname)));

// Qualquer rota desconhecida → página inicial (404 suave).
app.use(function (req, res) {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ ok: false, error: "Rota não encontrada." });
    }
    res.redirect("/inicio");
});

// --- Inicialização -----------------------------------------

app.listen(PORT, function () {
    console.log("CONVO server rodando em http://localhost:" + PORT);
});
