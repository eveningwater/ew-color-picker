---
title: 插件总览
description: ew-color-picker 的插件体系：11 个内置插件的职责、注册顺序与包名，以及插件之间如何协作完成颜色选择。
---

# 插件总览

ew-color-picker 的核心（`@ew-color-picker/core`）只负责三件事：维护颜色状态、派发事件、管理挂载点。**所有可见的 UI 都由插件渲染**，因此你可以按需组合出完全不同的选择器形态。

## 插件是怎么工作的

每个插件都是一个普通类，核心只要求：

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| `static pluginName` | `string` | 唯一名称，也是核心 `plugins` 对象的键 |
| `static applyOrder` | `ApplyOrder` | 执行顺序，`Pre = -1` 先于核心默认逻辑，`Post = 1` 后于核心默认逻辑 |
| `constructor(core)` | — | 接收核心实例，自行渲染到挂载点并订阅事件 |
| `destroy()` | 可选 | 卸载时释放 DOM 与事件 |

```ts
import ewColorPicker from '@ew-color-picker/core'
import MyPlugin from './my-plugin'

ewColorPicker.use(MyPlugin)
new ewColorPicker({ el: '#app' })
```

`use()` 是幂等的：同一个构造函数重复注册不会产生第二个实例。插件实例可以通过 `core.plugins[pluginName]` 访问。

## 内置插件一览

聚合包 `@ew-color-picker/ew-color-picker` 的注册顺序如下（顺序决定默认的 DOM 排布）：

| # | 插件 | `pluginName` | 包 | 职责 |
| --- | --- | --- | --- | --- |
| 1 | Console | `ewColorPickerConsole` | `@ew-color-picker/utils` | 控制台输出版本信息，全页仅一次 |
| 2 | Box | `ewColorPickerBox` | `@ew-color-picker/box` | 触发器色块：显示当前色、打开/关闭面板 |
| 3 | Panel | `ewColorPickerPanel` | `@ew-color-picker/panel` | 饱和度/明度选择面板 |
| 4 | Hue | `ewColorPickerHue` | `@ew-color-picker/hue` | 色相滑块 |
| 5 | Alpha | `ewColorPickerAlpha` | `@ew-color-picker/alpha` | 透明度滑块 |
| 6 | Input | `ewColorPickerInput` | `@ew-color-picker/input` | 文本颜色输入框 |
| 7 | InputNumber | `ewColorPickerInputNumber` | `@ew-color-picker/input-number` | RGB/HSL 数值输入组（底层组件） |
| 8 | Button | `ewColorPickerButton` | `@ew-color-picker/button` | 清空 / 确定按钮 |
| 9 | Predefine | `ewColorPickerPredefine` | `@ew-color-picker/predefine` | 预定义颜色色块 |
| 10 | ColorMode | `ewColorPickerColorMode` | `@ew-color-picker/color-mode` | Hex / RGB / HSL 模式切换 |
| 11 | — | — | `@ew-color-picker/style` | 样式产物（CSS，不是插件） |

## 挂载点

核心在挂载时创建两个容器，插件只能往这两个节点里渲染：

| 挂载点 | 获取方式 | 说明 |
| --- | --- | --- |
| `root` | `core.getMountPoint('root')` | 外层容器 `.ew-color-picker`，触发器（Box）放这里 |
| `panelContainer` | `core.getMountPoint('panelContainer')` | 面板容器 `.ew-color-picker-panel-container`，默认带 `-hidden` 类 |

面板收起时给 `panelContainer` 加 `ew-color-picker-panel-container-hidden`，展开时移除，配合 `togglePickerAnimation` 产生动画。

## 插件之间如何协作

```text
用户操作 (Box / Panel / Hue / Alpha / Input / Predefine / Button)
        │
        ▼
   core.setColor(color)  ← 唯一的改色入口
        │
        ├─► emit('change', color)
        │        ├─ Panel   同步背景色与光标
        │        ├─ Hue     同步滑块位置
        │        ├─ Alpha   同步滑块位置
        │        ├─ Input   同步输入框文本
        │        ├─ ColorMode 同步 RGB/HSL 输入框
        │        └─ Box     同步色块背景与图标颜色
        │
        └─► 调用 options.changeColor(color)
```

几条硬约束：

- **只有 `core.setColor()` 能改色**，插件之间不直接互调。
- 插件通过 `core.on('change')` 监听颜色变化，不要轮询 `core.currentColor`。
- 插件之间通过 `core.plugins.xxx` 读取状态，例如 ColorMode 会判断 `core.plugins.ewColorPickerAlpha` 是否存在来决定默认模式。
- 需要刷新配置时调用 `core.updateOptions(options)`，核心会广播 `options-update`。

## 按需组合

只要引用了聚合包，11 个插件就都已注册。你可以用配置项裁剪 UI，而不必卸载插件：

```ts
new ewColorPicker({
  el: '#app',
  hasPanel: false,     // 不要饱和度面板
  hue: false,          // 不要色相滑块
  alpha: false,        // 不要透明度滑块
  hasInput: false,     // 不要输入框
  hasClear: false,     // 不要清空按钮
  hasSure: false,      // 不要确定按钮
  showColorMode: false,// 不要模式切换
  size: 'large',
})
```

::: tip 想要更小的体积？
按需手动注册插件即可，见[安装](../guide/installation.md#按需引入子包)。
:::

## 下一步

- [Box 颜色盒](./box.md)
- [Panel 颜色面板](./panel.md)
- [Hue 色相滑块](./hue.md)
- [Alpha 透明度滑块](./alpha.md)
- [Input 输入框](./input.md)
- [InputNumber 数字输入框](./input-number.md)
- [Button 按钮](./button.md)
- [Predefine 预定义颜色](./predefine.md)
- [ColorMode 颜色模式](./color-mode.md)
- [Console 控制台](./console.md)
- [编写自定义插件](../guide/plugin-dev.md)
