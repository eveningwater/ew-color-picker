# @ew-color-picker/vue

ew-color-picker 的 Vue 3 封装组件，支持 `v-model`、类型化 props 与实例方法透出。

封装只负责宿主元素与实例生命周期，配置与事件全部转发给核心选择器；样式不内置，需要在应用入口引入两份 CSS。

## 安装

```bash
pnpm add @ew-color-picker/vue
```

## 使用

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { EwColorPicker } from '@ew-color-picker/vue'
import '@ew-color-picker/style/dist/index.css'
import '@ew-color-picker/style/dist/input-number.css'

const color = ref('#6366f1')

function onSure(next: string) {
  console.log('sure', next)
}
</script>

<template>
  <EwColorPicker v-model="color" :options="{ panelMode: 'small' }" @sure="onSure" />
</template>
```

## Props 与事件

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `v-model` | `string` | 当前颜色，等价于 `modelValue` + `update:modelValue` |
| `options` | `ewColorPickerOptions` | 透传给核心选择器的配置，`el` 由组件接管 |

事件：`change` / `sure` / `clear` / `toggle` / `mode-change` / `destroy`。

通过模板 ref 可访问 `getColor()`、`setColor(color)`、`openPicker()`、`closePicker()`、`getInstance()`。

## 相关文档

- [框架集成](https://eveningwater.github.io/ew-color-picker/zh/guide/framework-integration)
- [配置项](https://eveningwater.github.io/ew-color-picker/zh/api/options)
