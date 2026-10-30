---
title: 样式与类名
description: 样式入口、CSS 变量、全部类名分组与主题定制方式。
---

# 样式与类名

## 样式入口

样式包 `@ew-color-picker/style` 提供两个独立入口：

```ts
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'
```

| 文件 | 内容 |
| --- | --- |
| `index.css` | 颜色盒、面板、滑块、输入框、按钮、色板、模式切换器 |
| `input-number.css` | 数字输入框组件 `.ew-input-number` 系列样式 |

::: warning
两个文件都需要引入。只引入 `index.css` 时，RGB / HSL 模式下的数字输入框会丢失样式。
:::

其它可用产物：`index.min.css`、`color.css`、`extend.css`、`variable.css`（以及对应 `.min.css`）。

## CSS 变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `--panel-width` | `285px` | 面板宽度（插件会根据滑块方向动态写入） |
| `--panel-height` | `180px` | 面板高度 |

```css
:root {
  --panel-width: 300px;
  --panel-height: 200px;
}
```

## 类名一览

### 容器

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker` | 实例最外层包装容器（`root` 挂载点） |
| `.ew-color-picker-panel-container` | 面板容器（`panelContainer` 挂载点） |
| `.ew-color-picker-box` | 颜色盒 |
| `.ew-color-picker-box-arrow-icon` | 有颜色时的默认箭头图标 |
| `.ew-color-picker-box-close-icon` | 无颜色时的默认关闭图标 |

### 面板

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-panel` | 颜色面板 |
| `.ew-color-picker-panel-dynamic-size` | 动态尺寸面板 |
| `.ew-color-picker-white-panel` | 白色渐变层 |
| `.ew-color-picker-black-panel` | 黑色渐变层 |
| `.ew-color-picker-panel-cursor` | 面板取色光标 |
| `.ew-color-picker-bottom-row` | 面板底部行容器 |

### 滑块

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-slider` | 滑块容器 |
| `.ew-color-picker-slider-bar` | 滑块轨道 |
| `.ew-color-picker-slider-thumb` | 滑块手柄 |
| `.ew-color-picker-is-horizontal` | 水平方向 |
| `.ew-color-picker-is-vertical` | 垂直方向 |
| `.ew-color-picker-alpha-slider-bg` | 透明度棋盘背景 |
| `.ew-color-picker-alpha-slider-wrapper` | 透明度滑块包装 |
| `.ew-color-picker-alpha-slider-thumb` | 透明度手柄 |

### 输入与按钮

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-input-container` | 输入区容器 |
| `.ew-color-picker-input` | 文本输入框 |
| `.ew-color-picker-input-label` | 输入框前缀标签 |
| `.ew-color-picker-rgb-r-input` / `-g-input` / `-b-input` / `-a-input` | RGB 分量输入 |
| `.ew-color-picker-hsl-h-input` / `-s-input` / `-l-input` / `-a-input` | HSL 分量输入 |
| `.ew-color-picker-drop-btn` | 通用下拉按钮 |
| `.ew-color-picker-clear-btn` | 清空按钮 |
| `.ew-color-picker-sure-btn` | 确定按钮 |
| `.ew-color-picker-mode-up-btn` / `-mode-down-btn` | 模式切换上下按钮 |

### 预定义色板

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-predefine` | 色板容器 |
| `.ew-color-picker-predefine-item` | 单个色块 |
| `.ew-color-picker-predefine-item-disabled` | 禁用色块 |
| `.ew-color-picker-predefine-item-active` | 当前选中色块 |

### 数字输入框

| 类名 | 说明 |
| --- | --- |
| `.ew-input-number` | 数字输入框根节点 |
| `.ew-input-number--default` / `--small` / `--large` | 尺寸修饰 |
| `.ew-input-number__decrease` / `__increase` | 减少 / 增加按钮 |
| `.ew-input-number__input` | 内部 input |

### 状态类

| 类名 | 说明 |
| --- | --- |
| `.is-readonly` | 颜色盒只读 |
| `.is-disabled` | 禁用态（按钮、输入框等） |

## 自定义主题示例

```css
/* 修改面板尺寸 */
#picker {
  --panel-width: 300px;
  --panel-height: 200px;
}

/* 自定义颜色盒圆角与边框 */
#picker .ew-color-picker-box {
  border-radius: 10px;
  border: 1px solid rgba(99, 102, 241, 0.45);
}

/* 自定义按钮 */
#picker .ew-color-picker-sure-btn {
  background: #6366f1;
  color: #fff;
  border-radius: 8px;
}

/* 自定义选中色块描边 */
#picker .ew-color-picker-predefine-item-active {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}
```

## 多实例隔离

所有类名都是全局的，但插件内部会通过挂载点限定查询范围。为不同实例追加自定义作用域是最稳妥的方式：

```ts
new ewColorPicker({ el: '#picker-a' })
new ewColorPicker({ el: '#picker-b' })
```

```css
#picker-a .ew-color-picker-box { border-radius: 6px; }
#picker-b .ew-color-picker-box { border-radius: 50%; }
```

::: tip
请勿通过 `document.querySelector('.ew-color-picker-box')` 操作实例 DOM，多实例下会命中第一个实例。请使用 `picker.wrapper` 或 `getMountPoint()` 限定范围。
:::

## 相关链接

- [配置项](./options)
- [插件总览](../plugins/)
