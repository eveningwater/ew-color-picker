---
title: 实例方法
description: ewColorPicker 实例方法完整参考：挂载、改色、开合面板、更新配置、事件与销毁。
---

# 实例方法

所有方法都通过 `new ewColorPicker(...)` 返回的实例调用。实例销毁后，大部分方法会安全地直接返回，不会抛错。

```ts
const picker = new ewColorPicker({ el: '#picker' })
```

## 构造函数

```ts
new ewColorPicker('#picker')
new ewColorPicker(domElement)
new ewColorPicker({ el: '#picker', ...options })
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `string \| HTMLElement \| ewColorPickerOptions` | 容器或完整配置对象 |
| `pluginOptions` | `Record<string, any>`（可选） | 内部使用的插件配置合并参数 |

构造函数会依次完成：合并默认配置 → 解析容器 → 创建 `root` / `panelContainer` → 按 `applyOrder` 实例化已注册插件 → 绑定外部点击（`isClickOutside`）。

---

## static use

注册插件构造函数。**必须在实例化之前调用**。

```ts
ewColorPicker.use(PluginCtor)
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `plugin` | `ewColorPickerPluginCtor` | 带 `static pluginName` 的插件类 |
| 返回 | `typeof ewColorPicker` | 支持链式调用 |

```ts
import BoxPlugin from '@ew-color-picker/box'
import PanelPlugin from '@ew-color-picker/panel'

ewColorPicker.use(BoxPlugin).use(PanelPlugin)
```

---

## mount

将实例重新挂载到指定容器。

```ts
picker.mount(el?: string | HTMLElement): ewColorPicker
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `el` | `string \| HTMLElement`（可选） | 新容器；省略时使用 `options.el`，再回退到 `document.body` |

- 会更新 `options.el`，重新创建挂载点并重新执行全部已注册插件的 `run()`；
- 已销毁的实例会直接返回自身；
- 通常无需手动调用，构造时已自动完成挂载。

---

## getMountPoint

获取插件渲染所用的挂载点。

```ts
picker.getMountPoint(name: 'root' | 'panelContainer'): HTMLElement | undefined
```

| 挂载点 | 说明 |
| --- | --- |
| `root` | `.ew-color-picker` 外层容器 |
| `panelContainer` | `.ew-color-picker-panel-container` 面板容器 |

实例销毁后返回 `undefined`。

---

## getContainer

获取当前挂载容器（即 `options.el`）。

```ts
picker.getContainer(): HTMLElement
```

---

## showPanel / hidePanel

展开或收起面板。

```ts
picker.showPanel(animationType?: string, duration?: number): void
picker.hidePanel(animationType?: string, duration?: number): void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `animationType` | `'default' \| 'height' \| 'opacity'`（可选） | 覆盖配置中的 `togglePickerAnimation` |
| `duration` | `number`（可选） | 覆盖 `pickerAnimationTime`，单位毫秒 |

行为说明：

- 面板打开且 `currentColor` 为空时，会用 `defaultColor`（未配置则 `#ff0000`）初始化颜色，但不会写入输入框；
- 打开后触发 `toggle(true)` 与 `togglePicker(true)` 回调，并调用 `syncAllPlugins()`；
- 关闭后触发 `toggle(false)` 与 `togglePicker(false)`。

```ts
picker.showPanel('height', 240)
picker.hidePanel()
```

---

## openPicker / closePicker

`showPanel()` / `hidePanel()` 的语义化别名，无参数。

```ts
picker.openPicker()
picker.closePicker()
```

---

## setColor

修改颜色的**唯一入口**。

```ts
picker.setColor(color: string): void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `color` | `string` | 任意合法 CSS 颜色（Hex / RGB / RGBA / HSL / HSLA / 关键字） |

执行流程：

1. 写入 `currentColor`；
2. 将颜色转换为 RGBA 再转换为 HSVA，写入 `hsvaColor`（转换失败时使用 `{ h: 0, s: 100, v: 100, a: 1 }`）；
3. `trigger('change', color)`；
4. 调用 `options.changeColor(color)`。

```ts
picker.setColor('#ff0000')
picker.setColor('rgba(0, 0, 0, 0.5)')
```

::: tip
插件内部修改颜色也必须调用该方法，不要直接改写 DOM，否则其他插件不会同步。
:::

---

## getColor

获取当前颜色字符串。

```ts
picker.getColor(): string
```

未设置颜色时返回 `''`。

---

## getHsvaColor / setHsvaColor

读取或写入 HSVA 状态。

```ts
picker.getHsvaColor(): HsvaColor
picker.setHsvaColor(hsva: HsvaColor): void
```

```ts
interface HsvaColor {
  h: number // 0 ~ 360
  s: number // 0 ~ 100
  v: number // 0 ~ 100
  a: number // 0 ~ 1
}
```

`getHsvaColor` 返回浅拷贝，修改返回值不会影响实例。`setHsvaColor` 只更新内部状态，**不会触发 `change` 事件**；如需同步 UI 请改用 `setColor()`。

---

## getOptions

获取当前完整配置（包括合并后的默认值）。

```ts
picker.getOptions(): ewColorPickerMergeOptionsData
```

返回的是实例内部配置对象的引用，不建议直接修改，请使用 `updateOptions()`。

---

## updateOptions

运行时更新配置。

```ts
picker.updateOptions(newOptions: Record<string, any>): void
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `newOptions` | `Record<string, any>` | 需要覆盖的配置片段 |

