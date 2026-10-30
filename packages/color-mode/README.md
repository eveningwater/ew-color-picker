# @ew-color-picker/colorMode

颜色选择器的颜色模式切换插件，支持 Hex / RGB / HSL 三种输入模式。

## 安装

```bash
pnpm add @ew-color-picker/colorMode
```

## 使用

```ts
import ewColorPicker from '@ew-color-picker/core'
import ColorMode from '@ew-color-picker/colorMode'

ewColorPicker.use(ColorMode)

const picker = new ewColorPicker({ el: '#picker' })
```

通常更推荐直接使用聚合包 `@ew-color-picker/ewColorPicker`，内置插件已全部注册。

## 相关链接

- 插件文档：https://eveningwater.github.io/ew-color-picker/plugins/color-mode
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
