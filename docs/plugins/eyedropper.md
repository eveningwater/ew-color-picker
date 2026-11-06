---
title: Eyedropper Plugin
description: 'Pick colors from anywhere on screen with the native EyeDropper API: capability detection, callback and graceful cancellation.'
---

# Eyedropper

`ewColorPickerEyedropper` renders a screen color picker button in its own toolbar row above the value input. It uses the browser-native [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API), and writes the picked color straight back through `core.setColor()`.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/eyedropper` |
| `pluginName` | `ewColorPickerEyedropper` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` → `.ew-color-picker-extra-row` (toolbar row above the input row) |
| Instance | `core.plugins.ewColorPickerEyedropper` |

## Browser support

The EyeDropper API is available in Chromium-based browsers (Chrome / Edge). When `'EyeDropper' in window` is false the plugin renders **nothing**, so it is safe to register everywhere.

Some browsers also require `open()` to run inside a user gesture (a click), and cross-origin iframes may reject the request.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `showEyedropper` | `boolean` | `true` | Set `false` to hide the button; unsupported browsers never render it |
| `eyedropperText` | `string` | `undefined` | Accessible label and tooltip (falls back to `'取色'`); when set it is also rendered as visible text |
| `onEyedropperPick` | `(color: string) => void` | — | Called with the picked `sRGBHex` value |

```ts
import ewColorPicker from '@ew-color-picker/core'
import Eyedropper from '@ew-color-picker/eyedropper'

ewColorPicker.use(Eyedropper)

new ewColorPicker({
  el: '#app',
  eyedropperText: 'Pick from screen',
  onEyedropperPick: (color) => console.log('picked', color),
})
```

## Click behaviour

1. Call `new EyeDropper().open()` inside the click gesture;
2. On success, `core.setColor(result.sRGBHex)` and then `options.onEyedropperPick?.(result.sRGBHex)`;
3. On `AbortError` (user pressed <kbd>Esc</kbd>) nothing happens — no callback, no warning;
4. On any other error a `console.warn` is printed and the current color is unchanged.

`core.setColor()` emits `change`, so Panel / Hue / Alpha / Input / ColorMode / Box all update automatically.

## DOM

```html
<div class="ew-color-picker-eyedropper-group">
  <button type="button" class="ew-color-picker-eyedropper-btn" title="取色" aria-label="取色">
    <svg class="ew-color-picker-icon" viewBox="0 0 24 24">…</svg>
    <!-- rendered only when eyedropperText is set -->
    <span class="ew-color-picker-eyedropper-text">取色</span>
  </button>
</div>
```

The button lives in its own group inside `.ew-color-picker-extra-row`, rather than the Button plugin's `.ew-color-picker-drop-btn-group`, because that group is cleared on every render. The empty toolbar row is removed automatically when no plugin needs it.

## Methods

| Method / property | Signature | Description |
| --- | --- | --- |
| `run` | `() => void` | Capability check, remove the old node, render and bind |
| `updateOptions` | `() => void` | Re-read options and re-render |
| `destroy` | `() => void` | Unbind and remove the node; pending picks are ignored |
| `container` / `button` | `HTMLElement \| null` | Current DOM references |

## Related

- [Button](./button.md) · [Plugin overview](./) · [Options · callbacks](../api/callbacks.md)
