# @ew-color-picker/panel

EW Color Picker 的颜色面板插件，提供颜色选择面板和滑块功能。

## 功能特性

- 🎨 颜色选择面板
- 🎛️ 色相滑块
- 🔄 透明度滑块
- 📱 触摸设备支持
- 🎯 拖拽交互

## 安装

```bash
npm install @ew-color-picker/panel
```

## 使用

```javascript
import ewColorPicker from '@ew-color-picker/core';
import ewColorPickerPanelPlugin from '@ew-color-picker/panel';

// 注册插件
ewColorPicker.use(ewColorPickerPanelPlugin);

// 创建颜色选择器
const colorPicker = new ewColorPicker({
  el: '#color-picker',
  hue: true,
  alpha: true,
  hueDirection: 'vertical',
  alphaDirection: 'vertical'
});
```

## API

### 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| hue | boolean | true | 是否显示色相滑块 |
| alpha | boolean | false | 是否显示透明度滑块 |
| hueDirection | 'vertical' \| 'horizontal' | 'vertical' | 色相滑块方向 |
| alphaDirection | 'vertical' \| 'horizontal' | 'vertical' | 透明度滑块方向 |

### 方法

- `setColor(color: string)`: 设置颜色
- `updateCursorPosition()`: 更新光标位置
- `destroy()`: 销毁插件

## 许可证

MIT 