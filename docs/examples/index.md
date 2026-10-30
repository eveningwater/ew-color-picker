---
title: 示例集
description: EW Color Picker 的 12 个典型用法：基础、布局、预设色、按钮、事件、定位、动画、禁用、模式、API、数字输入、多实例。
---

# 示例集

下面是 12 个覆盖主要场景的最小示例。仓库 `examples/` 目录下有对应的完整 HTML 文件，可直接用浏览器打开。

## 1. 基础用法

```html
<div id="app"></div>
<script src="@ew-color-picker/ewColorPicker/dist/index.js"></script>
<script>
  const picker = new ewColorPicker({ el: '#app', defaultColor: '#3b82f6' })
  picker.on('change', (color) => console.log(color))
</script>
```

## 2. 布局与方向

```ts
new ewColorPicker({
  el: '#app',
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  size: 'large',
})
```

## 3. 预定义颜色

```ts
new ewColorPicker({
  el: '#app',
  predefineColor: ['#ef4444', '#22c55e', '#3b82f6', { color: '#0f172a', disabled: true }],
})
```

## 4. 按钮控制

```ts
new ewColorPicker({
  el: '#app',
  hasClear: false,
  sureText: '应用颜色',
  sure: (color) => console.log('应用：', color),
})
```

## 5. 事件与回调

```ts
const picker = new ewColorPicker({
  el: '#app',
  changeColor: (color) => console.log('回调：', color),
})

picker.once('change', (color) => console.log('只监听一次：', color))
picker.on('sure', (color) => console.log('确定：', color))
picker.on('clear', () => console.log('清空'))
picker.on('toggle', (open) => console.log('面板：', open ? '展开' : '收起'))
```

## 6. 面板自动定位

```ts
new ewColorPicker({
  el: '#app',
  autoPanelPosition: true,
  panelPlacement: 'top-end',
})
```

## 7. 开合动画

```ts
new ewColorPicker({
  el: '#app',
  togglePickerAnimation: 'height',
  pickerAnimationTime: 300,
})
```

可用动画：`default`、`height`、`opacity`。`pickerAnimationTime` 上限 10000ms。

## 8. 禁用与只读

```ts
// 完全禁用
new ewColorPicker({ el: '#app', disabled: true })

// 只读：阻止点击，仅展示
new ewColorPicker({ el: '#app', readonly: true, defaultColor: '#84cc16' })
```

## 9. 颜色模式

```ts
new ewColorPicker({
  el: '#app',
  defaultMode: 'rgb',
  showColorMode: true,
  changeMode: (mode) => console.log('模式：', mode),
})
```

## 10. 实例 API

```ts
const picker = new ewColorPicker({ el: '#app', defaultColor: '#f43f5e' })

console.log(picker.getColor())        // 当前颜色
console.log(picker.getHsvaColor())    // { h, s, v, a }
picker.setColor('#22c55e')
picker.updateOptions({ size: 'large' })
picker.showPanel()
picker.hidePanel()
picker.destroy()
```

## 11. 数字输入框

```ts
import { InputNumber } from '@ew-color-picker/input-number'
import '@ew-color-picker/style/dist/input-number.css'

const num = new InputNumber({
  value: 50,
  min: 0,
  max: 100,
  onChange: (v) => console.log(v),
})
document.body.appendChild(num.getElement())
```

## 12. 多实例

```ts
[...document.querySelectorAll('.picker')].forEach((el) => {
  new ewColorPicker({ el, defaultColor: '#a855f7' })
})
```

::: warning 不要直接传 NodeList
构造函数不接受 `NodeList` / 数组，必须逐个实例化。每个实例的事件、挂载点、输入框都是隔离的。
:::

## 相关

- [在线演示](./demo.md)
- [配置项](../api/options.md)
- [实例方法](../api/methods.md)
- [事件](../api/events.md)
