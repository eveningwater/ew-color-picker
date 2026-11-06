---
title: Eyedropper 吸管插件
description: Eyedropper 插件使用浏览器原生 EyeDropper API 从屏幕取色，自动检测能力、支持回调与取消静默处理。
---

# Eyedropper 吸管

`ewColorPickerEyedropper` 在颜色值输入框上方独立的工具栏行中渲染一个屏幕取色按钮，基于浏览器原生 [EyeDropper API](https://developer.mozilla.org/zh-CN/docs/Web/API/EyeDropper_API)，取到的颜色直接通过 `core.setColor()` 写回选择器。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/eyedropper` |
| `pluginName` | `ewColorPickerEyedropper` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` → `.ew-color-picker-extra-row`（输入框上方的工具栏行） |
| 访问实例 | `core.plugins.ewColorPickerEyedropper` |

## 浏览器支持

EyeDropper API 目前在 Chromium 系浏览器（Chrome / Edge 等）中可用。当 `'EyeDropper' in window` 为假时，插件**不渲染任何节点**，因此可以放心在所有环境注册。

部分浏览器还要求 `open()` 必须在用户手势（点击）中调用，跨域 iframe 内也可能被拒绝。

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showEyedropper` | `boolean` | `true` | `false` 时隐藏按钮；浏览器不支持时始终不渲染 |
| `eyedropperText` | `string` | `undefined` | 按钮的 `title` / `aria-label`（缺省为 `'取色'`）；设置后同时作为可见文本显示 |
| `onEyedropperPick` | `(color: string) => void` | - | 取色成功回调，参数为 `sRGBHex` 颜色值 |

```ts
import ewColorPicker from '@ew-color-picker/core'
import Eyedropper from '@ew-color-picker/eyedropper'

ewColorPicker.use(Eyedropper)

new ewColorPicker({
  el: '#app',
  eyedropperText: '从屏幕取色',
  onEyedropperPick: (color) => console.log('取到的颜色', color),
})
```

## 点击行为

1. 在点击手势内调用 `new EyeDropper().open()`；
2. 成功后先 `core.setColor(result.sRGBHex)`，再调用 `options.onEyedropperPick?.(result.sRGBHex)`；
3. 用户按 <kbd>Esc</kbd> 取消时抛出 `AbortError`，插件静默处理：不回调、不输出警告；
4. 其他错误会通过 `console.warn` 输出，当前颜色保持不变。

`core.setColor()` 会触发 `change` 事件，因此 Panel / Hue / Alpha / Input / ColorMode / Box 会自动同步。

## DOM

```html
<div class="ew-color-picker-eyedropper-group">
  <button type="button" class="ew-color-picker-eyedropper-btn" title="取色" aria-label="取色">
    <svg class="ew-color-picker-icon" viewBox="0 0 24 24">…</svg>
    <!-- 仅在设置了 eyedropperText 时渲染 -->
    <span class="ew-color-picker-eyedropper-text">取色</span>
  </button>
</div>
```

按钮使用独立的分组，放在 `.ew-color-picker-extra-row` 工具栏行内，而不是 Button 插件的 `.ew-color-picker-drop-btn-group`，因为后者在每次渲染时会被清空。当没有任何插件使用该工具栏行时，空行会自动移除。

## 方法

| 方法 / 属性 | 签名 | 说明 |
| --- | --- | --- |
| `run` | `() => void` | 检测能力、移除旧节点、渲染并绑定事件 |
| `updateOptions` | `() => void` | 重新读取配置并重新渲染 |
| `destroy` | `() => void` | 解绑事件并移除节点；未完成的取色结果会被忽略 |
| `container` / `button` | `HTMLElement \| null` | 当前 DOM 引用 |

## 相关链接

- [Button 按钮](./button.md) · [插件总览](./) · [回调](../api/callbacks.md)