行为说明：

- 与现有配置浅合并；
- 若包含 `defaultColor`，会校验颜色：合法则立即 `setColor`，非法则保持当前颜色并输出警告；
- 依次调用全部插件的 `run()` 重新渲染；
- 触发 `options-update` 事件。

```ts
picker.updateOptions({
  disabled: true,
  defaultColor: '#22c55e',
  size: 'small',
})
```

---

## syncAllPlugins

手动同步所有插件到指定颜色。内部只会调用实现了 `syncColor` 方法的插件。

```ts
picker.syncAllPlugins(color: string): void
```

`setColor` 已通过 `change` 事件驱动同步；该方法主要用于插件内部在特殊场景下强制刷新（如 ColorMode 更新输入框后）。

---

## destroy

销毁实例。

```ts
picker.destroy(): void
```

执行内容：

1. 标记 `isDestroyed = true`；
2. 解绑 `document` 上的外部点击监听；
3. 依次调用每个插件的 `destroy()`；
4. 移除全部挂载点与包装容器；
5. 清空 `plugins` 引用；
6. 触发 `destroy` 事件。

重复调用无副作用。

---

## getDestroyedStatus

判断实例是否已销毁。

```ts
picker.getDestroyedStatus(): boolean
```

---

## on / once / off

事件订阅与解绑，基于实例级 `EventEmitter`。

```ts
picker.on(type: string, fn: Function, context?: object): ewColorPicker
picker.once(type: string, fn: Function, context?: object): ewColorPicker
picker.off(type?: string, fn?: Function): ewColorPicker | undefined
```

| 参数 | 说明 |
| --- | --- |
| `type` | 事件名，必须是白名单事件 |
| `fn` | 回调函数 |
| `context` | 回调执行上下文，默认实例本身 |

- `on` / `once` 会校验事件名，未知事件会输出警告；
- `once` 回调执行后自动解绑；
- `off(type)` 清空该事件全部监听；`off(type, fn)` 只移除指定函数；`off()` 清空全部监听；
- 回调返回 `true` 会中断后续监听器的执行（`trigger` 的内部行为）。

```ts
const handler = (color: string) => console.log(color)
picker.on('change', handler)
picker.off('change', handler)
```

详见 [事件](./events)。

---

## trigger / emit

手动派发事件。

```ts
picker.trigger(type: string, ...args: any[]): void
picker.emit(type: string, ...args: any[]): void
```

- `trigger` 仅通知监听器；
- `emit` 在通知监听器之后，还会按事件类型调用对应配置回调：`clear → options.clear()`、`sure → options.sure()`、`toggle → options.togglePicker(...args)`。

日常使用中，插件会自行触发对应事件；仅在自定义插件或测试中才需要手动调用。

---

## 实例 use

在运行期安装一个**插件实例**（区别于静态 `use`）。

```ts
picker.use(plugin: ewColorPickerPlugin): ewColorPicker
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `plugin` | `{ install(core): void }` | 实现 `install` 方法的插件对象 |

```ts
const badge = {
  install(core: ewColorPicker) {
    console.log('installed on', core)
  },
}
picker.use(badge)
```

---

## 实例属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `options` | `ewColorPickerMergeOptionsData` | 合并后的完整配置 |
| `plugins` | `Record<string, plugin>` | 已实例化的插件，按 `pluginName` 索引 |
| `wrapper` | `HTMLElement & { isEwColorPickerContainer?: boolean }` | `.ew-color-picker` 包装容器 |
| `currentColor` | `string` | 当前颜色字符串 |
| `hsvaColor` | `HsvaColor` | 当前 HSVA 状态 |

```ts
picker.plugins.ewColorPickerButton.enableClear(false)
console.log(picker.wrapper)
```

## 相关链接

- [配置项](./options)
- [事件](./events)
- [回调](./callbacks)
