---
title: Changelog
description: Release notes for ew-color-picker, including fixes, features and documentation updates.
---

# Changelog

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
