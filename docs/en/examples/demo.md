---
title: Live Demo
description: 'Try EW Color Picker in the browser: pick colors, toggle the panel and watch the realtime event log.'
---

# Live Demo

The page below loads real build artifacts: a full picker, a current-color preview, and an event log.

<iframe
  class="demo-frame"
  src="../../demo.html"
  title="EW Color Picker live demo"
  loading="lazy"
></iframe>

::: tip Where do the assets come from?
`docs/scripts/prepare-demo.mjs` copies these before `dev` / `build`:

- `packages/ew-color-picker/dist/index.min.js`
- `packages/style/dist/index.css`
- `packages/style/dist/input-number.css`

If the iframe is blank, run `pnpm run build:all` in the repository root first.
:::

## What the demo shows

| Area | Description |
| --- | --- |
| Picker | `defaultColor: '#6366f1'`, presets and mode switching enabled |
| Color card | Updates live from `change` |
| Event log | Listens to `change` / `toggle` / `sure` / `clear` / `mode-change` / `destroy` |

## Run locally

```bash
pnpm run build:all
pnpm run docs:dev
```

## Related

- [Examples](./index.md)
- [Quick start](../guide/getting-started.md)
