---
title: Box 颜色盒插件
description: Box 插件是 EW Color Picker 的触发器：渲染当前颜色色块，点击打开或关闭面板，并负责图标颜色随背景自适应。
---

# Box 颜色盒

`ewColorPickerBox` 是用户第一眼看到的控件：一个显示当前颜色的方形触发器。点击它开合颜色面板。

| 项 | 值 |
| --- | --- |
| 包 | `@ew-color-picker/box` |
| `pluginName` | `ewColorPickerBox` |
| `applyOrder` | 未显式声明（按注册顺序执行，聚合包中排第 2） |
| 挂载点 | `root`（`.ew-color-picker`） |
| 访问实例 | `core.plugins.ewColorPickerBox` |

## 配置项

Box 读取以下 options：

| 配置 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `defaultColor` | `string` | `''` | 初始颜色，同时作为「清空」后的还原色 |
| `size` | `string \| number \| { width, height }` | `'normal'` | 色块尺寸，详见下文 |
| `disabled` | `boolean` | `false` | 禁用后不可点击，面板也不会展开 |
| `readonly` | `boolean` | `false` | 只读：阻止点击（与 `disabled` 同样不响应），仅保留视觉样式 |
| `hasBox` | `boolean` | `true` | 设为 `false` 时不渲染色块 |
| `boxNoColorIcon` | `string` | `''` | 无颜色时自定义图标（HTML 字符串） |
| `boxHasColorIcon` | `string` | `''` | 有颜色时自定义图标（HTML 字符串） |
| `className` | `string` | `''` | 追加到 `.ew-color-picker-box` 上的额外类名 |
| `style` | `string \| Record<string,string>` | `''` | 直接内联到色块的样式 |
| `onClick` | `(plugin) => void` | — | 点击色块时的回调，参数为 Box 插件实例 |
| `onMouseEnter` | `(plugin) => void` | — | 鼠标移入回调 |
| `onMouseLeave` | `(plugin) => void` | — | 鼠标移出回调 |

### size 的三种写法

| 写法 | 示例 | 结果 |
| --- | --- | --- |
| 预设关键字 | `size: 'mini'` | `mini=20px`、`small=24px`、`normal=32px`、`medium=36px`、`large=40px` |
| 数字 | `size: 48` | 宽高均为 `48px` |
| 对象 | `size: { width: '60px', height: '36px' }` | 自定义宽高（数字会自动补 `px`） |
| CSS 字符串 | `size: '5rem'` | 原样使用 |

图标尺寸会跟随色块尺寸自动缩放：

| size | 图标尺寸 |
| --- | --- |
| `mini` | 12px |
| `small` | 14px |
| `normal` | 16px |
| `medium` | 18px |
| `large` | 20px |
| 数字 / 对象 | 取较短边的 50% |

### 图标颜色自适应

默认图标颜色不是写死的，而是按背景色**相对亮度**计算：

- 亮度 > 0.5（浅色背景）→ `#333333`
- 否则 → `#ffffff`
- 半透明颜色按「叠加在白色底上」的实际呈现色计算

因此 `#fff` 上会显示深色箭头，`#000` 上会显示白色箭头，无需手动配置。

### 自定义图标

```ts
new ewColorPicker({
  el: '#app',
  boxNoColorIcon: '<svg viewBox="0 0 24 24">…</svg>',
  boxHasColorIcon: '<svg viewBox="0 0 24 24">…</svg>',
})
```

传入字符串会直接作为 `innerHTML`，请确保内容可信。

## 实例方法

```ts
const box = picker.plugins.ewColorPickerBox
```

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `enableBox` | `(enable = true) => void` | 显示/隐藏色块，等价于 `hasBox = enable` |
| `update` | `(keys?: string[]) => void` | 按需刷新。默认刷新 `defaultColor / size / disabled / readonly / className / style` |
| `updateChildren` | `() => void` | 只重新计算图标（内容与颜色） |
| `setBoxSize` | `() => void` | 重新应用尺寸样式 |
| `setBoxBgColor` | `(color?: string) => void` | 设置色块背景色，`undefined` 视为空 |
| `clearBoxBgColor` | `() => void` | 清空背景色并回到「无颜色」图标 |
| `setBoxState` | `() => void` | 同步 `is-disabled` / `is-readonly` 状态类 |
| `setDisabled` | `(disabled: boolean) => void` | 切换禁用态 |
| `bindMouseEvents` | `(onEnter?, onLeave?) => void` | 手动绑定鼠标事件 |
| `unbindHandler` | `() => void` | 解绑所有 DOM 事件 |
| `destroy` | `() => void` | 移除色块并解绑事件 |

### 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `hasBox` | `boolean`（getter/setter） | 读写显示状态，setter 会自动渲染/移除 |
| `box` | `HTMLElement \| null` | 色块 DOM |

## 事件与回调

Box 自身不触发事件，点击时按当前状态直接调用：

```ts
if (picker.pickerFlag) {
  picker.hidePanel(togglePickerAnimation, pickerAnimationTime)
} else {
  picker.showPanel(togglePickerAnimation, pickerAnimationTime)
}
onClick?.(boxPlugin)
```

`disabled` 或 `readonly` 为 `true` 时，点击会被 `preventDefault` + `stopPropagation` 拦截，不会展开面板，也不会执行 `onClick`。

监听颜色或开合状态请使用核心事件：

```ts
picker.on('toggle', (isOpen) => console.log('面板开合：', isOpen))
picker.on('change', (color) => console.log('颜色：', color))
```

## DOM 结构

```html
<div class="ew-color-picker" data-uid="…">
  <!-- Box -->
  <div class="ew-color-picker-box" style="width:32px;height:32px">
    <span class="ew-color-picker-box-arrow-icon">…</span>
    <!-- 或 <span class="ew-color-picker-box-close-icon">…</span> -->
  </div>
  <!-- 面板容器 -->
  <div class="ew-color-picker-panel-container ew-color-picker-panel-container-hidden">…</div>
</div>
```

| 类名 | 说明 |
| --- | --- |
| `.ew-color-picker-box` | 触发器根节点 |
| `.ew-color-picker-box-arrow-icon` | 有颜色时的默认图标 |
| `.ew-color-picker-box-close-icon` | 无颜色时的默认图标 |
| `.is-disabled` | 禁用态 |
| `.is-readonly` | 只读态 |

## 完整示例

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="/node_modules/@ew-color-picker/style/dist/index.css" />
    <link rel="stylesheet" href="/node_modules/@ew-color-picker/style/dist/input-number.css" />
  </head>
  <body>
    <div id="app"></div>
    <script src="/node_modules/@ew-color-picker/ew-color-picker/dist/index.min.js"></script>
    <script>
      const picker = new ewColorPicker({
        el: '#app',
        defaultColor: '#6366f1',
        size: 'large',
        onMouseEnter: () => console.log('鼠标移入色块'),
        onMouseLeave: () => console.log('鼠标移出色块'),
        onClick: (box) => {
          console.log('点击了色块', box.hasBox)
        },
      })
    </script>
  </body>
</html>
```

## 相关

- [Panel 颜色面板](./panel.md) — 色块展开后的主体
- [配置项 · size](../api/options.md#size)
- [样式与类名](../api/styles.md)
