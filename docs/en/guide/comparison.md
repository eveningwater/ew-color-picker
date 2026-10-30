---
title: Comparison & Positioning
description: 'How ew-color-picker compares with Pickr, iro.js, Coloris, react-colorful and react-color, and where it fits.'
---

# Comparison & Positioning

Choosing a color picker is rarely about feature count — it is about whether the component fits your UI system. This page states the positioning first, then compares the mainstream options, and finally explains when each one is the right call.

## Positioning in one sentence

ew-color-picker is not a ready-made skin. It is an **assemblable color picker foundation**: the core only keeps color state and events, and every UI element is an independent plugin. Teams keep what they need, replace what they do not, or write their own UI on the same plugin contract.

Good fit: admin dashboards, low-code platforms, component libraries, and products that must merge deeply with an existing design system.
Poor fit: a one-off color input where customization is unnecessary — the native `input[type=color]` or Coloris is simpler.

## Side-by-side comparison

The numbers below come from the npm registry (`unpackedSize` and last publish date, collected on 2026-10-30) and are only a sense of package size. Feature columns follow each project's public documentation.

| Option | Shape | Framework lock-in | Extension model | Unpacked size | Last publish |
| --- | --- | --- | --- | --- | --- |
| **ew-color-picker** | Aggregate package + 13 plugin packages (plus the `ew-color-picker` compat entry) | None (plain DOM) | Plugin registration / custom plugins | Aggregate 84.6 KB + styles 36.1 KB (120.7 KB total); `core.min` 11.9 KB (gzip 3.9 KB) | 2026-10 |
| [Pickr](https://github.com/Simonwep/pickr) | Single package (UMD/ESM) | None | Themes (classic/monolith/nano) + options | 280.3 KB | 2026-09 |
| [iro.js](https://github.com/jaames/iro.js) | Single package | None | Options + component composition | 231.4 KB | 2021-07 |
| [Coloris](https://github.com/melloware/coloris) | Single package + CSS | None | CSS variables + options | 152.2 KB | 2026-10 |
| [react-colorful](https://github.com/omgovich/react-colorful) | React components | React | Compose components | 398.4 KB | 2026-09 |
| [react-color](https://github.com/casesandberg/react-color) | React component set | React | Pick a picker component | 436.3 KB | 2020-10 |
| [vue-color](https://github.com/linx4200/vue-color) | Vue component set | Vue | Pick a picker component | 391.5 KB | 2025-10 |
| [@uiw/react-color](https://github.com/uiwjs/react-color) | React component set | React | Import per component | 210.8 KB | 2026-05 |
| Native `input[type=color]` | Built into browsers | None | None (styling is not controllable) | 0 | with browser updates |
| Spectrum | jQuery plugin | jQuery | Options | 1804.2 KB | 2020-05 |

One caveat: unpacked size is not runtime cost. The aggregate package ships two artifacts (UMD.min and ESM) plus `.d.ts` declarations. The smallest runtime you can ship is `index.min.js` at **81.8 KB (gzip 19.4 KB)**, or **11.9 KB (gzip 3.9 KB)** when using the core alone. Add the two style sheets (about 3.7 KB gzipped) for the full out-of-the-box footprint — roughly 29 KB of tarballs in total.

## Where ew-color-picker stands out

### 1. Structural replaceability, not just theming

Most alternatives let you restyle the widget via themes, CSS variables or options while the structure stays fixed. ew-color-picker splits the trigger box, saturation panel, hue slider, alpha slider, text input, number input, buttons, predefined swatches and mode switcher into separate plugins. You decide which ones are registered, in what order, and whether your own plugin replaces them.

```ts
import ewColorPicker from '@ew-color-picker/core'
import Panel from '@ew-color-picker/panel'
import Hue from '@ew-color-picker/hue'
// register only what you need
ewColorPicker.use(Panel).use(Hue)
```

### 2. Framework agnostic

The core touches plain DOM and events only — no React, Vue or jQuery runtime. The same plugin contract can back React, Vue, Angular or low-code wrappers without maintaining a separate implementation per framework.

### 3. Single source of truth with per-instance events

Every plugin changes color through `core.setColor()`, and the `change` event keeps the rest in sync, so there is never a second copy of the color state. Each instance owns its event bus, DOM and plugin instances, so multi-instance pages do not leak into each other.

### 4. Complete out of the box

The aggregate package (or the `ew-color-picker` compat entry) ships Hex / RGB / HSL mode switching, alpha adjustment, predefined swatches, clear/confirm buttons and input validation — things you would otherwise assemble by hand on top of react-colorful.

### 5. TypeScript types everywhere

Every package emits `.d.ts`; plugins extend the core options via `declare module`, so custom plugins keep type inference too.

### 6. Documentation as part of the product

Bilingual documentation, per-API references, one page per plugin, plus `llms.txt` / `llms-full.txt` so both people and AI can look things up.

## Limitations to be honest about

- **Small ecosystem**: download counts, community tutorials and issue history cannot match Pickr or react-color; unusual problems mean reading the source.
- **No official framework wrappers**: React / Vue / Angular / Solid integration is covered in [Framework Integration](./framework-integration); controlled components and SSR need a thin wrapper of your own (around 20 lines).
- **No gradients, multi-color editing or eyedropper**: those use cases need iro.js or a dedicated gradient picker.
- **The plugin model only matters when you customize**: installing the aggregate package or `npm i ew-color-picker` works out of the box; you only need to understand core + plugins when replacing part of the UI or wiring your own plugins.
- **Shrinking further means installing sub-packages**: the aggregate is 84.6 KB plus 36.1 KB of styles, already in Coloris territory; if you use a single piece, install plugin packages and trim down to the 11.9 KB core.

## Choosing the right tool

| Your situation | Recommendation |
| --- | --- |
| A plain color input; styling does not matter | Native `input[type=color]` |
| Lightweight, dependency-free, themeable without structural changes | Coloris or Pickr |
| React project that only needs a panel or slider | react-colorful |
| Vue project that wants ready-made components | vue-color or @uiw/react-color |
| Gradients, color-space work, games or visualizations | iro.js |
| Admin / low-code / component library needing deep design-system integration, partial UI replacement and instance isolation | **ew-color-picker** |
| Embedding color selection into your own plugin system or runtime | **ew-color-picker** (11.9 KB core, keep the core and write your own plugins) |

## See also

- [Introduction](./) — design principles and package layout
- [Core Concepts](./concepts) — mount points, plugin order and events
- [Writing a Plugin](./plugin-dev) — replace the built-in UI with your own
