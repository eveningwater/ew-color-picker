---
title: Core Concepts
description: Understand the instance-level event bus, mount points, plugin apply order, single color entry and instance isolation.
---

# Core Concepts

## Instance-level event bus

Every instance extends `EventEmitter` and registers exactly these event types:

```ts
['destroy', 'change', 'sure', 'clear', 'toggle', 'options-update', 'mode-change']
```

`on` / `once` / `off` / `trigger` / `emit` are available on the instance. Unknown event names log a warning instead of throwing.

| Method | Behaviour |
| --- | --- |
| `on(type, fn)` | Add a listener |
| `once(type, fn)` | Add a one-shot listener |
| `off(type?, fn?)` | Remove one listener, all listeners of a type, or everything |
| `trigger(type, ...args)` | Run listeners directly; `return true` from a listener stops the rest |
| `emit(type, ...args)` | Like `trigger`, but also invokes the matching `options` callback (`clear`, `sure`, `togglePicker`) |

## Mount points

When mounting, the core creates:

```html
<div class="ew-color-picker" data-uid="…">
  <div class="ew-color-picker-panel-container ew-color-picker-panel-container-hidden">
    …
  </div>
</div>
```

| Mount point | Access | Used by |
| --- | --- | --- |
| `root` | `core.getMountPoint('root')` | Box |
| `panelContainer` | `core.getMountPoint('panelContainer')` | Panel, Hue, Alpha, Input, InputNumber, Button, Predefine, ColorMode |

The panel container is hidden with the `-hidden` class and revealed when the panel opens.

## Plugin apply order

| Value | Meaning |
| --- | --- |
| `ApplyOrder.Pre` (`-1`) | Runs before the core's default logic |
| `ApplyOrder.Post` (`1`) | Runs after the core's default logic |
| not set | Runs in registration order |

All built-in UI plugins use `Post`.

## Single color entry

`core.setColor(color)` is the only supported way to change color. It:

1. Normalises the color (hex ↔ rgba depending on the Alpha plugin);
2. Updates `currentColor` and `hsvaColor`;
3. Emits `change`;
4. Calls `options.changeColor(color)`.

Plugins must subscribe to `change` instead of polling `currentColor`.

## Plugin registry

```ts
ewColorPicker.plugins        // array of registered { name, applyOrder, ctor }
ewColorPicker.pluginsMap     // { [pluginName]: true }
core.plugins                 // instance map: { [pluginName]: instance }
```

`core.plugins.ewColorPickerPanel`, `core.plugins.ewColorPickerAlpha`, etc. expose each plugin instance.

## Instance isolation

Each instance gets:

- its own event bus,
- its own `data-uid`,
- its own DOM subtree,
- its own plugin instances.

That is why multiple instances never share colors. Always scope DOM queries to the current wrapper.

## Lifecycle

```text
new ewColorPicker(options)
  → normalize options
  → init state (currentColor, hsvaColor, mode)
  → mount(el) if el provided
      → create root + panelContainer
      → apply plugins (Pre → default → Post)
      → sync hue/alpha

picker.destroy()
  → emit destroy
  → plugin.destroy()
  → remove DOM and listeners
  → mark instance as destroyed
```

## Next steps

- [Write a plugin](./plugin-dev.md)
- [Events](../api/events.md)
- [Methods](../api/methods.md)
