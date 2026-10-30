---
title: Alpha Plugin
description: The Alpha plugin adds a 0–1 opacity slider, outputs rgba colors, and supports horizontal/vertical orientation.
---

# Alpha

`ewColorPickerAlpha` adds an alpha slider (0–1). Registering it changes how the core normalizes colors:

- **Registered**: hex `defaultColor` becomes `rgba()`
- **Not registered**: `rgba()` `defaultColor` becomes hex

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/alpha` |
| `pluginName` | `ewColorPickerAlpha` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` |
| Instance | `core.plugins.ewColorPickerAlpha` |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `alpha` | `boolean` | `true` | `false` hides the slider |
| `alphaDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | Orientation |
| `disabled` | `boolean` | `false` | Blocks interaction |

## Methods

| Method / property | Signature | Description |
| --- | --- | --- |
| `enableAlpha` | `(enable = true) => void` | Show/hide |
| `updateAlpha` | `(alpha: number) => void` | Apply alpha (0–1) via `setColor()` |
| `updateAlphaThumbPosition` | `(alpha: number) => void` | Move thumb only |
| `hasAlpha` | `boolean` getter/setter | Re-renders on change |
| `alphaBar` / `alphaThumb` | `HTMLElement \| null` | DOM |
| `isHorizontal` | `boolean` | Orientation flag |

`updateAlpha` also syncs ColorMode inputs when the current mode is not `hex`.

## Behaviour

| Action | Result |
| --- | --- |
| Click | Alpha computed from position (horizontal: right → left increases) |
| Drag | Throttled 16ms |
| External change | Thumb syncs |

Return early when no current color exists.

## Events

```ts
picker.on('change', (color) => console.log(color)) // rgba(...)
```

## DOM

```html
<div class="ew-color-picker-slider ew-alpha ew-color-picker-is-vertical">
  <div class="ew-color-picker-alpha-slider-wrapper">
    <div class="ew-color-picker-alpha-slider-bg"></div>
    <div class="ew-color-picker-alpha-slider-bar"></div>
  </div>
  <div class="ew-color-picker-alpha-slider-thumb"></div>
</div>
```

## Example

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: 'rgba(99, 102, 241, 0.6)',
  alphaDirection: 'horizontal',
})

picker.plugins.ewColorPickerAlpha.updateAlpha(0.5)
```

## Related

- [Hue](./hue.md) · [ColorMode](./color-mode.md)
