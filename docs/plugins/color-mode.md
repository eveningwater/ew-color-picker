---
title: ColorMode 颜色模式插件
description: 在 Hex / RGB / HSL 三种颜色模式之间切换，并驱动分通道输入组，触发 mode-change 事件。
---

# ColorMode 颜色模式

`ewColorPickerColorMode` 提供 **Hex / RGB / HSL** 三种输入模式。切换后底部输入区会重建为对应的分通道输入组。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/color-mode` |
| `pluginName` | `ewColorPickerColorMode` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` |
| 访问实例 | `core.plugins.ewColorPickerColorMode` |

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultMode` | `'hex' \| 'rgb' \| 'hsl'` | 有 Alpha 时 `'rgb'`，否则 `'hex'` | 初始模式 |
| `showColorMode` | `boolean` | `true` | `false` 时不渲染模式切换器 |
| `ewColorPickerColorMode` | `boolean \| object` | `true` | `false` 等价于关闭；对象会合并进插件配置 |
| `changeMode` | `(mode, picker) => void` | — | 模式切换回调 |

::: tip 默认模式为什么是 RGB？
当 Alpha 插件存在时，颜色天然是 `rgba()`，因此默认进入 `rgb` 模式更符合直觉；没有 Alpha 时默认 `hex`。
:::

## 实例方法

```ts
const colorMode = picker.plugins.ewColorPickerColorMode
```

| 方法 / 属性 | 签名 | 说明 |
| --- | --- | --- |
| `getCurrentMode` | `() => 'hex' \| 'rgb' \| 'hsl'` | 读取当前模式 |
| `setMode` | `(mode) => void` | 切换模式（内部防抖 100ms） |
| `switchToNextMode` | `() => void` | 循环到下一个模式：hex → rgb → hsl → hex |
| `switchToPreviousMode` | `() => void` | 循环到上一个模式 |
| `onModeChange` | `(mode) => void` | 模式变更主逻辑：更新显示、重建输入、执行回调、触发事件 |
| `updateOptions` | `() => void` | 重新读取配置并重绘 |
| `updateInputStructure` | `() => void` | 按当前模式重建输入区 |
| `updateInputValues` | `(color: string) => void` | 把颜色同步到当前模式的输入框 |
| `updateColorFromRgbInputs` | `() => void` | 从 RGB 输入框合成颜色并改色（防抖） |
| `updateColorFromHslInputs` | `() => void` | 从 HSL 输入框合成颜色并改色（防抖） |
| `restoreDefaultInput` | `() => void` | 恢复 Input 插件的默认输入框 |
| `currentMode` | `'hex' \| 'rgb' \| 'hsl'` | 当前模式 |
| `modeContainer` | `HTMLElement \| null` | 模式切换器根节点 |

### 切换模式

```ts
picker.plugins.ewColorPickerColorMode.setMode('rgb')
picker.plugins.ewColorPickerColorMode.switchToNextMode()
```

## 模式切换行为

```text
点击上/下箭头
   → debounce(100ms) onModeChange(mode)
   → 更新模式文本（HEX / RGB / HSL）
   → updateInputStructure() 重建输入区
   → 非 hex 模式：updateInputValues(当前颜色)
   → options.changeMode?.(mode, picker)
   → trigger('mode-change', mode)
```

**Hex 模式下不会再次调用 `setColor`**，避免把输入框里的 `#xxxxxx` 覆盖成 `rgba()/hsla()` 字符串。

### 禁用状态

上/下箭头点击时会检查 `options.disabled`，禁用状态下不响应。

## 事件与回调

| 来源 | 签名 | 说明 |
| --- | --- | --- |
| `options.changeMode` | `(mode, picker) => void` | 模式切换后 |
| 事件 `mode-change` | `(mode)` | 模式切换后 |

```ts
picker.on('mode-change', (mode) => {
  console.log('当前模式：', mode) // 'hex' | 'rgb' | 'hsl'
})
```

## DOM 结构

```html
<!-- 模式切换器 -->
<div class="ew-color-picker-mode-container">
  <button class="ew-color-picker-mode-up-btn" type="button" title="上一个模式"></button>
  <div class="ew-color-picker-mode-text">HEX</div>
  <button class="ew-color-picker-mode-down-btn" type="button" title="下一个模式"></button>
</div>

<!-- RGB/HSL 模式下的输入组 -->
<div class="ew-color-picker-inputs-group">
  <div class="ew-color-picker-inputs-col">
    <label class="ew-color-picker-input-label">R</label>
    <div class="ew-input-number">…</div>
  </div>
  <!-- G / B / A 或 H / S / L / A -->
</div>
```

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-mode-container` | 模式切换器 |
| `.ew-color-picker-mode-up-btn` / `-down-btn` | 上/下切换按钮 |
| `.ew-color-picker-mode-text` | 模式文本 |
| `.ew-color-picker-inputs-group` | 分通道输入组 |
| `.ew-color-picker-inputs-col` | 单个通道列 |
| `.ew-color-picker-input-label` | 通道标签 |
| `.ew-color-picker-input-container-flex` | Hex 模式的输入容器 |
| `.ew-color-picker-input` / `.ew-color-picker-input-default` | 默认输入框 |

## 完整示例

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#ec4899',
  defaultMode: 'hex',
  showColorMode: true,
  changeMode: (mode, instance) => {
    console.log(`切换到 ${mode}，当前色 ${instance.getColor()}`)
  },
})

picker.on('mode-change', (mode) => {
  if (mode === 'hsl') {
    // HSL 模式下可以读取 hsvaColor 做进一步处理
    console.log(picker.hsvaColor)
  }
})
```

## 相关

- [Input 输入框](./input.md)
- [InputNumber 数字输入框](./input-number.md)
- [事件 · mode-change](../api/events.md#mode-change)
