---
title: Framework Integration
description: 'Minimal integration patterns for ew-color-picker in React, Vue 3, Angular and Solid, including lifecycle cleanup and controlled-value sync.'
---

# Framework Integration

ew-color-picker depends only on plain DOM and events — no framework runtime — so the same approach works everywhere: **create the instance on mount, call `destroy()` on unmount, and sync controlled values through `setColor()`**.

Below are minimal, copy-paste wrappers for four frameworks. No official framework packages are published; the reasoning is covered in [Comparison & Positioning](./comparison).

## Common rules

1. **One instance per mount point**: `el` accepts either a selector string or a DOM element; prefer the element reference so multiple pickers never collide on selectors.
2. **Always call `destroy()` on unmount**: the instance registers a `document` click listener. Leaking it breaks other instances by toggling their panels.
3. **Guard controlled sync against loops**: call `setColor()` when the external value changes, but `setColor()` fires `change` again — compare the incoming value first.
4. **Import both stylesheets**: `index.css` and `input-number.css` (the number input styles ship in a separate file).
5. **SSR safety**: create the instance only in browser-side lifecycle hooks (`useEffect` / `onMounted` / `ngAfterViewInit` / `onMount`).

```ts
import ewColorPicker from '@ew-color-picker/ew-color-picker'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'
```

## React

```tsx
import { useEffect, useRef } from 'react'
import ewColorPicker from '@ew-color-picker/ew-color-picker'
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

React 19 StrictMode mounts effects twice; the `return () => picker.destroy()` cleanup above prevents leftover instances.

## Vue 3

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ewColorPicker from '@ew-color-picker/ew-color-picker'
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

Usage is the standard `v-model`:

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
import ewColorPicker from '@ew-color-picker/ew-color-picker'

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

Use it with two-way binding:

```html
<ew-color-field [(value)]="color" />
```

## Solid

```tsx
import { onCleanup, onMount } from 'solid-js'
import ewColorPicker from '@ew-color-picker/ew-color-picker'
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

Solid's fine-grained reactivity needs no extra plumbing: call `setColor()` inside a `createEffect` that reads `props.value`.

## FAQ

**Can I pass a selector string?**
Yes, `el: '#picker'` works. Inside a framework, prefer the element reference so duplicate ids cannot clash.

**Why did another picker close my panel?**
An instance was not destroyed on unmount, so its leftover `document` click listener toggles panels everywhere.

**Does the `change` event loop forever?**
Only when you write the value back to the component and the component writes it back with `setColor()`. Compare old and new values to break the loop.

**Do I need official wrapper packages?**
The code above is the complete wrapper. If a project uses it in several places, extract these twenty lines into your own component rather than depending on a third-party package.
