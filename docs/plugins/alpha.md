---
title: Alpha 透明度滑块插件
description: Alpha 插件为 ew-color-picker 增加 0–1 透明度滑块，输出 rgba 颜色，支持水平/垂直方向与运行时开关。
---

# Alpha 透明度滑块

`ewColorPickerAlpha` 增加一条透明度（Alpha）滑块，取值范围 `0`–`1`，输出 `rgba()` 颜色。是否注册该插件会直接影响核心的默认颜色格式：

- **注册了 Alpha**：`defaultColor` 是 hex 时会被转成 `rgba()`，取色结果带透明度
- **未注册 Alpha**：`defaultColor` 是 `rgba()` 时会被转成 hex，取色结果不带透明度

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/alpha` |
| `pluginName` | `ewColorPickerAlpha` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` |
| 访问实例 | `core.plugins.ewColorPickerAlpha` |

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `alpha` | `boolean` | `true` | `false` 时不渲染透明度滑块（构造期生效） |
| `alphaDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | 滑块方向 |
| `disabled` | `boolean` | `false` | 禁用后点击/拖拽不生效 |

## 实例方法

```ts
const alpha = picker.plugins.ewColorPickerAlpha
```

| 方法 / 属性 | 签名 | 说明 |
| --- | --- | --- |
| `enableAlpha` | `(enable = true) => void` | 运行时显示/隐藏滑块 |
| `updateAlpha` | `(alpha: number) => void` | 设置透明度（0–1），内部调用 `core.setColor()` |
| `updateAlphaThumbPosition` | `(alpha: number) => void` | 只移动手柄，不改颜色 |
| `hasAlpha` | `boolean`（getter/setter） | setter 会立即渲染或移除 DOM |
| `alphaBar` | `HTMLElement \| null` | 滑块根节点 |
| `alphaThumb` | `HTMLElement \| null` | 手柄 |
| `isHorizontal` | `boolean` | 是否水平方向 |

### 联动 ColorMode

`updateAlpha` 执行后会检查 ColorMode 插件：若当前不在 `hex` 模式，会调用 `colorMode.updateInputValues(newColor)` 同步 RGB/HSL 输入框，无需自己处理。

## 交互行为

| 操作 | 行为 |
| --- | --- |
| 点击滑块 | 按位置换算 alpha（水平方向从右往左递增） |
| 按住拖拽 | 节流 16ms 连续改色 |
| 外部颜色变化 | 监听 `change`，用新颜色的 `a` 同步手柄位置 |

`updateAlpha` 只改透明度，保持当前 `h`/`s`/`v` 不变；若当前颜色为空则直接返回，不会凭空生成颜色。

## 事件

改色经由 `core.setColor()`，因此监听 `change` 即可：

```ts
picker.on('change', (color) => console.log(color)) // rgba(...)
```

## DOM 结构

```html
<div class="ew-color-picker-slider ew-alpha ew-color-picker-is-vertical">
  <div class="ew-color-picker-alpha-slider-wrapper">
    <div class="ew-color-picker-alpha-slider-bg"></div>
    <div class="ew-color-picker-alpha-slider-bar"></div>
  </div>
  <div class="ew-color-picker-alpha-slider-thumb"></div>
</div>
```

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-slider.ew-alpha` | 滑块根节点 |
| `.ew-color-picker-alpha-slider-wrapper` | 棋盘 + 渐变容器 |
| `.ew-color-picker-alpha-slider-bg` | 透明棋盘底 |
| `.ew-color-picker-alpha-slider-bar` | 颜色渐变条 |
| `.ew-color-picker-alpha-slider-thumb` | 手柄 |

## 完整示例

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: 'rgba(99, 102, 241, 0.6)',
  alphaDirection: 'horizontal',
})

picker.on('change', (color) => {
  console.log('含透明度：', color)
  console.log('alpha =', picker.hsvaColor.a)
})

// 50% 透明
picker.plugins.ewColorPickerAlpha.updateAlpha(0.5)
```

## 相关

- [Hue 色相滑块](./hue.md)
- [ColorMode 颜色模式](./color-mode.md)
- [配置项 · alphaDirection](../api/options.md#alphadirection)
