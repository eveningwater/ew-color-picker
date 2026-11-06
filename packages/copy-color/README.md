# @ew-color-picker/copy-color

ew-color-picker 的复制颜色插件，一键把当前颜色写入系统剪贴板。

## 功能特性

- 圆形按钮底色跟随当前颜色，图标颜色按对比度自动切换
- 优先使用异步剪贴板 API，失败时降级到 `document.execCommand('copy')`
- 复制成功后弹出内置提示气泡，并提供回调
- 支持隐藏按钮、自定义提示文案

## 安装

```bash
npm install @ew-color-picker/copy-color
```

## 使用

```javascript
import ewColorPicker from '@ew-color-picker/core';
import CopyColor from '@ew-color-picker/copy-color';

// 注册插件
ewColorPicker.use(CopyColor);

// 创建颜色选择器
const colorPicker = new ewColorPicker({
  el: '#color-picker',
  showCopyColor: true,
  copyColorText: '复制颜色到剪贴板',
  copiedText: '已复制',
  onCopyColor: (color) => {
    console.log('已复制颜色:', color);
  },
});
```

## API

### 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| showCopyColor | boolean | true | 是否显示复制颜色按钮 |
| copyColorText | string | '复制颜色到剪贴板' | 按钮的 `title` / `aria-label` |
| copiedText | string | '已复制' | 复制成功后临时显示的提示文案 |
| onCopyColor | (color: string) => void | - | 复制成功回调，参数为复制的颜色值 |

### 剪贴板支持

插件优先调用 `navigator.clipboard.writeText()`；在不支持剪贴板 API 或调用被拒绝的环境下，会创建一个临时 `textarea` 并使用 `document.execCommand('copy')` 作为降级方案。

::: tip
异步剪贴板 API 通常要求页面处于安全上下文（https 或 localhost）。两种方式都失败时，控制台会输出警告。
:::

## 许可证

MIT
