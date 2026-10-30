---
title: Writing a Plugin
description: Build a custom EW Color Picker plugin with pluginName, applyOrder, constructor, mount points, events and TypeScript type augmentation.
---

# Writing a Plugin

A plugin is a plain class. The core only requires two static properties and a constructor.

## Minimal template

```ts
import type ewColorPicker from '@ew-color-picker/core'
import { ApplyOrder, create, addClass, insertNode, isFunction } from '@ew-color-picker/utils'

export default class MyBadgePlugin {
  static pluginName = 'myBadge'
  static applyOrder = ApplyOrder.Post

  el: HTMLElement | null = null

  constructor(public ewColorPicker: ewColorPicker) {
    this.run()

    if (isFunction(this.ewColorPicker.on)) {
      this.ewColorPicker.on('change', this.handleChange)
    }
  }

  run() {
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer')
    if (!panelContainer) return

    this.el = create('span')
    addClass(this.el, 'my-badge')
    insertNode(panelContainer, this.el)
    this.renderColor(this.ewColorPicker.getColor())
  }

  handleChange = (color: string) => {
    this.renderColor(color)
  }

  renderColor(color?: string) {
    if (this.el) this.el.textContent = color || 'no color'
  }

  destroy() {
    if (isFunction(this.ewColorPicker.off)) {
      this.ewColorPicker.off('change', this.handleChange)
    }
    this.el?.parentNode?.removeChild(this.el)
    this.el = null
  }
}
```

## Register it

```ts
import ewColorPicker from '@ew-color-picker/core'
import MyBadgePlugin from './my-badge'

ewColorPicker.use(MyBadgePlugin)

new ewColorPicker({ el: '#app' })
```

`use()` is chainable and idempotent.

## Contract

| Member | Required | Notes |
| --- | --- | --- |
| `static pluginName` | Yes | Unique key in `core.plugins`; missing name logs a warning |
| `static applyOrder` | No | `ApplyOrder.Pre` / `Post` / `undefined` |
| `constructor(core)` | Yes | Receives the instance; render + subscribe here |
| `destroy()` | No | Unbind DOM events and listeners |
| `install(core)` | No | Support manual `plugin.install(core)` usage |
| `updateOptions()` | No | Called when `core.updateOptions()` broadcasts `options-update` |

## Rules

1. Change colors only via `core.setColor()`.
2. Subscribe to `change` rather than reading state in loops.
3. Render only into `root` or `panelContainer`.
4. Scope DOM queries to your own wrapper.
5. Clean up everything in `destroy()`.

## Type augmentation

Declare your options on the core's `CustomOptions` interface:

```ts
declare module '@ew-color-picker/core' {
  interface CustomOptions {
    myBadge?: {
      label?: string
    }
  }
}
```

Now `new ewColorPicker({ myBadge: { label: 'Hi' } })` type-checks.

## Lifecycle summary

```text
Core.use(Plugin)  → registered statically
new ewColorPicker → creates instance, calls constructor
mount(el)         → mount points exist, plugins render
updateOptions()   → updateOptions() + options-update event
destroy()         → destroy() called, DOM removed
```

## Next steps

- [Plugin overview](../plugins/index.md)
- [Core concepts](./concepts.md)
- [Events](../api/events.md)
