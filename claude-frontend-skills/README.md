# Claude Frontend Skills Pack

Pacote de skills para Claude Code focado em criação de interfaces modernas, React, Tailwind, UX, responsividade, animações e qualidade de produção.

## Skills incluídas

- frontend-design
- frontend-architecture
- react-best-practices
- tailwind-design-system
- responsive-design
- animation-motion
- scroll-experience
- accessibility
- landing-page
- dashboard-ui
- ui-ux-review
- visual-qa
- frontend-performance
- final-polish

## Instalação global

Copie as pastas deste pacote para:

### Windows
`%USERPROFILE%\.claude\skills\`

Exemplo:
`C:\Users\SEU_USUARIO\.claude\skills\frontend-design\SKILL.md`

### macOS / Linux
`~/.claude/skills/`

## Instalação somente no projeto

Copie as pastas para:

`.claude/skills/`

na raiz do projeto.

## Estrutura esperada

```text
.claude/
  skills/
    frontend-design/
      SKILL.md
    responsive-design/
      SKILL.md
    ...
```

## Prompt recomendado

```text
Crie esta interface como uma aplicação frontend production-grade.

Use as skills adequadas para:
- definir uma direção visual forte;
- estruturar componentes React;
- criar um design system consistente com Tailwind;
- garantir responsividade;
- aplicar animações e microinterações com propósito;
- revisar acessibilidade e performance.

Antes de finalizar, execute uma revisão de UI/UX, Visual QA e Final Polish.
Não entregue uma interface genérica de template.
```

## Pipeline recomendado

```text
frontend-design
→ frontend-architecture
→ react-best-practices
→ tailwind-design-system
→ responsive-design
→ animation-motion / scroll-experience
→ accessibility
→ frontend-performance
→ ui-ux-review
→ visual-qa
→ final-polish
```

## Observação

Este pacote contém skills originais criadas para este bundle. A Anthropic também mantém sua própria skill/plugin oficial de frontend-design; ela pode ser instalada separadamente conforme a documentação do Claude Code.
