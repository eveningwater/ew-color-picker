---
title: 更新日志
description: ew-color-picker 各版本的变更记录，含修复、新增与文档修正。
---

# 更新日志

## 2.0.1

> 本版本改动已合入主线并同步到文档站，npm 包暂未发布，后续会随更多修复统一发布。

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

### 文档

- 修正预定义色板、数字输入框的类名，与源码保持一致
- 移除不存在的 `ewColorPickerBox` 嵌套配置写法，统一为顶层选项
- 修正 `autoPanelPosition` 的生效前提说明
- 新增 `appendTo` 选项说明（中英文）
- 新增 `prefix` 选项说明（中英文），含 SCSS 自定义编译示例

## 2.0.0

首个正式发布版本：核心 + 插件架构、14 个包（13 个 scoped 包 + 无 scope 兼容入口包 `ew-color-picker`）、双语文档站与在线演示。
