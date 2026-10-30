# @ew-color-picker/input-number

颜色选择器的数字输入组件与插件，配合输入框调节 RGB / HSL 各通道数值。

## 安装

```bash
pnpm add @ew-color-picker/input-number
```

## 使用

```ts
import ewColorPicker from '@ew-color-picker/core'
import InputNumber from '@ew-color-picker/input-number'

ewColorPicker.use(InputNumber)

const picker = new ewColorPicker({ el: '#picker' })
```

使用数字输入框时需额外引入样式：

```ts
import '@ew-color-picker/style/dist/input-number.css'
```

## 相关链接

- 插件文档：https://eveningwater.github.io/ew-color-picker/plugins/input-number
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
