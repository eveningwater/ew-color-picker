import { afterEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick, ref, type App } from 'vue'
import { EwColorPicker } from '../src/index'

describe('@ew-color-picker/vue', () => {
  const apps: App[] = []

  afterEach(() => {
    apps.forEach((app) => app.unmount())
    apps.length = 0
    document.body.innerHTML = ''
  })

  it('mounts the picker and exposes the instance API', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    let api: any

    const app = createApp({
      render: () =>
        h(EwColorPicker, {
          ref: (value: any) => {
            api = value
          },
          modelValue: '#ff0000',
          options: { defaultColor: '#ff0000', panelMode: 'mini' },
        }),
    })
    apps.push(app)
    app.mount(host)
    await nextTick()

    expect(api.getInstance()).toBeTruthy()
    expect(api.getColor()).toBe('#ff0000')
    expect(host.querySelector('.ew-color-picker-panel-container')).toBeTruthy()
  })

  it('syncs modelValue changes into the picker', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const color = ref('#ff0000')
    let api: any

    const app = createApp({
      render: () =>
        h(EwColorPicker, {
          ref: (value: any) => {
            api = value
          },
          modelValue: color.value,
        }),
    })
    apps.push(app)
    app.mount(host)
    await nextTick()

    color.value = '#00ff00'
    await nextTick()
    await nextTick()

    expect(api.getColor()).toBe('#00ff00')
  })
})
