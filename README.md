# Study English Website

Landing page institucional da **Study English**, voltada ao público brasileiro que busca aulas de inglês online com foco em aplicação real, flexibilidade de agenda e metodologia personalizada.

## Sumário

- [Visão Geral](#visão-geral)
- [Objetivos do Projeto](#objetivos-do-projeto)
- [Layout e Estrutura das Páginas](#layout-e-estrutura-das-páginas)
- [Funcionalidades](#funcionalidades)
- [Tecnologias e Ferramentas](#tecnologias-e-ferramentas)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Como Executar Localmente](#como-executar-localmente)
- [Customizações Rápidas](#customizações-rápidas)
- [Roadmap](#roadmap)
- [Autor](#autor)
- [Licença](#licença)

## Visão Geral

O site foi construído para apresentar a marca Study English com uma comunicação mais comercial e objetiva, destacando:

- aulas remotas (`Remote English classes`)
- horários flexíveis (`Flexible schedule`)
- aulas personalizadas
- metodologia personalizada

A proposta visual segue um estilo moderno, com identidade forte, boa leitura em mobile e foco em conversão para contato.

## Objetivos do Projeto

- Posicionar a Study English de forma profissional no ambiente digital.
- Comunicar proposta de valor de forma clara e persuasiva.
- Gerar leads através da página de contato.
- Reforçar confiança com conteúdo institucional (sobre, metodologia, FAQ).
- Entregar experiência responsiva e dinâmica com JavaScript puro.

## Layout e Estrutura das Páginas

### 1) Início
Arquivo: `index/01-Início-Study-English.html`

- Hero com proposta principal e CTAs.
- Bloco de diferenciais comerciais.
- Seção "Como funciona" em etapas.
- Banner final de conversão.

### 2) Contato
Arquivo: `index/02-Contato-Study-English.html`

- Mensagem comercial de convite.
- Lista de benefícios.
- Formulário com validação no front-end.
- Feedback visual de envio.

### 3) Sobre
Arquivo: `index/03-Sobre-a-Study-English.html`

- Apresentação institucional da marca.
- Seções "Quem somos" e "Nosso compromisso".
- Bloco de perfil do fundador.
- Valores da escola.

### 4) Metodologia
Arquivo: `index/04-Metodologia.html`

- Explicação da metodologia em pilares.
- Competências trabalhadas (`Listening`, `Speaking`, `Reading`, `Writing`, etc.).
- FAQ interativo.
- CTA para contato.

## Funcionalidades

- Header com destaque de link ativo por página.
- Menu mobile com botão hambúrguer.
- Efeito visual no header ao scroll.
- Animações de entrada com `IntersectionObserver`.
- Contadores animados na página inicial.
- FAQ expansível na página de metodologia.
- Validação de formulário usando API nativa do navegador (`checkValidity` + `reportValidity`).
- Atualização automática do ano no rodapé via JavaScript.

## Tecnologias e Ferramentas

- **HTML5** (estrutura semântica)
- **CSS3** (layout responsivo, variáveis CSS, grid/flex, efeitos visuais)
- **JavaScript Vanilla** (interações e comportamento dinâmico)
- **Google Fonts** (`Manrope` e `Playfair Display`)

## Estrutura de Pastas

```bash
study-english-website/
├── README.md
├── LICENSE
└── index/
    ├── 01-Início-Study-English.html
    ├── 02-Contato-Study-English.html
    ├── 03-Sobre-a-Study-English.html
    ├── 04-Metodologia.html
    ├── styles.css
    ├── main.js
    └── img/
        ├── Logo-sem-fundo.png
        ├── Study-English-Logo 2.png
        ├── banner-header-logo 2.png
        ├── NYC 2.png
        └── 00-foto-de-perfil-ebener 2.jpg
```

## Como Executar Localmente

### Opção 1: Abrir direto no navegador

1. Acesse a pasta `index`.
2. Abra o arquivo `01-Início-Study-English.html` no navegador.

### Opção 2: VS Code com Live Server (recomendado)

1. Abra o projeto no VS Code.
2. Clique com botão direito em `index/01-Início-Study-English.html`.
3. Selecione **Open with Live Server**.

## Customizações Rápidas

- **Logo principal**: troque `index/img/Logo-sem-fundo.png`.
- **Paleta de cores**: ajuste variáveis no topo de `index/styles.css` (`:root`).
- **Textos comerciais**: edite blocos de copy nos arquivos HTML.
- **Comportamento JS**: personalize `index/main.js` (FAQ, animações, menu, validação).

## Roadmap

- [ ] Integrar formulário com backend real (e-mail/CRM/WhatsApp API).
- [ ] Adicionar métricas de conversão (Google Analytics / Meta Pixel).
- [ ] Criar seção de depoimentos reais de alunos.
- [ ] Incluir página de blog/artigos para estratégia de SEO.
- [ ] Melhorar acessibilidade com auditoria completa (Lighthouse + WCAG).

## Autor

Projeto desenvolvido para **Study English**.

Se quiser evoluir este projeto com novas páginas, integrações ou automações, abra uma issue ou proposta de melhoria.

## Licença

Este projeto está protegido por **licença proprietária (All Rights Reserved)**.

Consulte o arquivo `LICENSE` para as condições completas de uso, reprodução e distribuição.
