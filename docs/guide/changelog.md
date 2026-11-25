---
title: Changelog
description: Release notes for ew-color-picker, including fixes, features and documentation updates.
---

# Changelog

## 2.0.11

### Features

- `@ew-color-picker/tooltip` now matches `el-tooltip`: 12 placements with automatic viewport flipping/shifting, `dark` / `light` effects, arrow, `hover` / `click` / `focus` / `contextmenu` triggers, show/hide delays, auto close, controlled visibility, virtual triggering, keyboard support and lifecycle events
- Added `examples/20-tooltip.html`, covering themes, all 12 placements, the four trigger modes, delays and auto close, controlled visibility, virtual anchors and the disabled state
- Added `clamp` and a `placement` module to `@ew-color-picker/utils` (`Placement`, `PlacementSide`, `PlacementAlign`, `PLACEMENTS`, `isPlacement`, `parsePlacement`)

### Refactor

- Moved the shared placement parsing and numeric helpers out of tooltip into `@ew-color-picker/utils`; tooltip keeps re-exporting `isTextTruncated` for backwards compatibility
- Tooltip now uses the utils helpers `$`, `getRect`, `getElementSize`, `getAttr` / `setAttr`, `isString`, `isFunction`, `isBoolean` and `isArray`

### Fixes

- Tuned the select truncation hint to a 6px gap from its trigger and disabled `enterable`, so the floating panel no longer blocks the dropdown interaction
- Tooltip position is now recalculated on scroll/resize while open, batched per animation frame to avoid high-frequency reflow and stale positions
- Tooltip now toggles `visibility` when hiding, so no invisible interaction layer is left behind; with `persistent: false` the node is removed after hiding

### Tests

- Added 75 tooltip unit tests covering positioning and flipping, arrow placement, trigger modes, runtime options, lifecycle and events
- Added unit tests for the `clamp` and `placement` helpers and for `isTextTruncated`

### Docs

- Documented declarative/imperative usage, the full option table, events, methods and positioning rules in the English and Chinese tooltip guides, noting that the helpers are also exported by `@ew-color-picker/utils`
- Added a tooltip example page and linked it from the examples navigation

## 2.0.10

### Features

- Added the `panelMode` option: `'mini' | 'small' | 'medium' | 'large'`, defaulting to `large` (unchanged behaviour). `mini` is designed for mobile. Sliders, cursors, inputs, buttons, predefine swatches, the gradient editor and the mode switcher all scale with the selected mode
- Added a tooltip to the select component: when the selected value or an option label is truncated, hovering shows the full text. Enabled by default; disable with `selectTooltip: false`
- Added `examples/19-panel-mode.html`, covering every combination of `panelMode`, horizontal hue/alpha and gradients

### Fixes

- Fixed the panel and the vertical hue/alpha sliders wrapping onto a new line in smaller modes: the panel container is now a vertical flex container and the panel plus sliders live in a single-row `top-row`
- Fixed wrong panel widths in horizontal mode for smaller modes: the horizontal extra width was always calculated from the `large` base width, making `mini`/`small`/`medium` as wide as `large`
- Fixed the animation module hard-coding `display: block` when showing the panel, which overrode the stylesheet layout: the animation module now saves and restores the element's original `display`, while showing/hiding is handled by the core through the `hidden` class
- Fixed the absolutely positioned panel being stretched to the page width: the container now shrinks with `fit-content`, the panel/slider gaps are tighter, and no empty space is left on the right
- Fixed RGBA/HSL inputs not fitting on one line in smaller modes: `mini`/`small`/`medium` now use a two-row 2×2 layout with inputs that adapt to the container width
- Fixed the gradient editor layout at smaller sizes: the type row uses a two-row grid, and the stop row is forced onto one line with its two number inputs sharing the remaining space
- Fixed hard-coded sizes and font sizes in input-number, select, checkbox and the mode switcher that were too large in smaller modes; they are now CSS variables that scale with the mode

### Tests

- Added select tooltip tests: shown when truncated, hidden when it fits, disabled via `selectTooltip: false`, and cleaned up on destroy

### Docs

- Documented the `selectTooltip` option in the English and Chinese select guides

## 2.0.9

### Fixes

- Fixed the vertical hue slider being out of sync with the colour panel: the stylesheet gradient increases hue from top to bottom (`linear-gradient(180deg, ...)`), but the thumb position and click/drag mapping used the inverted `1 - hue / 360` formula. The thumb now sits on the matching colour, and clicking or dragging picks the hue you actually see
- Fixed the alpha slider having no colour: the background layer only showed the transparency checkerboard, so the alpha track gave no visual feedback. It now renders a gradient from the fully opaque current colour to transparent, following the horizontal or vertical direction, and updates whenever the colour changes
- Fixed the console banner printing a stale version (`2.0.7`). The version is now injected from `package.json` at build time, so it can no longer drift from the published release

### Tests

- Added regression tests for the vertical hue thumb position and click mapping, the alpha gradient direction in both orientations, and the console banner version

## 2.0.8

### Fixes

