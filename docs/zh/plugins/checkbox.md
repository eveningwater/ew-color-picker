---
title: Checkbox 复选框插件
description: Checkbox 插件与独立复选框组件：配置项、方法、无障碍与样式。
---

# Checkbox 复选框

`@ew-color-picker/checkbox` 包含两部分：

1. **插件** `ewColorPickerCheckbox` —— 在提供 `checkboxLabel` 时，于底部行渲染一个复选框；
2. **组件** `Checkbox` —— 可独立使用的受控复选框，内部保留原生 `input[type=checkbox]` 的语义与键盘能力，外观由自定义方块呈现。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/checkbox` |
| `pluginName` | `ewColorPickerCheckbox` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` → `.ew-color-picker-bottom-row`（仅在设置 `checkboxLabel` 时渲染） |
| 访问实例 | `core.plugins.ewColorPickerCheckbox` |

::: warning 需要额外样式
```ts
import '@ew-color-picker/style/dist/checkbox.css'
```
未引入时复选框没有样式。
:::

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showCheckbox` | `boolean` | `true` | `false` 时隐藏复选框 |
| `checkboxLabel` | `string` | `undefined` | 文本；为空时不渲染 |
| `checkboxChecked` | `boolean` | `false` | 初始选中状态 |
| `checkboxDisabled` | `boolean` | `false` | 禁用交互 |
| `onCheckboxChange` | `(checked: boolean) => void` | - | 用户切换后触发 |

```ts
import ewColorPicker from '@ew-color-picker/core'
import Checkbox from '@ew-color-picker/checkbox'

ewColorPicker.use(Checkbox)

new ewColorPicker({
  el: '#app',
  checkboxLabel: '反向渐变',
  checkboxChecked: true,
  onCheckboxChange: (checked) => console.log(checked),
})
```

## 插件方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `createCheckbox` | `(options) => Checkbox` | 创建组件实例 |
| `updateOptions` | `() => void` | 重新读取配置并重新渲染 |
| `run` | `() => void` | 在有文本时渲染复选框 |
| `destroy` | `() => void` | 移除复选框并释放事件 |

## Checkbox 组件

```ts
import { Checkbox } from '@ew-color-picker/checkbox'
```

### 配置项

| 配置 | 类型 | 默认值 |
| --- | --- | --- |
| `checked` | `boolean` | `false` |
| `label` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` |
| `prefix` | `string` | `'ew-'` |
| `onChange` | `(checked: boolean) => void` | - |

### 方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `isChecked` | `() => boolean` | 当前选中状态 |
| `setChecked` | `(checked, triggerChange?) => void` | 设置状态；传 `false` 不触发 `onChange` |
| `setLabel` | `(label) => void` | 替换文本 |
| `setDisabled` | `(disabled) => void` | 切换禁用状态 |
| `getElement` | `() => HTMLLabelElement` | 根节点 |
| `destroy` | `() => void` | 解绑事件并移除节点 |

## 无障碍

组件把原生 `<input type="checkbox">` 视觉隐藏后包在 `<label>` 内：点击方块或文本都能切换，键盘焦点与 <kbd>Space</kbd> 也保持原生行为。原生 input 通过 `:checked` 与 `:focus-visible` 驱动自定义方块的外观，禁用状态由 `input.disabled` 与 `ew-checkbox--disabled` 类同时体现。

## DOM

```html
<label class="ew-checkbox ew-checkbox--default ew-checkbox--checked">
  <input class="ew-checkbox__input" type="checkbox" checked />
  <span class="ew-checkbox__box">
    <svg class="ew-color-picker-icon ew-checkbox__check-icon">…</svg>
  </span>
  <span class="ew-checkbox__label">反向渐变</span>
</label>
```

## 相关链接

- [Gradient 渐变](./gradient.md) · [Select 下拉选择](./select.md) · [样式与类名](../api/styles.md)
