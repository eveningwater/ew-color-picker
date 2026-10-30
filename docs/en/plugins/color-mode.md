---
title: ColorMode Plugin
description: Switch between Hex / RGB / HSL, rebuild channel inputs, and listen to the mode-change event.
---

# ColorMode

`ewColorPickerColorMode` provides **Hex / RGB / HSL** input modes. Switching rebuilds the channel input group.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/color-mode` |
| `pluginName` | `ewColorPickerColorMode` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` |
| Instance | `core.plugins.ewColorPickerColorMode` |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultMode` | `'hex' \| 'rgb' \| 'hsl'` | `'rgb'` with Alpha, else `'hex'` | Initial mode |
| `showColorMode` | `boolean` | `true` | Hide the switcher |
| `ewColorPickerColorMode` | `boolean \| object` | `true` | `false` disables; object merges |
| `changeMode` | `(mode, picker) => void` | — | Mode change callback |

## Methods

| Method / property | Signature | Description |
| --- | --- | --- |
| `getCurrentMode` | `() => 'hex' \| 'rgb' \| 'hsl'` | Read mode |
| `setMode` | `(mode) => void` | Switch (100ms debounce) |
| `switchToNextMode` | `() => void` | hex → rgb → hsl → hex |
| `switchToPreviousMode` | `() => void` | Reverse |
| `onModeChange` | `(mode) => void` | Main handler |
| `updateOptions` | `() => void` | Re-read config and redraw |
| `updateInputStructure` | `() => void` | Rebuild inputs |
| `updateInputValues` | `(color: string) => void` | Sync inputs |
| `updateColorFromRgbInputs` / `updateColorFromHslInputs` | `() => void` | Compose color (debounced) |
| `restoreDefaultInput` | `() => void` | Restore Input plugin field |
| `currentMode` | `'hex' \| 'rgb' \| 'hsl'` | Current mode |

## Switch flow

```text
Arrow click
  → debounce(100ms) onModeChange(mode)
  → update label (HEX / RGB / HSL)
  → updateInputStructure()
  → non-hex: updateInputValues(current color)
  → options.changeMode?.(mode, picker)
  → trigger('mode-change', mode)
```

Hex mode never calls `setColor` again, preventing hex text from being overwritten by `rgba()`.

Arrows respect `options.disabled`.

## Events & callbacks

```ts
picker.on('mode-change', (mode) => console.log(mode))
```

## DOM

```html
<div class="ew-color-picker-mode-container">
  <button class="ew-color-picker-mode-up-btn" type="button"></button>
  <div class="ew-color-picker-mode-text">HEX</div>
  <button class="ew-color-picker-mode-down-btn" type="button"></button>
</div>

<div class="ew-color-picker-inputs-group">
  <div class="ew-color-picker-inputs-col">
    <label class="ew-color-picker-input-label">R</label>
    <div class="ew-input-number">…</div>
  </div>
</div>
```

## Example

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#ec4899',
  defaultMode: 'hex',
  changeMode: (mode, instance) => console.log(mode, instance.getColor()),
})

picker.plugins.ewColorPickerColorMode.setMode('hsl')
```

## Related

- [Input](./input.md) · [InputNumber](./input-number.md) · [Events](/en/api/events#mode-change)
