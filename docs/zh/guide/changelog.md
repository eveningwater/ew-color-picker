---
title: 更新日志
description: ew-color-picker 各版本的变更记录，含修复、新增与文档修正。
---

# 更新日志

## 2.0.8

### 修复

- 修复通过 `<link>` 引入静态 CSS 时箭头和关闭图标位置错乱的问题：图标样式之前只由 core 入口在运行时注入，SCSS 构建产物（`@ew-color-picker/style`）中缺失，导致箭头偏移。现在 SCSS 源文件中也包含了这些规则
- 箭头图标 `fill` 从硬编码的 `#666666` 改为 `currentColor`，图标可继承主题文字颜色
- 修复 `hasBox: false` 配合 `appendTo` 时空的 root 容器仍占用 `line-height` 高度的问题：`.ew-color-picker` 空壳现在通过 `:empty { display: none }` 隐藏，盒子渲染后自动恢复显示
- 修复 `hasBox: false` 时面板定位错误：定位锚点现在从 box 回退到用户传入的 `el` 容器（最后才回退到 root），不再以 0 尺寸的空壳为参照
- 修复 `showPanel`/`hidePanel` 非幂等问题：面板已打开时再次调用 `showPanel` 会重新执行打开动画，动画先将高度重置为 `0`，视觉上表现为面板关闭。现在两个方法在面板已处于目标状态时直接返回

### 文档

- 中英文 README 新增 npm 版本、下载量、许可证、构建状态、TypeScript、Stars 徽章
- 中英文 README 新增在线演示截图

## 2.0.7

### 修复

- 修复颜色选择器面板在 Element Plus Dialog 等弹层容器中被遮罩层遮挡的问题：面板 `z-index` 此前在样式表中固定为 `1000`，而弹层组件库从 `2000` 起步且每次打开递增。现在每次打开面板都会自动将内联层级提升为「祖先最大层级 + 1」，普通页面仍由样式表默认值控制，样式读写异常时静默降级

### 测试

- 新增弹层容器内自动提升层级、重复打开重新计算、普通页面不写内联样式的回归用例

## 2.0.6

### 修复

- 修复 `colorRgbaToHsva` 把合法的透明度 `0` 转成 `1` 的问题（`parseFloat(...) || 1` 把 `0` 当成了假值）；该问题会导致全透明颜色在拖动色相或饱和度/明度后变不透明，`getHsvaColor()` 也会返回 `a: 1`
- 修复 `colorRgbaToHsla` 返回的 `colorObj.h` 停留在内部 `0-6` 扇区值而非角度值的问题，避免 `colorHslaToRgba` 往返转换错色（如绿色 `rgba(0, 202, 136, 1)` 被还原成 `rgba(204, 10, 0, 1)`）

### 测试

- 新增回归测试：`rgba(..., 0)` 往返转换、透明度无法解析时的回退、HSL 色相与往返转换

### 发布

- 新增 GitHub Actions CI：在推送和 PR 到 `master` 时执行依赖安装、全量测试与全量构建
- 为 `utils` 和 `core` 声明 `rimraf` 开发依赖，修复 pnpm 严格 `node_modules` 结构下清理脚本找不到命令的问题

## 2.0.5

### 修复

- 修复面板在抽屉、弹窗、滚动容器内的定位问题：新增 `boundary` 配置项，支持传入 CSS 选择器或 HTMLElement，面板会被限制在该容器的可视区域内，而非仅按视口夹取
- 修复 `destroy()` 后 `setTimeout` 回调仍绑定 `document.mousedown` 监听导致泄漏的问题：回调现在会先检查实例是否已销毁
- 修复根目录 `build:xxx` 快捷命令静默失败的问题（`pnpm -r build:xxx` 匹配不到任何子包脚本）；改为 `pnpm --filter <pkg> build`，并补齐 gradient、select、checkbox、copy-color、input-number 的快捷命令

