---
title: Plugin Overview
description: 'The ew-color-picker plugin system: 11 built-in plugins, registration order, mount points and collaboration.'
---

# Plugin Overview

The core (`@ew-color-picker/core`) only does three things: keep color state, dispatch events, and manage mount points. **All visible UI is rendered by plugins**, so you can compose very different pickers.

## How a plugin works

| Member | Type | Required |
| --- | --- | --- |
| `static pluginName` | `string` | Yes |
| `static applyOrder` | `ApplyOrder` | No (`Pre` first, unset in registration order, `Post` last) |
| `constructor(core)` | — | Yes |
| `destroy()` | `() => void` | No |

```ts
import ewColorPicker from '@ew-color-picker/core'
import MyPlugin from './my-plugin'

ewColorPicker.use(MyPlugin)
new ewColorPicker({ el: '#app' })
```

`use()` is idempotent. Plugin instances live at `core.plugins[pluginName]`.

## Execution order (`applyOrder`)

`applyOrder` controls the order in which plugin constructors run. Values come from the `ApplyOrder` enum exported by `@ew-color-picker/utils` (a regular runtime enum):

| Value | Weight | Meaning |
| --- | --- | --- |
| `ApplyOrder.Pre` | `-1` | Constructed first — create shared nodes or state other plugins rely on |
| unset | `0` | Registration order, between `Pre` and `Post` |
| `ApplyOrder.Post` | `1` | Constructed last — read DOM rendered by other plugins |

Plugins with the same weight run in `use()` registration order. The aggregator registers Console → Box → Panel → …, and most built-in UI plugins use `Post`.

```ts
import { ApplyOrder } from '@ew-color-picker/utils'

export default class MyPlugin {
  static pluginName = 'myPlugin'
  static applyOrder = ApplyOrder.Post
  // ...
}
```

::: tip
`applyOrder` only affects **construction order**, not the order of event callbacks. Plugins that only listen to `change` can omit it.
:::

## Built-in plugins

Registration order in `@ew-color-picker/ew-color-picker`:

| # | Plugin | `pluginName` | Package | Role |
| --- | --- | --- | --- | --- |
| 1 | Console | `ewColorPickerConsole` | utils | Prints the version banner once |
| 2 | Box | `ewColorPickerBox` | box | Trigger swatch |
| 3 | Panel | `ewColorPickerPanel` | panel | Saturation/value panel |
| 4 | Hue | `ewColorPickerHue` | hue | Hue slider |
| 5 | Alpha | `ewColorPickerAlpha` | alpha | Alpha slider |
| 6 | Input | `ewColorPickerInput` | input | Text color input |
| 7 | InputNumber | `ewColorPickerInputNumber` | input-number | Numeric inputs |
| 8 | Button | `ewColorPickerButton` | button | Clear / Sure |
| 9 | Predefine | `ewColorPickerPredefine` | predefine | Swatches |
| 10 | ColorMode | `ewColorPickerColorMode` | color-mode | Hex / RGB / HSL |
| 11 | — | — | style | CSS artifacts (not a plugin) |

## Mount points

| Mount point | Access | Contents |
| --- | --- | --- |
| `root` | `core.getMountPoint('root')` | `.ew-color-picker`, hosts Box |
| `panelContainer` | `core.getMountPoint('panelContainer')` | `.ew-color-picker-panel-container`, hosts everything else |

The panel container carries `ew-color-picker-panel-container-hidden` while closed.

## Collaboration

```text
User action (Box / Panel / Hue / Alpha / Input / Predefine / Button)
        │
        ▼
   core.setColor(color)   ← the only color entry
        │
        ├─► emit('change', color)
        │     ├─ Panel / Hue / Alpha / Input / ColorMode / Box sync
        │
        └─► options.changeColor(color)
```

Rules:

- Only `core.setColor()` changes color.
- Subscribe to `change`; don't poll `currentColor`.
- Read other plugin state via `core.plugins.xxx`.
- Use `core.updateOptions()` to refresh configuration.

## Trimming the UI

All plugins are registered by the bundle; disable via options instead of unregistering:

```ts
new ewColorPicker({
  el: '#app',
  hasPanel: false,
  hue: false,
  alpha: false,
  hasInput: false,
  hasClear: false,
  hasSure: false,
  showColorMode: false,
  size: 'large',
})
```

::: tip Smaller bundle
Register plugins manually — see [Installation](../guide/installation.md#per-package-imports).
:::

## Next steps

- [Box](./box.md) · [Panel](./panel.md) · [Hue](./hue.md) · [Alpha](./alpha.md)
- [Input](./input.md) · [InputNumber](./input-number.md) · [Button](./button.md)
- [Predefine](./predefine.md) · [ColorMode](./color-mode.md) · [Console](./console.md)
- [Writing a plugin](../guide/plugin-dev.md)
