---
title: 编写自定义插件
description: 按 pluginName、applyOrder、构造函数、挂载点与事件的约定编写可注册、可销毁的自定义插件。
---

# 编写自定义插件

插件是普通的类，核心只要求两个静态属性与一个构造函数。

## 最小模板

```ts
import type ewColorPicker from '@ew-color-picker/core'
import { ApplyOrder, create, addClass, insertNode, isFunction } from '@ew-color-picker/utils'

export default class MyBadgePlugin {
  static pluginName = 'myBadge'
  static applyOrder = ApplyOrder.Post

  el: HTMLElement | null = null

  constructor(public ewColorPicker: ewColorPicker) {
    this.run()

    // 订阅颜色变化，保持 UI 与核心同步
    if (isFunction(this.ewColorPicker.on)) {
      this.ewColorPicker.on('change', this.handleChange)
    }
  }

  run() {
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer')
    if (!panelContainer) return

    this.el = create('span')
    addClass(this.el, 'my-badge')
    insertNode(panelContainer, this.el)
    this.renderColor(this.ewColorPicker.getColor())
  }

  handleChange = (color: string) => {
    this.renderColor(color)
  }

  renderColor(color?: string) {
    if (this.el) this.el.textContent = color || '未选择'
  }

  destroy() {
    if (isFunction(this.ewColorPicker.off)) {
      this.ewColorPicker.off('change', this.handleChange)
    }
    this.el?.parentNode?.removeChild(this.el)
    this.el = null
  }
}
```

注册：

```ts
import ewColorPicker from '@ew-color-picker/core'
import MyBadgePlugin from './my-badge'

ewColorPicker.use(MyBadgePlugin)
new ewColorPicker({ el: '#picker' })
```

## 约定与注意事项

| 约定 | 说明 |
| --- | --- |
| `static pluginName` | 必填，作为 `picker.plugins[pluginName]` 的键，需全局唯一 |
| `static applyOrder` | `ApplyOrder.Pre`（先渲染）/ `ApplyOrder.Post`（后渲染），默认按注册顺序 |
| 构造函数 | 接收 core 实例；此时挂载点已创建，可以直接渲染 |
| `destroy()` | 必须解绑事件、移除 DOM，避免内存泄漏 |
| 挂载点 | 优先使用 `getMountPoint('root' \| 'panelContainer')`，禁止 `document.querySelector` |
| 改色 | 只调用 `this.ewColorPicker.setColor(color)`，不要直写其他插件 DOM |
| 延迟渲染 | 依赖真实尺寸的计算可放在 `setTimeout(..., 0)` 中执行 |

## 类型扩展

如果插件有自己的配置项，通过模块扩充让构造函数获得提示：

```ts
declare module '@ew-color-picker/core' {
  interface CustomOptions {
    myBadge?: {
      text?: string
    }
  }
}
```

之后可以这样使用：

```ts
new ewColorPicker({
  el: '#picker',
  myBadge: { text: '当前颜色' },
})
```

## 兼容 `install(core)` 写法

部分插件还实现了 `install(core)` 方法，用于测试或手动安装场景：

```ts
install(core: ewColorPicker) {
  this.ewColorPicker = core
  this.run?.()
}
```

若同时支持 `install` 与构造函数，注意不要在两条路径上重复绑定事件。

## 生命周期小结

```text
new Plugin(core)
  ├─ 读取 core.options
  ├─ 从挂载点渲染 DOM
  ├─ 绑定 DOM 事件
  └─ 订阅 change / toggle / …
        │
core.destroy()
  └─ 调用 plugin.destroy()
       ├─ off(...)
       ├─ 移除 DOM
       └─ 置空引用
```
