---
title: Checkbox Plugin
description: 'The checkbox component and plugin: options, methods, accessibility and styles.'
---

# Checkbox

`@ew-color-picker/checkbox` has two parts:

1. **Plugin** `ewColorPickerCheckbox` — renders a checkbox in the bottom row when `checkboxLabel` is provided;
2. **Component** `Checkbox` — a standalone controlled checkbox built on a native input for semantics and keyboard support, with a custom visual box.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/checkbox` |
| `pluginName` | `ewColorPickerCheckbox` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` → `.ew-color-picker-bottom-row` (renders only when `checkboxLabel` is set) |
| Access instance | `core.plugins.ewColorPickerCheckbox` |

::: warning Additional styles required
```ts
import '@ew-color-picker/style/dist/checkbox.css'
```
Without it the checkbox has no visual.
:::

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `showCheckbox` | `boolean` | `true` | Set to `false` to hide the checkbox |
| `checkboxLabel` | `string` | `undefined` | Label text; nothing renders when empty |
| `checkboxChecked` | `boolean` | `false` | Initial checked state |
| `checkboxDisabled` | `boolean` | `false` | Disable interaction |
| `onCheckboxChange` | `(checked: boolean) => void` | - | Fired after the user toggles the checkbox |

```ts
import ewColorPicker from '@ew-color-picker/core'
import Checkbox from '@ew-color-picker/checkbox'

ewColorPicker.use(Checkbox)

new ewColorPicker({
  el: '#app',
  checkboxLabel: 'Repeating',
  checkboxChecked: true,
  onCheckboxChange: (checked) => console.log(checked),
})
```

## Plugin methods

| Method | Signature | Description |
| --- | --- | --- |
| `createCheckbox` | `(options) => Checkbox` | Create a component instance |
| `updateOptions` | `() => void` | Re-read options and re-render |
| `run` | `() => void` | Render the checkbox when a label is present |
| `destroy` | `() => void` | Remove the checkbox and release events |

## Checkbox component

```ts
import { Checkbox } from '@ew-color-picker/checkbox'
```

### Options

| Option | Type | Default |
| --- | --- | --- |
| `checked` | `boolean` | `false` |
| `label` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` |
| `prefix` | `string` | `'ew-'` |
| `onChange` | `(checked: boolean) => void` | - |

### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `isChecked` | `() => boolean` | Current checked state |
| `setChecked` | `(checked, triggerChange?) => void` | Set state; pass `false` to skip `onChange` |
| `setLabel` | `(label) => void` | Replace the label text |
| `setDisabled` | `(disabled) => void` | Toggle the disabled state |
| `getElement` | `() => HTMLLabelElement` | Root node |
| `destroy` | `() => void` | Unbind events and remove the node |

## Accessibility

The component keeps a native `<input type="checkbox">` visually hidden inside a `<label>`, so clicking the box or the label toggles it and keyboard focus / <kbd>Space</kbd> work as expected. The native input drives the visual box through `:checked` and `:focus-visible`, while disabled states are mirrored with `input.disabled` and the `ew-checkbox--disabled` class.

## DOM

```html
<label class="ew-checkbox ew-checkbox--default ew-checkbox--checked">
  <input class="ew-checkbox__input" type="checkbox" checked />
  <span class="ew-checkbox__box">
    <svg class="ew-color-picker-icon ew-checkbox__check-icon">…</svg>
  </span>
  <span class="ew-checkbox__label">Repeating</span>
</label>
```

## Related

- [Gradient](./gradient.md) · [Select](./select.md) · [Styles & classes](../api/styles.md)
