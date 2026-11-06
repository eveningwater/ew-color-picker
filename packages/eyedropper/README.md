# @ew-color-picker/eyedropper

ew-color-picker 的吸管取色插件，基于浏览器原生 [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API)，从屏幕任意位置拾取颜色并写回选择器。

## 功能特性

- 一键从屏幕取色，写回当前颜色
- 自动检测浏览器能力，不支持时不渲染按钮
- 支持隐藏按钮、自定义按钮提示文案
- 取色成功回调
- 用户取消取色时静默处理，不抛出异常

## 安装

```bash
npm install @ew-color-picker/eyedropper
```

## 使用

```javascript
import ewColorPicker from '@ew-color-picker/core';
import Eyedropper from '@ew-color-picker/eyedropper';

// 注册插件
ewColorPicker.use(Eyedropper);

// 创建颜色选择器
const colorPicker = new ewColorPicker({
  el: '#color-picker',
  showEyedropper: true,
  eyedropperText: '取色',
  onEyedropperPick: (color) => {
    console.log('拾取到的颜色:', color);
  },
});
```

## API

### 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| showEyedropper | boolean | true | 是否显示吸管按钮；浏览器不支持 EyeDropper API 时始终不渲染 |
| eyedropperText | string | '取色' | 按钮的 `title` / `aria-label`；设置后同时作为可见文本显示 |
| onEyedropperPick | (color: string) => void | - | 取色成功回调，参数为 `sRGBHex` 颜色值 |

### 浏览器支持

EyeDropper API 目前在 Chromium 系浏览器（Chrome / Edge 等）中可用。其他浏览器（如 Firefox、Safari 及部分 iframe 环境）不受支持，此时插件不会渲染按钮。

::: tip
部分浏览器要求 `EyeDropper` 必须在用户手势（如点击）中调用，且跨域 iframe 内可能被拒绝。
:::

## 许可证

MIT
