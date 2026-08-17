---
name: accessibility
description: Audit and implement accessible frontend interfaces with semantic HTML, keyboard support, focus management, ARIA, forms, and readable visual design.
---

# Accessibility

Build accessibility into the interface rather than adding it afterward.

## Requirements
- Use semantic HTML first.
- Associate labels with inputs.
- Provide useful accessible names.
- Ensure all interactive elements work by keyboard.
- Keep focus indicators visible.
- Manage focus for dialogs, drawers, menus, and route changes.
- Do not use color alone to communicate state.
- Maintain adequate contrast.
- Add alt text based on image purpose.
- Use ARIA only when native semantics are insufficient.
- Announce important dynamic status changes when needed.
- Respect reduced-motion preferences.

## Audit
Check heading order, landmarks, tab order, focus traps, escape behavior, form errors, touch targets, zoom, contrast, screen-reader naming, and keyboard-only operation.
