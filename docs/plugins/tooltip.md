---
title: Tooltip
description: Standalone tooltip utility used by Select and other plugins — options, methods and positioning.
---

# Tooltip

`@ew-color-picker/tooltip` is the floating hint used by Select (when the selected value or an option is truncated) and available to any other component you build. It is a plain DOM utility, not a core plugin: import it wherever you need a tooltip.

Its feature set mirrors Element Plus `el-tooltip`: 12 placements with viewport flipping/shifting, `dark` / `light` effects, arrow, configurable triggers, show/hide delays, controlled visibility, virtual triggering, keyboard support and lifecycle events.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/tooltip` |
| Class | `Tooltip` |
| Helper | `isTextTruncated(el)` — also exported by `@ew-color-picker/utils` |
| Styles | `@ew-color-picker/style/dist/tooltip.css` |

::: warning Extra stylesheet
```ts
import '@ew-color-picker/style/dist/tooltip.css'
```
The Select and Gradient components rely on it as well.
:::

## Usage

Declarative mode — pass a trigger element and let the tooltip manage its own events:

```ts
import Tooltip from '@ew-color-picker/tooltip'

const tooltip = new Tooltip({
  target: '#save-btn',
  content: 'Save the current color',
  placement: 'top',
  effect: 'light',
})

// update options later
tooltip.setOptions({ placement: 'bottom', effect: 'dark' })

// remove node and listeners when the owner is destroyed
tooltip.destroy()
```

Imperative mode — useful when content depends on runtime state (this is how Select shows truncated text):

```ts
import Tooltip, { isTextTruncated } from '@ew-color-picker/tooltip'

const tooltip = new Tooltip({ prefix: 'ew-' })

if (isTextTruncated(target)) {
  tooltip.show(target.textContent!.trim(), target)
}

tooltip.hide()
tooltip.destroy()
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `prefix` | `string` | `'ew-'` | Class prefix; keep it in sync with the picker prefix |
| `target` | `HTMLElement \| string` | — | Trigger element (or selector); bind trigger events automatically |
| `content` | `string \| HTMLElement` | — | Tooltip content; strings may contain HTML when `rawContent` is on |
| `rawContent` | `boolean` | `false` | Treat string content as HTML |
| `effect` | `'dark' \| 'light'` | `'dark'` | Theme |
| `placement` | `TooltipPlacement` | `'bottom'` | Preferred placement, 12 values (`top`, `top-start`, `left-end`, …) |
| `fallbackPlacements` | `TooltipPlacement[]` | `[]` | Candidates tried when the preferred placement overflows; defaults to the opposite side |
| `visible` | `boolean` | — | Controlled visibility; once passed, update it through `setOptions({ visible })` |
| `disabled` | `boolean` | `false` | Ignore every trigger and show request |
| `offset` | `number` | `12` | Gap between the tooltip and its anchor, in px |
| `arrowOffset` | `number` | `5` | Minimum distance between the arrow and the tooltip edge |
| `showArrow` | `boolean` | `true` | Render the arrow |
| `showAfter` | `number` | `0` | Delay before showing (ms) |
| `hideAfter` | `number` | `200` | Delay before hiding after the pointer leaves (ms) |
| `autoClose` | `number` | `0` | Hide automatically N ms after showing; `0` disables |
| `popperClass` | `string` | `''` | Extra class name on the tooltip node |
| `popperStyle` | `string \| Record<string, string>` | `''` | Inline style on the tooltip node |
| `appendTo` | `HTMLElement \| string` | `document.body` | Parent the tooltip node is appended to |
| `teleported` | `boolean` | `true` | `false` renders the node next to the trigger |
| `enterable` | `boolean` | `true` | Allow the pointer to move into the tooltip content |
| `trigger` | `TooltipTrigger \| TooltipTrigger[]` | `'hover'` | `hover`, `click`, `focus`, `contextmenu`; arrays combine them |
| `virtualTriggering` | `boolean` | `false` | Position from `virtualRef` instead of a DOM trigger |
| `virtualRef` | `HTMLElement \| { getBoundingClientRect() }` | `null` | Virtual anchor used with `virtualTriggering` |
| `triggerKeys` | `string[]` | `['Enter', 'Space']` | Keys that open a `click`-triggered tooltip |
| `persistent` | `boolean` | `true` | Keep the node in the DOM after hiding |
| `transition` | `string` | `''` | Extra class name for a custom transition |
| `ariaLabel` | `string` | `''` | `aria-label` of the tooltip node |
| `focusOnTarget` | `boolean` | `false` | Move focus back to the trigger after hiding |
| `popperOptions` | `{ strategy?: 'fixed' \| 'absolute' }` | `{ strategy: 'fixed' }` | Positioning strategy: viewport or document coordinates |
| `className` | `string` | `''` | Legacy alias of `popperClass` |
| `container` | `HTMLElement` | — | Legacy alias of `appendTo` |

