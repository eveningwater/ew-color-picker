---
title: Gradient 渐变插件
description: 渐变编辑插件：线性/径向/锥形、重复渐变、角度与位置、双位置色标与插值色彩空间。
---

# Gradient 渐变

`@ew-color-picker/gradient` 在面板底部增加一个渐变编辑器：可拖拽的色标预览条、类型/角度控制、径向与锥形参数、插值色彩空间，以及可与解析器稳定回环的 CSS 字符串。

::: warning 定位：颜色选择器的扩展，而不是独立的渐变选择器
这个插件只负责渐变结构（色标、位置、类型、角度、重复与插值），不包含自己的取色 UI。选中色标后，颜色由颜色选择器的面板（Panel / Hue / Alpha / InputNumber 等）修改，再通过 `syncStopsOnChange` 写回该色标。因此它必须依赖 `panelContainer`，不能脱离颜色选择器单独使用；如果只想编辑渐变数据或需要独立的渐变组件，应直接使用包内导出的 `parseGradient`、`serializeGradient`、`interpolateStops` 等纯函数自行封装。
:::

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/gradient` |
| `pluginName` | `ewColorPickerGradient` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer`（插入到 `.ew-color-picker-bottom-row` 之前） |
| 访问实例 | `core.plugins.ewColorPickerGradient` |

::: tip 默认不渲染
传入 `showGradient: true`，或者提供 `gradient` / `gradientStops` 时才会渲染。
:::

```ts
import ewColorPicker from '@ew-color-picker/core'
import Gradient from '@ew-color-picker/gradient'

ewColorPicker.use(Gradient)

new ewColorPicker({
  el: '#app',
  gradientStops: ['#ff0000', '#0000ff'],
  gradientType: 'linear',
  gradientAngle: 90,
  gradientChange: (css, value) => console.log(css),
})
```

编辑器依赖面板：当 `hasPanel: false`（或 `ewColorPickerPanel: false`）时会输出警告并跳过渲染。

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showGradient` | `boolean` | `false` | 为 `true` 时无需色标也会渲染 |
| `gradient` | `string \| GradientValue` | - | 初始渐变；字符串会先解析 |
| `gradientType` | `'linear' \| 'radial' \| 'conic'` | `'linear'` | 渐变类型 |
| `gradientRepeating` | `boolean` | `false` | 是否重复渐变 |
| `gradientStops` | `Array<string \| GradientStop>` | 当前色 + 白色 | 初始色标 |
| `gradientAngle` | `number` | `180` | 线性渐变角度（度） |
| `gradientInterpolation` | `string \| null` | `null` | 插值色彩空间，如 `oklab`、`oklch longer hue` |
| `minGradientStops` | `number` | `2` | 最少色标数 |
| `maxGradientStops` | `number` | `8` | 最多色标数 |
| `syncStopsOnChange` | `boolean` | `true` | 面板改色时写回当前选中的色标 |
| `gradientChange` | `(css, value) => void` | - | 渐变变化回调 |

`GradientStop` 为 `{ color: string; position?: number; position2?: number }`。带 `position2` 的色标是双位置色标，会在这段区间内保持同一颜色。

## 实例方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `getGradient` | `() => string` | 序列化当前渐变为 CSS |
| `getGradientValue` | `() => GradientValue` | 获取结构化渐变数据副本 |
| `getStops` | `() => GradientStop[]` | 获取色标副本 |
| `setGradient` | `(string \| Partial<GradientValue>) => void` | 替换渐变并重新渲染 |
| `setStops` | `(stops) => void` | 替换色标 |
| `addStop` | `(color, position?) => number` | 新增色标并返回索引（达到上限返回 `-1`） |
| `removeStop` | `(index?) => boolean` | 删除选中或指定色标 |
| `updateOptions` | `() => void` | 重新读取配置并重新渲染 |
| `destroy` | `() => void` | 解绑事件并移除编辑器 |

## 交互说明

- 拖拽手柄可移动色标位置，面板颜色会同步为当前选中的色标。
- 点击预览条空白处会按插值颜色新增一个色标。
- `syncStopsOnChange: true` 时，面板改色会写回当前选中的色标。
- 预览条始终按从左到右绘制，便于手柄百分比与位置一一对应；导出的 CSS 仍按所选类型与角度序列化。

## 工具函数

```ts
import {
  parseGradient,
  serializeGradient,
  interpolateStops,
  resolveGradientPositions,
} from '@ew-color-picker/gradient'
```

`parseGradient` 支持全部 6 种前缀（`linear` / `radial` / `conic`，可带 `repeating-`）、`deg` / `rad` / `grad` / `turn` 角度、`to <side-or-corner>`、径向形状/尺寸/`at`、锥形 `from`/`at`、`in <color-space>` 插值提示与双位置色标；长度单位的位置会输出警告并被拒绝。`serializeGradient` 保证解析-序列化回环稳定。

`interpolateStops` 计算某个百分比处的颜色，支持 sRGB、sRGB-linear、HSL、OKLab、OKLCH 以及四种 hue 方向；`lab` / `lch` / `hwb` 会回退为 sRGB。

## 样式

渐变样式包含在主样式文件中：

```ts
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/select.css'
import '@ew-color-picker/style/dist/input-number.css'
import '@ew-color-picker/style/dist/checkbox.css'
```

编辑器内部复用 `@ew-color-picker/select` 的 `Select`、`@ew-color-picker/input-number` 的 `InputNumber` 与 `@ew-color-picker/checkbox` 的 `Checkbox` 组件。

## DOM

```html
<div class="ew-gradient-container">
  <div class="ew-gradient-preview">
    <div class="ew-gradient-preview-bar" style="background: linear-gradient(90deg, …)">
      <button type="button" class="ew-gradient-handle ew-gradient-handle-active" style="left: 0%"></button>
      <button type="button" class="ew-gradient-handle" style="left: 100%"></button>
    </div>
  </div>
  <div class="ew-gradient-row ew-gradient-row-type">…</div>
  <div class="ew-gradient-row ew-gradient-row-radial">…</div>
  <div class="ew-gradient-row ew-gradient-row-position">…</div>
  <div class="ew-gradient-row ew-gradient-row-interp">…</div>
  <div class="ew-gradient-row ew-gradient-row-stop">…</div>
</div>
```

## 相关链接

- [Select 下拉选择](./select.md) · [InputNumber 数字输入框](./input-number.md) · [插件总览](./) · [样式与类名](../api/styles.md)
