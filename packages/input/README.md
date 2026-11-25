# @ew-color-picker/input

ew-color-picker 的输入框插件，提供颜色值输入功能。

## 功能特性

- 📝 颜色值输入
- ✅ 颜色格式验证
- 🎨 多种颜色格式支持
- 🔄 实时颜色更新

## 安装

```bash
npm install @ew-color-picker/input
```

## 使用

```javascript
import ewColorPicker from '@ew-color-picker/core';
import ewColorPickerInputPlugin from '@ew-color-picker/input';

// 注册插件
ewColorPicker.use(ewColorPickerInputPlugin);

// 创建颜色选择器
const colorPicker = new ewColorPicker({
  el: '#color-picker',
  hasInput: true,
  changeColor: (color) => {
    console.log('颜色改变:', color);
  }
});
```

## API

### 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| hasInput | boolean | true | 是否显示输入框 |
| disabled | boolean | false | 是否禁用输入框 |

### 方法

- `setValue(value: string)`: 设置输入框值
- `getValue(): string`: 获取输入框值
- `setDisabled(disabled: boolean)`: 设置禁用状态
- `update(color: string)`: 更新颜色值

## 独立使用

该包同时导出一个不依赖颜色选择器的通用输入框，样式需单独引入 `@ew-color-picker/style/input.css`。

```javascript
import { Input } from '@ew-color-picker/input';
import '@ew-color-picker/style/dist/input.css';

const input = new Input({
  placeholder: '请输入内容',
  size: 'default',
  onChange: (value) => console.log(value),
  onEnter: (value) => console.log('提交', value)
});

document.querySelector('#app').appendChild(input.getElement());

input.setValue('hello');
input.setDisabled(true);
input.destroy();
```

选项：`value`、`placeholder`、`size`、`type`、`disabled`、`readonly`、`prefix`、`onChange`、`onFocus`、`onBlur`、`onEnter`。
方法：`getValue()`、`setValue()`、`setPlaceholder()`、`setDisabled()`、`setReadonly()`、`focus()`、`getElement()`、`destroy()`。

## 许可证

MIT 