- Fixed arrow and close icon positioning for users who load the static CSS via `<link>`: the icon rules were only injected at runtime by the core entry, so the SCSS build (`@ew-color-picker/style`) was missing them and the arrow rendered off-center. The rules are now in the SCSS source as well
- Arrow icon `fill` changed from hard-coded `#666666` to `currentColor`, so icons inherit the theme text color
- Fixed the empty root container taking up `line-height` height when `hasBox: false` is used together with `appendTo`: the `.ew-color-picker` shell is now hidden via `:empty { display: none }` and reappears automatically once the box is rendered
- Fixed panel positioning when `hasBox: false`: the panel anchor now falls back from the box to the user-supplied `el` container (and only then to the root element), so the panel is no longer positioned against a 0-size empty shell
- Fixed `showPanel`/`hidePanel` not being idempotent: calling `showPanel` while the panel was already open re-ran the open animation, which briefly reset the panel height to `0` and made it look like the panel closed. Both methods now return early when the panel is already in the target state

### Docs

- Added npm version, downloads, license, build, TypeScript and stars badges to both READMEs
- Added a live demo screenshot to both READMEs

## 2.0.7

### Fixes

- Fixed the picker panel being covered by overlay masks in Element Plus Dialog and similar layered containers: the panel `z-index` was fixed at `1000` in the stylesheet while overlay libraries start at `2000` and increase on every open. The panel now raises its inline `z-index` to one above the highest ancestor level each time it opens, leaves normal pages to the stylesheet default, and falls back silently if reading or writing styles fails

### Tests

- Added regression tests for automatic `z-index` elevation inside layered containers, recomputation on repeated opens, and the untouched inline style on normal pages

## 2.0.6

### Fixes

- Fixed `colorRgbaToHsva` turning a valid alpha of `0` into `1` (`parseFloat(...) || 1` treated `0` as falsy), which made fully transparent colors opaque once hue or saturation/value was adjusted and made `getHsvaColor()` return `a: 1`
- Fixed `colorRgbaToHsla` returning `colorObj.h` on the internal `0-6` scale instead of degrees, which broke the round trip through `colorHslaToRgba` (e.g. green `rgba(0, 202, 136, 1)` came back as `rgba(204, 10, 0, 1)`)

### Tests

- Added regression tests for the `rgba(..., 0)` round trip, the unparseable-alpha fallback and the HSL hue / round trip

### Release

- Added a GitHub Actions CI workflow running dependency install, the full test suite and a full package build on pushes and pull requests to `master`
- Declared `rimraf` as a dev dependency of `utils` and `core` so clean builds work under pnpm's strict `node_modules` layout

## 2.0.5

### Fixes

- Fixed panel positioning inside drawers, modals and scroll containers: new `boundary` option accepts a CSS selector or HTMLElement, clamping the panel within that container's visible area instead of only the viewport
- Fixed `document.mousedown` listener leaking after `destroy()` when the panel show timer fired after destruction; the callback now bails out if the instance is already destroyed
- Fixed root `build:xxx` shortcuts silently doing nothing (`pnpm -r build:xxx` matched no package scripts); replaced with `pnpm --filter <pkg> build` and added missing shortcuts for gradient, select, checkbox, copy-color and input-number

### Refactor

- Consolidated drag logic into `utils/drag.ts`: new `getRatio`, `bindMouseDrag` and `bindTouchDrag` utilities, reused by hue, alpha, panel and gradient; eliminates ~10 `as EventListener` casts
- Extracted `DEFAULT_PANEL_WIDTH` / `DEFAULT_PANEL_HEIGHT` constants, replacing 7 hard-coded `285 / 180` occurrences across panel and gradient
- Unified on utility functions: `isString` / `isObject` / `isBoolean` / `isNumber` replace raw `typeof` checks; `$` and `getRect` replace direct `querySelector` / `getBoundingClientRect` calls
- Removed `as any` casts in plugin options initialization; `install(core: any)` aligned to `install(core: ewColorPicker)` across all plugins
- `getPrefix` now uses `isString` and accepts `ewColorPicker` instance type instead of `any`
- Removed unused `eventType` dead code from utils
- Documented the implicit `applyOrder` sorting convention: plugins without `applyOrder` default to 0 and run before all `Post` plugins

### Docs

- Added `boundary` option documentation (English and Chinese) with usage examples
- Added example page `18-panel-boundary.html` demonstrating container-bound panel positioning
- Fixed docs site footer friend links showing Chinese text on the English version
- Added missing example navigation links (15-18) to the examples index

### Release

- Added `prepublishOnly: "npm run build"` to all packages so dist is rebuilt before every publish

## 2.0.4

### Features

