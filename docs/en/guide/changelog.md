---
title: Changelog
description: Release notes for ew-color-picker, including fixes, features and documentation updates.
---

# Changelog

## 2.0.1

> These changes are merged into the main branch and reflected in the docs site. The npm packages are not published yet and will be released together with further fixes.

### Fixes

- Fixed plugin switches being overridden: `ewColorPickerPanel: false` and `ewColorPickerColorMode: false` (or an object config) were replaced by defaults and did not take effect
- Panel container now declares `box-sizing: content-box`, no longer relying on the host global `box-sizing` reset
- Removed viewport media queries (`max-width: 768px`) that hard-coded panel, input and preset sizes; inner sizes are now driven solely by `--panel-width` / `--panel-height`
- Predefined swatches now use flex wrapping; removed the hard-coded "10 per row" rule that caused wrong wrapping when the swatch count or container width changed

### Features

- New `appendTo` option: mount the panel container into `document.body` or any container to avoid `overflow` clipping by dialogs, drawers and scroll containers. The panel then uses viewport-relative positioning, still honors `panelPlacement` with boundary flipping, and re-positions on scroll or resize

### Documentation

- Corrected predefined swatch and number input class names to match the source
- Removed the non-existent nested `ewColorPickerBox` config in favor of top-level options
- Corrected the prerequisites of `autoPanelPosition`
- Added `appendTo` documentation (Chinese and English)

## 2.0.0

First stable release: core + plugin architecture, 14 packages (13 scoped packages plus the unscoped `ew-color-picker` entry package), bilingual docs site and live demo.
