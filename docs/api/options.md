---
title: 配置项
description: ew-color-picker 全部构造配置项的完整参考：类型、默认值与行为说明。
---

# 配置项

`new ewColorPicker(options)` 接受一个配置对象；也可以直接传入选择器字符串或 DOM 元素作为 `el`。

```ts
new ewColorPicker('#picker')
new ewColorPicker(document.querySelector('#picker')!)
new ewColorPicker({ el: '#picker', defaultColor: '#6366f1' })
```

所有配置都可以在实例化后通过 [`updateOptions()`](./methods#updateoptions) 动态更新。

## 总览

### 核心配置

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `el` | `string \| HTMLElement` | `document.body` | 挂载容器 |
| `disabled` | `boolean` | `false` | 禁用全部交互 |
| `defaultColor` | `string` | `''` | 初始颜色 |
| `size` | `string \| number \| { width, height }` | `'normal'` | 颜色盒尺寸 |
| `predefineColor` | `(string \| { color, disabled? })[]` | `[]` | 预定义颜色 |
| `isClickOutside` | `boolean` | `true` | 点击容器外部时收起面板 |
| `hueDirection` | `'vertical' \| 'horizontal'` | `'vertical'` | 色相滑块方向 |
| `alphaDirection` | `'vertical' \| 'horizontal'` | `'vertical'` | 透明度滑块方向 |
| `clearText` | `string` | `'清空'` | 清空按钮文本 |
| `sureText` | `string` | `'确定'` | 确定按钮文本 |
| `togglePickerAnimation` | `'default' \| 'height' \| 'opacity'` | `'default'` | 面板开合动画 |
| `pickerAnimationTime` | `number` | `200` | 动画时长（毫秒，上限 10000） |
| `autoPanelPosition` | `boolean` | `false` | 面板自动定位（需配置 `ewColorPickerBox`） |
| `panelPlacement` | 见下文 | `'bottom'` | 面板相对盒子的位置 |

### 显示开关

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `hasBox` | `boolean` | `true` | 是否显示颜色盒 |
| `hasPanel` | `boolean` | `true` | 是否显示颜色面板 |
| `hasInput` | `boolean` | `true` | 是否显示文本输入框 |
| `hasClear` | `boolean` | `true` | 是否显示清空按钮 |
| `hasSure` | `boolean` | `true` | 是否显示确定按钮 |
| `hue` | `boolean` | `true` | 是否显示色相滑块 |
| `alpha` | `boolean` | `true` | 是否显示透明度滑块（注册 Alpha 插件后） |
| `showButton` | `boolean` | `true` | 是否渲染按钮组 |
| `showColorMode` | `boolean` | `true` | 是否显示颜色模式切换器 |
| `showInputNumber` | `boolean` | `true` | 是否渲染数字输入框 |

### 插件配置对象

| 配置项 | 类型 | 说明 |
| --- | --- | --- |
| `ewColorPickerPanel` | `boolean` | `false` 等价 `hasPanel: false` |
| `ewColorPickerColorMode` | `false \| { defaultMode?, changeMode?, showColorMode? }` | 颜色模式配置 |

### 回调

| 配置项 | 签名 | 说明 |
| --- | --- | --- |
| `changeColor` | `(color: string) => void` | 颜色变化时调用 |
| `sure` | `(color: string, picker: ewColorPicker) => void` | 点击确定时调用 |
| `clear` | `(picker: ewColorPicker) => void` | 点击清空时调用 |
| `togglePicker` | `(isOpen: boolean) => void` | 面板开合时调用 |

## el

- **类型**：`string | HTMLElement`
- **默认值**：`document.body`

挂载容器。字符串会通过 `querySelector` 解析；解析失败或未传入时回退到 `document.body`。容器会获得 `isEwColorPickerContainer` 标记属性，内部会创建 `.ew-color-picker` 包装层。

```ts
const el = document.querySelector('#picker')!
new ewColorPicker({ el })
```

## disabled

- **类型**：`boolean`
- **默认值**：`false`

禁用全部交互：颜色盒不可点击、面板不可拖动、按钮禁用、输入框禁用。`disabled` 为 `true` 时颜色盒仍保留当前背景色，用于展示。

```ts
new ewColorPicker({ el: '#picker', disabled: true })
```

运行时切换：

```ts
picker.updateOptions({ disabled: true })
```

## defaultColor

- **类型**：`string`
- **默认值**：`''`

初始颜色，支持 Hex、RGB(A)、HSL(A) 与颜色关键字。为空时颜色盒展示为“无颜色”状态，打开面板时会回退到 `#ff0000` 用于面板定位，但不会写入输入框。

当颜色非法时：

- 初始化阶段保留空颜色状态；
- `updateOptions({ defaultColor })` 阶段保持当前颜色并输出警告：`Invalid defaultColor '...', keep current color unchanged.`

```ts
new ewColorPicker({ el: '#picker', defaultColor: 'rgba(99, 102, 241, 0.65)' })
```

## size

- **类型**：`string | number | { width?: string | number; height?: string | number }`
- **默认值**：`'normal'`

颜色盒尺寸。支持四种写法：

| 写法 | 示例 | 结果 |
| --- | --- | --- |
| 预设名 | `'mini'` / `'small'` / `'normal'` / `'medium'` / `'large'` | 20 / 24 / 32 / 36 / 40 px |
| CSS 长度 | `'48px'`、`'3rem'` | 直接使用 |
| 数字 | `48` | `48px` |
| 对象 | `{ width: 48, height: 32 }` | 分别设置宽高，图标取较小边的 50% |

```ts
new ewColorPicker({ el: '#picker', size: 'large' })
new ewColorPicker({ el: '#picker', size: { width: 56, height: 40 } })
```

## predefineColor

- **类型**：`(string | { color: string; disabled?: boolean })[]`
- **默认值**：`[]`

预定义色板数据。字符串数组会自动归一化；对象形式可以单独禁用某个色块（禁用后置灰且不可点击）。点击任意色块后会调用顶层的 `changeColor` 回调。

```ts
new ewColorPicker({
  el: '#picker',
  predefineColor: ['#6366f1', '#8b5cf6', { color: '#ef4444', disabled: true }],
  changeColor(color) {
    console.log('选择预定义颜色：', color)
  },
})
```

运行时更新：

```ts
picker.plugins.ewColorPickerPredefine.updatePredefineColors(['#000000', '#ffffff'])
```

## isClickOutside

- **类型**：`boolean`
- **默认值**：`true`

是否在点击容器外部时自动收起面板。内部监听 `document` 的 `mousedown`（捕获阶段），并判断事件目标是否位于当前实例容器内，因此多实例互不影响。

## hueDirection / alphaDirection

- **类型**：`'vertical' | 'horizontal'`
- **默认值**：`'vertical'`

色相滑块与透明度滑块的方向。水平滑块会插入到面板下方，垂直滑块会插入到面板右侧，面板宽度会自动调整。

```ts
new ewColorPicker({
  el: '#picker',
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
})
```

## clearText / sureText

- **类型**：`string`
- **默认值**：`'清空'` / `'确定'`

底部按钮文案。运行时可通过插件方法修改：

```ts
picker.plugins.ewColorPickerButton.setClearText('重置')
picker.plugins.ewColorPickerButton.setSureText('应用')
```

## togglePickerAnimation

- **类型**：`'default' | 'height' | 'opacity'`
- **默认值**：`'default'`

面板开合动画。仅以下两个值会产生实际动画：

| 值 | 效果 |
| --- | --- |
| `'height'` | 高度展开 / 收起的滑动动画 |
| `'opacity'` | 淡入淡出 |
| 其他（含 `'default'`） | 直接显示 / 隐藏 |

## pickerAnimationTime

- **类型**：`number`
- **默认值**：`200`
- **单位**：毫秒

动画时长，内部会限制在 `0 ~ 10000` 之间。未传或为 0 时使用默认值。

## autoPanelPosition

- **类型**：`boolean`
- **默认值**：`false`

是否启用面板自动定位。启用后根据盒子在视口中的位置自动调整面板方向，并在空间不足时翻转。

> **注意**：该能力依赖颜色盒插件。只有同时配置了 `ewColorPickerBox`（任意对象，例如 `{}`）时才会生效。

```ts
new ewColorPicker({
  el: '#picker',
  autoPanelPosition: true,
  ewColorPickerBox: {},
})
```

## panelPlacement

- **类型**：面板方位字符串
- **默认值**：`'bottom'`

可选值共 12 个：

| 方向 | 取值 |
| --- | --- |
| 上 | `top-start`、`top`、`top-end` |
| 下 | `bottom-start`、`bottom`、`bottom-end` |
| 左 | `left-start`、`left`、`left-end` |
| 右 | `right-start`、`right`、`right-end` |

`start` / `end` 表示沿主轴的对齐方式；未启用 `autoPanelPosition` 时按配置固定定位。

```ts
new ewColorPicker({ el: '#picker', panelPlacement: 'right-start' })
```

## hasBox / hasPanel / hasInput / hasClear / hasSure / hue / alpha

- **类型**：`boolean`
- **默认值**：均为 `true`

构造期控制各功能区域是否渲染。实现上分别在 Box、Panel、Input、Button、Hue、Alpha 插件构造时读取，因此只能在实例化时生效。

```ts
new ewColorPicker({
  el: '#picker',
  hasBox: false,
  hasPanel: false,
  hasInput: false,
  hasClear: false,
  hasSure: false,
  hue: false,
  alpha: false,
})
```

运行时切换请使用插件方法：

```ts
picker.plugins.ewColorPickerBox.enableBox(false)
picker.plugins.ewColorPickerInput.enableInput(false)
picker.plugins.ewColorPickerButton.enableClear(false)
picker.plugins.ewColorPickerButton.enableSure(false)
picker.plugins.ewColorPickerHue.enableHue(false)
picker.plugins.ewColorPickerAlpha.enableAlpha(false)
```

## showButton

- **类型**：`boolean`
- **默认值**：`true`

为 `false` 时整个按钮组（清空 + 确定）不渲染，等价于同时隐藏两个按钮。

## showColorMode

- **类型**：`boolean`
- **默认值**：`true`

为 `false` 时不渲染颜色模式切换器（`hex / rgb / hsl` 切换按钮及对应输入结构）。

## showInputNumber

- **类型**：`boolean`
- **默认值**：`true`

为 `false` 时不创建数字输入框组件（RGB / HSL 模式下的分量输入框仍由 ColorMode 插件渲染，但其数字步进控件会被跳过）。

## 颜色模式相关

### defaultMode

- **类型**：`'hex' | 'rgb' | 'hsl'`
- **默认值**：注册了 Alpha 插件时为 `'rgb'`，否则为 `'hex'`

初始输入模式。

```ts
new ewColorPicker({ el: '#picker', defaultMode: 'hsl' })
```

### changeMode

- **类型**：`(mode: 'hex' | 'rgb' | 'hsl', picker: ewColorPicker) => void`

模式切换时的回调（由 ColorMode 插件调用）。

```ts
new ewColorPicker({
  el: '#picker',
  changeMode(mode) {
    console.log('当前模式：', mode)
  },
})
```

## ewColorPickerPanel

- **类型**：`boolean`

`false` 时不渲染颜色面板，等价于 `hasPanel: false`。

## ewColorPickerColorMode

- **类型**：`false | { defaultMode?, changeMode?, showColorMode? }`

颜色模式插件的嵌套配置。`false` 时关闭模式切换；传对象时会覆盖对应字段。

## ewColorPickerBox

- **类型**：对象

颜色盒的扩展配置，同时也是 `autoPanelPosition` 生效的前提。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `onClick` | `(plugin) => void` | 点击颜色盒时调用（在默认开合行为之外） |
| `onMouseEnter` | `(plugin) => void` | 鼠标移入 |
| `onMouseLeave` | `(plugin) => void` | 鼠标移出 |
| `disabled` | `boolean` | 盒子禁用 |
| `readonly` | `boolean` | 只读（保留样式，不响应点击） |
| `className` | `string` | 追加到盒子上的类名 |
| `style` | `Partial<CSSStyleDeclaration>` | 追加内联样式 |
| `boxNoColorIcon` | `string` | 无颜色时的自定义图标（HTML 字符串） |
| `boxHasColorIcon` | `string` | 有颜色时的自定义图标（HTML 字符串） |

```ts
new ewColorPicker({
  el: '#picker',
  ewColorPickerBox: {
    onClick(plugin) {
      console.log('盒子被点击', plugin)
    },
    className: 'my-box',
  },
})
```

## 完整示例

```ts
import ewColorPicker from '@ew-color-picker/ew-color-picker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

const picker = new ewColorPicker({
  el: '#picker',
  defaultColor: '#6366f1',
  size: 'large',
  predefineColor: ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e'],
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  panelPlacement: 'bottom-end',
  togglePickerAnimation: 'height',
  pickerAnimationTime: 240,
  clearText: '重置',
  sureText: '应用',
  changeColor(color) {
    console.log('change:', color)
  },
  sure(color) {
    console.log('sure:', color)
  },
})
```

## 相关链接

- [实例方法](./methods)
- [事件](./events)
- [回调](./callbacks)
- [插件总览](../plugins/)
