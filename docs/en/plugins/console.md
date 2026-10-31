---
title: Console Plugin
description: The Console plugin prints a styled version banner once per page and can be omitted by registering plugins manually.
---

# Console

`ewColorPickerConsole` prints a styled banner (version, QQ, WeChat, GitHub) in the browser console. It has no UI.

| Item | Value |
| --- | --- |
| Package | `@ew-color-picker/utils` (exports `Console`) |
| `pluginName` | `ewColorPickerConsole` |
| `applyOrder` | not declared (registered first in the bundle) |
| Mount point | none |
| Instance | `core.plugins.ewColorPickerConsole` |

## Printed once

A module-level flag ensures only the first instance prints:

```ts
let hasPrintedTips = false

run() {
  if (hasPrintedTips) return
  hasPrintedTips = true
  log(...tips)
}
```

## Disabling

Console has no options object (`{}`). To skip it, register plugins manually:

```ts
import ewColorPicker from '@ew-color-picker/core'
import Box from '@ew-color-picker/box'

ewColorPicker.use(Box) // Console not imported → no banner
```

With the all-in-one bundle it is always registered.

## Output

```text
 ew-color-picker@2.0.1   QQ: 854806732  WeChat: eveningwater  github:https://github.com/eveningwater/ew-color-picker
```

## Methods

| Method | Description |
| --- | --- |
| `handleOptions` | Merge core options (no-op today) |
| `run` | Print banner (guarded) |
| `install` | Compatibility for manual `install(core)` |

## Related

- [Plugin overview](./index.md) · [Writing a plugin](../guide/plugin-dev.md)
