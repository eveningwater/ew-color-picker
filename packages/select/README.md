# @ew-color-picker/select

颜色选择器的下拉选择组件与插件，用于在面板中提供自定义选项列表。

## 安装

```bash
pnpm add @ew-color-picker/select
```

## 使用

```ts
import ewColorPicker from '@ew-color-picker/core'
import Select from '@ew-color-picker/select'

ewColorPicker.use(Select)

const picker = new ewColorPicker({
  el: '#picker',
  selectItems: [
    { label: '线性渐变', value: 'linear' },
    { label: '径向渐变', value: 'radial' },
  ],
  selectValue: 'linear',
  selectClearable: true,
  onSelectChange: (value) => console.log(value),
  onSelectClear: () => console.log('已清空'),
})
```

选中值后触发器右侧会出现清空图标，点击即可重置选中项；传 `selectClearable: false` 可隐藏该图标。

使用下拉选择组件时需额外引入样式：

```ts
import '@ew-color-picker/style/dist/select.css'
```

## 相关链接

- 插件文档：https://eveningwater.github.io/ew-color-picker/zh/plugins/select
- 源码仓库：https://github.com/eveningwater/ew-color-picker

## License

MIT
