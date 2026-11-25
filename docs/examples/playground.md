---
title: Online Playground
description: Edit and run every ew-color-picker example right in the browser.
---

# Online Playground

24 presets cover the basics, layout and orientation, events, panel placement, plugins, and the standalone Input / Button / Select / InputNumber / Tooltip components. The playground runs in its own window: pick a preset, edit the HTML / CSS / JS, and check the preview on the right.

<a class="playground-entry" href="../../playground.html" target="_blank" rel="noopener">Open the Playground ↗</a>

::: tip Notes
- The playground is a standalone page that opens in a new window; this site only links to it.
- Presets load the published UMD bundle from unpkg, so no local install is required.
- The editor is provided by `ew-iframe-editor` and uses `ew-code-editor` by default.
- Every preset also has a full page under the repository's `examples/` directory.
:::

## Covered examples

| No. | Examples |
| --- | --- |
| 01 - 05 | Basics, size and orientation, predefined colors, buttons, events and callbacks |
| 06 - 10 | Panel placement, animation, disabled state, color mode, instance API |
| 11 - 15 | InputNumber, multiple instances, eyedropper, copy color, Select plugin |
| 16 - 20 | Gradient, Checkbox, panel boundary, panel mode, standalone Tooltip |
| 21 - 24 | Standalone Select / Input / Button, UMD bundle |

## Powered by ew-iframe-editor

The editor on this page is built with [ew-iframe-editor](https://eveningwater.github.io/ew-iframe-editor/). It embeds an online code editor through an adapter, accepts inline code or a `requestUrl`, defaults to `ew-code-editor`, and lets you plug in your own editor.

```bash
pnpm add ew-iframe-editor
```

```ts
import { createEditor } from 'ew-iframe-editor'

const { iframe, destroy } = createEditor({
  container: '#editor',
  code: {
    html: '<div id="app"></div>',
    css: 'body { font-family: sans-serif; }',
    js: 'console.log("hello")',
  },
})
```

## Related

- [Live demo](./demo.md)
- [Examples index](./index.md)
- [ew-iframe-editor live demo](https://eveningwater.github.io/ew-iframe-editor/)
