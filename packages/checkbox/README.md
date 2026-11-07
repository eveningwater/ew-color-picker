# @ew-color-picker/checkbox

颜色选择器的复选框组件与插件，用于替代原生 `input[type=checkbox]`，提供统一外观与键盘无障碍支持。

## 安装

```bash
pnpm add @ew-color-picker/checkbox
```

## 插件用法

```ts
import ewColorPicker from '@ew-color-picker/core'
import Checkbox from '@ew-color-picker/checkbox'

ewColorPicker.use(Checkbox)

const picker = new ewColorPicker({
  el: '#picker',
  checkboxLabel: '反向渐变',
  checkboxChecked: false,
  checkboxDisabled: false,
  onCheckboxChange: (checked) => console.log(checked),
})
```

未传 `checkboxLabel` 或 `showCheckbox: false` 时不会渲染。

使用复选框组件时需额外引入样式：

```ts
import '@ew-color-picker/style/dist/checkbox.css'
```

## 组件用法

```ts
import { Checkbox } from '@ew-color-picker/checkbox'

const checkbox = new Checkbox({
  label: 'Repeating',
  checked: true,
  size: 'small',
  prefix: 'ew-',
  onChange: (checked) => console.log(checked),
})

document.body.appendChild(checkbox.getElement())
```

组件方法：`isChecked()`、`setChecked(checked, triggerChange?)`、`setLabel(label)`、`setDisabled(disabled)`、`getElement()`、`destroy()`。

## 相关链接

- 插件文档：https://eveningwater.github.io/ew-color-picker/zh/plugins/checkbox
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
