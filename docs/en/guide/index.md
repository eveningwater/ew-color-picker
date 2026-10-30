---
title: Introduction
description: EW Color Picker is an event-driven, plugin-based color picker. Learn what the core does and how the 13 packages fit together.
---

# Introduction

EW Color Picker is a modern color picker built around two ideas:

1. **Event-driven** — every action becomes an event (`change`, `sure`, `clear`, `toggle`, `mode-change`, `options-update`, `destroy`).
2. **Plugin-based** — the core owns color state and mount points; every piece of UI is a plugin.

```text
Core (@ew-color-picker/core)
├─ color state: currentColor + hsvaColor
├─ event bus: on / once / off / trigger / emit
├─ mount points: root + panelContainer
└─ plugins: can be registered, replaced, or extended
```

## Why a plugin architecture?

| Benefit | What it means |
| --- | --- |
| Small bundles | Install only the plugins you use |
| Replaceable UI | Swap the panel, input, or buttons for your own implementation |
| Testable | Each plugin can be tested in isolation |
| Extensible | Add features without touching the core |

## The 13 packages

| Package | Responsibility |
| --- | --- |
| `@ew-color-picker/core` | Color state, event bus, mount points, plugin registry |
| `@ew-color-picker/utils` | DOM/color/animation helpers, `EventEmitter`, `Console` plugin |
| `@ew-color-picker/style` | CSS (`index.css` + `input-number.css`) |
| `@ew-color-picker/ew-color-picker` | All-in-one bundle: registers all plugins and re-exports the core |
| `@ew-color-picker/box` | Trigger swatch that opens/closes the panel |
| `@ew-color-picker/panel` | Saturation/value 2D panel |
| `@ew-color-picker/hue` | Hue slider (0–360°) |
| `@ew-color-picker/alpha` | Alpha slider (0–1) |
| `@ew-color-picker/input` | Text color input with validation |
| `@ew-color-picker/input-number` | Numeric input component + plugin |
| `@ew-color-picker/button` | Clear / Sure buttons |
| `@ew-color-picker/predefine` | Predefined color swatches |
| `@ew-color-picker/color-mode` | Hex / RGB / HSL mode switching |

## Data flow

```text
User interaction (Box / Panel / Hue / Alpha / Input / Predefine / Button)
        │
        ▼
   core.setColor(color)        ← the only way to change color
        │
        ├─► emit('change', color)
        │     ├─ Panel   sync background + cursor
        │     ├─ Hue     sync thumb
        │     ├─ Alpha   sync thumb
        │     ├─ Input   sync text
        │     ├─ ColorMode sync R/G/B or H/S/L inputs
        │     └─ Box     sync background + icon color
        │
        └─► options.changeColor(color)
```

## Design principles

| Principle | Detail |
| --- | --- |
| Single source of truth | Only `core.setColor()` changes color; plugins never call each other directly |
| Instance isolation | Each instance has its own event bus, DOM and plugin instances |
| No global pollution | CSS is scoped by class names; the only global is the UMD `window.ewColorPicker` |
| Progressive disclosure | Defaults work out of the box; every plugin exposes options and methods when you need them |

## Next steps

- [Installation](./installation.md)
- [Quick start](./getting-started.md)
- [Core concepts](./concepts.md)
- [Write a plugin](./plugin-dev.md)
