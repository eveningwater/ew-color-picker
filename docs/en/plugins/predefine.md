---
title: Predefine Plugin
description: Configure quick swatches with predefineColor, disable individual items, and update them at runtime.
---

# Predefine

`ewColorPickerPredefine` renders a row of quick color swatches inside the panel.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/predefine` |
| `pluginName` | `ewColorPickerPredefine` |
| `applyOrder` | not declared |
| Mount point | `panelContainer` |
| Instance | `core.plugins.ewColorPickerPredefine` |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `predefineColor` | `(string \| { color: string; disabled?: boolean })[]` | `[]` | Swatches; empty renders nothing |
| `changeColor` | `(rgba: string) => void` | — | Swatch applied |
| `disabled` | `boolean` | `false` | Block all clicks |
| `ewColorPickerPredefine` | `object` | — | Nested config merged in |

```ts
predefineColor: [
  '#ef4444',
  { color: '#22c55e', disabled: true },
  '#3b82f6',
]
```

Strict color validation: invalid entries are filtered out before rendering and re-checked on click.

## Methods

| Method / property | Signature | Description |
| --- | --- | --- |
| `updatePredefineColors` | `(colors) => void` | Replace and re-render |
| `setDisabled` | `(index: number, disabled: boolean) => void` | Toggle one swatch |
| `onPredefineColorClick` | `(event, color) => void` | Click handler (100ms debounce) |
| `predefineItems` | `HTMLElement[]` | Swatch DOM |
| `container` | `HTMLElement \| null` | Container |

## Click behaviour

Checks the disabled class and global `disabled`, highlights the active swatch, validates and converts the color, syncs `core.hsvaColor`, calls `core.setColor(rgba)`, then `options.changeColor?.(rgba)`.

## Events

```ts
picker.on('change', (color) => console.log(color))
```

## DOM

```html
<div class="ew-color-picker-predefine-container">
  <div class="ew-color-picker-predefine-color">
    <div class="ew-color-picker-predefine-color-item" style="background:#ef4444"></div>
  </div>
  <div class="ew-color-picker-predefine-color ew-color-picker-predefine-color-disabled">…</div>
  <div class="ew-color-picker-predefine-color ew-color-picker-predefine-color-active">…</div>
</div>
```

## Example

```ts
new ewColorPicker({
  el: '#app',
  defaultColor: '#3b82f6',
  predefineColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'],
  changeColor: (rgba) => console.log(rgba),
})
```

## Related

- [Options · predefineColor](../api/options.md#predefinecolor) · [Styles](../api/styles.md)
