---
title: AI Usage Best Practices
description: Canonical, copy-paste-ready rules for AI coding assistants integrating ew-color-picker, covering installation, styles, mounting, layering, color updates, lifecycle and framework wrappers.
---

# AI Usage Best Practices

This page is written for AI coding assistants and code-generation tools. It is the canonical, minimal set of rules for producing correct ew-color-picker code. Follow it before reaching for the full API reference.

Machine-readable index: [`llms.txt`](/llms.txt) · Full documentation: [`llms-full.txt`](/llms-full.txt)

## 1. Choose the right entry point

| Need | Install | Import |
| --- | --- | --- |
| Standard picker with all UI | `@ew-color-picker/ew-color-picker` + `@ew-color-picker/style` | `import ewColorPicker from '@ew-color-picker/ew-color-picker'` |
| Keep the v1 package name | `ew-color-picker` | `import ewColorPicker from 'ew-color-picker'` |
| Only specific UI parts | `@ew-color-picker/core` + plugin packages | `ewColorPicker.use(Box).use(Panel)` |
| No bundler (CDN) | none | `<script src="https://unpkg.com/@ew-color-picker/ew-color-picker/dist/index.min.js">` |

Rules:

- Do **not** mix v1 and v2 APIs. v2 is a plugin architecture; v1 options such as the old `hasAlpha` are gone.
- The unscoped `ew-color-picker` package contains no implementation. It only re-exports `@ew-color-picker/ew-color-picker` and the styles.

## 2. Always import both stylesheets

```ts
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'
```

`input-number.css` is **not** optional: RGB and HSL channel inputs render broken without it. Add `select.css` and `tooltip.css` only if you render the Select or Gradient components.

For CDN usage, include both `<link>` tags. Users who load only the static CSS must not rely on styles injected at runtime by the core entry.

## 3. Mount: one instance per element

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#6366f1',
})
```

- `el` accepts a selector or an `HTMLElement`. Omit it and the picker mounts into `document.body`.
- In frameworks, pass the element reference (`ref.current`), never a duplicated id selector.
- Never construct two instances on the same element. Call `destroy()` first.

## 4. Build your own trigger with `hasBox: false`

Use this when you already have a button, input group, or table cell that should open the panel.

```ts
const picker = new ewColorPicker({
  el: '#my-trigger',
  hasBox: false,
  appendTo: document.body,
})

document.querySelector('#my-button')!.addEventListener('click', () => {
  picker.showPanel()
})
```

- `showPanel()` and `hidePanel()` are idempotent: calling `showPanel()` while open does nothing, so it is safe to wire it to any click handler.
- With `hasBox: false`, the picker root has no trigger swatch. Put your own UI in `el` or mount the picker into a hidden host.
- Read the current value with `picker.getColor()`; it returns `''` when no color is selected yet.

## 5. Panels inside dialogs, drawers and modals

Panel positioning has two independent problems. Fix both:

1. **Clipping** by an `overflow: hidden` ancestor → use `appendTo`.
2. **Stacking context** created by an ancestor with `transform`, `filter` or `backdrop-filter` → also solved by `appendTo: document.body`, because the panel then escapes the stacking boundary.

```ts
new ewColorPicker({
  el: '#picker',
  appendTo: document.body,
  panelPlacement: 'bottom-start',
  boundary: '.el-dialog__body',
})
```

- `appendTo` switches the panel to `position: fixed` and keeps it aligned on scroll and resize.
- `boundary` clamps the panel into a container's visible area instead of the viewport. Pass the selector or element of the scroll container.
- `autoPanelPosition: true` anchors the panel to the box. Do not use it together with `hasBox: false`, since there is no box to anchor to.

## 6. Change color only through `setColor`

```ts
picker.setColor('#f00')       // emits change + calls options.changeColor
picker.setColor('')           // clears the color, emits change('')
picker.getColor()             // current color, may be ''
```

- Never assign `picker.currentColor` or `picker.hsvaColor` directly. Plugins only react to `change`.
- `setHsvaColor()` mutates internal state **without** emitting; call `setColor()` afterwards if the UI must refresh.
- With the Alpha plugin registered, hex input is normalised to `rgba()`. Without Alpha, `rgba()` input is normalised to hex.

## 7. Events or callbacks — pick one channel

Both fire for the same action. Using both duplicates work.

```ts
// Option callback
new ewColorPicker({ el: '#app', changeColor: (color) => save(color) })

