---
title: 更新日志
description: ew-color-picker 各版本的变更记录，含修复、新增与文档修正。
---

# 更新日志

## 2.0.3

> 本版本已发布到 npm，文档站已同步更新。

### 新增

- 新增 `@ew-color-picker/eyedropper` 吸管插件：基于浏览器原生 EyeDropper API 从屏幕任意位置取色，自动检测能力，通过 `core.setColor()` 写回结果，支持 `showEyedropper` / `eyedropperText` / `onEyedropperPick`，用户取消时静默忽略 `AbortError`
- 新增 `@ew-color-picker/copy-color` 复制颜色插件：一键复制当前颜色到剪贴板。按钮底色跟随当前颜色并按对比度自动切换图标颜色，优先使用异步剪贴板 API，失败时降级到 `execCommand`，复制成功后弹出内置提示气泡，支持 `showCopyColor` / `copyColorText` / `copiedText` / `onCopyColor`
- 吸管按钮与复制按钮改为放在颜色值输入框上方的独立工具栏行，不再与输入框、清空 / 确定按钮挤在同一行

### 修复

- 修复数字输入框步进按钮的上下箭头：补齐图标类名并将尺寸调整为 10px，图标现在完全居中，不再溢出被分割线裁剪
- 修复 RGB / HSL 分通道输入框首次点击上下箭头时颜色值被重置为 0 的问题：颜色变化时同步输入框内部值，加减从当前通道值开始计算

## 2.0.2

### 修复

- 发布产物中的内部依赖改为指向对应版本（`^2.0.2`），不再沿用旧的 `^2.0.0` 范围。避免 2.0.1 的插件解析到旧版 `@ew-color-picker/utils`，导致 `getPrefix` 不存在而启动报错

## 2.0.1

> 本版本已发布到 npm，并同步到文档站。

### 修复

- 修复插件开关失效：`ewColorPickerPanel: false`、`ewColorPickerColorMode: false`（或对象配置）被默认配置覆盖，实际不生效
- 面板容器补充 `box-sizing: content-box`，不再依赖宿主全局 `box-sizing` 重置
- 移除按视口宽度（`max-width: 768px`）写死面板、输入框、预设区尺寸的媒体查询，内部尺寸统一由 `--panel-width` / `--panel-height` 控制
- 预定义色板改为 flex 自动换行，移除硬编码的「每行 10 个」换行规则，修复色块数量与容器宽度不匹配时的错误换行
- `use()` 改为按 `pluginName` 去重，避免 HMR、重复 import 或多入口场景重复注册同一插件
- 插件构造异常改为通过 `console.warn` 输出插件名与错误信息，不再静默吞掉，便于自定义插件调试

### 新增

- `appendTo` 选项：把面板容器挂载到 `document.body` 或任意容器，避免被弹窗、抽屉、滚动容器的 `overflow` 裁剪。启用后面板改为相对视口定位，仍按 `panelPlacement` 计算并做边界翻转，滚动或窗口尺寸变化时自动重算
- `prefix` 选项：自定义全部 CSS 类名前缀（默认 `ew-`），方便嵌入其他库时避免样式冲突。SCSS 同步提供 `$prefix` 构建变量，需与 JS 选项保持一致
- `ApplyOrder` 由 `const enum` 改为普通枚举，可直接从 `@ew-color-picker/utils` 运行时导入，编写自定义插件时无需手写 `'pre'` / `'post'` 字符串

### 文档

- 修正预定义色板、数字输入框的类名，与源码保持一致
- 移除不存在的 `ewColorPickerBox` 嵌套配置写法，统一为顶层选项
- 修正 `autoPanelPosition` 的生效前提说明
- 新增 `appendTo` 选项说明（中英文）
- 新增 `prefix` 选项说明（中英文），含 SCSS 自定义编译示例
- 补充 `applyOrder` 执行顺序说明与用法示例（中英文）
- 文档站默认语言改为英文，中文文档迁移到 `/zh/` 路径，README 默认展示英文版

## 2.0.0

首个正式发布版本：核心 + 插件架构、14 个包（13 个 scoped 包 + 无 scope 兼容入口包 `ew-color-picker`）、双语文档站与在线演示。
