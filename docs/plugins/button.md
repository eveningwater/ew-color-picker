---
title: Button Plugin
description: 'Clear and Sure buttons: custom labels, visibility toggles, disabled state, clear/sure events and callbacks.'
---

# Button

`ewColorPickerButton` renders the Clear and Sure buttons. Clear restores the default color and closes the panel; Sure submits the current color and closes the panel.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/button` |
| `pluginName` | `ewColorPickerButton` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` → `.ew-color-picker-bottom-row` |
| Instance | `core.plugins.ewColorPickerButton` |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `showButton` | `boolean` | `true` | Hide both buttons |
| `hasClear` | `boolean` | `true` | Hide Clear |
| `hasSure` | `boolean` | `true` | Hide Sure |
| `clearText` | `string` | `'清空'` | Clear label |
| `sureText` | `string` | `'确定'` | Sure label |
| `disabled` | `boolean` | `false` | Disable both |

`hasClear` / `hasSure` apply at construction; use `enableClear` / `enableSure` / `enableButtons` at runtime.

## Methods

| Method / property | Signature | Description |
| --- | --- | --- |
| `enableClear` | `(enable = true) => void` | Show/hide Clear |
| `enableSure` | `(enable = true) => void` | Show/hide Sure |
| `enableButtons` | `(enable = true) => void` | Both |
| `hasClear` / `hasSure` | `boolean` getter/setter | Re-render |
| `setClearText` | `(text: string) => void` | Change label |
| `setSureText` | `(text: string) => void` | Change label |
| `setDisabled` | `(disabled: boolean) => void` | Toggle `disabled` |
| `updateOptions` | `() => void` | Re-read and redraw (deferred one frame) |
| `onClearColor` | `() => void` | Clear logic (100ms debounce) |
| `onSureColor` | `() => void` | Sure logic (100ms debounce) |
| `clearButton` / `sureButton` | `HTMLButtonElement \| null` | DOM |

## Click behaviour

### Clear

1. Restore `defaultColor`, or clear if absent;
2. Sync `hsvaColor` (reset to `{h:0,s:100,v:100,a:1}` when empty);
3. `core.setColor(resetColor)`;
4. `core.syncAllPlugins(resetColor)`;
5. `core.hidePanel()`;
6. `options.clear?.(picker)`;
7. `core.trigger('clear')`.

### Sure

1. `options.sure?.(color, picker)`;
2. `core.trigger('sure', color, picker)`;
3. `core.hidePanel()`.

## Events & callbacks

| Source | Signature |
| --- | --- |
| `options.clear` | `(picker) => void` |
| `options.sure` | `(color, picker) => void` |
| event `clear` | `()` |
| event `sure` | `(color, picker)` |

## DOM

```html
<div class="ew-color-picker-drop-btn-group">
  <button class="ew-color-picker-clear-btn ew-color-picker-drop-btn">Clear</button>
  <button class="ew-color-picker-sure-btn ew-color-picker-drop-btn">Sure</button>
</div>
```

## Example

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#8b5cf6',
  clearText: 'Reset',
  sureText: 'Use this color',
  clear: (instance) => console.log('after clear', instance.getColor()),
  sure: (color) => console.log('confirmed', color),
})
```

## Related

- [Events · clear / sure](../api/events.md) · [Options · clearText](../api/options.md#labels)
