---
title: Panel 颜色面板插件
description: Panel 插件渲染饱和度/明度二维选择面板，支持拖拽与触摸、自动定位、面板尺寸自适应。
---

# Panel 颜色面板

`ewColorPickerPanel` 负责最核心的取色区域：一张二维渐变面板，横轴是饱和度（S），纵轴是明度（V），拖动光标即可改色。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/panel` |
| `pluginName` | `ewColorPickerPanel` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` |
| 访问实例 | `core.plugins.ewColorPickerPanel` |

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `hasPanel` | `boolean` | `true` | `false` 时不渲染二维面板 |
| `ewColorPickerPanel` | `boolean \| object` | `true` | 兼容写法：`false` 等价于关闭面板；对象形式可合并面板配置 |
| `hueDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | 影响面板计算宽度（水平布局更宽） |
| `alphaDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | 同上，两者都水平时面板宽 320px |
| `autoPanelPosition` | `boolean` | `false` | 是否根据触发器位置自动定位面板 |
| `panelPlacement` | `string` | `'bottom'` | 自动定位时的方向，见下表 |
| `ewColorPickerBox` | `boolean` | `true` | 自动定位必须是 `true`（需要读取 Box 尺寸） |
| `alpha` | `boolean` | 由插件是否存在决定 | 有无透明度插件会影响默认颜色格式 |
| `disabled` | `boolean` | `false` | 禁用后拖拽不生效 |

### panelPlacement 取值

| 方向 | 对齐 |
| --- | --- |
| `top-start` / `top` / `top-end` | 面板在上方 |
| `bottom-start` / `bottom` / `bottom-end` | 面板在下方 |
| `left-start` / `left` / `left-end` | 面板在左侧 |
| `right-start` / `right` / `right-end` | 面板在右侧 |

带 `-start` / `-end` 时按触发器边缘对齐，不带后缀时居中对齐。面板与触发器间距固定 5px，超出视口会自动翻转/内收。

### 面板宽度规则

| hue 方向 | alpha 方向 | 面板宽度 |
| --- | --- | --- |
| 垂直 | 垂直 | 285px |
| 水平 | 垂直（或反之） | 约 302px |
| 水平 | 水平 | 320px |

高度固定 180px，通过 CSS 变量 `--panel-width` / `--panel-height` 注入。

## 实例方法

```ts
const panel = picker.plugins.ewColorPickerPanel
```

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `render` | `() => void` | 重建面板 DOM（会移除旧面板） |
| `updateCursorPosition` | `(saturation: number, value: number) => void` | 把光标移动到 S/V 对应位置（0–100） |
| `updateColor` | `(saturation: number, value: number) => void` | 按 S/V 计算新颜色并调用 `core.setColor()`，随后 `trigger('change')` |
| `updateHueBg` | `(hue?: number) => void` | 更新面板纯色底；不传则取当前颜色色相 |
| `calculateContainerSize` | `() => void` | 计算容器尺寸（隐藏状态下会临时离屏测量） |
| `handleAutoPosition` | `() => void` | 按 `panelPlacement` 计算并应用面板位置 |
| `calculatePosition` | `(position, align, boxWidth, boxHeight) => { left, top }` | 纯计算，不写 DOM |
| `adjustForViewport` | `(root, left, top) => { left, top }` | 视口边界修正 |
| `destroy` | `() => void` | 移除面板与事件 |

### 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `panel` | `HTMLElement \| null` | 面板根节点 |
| `cursor` | `HTMLElement \| null` | 光标节点 |
| `whitePanel` / `blackPanel` | `HTMLElement \| null` | 白/黑渐变层 |
| `panelWidth` / `panelHeight` | `number` | 当前面板尺寸 |
| `isHueHorizontal` / `isAlphaHorizontal` | `boolean` | 方向标记 |
| `isDragging` | `boolean` | 是否正在拖拽 |

### 手动改色

```ts
// 饱和度 50%，明度 80%
picker.plugins.ewColorPickerPanel.updateColor(50, 80)
```

注意 `updateColor` 内部已经调用了 `core.setColor()` 并触发 `change`，不需要再调用一次。

## 交互行为

| 操作 | 行为 |
| --- | --- |
| 点击面板 | 光标跳到点击位置并立即改色 |
| 按住拖拽 | 节流 16ms（约 60fps）连续改色 |
| 触摸滑动 | 与鼠标拖拽一致 |
| 颜色被其他插件修改 | 监听 `change` 自动同步光标与底色 |

`updateColor` 会先取当前颜色；若为空或包含 `NaN`，会回退到红色（`alpha` 开启时为 `rgba(255,0,0,1)`）并先 `setColor`，保证面板始终有可计算的颜色。

## 事件

Panel 不定义自己的事件类型，改色时：

```ts
core.setColor(newColor)
core.trigger('change', newColor)
```

因此监听 `change` 即可拿到面板拖动产生的颜色：

```ts
picker.on('change', (color) => console.log(color))
```

## DOM 结构

```html
<div class="ew-color-picker-panel-container">
  <div class="ew-color-picker-panel ew-color-picker-panel-dynamic-size"
       style="--panel-width:285px;--panel-height:180px;background:rgba(255,0,0,1)">
    <div class="ew-color-picker-white-panel"></div>
    <div class="ew-color-picker-black-panel"></div>
    <div class="ew-color-picker-panel-cursor"></div>
  </div>
  <div class="ew-color-picker-bottom-row">
    <!-- Hue / Alpha / InputNumber / Button / ColorMode 等 -->
  </div>
</div>
```

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-panel` | 面板根节点 |
| `.ew-color-picker-panel-dynamic-size` | 动态尺寸标记 |
| `.ew-color-picker-white-panel` | 白色渐变层（饱和度） |
| `.ew-color-picker-black-panel` | 黑色渐变层（明度） |
| `.ew-color-picker-panel-cursor` | 拖拽光标 |
| `.ew-color-picker-bottom-row` | 底部行容器，其它插件往这里插入 |

## 完整示例

```ts
import ewColorPicker from '@ew-color-picker/ew-color-picker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#22c55e',
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  autoPanelPosition: true,
  panelPlacement: 'bottom-start',
})

// 3 秒后把光标拖到「低饱和、低明度」
setTimeout(() => {
  picker.plugins.ewColorPickerPanel.updateColor(20, 30)
}, 3000)
```

## 相关

- [Hue 色相滑块](./hue.md)
- [Alpha 透明度滑块](./alpha.md)
- [配置项 · panelPlacement](../api/options.md#panelplacement)
- [方法 · showPanel / hidePanel](../api/methods.md#showpanel)
