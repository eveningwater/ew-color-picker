# @ew-color-picker/react

ew-color-picker 的 React 封装组件，支持受控值、`forwardRef` 与类型化 props。

封装只负责宿主元素与实例生命周期，配置与事件全部转发给核心选择器；样式不内置，需要在应用入口引入两份 CSS。

## 安装

```bash
pnpm add @ew-color-picker/react
```

## 使用

```tsx
import { useRef, useState } from 'react'
import { EwColorPicker, type EwColorPickerRef } from '@ew-color-picker/react'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

export function ColorField() {
  const [color, setColor] = useState('#6366f1')
  const pickerRef = useRef<EwColorPickerRef>(null)

  return (
    <EwColorPicker
      ref={pickerRef}
      value={color}
      onChange={setColor}
      onSure={(next) => console.log('sure', next, pickerRef.current?.getInstance())}
      options={{ panelMode: 'small' }}
    />
  )
}
```

## Props 与事件

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `string` | 受控颜色值，变化时会同步到选择器 |
| `options` | `ewColorPickerOptions` | 透传给核心选择器的配置，`el` 由组件接管 |
| `onChange` | `(color: string) => void` | 颜色变化 |
| `onSure` / `onClear` | `(color: string) => void` / `() => void` | 确定 / 清空 |
| `onToggle` | `(open: boolean) => void` | 面板开关 |
| `onModeChange` | `(mode: string) => void` | Hex / RGB / HSL 模式切换 |

通过 `ref` 可访问 `getColor()`、`setColor(color)`、`openPicker()`、`closePicker()`、`getInstance()`。

## 相关文档

- [框架集成](https://eveningwater.github.io/ew-color-picker/zh/guide/framework-integration)
- [配置项](https://eveningwater.github.io/ew-color-picker/zh/api/options)
