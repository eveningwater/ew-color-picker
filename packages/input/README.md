# @ew-color-picker/input

EW Color Picker 的输入框插件，提供颜色值输入功能。

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

## 许可证

MIT 