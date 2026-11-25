---
title: Tooltip 悬浮提示
description: 独立 tooltip 工具包，供 Select 等插件复用，也可直接用于自定义组件。
---

# Tooltip 悬浮提示

`@ew-color-picker/tooltip` 是 Select（选中值或选项文字被截断时）等插件使用的悬浮提示，也可以直接用于你自己的组件。它是普通 DOM 工具，不是核心插件，按需引入即可。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/tooltip` |
| 类 | `Tooltip` |
| 工具函数 | `isTextTruncated(el)` |
| 样式 | `@ew-color-picker/style/dist/tooltip.css` |

::: warning 需要额外样式
```ts
import '@ew-color-picker/style/dist/tooltip.css'
```
Select 与 Gradient 组件同样依赖它。
:::

## 使用

```ts
import Tooltip, { isTextTruncated } from '@ew-color-picker/tooltip'

const tooltip = new Tooltip({ prefix: 'ew-' })

if (isTextTruncated(target)) {
  tooltip.show(target.textContent!.trim(), target)
}

// 隐藏但保留节点
tooltip.hide()

// 宿主销毁时移除节点
tooltip.destroy()
```

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `prefix` | `string` | `'ew-'` | 类名前缀，需与选择器前缀保持一致 |
| `container` | `HTMLElement` | `document.body` | tooltip 节点的挂载父元素 |
| `offset` | `number` | `6` | 与锚点的间距（px） |
| `className` | `string` | `''` | 附加到节点上的自定义类名 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `show(text, anchor)` | 展示提示；空文案等同于 `hide()` |
| `hide()` | 隐藏提示，节点保留 |
| `isVisible()` | 当前是否可见 |
| `getElement()` | 获取 tooltip 节点 |
| `destroy()` | 移除节点并释放实例 |

## 定位规则

节点使用 `position: fixed`，默认位于锚点上方。`show()` 时会测量节点高度，上方空间不足则翻转到锚点下方并追加 `--bottom` 修饰类。每次 `show()` 都会重新计算位置。

## 类名

`.ew-tooltip`、`.ew-tooltip--visible`、`.ew-tooltip--bottom`。前缀跟随 `prefix` 配置，例如传入 `my-` 时会生成 `.my-tooltip`。

## 相关文档

- [Select 下拉选择](./select) —— 使用本包展示被截断的选项文字
- [样式与类名](../api/styles) —— 样式入口与类名前缀
