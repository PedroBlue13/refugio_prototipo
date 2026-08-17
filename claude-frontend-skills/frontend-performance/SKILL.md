---
name: frontend-performance
description: Improve frontend runtime performance, loading speed, rendering efficiency, asset delivery, and Core Web Vitals.
---

# Frontend Performance

Optimize based on user-visible impact.

## Priorities
1. Reduce unnecessary JavaScript.
2. Split expensive routes and features.
3. Optimize images and fonts.
4. Prevent layout shifts.
5. Improve above-the-fold rendering.
6. Cache stable assets and data appropriately.
7. Virtualize genuinely large lists.
8. Avoid expensive render loops.
9. Defer non-critical third-party scripts.
10. Measure before adding complexity.

## React checks
- Oversized client bundles
- Excessive client components
- Repeated fetches
- Rendering large trees unnecessarily
- Heavy libraries for trivial behavior
- Unstable props that defeat memoization
- Long synchronous computations

## Finish
Evaluate LCP, INP, CLS, bundle size, network waterfalls, image weight, font loading, and interaction responsiveness.
