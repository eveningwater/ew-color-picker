# @ew-color-picker/ewColorPicker

EW Color Picker 聚合包：注册全部内置插件并导出核心，开箱即用。

## 安装

```bash
pnpm add @ew-color-picker/ewColorPicker
```

## 使用

```ts
import ewColorPicker from '@ew-color-picker/ewColorPicker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

const picker = new ewColorPicker({
  el: '#picker',
  defaultColor: '#6366f1',
})

console.log(picker.getColor()) // '#6366f1'
```

## 相关链接

- 官网文档：https://eveningwater.github.io/ew-color-picker/
- 快速开始：https://eveningwater.github.io/ew-color-picker/guide/getting-started
- 在线演示：https://eveningwater.github.io/ew-color-picker/examples/demo
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
