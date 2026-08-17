---
name: animation-motion
description: Add purposeful UI animation and microinteractions using CSS or Motion for React while preserving performance and accessibility.
---

# Animation & Motion

Use motion to explain state, hierarchy, and causality.

## Principles
- Animate meaningful transitions, not everything.
- Prefer transform and opacity for smooth rendering.
- Use one strong entrance sequence instead of many unrelated effects.
- Keep hover feedback subtle and fast.
- Use spring motion for physical interactions when appropriate.
- Coordinate related elements.
- Respect prefers-reduced-motion.
- Avoid long animations that delay interaction.

## Good uses
- Page/section reveals
- Modal and drawer transitions
- Shared layout transitions
- Navigation state
- Expand/collapse
- Drag interactions
- Success/error feedback
- Hover/focus microinteractions

## Review
Check interruption behavior, reduced-motion fallback, motion consistency, duration, easing, and whether the animation communicates something useful.
