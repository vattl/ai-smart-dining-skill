# Responsive Fidelity Rules

## Principle

Visual fidelity means preserving hierarchy, proportion, density, rhythm, and breakpoint behavior — not copying fixed pixels to every device.

## Reference viewport

An approved prototype may define one or more reference viewports for high-fidelity comparison.

At reference viewport:
- structure must match,
- major proportion should closely match,
- spacing and typography should be visually close.

At other viewports:
- preserve information hierarchy,
- preserve relative emphasis,
- adapt layout according to breakpoint rules,
- avoid overflow and unusable density.

## Prefer

- fluid spacing where useful,
- design tokens,
- min/max/clamp patterns,
- content-driven height,
- explicit breakpoint behavior,
- relational constraints.

## Avoid

- unnecessary fixed heights,
- one pixel spec applied to all viewports,
- arbitrary per-component values,
- scaling entire interfaces uniformly as a substitute for responsive layout.

## Reference Screenshot Separation

Close screenshot fidelity is required only at an approved Reference Viewport unless multiple reference screenshots were explicitly approved.

At other viewports, do not force the same pixel geometry. Verify responsive hierarchy, proportions, density, wrapping, overflow, and usability instead.