### 优化

- 拖拽逻辑收口到 `utils/drag.ts`：新增 `getRatio`、`bindMouseDrag`、`bindTouchDrag` 工具函数，hue、alpha、panel、gradient 四包复用，消除约 10 处 `as EventListener` 强转
- 提取 `DEFAULT_PANEL_WIDTH` / `DEFAULT_PANEL_HEIGHT` 常量，替换 panel 和 gradient 中 7 处硬编码的 `285 / 180`
- 统一使用工具函数：`isString` / `isObject` / `isBoolean` / `isNumber` 替代原生 `typeof` 判断；`$` 和 `getRect` 替代直接调用 `querySelector` / `getBoundingClientRect`
- 去掉插件 options 初始化中的 `as any` 强转；`install(core: any)` 统一为 `install(core: ewColorPicker)`
- `getPrefix` 改用 `isString` 并明确接收 `ewColorPicker` 实例类型，替代 `any`
- 删除 utils 中未使用的 `eventType` 死代码
- 补充 `applyOrder` 排序规则的注释：未声明 `applyOrder` 的插件默认按 0 处理，先于所有 `Post` 插件执行

### 文档

- 新增 `boundary` 配置项的中英文文档及使用示例
- 新增示例页 `18-panel-boundary.html`，演示容器内面板定位
- 修复文档站英文版底部友情链接显示中文的问题
- 补齐 examples 导航中缺失的 15-18 号链接

### 发布

- 所有包添加 `prepublishOnly: "npm run build"`，确保每次发布前自动构建最新产物

## 2.0.4

### 新增

- 新增 `@ew-color-picker/select` 下拉选择组件与插件：支持自定义选项、占位符、尺寸、键盘操作、外部点击关闭与 ARIA 无障碍规范，可通过 `selectClearable` 开启清空图标，配置项含 `selectItems` / `selectValue` / `selectPlaceholder` / `onSelectChange` / `onSelectClear`，仅在 `selectItems` 非空时渲染
- 新增 `@ew-color-picker/gradient` 渐变插件：提供可拖拽色标的渐变编辑器，支持线性 / 径向 / 锥形、重复渐变、角度与位置、双位置色标，以及 `srgb` / `srgb-linear` / `hsl` / `oklab` / `oklch` 插值提示。CSS 字符串可通过 `parseGradient` / `serializeGradient` 稳定回环，默认仅在 `showGradient: true` 或提供 `gradient` / `gradientStops` 时渲染
- 新增 `@ew-color-picker/checkbox` 复选框组件与插件：用主题化方块替代原生复选框外观，底层保留原生 input 以维持语义与键盘操作。插件在提供 `checkboxLabel` 时渲染到面板底部行，支持 `showCheckbox` / `checkboxChecked` / `checkboxDisabled` / `onCheckboxChange`
- 聚合包新增 `createEwColorPicker(options)` 工厂函数导出，兼容入口包 `ew-color-picker` 同步支持该导出

### 修复

- 修复 `defaultColor` 的判断逻辑：此时实例插件尚未创建，改为按静态插件注册表判断 alpha 插件是否已注册；未启用 alpha 时，rgba 格式的默认值正确降级为 hex
- 修复无初始颜色或延迟设置颜色时打开面板，色相柱背景、面板光标与色相 / 透明度滑块位置不正确的问题：面板显示后会按当前颜色重新同步定位
- 修复色相柱与透明度柱在不同方向组合下面板宽度计算不准确，导致同排元素换行、左右边缘无法对齐的问题
- 修复 `colorRgbaToHsva` 只接受 rgba 字符串的问题，现在兼容 hex / rgb / 颜色关键字等输入
- 修复渐变编辑器停靠点行的布局问题：数字输入框数值被裁剪、删除 / 新增按钮被挤到下一行；输入框加宽并压缩步进按钮宽度与行间距后，单行内完整展示

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
