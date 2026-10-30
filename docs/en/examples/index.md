---
title: Examples
description: 'Twelve typical ew-color-picker scenarios: basic, layout, presets, buttons, events, placement, animation, disabled, modes, API, numeric inputs, multiple instances.'
---

# Examples

Twelve minimal recipes. Runnable HTML files live in the repository's `examples/` directory.

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

## Related

- [Live demo](./demo.md)
- [Options](../api/options.md) · [Methods](../api/methods.md) · [Events](../api/events.md)
