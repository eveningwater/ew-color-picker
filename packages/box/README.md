# @ew-color-picker/box

颜色选择器的触发色块插件：显示当前颜色，点击开合颜色面板。

## 安装

```bash
pnpm add @ew-color-picker/box
```

## 使用

```ts
import ewColorPicker from '@ew-color-picker/core'
import Box from '@ew-color-picker/box'

ewColorPicker.use(Box)

const picker = new ewColorPicker({ el: '#picker' })
```

通常更推荐直接使用聚合包 `@ew-color-picker/ewColorPicker`，内置插件已全部注册。

## 相关链接

- 插件文档：https://eveningwater.github.io/ew-color-picker/plugins/box
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
