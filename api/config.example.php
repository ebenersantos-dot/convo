<?php
// ============================================================
// CONVO — Configuração do endpoint PHP (hospedagem compartilhada)
// ============================================================
// Copie este arquivo como config.php (no mesmo diretório) e
// preencha a senha. O config.php real NUNCA vai para o Git e
// está bloqueado para acesso externo pelo .htaccess.
// ============================================================

return [
    // Conta que ENVIA (Gmail)
    'email_user' => 'letusconvo@gmail.com',

    // Senha de app do Gmail (16 letras, sem espaços) —
    // a MESMA usada no .env do backend Node.
    'email_pass' => '',

    // Conta que RECEBE as notificações
    'email_to'   => 'letusconvo@gmail.com',
];
