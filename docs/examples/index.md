---
title: Examples
description: 'Fifteen typical ew-color-picker scenarios: basic, layout, presets, buttons, events, placement, animation, disabled, modes, API, numeric inputs, multiple instances, eyedropper, copy color, select.'
---

# Examples

Fifteen minimal recipes. Runnable HTML files live in the repository's `examples/` directory.

## 1. Basic

```html
<div id="app"></div>
<script src="@ew-color-picker/ew-color-picker/dist/index.min.js"></script>
<script>
  const picker = new ewColorPicker({ el: '#app', defaultColor: '#3b82f6' })
  picker.on('change', (color) => console.log(color))
</script>
```

## 2. Layout & orientation

```ts
new ewColorPicker({
  el: '#app',
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  size: 'large',
})
```

## 3. Predefined colors

```ts
new ewColorPicker({
  el: '#app',
  predefineColor: ['#ef4444', '#22c55e', '#3b82f6', { color: '#0f172a', disabled: true }],
})
```

## 4. Buttons

```ts
new ewColorPicker({
  el: '#app',
  hasClear: false,
  sureText: 'Apply color',
  sure: (color) => console.log(color),
})
```

## 5. Events & callbacks

```ts
const picker = new ewColorPicker({
  el: '#app',
  changeColor: (color) => console.log('callback', color),
})

picker.once('change', (color) => console.log('once', color))
picker.on('sure', (color) => console.log('sure', color))
picker.on('clear', () => console.log('clear'))
picker.on('toggle', (open) => console.log(open))
```

## 6. Auto panel placement

```ts
new ewColorPicker({
  el: '#app',
  autoPanelPosition: true,
  panelPlacement: 'top-end',
})
```

## 7. Toggle animation

```ts
new ewColorPicker({
  el: '#app',
  togglePickerAnimation: 'height',
  pickerAnimationTime: 300,
})
```

Available: `default`, `height`, `opacity`. Maximum duration is 10000ms.

## 8. Disabled & readonly

```ts
new ewColorPicker({ el: '#app', disabled: true })
new ewColorPicker({ el: '#app', readonly: true, defaultColor: '#84cc16' })
```

## 9. Color modes

```ts
new ewColorPicker({
  el: '#app',
  defaultMode: 'rgb',
  showColorMode: true,
  changeMode: (mode) => console.log(mode),
})
```

## 10. Instance API

```ts
const picker = new ewColorPicker({ el: '#app', defaultColor: '#f43f5e' })

console.log(picker.getColor())
console.log(picker.getHsvaColor())
picker.setColor('#22c55e')
picker.updateOptions({ size: 'large' })
picker.showPanel()
picker.hidePanel()
picker.destroy()
```

## 11. Numeric input

```ts
import { InputNumber } from '@ew-color-picker/input-number'
import '@ew-color-picker/style/dist/input-number.css'

const num = new InputNumber({ value: 50, min: 0, max: 100, onChange: console.log })
document.body.appendChild(num.getElement())
```

## 12. Multiple instances

```ts
[...document.querySelectorAll('.picker')].forEach((el) => {
  new ewColorPicker({ el, defaultColor: '#a855f7' })
})
```

::: warning No NodeList
The constructor does not accept a NodeList or array. Instantiate one by one. Events, mount points and inputs are isolated per instance.
:::

## 13. Eyedropper

```ts
new ewColorPicker({
  el: '#app',
  showEyedropper: true,
  onEyedropperPick: (color) => console.log(color),
})
```

The button sits in its own toolbar row above the color value input and only renders in browsers supporting the EyeDropper API. See the [Eyedropper plugin](../plugins/eyedropper.md).

## 14. Copy color

```ts
new ewColorPicker({
  el: '#app',
  showCopyColor: true,
  copyColorText: 'Copy color to clipboard',
  copiedText: 'Copied',
  onCopyColor: (color) => console.log(color),
})
```

The copy button sits in its own toolbar row above the color value input, is filled with the current color, and shows a short success toast. See the [CopyColor plugin](../plugins/copy-color.md).

## 15. Select dropdown

```ts
import '@ew-color-picker/style/dist/select.css'

new ewColorPicker({
  el: '#app',
  selectItems: [
    { label: 'Linear', value: 'linear' },
    { label: 'Radial', value: 'radial' },
  ],
  selectValue: 'linear',
  onSelectChange: (value) => console.log(value),
  onSelectClear: () => console.log('cleared'),
})
```

The dropdown only renders when `selectItems` is not empty. Once a value is selected, a clear icon appears; clicking it resets the selection. See the [Select plugin](../plugins/select.md).

## Related

- [Live demo](./demo.md)
- [Options](../api/options.md) · [Methods](../api/methods.md) · [Events](../api/events.md)
