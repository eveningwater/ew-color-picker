---
title: Select 下拉选择插件
description: Select 插件与独立下拉组件：配置项、方法、键盘操作与样式。
---

# Select 下拉选择

`@ew-color-picker/select` 包含两部分：

1. **插件** `ewColorPickerSelect` —— 在提供 `selectItems` 时，于底部行渲染一个下拉选择框；
2. **组件** `Select` —— 可独立使用的受控下拉组件，供其他插件（例如渐变编辑器）复用。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/select` |
| `pluginName` | `ewColorPickerSelect` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` → `.ew-color-picker-bottom-row`（仅在有选项时渲染） |
| 访问实例 | `core.plugins.ewColorPickerSelect` |

::: warning 需要额外样式
```ts
import '@ew-color-picker/style/dist/select.css'
```
未引入时下拉框没有样式。
:::

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showSelect` | `boolean` | `true` | `false` 时隐藏下拉框 |
| `selectItems` | `SelectOption[]` | `[]` | 选项列表；为空时不渲染 |
| `selectValue` | `string \| number` | `undefined` | 初始选中值 |
| `selectPlaceholder` | `string` | `undefined` | 未选中时显示的占位文案 |
| `selectClearable` | `boolean` | `true` | 选中值后是否显示清空图标 |
| `onSelectChange` | `(value, option) => void` | - | 用户选择后触发 |
| `onSelectClear` | `() => void` | - | 用户清空选中项后触发 |

```ts
import ewColorPicker from '@ew-color-picker/core'
import Select from '@ew-color-picker/select'

ewColorPicker.use(Select)

new ewColorPicker({
  el: '#app',
  selectItems: [
    { label: '线性', value: 'linear' },
    { label: '径向', value: 'radial' },
  ],
  onSelectChange: (value) => console.log(value),
  onSelectClear: () => console.log('已清空'),
})
```

## 插件方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `createSelect` | `(options) => Select` | 创建组件实例 |
| `updateOptions` | `() => void` | 重新读取配置并重新渲染 |
| `run` | `() => void` | 在有选项时渲染下拉框 |
| `destroy` | `() => void` | 移除下拉框并释放事件 |

## Select 组件

```ts
import { Select } from '@ew-color-picker/select'
```

### 配置项

| 配置 | 类型 | 默认值 |
| --- | --- | --- |
| `value` | `string \| number` | `undefined` |
| `items` | `SelectOption[]` | `[]` |
| `placeholder` | `string` | `''` |
| `disabled` | `boolean` | `false` |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` |
| `prefix` | `string` | `'ew-'` |
| `clearable` | `boolean` | `true` |
| `onChange` | `(value, option) => void` | - |
| `onClear` | `() => void` | - |
| `onOpen` / `onClose` | `() => void` | - |

`SelectOption` 为 `{ label: string; value: string | number; disabled?: boolean }`。

清空图标仅在 `clearable` 为 `true` 且已有选中值时显示。点击后会把值重置为 `undefined`、恢复占位文案、关闭下拉层并触发 `onClear`。禁用状态下不显示清空图标。

### 方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `getValue` | `() => string \| number \| undefined` | 当前值 |
| `setValue` | `(value, triggerChange?) => void` | 设置值；传 `false` 不触发 `onChange` |
| `clear` | `(triggerChange?) => void` | 清空选中值；传 `false` 不触发 `onClear` |
| `setItems` | `(items) => void` | 替换选项列表 |
| `setDisabled` | `(disabled) => void` | 切换禁用状态 |
| `open` / `close` | `() => void` | 打开 / 关闭下拉层 |
| `isDropdownOpen` | `() => boolean` | 下拉层是否打开 |
| `getElement` | `() => HTMLElement` | 根节点 |
| `destroy` | `() => void` | 解绑事件并移除节点 |

## 键盘与无障碍

| 按键 | 行为 |
| --- | --- |
| <kbd>ArrowDown</kbd> / <kbd>ArrowUp</kbd> | 打开下拉层，或在选项间移动 |
| <kbd>Enter</kbd> | 选中当前高亮项 |
| <kbd>Escape</kbd> | 关闭下拉层 |
| <kbd>Tab</kbd> | 关闭并移出焦点 |

触发器带有 `aria-haspopup="listbox"` / `aria-expanded`，选项使用 `role="option"` 并同步 `aria-selected`、`aria-disabled`。

## DOM

```html
<div class="ew-select ew-select--default">
  <button type="button" class="ew-select__trigger" aria-haspopup="listbox" aria-expanded="false">
    <span class="ew-select__value">线性</span>
    <span class="ew-select__clear" role="button" aria-label="Clear selection"><svg class="ew-select__clear-icon">…</svg></span>
    <span class="ew-select__arrow"><svg class="ew-select__arrow-icon">…</svg></span>
  </button>
  <div class="ew-select__dropdown" role="listbox">
    <div class="ew-select__option ew-select__option--selected" role="option" data-select-index="0">线性</div>
    <div class="ew-select__option" role="option" data-select-index="1">径向</div>
  </div>
</div>
```

## 相关链接

- [InputNumber 数字输入框](./input-number.md) · [插件总览](./) · [样式与类名](../api/styles.md)