- New `@ew-color-picker/select` component and plugin: custom option lists with placeholder, sizes, keyboard navigation, click-outside closing and ARIA support, an optional clear icon via `selectClearable`, and `selectItems` / `selectValue` / `selectPlaceholder` / `onSelectChange` / `onSelectClear` options. Renders only when `selectItems` is non-empty
- New `@ew-color-picker/gradient` plugin: a gradient editor with draggable stops, linear/radial/conic types, repeating gradients, angle and position controls, double-position stops, and interpolation hints (`srgb`, `srgb-linear`, `hsl`, `oklab`, `oklch`). CSS strings round-trip through `parseGradient` / `serializeGradient`, and the editor is hidden unless `showGradient: true` or `gradient` / `gradientStops` is provided
- New `@ew-color-picker/checkbox` component and plugin: replaces the native checkbox visual with a themed box while keeping the underlying native input for semantics and keyboard support. The plugin renders in the bottom row when `checkboxLabel` is provided and supports `showCheckbox` / `checkboxChecked` / `checkboxDisabled` / `onCheckboxChange`
- The aggregate package now exports a `createEwColorPicker(options)` factory, and the `ew-color-picker` compat entry exposes the same factory

### Fixes

- Fixed `defaultColor` handling: instance plugins are not created yet at that point, so the check now reads the static plugin registry to see whether the alpha plugin is registered; without alpha, an rgba default correctly falls back to hex
- Fixed the hue bar background, panel cursor and hue / alpha thumb positions being wrong when the panel opens without an initial color (or with a color set later): everything is re-synced against the current color once the panel is shown
- Fixed the panel width calculation for different hue / alpha direction combinations, which pushed same-row elements onto a new line and misaligned the edges
- Fixed `colorRgbaToHsva` only accepting rgba strings; it now also handles hex / rgb / color keywords
- Fixed the gradient editor stop-row layout: number inputs clipped their values and the Remove / Add buttons were pushed onto a new line; inputs are now wider with compact steppers and tighter gaps so everything fits on one row

## 2.0.3

> This release has been published to npm and the docs site has been updated.

### Features

- New `@ew-color-picker/eyedropper` plugin: sample colors from anywhere on screen through the native EyeDropper API. It detects browser support, writes the result with `core.setColor()`, supports `showEyedropper` / `eyedropperText` / `onEyedropperPick`, and silently ignores `AbortError` when the user cancels
- New `@ew-color-picker/copy-color` plugin: copy the current color to the clipboard with one click. The button is filled with the current color and uses contrast-aware icons, prefers the async Clipboard API with a `execCommand` fallback, shows a short built-in success toast, and supports `showCopyColor` / `copyColorText` / `copiedText` / `onCopyColor`
- The eyedropper and copy buttons now live in their own toolbar row above the color value input, instead of sharing the row with the Clear / Sure buttons

### Fixes

- Fixed the InputNumber stepper arrows: they now carry the correct icon class and render at 10px, staying centered inside the button instead of overflowing and being clipped by the divider
- Fixed RGB / HSL channel inputs resetting to `0` on the first stepper click; internal values are now synced with the current color so increment/decrement starts from the current channel value

## 2.0.2

### Fixes

- Published package manifests now reference the matching release version (`^2.0.2`) for internal dependencies instead of the stale `^2.0.0` range. This prevents mixed installs where a 2.0.1 plugin resolved an older `@ew-color-picker/utils` that did not export `getPrefix`

## 2.0.1

> These changes have been published to npm and are reflected in the docs site.

### Fixes

- Fixed plugin switches being overridden: `ewColorPickerPanel: false` and `ewColorPickerColorMode: false` (or an object config) were replaced by defaults and did not take effect
- Panel container now declares `box-sizing: content-box`, no longer relying on the host global `box-sizing` reset
- Removed viewport media queries (`max-width: 768px`) that hard-coded panel, input and preset sizes; inner sizes are now driven solely by `--panel-width` / `--panel-height`
- Predefined swatches now use flex wrapping; removed the hard-coded "10 per row" rule that caused wrong wrapping when the swatch count or container width changed
- `use()` now deduplicates by `pluginName`, preventing duplicate registration under HMR, repeated imports or multiple entry points
- Plugin constructor errors are now reported through `console.warn` with the plugin name and error details instead of being silently swallowed, making custom plugin debugging easier

### Features

- New `appendTo` option: mount the panel container into `document.body` or any container to avoid `overflow` clipping by dialogs, drawers and scroll containers. The panel then uses viewport-relative positioning, still honors `panelPlacement` with boundary flipping, and re-positions on scroll or resize
- New `prefix` option: customize the prefix of every CSS class name (default `ew-`) to avoid style collisions when embedding the picker in another library. The SCSS build exposes a matching `$prefix` variable that must stay in sync with the JS option
- `ApplyOrder` changed from `const enum` to a regular enum, so it can be imported at runtime from `@ew-color-picker/utils` without hand-writing `'pre'` / `'post'` strings

### Documentation

- Corrected predefined swatch and number input class names to match the source
- Removed the non-existent nested `ewColorPickerBox` config in favor of top-level options
- Corrected the prerequisites of `autoPanelPosition`
- Added `appendTo` documentation (Chinese and English)
- Added `prefix` documentation (Chinese and English) with a custom SCSS build example
- Added `applyOrder` execution-order documentation and examples (Chinese and English)
- The docs site now defaults to English; Chinese docs moved under `/zh/`, and the README defaults to English

## 2.0.0

First stable release: core + plugin architecture, 14 packages (13 scoped packages plus the unscoped `ew-color-picker` entry package), bilingual docs site and live demo.
