---
name: responsive-design
description: Make web interfaces adapt cleanly across mobile, tablet, laptop, desktop, and large displays. Use when implementing or auditing responsive layouts.
---

# Responsive Design

Design from constraints rather than shrinking desktop UI.

## Workflow
1. Identify the minimum useful mobile experience.
2. Establish fluid containers and sensible max widths.
3. Collapse layouts by content priority.
4. Adapt navigation intentionally.
5. Prevent horizontal overflow.
6. Use fluid typography and spacing where appropriate.
7. Keep touch targets comfortable.
8. Test dense tables and dashboards with mobile-specific strategies.

## Patterns
- Stack before squeezing.
- Hide only genuinely secondary information.
- Turn tables into scroll regions or alternative card/list views when necessary.
- Reposition CTAs to remain discoverable.
- Preserve reading order in DOM and visual layout.

## Verify
Test approximately 320, 375, 768, 1024, 1440, and 1920 px widths plus intermediate resizing.
