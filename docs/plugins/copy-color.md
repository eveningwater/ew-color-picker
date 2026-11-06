---
title: CopyColor Plugin
description: 'Copy the current color value to the clipboard with one click: a round color preview button, clipboard fallback and a success toast bubble.'
---

# CopyColor

`ewColorPickerCopyColor` renders a round copy button in its own toolbar row above the value input. Its background shows the current color, and clicking it writes the current color value to the clipboard and shows a short success toast.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/copy-color` |
| `pluginName` | `ewColorPickerCopyColor` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` → `.ew-color-picker-extra-row` (toolbar row above the input row) |
| Instance | `core.plugins.ewColorPickerCopyColor` |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `showCopyColor` | `boolean` | `true` | Set `false` to hide the copy button |
| `copyColorText` | `string` | `'复制颜色到剪贴板'` | Button `title` / `aria-label` |
| `copiedText` | `string` | `'已复制'` | Text of the success toast shown for 1.5s |
| `onCopyColor` | `(color: string) => void` | — | Called with the copied color value |

```ts
import ewColorPicker from '@ew-color-picker/core'
import CopyColor from '@ew-color-picker/copy-color'

ewColorPicker.use(CopyColor)

new ewColorPicker({
  el: '#app',
  copyColorText: 'Copy color',
  copiedText: 'Copied',
  onCopyColor: (color) => console.log('copied', color),
})
```

## Click behaviour

1. Read the current value from `core.getColor()`; an empty value does nothing;
2. Prefer `navigator.clipboard.writeText()`;
3. Fall back to a temporary `<textarea>` + `document.execCommand('copy')` when the Clipboard API is unavailable (for example on plain HTTP pages);
4. On success, show a toast bubble next to the button with `copiedText` for 1.5s, then call `options.onCopyColor?.(color)`;
5. On failure, print a `console.warn` and keep the current color unchanged.

The copied string is the exact value returned by `core.getColor()` — a hex string in hex mode, `rgba()` / `hsla()` when alpha is enabled.

## DOM

```html
<div class="ew-color-picker-copy-group">
  <button type="button" class="ew-color-picker-copy-btn" title="复制颜色到剪贴板" aria-label="复制颜色到剪贴板">
    <svg class="ew-color-picker-icon" viewBox="0 0 24 24">…</svg>
  </button>
  <div class="ew-color-picker-copy-tip" role="status" aria-live="polite">已复制</div>
</div>
```

The button background follows `change`, and the icon switches between dark and light based on the background luminance. The toast is a self-contained element styled by the package itself, so no extra message library or global styles are required.

## Methods

| Method / property | Signature | Description |
| --- | --- | --- |
| `run` | `() => void` | Remove the old node, render and bind |
| `updateOptions` | `() => void` | Re-read options and re-render |
| `destroy` | `() => void` | Unbind events and remove the node |
| `container` / `button` / `tip` | `HTMLElement \| null` | Current DOM references |

## Related

- [Eyedropper](./eyedropper.md) · [Button](./button.md) · [Plugin overview](./) · [Options · callbacks](../api/callbacks.md)
