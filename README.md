# CONVO

Site institucional da **CONVO** — plataforma de conversação em inglês para profissionais. Construído com HTML, CSS e JavaScript puro, sem dependências de framework.

## Páginas

| Arquivo | Rota | Conteúdo |
|---|---|---|
| `01-inicio-convo.html` | `/inicio` | Hero, diferenciais, como funciona, CTA |
| `02-contato-convo.html` | `/contato` | Formulário de solicitação de conversa inicial |
| `03-sobre-convo.html` | `/sobre` | Manifesto, fundador, valores |
| `04-metodologia-convo.html` | `/metodologia` | Pilares do método, competências, FAQ |

URLs antigas (`/index/01-inicio-convo.html`) redirecionam com 301
para as rotas limpas. `/` redireciona para `/inicio`.

## Funcionalidades

- Header fixo com efeito de blur ao scroll e link ativo por página
- Menu mobile com hambúrguer
- Animações de entrada via `IntersectionObserver`
- Contadores animados (métricas do hero)
- FAQ expansível com animação de altura
- Validação de formulário nativa (`checkValidity` + `reportValidity`)
- Ano do footer atualizado automaticamente

## Stack

- **HTML5** semântico
- **CSS3** com custom properties — sem framework
- **JavaScript Vanilla**
- **Google Fonts** — `Sora` (display) e `Inter` (UI)

## Estrutura

```
study-english-website/
├── README.md
├── LICENSE
└── index/
    ├── 01-inicio-convo.html
    ├── 02-contato-convo.html
    ├── 03-sobre-convo.html
    ├── 04-metodologia-convo.html
    ├── main.js
    ├── styles.css              ← entry point (só @imports)
    ├── styles/
    │   ├── base.css            ← tokens CSS + reset
    │   ├── layout.css          ← container, section utilities
    │   ├── typography.css      ← headings, p, eyebrow
    │   ├── buttons.css         ← btn, primary, ghost, inverse
    │   ├── header.css          ← header, nav, brand
    │   ├── hero.css            ← hero section + speech bubble
    │   ├── components.css      ← cards, FAQ, contato, CTA, footer
    │   ├── modal.css           ← modal (pronto para uso)
    │   └── responsive.css      ← animações + media queries
    └── img/
        ├── convoRound.png
        ├── convoRoundTranspBG.png
        ├── convoSquare.png
        ├── convoSquareTranspBG.png
        └── 00-foto-de-perfil-ebener 2.jpg
```

## Como rodar localmente

**Opção 1 — site completo com backend (recomendado)**

Requer Node.js 22.5+ (o banco usa o módulo embutido `node:sqlite`).

```bash
npm install          # instala express, nodemailer, dotenv, express-rate-limit
cp .env.example .env # preencha EMAIL_PASS (senha de app do Gmail)
npm start            # http://localhost:3000
```

Sem `EMAIL_PASS`, o formulário funciona normalmente — os contatos são
salvos no banco e apenas o e-mail de notificação é pulado.

**Opção 2 — só o frontend (Live Server)**

1. Abra o projeto no VS Code
2. Clique com botão direito em `index/01-inicio-convo.html`
3. Selecione **Open with Live Server**

Nesta opção o formulário de contato precisa do backend rodando em
paralelo (`npm start`) para os envios funcionarem.

## Backend

API em Express com SQLite (arquivo único em `backend/data/convo.db`,
fora do Git). Estrutura MVC:

```
server.js                                ← entrada: static + API
backend/
├── config/
│   ├── database.js                      ← conexão node:sqlite + schema
│   └── mailer.js                        ← Nodemailer (Gmail via senha de app)
├── models/contact_model.js              ← SQL isolado (prepared statements)
├── controllers/contact_controller.js    ← validação + orquestração
└── routes/contact_routes.js             ← POST /api/contact (rate limit 5/15min)
```

Fluxo do contato: valida → salva no banco (fonte da verdade) →
envia e-mail para `letusconvo@gmail.com` → marca `email_enviado`.
Se o e-mail falhar, o lead permanece no banco com `email_enviado = 0`.
Proteções: honeypot anti-bot, rate limiting por IP, sanitização e
validação server-side, prepared statements.

### Deploy (Hostinger compartilhado / letusconvo.com)

A hospedagem compartilhada da Hostinger roda PHP, não Node.
Por isso existem DOIS backends equivalentes no repositório:

| Ambiente | Backend | Rotas limpas |
|---|---|---|
| Local (dev) | Node/Express (`npm start`) | `server.js` |
| Produção (Hostinger) | PHP (`api/contact.php`) | `.htaccess` |

Mesmas validações, mesmo honeypot, mesmo rate limit, mesmo
e-mail. **Ao alterar opções do formulário, atualize os dois**
(`contact_controller.js` e `contact.php`).

**O que enviar para `public_html`** (File Manager ou FTP):

```
.htaccess
api/          (contact.php, mailer.php, config.php)
css/
img/
index/
js/
```

Nada de `backend/`, `node_modules/`, `server.js`, `package*.json`
— e se forem por engano, o `.htaccess` bloqueia o acesso externo.

**Passos:**

1. Limpe o `public_html` e envie os itens da lista acima.
2. Confirme que `api/config.php` existe com a senha de app
   (se não, copie `config.example.php` e preencha).
3. Teste: `letusconvo.com/inicio` e envie o formulário.
4. O banco é criado automaticamente em `convo_data/convo.db`,
   um nível ACIMA do `public_html` (inacessível pela web).

## Design system

Os tokens de cor, tipografia e espaçamento ficam em `index/styles/base.css` (bloco `:root`). Não use valores hex diretamente nos outros arquivos — use as variáveis.

```css
/* Cores principais */
--cp-500: #7B2CBF;   /* roxo primário */
--cg-900: #18181B;   /* grafite — texto principal */
--ci:     #FAFAFA;   /* canvas de fundo */
--grad: linear-gradient(135deg, #5A189A 0%, #9D4EDD 100%);

/* Fontes */
font-family: 'Sora'  /* display / headings */
font-family: 'Inter' /* UI / corpo */
```

Diretrizes completas de marca, tom de voz e convenções de código são de uso interno.

## Roadmap

- [x] Integrar formulário com backend (e-mail + banco SQLite)
- [ ] Adicionar depoimentos de clientes
- [ ] Implementar modal de agendamento (estrutura CSS já pronta em `modal.css`)
- [ ] Analytics (Google Analytics / Meta Pixel)
- [ ] Auditoria de acessibilidade (Lighthouse + WCAG)
- [ ] Blog / artigos para SEO

## Autor

Desenvolvido por **Ebener Santos** — fundador da CONVO.

## Licença

Licença proprietária — All Rights Reserved. Consulte o arquivo `LICENSE`.
