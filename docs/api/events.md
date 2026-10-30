---
title: 事件
description: change、toggle、sure、clear、options-update、mode-change、destroy 七个事件的触发时机、参数与监听规则。
---

# 事件

实例基于 `EventEmitter` 提供事件订阅能力。所有事件都是**实例级**的，不会跨实例传播。

## 事件总览

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| `change` | `(color: string)` | `setColor()` 执行后（每次颜色变化） |
| `toggle` | `(isOpen: boolean)` | 面板展开 / 收起完成后 |
| `sure` | `(color: string, picker: ewColorPicker)` | 点击“确定”按钮 |
| `clear` | `()` | 点击“清空”按钮 |
| `options-update` | `(options)` | `updateOptions()` 执行后 |
| `mode-change` | `(mode: 'hex' \| 'rgb' \| 'hsl')` | 颜色模式切换后（ColorMode 插件派发） |
| `destroy` | `()` | 实例销毁时 |

> 事件名必须在上述白名单内。`on()` / `once()` / `off()` 对未知事件会输出警告，便于发现拼写错误。

## change

颜色变化事件，是最重要的事件。

```ts
picker.on('change', (color: string) => {
  console.log('当前颜色：', color)
})
```

- 由 `setColor()` 触发；
- 回调参数为写入的原始颜色字符串（可能与当前输入模式不同，例如 `rgba(...)`）；
- 与配置项 `changeColor` 同时存在：先触发事件，再调用回调。

```ts
const picker = new ewColorPicker({
  el: '#picker',
  changeColor(color) {
    document.body.style.background = color
  },
})

picker.on('change', (color) => {
  document.querySelector('#value')!.textContent = color
})
```

## toggle

面板开合事件。

```ts
picker.on('toggle', (isOpen: boolean) => {
  console.log(isOpen ? '面板已打开' : '面板已关闭')
})
```

- `showPanel()` 动画完成后触发 `toggle(true)`；
- `hidePanel()` 动画完成后触发 `toggle(false)`；
- 配置项 `togglePicker(isOpen)` 会在事件之后被调用。

## sure

确定按钮事件。

```ts
picker.on('sure', (color, instance) => {
  console.log('确认颜色：', color)
})
```

- 由 Button 插件在点击“确定”后触发；
- 回调参数：当前颜色、实例本身；
- Button 插件会**先**调用配置项 `sure(color, picker)`，**再**触发该事件，最后收起面板。

## clear

清空按钮事件。

```ts
picker.on('clear', () => {
  console.log('已清空')
})
```

- Button 插件先执行 `options.clear(picker)`，再触发 `clear` 事件；
- 点击清空后面板自动收起。

## options-update

配置更新事件。

```ts
picker.on('options-update', (options) => {
  console.log('配置已更新', options)
})
```

- 在 `updateOptions()` 完成配置合并、颜色同步与插件重新渲染后触发；
- 参数为更新后的完整配置对象。

## mode-change

颜色模式切换事件，由 ColorMode 插件派发。

```ts
picker.on('mode-change', (mode) => {
  console.log('切换到：', mode) // 'hex' | 'rgb' | 'hsl'
})
```

- 可通过 `picker.plugins.ewColorPickerColorMode.setMode(mode)` 主动切换；
- 配置项 `changeMode(mode, picker)` 与该事件都会在切换后执行。

## destroy

销毁事件。

```ts
picker.on('destroy', () => {
  console.log('实例已销毁')
})
```

- 在 `destroy()` 的末尾触发，此时 DOM 已被移除、插件引用已清空。

## 订阅技巧

### 只监听一次

```ts
picker.once('sure', (color) => {
  console.log('只会执行一次：', color)
})
```

### 解绑指定监听

```ts
const handler = (color: string) => console.log(color)
picker.on('change', handler)
picker.off('change', handler)
```

### 解绑全部监听

```ts
picker.off('change') // 清空 change 事件的所有监听
picker.off()         // 清空所有事件监听
```

### 中断后续监听

监听函数返回 `true` 时，`trigger` 会停止执行后续监听器：

```ts
picker.on('change', (color) => {
  if (someCondition) return true
})
```

## trigger 与 emit

```ts
picker.trigger('change', '#ff0000') // 只通知监听器
picker.emit('sure', '#ff0000', picker) // 通知监听器 + 调用 options.sure()
```

日常开发中无需手动派发，插件会在合适的时机自行触发。

## 相关链接

- [回调](./callbacks)
- [实例方法](./methods)
