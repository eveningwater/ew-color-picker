---
title: Callbacks
description: 'Core and plugin-level callbacks: changeColor, sure, clear, togglePicker, onClick, onChange, changeMode and their signatures.'
---

# Callbacks

Callbacks are functions passed through options. Unlike events, they are bound to a specific plugin or the core.

## Core callbacks

| Callback | Signature | Triggered by |
| --- | --- | --- |
| `changeColor` | `(color: string) => void` | `core.setColor()` |
| `sure` | `(color: string, picker) => void` | Sure button |
| `clear` | `(picker) => void` | Clear button |
| `togglePicker` | `(isOpen: boolean) => void` | `showPanel()` / `hidePanel()` |

```ts
const picker = new ewColorPicker({
  el: '#app',
  changeColor: (color) => console.log(color),
  sure: (color, instance) => console.log(color, instance.getColor()),
  clear: (instance) => console.log('cleared', instance.getColor()),
  togglePicker: (open) => console.log(open ? 'open' : 'closed'),
})
```

::: tip Callback vs event
`changeColor` runs **inside** `setColor()` in addition to the `change` event. `sure` / `clear` are invoked by the Button plugin with arguments, while `core.emit('sure')` invokes them without arguments.
:::

## Plugin-level callbacks

### Box

| Callback | Signature | Notes |
| --- | --- | --- |
| `onClick` | `(boxPlugin) => void` | After the panel toggle; blocked when `disabled` / `readonly` |
| `onMouseEnter` | `(boxPlugin) => void` | Mouse enter |
| `onMouseLeave` | `(boxPlugin) => void` | Mouse leave |

```ts
new ewColorPicker({
  el: '#app',
  onClick: (box) => console.log('box clicked', box.hasBox),
})
```

### Input

| Callback | Signature | Notes |
| --- | --- | --- |
| `changeColor` | `(rgba: string) => void` | Valid input parsed and applied |

```ts
new ewColorPicker({
  el: '#app',
  hasInput: true,
  changeColor: (rgba) => console.log('input applied', rgba),
})
```

### InputNumber

| Callback | Signature | Notes |
| --- | --- | --- |
| `onChange` | `(value: number) => void` | Debounced 300ms; not called on construction |
| `onBlur` | `(value: number) => void` | Input blurred |
| `onFocus` | `(event: FocusEvent) => void` | Input focused |

```ts
import { InputNumber } from '@ew-color-picker/input-number'

new InputNumber({
  value: 50,
  min: 0,
  max: 100,
  onChange: (v) => console.log(v),
  onBlur: (v) => console.log('blur', v),
  onFocus: (e) => console.log('focus', e),
})
```

### Predefine

| Callback | Signature | Notes |
| --- | --- | --- |
| `changeColor` | `(rgba: string) => void` | Swatch clicked and applied |

### ColorMode

| Callback | Signature | Notes |
| --- | --- | --- |
| `changeMode` | `(mode, picker) => void` | After switching to `'hex' \| 'rgb' \| 'hsl'` |

```ts
new ewColorPicker({
  el: '#app',
  changeMode: (mode, instance) => console.log(mode, instance.getColor()),
})
```

### Button

| Callback | Signature | Notes |
| --- | --- | --- |
| `clear` | `(picker) => void` | Clear clicked |
| `sure` | `(color, picker) => void` | Sure clicked |

## Callback vs event

| Aspect | Callback | Event |
| --- | --- | --- |
| Registration | Options object | `on()` / `once()` |
| Multiple handlers | One per option | Many |
| Removal | `updateOptions({ changeColor: noop })` | `off()` |
| Return value effect | Ignored | `true` stops propagation |
| Access to plugin instance | Usually provided | Only via payload |

Prefer events for analytics or multiple consumers; prefer callbacks for a single owner of the behavior.

## Next steps

- [Events](./events.md)
- [Options](./options.md)
- [Plugin overview](../plugins/index.md)
