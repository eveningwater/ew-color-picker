---
title: Tooltip 悬浮提示
description: 独立 tooltip 工具包，供 Select 等插件复用，也可直接用于自定义组件。
---

# Tooltip 悬浮提示

`@ew-color-picker/tooltip` 是 Select（选中值或选项文字被截断时）等插件使用的悬浮提示，也可以直接用于你自己的组件。它是普通 DOM 工具，不是核心插件，按需引入即可。

能力对齐 Element Plus 的 `el-tooltip`：12 种方位并自动翻转/位移、`dark` / `light` 主题、箭头、多种触发方式、展示/隐藏延迟、受控可见、虚拟锚点、键盘支持与生命周期事件。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/tooltip` |
| 类 | `Tooltip` |
| 工具函数 | `isTextTruncated(el)` —— 同时由 `@ew-color-picker/utils` 导出 |
| 样式 | `@ew-color-picker/style/dist/tooltip.css` |

::: warning 需要额外样式
```ts
import '@ew-color-picker/style/dist/tooltip.css'
```
Select 与 Gradient 组件同样依赖它。
:::

## 使用

声明式：传入触发元素，由实例自己管理事件。

```ts
import Tooltip from '@ew-color-picker/tooltip'

const tooltip = new Tooltip({
  target: '#save-btn',
  content: '保存当前颜色',
  placement: 'top',
  effect: 'light',
})

// 运行时更新配置
tooltip.setOptions({ placement: 'bottom', effect: 'dark' })

// 宿主销毁时移除节点与监听
tooltip.destroy()
```

命令式：内容依赖运行时状态时使用（Select 截断提示就是这样做的）。

```ts
import Tooltip, { isTextTruncated } from '@ew-color-picker/tooltip'

const tooltip = new Tooltip({ prefix: 'ew-' })

if (isTextTruncated(target)) {
  tooltip.show(target.textContent!.trim(), target)
}

