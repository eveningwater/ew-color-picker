<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ewColorPicker from '@ew-color-picker/ew-color-picker';
import '@ew-color-picker/style/dist/index.css';
import '@ew-color-picker/style/dist/input-number.css';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [color: string] }>();

const host = ref<HTMLDivElement>();
let picker: ewColorPicker | null = null;
let syncing = false;
let lastEmitted = props.modelValue;

onMounted(() => {
  if (!host.value) return;

  picker = new ewColorPicker({ el: host.value, defaultColor: props.modelValue });
  picker.on('change', (color: string) => {
    lastEmitted = color;
    if (!syncing) emit('update:modelValue', color);
  });
});

// 外部 modelValue 变化时回写实例，syncing 标记防止事件回流形成循环
watch(
  () => props.modelValue,
  (value) => {
    if (!picker || value === lastEmitted) return;

    syncing = true;
    lastEmitted = value;
    picker.setColor(value);
    syncing = false;
  }
);

onBeforeUnmount(() => {
  picker?.destroy();
  picker = null;
});
</script>

<template>
  <div ref="host"></div>
</template>
