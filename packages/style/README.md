# @ew-color-picker/style

ew-color-picker 的样式包，提供完整的CSS样式。

## 功能特性

- 🎨 完整的颜色选择器样式
- 📱 响应式设计
- 🌙 主题支持
- 🎪 动画效果
- 🔧 CSS变量定制

## 安装

```bash
npm install @ew-color-picker/style
```

## 使用

### 直接引入

```javascript
import '@ew-color-picker/style';
```

### 在HTML中引入

```html
<link rel="stylesheet" href="node_modules/@ew-color-picker/style/dist/index.css">
```

### 自定义主题

```css
:root {
  --ew-color-picker-border-color: #dcdfe6;
  --ew-color-picker-background: #fff;
  --ew-color-picker-text-color: #606266;
  --ew-color-picker-primary-color: #409eff;
}
```

## 样式结构

```
.ew-color-picker/
├── .ew-color-picker-container
├── .ew-color-picker-box
├── .ew-color-picker
│   ├── .ew-color-picker-content
│   │   ├── .ew-color-picker-panel
│   │   └── .ew-color-picker-slider
│   ├── .ew-color-drop-container
│   └── .ew-color-picker-predefine-container
```

## 许可证

MIT 