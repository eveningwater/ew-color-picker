---
title: Hue 色相滑块插件
description: Hue 插件渲染 0–360 度色相滑块，支持水平/垂直方向、点击跳转、拖拽与运行时开关。
---

# Hue 色相滑块

`ewColorPickerHue` 渲染一条 0–360° 的色相条。改变色相时保持当前饱和度、明度与透明度不变。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/hue` |
| `pluginName` | `ewColorPickerHue` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` |
| 访问实例 | `core.plugins.ewColorPickerHue` |

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `hue` | `boolean` | `true` | `false` 时不渲染色相条（构造期生效） |
| `hueDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | 滑块方向 |
| `disabled` | `boolean` | `false` | 禁用后点击/拖拽不生效 |

::: tip hue 与 ewColorPickerPanel
`hue` 只控制色相条本身，不影响二维面板。想要「极简取色」，通常同时关闭 `hasPanel`。
:::

## 实例方法

```ts
const hue = picker.plugins.ewColorPickerHue
```

| 方法 / 属性 | 签名 | 说明 |
| --- | --- | --- |
| `enableHue` | `(enable = true) => void` | 运行时显示/隐藏色相条，等价于 `hasHue = enable` |
| `updateHue` | `(hue: number) => void` | 设置色相（0–360），内部经 `core.setColor()` 改色 |
| `updateHueThumbPosition` | `(hue: number) => void` | 只移动滑块，不改颜色 |
| `hasHue` | `boolean`（getter/setter） | setter 会立即渲染或移除 DOM |
| `hueBar` | `HTMLElement \| null` | 色相条根节点 |
| `hueThumb` | `HTMLElement \| null` | 滑块手柄 |
| `isHorizontal` | `boolean` | 当前是否水平方向 |

### 示例：运行时隐藏

```ts
picker.plugins.ewColorPickerHue.enableHue(false)
picker.plugins.ewColorPickerHue.enableHue(true)
```

## 交互行为

| 操作 | 行为 |
| --- | --- |
| 点击色相条 | 按点击位置换算色相并立即改色 |
| 按住拖拽 | 节流 16ms 连续改色 |
| 外部颜色变化 | 监听 `change`，用新颜色的 `h` 同步手柄位置 |

色相条背景始终是完整的 360° 光谱，不受当前颜色影响。

## 事件

改色通过 `core.setColor()`，因此：

```ts
picker.on('change', (color) => console.log(color))
```

会收到色相拖动产生的颜色。Hue 自身不 `trigger` 额外事件。

## DOM 结构

```html
<div class="ew-color-picker-slider ew-color-picker-is-vertical">
  <div class="ew-color-picker-slider-bar"></div>
  <div class="ew-color-picker-slider-thumb"></div>
</div>
```

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-slider` | 滑块根节点 |
| `.ew-color-picker-is-vertical` / `.ew-color-picker-is-horizontal` | 方向 |
| `.ew-color-picker-slider-bar` | 色相渐变条 |
| `.ew-color-picker-slider-thumb` | 手柄 |

## 完整示例

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#ef4444',
  hueDirection: 'horizontal',
})

// 监听色相变化
picker.on('change', (color) => {
  const h = picker.hsvaColor.h
  console.log(`色相 ${h.toFixed(0)}°，颜色 ${color}`)
})

// 设置为 200°（青蓝）
picker.plugins.ewColorPickerHue.updateHue(200)
```

## 相关

- [Alpha 透明度滑块](./alpha.md)
- [配置项 · hueDirection](../api/options.md#huedirection)
