---
title: Tooltip
description: Standalone tooltip utility used by Select and other plugins — options, methods and positioning.
---

# Tooltip

`@ew-color-picker/tooltip` is the floating hint used by Select (when the selected value or an option is truncated) and available to any other component you build. It is a plain DOM utility, not a core plugin: import it wherever you need a tooltip.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/tooltip` |
| Class | `Tooltip` |
| Helper | `isTextTruncated(el)` |
| Styles | `@ew-color-picker/style/dist/tooltip.css` |

::: warning Extra stylesheet
```ts
import '@ew-color-picker/style/dist/tooltip.css'
```
The Select and Gradient components rely on it as well.
:::

## Usage

```ts
import Tooltip, { isTextTruncated } from '@ew-color-picker/tooltip'

const tooltip = new Tooltip({ prefix: 'ew-' })

if (isTextTruncated(target)) {
  tooltip.show(target.textContent!.trim(), target)
}

// hide without removing the node
tooltip.hide()

// remove the node when the owner is destroyed
tooltip.destroy()
```

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `prefix` | `string` | `'ew-'` | Class prefix; keep it in sync with the picker prefix |
| `container` | `HTMLElement` | `document.body` | Parent element the tooltip node is appended to |
| `offset` | `number` | `6` | Gap between the tooltip and its anchor, in px |
| `className` | `string` | `''` | Extra class name applied to the tooltip node |

## Methods

| Method | Description |
| --- | --- |
| `show(text, anchor)` | Show the hint; empty text behaves like `hide()` |
| `hide()` | Hide the hint but keep the node |
| `isVisible()` | Whether the hint is currently visible |
| `getElement()` | Return the tooltip node |
| `destroy()` | Remove the node and release the instance |

## Positioning

The node is `position: fixed` and sits above the anchor. `show()` measures the node and flips it below the anchor (adding the `--bottom` modifier) when there is not enough room above. Position is recalculated on every `show()` call.

## Classes

`.ew-tooltip`, `.ew-tooltip--visible` and `.ew-tooltip--bottom`. The prefix follows the `prefix` option, so a `my-` prefix produces `.my-tooltip`.

## See also

- [Select](./select) — uses this package for truncated option text
- [Styles & Classes](../api/styles) — stylesheet entries and class prefix
