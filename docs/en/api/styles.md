---
title: Styles & Classes
description: Stylesheet entries, CSS variables, class name groups and theming tips for ew-color-picker.
---

# Styles & Classes

## Stylesheet entries

| File | Required | Contents |
| --- | --- | --- |
| `@ew-color-picker/style/dist/index.css` | Yes | Picker, box, panel, sliders, buttons, mode switcher, predefine |
| `@ew-color-picker/style/dist/input-number.css` | Yes for numeric inputs | InputNumber component |

```ts
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'
```

::: warning
Importing only `index.css` leaves RGB/HSL numeric inputs unstyled.
:::

## CSS variables

| Variable | Set on | Default | Description |
| --- | --- | --- | --- |
| `--panel-width` | `.ew-color-picker-panel` | computed (285/302/320px) | Panel width |
| `--panel-height` | `.ew-color-picker-panel` | `180px` | Panel height |

Override them after importing the styles:

```css
.ew-color-picker .ew-color-picker-panel {
  --panel-width: 320px;
  --panel-height: 200px;
}
```

## Class reference

### Container

| Class | Description |
| --- | --- |
| `.ew-color-picker` | Root container |
| `.ew-color-picker-panel-container` | Panel container (absolute) |
| `.ew-color-picker-panel-container-hidden` | Hidden state |
| `.ew-color-picker-bottom-row` | Bottom row that hosts inputs and buttons |

### Box

| Class | Description |
| --- | --- |
| `.ew-color-picker-box` | Trigger swatch |
| `.ew-color-picker-box-arrow-icon` | Default "has color" icon |
| `.ew-color-picker-box-close-icon` | Default "no color" icon |
| `.is-disabled` / `.is-readonly` | States |

### Panel

| Class | Description |
| --- | --- |
| `.ew-color-picker-panel` | 2D panel |
| `.ew-color-picker-panel-dynamic-size` | Dynamic size marker |
| `.ew-color-picker-white-panel` / `.ew-color-picker-black-panel` | Gradient layers |
| `.ew-color-picker-panel-cursor` | Drag cursor |

### Sliders

| Class | Description |
| --- | --- |
| `.ew-color-picker-slider` | Hue slider root |
| `.ew-color-picker-is-horizontal` / `.ew-color-picker-is-vertical` | Orientation |
| `.ew-color-picker-slider-bar` | Hue gradient bar |
| `.ew-color-picker-slider-thumb` | Hue thumb |
| `.ew-color-picker-slider.ew-alpha` | Alpha slider root |
| `.ew-color-picker-alpha-slider-wrapper` | Checkerboard + gradient wrapper |
| `.ew-color-picker-alpha-slider-bg` / `.ew-color-picker-alpha-slider-bar` | Layers |
| `.ew-color-picker-alpha-slider-thumb` | Alpha thumb |

### Input & buttons

| Class | Description |
| --- | --- |
| `.ew-color-picker-input-container` / `-flex` | Text input container |
| `.ew-color-picker-input` | Text input |
| `.ew-color-picker-input-default` | Default (hex) input |
| `.ew-input-disabled` | Disabled text input |
| `.ew-color-picker-drop-btn-group` / `-multi` / `-single` | Button group |
| `.ew-color-picker-clear-btn` | Clear button |
| `.ew-color-picker-sure-btn` | Sure button |
| `.ew-color-picker-drop-btn` | Shared button style |

### Color mode

| Class | Description |
| --- | --- |
| `.ew-color-picker-mode-container` | Mode switcher |
| `.ew-color-picker-mode-up-btn` / `-down-btn` | Arrows |
| `.ew-color-picker-mode-text` | Current mode label |
| `.ew-color-picker-inputs-group` | Channel group |
| `.ew-color-picker-inputs-col` | One channel column |
| `.ew-color-picker-input-label` | Channel label |

### Predefine

| Class | Description |
| --- | --- |
| `.ew-color-picker-predefine-container` | Swatch container |
| `.ew-color-picker-predefine-color` | Swatch wrapper |
| `.ew-color-picker-predefine-color-item` | Color fill |
| `.ew-color-picker-predefine-color-disabled` | Disabled swatch |
| `.ew-color-picker-predefine-color-active` | Selected swatch |

### InputNumber

| Class | Description |
| --- | --- |
| `.ew-input-number` | Root |
| `.ew-input-number--small` / `--default` / `--large` | Sizes |
| `.ew-input-number--focused` / `--disabled` | States |
| `.ew-input-number__input` | Input |
| `.ew-input-number__buttons` | Stepper container |
| `.ew-input-number__button--up` / `--down` | Steppers |

## Theming example

```css
/* Brand buttons */
.ew-color-picker-sure-btn {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: #fff;
}

/* Rounded trigger */
.ew-color-picker-box {
  border-radius: 12px;
}

/* Bigger panel */
.ew-color-picker-panel {
  --panel-width: 340px;
  --panel-height: 200px;
}
```

## Multi-instance isolation

Class names are global. If you need per-instance styling, pass a `className` (Box) or scope styles to a wrapper:

```html
<div class="theme-dark">
  <div id="picker"></div>
</div>
```

```css
.theme-dark .ew-color-picker-panel {
  background: #111827;
}
```

## Next steps

- [Options](./options.md)
- [Box plugin](../plugins/box.md)
- [InputNumber plugin](../plugins/input-number.md)
