---
title: 在线 Playground
description: 在浏览器里直接修改并运行 ew-color-picker 的全部示例。
---

# 在线 Playground

内置 24 个示例，覆盖基础用法、布局与朝向、事件、面板定位、插件以及 Input / Button / Select / InputNumber / Tooltip 等独立组件。Playground 在独立窗口中运行，选择示例后可直接修改 HTML / CSS / JS，并在右侧查看预览。

<a class="playground-entry" href="../../playground.html" target="_blank" rel="noopener">打开在线 Playground ↗</a>

::: tip 说明
- Playground 是独立页面，会在新窗口打开，文档站只提供入口。
- 示例通过 unpkg 加载已发布的 UMD 产物，不需要本地安装依赖。
- 编辑器由 `ew-iframe-editor` 提供，默认使用 `ew-code-editor`。
- 示例代码同样可以在仓库的 `examples/` 目录中找到对应完整页面。
:::

## 示例覆盖范围

| 编号 | 示例 |
| --- | --- |
| 01 - 05 | 基础用法、尺寸与朝向、预定义颜色、按钮、事件与回调 |
| 06 - 10 | 面板方位、展开动画、禁用、颜色模式、实例 API |
| 11 - 15 | InputNumber、多实例、吸管、复制颜色、Select 下拉插件 |
| 16 - 20 | 渐变、Checkbox、面板边界、面板模式、Tooltip 独立使用 |
| 21 - 24 | Select / Input / Button 独立使用、UMD 全量引入 |

## 由 ew-iframe-editor 提供编辑能力

本页的在线编辑器基于 [ew-iframe-editor](https://eveningwater.github.io/ew-iframe-editor/) 实现。它通过适配器模式把在线代码编辑器嵌入任意页面，支持直接传入代码或通过 `requestUrl` 加载文件，默认适配 `ew-code-editor`，也可以自定义编辑器。

```bash
pnpm add ew-iframe-editor
```

```ts
import { createEditor } from 'ew-iframe-editor'

const { iframe, destroy } = createEditor({
  container: '#editor',
  code: {
    html: '<div id="app"></div>',
    css: 'body { font-family: sans-serif; }',
    js: 'console.log("hello")',
  },
})
```

## 相关

- [在线演示](./demo.md)
- [示例索引](./index.md)
- [ew-iframe-editor 在线演示](https://eveningwater.github.io/ew-iframe-editor/)
