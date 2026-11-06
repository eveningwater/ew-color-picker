---
title: CopyColor 复制颜色插件
description: CopyColor 插件在输入框上方的工具栏行渲染圆形复制按钮，按钮背景跟随当前颜色，点击即可把当前颜色值写入剪贴板，并弹出复制成功提示。
---

# CopyColor 复制颜色

`ewColorPickerCopyColor` 在颜色值输入框上方的独立工具栏行中渲染一个圆形复制按钮，按钮背景实时显示当前颜色，点击后把当前颜色值写入系统剪贴板，并弹出短暂的复制成功提示。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/copy-color` |
| `pluginName` | `ewColorPickerCopyColor` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` → `.ew-color-picker-extra-row`（输入框上方的工具栏行） |
| 访问实例 | `core.plugins.ewColorPickerCopyColor` |

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showCopyColor` | `boolean` | `true` | `false` 时隐藏复制按钮 |
| `copyColorText` | `string` | `'复制颜色到剪贴板'` | 按钮的 `title` / `aria-label` |
| `copiedText` | `string` | `'已复制'` | 复制成功后提示气泡的文案，显示 1.5 秒 |
| `onCopyColor` | `(color: string) => void` | - | 复制成功回调，参数为复制的颜色值 |

```ts
import ewColorPicker from '@ew-color-picker/core'
import CopyColor from '@ew-color-picker/copy-color'

ewColorPicker.use(CopyColor)

new ewColorPicker({
  el: '#app',
  copyColorText: '复制颜色',
  copiedText: '复制成功',
  onCopyColor: (color) => console.log('已复制', color),
})
```

## 点击行为

1. 通过 `core.getColor()` 读取当前颜色，颜色为空时不做任何处理；
2. 优先调用 `navigator.clipboard.writeText()`；
3. Clipboard API 不可用（例如非 HTTPS 页面）时，降级为临时 `<textarea>` + `document.execCommand('copy')`；
4. 复制成功后，在按钮旁弹出 `copiedText` 提示气泡并保持 1.5 秒，同时调用 `options.onCopyColor?.(color)`；
5. 复制失败时输出 `console.warn`，当前颜色保持不变。

复制的字符串就是 `core.getColor()` 的原始值：HEX 模式下为十六进制，启用透明度时为 `rgba()` / `hsla()`。

## DOM

```html
<div class="ew-color-picker-copy-group">
  <button type="button" class="ew-color-picker-copy-btn" title="复制颜色到剪贴板" aria-label="复制颜色到剪贴板">
    <svg class="ew-color-picker-icon" viewBox="0 0 24 24">…</svg>
  </button>
  <div class="ew-color-picker-copy-tip" role="status" aria-live="polite">已复制</div>
</div>
```

按钮背景会跟随 `change` 事件更新，图标颜色根据背景亮度自动切换深色 / 白色。提示气泡是插件自带的独立节点，样式由本包维护，不需要引入额外的消息提示库或全局样式。

## 方法

| 方法 / 属性 | 签名 | 说明 |
| --- | --- | --- |
| `run` | `() => void` | 移除旧节点、渲染并绑定事件 |
| `updateOptions` | `() => void` | 重新读取配置并重新渲染 |
| `destroy` | `() => void` | 解绑事件并移除节点 |
| `container` / `button` / `tip` | `HTMLElement \| null` | 当前 DOM 引用 |

## 相关链接

- [Eyedropper 吸管](./eyedropper.md) · [Button 按钮](./button.md) · [插件总览](./) · [回调](../api/callbacks.md)
