---
title: Options
description: Complete reference for every ew-color-picker constructor option, default value, type and behaviour.
---

# Options

Every option below can be passed to the constructor. Defaults come from `defaultConfig` in the core.

## Overview

| Group | Options |
| --- | --- |
| Core | `el`, `disabled`, `defaultColor`, `size`, `predefineColor`, `isClickOutside` |
| Layout | `hueDirection`, `alphaDirection`, `autoPanelPosition`, `panelPlacement`, `appendTo` |
| Labels | `clearText`, `sureText` |
| Animation | `togglePickerAnimation`, `pickerAnimationTime` |
| Plugin switches | `hasBox`, `hasPanel`, `hasInput`, `hasClear`, `hasSure`, `hue`, `alpha`, `showButton`, `showColorMode`, `showInputNumber` |
| Plugin config objects | `ewColorPickerPanel`, `ewColorPickerColorMode` |
| Box extras | `boxNoColorIcon`, `boxHasColorIcon`, `readonly`, `className`, `style` |
| Callbacks | `changeColor`, `sure`, `clear`, `togglePicker` |
| Color mode | `defaultMode`, `changeMode` |

## Core options

### el

| Type | Default | Description |
| --- | --- | --- |
| `string \| HTMLElement` | `document.body` | Mount container. A selector or element. Providing it auto-mounts. |

```ts
new ewColorPicker({ el: '#app' })
new ewColorPicker(document.getElementById('app')!)
```

### disabled

| Type | Default | Description |
| --- | --- | --- |
| `boolean` | `false` | Disables the box, panel drag, hue/alpha sliders, inputs and buttons. |

```ts
new ewColorPicker({ el: '#app', disabled: true })
```

### defaultColor

| Type | Default | Description |
| --- | --- | --- |
| `string` | `''` | Initial color; also the color restored by the Clear button. |

- With the Alpha plugin registered, a hex value is converted to `rgba()`.
- Without Alpha, a `rgba()` value is converted to hex.
- Invalid values produce a warning and keep the current color when passed to `updateOptions`.

### size

| Type | Default | Description |
| --- | --- | --- |
| `'mini' \| 'small' \| 'normal' \| 'medium' \| 'large' \| number \| { width, height } \| string` | `'normal'` | Box size |

| Preset | Size | Icon |
| --- | --- | --- |
| `mini` | 20px | 12px |
| `small` | 24px | 14px |
| `normal` | 32px | 16px |
| `medium` | 36px | 18px |
| `large` | 40px | 20px |

Numbers are treated as pixels; objects accept `width`/`height`; CSS strings are used verbatim.

### predefineColor

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `predefineColor` | `(string \| { color: string; disabled?: boolean })[]` | `[]` | Predefined swatches. Empty array renders nothing. Clicking a swatch calls the top-level `changeColor` callback. |

```ts
predefineColor: ['#ef4444', '#22c55e', { color: '#0f172a', disabled: true }]
```

### isClickOutside

| Type | Default | Description |
| --- | --- | --- |
| `boolean` | `true` | Clicking outside the picker closes the panel. |

## Layout options

### hueDirection / alphaDirection

| Type | Default |
| --- | --- |
| `'horizontal' \| 'vertical'` | `'vertical'` |

Controls slider orientation. When both are horizontal, the panel width becomes 320px.

### autoPanelPosition

| Type | Default | Description |
| --- | --- | --- |
| `boolean` | `false` | Position the panel relative to the box automatically. Requires the Box plugin with `hasBox: true`. |

### appendTo

| Type | Default | Description |
| --- | --- | --- |
| `string \| HTMLElement` | `undefined` | Mount the panel container into an external container (e.g. `document.body`) so it is not clipped by `overflow` of dialogs or scroll containers. The panel switches to viewport-relative (`position: fixed`) placement, still follows `panelPlacement`, and re-positions on scroll or resize. |

```ts
new ewColorPicker({
  el: '#picker',
  appendTo: document.body,
  panelPlacement: 'bottom',
})
```

### panelPlacement

