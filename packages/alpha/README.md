# @ew-color-picker/alpha

颜色选择器的透明度滑块插件，用于调整颜色的 alpha 通道。

## 安装

```bash
pnpm add @ew-color-picker/alpha
```

## 使用

```ts
import ewColorPicker from '@ew-color-picker/core'
import Alpha from '@ew-color-picker/alpha'

ewColorPicker.use(Alpha)

const picker = new ewColorPicker({ el: '#picker' })
```

通常更推荐直接使用聚合包 `@ew-color-picker/ew-color-picker`，内置插件已全部注册。

## 相关链接

- 插件文档：https://eveningwater.github.io/ew-color-picker/plugins/alpha
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
