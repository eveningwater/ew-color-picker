---
title: 回调
description: 核心回调与各插件回调的签名、触发时机，以及回调与事件的差异对比。
---

# 回调

回调是配置对象中的函数字段，与[事件](./events)不同：**回调一个事件类型只能配置一个**，而事件可以注册多个监听器。回调由具体插件在合适的时机直接调用。

## 核心回调

### changeColor

颜色变化时调用，由 `setColor()` 直接调用。

```ts
new ewColorPicker({
  el: '#picker',
  changeColor(color: string) {
    console.log(color)
  },
})
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `color` | `string` | 最新颜色字符串 |

执行顺序：`trigger('change', color)` → `options.changeColor(color)`。

### sure

点击“确定”时调用，由 Button 插件在触发 `sure` 事件之前调用。

```ts
new ewColorPicker({
  el: '#picker',
  sure(color: string, picker: ewColorPicker) {
    console.log('确定：', color)
  },
})
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `color` | `string` | 当前颜色 |
| `picker` | `ewColorPicker` | 实例 |

### clear

点击“清空”时调用，由 Button 插件在触发 `clear` 事件之前调用。

```ts
new ewColorPicker({
  el: '#picker',
  clear(picker: ewColorPicker) {
    console.log('清空')
  },
})
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `picker` | `ewColorPicker` | 实例 |

### togglePicker

面板开合时调用，分别在 `showPanel()` / `hidePanel()` 动画完成后执行。

```ts
new ewColorPicker({
  el: '#picker',
  togglePicker(isOpen: boolean) {
    console.log(isOpen ? '打开' : '关闭')
  },
})
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `isOpen` | `boolean` | `true` 展开，`false` 收起 |

## 插件级回调

### Box

通过 `ewColorPickerBox` 配置。

```ts
new ewColorPicker({
  el: '#picker',
  ewColorPickerBox: {
    onClick(plugin) {},      // 点击颜色盒
    onMouseEnter(plugin) {}, // 鼠标移入
    onMouseLeave(plugin) {}, // 鼠标移出
  },
})
```

| 回调 | 参数 | 说明 |
| --- | --- | --- |
| `onClick` | `ewColorPickerBoxPlugin` | 点击颜色盒（默认开合行为不受影响） |
| `onMouseEnter` | `ewColorPickerBoxPlugin` | 鼠标移入 |
| `onMouseLeave` | `ewColorPickerBoxPlugin` | 鼠标移出 |

### Input

通过 `changeColor` 配置（与核心 `changeColor` 同名，Input 插件会在用户输入合法颜色后调用）。

```ts
new ewColorPicker({
  el: '#picker',
  changeColor(color) {
    console.log('输入框提交：', color) // rgba 字符串
  },
})
```

### InputNumber

```ts
import { InputNumber } from '@ew-color-picker/input-number'

const input = new InputNumber({
  value: 128,
  min: 0,
  max: 255,
  step: 1,
  onChange(value) {
    console.log('数值变化：', value)
  },
  onBlur(value) {
    console.log('失焦：', value)
  },
  onFocus(event) {
    console.log('聚焦：', event)
  },
})
```

| 回调 | 参数 | 说明 |
| --- | --- | --- |
| `onChange` | `value: number` | 数值变化（含输入与步进） |
| `onBlur` | `value: number` | 失焦 |
| `onFocus` | `FocusEvent` | 聚焦 |

### ColorMode

```ts
new ewColorPicker({
  el: '#picker',
  changeMode(mode, picker) {
    console.log('模式：', mode) // 'hex' | 'rgb' | 'hsl'
  },
})
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `mode` | `ColorMode` | 当前模式 |
| `picker` | `ewColorPicker` | 实例 |

## 回调 vs 事件

| 维度 | 回调 | 事件 |
| --- | --- | --- |
| 数量 | 每种一个 | 可注册多个 |
| 注册方式 | 构造配置 | `on` / `once` |
| 解绑 | 需 `updateOptions` 覆盖 | `off` |
| 调用者 | 具体插件直接调用 | 插件 / 核心 `trigger` |
| 适用场景 | 单一业务处理 | 多监听、组件通信、插件同步 |

推荐：插件与核心内部同步使用事件；业务侧单一入口使用回调即可。

## 相关链接

- [事件](./events)
- [配置项](./options)
