---
title: AI 使用最佳实践
description: 面向 AI 编码助手的 ew-color-picker 集成规则：安装、样式、挂载、层级、改色、生命周期与框架封装的最小正确写法。
---

# AI 使用最佳实践

本页面向 AI 编码助手与代码生成工具，给出编写正确 ew-color-picker 代码所需的最小规则集。生成代码前先遵循本页，再按需查阅完整 API。

机器可读索引：[`llms.txt`](/llms.txt) · 完整文档：[`llms-full.txt`](/llms-full.txt)

## 1. 选择正确的入口

| 场景 | 安装 | 引入 |
| --- | --- | --- |
| 完整 UI 的标准选择器 | `@ew-color-picker/ew-color-picker` + `@ew-color-picker/style` | `import ewColorPicker from '@ew-color-picker/ew-color-picker'` |
| 沿用 v1 包名 | `ew-color-picker` | `import ewColorPicker from 'ew-color-picker'` |
| 只用部分 UI | `@ew-color-picker/core` + 各插件包 | `ewColorPicker.use(Box).use(Panel)` |
| 无构建工具（CDN） | 无 | `<script src="https://unpkg.com/@ew-color-picker/ew-color-picker/dist/index.min.js">` |

规则：

- **不要**混用 v1 与 v2 API。v2 是插件化架构，v1 的旧配置（如 `hasAlpha`）已不存在。
- 非作用域的 `ew-color-picker` 包不含实现代码，只是转出 `@ew-color-picker/ew-color-picker` 与样式。

## 2. 两个样式表都必须引入

```ts
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'
```

`input-number.css` **不是可选项**：缺少它时 RGB / HSL 分通道数字输入框会错乱。只有渲染 Select 或 Gradient 组件时才需要额外的 `select.css` 与 `tooltip.css`。

CDN 场景需要同时引入两个 `<link>`。只用静态 CSS 的用户不能依赖 core 入口运行时注入的样式。

## 3. 挂载：一个元素只对应一个实例

```ts
const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#6366f1',
})
```

- `el` 接受选择器字符串或 `HTMLElement`；省略时挂载到 `document.body`。
- 框架中传元素引用（`ref.current`），不要用可能重复的 id 选择器。
- 同一元素上不要创建两个实例；需要重建时先 `destroy()`。

## 4. 用 `hasBox: false` 搭配自定义触发器

当页面已有按钮、输入组或表格单元格负责打开面板时使用。

```ts
const picker = new ewColorPicker({
  el: '#my-trigger',
  hasBox: false,
  appendTo: document.body,
})

document.querySelector('#my-button')!.addEventListener('click', () => {
  picker.showPanel()
})
```

- `showPanel()` 与 `hidePanel()` 都是幂等的：面板已打开时再调用 `showPanel()` 不会有任何动作，可以安全地绑到任意点击事件。
- `hasBox: false` 时实例没有触发器色块，自定义 UI 放在 `el` 中，或把实例挂到隐藏宿主上。
- 用 `picker.getColor()` 读取当前值；尚未选色时返回 `''`。

## 5. 弹窗、抽屉、Modal 中的面板

面板定位有两个独立问题，都要处理：

1. 被 `overflow: hidden` 的祖先**裁剪** → 使用 `appendTo`。
2. 祖先带有 `transform`、`filter` 或 `backdrop-filter`，形成**层叠上下文** → 同样用 `appendTo: document.body`，面板脱离该层叠边界后才能盖住遮罩。

```ts
new ewColorPicker({
  el: '#picker',
  appendTo: document.body,
  panelPlacement: 'bottom-start',
  boundary: '.el-dialog__body',
})
```

- `appendTo` 会把面板切换为 `position: fixed`，并在滚动、缩放时保持对齐。
- `boundary` 把面板限制在指定容器的可视区域内，而不是整个视口；传滚动容器的选择器或元素。
- `autoPanelPosition: true` 用于让面板相对色块定位。**不要**与 `hasBox: false` 同时使用——此时没有色块可作锚点。

## 6. 只能通过 `setColor` 改色

```ts
picker.setColor('#f00')       // 触发 change 事件 + 调用 options.changeColor
picker.setColor('')           // 清空颜色，触发 change('')
picker.getColor()             // 当前颜色，可能为 ''
```

- 不要直接给 `picker.currentColor` 或 `picker.hsvaColor` 赋值。插件只响应 `change`。
- `setHsvaColor()` 只改内部状态、**不触发**事件；需要刷新 UI 时必须再调用 `setColor()`。
- 注册了 Alpha 插件时，hex 会被规范化为 `rgba()`；未注册 Alpha 时，`rgba()` 会被规范化为 hex。

## 7. 事件与回调，只选一条通道

