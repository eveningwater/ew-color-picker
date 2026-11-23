import { afterEach, describe, expect, it } from 'vitest'
import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { EwColorPicker, type EwColorPickerRef } from '../src/index'

;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

describe('@ew-color-picker/react', () => {
  let root: Root | null = null
  let host: HTMLDivElement

  afterEach(async () => {
    await act(async () => {
      root?.unmount()
    })
    root = null
    document.body.innerHTML = ''
  })

  function mount(props: Record<string, unknown>) {
    host = document.createElement('div')
    document.body.appendChild(host)
    root = createRoot(host)
    return act(async () => {
      root!.render(createElement(EwColorPicker, props))
    })
  }

  it('mounts the picker and exposes the ref API', async () => {
    const pickerRef = { current: null as EwColorPickerRef | null }
    await mount({
      ref: pickerRef,
      value: '#ff0000',
      options: { defaultColor: '#ff0000', panelMode: 'mini' },
    })

    expect(pickerRef.current?.getInstance()).toBeTruthy()
    expect(pickerRef.current?.getColor()).toBe('#ff0000')
    expect(host.querySelector('.ew-color-picker-panel-container')).toBeTruthy()
  })

  it('forwards color changes through onChange', async () => {
    const changes: string[] = []
    const pickerRef = { current: null as EwColorPickerRef | null }
    await mount({
      ref: pickerRef,
      value: '#ff0000',
      onChange: (color: string) => changes.push(color),
    })

    await act(async () => {
      pickerRef.current?.setColor('#00ff00')
    })

    expect(changes).toContain('#00ff00')
    expect(pickerRef.current?.getColor()).toBe('#00ff00')
  })
})
