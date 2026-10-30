---
title: InputNumber Plugin
description: 'The InputNumber plugin and standalone component: options, methods, sizes and events for numeric color inputs.'
---

# InputNumber

`@ew-color-picker/input-number` ships two pieces:

1. **Plugin** `ewColorPickerInputNumber` — creates a numeric input in the bottom row;
2. **Component** `InputNumber` — a standalone controlled number input used by ColorMode for RGB/HSL channels.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/input-number` |
| `pluginName` | `ewColorPickerInputNumber` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` → `.ew-color-picker-bottom-row` |
| Instance | `core.plugins.ewColorPickerInputNumber` |

::: warning Extra stylesheet required
```ts
import '@ew-color-picker/style/dist/input-number.css'
```
Without it numeric inputs are unstyled.
:::

## Plugin options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Disable all managed inputs |

## Plugin methods

| Method | Signature | Description |
| --- | --- | --- |
| `createInputNumber` | `(options) => InputNumber` | Create a component |
| `updateOptions` | `() => void` | Reapply `disabled` |
| `run` | `() => void` | Create the default instance |
| `destroy` | `() => void` | Destroy all instances |

## InputNumber component

```ts
import { InputNumber } from '@ew-color-picker/input-number'
```

### Options

| Option | Type | Default |
| --- | --- | --- |
| `value` | `number` | `0` |
| `min` | `number` | `-Infinity` |
| `max` | `number` | `Infinity` |
| `step` | `number` | `1` |
| `precision` | `number` | `0` |
| `disabled` | `boolean` | `false` |
| `placeholder` | `string` | `''` |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` |
| `onChange` | `(value) => void` | — |
| `onBlur` | `(value) => void` | — |
| `onFocus` | `(event) => void` | — |

`onChange` is debounced 300ms and is **not** called during construction.

### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `getValue` | `() => number` | Read value |
| `setValue` | `(value: number) => void` | Set clamped value |
| `setDisabled` | `(disabled: boolean) => void` | Toggle disabled |
| `getElement` | `() => HTMLElement` | Root element |
| `destroy` | `() => void` | Cleanup |

### Standalone example

```ts
import { InputNumber } from '@ew-color-picker/input-number'
import '@ew-color-picker/style/dist/input-number.css'

const num = new InputNumber({
  value: 50,
  min: 0,
  max: 100,
  placeholder: 'Saturation',
  onChange: (v) => console.log(v),
})

document.body.appendChild(num.getElement())
```

## DOM

```html
<div class="ew-input-number ew-input-number--default">
  <input class="ew-input-number__input" type="text" inputmode="decimal" />
  <div class="ew-input-number__buttons">
    <button class="ew-input-number__button ew-input-number__button--up"></button>
    <button class="ew-input-number__button ew-input-number__button--down"></button>
  </div>
</div>
```

## Related

- [ColorMode](./color-mode.md) · [Input](./input.md)
