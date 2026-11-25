# @ew-color-picker/tooltip

ew-color-picker 的独立 tooltip 工具包：固定定位在锚点上方，空间不足时自动翻转到下方。Select、Checkbox、Gradient 等插件共用它，也可以直接用于自己的组件。

## 安装

```bash
pnpm add @ew-color-picker/tooltip
```

```ts
import '@ew-color-picker/style/dist/tooltip.css'
import Tooltip from '@ew-color-picker/tooltip'

const tooltip = new Tooltip({ prefix: 'ew-' })

tooltip.show('完整内容', anchorEl)
tooltip.hide()
tooltip.destroy()
```

## 选项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `prefix` | `string` | `'ew-'` | 类名前缀，需与主题保持一致 |
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

## 工具函数

```ts
import { isTextTruncated } from '@ew-color-picker/tooltip'

if (isTextTruncated(el)) {
  tooltip.show(el.textContent!, el)
}
```

## 相关文档

- [Tooltip 文档](https://eveningwater.github.io/ew-color-picker/zh/plugins/tooltip)
- [Select 插件](https://eveningwater.github.io/ew-color-picker/zh/plugins/select)
