import { playgroundPresets } from './playground-presets.js'

const editorMount = document.getElementById('editor')
const selectMount = document.getElementById('preset-select')
const buttonMount = document.getElementById('reload-button')

let currentId = playgroundPresets[0].id
let editor = null

const iframeStyle = `
  body, html { height: 100%; overflow: hidden; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  .ew-iframe { width: 100%; height: 100%; border: none; overflow: hidden; }
`

const mount = () => {
  if (!editorMount || !window.EwIframeEditor) return
  editor?.destroy()
  const preset =
    playgroundPresets.find((item) => item.id === currentId) || playgroundPresets[0]
  editor = window.EwIframeEditor.createEditor({
    container: editorMount,
    code: { html: preset.html, css: preset.css, js: preset.js },
    iframeStyle,
  })
}

const createFallbackSelect = () => {
  const select = document.createElement('select')
  select.className = 'fallback-select'
  playgroundPresets.forEach((preset) => {
    const option = document.createElement('option')
    option.value = preset.id
    option.textContent = preset.label
    select.appendChild(option)
  })
  select.value = currentId
  select.addEventListener('change', () => {
    currentId = select.value
    mount()
  })
  selectMount.appendChild(select)
}

const createFallbackButton = () => {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = '重新加载'
  button.addEventListener('click', mount)
  buttonMount.appendChild(button)
}

const initControls = () => {
  if (window.Select && window.Select.Select) {
    const select = new window.Select.Select({
      items: playgroundPresets.map((preset) => ({
        label: preset.label,
        value: preset.id,
      })),
      value: currentId,
      size: 'small',
      clearable: false,
      onChange: (value) => {
        currentId = String(value)
        mount()
      },
    })
    selectMount.appendChild(select.getElement())
  } else {
    createFallbackSelect()
  }

  if (window.Button && window.Button.Button) {
    const button = new window.Button.Button({
      text: '重新加载',
      onClick: mount,
    })
    buttonMount.appendChild(button.getElement())
  } else {
    createFallbackButton()
  }
}

initControls()
mount()