// Instance event
const picker = new ewColorPicker({ el: '#app' })
picker.on('change', (color: string) => save(color))
```

| Event | Payload | When |
| --- | --- | --- |
| `change` | `string` | Color changed |
| `toggle` | `boolean` | Panel opened / closed |
| `sure` | `string` | Sure button clicked |
| `clear` | — | Clear button clicked |
| `options-update` | options | After `updateOptions()` |
| `mode-change` | mode | Hex / RGB / HSL switched |
| `destroy` | — | Instance destroyed |

Unknown event names log a warning and are ignored — they never throw. `emit()` additionally invokes the matching option callback; `trigger()` only runs listeners.

## 8. Always call `destroy()` on unmount

```ts
const picker = new ewColorPicker({ el: host })
// later
picker.destroy()
```

An instance registers a `document` `mousedown` listener so outside clicks close the panel. If it leaks, it closes panes belonging to **other** pickers on the page. `destroy()` is safe to call twice.

React 19 StrictMode mounts effects twice; the cleanup function is what prevents a leftover instance.

## 9. Controlled components without update loops

`setColor()` emits `change`. If your component writes that value back and then calls `setColor()` again, you get a loop. Guard it:

```ts
if (picker.getColor() !== value) picker.setColor(value)
```

## 10. Multiple instances and DOM queries

Each instance owns its own event bus, `data-uid`, DOM subtree and plugin instances.

- Always scope queries to the instance wrapper: `picker.wrapper.querySelector(...)`.
- Never use document-wide selectors such as `.ew-color-picker-box` when more than one picker exists.
- Colors never leak between instances; there is no global current color.

## 11. SSR safety

Importing the module and stylesheets is safe on the server. Constructing is not — it touches `document`.

Create the instance only in browser lifecycles: `useEffect`, `onMounted`, `ngAfterViewInit`, `onMount`.

## 12. Runtime updates

```ts
picker.updateOptions({ size: 'small', disabled: true })
```

`updateOptions()` merges options, re-applies plugins so each plugin can refresh, and emits `options-update`. It calls `setColor()` only when the new `defaultColor` is present and valid; invalid values warn and keep the current color.

To hide a plugin at runtime, prefer the documented switches (`hasPanel`, `hasInput`, `showButton`, `hue`, `alpha`, …) over reaching into `picker.plugins`.

## 13. TypeScript

```ts
import type { ewColorPickerConstructorOptions } from '@ew-color-picker/core'
import type { InputNumberOptions } from '@ew-color-picker/input-number'

const options: ewColorPickerConstructorOptions = { el: '#app', defaultColor: '#6366f1' }
```

Every package ships declarations. Import each plugin's option type from that plugin's own package.

## 14. Pre-flight checklist

Before returning generated code, verify:

- [ ] Both `index.css` and `input-number.css` are imported.
- [ ] Each mount point gets exactly one instance.
- [ ] `destroy()` is wired to the framework unmount path.
- [ ] Controlled sync compares values before calling `setColor()`.
- [ ] Panels inside dialogs/drawers use `appendTo: document.body` (and `boundary` when clamping is needed).
- [ ] Only one of `changeColor` callback / `change` event is used per concern.
- [ ] No direct mutation of `currentColor` / `hsvaColor`.
- [ ] SSR code constructs the instance only inside a browser lifecycle.

## Common mistakes

| Symptom | Cause | Fix |
| --- | --- | --- |
| RGB inputs look broken | `input-number.css` missing | Import `@ew-color-picker/style/dist/input-number.css` |
| Panel hidden behind a modal | Ancestor stacking context or `overflow` | `appendTo: document.body` |
| Panel jumps to the corner | `autoPanelPosition` with `hasBox: false` | Remove `autoPanelPosition`, position via `appendTo` + `panelPlacement` |
| Another picker's panel closes by itself | Leaked instance listener | Call `destroy()` on unmount |
| Color updates twice / infinite loop | Writer and `setColor()` feed each other | Compare `getColor()` before setting |
| Panel opens then instantly closes | Two instances on one element | Destroy the previous instance first |
| Styles do not apply after custom `prefix` | JS `prefix` and SCSS `$prefix` differ | Keep both in sync, or use the prebuilt `ew-` CSS |
