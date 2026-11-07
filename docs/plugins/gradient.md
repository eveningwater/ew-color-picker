---
title: Gradient Plugin
description: 'The gradient editor plugin: linear/radial/conic, repeating gradients, angles, positions, double-position stops and interpolation color spaces.'
---

# Gradient

`@ew-color-picker/gradient` adds a gradient editor to the panel: a preview bar with draggable color stops, type/angle controls, radial and conic options, interpolation hints and a CSS string that round-trips with the parser.

::: warning Position: an extension of the picker, not a standalone gradient picker
The plugin only edits gradient structure (stops, positions, type, angle, repeating and interpolation). It has no color-picking UI of its own: the color of the selected stop is chosen through the picker's panel (Panel / Hue / Alpha / InputNumber) and written back via `syncStopsOnChange`. It therefore requires `panelContainer` and cannot be used without the color picker. If you only need to edit gradient data or build your own gradient component, use the exported pure helpers `parseGradient`, `serializeGradient` and `interpolateStops` instead.
:::

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/gradient` |
| `pluginName` | `ewColorPickerGradient` |
| `applyOrder` | `Post` |
| Mount point | `panelContainer` (inserted before `.ew-color-picker-bottom-row`) |
| Instance | `core.plugins.ewColorPickerGradient` |

::: tip Rendering is opt-in
The editor is hidden by default. It renders when `showGradient: true` or when `gradient` / `gradientStops` is provided.
:::

```ts
import ewColorPicker from '@ew-color-picker/core'
import Gradient from '@ew-color-picker/gradient'

ewColorPicker.use(Gradient)

new ewColorPicker({
  el: '#app',
  gradientStops: ['#ff0000', '#0000ff'],
  gradientType: 'linear',
  gradientAngle: 90,
  gradientChange: (css, value) => console.log(css),
})
```

The editor needs the panel: with `hasPanel: false` (or `ewColorPickerPanel: false`) the plugin warns and renders nothing.

## Plugin options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `showGradient` | `boolean` | `false` | Set `true` to render without passing stops |
| `gradient` | `string \| GradientValue` | — | Initial gradient; a CSS string is parsed first |
| `gradientType` | `'linear' \| 'radial' \| 'conic'` | `'linear'` | Gradient type |
| `gradientRepeating` | `boolean` | `false` | Render a repeating gradient |
| `gradientStops` | `Array<string \| GradientStop>` | current color + white | Initial stops |
| `gradientAngle` | `number` | `180` | Linear angle in degrees |
| `gradientInterpolation` | `string \| null` | `null` | Interpolation color space, e.g. `oklab`, `oklch longer hue` |
| `minGradientStops` | `number` | `2` | Minimum number of stops |
| `maxGradientStops` | `number` | `8` | Maximum number of stops |
| `syncStopsOnChange` | `boolean` | `true` | Write panel color changes back to the selected stop |
| `gradientChange` | `(css, value) => void` | — | Called whenever the gradient changes |

`GradientStop` is `{ color: string; position?: number; position2?: number }`. A stop with `position2` is a double-position stop that holds its color across the range.

## Plugin methods

| Method | Signature | Description |
| --- | --- | --- |
| `getGradient` | `() => string` | Serialize the current gradient to CSS |
| `getGradientValue` | `() => GradientValue` | Structured copy of the current gradient |
| `getStops` | `() => GradientStop[]` | Copy of the current stops |
| `setGradient` | `(string \| Partial<GradientValue>) => void` | Replace the gradient and re-render |
| `setStops` | `(stops) => void` | Replace the stops |
| `addStop` | `(color, position?) => number` | Add a stop and return its index (`-1` when full) |
| `removeStop` | `(index?) => boolean` | Remove the selected or given stop |
| `updateOptions` | `() => void` | Re-read options and re-render |
| `destroy` | `() => void` | Unbind events and remove the editor |

## Interactions

- Drag a handle to move the stop; the panel color follows the selected stop.
- Click an empty spot on the preview bar to insert a stop with the interpolated color.
- Changing the panel color with `syncStopsOnChange: true` updates the selected stop.
- The preview bar is always drawn left-to-right so handle percentages map directly to positions; the exported CSS still uses the configured type and angle.

## Utilities

```ts
import {
  parseGradient,
  serializeGradient,
  interpolateStops,
  resolveGradientPositions,
} from '@ew-color-picker/gradient'
```

`parseGradient` supports all six prefixes (`linear` / `radial` / `conic`, optionally `repeating-`), `deg` / `rad` / `grad` / `turn` angles, `to <side-or-corner>`, radial shape/size/`at`, conic `from`/`at`, `in <color-space>` hints and double-position stops. Length-based stop positions are rejected with a warning. `serializeGradient` produces a stable round-trip.

`interpolateStops` computes the color at a percentage; supported spaces are sRGB, sRGB-linear, HSL, OKLab and OKLCH with four hue directions. `lab` / `lch` / `hwb` hints fall back to sRGB.

## Styling

Gradient styles ship inside the main stylesheet:

```ts
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/select.css'
import '@ew-color-picker/style/dist/input-number.css'
import '@ew-color-picker/style/dist/checkbox.css'
```

The editor uses the `Select`, `InputNumber` and `Checkbox` components from `@ew-color-picker/select`, `@ew-color-picker/input-number` and `@ew-color-picker/checkbox`.

## DOM

```html
<div class="ew-gradient-container">
  <div class="ew-gradient-preview">
    <div class="ew-gradient-preview-bar" style="background: linear-gradient(90deg, …)">
      <button type="button" class="ew-gradient-handle ew-gradient-handle-active" style="left: 0%"></button>
      <button type="button" class="ew-gradient-handle" style="left: 100%"></button>
    </div>
  </div>
  <div class="ew-gradient-row ew-gradient-row-type">…</div>
  <div class="ew-gradient-row ew-gradient-row-radial">…</div>
  <div class="ew-gradient-row ew-gradient-row-position">…</div>
  <div class="ew-gradient-row ew-gradient-row-interp">…</div>
  <div class="ew-gradient-row ew-gradient-row-stop">…</div>
</div>
```

## Related

- [Select](./select.md) · [InputNumber](./input-number.md) · [Plugin overview](./) · [Styles & classes](../api/styles.md)
