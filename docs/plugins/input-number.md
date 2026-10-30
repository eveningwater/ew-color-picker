---
title: InputNumber 数字输入框插件
description: InputNumber 插件与底层 InputNumber 组件的配置、方法、尺寸与事件，用于 RGB/HSL 分通道数值输入。
---

# InputNumber 数字输入框

`@ew-color-picker/input-number` 包含两部分：

1. **插件** `ewColorPickerInputNumber`：随聚合包自动注册，把一个数字输入框挂到面板底部行；
2. **组件** `InputNumber`：可独立使用的受控数字输入组件，ColorMode 插件在 RGB/HSL 模式下用它构建分通道输入组。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/input-number` |
| `pluginName` | `ewColorPickerInputNumber` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` → `.ew-color-picker-bottom-row` |
| 访问实例 | `core.plugins.ewColorPickerInputNumber` |

::: warning 必须引入额外样式
数字输入框的样式在独立文件中：

```ts
import '@ew-color-picker/style/dist/input-number.css'
```

只引入 `index.css` 会导致输入框无样式。
:::

## 插件配置

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | 禁用所有由该插件管理的数字输入框 |

插件读取核心的 `disabled` 并同步给已创建的输入框。

## 插件方法

```ts
const inputNumberPlugin = picker.plugins.ewColorPickerInputNumber
```

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `createInputNumber` | `(options: InputNumberOptions) => InputNumber` | 创建一个数字输入组件实例 |
| `updateOptions` | `() => void` | 重新读取核心配置并把 `disabled` 应用到所有实例 |
| `run` | `() => void` | 创建默认实例并挂到底部行 |
| `destroy` | `() => void` | 销毁全部实例并清空引用 |

## InputNumber 组件

```ts
import { InputNumber } from '@ew-color-picker/input-number'
```

### 构造配置

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `number` | `0` | 初始值 |
| `min` | `number` | `-Infinity` | 最小值 |
| `max` | `number` | `Infinity` | 最大值 |
| `step` | `number` | `1` | 步进值 |
| `precision` | `number` | `0` | 小数位数 |
| `disabled` | `boolean` | `false` | 禁用 |
| `placeholder` | `string` | `''` | 占位符 |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | 尺寸 |
| `onChange` | `(value: number) => void` | — | 值变化回调（防抖 300ms） |
| `onBlur` | `(value: number) => void` | — | 失焦回调 |
| `onFocus` | `(event: FocusEvent) => void` | — | 聚焦回调 |

### 组件方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `getValue` | `() => number` | 读取当前值 |
| `setValue` | `(value: number) => void` | 设置值（会按 `min`/`max`/`precision` 规整） |
| `setDisabled` | `(disabled: boolean) => void` | 切换禁用态 |
| `getElement` | `() => HTMLElement` | 获取根 DOM，便于自行挂载 |
| `destroy` | `() => void` | 解绑事件并移除 DOM |

### 独立使用示例

```ts
import { InputNumber } from '@ew-color-picker/input-number'
import '@ew-color-picker/style/dist/input-number.css'

const num = new InputNumber({
  value: 50,
  min: 0,
  max: 100,
  step: 1,
  precision: 0,
  placeholder: '饱和度',
  onChange: (v) => console.log('新值', v),
})

document.body.appendChild(num.getElement())
```

::: tip 初始化不触发 onChange
构造时会直接同步显示值，但**不会**调用 `onChange`，避免实例创建阶段误改颜色。只有用户交互才会触发。
:::

## DOM 结构

```html
<div class="ew-input-number ew-input-number--default">
  <input class="ew-input-number__input" type="text" inputmode="decimal" />
  <div class="ew-input-number__buttons">
    <button class="ew-input-number__button ew-input-number__button--up"></button>
    <button class="ew-input-number__button ew-input-number__button--down"></button>
  </div>
</div>
```

| 类名 | 说明 |
| --- | --- |
| `.ew-input-number` | 根节点 |
| `.ew-input-number--small` / `--default` / `--large` | 尺寸 |
| `.ew-input-number--focused` | 聚焦态 |
| `.ew-input-number--disabled` | 禁用态 |
| `.ew-input-number__input` | 输入框 |
| `.ew-input-number__buttons` | 上下步进按钮容器 |
| `.ew-input-number__button--up` / `--down` | 步进按钮 |

## 与 ColorMode 的关系

ColorMode 在 RGB/HSL 模式下会：

1. 调用 `createInputNumber` 创建 R/G/B/A 或 H/S/L/A 输入组；
2. 把多个 `InputNumber` 放进 `.ew-color-picker-inputs-group`；
3. 任一输入变化后合成颜色并调用 `core.setColor()`。

因此调色时不需要手动拼装这四个输入框。

## 完整示例

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#f59e0b',
  defaultMode: 'rgb',
})

picker.on('change', (color) => {
  console.log('RGB 输入组改色：', color)
  // r/g/b 实时值
  console.log(picker.hsvaColor)
})
```

## 相关

- [ColorMode 颜色模式](./color-mode.md)
- [Input 颜色输入框](./input.md)
- [样式与类名](../api/styles.md)