两者由同一个动作触发，同时使用会造成重复处理。

```ts
// 配置回调
new ewColorPicker({ el: '#app', changeColor: (color) => save(color) })

// 实例事件
const picker = new ewColorPicker({ el: '#app' })
picker.on('change', (color: string) => save(color))
```

| 事件 | 参数 | 触发时机 |
| --- | --- | --- |
| `change` | `string` | 颜色改变 |
| `toggle` | `boolean` | 面板打开 / 关闭 |
| `sure` | `string` | 点击确定 |
| `clear` | — | 点击清空 |
| `options-update` | 配置对象 | `updateOptions()` 之后 |
| `mode-change` | 模式 | Hex / RGB / HSL 切换 |
| `destroy` | — | 实例销毁 |

未知事件名只打印警告、不会抛错。`emit()` 会额外调用对应的配置回调；`trigger()` 只执行监听器。

## 8. 卸载时必须调用 `destroy()`

```ts
const picker = new ewColorPicker({ el: host })
// later
picker.destroy()
```

实例会向 `document` 注册 `mousedown` 监听以实现点击外部关闭。监听泄漏会导致页面上**其他**选择器的面板被误关。`destroy()` 重复调用是安全的。

React 19 StrictMode 会执行两次 effect，清理函数正是防止残留实例的关键。

## 9. 受控组件不要形成更新循环

`setColor()` 会触发 `change`。如果组件把该值写回后又调用 `setColor()`，就会循环。加判断：

```ts
if (picker.getColor() !== value) picker.setColor(value)
```

## 10. 多实例与 DOM 查询

每个实例拥有独立的事件总线、`data-uid`、DOM 子树和插件实例。

- DOM 查询一律限定在实例根节点：`picker.wrapper.querySelector(...)`。
- 页面存在多个选择器时，不要用 `.ew-color-picker-box` 这类全局选择器。
- 颜色不会在实例间共享，不存在全局「当前颜色」。

## 11. SSR 安全

引入模块与样式在服务端是安全的；实例化不安全，因为它会访问 `document`。

只在浏览器生命周期中创建实例：`useEffect`、`onMounted`、`ngAfterViewInit`、`onMount`。

## 12. 运行时更新配置

```ts
picker.updateOptions({ size: 'small', disabled: true })
```

`updateOptions()` 会合并配置、重新应用插件以让插件刷新，并触发 `options-update`。仅当新传入的 `defaultColor` 合法时才调用 `setColor()`；非法值会告警并保留当前颜色。

运行时隐藏插件请使用文档化的开关（`hasPanel`、`hasInput`、`showButton`、`hue`、`alpha` 等），不要直接操作 `picker.plugins`。

## 13. TypeScript

```ts
import type { ewColorPickerConstructorOptions } from '@ew-color-picker/core'
import type { InputNumberOptions } from '@ew-color-picker/input-number'

const options: ewColorPickerConstructorOptions = { el: '#app', defaultColor: '#6366f1' }
```

所有包都带类型声明。插件配置类型从对应插件包引入。

## 14. 生成代码前的自检清单

- [ ] 已引入 `index.css` 与 `input-number.css`。
- [ ] 每个挂载点只有一个实例。
- [ ] `destroy()` 已接入框架卸载流程。
- [ ] 受控同步在调用 `setColor()` 前比较了值。
- [ ] 弹窗/抽屉中的面板使用了 `appendTo: document.body`（需要限制范围时再加 `boundary`）。
- [ ] 同一职责只使用 `changeColor` 回调或 `change` 事件其中之一。
- [ ] 没有直接修改 `currentColor` / `hsvaColor`。
- [ ] SSR 代码只在浏览器生命周期内创建实例。

## 常见错误

| 现象 | 原因 | 修复 |
| --- | --- | --- |
| RGB 输入框样式错乱 | 缺少 `input-number.css` | 引入 `@ew-color-picker/style/dist/input-number.css` |
| 面板被弹窗遮住 | 祖先层叠上下文或 `overflow` 裁剪 | `appendTo: document.body` |
| 面板跑到角落 | `hasBox: false` 同时开了 `autoPanelPosition` | 去掉 `autoPanelPosition`，用 `appendTo` + `panelPlacement` |
| 其他选择器的面板自动关闭 | 实例监听泄漏 | 卸载时调用 `destroy()` |
| 颜色更新两次 / 死循环 | 回写值与 `setColor()` 互相驱动 | 设置前比较 `getColor()` |
| 面板打开后立刻关闭 | 同一元素上有两个实例 | 先销毁旧实例 |
| 自定义 `prefix` 后样式失效 | JS `prefix` 与 SCSS `$prefix` 不一致 | 两者保持同步，或使用预构建的 `ew-` 样式 |
