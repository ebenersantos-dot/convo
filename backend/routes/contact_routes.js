// ============================================================
// CONVO — Rotas de Contato
// ============================================================
// As rotas só mapeiam URL + método HTTP → controller.
// Regra de negócio fica no controller; SQL fica no model.
// ============================================================

const express = require("express");
const rateLimit = require("express-rate-limit");
const { createContact } = require("../controllers/contact_controller");

const router = express.Router();

// Rate limit: máximo de 5 envios por IP a cada 15 minutos.
// Protege contra spam e abuso sem atrapalhar uso legítimo.
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: "Muitos envios. Tente novamente em alguns minutos." },
});

router.post("/contact", contactLimiter, createContact);

module.exports = router;
