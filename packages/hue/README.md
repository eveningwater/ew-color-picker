# @ew-color-picker/hue

颜色选择器的色相滑块插件，用于调整 HSV 中的色相（Hue）。

## 安装

```bash
pnpm add @ew-color-picker/hue
```

## 使用

```ts
import ewColorPicker from '@ew-color-picker/core'
import Hue from '@ew-color-picker/hue'

ewColorPicker.use(Hue)

const picker = new ewColorPicker({ el: '#picker' })
```

通常更推荐直接使用聚合包 `@ew-color-picker/ew-color-picker`，内置插件已全部注册。

## 相关链接

- 插件文档：https://eveningwater.github.io/ew-color-picker/plugins/hue
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
