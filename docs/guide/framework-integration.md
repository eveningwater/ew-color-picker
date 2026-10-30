---
title: 框架集成
description: 在 React、Vue 3、Angular 与 Solid 中集成 EW Color Picker 的最小封装写法、生命周期清理与受控同步。
---

# 框架集成

EW Color Picker 只依赖原生 DOM 与事件，没有任何框架运行时依赖，因此在任意框架里都能用同一套方式接入：**挂载时创建实例、卸载时 `destroy()`、受控值通过 `setColor()` 同步**。

本页给出四个框架的最小可用封装，可直接复制到项目中。官方不单独发布框架封装包，原因见[竞品对比与定位](./comparison)。

## 通用要点

1. **一个挂载点一个实例**：`el` 同时支持选择器字符串与 DOM 元素，推荐传元素引用，天然避免多实例选择器冲突。
2. **卸载必须 `destroy()`**：实例会在 `document` 上注册点击监听，不销毁会泄漏，并且多实例时可能出现互相开关面板。
3. **受控同步要防循环**：外部值变化时调用 `setColor()`，而 `setColor()` 会再触发 `change`；比较新旧值再回调即可。
4. **样式需要引两份**：`index.css` 与 `input-number.css`（数字输入框样式在单独文件里）。
5. **SSR 场景延迟挂载**：只在浏览器端的生命周期里创建实例（`useEffect` / `onMounted` / `ngAfterViewInit` / `onMount`），避免服务端渲染时访问 DOM。

```ts
import ewColorPicker from '@ew-color-picker/ewColorPicker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'
```

## React

```tsx
import { useEffect, useRef } from 'react'
import ewColorPicker from '@ew-color-picker/ewColorPicker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

interface Props {
  value: string
  onChange: (color: string) => void
}

export function ColorField({ value, onChange }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const pickerRef = useRef<ewColorPicker | null>(null)

  useEffect(() => {
    const picker = new ewColorPicker({
      el: hostRef.current!,
      defaultColor: value,
    })
    picker.on('change', (color: string) => onChange(color))
    pickerRef.current = picker

    return () => {
      picker.destroy()
      pickerRef.current = null
    }
  }, [])

  useEffect(() => {
    pickerRef.current?.setColor(value)
  }, [value])

  return <div ref={hostRef} />
}
```

React 19 的 StrictMode 会执行两次挂载，上面的 `return () => picker.destroy()` 已经能保证不会残留实例。

## Vue 3

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ewColorPicker from '@ew-color-picker/ewColorPicker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const hostRef = ref<HTMLDivElement>()
let picker: ewColorPicker | null = null

onMounted(() => {
  picker = new ewColorPicker({
    el: hostRef.value!,
    defaultColor: props.modelValue,
    changeColor: (color: string) => emit('update:modelValue', color),
  })
})

watch(
  () => props.modelValue,
  (value) => {
    if (picker && picker.getColor() !== value) picker.setColor(value)
  },
)

onBeforeUnmount(() => {
  picker?.destroy()
  picker = null
})
</script>

<template>
  <div ref="hostRef" />
</template>
```

这样使用时就是标准 `v-model`：

```vue
<ColorField v-model="color" />
```

## Angular

```ts
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core'
import ewColorPicker from '@ew-color-picker/ewColorPicker'

@Component({
  selector: 'ew-color-field',
  standalone: true,
  template: '<div #host></div>',
})
export class ColorFieldComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>
  @Input() value = '#ffffff'
  @Output() valueChange = new EventEmitter<string>()

  private picker?: ewColorPicker

  ngAfterViewInit(): void {
    this.picker = new ewColorPicker({
      el: this.host.nativeElement,
      defaultColor: this.value,
      changeColor: (color: string) => this.valueChange.emit(color),
    })
  }

  ngOnDestroy(): void {
    this.picker?.destroy()
  }
}
```

配合 `[(value)]` 使用：

```html
<ew-color-field [(value)]="color" />
```

## Solid

```tsx
import { onCleanup, onMount } from 'solid-js'
import ewColorPicker from '@ew-color-picker/ewColorPicker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

export function ColorField(props: { value: string; onChange: (color: string) => void }) {
  let host!: HTMLDivElement
  let picker: ewColorPicker | undefined

  onMount(() => {
    picker = new ewColorPicker({ el: host, defaultColor: props.value })
    picker.on('change', (color: string) => props.onChange(color))
  })

  onCleanup(() => picker?.destroy())

  return <div ref={host} />
}
```

Solid 的细粒度响应式不需要额外的同步逻辑：把 `props.value` 传进 `createEffect` 里调用 `setColor()` 即可。

## 常见问题

**Q：能不能直接传选择器字符串？**
可以，`el: '#picker'` 也行。但框架里更推荐传元素引用，页面上有多个同 id 元素时不会串。

**Q：为什么我的面板被别的实例关掉了？**
通常是某个实例没有在卸载时 `destroy()`，残留的 `document` 点击监听到处触发开关。

**Q：`change` 事件会一直循环触发吗？**
只有在「监听 change 后改写外部值，又用 setColor 写回组件」时才可能循环，用新旧值比较即可切断。

**Q：需要自己写框架封装包吗？**
上面的代码就是完整封装。如果项目内多处使用，建议把这 20 行沉淀为自己的组件，而不是依赖第三方封装包。
