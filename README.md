# CONVO

Site institucional da **CONVO** — plataforma de conversação em inglês para profissionais. Construído com HTML, CSS e JavaScript puro, sem dependências de framework.

## Páginas

| Arquivo | Rota | Conteúdo |
|---|---|---|
| `01-inicio-convo.html` | Início | Hero, diferenciais, como funciona, CTA |
| `02-contato-convo.html` | Contato | Formulário de solicitação de conversa inicial |
| `03-sobre-convo.html` | Sobre | Manifesto, fundador, valores |
| `04-metodologia-convo.html` | Metodologia | Pilares do método, competências, FAQ |

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

**Opção 1 — direto no navegador**

Abra `index/01-inicio-convo.html` no browser.

**Opção 2 — Live Server (recomendado)**

1. Abra o projeto no VS Code
2. Clique com botão direito em `index/01-inicio-convo.html`
3. Selecione **Open with Live Server**

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

- [ ] Integrar formulário com backend (e-mail / WhatsApp API)
- [ ] Adicionar depoimentos de clientes
- [ ] Implementar modal de agendamento (estrutura CSS já pronta em `modal.css`)
- [ ] Analytics (Google Analytics / Meta Pixel)
- [ ] Auditoria de acessibilidade (Lighthouse + WCAG)
- [ ] Blog / artigos para SEO

## Autor

Desenvolvido por **Ebener Santos** — fundador da CONVO.

## Licença

Licença proprietária — All Rights Reserved. Consulte o arquivo `LICENSE`.
