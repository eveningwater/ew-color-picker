---
title: Methods
description: 'Full reference for ewColorPicker instance methods: mount, setColor, getColor, updateOptions, showPanel, events and destroy.'
---

# Methods

## Constructor

```ts
new ewColorPicker(options)
new ewColorPicker(el)
new ewColorPicker(el, options)
```

| Form | Example |
| --- | --- |
| Options object | `new ewColorPicker({ el: '#app', defaultColor: '#f00' })` |
| Selector + options | `new ewColorPicker('#app', { size: 'large' })` |
| Element + options | `new ewColorPicker(document.querySelector('#app')!, { size: 'large' })` |

If `el` (or the first argument) is provided, `mount()` is called automatically.

## Static methods

### use

```ts
static use(ctor: ewColorPickerPluginCtor): typeof ewColorPicker
```

Registers a plugin class. Requires `static pluginName`. Idempotent and chainable.

```ts
ewColorPicker.use(MyPlugin).use(AnotherPlugin)
```

## Mounting

### mount

```ts
mount(el?: string | HTMLElement): ewColorPicker
```

Creates `root` and `panelContainer`, then applies plugins. If `el` is omitted, uses `options.el` or `document.body`. Returns `this`.

### getMountPoint

```ts
getMountPoint(name: 'root' | 'panelContainer'): HTMLElement | undefined
```

Returns `undefined` after destruction.

### getContainer

```ts
getContainer(): HTMLElement
```

Returns the current mount container.

## Panel control

### showPanel

```ts
showPanel(animationType?: string, duration?: number): void
```

- If there is no current color, uses `defaultColor` or falls back to red and syncs plugins.
- Resolves animation, then sets `pickerFlag = true`, emits `toggle(true)`, calls `options.togglePicker(true)`, calls `syncAllPlugins`, then auto-positions the panel and binds the outside-click handler.

### hidePanel

```ts
hidePanel(animationType?: string, duration?: number): void
```

Resolves animation, resets auto-placement styles, sets `pickerFlag = false`, emits `toggle(false)`, calls `options.togglePicker(false)`, and unbinds the outside-click handler.

### openPicker / closePicker

```ts
openPicker(): void   // alias of showPanel()
closePicker(): void  // alias of hidePanel()
```

## Color

### setColor

```ts
setColor(color: string): void
```

The only supported way to change color:

1. Stores `currentColor`;
2. Converts to rgba → hsva and updates `hsvaColor` (invalid color falls back to `{h:0,s:100,v:100,a:1}`);
3. Emits `change(color)`;
4. Calls `options.changeColor(color)`.

Does nothing special for empty strings: `setColor('')` clears `currentColor` and emits `change('')`.

### getColor

```ts
getColor(): string
```

Returns `currentColor` (may be `''` when no color is selected).

### getHsvaColor / setHsvaColor

```ts
getHsvaColor(): HsvaColor           // copy
setHsvaColor(hsva: HsvaColor): void // does NOT emit change
```

`setHsvaColor` only mutates internal state; call `setColor()` afterwards if the UI must update.

## Options

### getOptions

```ts
getOptions(): ewColorPickerMergeOptionsData
```

Returns the live options object.

### updateOptions

```ts
updateOptions(newOptions: Record<string, any>): void
```

1. Merges new options;
2. If `defaultColor` is present and valid, calls `setColor(defaultColor)`; invalid values warn and keep the current color;
3. Re-applies plugins so plugin `updateOptions()` can refresh;
4. Emits `options-update(options)`.

```ts
picker.updateOptions({ size: 'small', disabled: true })
```

### syncAllPlugins

```ts
syncAllPlugins(color: string): void
```

Calls each plugin's `syncColor(color)` when it exists. Useful after external state changes.

## Events

```ts
on(type, fn, context?): this
once(type, fn, context?): this
off(type?, fn?): this | undefined
trigger(type, ...args): void
emit(type, ...args): void
```

| Method | Notes |
| --- | --- |
| `on` | Add listener |
| `once` | One-shot listener |
| `off` | Remove a specific listener, all of a type, or all |
| `trigger` | Runs listeners only; returning `true` from one stops the rest |
| `emit` | Runs listeners **and** invokes `options.clear` / `options.sure` / `options.togglePicker` |

## Instance plugin use

```ts
use(plugin: ewColorPickerPlugin): ewColorPicker
```

Calls `plugin.install(this)` if present and returns `this`.

## Lifecycle

### destroy

```ts
destroy(): void
```

1. Marks the instance destroyed;
2. Unbinds the document `mousedown` listener;
3. Calls `destroy()` on every plugin instance;
4. Removes all mount points and the wrapper;
5. Clears plugin references;
6. Emits `destroy`.

Subsequent calls are no-ops.

### getDestroyedStatus

```ts
getDestroyedStatus(): boolean
```

## Instance properties

| Property | Type | Description |
| --- | --- | --- |
| `options` | `ewColorPickerMergeOptionsData` | Merged options |
| `wrapper` | `HTMLElement` | Root `.ew-color-picker` element |
| `plugins` | `Record<string, plugin>` | Plugin instances |
| `currentColor` | `string` | Current color |
| `hsvaColor` | `HsvaColor` | Current HSVA |
| `currentMode` | `'Hex' \| 'RGB' \| 'HSV'` | Core mode field |
| `pickerFlag` | `boolean` | Panel open state |
| `panelWidth` / `panelHeight` | `number` | Panel size |
| `panelLeft` / `panelTop` | `number` | Panel position |

## Next steps

- [Events](./events.md)
- [Callbacks](./callbacks.md)
- [Options](./options.md)
