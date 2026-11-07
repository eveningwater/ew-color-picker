---
title: Changelog
description: Release notes for ew-color-picker, including fixes, features and documentation updates.
---

# Changelog

## 2.0.3

> This release has been published to npm and the docs site has been updated.

### Features

- New `@ew-color-picker/eyedropper` plugin: sample colors from anywhere on screen through the native EyeDropper API. It detects browser support, writes the result with `core.setColor()`, supports `showEyedropper` / `eyedropperText` / `onEyedropperPick`, and silently ignores `AbortError` when the user cancels
- New `@ew-color-picker/copy-color` plugin: copy the current color to the clipboard with one click. The button is filled with the current color and uses contrast-aware icons, prefers the async Clipboard API with a `execCommand` fallback, shows a short built-in success toast, and supports `showCopyColor` / `copyColorText` / `copiedText` / `onCopyColor`
- The eyedropper and copy buttons now live in their own toolbar row above the color value input, instead of sharing the row with the Clear / Sure buttons
- New `@ew-color-picker/gradient` plugin: a gradient editor with draggable stops, linear/radial/conic types, repeating gradients, angle and position controls, double-position stops, and interpolation hints (`srgb`, `srgb-linear`, `hsl`, `oklab`, `oklch`). CSS strings round-trip through `parseGradient` / `serializeGradient`, and the editor is hidden unless `showGradient: true` or `gradient` / `gradientStops` is provided
- New `@ew-color-picker/checkbox` component and plugin: replaces the native checkbox visual with a themed box while keeping the underlying native input for semantics and keyboard support. The plugin renders in the bottom row when `checkboxLabel` is provided and supports `showCheckbox` / `checkboxChecked` / `checkboxDisabled` / `onCheckboxChange`

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
