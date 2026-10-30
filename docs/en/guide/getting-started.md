---
title: Quick Start
description: 'Create your first EW Color Picker instance in minutes: container, options, events, methods and cleanup.'
---

# Quick Start

## 1. Prepare a container

```html
<div id="picker"></div>
```

```ts
import ewColorPicker from '@ew-color-picker/ew-color-picker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'
```

## 2. Create an instance

There are three equivalent ways to pass the container:

```ts
// Selector
new ewColorPicker({ el: '#picker', defaultColor: '#6366f1' })

// DOM element
const el = document.getElementById('picker')!
new ewColorPicker(el, { defaultColor: '#6366f1' })

// Element in options object (same as the first form)
new ewColorPicker({ el, defaultColor: '#6366f1' })
```

If `el` is provided, the picker **mounts automatically**. Without `el`, call `mount()` yourself later.

## 3. Listen for changes

```ts
const picker = new ewColorPicker({
  el: '#picker',
  defaultColor: '#6366f1',
})

picker.on('change', (color) => {
  console.log('Current color:', color)
})

picker.on('sure', (color) => {
  console.log('Confirmed:', color)
})
```

## 4. A fuller example

```ts
const picker = new ewColorPicker({
  el: '#picker',
  defaultColor: '#6366f1',
  size: 'large',
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  predefineColor: ['#ef4444', '#22c55e', '#3b82f6', '#a855f7'],
  clearText: 'Reset',
  sureText: 'Apply',
  autoPanelPosition: true,
  panelPlacement: 'bottom-start',
  togglePickerAnimation: 'height',
  pickerAnimationTime: 250,
})

picker.on('change', (color) => console.log('change', color))
picker.on('toggle', (open) => console.log('panel', open ? 'open' : 'closed'))
picker.on('mode-change', (mode) => console.log('mode', mode))
```

## 5. Methods

```ts
picker.getColor()          // current color string
picker.getHsvaColor()      // { h, s, v, a }
picker.setColor('#22c55e') // programmatic change (emits change)
picker.showPanel()
picker.hidePanel()
picker.updateOptions({ size: 'small' })
```

Full reference: [Methods](../api/methods.md).

## 6. Cleanup

```ts
picker.destroy()
```

`destroy()` removes DOM, unbinds DOM events, clears listeners, and emits `destroy`. After destruction, most methods become no-ops; check `picker.getDestroyedStatus()`.

## Next steps

- [Core concepts](./concepts.md)
- [Options](../api/options.md)
- [Plugin overview](../plugins/index.md)
