# EW Color Picker

**中文 | [English](./README.en.md)**

事件驱动 + 插件化的现代颜色选择器。核心只维护颜色状态与事件，界面全部由插件组装，可按需组合、替换与扩展。

- 官网文档：https://eveningwater.github.io/ew-color-picker/
- 在线演示：https://eveningwater.github.io/ew-color-picker/examples/demo
- 其他项目：https://www.eveningwater.com
- AI 文档索引：[llms.txt](https://eveningwater.github.io/ew-color-picker/llms.txt) · [llms-full.txt](https://eveningwater.github.io/ew-color-picker/llms-full.txt)

## 特性

- **插件架构**：Box、Panel、Hue、Alpha、Input、InputNumber、Button、Predefine、ColorMode 全部是独立插件
- **事件驱动**：`change` / `sure` / `clear` / `toggle` / `mode-change` / `options-update` / `destroy`
- **多颜色模式**：Hex、RGB、HSL 输入切换，支持透明度
- **完整类型**：全部包使用 TypeScript 编写并输出声明文件
- **多实例隔离**：每个实例拥有独立事件总线、DOM 与插件实例
- **按需加载**：13 个独立包，可只引入所需插件

## 包结构

| 包 | 职责 |
| --- | --- |
| `@ew-color-picker/core` | 颜色状态、事件总线、挂载点、插件注册 |
| `@ew-color-picker/utils` | DOM / 颜色 / 动画工具、`EventEmitter`、`Console` 插件 |
| `@ew-color-picker/style` | 样式产物（`index.css` + `input-number.css`） |
| `@ew-color-picker/ewColorPicker` | 聚合包：注册全部插件并导出核心 |
| `@ew-color-picker/box` | 触发器色块 |
| `@ew-color-picker/panel` | 饱和度 / 明度面板 |
| `@ew-color-picker/hue` | 色相滑块 |
| `@ew-color-picker/alpha` | 透明度滑块 |
| `@ew-color-picker/input` | 文本颜色输入框 |
| `@ew-color-picker/input-number` | 数字输入组件与插件 |
| `@ew-color-picker/button` | 清空 / 确定按钮 |
| `@ew-color-picker/predefine` | 预定义颜色 |
| `@ew-color-picker/color-mode` | Hex / RGB / HSL 模式切换 |

## 安装

```bash
pnpm add @ew-color-picker/ewColorPicker @ew-color-picker/style
```

```ts
import ewColorPicker from '@ew-color-picker/ewColorPicker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

const picker = new ewColorPicker({
  el: '#colorPicker',
  defaultColor: '#6366f1',
})

picker.on('change', (color) => console.log('颜色改变：', color))
```

> 两个样式文件都需要引入：`index.css` 负责选择器，`input-number.css` 负责 RGB/HSL 数字输入框。

### 按需引入

```ts
import ewColorPicker from '@ew-color-picker/core'
import Box from '@ew-color-picker/box'
import Panel from '@ew-color-picker/panel'
import Hue from '@ew-color-picker/hue'
import Input from '@ew-color-picker/input'
import Button from '@ew-color-picker/button'

ewColorPicker.use(Box).use(Panel).use(Hue).use(Input).use(Button)

new ewColorPicker({ el: '#colorPicker' })
```

### UMD

```html
<link rel="stylesheet" href="https://unpkg.com/@ew-color-picker/style/dist/index.css" />
<link rel="stylesheet" href="https://unpkg.com/@ew-color-picker/style/dist/input-number.css" />

<div id="colorPicker"></div>
<script src="https://unpkg.com/@ew-color-picker/ewColorPicker/dist/index.min.js"></script>
<script>
  new ewColorPicker({ el: '#colorPicker', defaultColor: '#ff0000' })
</script>
```

## 使用示例

```ts
const picker = new ewColorPicker({
  el: '#colorPicker',
  defaultColor: 'rgba(99, 102, 241, 0.8)',
  size: 'large',
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  predefineColor: ['#ef4444', '#22c55e', '#3b82f6', { color: '#0f172a', disabled: true }],
  clearText: '重置',
  sureText: '应用',
  autoPanelPosition: true,
  panelPlacement: 'bottom-start',
  togglePickerAnimation: 'height',
  pickerAnimationTime: 250,
  changeColor: (color) => console.log('回调：', color),
})

picker.on('sure', (color, instance) => console.log('确定：', color, instance.getColor()))
picker.on('clear', () => console.log('已清空'))
picker.on('mode-change', (mode) => console.log('模式：', mode))
```

## 配置项

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `el` | `string \| HTMLElement` | `document.body` | 挂载容器，提供后自动挂载 |
| `disabled` | `boolean` | `false` | 禁用全部交互 |
| `defaultColor` | `string` | `''` | 初始颜色，也是清空后的还原色 |
| `size` | `string \| number \| object` | `'normal'` | 色块尺寸：`mini`/`small`/`normal`/`medium`/`large`、数字、`{ width, height }` |
| `predefineColor` | `(string \| { color, disabled? })[]` | `[]` | 预定义颜色，为空则不渲染 |
| `isClickOutside` | `boolean` | `true` | 点击外部关闭面板 |
| `hueDirection` | `'vertical' \| 'horizontal'` | `'vertical'` | 色相滑块方向 |
| `alphaDirection` | `'vertical' \| 'horizontal'` | `'vertical'` | 透明度滑块方向 |
| `autoPanelPosition` | `boolean` | `false` | 面板自动定位（需 Box） |
| `panelPlacement` | `string` | `'bottom'` | 12 个方位值，见文档 |
| `clearText` / `sureText` | `string` | `'清空'` / `'确定'` | 按钮文案 |
| `togglePickerAnimation` | `string` | `'default'` | `default` / `height` / `opacity` |
| `pickerAnimationTime` | `number` | `200` | 动画时长（≤10000ms） |
| `hasBox` / `hasPanel` / `hasInput` | `boolean` | `true` | 控制对应插件 |
| `hasClear` / `hasSure` | `boolean` | `true` | 控制按钮 |
| `hue` / `alpha` | `boolean` | `true` | 控制滑块 |
| `showButton` / `showColorMode` / `showInputNumber` | `boolean` | `true` | 控制底部区域 |
| `defaultMode` | `'hex' \| 'rgb' \| 'hsl'` | 有 Alpha 时 `rgb`，否则 `hex` | 初始模式 |
| `readonly` | `boolean` | `false` | 只读：阻止点击色块 |
| `className` / `style` | `string \| object` | `''` | 色块额外类名 / 内联样式 |
| `changeColor` | `(color) => void` | - | 颜色改变回调 |
| `sure` | `(color, picker) => void` | - | 确定回调 |
| `clear` | `(picker) => void` | - | 清空回调 |
| `togglePicker` | `(isOpen) => void` | - | 面板开合回调 |

完整说明见[配置项文档](https://eveningwater.github.io/ew-color-picker/api/options)。

## 实例方法

| 方法 | 说明 |
| --- | --- |
| `setColor(color)` | 唯一推荐的改色入口，触发 `change` |
| `getColor()` | 获取当前颜色 |
| `getHsvaColor()` / `setHsvaColor(hsva)` | 读写 HSVA（后者不触发事件） |
| `showPanel()` / `hidePanel()` | 开合面板 |
| `openPicker()` / `closePicker()` | 上面两个的别名 |
| `getOptions()` / `updateOptions(options)` | 读写配置，后者触发 `options-update` |
| `mount(el?)` / `getContainer()` / `getMountPoint(name)` | 挂载与容器访问 |
| `on` / `once` / `off` / `trigger` / `emit` | 事件 API |
| `destroy()` / `getDestroyedStatus()` | 销毁与状态查询 |

完整签名见[实例方法文档](https://eveningwater.github.io/ew-color-picker/api/methods)。

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `change` | `(color)` | 颜色改变 |
| `toggle` | `(isOpen)` | 面板开合 |
| `sure` | `(color, picker)` | 点击确定 |
| `clear` | `()` | 点击清空 |
| `options-update` | `(options)` | 配置更新 |
| `mode-change` | `(mode)` | `hex` / `rgb` / `hsl` |
| `destroy` | `()` | 实例销毁 |

监听函数返回 `true` 可中断后续监听。

## 自定义插件

```ts
import ewColorPicker from '@ew-color-picker/core'
import { ApplyOrder } from '@ew-color-picker/utils'

export default class CustomPlugin {
  static pluginName = 'CustomPlugin'
  static applyOrder = ApplyOrder.Post

  constructor(public ewColorPicker: ewColorPicker) {
    // 渲染到挂载点并订阅事件
  }

  destroy() {
    // 释放 DOM 与事件
  }
}
```

```ts
ewColorPicker.use(CustomPlugin)
```

详见[插件开发指南](https://eveningwater.github.io/ew-color-picker/guide/plugin-dev)。

## 本地开发

```bash
pnpm install         # 安装依赖
pnpm run build:all   # 构建全部包与样式
pnpm run dev:preview # 示例热更新服务
pnpm run test:run    # 全量测试
pnpm run docs:dev    # 启动文档站点
pnpm run docs:build  # 构建文档
```

## 文档

- 中文：https://eveningwater.github.io/ew-color-picker/
- English：https://eveningwater.github.io/ew-color-picker/en/
- 示例：https://eveningwater.github.io/ew-color-picker/examples/
- 演示：https://eveningwater.github.io/ew-color-picker/examples/demo

## 贡献

欢迎提交 Issue 与 Pull Request。

## 许可证

MIT License

---

**作者**：eveningwater  
**仓库**：https://github.com/eveningwater/ew-color-picker
