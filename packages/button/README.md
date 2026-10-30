# @ew-color-picker/button

EW Color Picker 的按钮插件，提供清空和确定按钮功能。

## 功能特性

- 🗑️ 清空按钮
- ✅ 确定按钮
- 🎯 自定义按钮文本
- 🔄 事件回调支持

## 安装

```bash
npm install @ew-color-picker/button
```

## 使用

```javascript
import ewColorPicker from '@ew-color-picker/core';
import ewColorPickerButtonPlugin from '@ew-color-picker/button';

// 注册插件
ewColorPicker.use(ewColorPickerButtonPlugin);

// 创建颜色选择器
const colorPicker = new ewColorPicker({
  el: '#color-picker',
  hasClear: true,
  hasSure: true,
  clearText: '清空',
  sureText: '确定',
  sure: (color) => {
    console.log('确定选择:', color);
  },
  clear: () => {
    console.log('清空颜色');
  }
});
```

## API

### 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| hasClear | boolean | true | 是否显示清空按钮 |
| hasSure | boolean | true | 是否显示确定按钮 |
| clearText | string | '清空' | 清空按钮文本 |
| sureText | string | '确定' | 确定按钮文本 |

### 回调函数

| 参数 | 类型 | 说明 |
|------|------|------|
| sure | Function | 确定按钮回调 |
| clear | Function | 清空按钮回调 |

### 方法

- `setClearText(text: string)`: 设置清空按钮文本
- `setSureText(text: string)`: 设置确定按钮文本
- `setDisabled(disabled: boolean)`: 设置禁用状态

## 许可证

MIT 