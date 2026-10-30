---
title: 核心概念
description: 理解实例级事件总线、挂载点、插件执行顺序、单一改色入口与实例隔离。
---

# 核心概念

## 实例级事件总线

每个 `ewColorPicker` 实例都拥有一套独立的 `EventEmitter`，事件不会在实例之间共享。核心把事件分为两类：

| 类别 | 事件 | 说明 |
| --- | --- | --- |
| 生命周期 | `destroy` | 实例销毁时触发 |
| 交互 | `change`、`toggle`、`sure`、`clear` | 颜色变化、面板开合、确定、清空 |
| 配置 | `options-update` | `updateOptions()` 执行后触发 |
| 插件 | `mode-change` | 颜色模式切换（由 ColorMode 插件派发） |

`on()` / `once()` / `off()` 会校验事件名是否在白名单内，未知事件会打印警告而不是静默吞掉，便于排查拼写错误。

## 插件注册与执行顺序

插件是一个**类**，必须提供静态属性：

```ts
class MyPlugin {
  static pluginName = 'myPlugin'        // 唯一名称，用于 plugins.myPlugin 访问
  static applyOrder = ApplyOrder.Post   // 'pre' | 'post'
  constructor(core) { /* 渲染与订阅 */ }
}
```

注册方式：

```ts
ewColorPicker.use(MyPlugin)   // 静态注册，必须在实例化之前
```

- `ApplyOrder.Pre` 的插件先执行，`Post` 后执行；同组内按注册顺序执行。
- 注册发生在**类级别**，`new ewColorPicker()` 时按排序结果依次实例化。
- 实例化完成后可通过 `picker.plugins.myPlugin` 访问插件实例。

> 插件只能在实例化前注册。运行期新增插件请使用 `picker.use(pluginInstance)`（见 [实例方法](../api/methods#use)）。

## 挂载点

核心只创建两个挂载点：

| 挂载点 | 元素 | 用途 |
| --- | --- | --- |
| `root` | `.ew-color-picker` 外层容器 | 放置颜色盒、预定义色板等 |
| `panelContainer` | `.ew-color-picker-panel-container` 面板容器 | 放置面板、滑块、底部输入区、按钮 |

```ts
const root = picker.getMountPoint('root')
const panel = picker.getMountPoint('panelContainer')
```

插件渲染时**必须**从挂载点取容器，禁止直接查询 `document`，否则多实例会互相污染。

## 单一改色入口

```ts
picker.setColor(color)
```

内部流程：

1. 校验并归一化颜色；
2. 同步 `currentColor` 与 `hsvaColor`；
3. `trigger('change', color)` —— 所有 UI 插件据此刷新；
4. 调用 `options.changeColor(color)` 回调。

插件内部修改颜色（例如色相滑块拖动、色板点击）也必须走 `core.setColor()`，不要直接改写 DOM。

## 作用域隔离

多实例场景下，插件内部所有 DOM 查询都应限定在当前实例的挂载点内：

```ts
const panelContainer = this.ewColorPicker.getMountPoint('panelContainer')
const input = $('.ew-color-picker-input', panelContainer)
```

`@ew-color-picker/utils` 的 `$(selector, context)` 支持传入上下文，正是为此设计。

## 生命周期

```text
new ewColorPicker(options)
  ├─ 合并默认配置
  ├─ 渲染包装容器，创建 root / panelContainer
  ├─ 按 applyOrder 实例化插件
  └─ 绑定外部点击（isClickOutside）

picker.destroy()
  ├─ 解绑全局事件
  ├─ 依次调用插件的 destroy()
  ├─ 移除挂载点与容器
  └─ 清空 plugins 引用，isDestroyed = true
```

销毁后再调用任何方法都会安全返回（`getMountPoint` 返回 `undefined`，`mount` / `showPanel` 等直接返回实例）。
