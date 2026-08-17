---
name: tailwind-design-system
description: Build coherent Tailwind CSS interfaces using reusable tokens, variants, primitives, and consistent responsive patterns.
---

# Tailwind Design System

Use Tailwind as a system rather than a collection of arbitrary utility strings.

## Rules
- Define reusable color, spacing, radius, shadow, and typography tokens.
- Prefer semantic tokens such as background, surface, foreground, muted, accent, danger.
- Build reusable primitives for Button, Input, Card, Badge, Modal, Tooltip, Tabs, and navigation.
- Use a class composition helper when variants become complex.
- Avoid repeating long class strings across the codebase.
- Keep responsive breakpoints intentional.
- Do not scatter arbitrary pixel values unless needed for a specific visual effect.
- Maintain consistent interactive states.

## Review
Check token reuse, responsive behavior, dark-mode readiness, duplicated styles, focus states, spacing rhythm, and component variants.
