---
title: 在线演示
description: 在浏览器中直接体验 EW Color Picker：取色、开合面板、查看实时事件日志。
---

# 在线演示

下面的演示页面加载了真实的构建产物，包含一个完整的颜色选择器、当前颜色预览和事件日志。

<iframe
  class="demo-frame"
  src="../demo.html"
  title="EW Color Picker 在线演示"
  loading="lazy"
></iframe>

::: tip 演示资源从哪来？
`docs/scripts/prepare-demo.mjs` 会在 `dev` / `build` 前把以下产物复制到 `docs/public/assets/`：

- `packages/ew-color-picker/dist/index.min.js`
- `packages/style/dist/index.css`
- `packages/style/dist/input-number.css`

如果演示页空白，先执行根目录的 `pnpm run build:all`。
:::

## 演示页做了什么

| 区域 | 说明 |
| --- | --- |
| 左侧选择器 | `defaultColor: '#6366f1'`，开启预设色与模式切换 |
| 当前颜色卡片 | 监听 `change` 实时更新色值与色块 |
| 事件日志 | 监听 `change` / `toggle` / `sure` / `clear` / `mode-change` / `destroy` |

## 本地运行

```bash
# 1. 构建所有包与样式
pnpm run build:all

# 2. 启动文档站点
pnpm run docs:dev
```

## 相关

- [示例集](./index.md)
- [快速开始](../guide/getting-started.md)
