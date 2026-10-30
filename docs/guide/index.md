---
title: 项目介绍
description: ew-color-picker 是事件驱动、插件化的颜色选择器。了解核心职责、14 个包的划分与数据流。
---

# 项目介绍

ew-color-picker 是一个基于 **事件驱动 + 插件系统** 的颜色选择器。核心包只做三件事：

1. 维护当前颜色（`currentColor`）与 HSVA 状态（`hsvaColor`）；
2. 通过实例级 `EventEmitter` 派发事件；
3. 为插件提供 `root` 与 `panelContainer` 两个挂载点。

其余所有界面元素（颜色盒、面板、色相/透明度滑块、输入框、按钮、预定义色板、颜色模式切换器）都以插件形式注册，因此可以按需组合、自由扩展。

## 设计理念

| 原则 | 说明 |
| --- | --- |
| 单一数据源 | 任何插件修改颜色都只调用 `core.setColor()`，再由 `change` 事件驱动其他插件同步，不存在多份颜色状态。 |
| 插件自治 | 插件自己负责渲染、事件绑定与销毁，核心不感知具体 UI。 |
| 可裁剪 | 不需要按钮就不注册 Button 插件；不需要透明度就不注册 Alpha 插件。 |
| 类型完备 | 每个包都输出 `.d.ts`，插件通过 `declare module` 扩展配置类型。 |

## 包结构

| 包 | 职责 |
| --- | --- |
| `@ew-color-picker/core` | 颜色状态、事件总线、插件注册与挂载点 |
| `@ew-color-picker/utils` | DOM / 颜色 / 动画 / 事件 / 图标等基础工具 |
| `@ew-color-picker/style` | 全部样式（`index.css`、`input-number.css` 等） |
| `@ew-color-picker/ew-color-picker` | 聚合包，注册全部内置插件，开箱即用 |
| `ew-color-picker` | 兼容 v1 的无 scope 入口，转发聚合包与样式 |
| `@ew-color-picker/box` | 触发面板的颜色盒 |
| `@ew-color-picker/panel` | 饱和度/明度面板（核心必需插件） |
| `@ew-color-picker/hue` | 色相滑块 |
| `@ew-color-picker/alpha` | 透明度滑块 |
| `@ew-color-picker/input` | 文本输入框 |
| `@ew-color-picker/input-number` | 数字输入框组件 |
| `@ew-color-picker/button` | 清空 / 确定按钮 |
| `@ew-color-picker/predefine` | 预定义颜色色板 |
| `@ew-color-picker/color-mode` | Hex / RGB / HSL 模式切换 |
| `@ew-color-picker/console` | 控制台版本横幅（已并入 utils） |

## 数据流

```text
用户操作（面板拖动 / 输入框 / 色板 / 滑块）
        │
        ▼
   core.setColor(color)
        │  trigger('change', color)
        ▼
 ┌───────────────┬───────────────┬───────────────┐
 │ Box 更新背景   │ Panel 更新光标 │ Input 更新值   │  …其他插件
 └───────────────┴───────────────┴───────────────┘
```

`setColor` 同时会更新 `hsvaColor` 并调用 `options.changeColor` 回调。插件**不应该**直接修改其他插件的 DOM，而是订阅 `change` 事件自行同步。

## 下一步

- [安装](./installation) — 选择聚合包或按需安装子包
- [快速开始](./getting-started) — 完成第一个可交互示例
- [核心概念](./concepts) — 理解挂载点、插件顺序与事件