tooltip.hide()
tooltip.destroy()
```

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `prefix` | `string` | `'ew-'` | 类名前缀，需与选择器前缀保持一致 |
| `target` | `HTMLElement \| string` | — | 触发元素（或选择器），自动绑定触发事件 |
| `content` | `string \| HTMLElement` | — | 提示内容；`rawContent` 开启时字符串按 HTML 解析 |
| `rawContent` | `boolean` | `false` | 是否把字符串内容按 HTML 渲染 |
| `effect` | `'dark' \| 'light'` | `'dark'` | 主题 |
| `placement` | `TooltipPlacement` | `'bottom'` | 首选方位，支持 12 种（`top`、`top-start`、`left-end` 等） |
| `fallbackPlacements` | `TooltipPlacement[]` | `[]` | 首选方位放不下时的候选方位，默认取反方向 |
| `visible` | `boolean` | — | 受控可见状态；传入后通过 `setOptions({ visible })` 更新 |
| `disabled` | `boolean` | `false` | 忽略所有触发与展示请求 |
| `offset` | `number` | `12` | 与锚点的间距（px） |
| `arrowOffset` | `number` | `5` | 箭头距离浮层边缘的最小距离（px） |
| `showArrow` | `boolean` | `true` | 是否展示箭头 |
| `showAfter` | `number` | `0` | 展示延迟（ms） |
| `hideAfter` | `number` | `200` | 指针离开后的隐藏延迟（ms） |
| `autoClose` | `number` | `0` | 展示后自动隐藏的时长（ms），0 表示不自动隐藏 |
| `popperClass` | `string` | `''` | 浮层节点上的自定义类名 |
| `popperStyle` | `string \| Record<string, string>` | `''` | 浮层节点上的内联样式 |
| `appendTo` | `HTMLElement \| string` | `document.body` | 浮层挂载的父元素 |
| `teleported` | `boolean` | `true` | 为 `false` 时挂到触发元素同级 |
| `enterable` | `boolean` | `true` | 是否允许鼠标移入浮层内容 |
| `trigger` | `TooltipTrigger \| TooltipTrigger[]` | `'hover'` | `hover`、`click`、`focus`、`contextmenu`，可用数组组合 |
| `virtualTriggering` | `boolean` | `false` | 使用 `virtualRef` 定位，不绑定触发事件 |
| `virtualRef` | `HTMLElement \| { getBoundingClientRect() }` | `null` | 虚拟锚点 |
| `triggerKeys` | `string[]` | `['Enter', 'Space']` | `click` 触发时，可打开提示的按键 |
| `persistent` | `boolean` | `true` | 隐藏后是否保留 DOM |
| `transition` | `string` | `''` | 自定义过渡类名 |
| `ariaLabel` | `string` | `''` | 浮层节点的 `aria-label` |
| `focusOnTarget` | `boolean` | `false` | 隐藏后是否把焦点移回触发元素 |
| `popperOptions` | `{ strategy?: 'fixed' \| 'absolute' }` | `{ strategy: 'fixed' }` | 定位参照：视口或文档 |
| `className` | `string` | `''` | 旧版别名，等同于 `popperClass` |
| `container` | `HTMLElement` | — | 旧版别名，等同于 `appendTo` |

## 事件

既可以在配置里传回调（`onBeforeShow` 等），也可以用 `on()` 订阅：

```ts
tooltip.on('show', () => console.log('已展示'))
tooltip.on('visibleChange', (visible) => console.log(visible))
```

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `beforeShow` | `Event \| undefined` | 展示前触发 |
| `show` | `Event \| undefined` | 展示后触发 |
| `beforeHide` | `Event \| undefined` | 隐藏前触发 |
| `hide` | `Event \| undefined` | 隐藏后触发 |
| `visibleChange` | `boolean` | 可见状态请求/变化；配合受控 `visible` 使用 |

## 方法

| 方法 | 说明 |
| --- | --- |
| `show(content?, anchor?)` | 展示提示；空内容等同于 `hide()` |
| `hide()` | 立即隐藏，默认保留节点（`persistent: false` 时移除） |
| `onOpen()` / `onClose()` | 与 `el-tooltip` 暴露的同名方法对齐 |
| `isVisible()` | 当前是否可见 |
| `getElement()` / `getContentElement()` | 获取浮层节点 / 内容节点 |
| `getTrigger()` | 获取解析后的触发元素 |
| `isFocusInsideContent()` | 焦点是否位于浮层内容内 |
| `updatePopper()` | 重新计算位置与箭头 |
| `setContent(content)` | 更新内容，保持当前状态 |
| `setOptions(options)` | 运行时合并配置 |
| `on(event, handler)` / `off(event, handler?)` | 订阅 / 取消订阅生命周期事件 |
| `destroy()` | 移除节点、定时器与监听 |

## 定位规则

节点使用 `position: fixed`（`popperOptions.strategy: 'absolute'` 时改为文档坐标）。按 `placement` 计算位置：首选方位在视口内放不下时，依次尝试 `fallbackPlacements`（默认反方向），再沿交叉轴平移，确保不超出视口。展示时、调用 `updatePopper()` 时，以及打开状态下的窗口滚动/尺寸变化都会重新计算。

箭头跟随锚点中心，并通过 `arrowOffset` 限制在浮层边缘内。

## 无障碍

可见时，触发元素会被写入指向浮层的 `aria-describedby`；浮层带 `role="tooltip"` 和可选的 `aria-label`。按 `Escape` 可关闭；`focusOnTarget` 为真时关闭后焦点回到触发元素。

## 类名

`.ew-tooltip`、`.ew-tooltip--dark`、`.ew-tooltip--light`、`.ew-tooltip--visible`、`.ew-tooltip--enterable`、`.ew-tooltip__content`、`.ew-tooltip__arrow`，节点与箭头上还有 `data-placement` 属性。前缀跟随 `prefix` 配置，例如传入 `my-` 时会生成 `.my-tooltip`。

## 说明

- `el-tooltip` 的插槽在原生 DOM 中由 `content`（字符串 / `HTMLElement`）和真实触发元素（`target`）替代，默认插槽没有直接对应物。
- `transition` 只是额外类名，需要你自己提供对应 CSS；默认淡入淡出已内置。
- `rawContent` 会原样渲染 HTML，请自行对不可信内容做转义。

## 示例

仓库内提供了可直接运行的完整示例 `examples/20-tooltip.html`，覆盖 dark / light 主题、12 种方位、四种触发方式、延迟与自动关闭、受控可见、虚拟锚点与禁用状态。

```bash
pnpm example
# 打开 http://localhost:3000/examples/20-tooltip.html
```

## 相关文档

- [Select 下拉选择](./select) —— 使用本包展示被截断的选项文字
- [样式与类名](../api/styles) —— 样式入口与类名前缀
