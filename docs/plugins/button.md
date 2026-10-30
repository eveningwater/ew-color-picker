---
title: Button 按钮插件
description: Button 插件渲染清空与确定按钮，支持自定义文案、禁用、动态显隐，并触发 clear / sure 事件。
---

# Button 按钮

`ewColorPickerButton` 渲染「清空」与「确定」两个按钮。清空会还原默认色并关闭面板，确定会提交当前色并关闭面板。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/button` |
| `pluginName` | `ewColorPickerButton` |
| `applyOrder` | `Post` |
| 挂载点 | `panelContainer` → `.ew-color-picker-bottom-row` |
| 访问实例 | `core.plugins.ewColorPickerButton` |

## 配置项

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `showButton` | `boolean` | `true` | `false` 时不渲染任何按钮 |
| `hasClear` | `boolean` | `true` | `false` 时隐藏清空按钮 |
| `hasSure` | `boolean` | `true` | `false` 时隐藏确定按钮 |
| `clearText` | `string` | `'清空'` | 清空按钮文案 |
| `sureText` | `string` | `'确定'` | 确定按钮文案 |
| `disabled` | `boolean` | `false` | 禁用两个按钮 |

> `hasClear` / `hasSure` 在构造期生效；运行时切换请用 `enableClear` / `enableSure` / `enableButtons`。

## 实例方法

```ts
const button = picker.plugins.ewColorPickerButton
```

| 方法 / 属性 | 签名 | 说明 |
| --- | --- | --- |
| `enableClear` | `(enable = true) => void` | 显示/隐藏清空按钮 |
| `enableSure` | `(enable = true) => void` | 显示/隐藏确定按钮 |
| `enableButtons` | `(enable = true) => void` | 同时控制两个按钮 |
| `hasClear` / `hasSure` | `boolean`（getter/setter） | setter 会重新渲染 |
| `setClearText` | `(text: string) => void` | 修改清空文案 |
| `setSureText` | `(text: string) => void` | 修改确定文案 |
| `setDisabled` | `(disabled: boolean) => void` | 设置按钮 `disabled` 属性 |
| `updateOptions` | `() => void` | 重新读取配置并重绘（延后一帧以避开 ColorMode） |
| `onClearColor` | `() => void` | 执行清空逻辑（防抖 100ms） |
| `onSureColor` | `() => void` | 执行确定逻辑（防抖 100ms） |
| `clearButton` / `sureButton` | `HTMLButtonElement \| null` | 按钮 DOM |

## 点击行为

### 清空（onClearColor）

1. 读取 `defaultColor`：有值则还原为该颜色，否则置空；
2. 同步 `hsvaColor`（无默认色时重置为 `{h:0,s:100,v:100,a:1}`）；
3. `core.setColor(resetColor)`；
4. `core.syncAllPlugins(resetColor)` 同步全部插件 UI；
5. `core.hidePanel()` 关闭面板；
6. 调用 `options.clear?.(picker)`；
7. `core.trigger('clear')`。

### 确定（onSureColor）

1. 调用 `options.sure?.(color, picker)`；
2. `core.trigger('sure', color, picker)`；
3. `core.hidePanel()` 关闭面板。

## 事件与回调

| 来源 | 签名 | 触发时机 |
| --- | --- | --- |
| `options.clear` | `(picker) => void` | 点击清空按钮 |
| `options.sure` | `(color, picker) => void` | 点击确定按钮 |
| 事件 `clear` | `()` | 点击清空按钮 |
| 事件 `sure` | `(color, picker)` | 点击确定按钮 |

```ts
picker.on('sure', (color, instance) => console.log('确定：', color))
picker.on('clear', () => console.log('已清空'))
```

## DOM 结构

```html
<div class="ew-color-picker-bottom-row">
  <div class="ew-color-picker-drop-btn-group">
    <button class="ew-color-picker-clear-btn ew-color-picker-drop-btn">清空</button>
    <button class="ew-color-picker-sure-btn ew-color-picker-drop-btn">确定</button>
  </div>
</div>
```

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-drop-btn-group` | 按钮组 |
| `.ew-color-picker-drop-btn-group-multi` / `-single` | 与 ColorMode 输入组并排时的布局调整 |
| `.ew-color-picker-clear-btn` | 清空按钮 |
| `.ew-color-picker-sure-btn` | 确定按钮 |
| `.ew-color-picker-drop-btn` | 通用按钮样式 |

## 完整示例

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#8b5cf6',
  clearText: '重置',
  sureText: '用这个颜色',
  clear: (instance) => {
    console.log('清空后颜色：', instance.getColor())
  },
  sure: (color, instance) => {
    console.log('确定颜色：', color)
    instance.destroy()
  },
})
```

## 相关

- [事件 · clear / sure](../api/events.md)
- [配置项 · clearText / sureText](../api/options.md#cleartext)
