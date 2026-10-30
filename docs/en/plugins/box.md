---
title: Box Plugin
description: The Box plugin renders the trigger swatch, toggles the panel, and adapts icon color to background luminance.
---

# Box

`ewColorPickerBox` is the square trigger showing the current color.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/box` |
| `pluginName` | `ewColorPickerBox` |
| `applyOrder` | not declared |
| Mount point | `root` |
| Instance | `core.plugins.ewColorPickerBox` |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultColor` | `string` | `''` | Initial color / clear target |
| `size` | string, number, object | `'normal'` | Swatch size |
| `disabled` | `boolean` | `false` | Blocks clicks |
| `readonly` | `boolean` | `false` | Blocks clicks, keeps styles |
| `hasBox` | `boolean` | `true` | Hide the swatch |
| `boxNoColorIcon` | `string` | `''` | Custom "no color" icon HTML |
| `boxHasColorIcon` | `string` | `''` | Custom "has color" icon HTML |
| `className` | `string` | `''` | Extra class |
| `style` | `string \| object` | `''` | Inline styles |
| `onClick` | `(box) => void` | — | Click callback |
| `onMouseEnter` / `onMouseLeave` | `(box) => void` | — | Hover callbacks |

### size

| Form | Result |
| --- | --- |
| `mini` / `small` / `normal` / `medium` / `large` | 20 / 24 / 32 / 36 / 40px |
| `48` | 48px |
| `{ width: '60px', height: '36px' }` | custom |
| `'5rem'` | verbatim |

Icon sizes: `mini` 12px, `small` 14px, `normal` 16px, `medium` 18px, `large` 20px; numbers/objects use 50% of the shorter side.

### Icon contrast

- Luminance > 0.5 → `#333333`
- otherwise → `#ffffff`
- translucent colors are blended over white first

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `enableBox` | `(enable = true) => void` | Show/hide |
| `update` | `(keys?: string[]) => void` | Refresh selected keys |
| `updateChildren` | `() => void` | Recompute icon |
| `setBoxSize` | `() => void` | Reapply size |
| `setBoxBgColor` | `(color?: string) => void` | Set background |
| `clearBoxBgColor` | `() => void` | Reset background |
| `setBoxState` | `() => void` | Sync state classes |
| `setDisabled` | `(disabled: boolean) => void` | Toggle disabled |
| `bindMouseEvents` | `(onEnter?, onLeave?) => void` | Bind hover |
| `unbindHandler` | `() => void` | Unbind DOM events |
| `destroy` | `() => void` | Remove |

Properties: `hasBox` (getter/setter), `box` (`HTMLElement | null`).

## Behaviour

Clicking calls `showPanel()` or `hidePanel()` with `togglePickerAnimation` / `pickerAnimationTime`, then `onClick(boxPlugin)`. With `disabled` or `readonly`, the click is prevented.

```ts
picker.on('toggle', (open) => console.log(open))
picker.on('change', (color) => console.log(color))
```

## DOM

```html
<div class="ew-color-picker-box">
  <span class="ew-color-picker-box-arrow-icon"></span>
</div>
```

| Class | Meaning |
| --- | --- |
| `.ew-color-picker-box` | Root |
| `.ew-color-picker-box-arrow-icon` | Has-color icon |
| `.ew-color-picker-box-close-icon` | No-color icon |
| `.is-disabled` / `.is-readonly` | States |

## Example

```ts
new ewColorPicker({
  el: '#app',
  defaultColor: '#6366f1',
  size: 'large',
  onClick: (box) => console.log('clicked', box.hasBox),
})
```

## Related

- [Panel](./panel.md) · [Options · size](../api/options.md#size)
