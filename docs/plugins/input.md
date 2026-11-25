---
title: Input Plugin
description: The Input plugin provides a validated hex/rgb/hsl text field with debounce and disabled state.
---

# Input

`ewColorPickerInput` renders a text field accepting hex / rgb(a) / hsl(a). Valid input applies immediately; invalid input never pollutes the current color.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/input` |
| `pluginName` | `ewColorPickerInput` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` |
| Instance | `core.plugins.ewColorPickerInput` |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `hasInput` | `boolean` | `true` | Hide the field |
| `disabled` | `boolean` | `false` | Disable it |
| `changeColor` | `(rgba: string) => void` | — | Applied color callback |

Display format follows the current mode: hex in Hex mode, `rgb()/rgba()` in RGB, `hsl()/hsla()` in HSL.

## Methods

| Method / property | Signature | Description |
| --- | --- | --- |
| `enableInput` | `(enable = true) => void` | Show/hide |
| `hasInput` | `boolean` getter/setter | Re-renders on change |
| `setValue` | `(value: string) => void` | Set text only |
| `getValue` | `() => string` | Read text |
| `setDisabled` | `(disabled: boolean) => void` | Toggle disabled state |
| `update` | `(color: string) => void` | Format and write current color |
| `onInputColor` | `(value: string) => void` | Input handler (300ms debounce) |
| `input` | `HTMLInputElement \| null` | DOM |

## Validation

| Input | Result |
| --- | --- |
| `#f00`, `#ff0000`, `#ff000080` | Valid |
| `rgb(255,0,0)`, `rgba(255,0,0,0.5)` | Valid |
| `hsl(0,100%,50%)`, `hsla(...)` | Valid |
| `''` | Valid (clears color) |
| other | Invalid, ignored (may warn) |

Input is debounced by 300ms.

## Events

```ts
core.setColor(rgbaColor)
core.trigger('change', rgbaColor)
options.changeColor?.(rgbaColor)
```

## DOM

```html
<div class="ew-color-picker-input-container ew-color-picker-input-container-flex">
  <input class="ew-color-picker-input" type="text" />
</div>
```

Disabled adds `ew-input-disabled`.

## Example

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#0ea5e9',
  hasInput: true,
  changeColor: (rgba) => console.log(rgba),
})
```

## Standalone Input component

The package also exports a generic input that works without the color picker (import `input.css` separately).

```ts
import { Input } from '@ew-color-picker/input'
import '@ew-color-picker/style/dist/input.css'

const input = new Input({
  value: '',
  placeholder: 'Type something',
  size: 'default',
  onChange: (value) => console.log(value),
  onEnter: (value) => console.log('submit', value),
})

document.querySelector('#app')!.appendChild(input.getElement())

input.setValue('hello')
input.setDisabled(true)
input.destroy()
```

Options: `value`, `placeholder`, `size` (`small | default | large`), `type`, `disabled`, `readonly`, `prefix`, `onChange`, `onFocus`, `onBlur`, `onEnter`.

Methods: `getValue()`, `setValue(value, triggerChange?)`, `setPlaceholder()`, `setDisabled()`, `setReadonly()`, `focus()`, `getElement()`, `destroy()`.

See [examples/22-input.html](https://github.com/eveningwater/ew-color-picker/blob/master/examples/22-input.html).

## Related

- [ColorMode](./color-mode.md) · [InputNumber](./input-number.md)
