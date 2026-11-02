---
title: Hue Plugin
description: The Hue plugin renders a 0–360° slider with horizontal/vertical orientation, click, drag and runtime toggle.
---

# Hue

`ewColorPickerHue` renders the 0–360° hue slider while keeping saturation, value and alpha unchanged.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/hue` |
| `pluginName` | `ewColorPickerHue` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` |
| Instance | `core.plugins.ewColorPickerHue` |

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `hue` | `boolean` | `true` | `false` hides the slider at construction |
| `hueDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | Orientation |
| `disabled` | `boolean` | `false` | Blocks interaction |

## Methods

| Method / property | Signature | Description |
| --- | --- | --- |
| `enableHue` | `(enable = true) => void` | Show/hide |
| `updateHue` | `(hue: number) => void` | Apply hue (0–360) via `setColor()` |
| `updateHueThumbPosition` | `(hue: number) => void` | Move thumb only |
| `hasHue` | `boolean` getter/setter | Re-renders on change |
| `hueBar` / `hueThumb` | `HTMLElement \| null` | DOM |
| `isHorizontal` | `boolean` | Orientation flag |

## Behaviour

| Action | Result |
| --- | --- |
| Click | Hue computed from position, color applies |
| Drag | Throttled 16ms |
| External change | Thumb syncs to the new hue |

The gradient always shows the full spectrum.

## Events

Changes go through `core.setColor()`, so:

```ts
picker.on('change', (color) => console.log(color))
```

## DOM

```html
<div class="ew-color-picker-slider ew-color-picker-is-vertical">
  <div class="ew-color-picker-slider-bar"></div>
  <div class="ew-color-picker-slider-thumb"></div>
</div>
```

## Example

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#ef4444',
  hueDirection: 'horizontal',
})

picker.on('change', () => console.log(picker.hsvaColor.h))
picker.plugins.ewColorPickerHue.updateHue(200)
```

## Related

- [Alpha](./alpha.md) · [Options · hueDirection](../api/options.md#huedirection--alphadirection)
