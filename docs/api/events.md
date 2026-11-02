---
title: Events
description: 'Change, toggle, sure, clear, options-update, mode-change and destroy events: payloads, timing and listener rules.'
---

# Events

Every instance has its own event bus. The following types are registered:

```ts
['destroy', 'change', 'sure', 'clear', 'toggle', 'options-update', 'mode-change']
```

Using an unknown type logs a warning; it does not throw.

## Summary

| Event | Payload | Emitted when |
| --- | --- | --- |
| `change` | `(color: string)` | `setColor()` is called |
| `toggle` | `(isOpen: boolean)` | Panel opened/closed |
| `sure` | `(color: string, picker)` | Sure button clicked |
| `clear` | `()` | Clear button clicked |
| `options-update` | `(options)` | `updateOptions()` finished |
| `mode-change` | `(mode: 'hex' \| 'rgb' \| 'hsl')` | Color mode switched |
| `destroy` | `()` | `destroy()` finished |

## change

```ts
picker.on('change', (color) => console.log(color))
```

Emitted synchronously by `setColor()`, after `currentColor` and `hsvaColor` are updated. Every UI plugin listens to this event to stay in sync.

Calling `setColor('')` also emits `change('')` (used when clearing).

## toggle

```ts
picker.on('toggle', (isOpen) => console.log(isOpen))
```

Emitted after the open/close animation promise resolves. `pickerFlag` is already updated when listeners run.

## sure

```ts
picker.on('sure', (color, picker) => console.log(color))
```

Emitted by the Button plugin after `options.sure(color, picker)`. The panel closes afterwards.

## clear

```ts
picker.on('clear', () => console.log('cleared'))
```

Emitted by the Button plugin after `options.clear(picker)`. The panel closes afterwards.

## options-update

```ts
picker.on('options-update', (options) => console.log(options))
```

Emitted at the end of `updateOptions()`, after plugins have re-rendered.

## mode-change

```ts
picker.on('mode-change', (mode) => console.log(mode))
```

Emitted by the ColorMode plugin. `mode` is `'hex'`, `'rgb'` or `'hsl'`.

## destroy

```ts
picker.on('destroy', () => console.log('destroyed'))
```

Emitted at the very end of `destroy()`, after plugin cleanup and DOM removal.

## Listener rules

### once

```ts
picker.once('change', (color) => console.log('first change only', color))
```

### off

```ts
const handler = (color: string) => console.log(color)
picker.on('change', handler)
picker.off('change', handler)

picker.off('change') // remove all change listeners
picker.off()         // remove everything
```

### Stopping propagation

Return `true` from a listener to stop the remaining listeners of the same event:

```ts
picker.on('change', (color) => {
  if (color === '#000000') return true // stop here
})
```

### trigger vs emit

| Method | Calls listeners | Calls option callbacks |
| --- | --- | --- |
| `trigger(type, ...args)` | Yes | No |
| `emit(type, ...args)` | Yes | Yes, for `clear` / `sure` / `toggle` |

`emit('clear')` invokes `options.clear()` with no arguments; `emit('sure')` invokes `options.sure()` with no arguments; `emit('toggle', isOpen)` forwards `isOpen` to `options.togglePicker`.

## Next steps

- [Callbacks](./callbacks.md)
- [Methods](./methods.md)
