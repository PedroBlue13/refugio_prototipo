---
name: frontend-architecture
description: Structure React frontend projects for maintainability, reuse, scalability, and clear separation of concerns. Use when creating or refactoring app architecture.
---

# Frontend Architecture

Design frontend structure around product domains and reusable primitives.

## Principles
- Prefer small composable components over large page components.
- Separate UI, domain logic, data access, and infrastructure.
- Keep state as local as possible.
- Avoid premature global state.
- Use hooks for reusable behavior, not as dumping grounds.
- Keep API contracts explicit and typed.
- Centralize design tokens and shared primitives.
- Prefer feature-oriented folders for medium and large applications.

## Suggested structure
```text
src/
  app/
  components/
    ui/
  features/
  hooks/
  lib/
  services/
  types/
  styles/
```

## Component rules
- Give components one clear responsibility.
- Prefer composition over prop explosion.
- Avoid deeply nested boolean configuration.
- Extract repeated interaction patterns.
- Keep server/data logic out of presentational primitives.

## Finish with
Check dependency direction, component boundaries, naming, type safety, loading/error flows, testability, and unnecessary coupling.
