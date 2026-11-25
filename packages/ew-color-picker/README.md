# @ew-color-picker/ew-color-picker

ew-color-picker 聚合包：注册全部内置插件并导出核心，开箱即用。

## 安装

```bash
pnpm add @ew-color-picker/ew-color-picker
```

## 使用

```ts
import ewColorPicker from '@ew-color-picker/ew-color-picker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

const picker = new ewColorPicker({
  el: '#picker',
  defaultColor: '#6366f1',
})

console.log(picker.getColor()) // '#6366f1'
```

## 独立组件

聚合包同时导出各独立组件，无需再单独安装对应子包：

```ts
import {
  Input,
  Button,
  Checkbox,
  Select,
  InputNumber,
  Tooltip,
} from '@ew-color-picker/ew-color-picker'
import '@ew-color-picker/style/dist/input.css'
import '@ew-color-picker/style/dist/button.css'
import '@ew-color-picker/style/dist/checkbox.css'
import '@ew-color-picker/style/dist/select.css'
import '@ew-color-picker/style/dist/tooltip.css'

const input = new Input({ placeholder: '请输入内容' })
document.body.appendChild(input.getElement())

const button = new Button({ text: '确定', type: 'primary' })
document.body.appendChild(button.getElement())
```

## 相关链接

- 官网文档：https://eveningwater.github.io/ew-color-picker/zh/
- 快速开始：https://eveningwater.github.io/ew-color-picker/zh/guide/getting-started
- 在线演示：https://eveningwater.github.io/ew-color-picker/zh/examples/demo
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
