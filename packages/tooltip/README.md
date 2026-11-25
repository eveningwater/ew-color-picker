# @ew-color-picker/tooltip

ew-color-picker 的独立 tooltip 工具包，能力对齐 Element Plus `el-tooltip`：12 种方位、自动翻转/位移、`dark` / `light` 主题、箭头、多种触发方式、延迟展示、受控可见、虚拟锚点与生命周期事件。Select、Checkbox、Gradient 等插件共用它，也可以直接用于自己的组件。

## 安装

```bash
pnpm add @ew-color-picker/tooltip
```

## 声明式用法

```ts
import '@ew-color-picker/style/dist/tooltip.css'
import Tooltip from '@ew-color-picker/tooltip'

const tooltip = new Tooltip({
  target: '#save-btn',
  content: '保存当前颜色',
  placement: 'top',
  effect: 'light',
})

tooltip.setOptions({ placement: 'bottom' })
tooltip.destroy()
```

## 命令式用法

```ts
import Tooltip, { isTextTruncated } from '@ew-color-picker/tooltip'

const tooltip = new Tooltip({ prefix: 'ew-' })

if (isTextTruncated(el)) {
  tooltip.show(el.textContent!.trim(), el)
}

tooltip.hide()
```

## 配置项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `prefix` | `string` | `'ew-'` | 类名前缀，需与主题保持一致 |
| `target` | `HTMLElement \| string` | — | 触发元素，自动绑定事件 |
| `content` | `string \| HTMLElement` | — | 提示内容 |
| `rawContent` | `boolean` | `false` | 字符串内容是否按 HTML 渲染 |
| `effect` | `'dark' \| 'light'` | `'dark'` | 主题 |
| `placement` | `TooltipPlacement` | `'bottom'` | 首选方位，共 12 种 |
| `fallbackPlacements` | `TooltipPlacement[]` | `[]` | 放不下时的候选方位 |
| `visible` | `boolean` | — | 受控可见状态 |
| `disabled` | `boolean` | `false` | 禁用所有触发 |
| `offset` | `number` | `12` | 与锚点的间距（px） |
| `arrowOffset` | `number` | `5` | 箭头距浮层边缘的最小距离 |
| `showArrow` | `boolean` | `true` | 是否展示箭头 |
| `showAfter` / `hideAfter` | `number` | `0` / `200` | 展示 / 隐藏延迟（ms） |
| `autoClose` | `number` | `0` | 展示后自动隐藏时长（ms） |
| `popperClass` / `popperStyle` | `string \| Record<string, string>` | `''` | 浮层类名 / 内联样式 |
| `appendTo` | `HTMLElement \| string` | `document.body` | 挂载父元素 |
| `teleported` | `boolean` | `true` | 为 `false` 时挂到触发元素同级 |
| `enterable` | `boolean` | `true` | 是否允许鼠标移入内容 |
| `trigger` | `TooltipTrigger \| TooltipTrigger[]` | `'hover'` | `hover` / `click` / `focus` / `contextmenu` |
| `virtualTriggering` / `virtualRef` | `boolean` / 虚拟锚点 | `false` / `null` | 虚拟定位 |
| `triggerKeys` | `string[]` | `['Enter', 'Space']` | 打开提示的按键 |
| `persistent` | `boolean` | `true` | 隐藏后是否保留 DOM |
| `transition` | `string` | `''` | 自定义过渡类名 |
| `ariaLabel` | `string` | `''` | 浮层 `aria-label` |
| `focusOnTarget` | `boolean` | `false` | 隐藏后焦点是否回到触发元素 |
| `popperOptions` | `{ strategy?: 'fixed' \| 'absolute' }` | `{ strategy: 'fixed' }` | 定位参照 |

## 事件

`beforeShow`、`show`、`beforeHide`、`hide`、`visibleChange`，可通过配置回调或 `on(event, handler)` 订阅。

## 方法

| 方法 | 说明 |
| --- | --- |
| `show(content?, anchor?)` | 展示提示；空内容等同于 `hide()` |
| `hide()` | 立即隐藏，默认保留节点 |
| `onOpen()` / `onClose()` | 与 `el-tooltip` 同名方法对齐 |
| `isVisible()` | 当前是否可见 |
| `getElement()` / `getContentElement()` / `getTrigger()` | 获取节点与触发元素 |
| `isFocusInsideContent()` | 焦点是否在浮层内容内 |
| `updatePopper()` | 重新计算位置与箭头 |
| `setContent(content)` / `setOptions(options)` | 运行时更新内容 / 配置 |
| `on(event, handler)` / `off(event, handler?)` | 订阅 / 取消订阅事件 |
| `destroy()` | 移除节点、定时器与监听 |

## 工具函数

```ts
import { isTextTruncated } from '@ew-color-picker/tooltip'
// 也可以直接从 utils 引入
// import { isTextTruncated } from '@ew-color-picker/utils'

if (isTextTruncated(el)) {
  tooltip.show(el.textContent!, el)
}
```

底层实现位于 `@ew-color-picker/utils`，tooltip 包只是重新导出。

## 相关文档

- [Tooltip 文档](https://eveningwater.github.io/ew-color-picker/zh/plugins/tooltip)
- [Select 插件](https://eveningwater.github.io/ew-color-picker/zh/plugins/select)
