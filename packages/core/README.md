# @ew-color-picker/core

颜色选择器核心：维护颜色状态、事件总线、挂载点与插件注册，不包含任何界面。

## 安装

```bash
pnpm add @ew-color-picker/core
```

## 使用

```ts
import ewColorPicker from '@ew-color-picker/core'
import ewColorPickerBoxPlugin from '@ew-color-picker/box'

ewColorPicker.use(ewColorPickerBoxPlugin)

const picker = new ewColorPicker({ el: '#picker' })
```

## 相关链接

- 核心概念：https://eveningwater.github.io/ew-color-picker/guide/concepts
- 编写插件：https://eveningwater.github.io/ew-color-picker/guide/plugin-dev
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
