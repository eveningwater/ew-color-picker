---
title: Input 颜色输入框插件
description: Input 插件提供可直接输入 hex/rgb/rgba/hsl/hsla 的文本框，带校验、防抖与禁用态。
---

# Input 颜色输入框

`ewColorPickerInput` 渲染一个文本输入框，允许用户直接键入颜色值。输入合法颜色后回车或失焦即改色；非法输入不会污染当前颜色。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/input` |
| `pluginName` | `ewColorPickerInput` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` |
| 访问实例 | `core.plugins.ewColorPickerInput` |

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `hasInput` | `boolean` | `true` | `false` 时不渲染输入框 |
| `disabled` | `boolean` | `false` | 禁用输入框 |
| `changeColor` | `(rgba: string) => void` | — | 输入合法颜色并改色后的回调，参数为 `rgba()` 字符串 |

> 输入框的显示内容由当前模式决定：Hex 模式显示 hex，RGB 模式显示 `rgb()/rgba()`，HSL 模式显示 `hsl()/hsla()`。模式切换由 [ColorMode](./color-mode.md) 管理。

## 实例方法

```ts
const input = picker.plugins.ewColorPickerInput
```

| 方法 / 属性 | 签名 | 说明 |
| --- | --- | --- |
| `enableInput` | `(enable = true) => void` | 显示/隐藏输入框 |
| `hasInput` | `boolean`（getter/setter） | setter 会立即渲染或移除 DOM |
| `setValue` | `(value: string) => void` | 直接设置输入框文本（不改颜色） |
| `getValue` | `() => string` | 读取输入框当前文本 |
| `setDisabled` | `(disabled: boolean) => void` | 切换禁用态，会同步 `ew-input-disabled` 类 |
| `update` | `(color: string) => void` | 按当前模式格式化并写入输入框 |
| `onInputColor` | `(value: string) => void` | 处理输入值；内部防抖 300ms |
| `input` | `HTMLInputElement \| null` | 输入框 DOM |

### 典型用法

```ts
// 让输入框显示当前颜色（内部已自动处理，一般无需手动调用）
picker.plugins.ewColorPickerInput.update(picker.getColor())

// 直接读取用户输入
console.log(picker.plugins.ewColorPickerInput.getValue())

// 禁用
picker.plugins.ewColorPickerInput.setDisabled(true)
```

## 输入校验

| 输入 | 结果 |
| --- | --- |
| `#f00`、`#ff0000`、`#ff000080` | 合法，按当前插件组合转换为 rgba 或 hex |
| `rgb(255,0,0)`、`rgba(255,0,0,0.5)` | 合法 |
| `hsl(0,100%,50%)`、`hsla(...)` | 合法 |
| 空字符串 | 合法（表示清空颜色） |
| 其它 | 非法，不触发改色；部分场景会 `warn` |

输入事件防抖 300ms，避免每个按键都触发整棵插件树的同步。

## 事件与回调

改色成功后：

```ts
core.setColor(rgbaColor)
core.trigger('change', rgbaColor)
options.changeColor?.(rgbaColor)
```

监听 `change`：

```ts
picker.on('change', (color) => console.log('输入框改色：', color))
```

## DOM 结构

```html
<div class="ew-color-picker-input-container ew-color-picker-input-container-flex">
  <input class="ew-color-picker-input" type="text" />
</div>
```

禁用时输入框会追加 `ew-input-disabled`。

## 完整示例

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#0ea5e9',
  hasInput: true,
  changeColor: (rgba) => console.log('用户输入了：', rgba),
})

picker.on('change', (color) => {
  console.log('当前颜色', color)
})
```

## 相关

- [ColorMode 颜色模式](./color-mode.md) — 决定输入框显示格式
- [InputNumber 数字输入框](./input-number.md) — RGB/HSL 分通道输入
