import DefaultTheme from 'vitepress/theme'
import './custom.css'
import PlaygroundEntry from './components/PlaygroundEntry.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PlaygroundEntry', PlaygroundEntry)
  },
}
