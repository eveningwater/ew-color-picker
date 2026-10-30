---
title: 快速开始
description: 几分钟内创建第一个 EW Color Picker 实例：容器、配置、事件、方法与销毁。
---

# 快速开始

## 1. 准备容器

颜色选择器会挂载到指定容器中。容器宽度由内容自适应，建议给容器留出足够空间。

```html
<div id="picker"></div>
```

## 2. 初始化

```ts
import ewColorPicker from '@ew-color-picker/ew-color-picker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

const picker = new ewColorPicker({
  el: '#picker',
  defaultColor: '#6366f1',
})

console.log(picker.getColor()) // '#6366f1'
```

`el` 支持三种写法：

```ts
new ewColorPicker('#picker')            // 选择器
new ewColorPicker(document.querySelector('#picker')!) // 元素
new ewColorPicker({ el: '#picker' })    // 配置对象
```

## 3. 监听颜色变化

```ts
const picker = new ewColorPicker({
  el: '#picker',
  changeColor(color) {
    console.log('实时颜色：', color)
  },
  sure(color, instance) {
    console.log('点击确定：', color, instance)
  },
  clear(instance) {
    console.log('点击清空')
  },
})
```

也可以使用事件订阅：

```ts
picker.on('change', (color) => {
  document.body.style.background = color
})
```

## 4. 常用的完整配置

```ts
const picker = new ewColorPicker({
  el: '#picker',
  defaultColor: 'rgba(99, 102, 241, 0.8)',
  predefineColor: [
    '#6366f1',
    '#8b5cf6',
    '#06b6d4',
    '#22c55e',
    { color: '#ef4444', disabled: true },
  ],
  size: 'large',
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  panelPlacement: 'bottom-end',
  autoPanelPosition: true,
  togglePickerAnimation: 'height',
  pickerAnimationTime: 240,
  clearText: '重置',
  sureText: '应用',
  changeColor(color) {
    console.log(color)
  },
})
```

## 5. 实例方法

```ts
picker.setColor('#ff0000')  // 修改颜色（唯一入口）
picker.getColor()           // 获取当前颜色字符串
picker.openPicker()         // 展开面板
picker.closePicker()        // 收起面板
picker.updateOptions({ disabled: true }) // 运行时更新配置
picker.destroy()            // 销毁实例，解绑事件
```

## 6. 销毁

页面卸载或组件卸载时务必调用 `destroy()`，它会移除 DOM、解绑全局事件并清空插件。

```ts
picker.destroy()
console.log(picker.getDestroyedStatus()) // true
```

## 下一步

- [核心概念](./concepts) — 理解插件挂载点与事件流
- [配置项](../api/options) — 查看全部可选参数
- [插件](../plugins/) — 按需组合界面
