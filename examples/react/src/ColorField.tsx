import { useEffect, useRef } from 'react';
import ewColorPicker from '@ew-color-picker/ew-color-picker';
import '@ew-color-picker/style/dist/index.css';
import '@ew-color-picker/style/dist/input-number.css';

interface ColorFieldProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorField({ value, onChange }: ColorFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<ewColorPicker | null>(null);
  const syncingRef = useRef(false);
  const lastEmittedRef = useRef(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // 只创建一次实例，避免 React 重渲染时重复挂载
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const picker = new ewColorPicker({ el: host, defaultColor: value });
    pickerRef.current = picker;

    picker.on('change', (color: string) => {
      lastEmittedRef.current = color;
      if (!syncingRef.current) onChangeRef.current(color);
    });

    return () => {
      picker.destroy();
      pickerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 外部 value 变化时回写到实例，syncing 标记防止事件回流形成循环
  useEffect(() => {
    const picker = pickerRef.current;
    if (!picker || value === lastEmittedRef.current) return;

    syncingRef.current = true;
    lastEmittedRef.current = value;
    picker.setColor(value);
    syncingRef.current = false;
  }, [value]);

  return <div ref={hostRef} />;
}
