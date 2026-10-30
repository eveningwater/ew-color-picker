---
title: Predefine 预定义颜色插件
description: 用 predefineColor 配置一组快捷色块，支持逐项禁用、运行时更新与点击高亮。
---

# Predefine 预定义颜色

`ewColorPickerPredefine` 在面板内渲染一排预设色块，点击即可快速切换到常用颜色。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/predefine` |
| `pluginName` | `ewColorPickerPredefine` |
| `applyOrder` | 未显式声明（按注册顺序） |
| 挂载点 | `panelContainer` |
| 访问实例 | `core.plugins.ewColorPickerPredefine` |

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `predefineColor` | `(string \| { color: string; disabled?: boolean })[]` | `[]` | 预定义颜色列表；**为空时不渲染** |
| `changeColor` | `(rgba: string) => void` | — | 点击色块后的回调，参数为 `rgba()` 字符串 |
| `disabled` | `boolean` | `false` | 全局禁用后点击无效 |

### 两种数组写法

```ts
// 纯字符串
predefineColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7']

// 带禁用项
predefineColor: [
  { color: '#ef4444' },
  { color: '#22c55e', disabled: true },
  { color: '#3b82f6' },
]
```

### 校验规则

- 使用**严格颜色格式**校验，只保留合法的 `hex` / `rgb` / `hsl` / 具名色等；
- 非法颜色会在渲染前被过滤掉；
- 点击时仍会再次校验，非法值会 `warn` 且不改色。

## 实例方法

```ts
const predefine = picker.plugins.ewColorPickerPredefine
```

| 方法 / 属性 | 签名 | 说明 |
| --- | --- | --- |
| `updatePredefineColors` | `(colors: string[] \| PredefineColor[]) => void` | 替换颜色列表并重新渲染、重新绑定事件 |
| `setDisabled` | `(index: number, disabled: boolean) => void` | 按索引启用/禁用单个色块 |
| `onPredefineColorClick` | `(event: Event, color: string) => void` | 点击处理逻辑（防抖 100ms） |
| `predefineItems` | `HTMLElement[]` | 色块 DOM 列表 |
| `container` | `HTMLElement \| null` | 色块容器 |

### 运行时更新

```ts
picker.plugins.ewColorPickerPredefine.updatePredefineColors([
  '#000000', '#ffffff', '#64748b',
])

picker.plugins.ewColorPickerPredefine.setDisabled(0, true)
```

## 点击行为

1. 命中色块并检查是否带 `-disabled` 类；
2. 若全局 `disabled` 为 `true`，直接阻止事件；
3. 给当前色块加 `ew-color-picker-predefine-color-active`，移除其它色块的高亮；
4. 校验颜色 → 转换为 `rgba` → 同步 `core.hsvaColor` → `core.setColor(rgba)`；
5. 调用 `options.changeColor?.(rgba)`。

## 事件

改色经由 `core.setColor()`，并会正常触发 `change`：

```ts
picker.on('change', (color) => console.log('预定义色块：', color))
```

## DOM 结构

```html
<div class="ew-color-picker-predefine-container">
  <div class="ew-color-picker-predefine-color">
    <div class="ew-color-picker-predefine-color-item" style="background:#ef4444"></div>
  </div>
  <div class="ew-color-picker-predefine-color ew-color-picker-predefine-color-disabled">…</div>
  <div class="ew-color-picker-predefine-color ew-color-picker-predefine-color-active">…</div>
</div>
```

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-predefine-container` | 色块容器 |
| `.ew-color-picker-predefine-color` | 单个色块外层 |
| `.ew-color-picker-predefine-color-item` | 颜色填充层 |
| `.ew-color-picker-predefine-color-disabled` | 禁用态 |
| `.ew-color-picker-predefine-color-active` | 当前选中态 |

## 完整示例

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#3b82f6',
  predefineColor: [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#3b82f6',
    '#a855f7',
    { color: '#0f172a', disabled: true },
  ],
  changeColor: (rgba) => console.log('选中预设色：', rgba),
})
```

## 相关

- [配置项 · predefineColor](../api/options.md#predefinecolor)
- [样式与类名](../api/styles.md)
