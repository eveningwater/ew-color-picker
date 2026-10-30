---
title: Installation
description: Install ew-color-picker via npm, pnpm, yarn, UMD script, or per-package imports. Requires Node 20.10+ for development.
---

# Installation

## Requirements

| Item | Requirement |
| --- | --- |
| Node.js | 20.10+ (for building and running the docs) |
| Package manager | pnpm (workspace) / npm / yarn |
| Browser | Any modern browser (ES2019+) |

## All-in-one bundle

```bash
pnpm add @ew-color-picker/ew-color-picker @ew-color-picker/style
```

```ts
import ewColorPicker from '@ew-color-picker/ew-color-picker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

const picker = new ewColorPicker({ el: '#app' })
```

::: warning Two stylesheets
`index.css` covers the picker. `input-number.css` is required for the numeric inputs used by RGB/HSL modes. Import both.
:::

To keep the v1 package name, install the unscoped entry package instead — it is equivalent:

```bash
npm install ew-color-picker
```

::: tip About the package name
`ew-color-picker` is a thin compatibility entry for v2. It only forwards to `@ew-color-picker/ew-color-picker` and `@ew-color-picker/style`; it contains no implementation code.
:::

## Upgrading from v1

v2 is a breaking rewrite; v1 and v2 APIs cannot be mixed:

- **Architecture**: v1 was a single configurable package; v2 splits into 13 packages where every UI part is a plugin, composable via `Core.use(Plugin)`
- **Package name**: `ew-color-picker` remains the entry, but now points to `@ew-color-picker/ew-color-picker`
- **Styles**: both `index.css` and `input-number.css` must be imported explicitly
- **Options and events**: plugin options such as `hasAlpha` and `hasBox` differ from v1; re-integrate against the live demo on this site

To stay on the old version, pin `ew-color-picker@1`; the v1 source is preserved on the `v1` branch.

## Per-package imports

The core has no UI. Register only what you need:

```bash
pnpm add @ew-color-picker/core @ew-color-picker/style \
  @ew-color-picker/box @ew-color-picker/panel @ew-color-picker/hue \
  @ew-color-picker/input @ew-color-picker/button
```

```ts
import ewColorPicker from '@ew-color-picker/core'
import Box from '@ew-color-picker/box'
import Panel from '@ew-color-picker/panel'
import Hue from '@ew-color-picker/hue'
import Input from '@ew-color-picker/input'
import Button from '@ew-color-picker/button'

ewColorPicker.use(Box).use(Panel).use(Hue).use(Input).use(Button)

new ewColorPicker({ el: '#app' })
```

`use()` returns the class itself, so calls can be chained. It is idempotent — registering the same constructor twice does nothing.

## UMD via `<script>`

```html
<link rel="stylesheet" href="https://unpkg.com/@ew-color-picker/style/dist/index.css" />
<link rel="stylesheet" href="https://unpkg.com/@ew-color-picker/style/dist/input-number.css" />

<div id="app"></div>

<script src="https://unpkg.com/@ew-color-picker/ew-color-picker/dist/index.min.js"></script>
<script>
  const picker = new ewColorPicker({ el: '#app', defaultColor: '#3b82f6' })
</script>
```

The UMD build exposes `window.ewColorPicker`.

## TypeScript

All packages ship declaration files. Types are exported from the core and from each plugin package:

```ts
import type { ewColorPickerOptions, ewColorPickerConstructorOptions } from '@ew-color-picker/core'
import type { InputNumberOptions } from '@ew-color-picker/input-number'

const options: ewColorPickerConstructorOptions = {
  el: '#app',
  defaultColor: '#6366f1',
}
```

## Repository development

```bash
pnpm install        # install workspace dependencies
pnpm run build:all  # build every package + styles
pnpm run dev:preview# live-reload example server
pnpm run test:run   # run the full vitest suite
pnpm run docs:dev   # start the documentation site
```

## Next steps

- [Quick start](./getting-started.md)
- [Core concepts](./concepts.md)
- [Options reference](../api/options.md)
