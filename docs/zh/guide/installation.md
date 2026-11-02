---
title: 安装
description: 通过 pnpm/npm/yarn、UMD 脚本或按需子包安装 ew-color-picker，开发环境需要 Node 20.10+。
---

# 安装

## 环境要求

- Node.js ≥ 20.10（`dev:preview` 与文档站依赖该版本）
- 任意支持 ES Module 的构建工具（Vite / Webpack / Rspack / Rollup）

## 方式一：聚合包（推荐）

聚合包 `@ew-color-picker/ew-color-picker` 已注册全部内置插件，安装后即可获得完整功能。

```bash
pnpm add @ew-color-picker/ew-color-picker @ew-color-picker/style
# 或
npm install @ew-color-picker/ew-color-picker @ew-color-picker/style
# 或
yarn add @ew-color-picker/ew-color-picker @ew-color-picker/style
```

引入样式：

```ts
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'
```

> `index.css` 是核心样式，`input-number.css` 是数字输入框组件的独立样式入口，**两者都需要引入**，否则 RGB / HSL 模式下的数字框会失去样式。

如果希望沿用 v1 的包名，也可以直接安装无 scope 的聚合入口包，二者等价：

```bash
npm install ew-color-picker
```

::: tip 关于包名
`ew-color-picker` 是 v2 提供的兼容入口包，只做转发，内部依赖 `@ew-color-picker/ew-color-picker` 与 `@ew-color-picker/style`。适合从 v1 升级，或希望安装命令更简短的用户。
:::

## 从 v1 升级到 v2

v2 是破坏性重构，v1 与 v2 的 API 不能混用：

- **架构**：v1 是配置式单包；v2 拆分为 13 个包 + 1 个兼容入口，界面全部由插件组装，可通过 `Core.use(Plugin)` 自由组合与替换
- **包名**：`ew-color-picker` 仍是入口，但内部指向 `@ew-color-picker/ew-color-picker`
- **样式**：需要显式引入 `index.css` 与 `input-number.css` 两个文件
- **配置与事件**：插件相关配置项（如 `hasAlpha`、`hasBox`）与 v1 有差异，请按本站在线演示重新接入

需要继续使用旧版可以锁定 `ew-color-picker@1`；v1 源码保留在仓库的 `v1` 分支。

## 方式二：按需安装子包

仅需要部分功能时，可以只安装对应子包。Core 与 Utils 是所有插件的基础依赖，必须显式安装。

```bash
pnpm add @ew-color-picker/core @ew-color-picker/utils @ew-color-picker/style
pnpm add @ew-color-picker/box @ew-color-picker/panel
```

| 子包 | 说明 |
| --- | --- |
| `@ew-color-picker/core` | 核心（必需） |
| `@ew-color-picker/utils` | 工具（必需） |
| `@ew-color-picker/box` | 颜色盒触发器 |
| `@ew-color-picker/panel` | 颜色面板（取色必需） |
| `@ew-color-picker/hue` | 色相滑块 |
| `@ew-color-picker/alpha` | 透明度滑块 |
| `@ew-color-picker/input` | 文本输入框 |
| `@ew-color-picker/input-number` | 数字输入框组件 |
| `@ew-color-picker/button` | 清空 / 确定按钮 |
| `@ew-color-picker/predefine` | 预定义色板 |
| `@ew-color-picker/color-mode` | 颜色模式切换 |

手动注册插件：

```ts
import ewColorPicker from '@ew-color-picker/core'
import ewColorPickerBoxPlugin from '@ew-color-picker/box'
import ewColorPickerPanelPlugin from '@ew-color-picker/panel'
import ewColorPickerHuePlugin from '@ew-color-picker/hue'

// 注册顺序不影响渲染结果，实际执行顺序由 applyOrder 决定
ewColorPicker.use(ewColorPickerBoxPlugin)
ewColorPicker.use(ewColorPickerPanelPlugin)
ewColorPicker.use(ewColorPickerHuePlugin)

new ewColorPicker({ el: '#picker' })
```

## 方式三：UMD / 浏览器直连

适合无构建工具的传统页面。构建产物位于各包的 `dist` 目录：

```html
<link rel="stylesheet" href="node_modules/@ew-color-picker/style/dist/index.css" />
<link rel="stylesheet" href="node_modules/@ew-color-picker/style/dist/input-number.css" />

<script src="node_modules/@ew-color-picker/ew-color-picker/dist/index.min.js"></script>
<script>
  new ewColorPicker({ el: '#picker' })
</script>
```

## TypeScript

所有子包均输出声明文件，无需额外安装 `@types/*`。插件会通过 `declare module '@ew-color-picker/core'` 扩展 `ewColorPickerOptions`，因此插件配置项在实例化时就能获得补全。

## 开发仓库自身

```bash
pnpm install          # 安装依赖
pnpm run build:all    # 构建全部 14 个包
pnpm run test         # 运行测试
pnpm run dev:preview  # 启动 examples 预览（Vite）
```

文档站单独位于 `docs/`，构建前需要先生成包产物（在线演示会复用 UMD 产物）：

```bash
pnpm run build:docs   # 构建包 + 构建文档站到 gh-pages/
cd docs && npm run dev # 本地开发文档（需先 build:all）
```
