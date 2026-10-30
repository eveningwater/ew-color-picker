---
title: Panel Plugin
description: The Panel plugin renders the saturation/value area with drag, touch support, auto placement and dynamic sizing.
---

# Panel

`ewColorPickerPanel` renders the 2D picking area. The horizontal axis is saturation, the vertical axis is value.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/panel` |
| `pluginName` | `ewColorPickerPanel` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` |
| Instance | `core.plugins.ewColorPickerPanel` |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `hasPanel` | `boolean` | `true` | Hide the 2D panel |
| `ewColorPickerPanel` | `boolean \| object` | `true` | `false` disables; object merges |
| `hueDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | Affects width |
| `alphaDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | Affects width |
| `autoPanelPosition` | `boolean` | `false` | Auto placement |
| `panelPlacement` | `string` | `'bottom'` | See below |
| `ewColorPickerBox` | `boolean` | `true` | Required for auto placement |
| `alpha` | `boolean` | derived | Affects default color format |
| `disabled` | `boolean` | `false` | Blocks dragging |

### panelPlacement

`top-start` `top` `top-end` `left-start` `left` `left-end` `right-start` `right` `right-end` `bottom-start` `bottom` `bottom-end`

Gap 5px; positions are adjusted to stay inside the viewport.

### Width rules

| Hue | Alpha | Width |
| --- | --- | --- |
| vertical | vertical | 285px |
| horizontal | vertical (or vice versa) | ~302px |
| horizontal | horizontal | 320px |

Height is 180px, injected as `--panel-width` / `--panel-height`.

## Methods

| Method | Signature | Description |
| --- | --- | --- |
| `render` | `() => void` | Rebuild DOM |
| `updateCursorPosition` | `(s, v) => void` | Move cursor (0–100) |
| `updateColor` | `(s, v) => void` | Apply color via `setColor()` |
| `updateHueBg` | `(hue?) => void` | Update base hue |
| `calculateContainerSize` | `() => void` | Measure container |
| `handleAutoPosition` | `() => void` | Apply placement |
| `calculatePosition` | `(position, align, boxW, boxH) => { left, top }` | Pure calculation |
| `adjustForViewport` | `(root, left, top) => { left, top }` | Viewport correction |
| `destroy` | `() => void` | Remove |

Properties: `panel`, `cursor`, `whitePanel`, `blackPanel`, `panelWidth`, `panelHeight`, `isHueHorizontal`, `isAlphaHorizontal`, `isDragging`.

## Behaviour

| Action | Result |
| --- | --- |
| Click | Cursor jumps, color applies |
| Drag | Throttled to ~60fps |
| Touch | Same as drag |
| External change | Cursor and base hue sync |

`updateColor` falls back to red when the current color is empty or contains `NaN`.

Emits `change` via `core.setColor()`.

## DOM

```html
<div class="ew-color-picker-panel ew-color-picker-panel-dynamic-size"
     style="--panel-width:285px;--panel-height:180px">
  <div class="ew-color-picker-white-panel"></div>
  <div class="ew-color-picker-black-panel"></div>
  <div class="ew-color-picker-panel-cursor"></div>
</div>
```

## Example

```ts
const picker = new ewColorPicker({
  el: '#app',
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  autoPanelPosition: true,
  panelPlacement: 'bottom-start',
})

picker.plugins.ewColorPickerPanel.updateColor(20, 30)
```

## Related

- [Hue](./hue.md) · [Alpha](./alpha.md) · [Options · panelPlacement](../api/options.md#panelplacement)