| Type | Default | Values |
| --- | --- | --- |
| `string` | `'bottom'` | `top-start` `top` `top-end` `left-start` `left` `left-end` `right-start` `right` `right-end` `bottom-start` `bottom` `bottom-end` |

Gap is 5px; out-of-viewport positions are adjusted automatically.

## Labels

| Option | Type | Default |
| --- | --- | --- |
| `clearText` | `string` | `'清空'` |
| `sureText` | `string` | `'确定'` |

Change them for i18n:

```ts
new ewColorPicker({ clearText: 'Reset', sureText: 'Apply' })
```

## Animation

### togglePickerAnimation

| Type | Default | Values |
| --- | --- | --- |
| `string` | `'default'` | `'default'`, `'height'`, `'opacity'` |

Only `height` and `opacity` are animated; `default` toggles instantly.

### pickerAnimationTime

| Type | Default | Range |
| --- | --- | --- |
| `number` | `200` | 0–10000 (ms) |

Values above 10000 are clamped.

## Plugin switches

| Option | Type | Default | Effect |
| --- | --- | --- | --- |
| `hasBox` | `boolean` | `true` | Hide the trigger swatch |
| `hasPanel` | `boolean` | `true` | Hide the 2D panel |
| `hasInput` | `boolean` | `true` | Hide the text input |
| `hasClear` | `boolean` | `true` | Hide the Clear button |
| `hasSure` | `boolean` | `true` | Hide the Sure button |
| `hue` | `boolean` | `true` | Hide the hue slider |
| `alpha` | `boolean` | `true` | Hide the alpha slider |
| `showButton` | `boolean` | `true` | Hide clear + sure buttons at once |
| `showColorMode` | `boolean` | `true` | Hide the Hex/RGB/HSL switcher |
| `showInputNumber` | `boolean` | `true` | Skip the InputNumber plugin's own numeric input; ColorMode channel inputs are unaffected |

```ts
new ewColorPicker({
  el: '#app',
  hasPanel: false,
  hue: false,
  alpha: false,
  hasInput: false,
  hasClear: false,
  hasSure: false,
})
```

## Plugin config objects

| Option | Type | Notes |
| --- | --- | --- |
| `ewColorPickerPanel` | `boolean` | `false` disables the panel (same as `hasPanel: false`) |
| `ewColorPickerColorMode` | `boolean \| object` | `false` disables mode switching; object merges color-mode options |

## Box extras

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `boxNoColorIcon` | `string` | `''` | Custom HTML for the "no color" icon |
| `boxHasColorIcon` | `string` | `''` | Custom HTML for the "has color" icon |
| `readonly` | `boolean` | `false` | Prevents clicking the box |
| `className` | `string` | `''` | Extra class on `.ew-color-picker-box` |
| `style` | `string \| Record<string,string>` | `''` | Inline styles for the box |

## Color mode

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultMode` | `'hex' \| 'rgb' \| 'hsl'` | `'rgb'` with Alpha, otherwise `'hex'` | Initial mode |
| `changeMode` | `(mode, picker) => void` | — | Mode change callback |

## Callbacks

| Callback | Signature | When |
| --- | --- | --- |
| `changeColor` | `(color: string) => void` | Color changed |
| `sure` | `(color: string, picker) => void` | Sure button clicked |
| `clear` | `(picker) => void` | Clear button clicked |
| `togglePicker` | `(isOpen: boolean) => void` | Panel toggled |

## Complete example

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: 'rgba(99, 102, 241, 0.8)',
  size: 'large',
  predefineColor: ['#ef4444', '#22c55e', '#3b82f6', { color: '#0f172a', disabled: true }],
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  clearText: 'Reset',
  sureText: 'Apply',
  togglePickerAnimation: 'height',
  pickerAnimationTime: 250,
  autoPanelPosition: true,
  panelPlacement: 'bottom-start',
  defaultMode: 'rgb',
  changeColor: (color) => console.log(color),
  sure: (color) => console.log('sure', color),
})
```

## Next steps

- [Methods](../api/methods.md)
- [Events](../api/events.md)
- [Callbacks](../api/callbacks.md)
