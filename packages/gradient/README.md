# @ew-color-picker/gradient

颜色选择器的渐变色编辑插件，支持线性、径向、锥形渐变，重复渐变、角度与位置、双位置色标以及插值色彩空间。

> 定位：插件只编辑渐变结构，不包含独立的取色 UI。选中色标后的颜色由主面板（Panel / Hue / Alpha / InputNumber）修改并写回，因此必须依赖 `panelContainer`，不能脱离颜色选择器单独使用。只需处理渐变数据时，可直接使用包内导出的 `parseGradient`、`serializeGradient`、`interpolateStops` 等纯函数。

## 安装

```bash
pnpm add @ew-color-picker/gradient
```

## 使用

```ts
import ewColorPicker from '@ew-color-picker/core'
import Gradient from '@ew-color-picker/gradient'

ewColorPicker.use(Gradient)

const picker = new ewColorPicker({
  el: '#picker',
  showGradient: true,
  gradientStops: ['#ff0000', '#0000ff'],
  gradientType: 'linear',
  gradientAngle: 90,
  gradientChange: (css, value) => console.log(css, value),
})
```

传入 CSS 字符串会先解析为结构化数据：

```ts
new ewColorPicker({
  el: '#picker',
  gradient:
    'linear-gradient(45deg, #ff0000 0%, #ffff00 50%, #0000ff 100%)',
})
```

## 配置

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showGradient` | `boolean` | `false` | 是否渲染渐变编辑器；传 `gradient` / `gradientStops` 时自动渲染 |
| `gradient` | `string \| GradientValue` | - | 初始渐变（CSS 字符串或结构化数据） |
| `gradientType` | `'linear' \| 'radial' \| 'conic'` | `'linear'` | 渐变类型 |
| `gradientRepeating` | `boolean` | `false` | 是否重复渐变 |
| `gradientStops` | `Array<string \| GradientStop>` | 当前色 + 白色 | 初始色标 |
| `gradientAngle` | `number` | `180` | 线性渐变角度（度） |
| `gradientInterpolation` | `string \| null` | `null` | 插值色彩空间，如 `oklab`、`oklch longer hue` |
| `minGradientStops` | `number` | `2` | 最少色标数 |
| `maxGradientStops` | `number` | `8` | 最多色标数 |
| `syncStopsOnChange` | `boolean` | `true` | 主面板改色时写回当前选中的色标 |
| `gradientChange` | `(css, value) => void` | - | 渐变变化回调 |

## 实例方法

```ts
const plugin = picker.plugins.ewColorPickerGradient

plugin.getGradient()      // 当前渐变的 CSS 字符串
plugin.getGradientValue() // 结构化渐变数据
plugin.getStops()         // 色标数组
plugin.setGradient(css)   // 设置渐变
plugin.setStops(stops)    // 设置色标
plugin.addStop(color, position?)
plugin.removeStop(index?)
```

## 导出的工具函数

```ts
import {
  parseGradient,
  serializeGradient,
  interpolateStops,
  resolveGradientPositions,
} from '@ew-color-picker/gradient'
```

`parseGradient` 支持 6 种渐变前缀、角度单位转换、`to <side-or-corner>`、径向形状/尺寸/位置、锥形起始角、`in <color-space>` 插值提示与双位置色标；`serializeGradient` 与解析保持稳定回环。

径向/锥形渐变编辑器依赖 `@ew-color-picker/select` 与 `@ew-color-picker/input-number`，使用完整样式时请一并引入：

```ts
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/select.css'
import '@ew-color-picker/style/dist/input-number.css'
```

## 相关链接

- 插件文档：https://eveningwater.github.io/ew-color-picker/zh/plugins/gradient
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