## Events

Pass callbacks as options (`onBeforeShow` …) or subscribe with `on()`:

```ts
tooltip.on('show', () => console.log('shown'))
tooltip.on('visibleChange', (visible) => console.log(visible))
```

| Event | Payload | Description |
| --- | --- | --- |
| `beforeShow` | `Event \| undefined` | Fired before the tooltip becomes visible |
| `show` | `Event \| undefined` | Fired after the tooltip becomes visible |
| `beforeHide` | `Event \| undefined` | Fired before hiding |
| `hide` | `Event \| undefined` | Fired after hiding |
| `visibleChange` | `boolean` | Visibility requested/changed; use it with controlled `visible` |

## Methods

| Method | Description |
| --- | --- |
| `show(content?, anchor?)` | Show the hint; empty content behaves like `hide()` |
| `hide()` | Hide immediately but keep the node (unless `persistent` is `false`) |
| `onOpen()` / `onClose()` | Same names as the exposed `el-tooltip` API |
| `isVisible()` | Whether the hint is currently visible |
| `getElement()` / `getContentElement()` | Tooltip node / content node |
| `getTrigger()` | Resolved trigger element |
| `isFocusInsideContent()` | Whether focus is inside the tooltip content |
| `updatePopper()` | Recalculate position and arrow |
| `setContent(content)` | Replace content while keeping the current state |
| `setOptions(options)` | Merge new options at runtime |
| `on(event, handler)` / `off(event, handler?)` | Subscribe / unsubscribe lifecycle events |
| `destroy()` | Remove the node, timers and listeners |

## Positioning

The node uses `position: fixed` (or `absolute` with `popperOptions.strategy`) and is placed on the anchor with the requested placement. It flips to `fallbackPlacements` (opposite side by default) when the preferred side does not fit, then shifts along the cross axis to stay inside the viewport. Position is recalculated on show, on `updatePopper()`, and on window scroll/resize while open.

The arrow follows the anchor center and is clamped by `arrowOffset`.

## Accessibility

When visible, the trigger receives `aria-describedby` pointing at the tooltip node, which carries `role="tooltip"` and an optional `aria-label`. `Escape` hides the tooltip; `focusOnTarget` returns focus to the trigger.

## Classes

`.ew-tooltip`, `.ew-tooltip--dark`, `.ew-tooltip--light`, `.ew-tooltip--visible`, `.ew-tooltip--enterable`, `.ew-tooltip__content`, `.ew-tooltip__arrow`, plus a `data-placement` attribute on both the node and the arrow. The prefix follows the `prefix` option, so a `my-` prefix produces `.my-tooltip`.

## Notes

- `el-tooltip` slots are replaced by `content` (string / `HTMLElement`) and a real trigger element (`target`); the default slot has no direct equivalent in vanilla DOM.
- `transition` accepts a class name; provide the matching CSS yourself. The default fade is built in.
- `rawContent` renders HTML as-is — sanitize untrusted input yourself.

## Examples

A complete runnable playground lives in `examples/20-tooltip.html`, covering the dark / light themes, all 12 placements, the four trigger modes, delays and auto close, controlled visibility, virtual anchors and the disabled state.

```bash
pnpm example
# open http://localhost:3000/examples/20-tooltip.html
```

## See also

- [Select](./select) — uses this package for truncated option text
- [Styles & Classes](../api/styles) — stylesheet entries and class prefix
