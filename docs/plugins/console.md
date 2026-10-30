---
title: Console 控制台插件
description: Console 插件在浏览器控制台输出版本与作者信息，全页面仅打印一次，可关闭。
---

# Console 控制台

`ewColorPickerConsole` 会在控制台打印一条带样式的版本横幅（版本号、QQ、微信、GitHub）。它不影响任何 UI。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/utils`（从 utils 导出 `Console`） |
| `pluginName` | `ewColorPickerConsole` |
| `applyOrder` | 未显式声明（聚合包中最先注册） |
| 挂载点 | 无（只输出日志） |
| 访问实例 | `core.plugins.ewColorPickerConsole` |

## 全页仅一次

插件内部用一个模块级布尔标记：

```ts
let hasPrintedTips = false

run() {
  if (hasPrintedTips) return
  hasPrintedTips = true
  log(...tips)
}
```

因此无论页面上创建多少个选择器实例，横幅都只出现一次。

## 关闭方式

Console 没有独立配置项（类型为 `{}`）。最简单的做法是**单独按需注册插件时不要注册它**：

```ts
import ewColorPicker from '@ew-color-picker/core'
import Box from '@ew-color-picker/box'
import Panel from '@ew-color-picker/panel'
// …

// 不引入 Console，就不会打印横幅
ewColorPicker.use(Box).use(Panel)
```

如果使用聚合包 `@ew-color-picker/ewColorPicker`，Console 已经注册，无法通过 options 关闭。

## 输出内容

```text
 ew-color-picker@2.0.0  联系QQ：854806732  联系微信：eveningwater  github:https://github.com/eveningwater/ew-color-picker
```

样式通过 `%c` 注入，不影响页面。

## 实例方法

| 方法 | 说明 |
| --- | --- |
| `handleOptions` | 合并核心配置（当前无实际用途） |
| `run` | 输出横幅（受一次性标记保护） |
| `install` | 兼容手动 `install(core)` 调用 |

## 相关

- [插件总览](./index.md)
- [编写自定义插件](../guide/plugin-dev.md)
