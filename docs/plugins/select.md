---
title: Select Plugin
description: 'The Select plugin and standalone dropdown component: options, methods, keyboard support and styling.'
---

# Select

`@ew-color-picker/select` ships two pieces:

1. **Plugin** `ewColorPickerSelect` — renders a dropdown in the bottom row when `selectItems` is provided;
2. **Component** `Select` — a standalone controlled dropdown that other plugins can reuse (for example a gradient editor).

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/select` |
| `pluginName` | `ewColorPickerSelect` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` → `.ew-color-picker-bottom-row` (only when items are provided) |
| Instance | `core.plugins.ewColorPickerSelect` |

::: warning Extra stylesheet required
```ts
import '@ew-color-picker/style/dist/select.css'
```
Without it the dropdown is unstyled.
:::

## Plugin options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `showSelect` | `boolean` | `true` | Set `false` to hide the dropdown |
| `selectItems` | `SelectOption[]` | `[]` | Options to render; an empty list renders nothing |
| `selectValue` | `string \| number` | `undefined` | Initially selected value |
| `selectPlaceholder` | `string` | `undefined` | Text shown when no value is selected |
| `selectClearable` | `boolean` | `true` | Show a clear icon once a value is selected |
| `onSelectChange` | `(value, option) => void` | — | Called after the user picks an option |
| `onSelectClear` | `() => void` | — | Called after the user clears the selection |

```ts
import ewColorPicker from '@ew-color-picker/core'
import Select from '@ew-color-picker/select'

ewColorPicker.use(Select)

new ewColorPicker({
  el: '#app',
  selectItems: [
    { label: 'Linear', value: 'linear' },
    { label: 'Radial', value: 'radial' },
  ],
  onSelectChange: (value) => console.log(value),
  onSelectClear: () => console.log('cleared'),
})
```

## Plugin methods

| Method | Signature | Description |
| --- | --- | --- |
| `createSelect` | `(options) => Select` | Create a component instance |
| `updateOptions` | `() => void` | Re-read options and re-render |
| `run` | `() => void` | Render the dropdown when items are configured |
| `destroy` | `() => void` | Remove the dropdown and release events |

## Select component

```ts
import { Select } from '@ew-color-picker/select'
```

### Options

| Option | Type | Default |
| --- | --- | --- |
| `value` | `string \| number` | `undefined` |
| `items` | `SelectOption[]` | `[]` |
| `placeholder` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` |
| `prefix` | `string` | `'ew-'` |
| `clearable` | `boolean` | `true` |
| `onChange` | `(value, option) => void` | — |
| `onClear` | `() => void` | — |
| `onOpen` / `onClose` | `() => void` | — |

`SelectOption` is `{ label: string; value: string | number; disabled?: boolean }`.

The clear icon only appears when `clearable` is `true` and a value is selected. Clicking it resets the value to `undefined`, restores the placeholder text, closes the dropdown and fires `onClear`. Disabled selects never show the clear icon.

### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `getValue` | `() => string \| number \| undefined` | Current value |
| `setValue` | `(value, triggerChange?) => void` | Set the value; pass `false` to skip `onChange` |
| `clear` | `(triggerChange?) => void` | Reset to empty; pass `false` to skip `onClear` |
| `setItems` | `(items) => void` | Replace the option list |
| `setDisabled` | `(disabled) => void` | Toggle the disabled state |
| `open` / `close` | `() => void` | Control the dropdown |
| `isDropdownOpen` | `() => boolean` | Whether the dropdown is open |
| `getElement` | `() => HTMLElement` | Root node |
| `destroy` | `() => void` | Unbind events and remove the node |

## Keyboard and accessibility

| Key | Action |
| --- | --- |
| <kbd>ArrowDown</kbd> / <kbd>ArrowUp</kbd> | Open the dropdown or move the active option |
| <kbd>Enter</kbd> | Select the active option |
| <kbd>Escape</kbd> | Close the dropdown |
| <kbd>Tab</kbd> | Close and move focus away |

The trigger exposes `aria-haspopup="listbox"` / `aria-expanded`, and options use `role="option"` with `aria-selected` and `aria-disabled`.

## DOM

```html
<div class="ew-select ew-select--default">
  <button type="button" class="ew-select__trigger" aria-haspopup="listbox" aria-expanded="false">
    <span class="ew-select__value">Linear</span>
    <span class="ew-select__clear" role="button" aria-label="Clear selection"><svg class="ew-select__clear-icon">…</svg></span>
    <span class="ew-select__arrow"><svg class="ew-select__arrow-icon">…</svg></span>
  </button>
  <div class="ew-select__dropdown" role="listbox">
    <div class="ew-select__option ew-select__option--selected" role="option" data-select-index="0">Linear</div>
    <div class="ew-select__option" role="option" data-select-index="1">Radial</div>
  </div>
</div>
```

## Related

- [InputNumber](./input-number.md) · [Plugin overview](./) · [Styles & classes](../api/styles.md)
