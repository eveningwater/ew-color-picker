import {
  createElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from 'react'
import ewColorPicker from '@ew-color-picker/ew-color-picker'
import type { ewColorPickerOptions } from '@ew-color-picker/core'

export interface EwColorPickerReactProps {
  /** ew-color-picker options. `el` is controlled by the wrapper. */
  options?: ewColorPickerOptions
  /** Controlled color value. */
  value?: string
  onChange?: (color: string) => void
  onSure?: (color: string) => void
  onClear?: () => void
  onToggle?: (open: boolean) => void
  onModeChange?: (mode: string) => void
  className?: string
  style?: CSSProperties
}

export interface EwColorPickerRef {
  getColor(): string | undefined
  setColor(color: string): void
  openPicker(): void
  closePicker(): void
  getInstance(): ewColorPicker | null
}

/**
 * Thin React wrapper around ew-color-picker.
 *
 * The wrapper owns the DOM node and the instance lifecycle; everything else
 * (options, color state, events) is forwarded to the core picker.
 */
export const EwColorPicker = forwardRef<
  EwColorPickerRef,
  EwColorPickerReactProps
>(function EwColorPicker(
  {
    options,
    value,
    onChange,
    onSure,
    onClear,
    onToggle,
    onModeChange,
    className,
    style,
  },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null)
  const pickerRef = useRef<ewColorPicker | null>(null)
  // Keep the latest callbacks without re-creating the picker on every render.
  const handlers = useRef({ onChange, onSure, onClear, onToggle, onModeChange })
  handlers.current = { onChange, onSure, onClear, onToggle, onModeChange }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const { changeColor, ...rest } = options || {}
    const picker = new ewColorPicker({
      ...rest,
      el: host,
      defaultColor: value || rest.defaultColor || '',
      changeColor: (color: string) => {
        if (typeof changeColor === 'function') changeColor(color)
        handlers.current.onChange?.(color)
      },
    })
    pickerRef.current = picker
    picker.on('sure', (color: string) => handlers.current.onSure?.(color))
    picker.on('clear', () => handlers.current.onClear?.())
    picker.on('toggle', (open: boolean) => handlers.current.onToggle?.(open))
    picker.on('mode-change', (mode: string) =>
      handlers.current.onModeChange?.(mode),
    )

    return () => {
      picker.destroy()
      pickerRef.current = null
    }
    // `options` and `value` are read once on mount; later changes are synced
    // through the dedicated effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (pickerRef.current && value && pickerRef.current.getColor() !== value) {
      pickerRef.current.setColor(value)
    }
  }, [value])

  useImperativeHandle(
    ref,
    () => ({
      getColor: () => pickerRef.current?.getColor(),
      setColor: (color: string) => pickerRef.current?.setColor(color),
      openPicker: () => pickerRef.current?.openPicker(),
      closePicker: () => pickerRef.current?.closePicker(),
      getInstance: () => pickerRef.current,
    }),
    [],
  )

  return createElement('div', { ref: hostRef, className, style })
})

export default EwColorPicker
