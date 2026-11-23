import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type PropType,
} from 'vue'
import ewColorPicker from '@ew-color-picker/ew-color-picker'
import type { ewColorPickerOptions } from '@ew-color-picker/core'

export interface EwColorPickerVueProps {
  /** ew-color-picker options. `el` is controlled by the wrapper. */
  options?: ewColorPickerOptions
  /** Current color, used by `v-model`. */
  modelValue?: string
}

/**
 * Thin Vue 3 wrapper around ew-color-picker.
 *
 * The wrapper owns the DOM node and the instance lifecycle; everything else
 * (options, color state, events) is forwarded to the core picker.
 */
export const EwColorPicker = defineComponent({
  name: 'EwColorPicker',
  props: {
    options: {
      type: Object as PropType<ewColorPickerOptions>,
      default: () => ({}),
    },
    modelValue: {
      type: String as PropType<string | undefined>,
      default: undefined,
    },
  },
  emits: [
    'update:modelValue',
    'change',
    'sure',
    'clear',
    'toggle',
    'mode-change',
    'destroy',
  ],
  setup(props, { emit, expose }) {
    const host = ref<HTMLDivElement>()
    let picker: ewColorPicker | null = null

    onMounted(() => {
      if (!host.value) return
      const { changeColor, ...options } = props.options || {}
      picker = new ewColorPicker({
        ...options,
        el: host.value,
        defaultColor: props.modelValue || options.defaultColor || '',
        changeColor: (color: string) => {
          if (typeof changeColor === 'function') changeColor(color)
          emit('update:modelValue', color)
        },
      })
      picker.on('change', (color: string) => emit('change', color))
      picker.on('sure', (color: string) => emit('sure', color))
      picker.on('clear', () => emit('clear'))
      picker.on('toggle', (open: boolean) => emit('toggle', open))
      picker.on('mode-change', (mode: string) => emit('mode-change', mode))
      picker.on('destroy', () => emit('destroy'))
    })

    watch(
      () => props.modelValue,
      (value) => {
        if (picker && value && picker.getColor() !== value) {
          picker.setColor(value)
        }
      },
    )

    onBeforeUnmount(() => {
      picker?.destroy()
      picker = null
    })

    expose({
      getColor: () => picker?.getColor(),
      setColor: (color: string) => picker?.setColor(color),
      openPicker: () => picker?.openPicker(),
      closePicker: () => picker?.closePicker(),
      getInstance: () => picker,
    })

    return () => h('div', { ref: host })
  },
})

export default EwColorPicker
