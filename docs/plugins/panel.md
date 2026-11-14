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
| `ewColorPickerPanel` | `boolean` | `true` | Legacy switch: `false` disables the panel; pass other panel options at the top level |
| `hueDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | Affects width |
| `alphaDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | Affects width |
| `autoPanelPosition` | `boolean` | `false` | Auto placement |
| `panelPlacement` | `string` | `'bottom'` | See below |
| `appendTo` | `string \| HTMLElement` | `undefined` | Mount the panel container into an external container (e.g. `document.body`) to avoid `overflow` clipping |
| `hasBox` | `boolean` | `true` | Auto placement needs the Box trigger (reads its size) |
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

## Positioning inside containers (drawers, modals, scroll panels)

The built-in auto placement (`autoPanelPosition`) and `appendTo` both reason against the **viewport**:

- `adjustForViewport` clamps the panel with `window.innerWidth / innerHeight` only.
- `appendTo` switches the panel to `position: fixed` (viewport-relative).

When the picker lives inside a **non-viewport containing block** — e.g. a drawer body, a modal, or any ancestor with `position`, `transform`, `filter`, or `will-change` set — the panel's actual `offsetParent` is that ancestor (for `position: absolute`), so viewport-based clamping/coordinates produce a visible offset. `appendTo` avoids the offset but lets the panel escape the container's visual bounds and be clipped or overlap siblings.

### Workaround pattern

Until the core supports a configurable boundary, the proven approach (used in downstream wrappers) is to **take over positioning yourself**:

1. Set `autoPanelPosition: false` (and do not use `appendTo`).
2. On open, measure the real boundary = `container.getBoundingClientRect()` **intersected** with the viewport (fall back to viewport if no container).
3. Compute the panel's desired viewport-relative `left/top` from the trigger box, then `clamp` it into the boundary (with a margin).
4. Because the panel is `position: absolute`, convert viewport coords to `offsetParent`-relative coords:
   ```ts
   const op = panel.offsetParent as HTMLElement | null;
   const parentRect = op ? op.getBoundingClientRect() : root.getBoundingClientRect();
   const left = viewportLeft - parentRect.left - (op?.clientLeft ?? 0);
   const top  = viewportTop  - parentRect.top  - (op?.clientTop  ?? 0);
   ```
5. Re-run on `MutationObserver` (subtree class/style changes), `ResizeObserver` (panel size changes — e.g. switching the gradient tab), `window.resize`, and capture-phase `scroll`. Use `requestAnimationFrame` to coalesce.
6. Only write `style.left/top` when the value actually changes, otherwise your own `MutationObserver` will loop.

For a concrete reference implementation, see the `positionPanel` / `getBounds` logic in the `ew-qiaoda` wrapper (`ColorPickerEw.vue`).

## Related

- [Hue](./hue.md) · [Alpha](./alpha.md) · [Options · panelPlacement](../api/options.md#panelplacement)
