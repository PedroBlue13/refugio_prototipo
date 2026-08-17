---
name: react-best-practices
description: Apply robust React patterns for components, hooks, state, rendering, forms, effects, and maintainable application code.
---

# React Best Practices

Write predictable, readable React.

## Rules
- Use semantic components with explicit props.
- Keep derived values derived; do not duplicate them in state.
- Use effects only for synchronization with external systems.
- Avoid effects for ordinary calculations or event handling.
- Prefer controlled state where ownership is clear.
- Memoize only when measurement or architecture justifies it.
- Use stable keys based on identity, never array indexes for mutable lists.
- Represent async states explicitly.
- Prevent race conditions in requests and effects.
- Handle cleanup for subscriptions, timers, and observers.
- Keep hooks deterministic and narrowly scoped.
- Preserve accessibility in custom controls.

## Review
Look for unnecessary re-renders, stale closures, oversized components, mixed responsibilities, hidden mutations, weak typing, and missing error states.
