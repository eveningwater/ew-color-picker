import { createEffect, onCleanup, onMount } from 'solid-js';
import ewColorPicker from '@ew-color-picker/ew-color-picker';
import '@ew-color-picker/style/dist/index.css';
import '@ew-color-picker/style/dist/input-number.css';

interface ColorFieldProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorField(props: ColorFieldProps) {
  let host: HTMLDivElement | undefined;
  let picker: ewColorPicker | null = null;
  let syncing = false;
  let lastEmitted = props.value;

  onMount(() => {
    if (!host) return;

    picker = new ewColorPicker({ el: host, defaultColor: props.value });
    picker.on('change', (color: string) => {
      lastEmitted = color;
      if (!syncing) props.onChange(color);
    });
  });

  // 外部 value 变化时回写实例，syncing 标记防止事件回流形成循环
  createEffect(() => {
    const value = props.value;
    if (!picker || value === lastEmitted) return;

    syncing = true;
    lastEmitted = value;
    picker.setColor(value);
    syncing = false;
  });

  onCleanup(() => {
    picker?.destroy();
    picker = null;
  });

  return <div ref={host} />;
}
