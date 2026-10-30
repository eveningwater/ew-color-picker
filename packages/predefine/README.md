# @ew-color-picker/predefine

EW Color Picker 的预定义颜色插件，提供预定义颜色快速选择功能。

## 功能特性

- 🌈 预定义颜色网格
- ⚡ 快速颜色选择
- 🚫 支持禁用单个颜色
- 🎨 支持透明度颜色
- 🎯 激活状态显示

## 安装

```bash
npm install @ew-color-picker/predefine
```

## 使用

```javascript
import ewColorPicker from '@ew-color-picker/core';
import ewColorPickerPredefinePlugin from '@ew-color-picker/predefine';

// 注册插件
ewColorPicker.use(ewColorPickerPredefinePlugin);

// 创建颜色选择器
const colorPicker = new ewColorPicker({
  el: '#color-picker',
  predefineColor: [
    '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff',
    { color: 'rgba(255, 0, 0, 0.5)', disabled: false },
    { color: '#cccccc', disabled: true }
  ],
  changeColor: (color) => {
    console.log('颜色改变:', color);
  }
});
```

## API

### 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| predefineColor | string[] \| PredefineColor[] | [] | 预定义颜色数组 |

### 类型定义

```typescript
interface PredefineColor {
  color: string;
  disabled?: boolean;
}
```

### 方法

- `updatePredefineColors(colors: string[] \| PredefineColor[])`: 更新预定义颜色
- `setDisabled(index: number, disabled: boolean)`: 设置颜色禁用状态

## 许可证

MIT 