---
layout: home

hero:
  name: EW Color Picker
  text: Event-driven · Plugin-based Color Picker
  tagline: Small, composable, extensible. The core only owns color state and events — the UI is assembled from plugins.
  image:
    src: /logo.svg
    alt: EW Color Picker
  actions:
    - theme: brand
      text: Quick Start
      link: /en/guide/getting-started
    - theme: alt
      text: Live Demo
      link: /en/examples/demo
    - theme: alt
      text: API Reference
      link: /en/api/options

features:
  - icon: 🧩
    title: Plugin Architecture
    details: The core only keeps color state and an event bus. Box, Panel, Input, Button and friends are plugins you can register, drop, or extend freely.
  - icon: ⚡
    title: Event Driven
    details: An instance-level EventEmitter carries change / sure / clear / toggle through the whole lifecycle, keeping UI and business logic decoupled.
  - icon: 🎨
    title: Multiple Color Spaces
    details: Hex, RGB and HSL input modes built in, plus an alpha slider, predefined swatches and horizontal/vertical hue and alpha layouts.
  - icon: 📦
    title: Multi-package Distribution
    details: 13 independent packages. Install the all-in-one bundle or only the plugins you need — tree-shaking friendly by design.
  - icon: 🛡️
    title: Fully Typed
    details: Every package is written in TypeScript and ships declaration files. Options, plugin methods and callbacks are fully typed.
  - icon: 🌗
    title: Adaptive Details
    details: Box icons switch between light and dark based on WCAG relative luminance, mode icons keep a fixed width, and multiple instances stay isolated.
---

<div class="doc-section">
  <h2>Try it now</h2>
  <p class="subtitle">A real, running color picker rendered directly from the built artifacts.</p>
  <iframe class="demo-frame" src="../demo.html" title="EW Color Picker live demo" loading="lazy"></iframe>
</div>

<div class="doc-section">
  <h2>Start here</h2>
  <div class="doc-cards">
    <a class="doc-card" href="./guide/getting-started">
      <h3>5-minute setup</h3>
      <p>Install, import the styles, create an instance — three steps to your first picker.</p>
    </a>
    <a class="doc-card" href="./api/options">
      <h3>Options reference</h3>
      <p>Every constructor option, plugin switch, callback and default value.</p>
    </a>
    <a class="doc-card" href="./plugins/">
      <h3>Plugin system</h3>
      <p>What each of the 10 built-in plugins does, how to configure them, and how to compose them.</p>
    </a>
    <a class="doc-card" href="./guide/plugin-dev">
      <h3>Write a plugin</h3>
      <p>Follow the pluginName / applyOrder contract to build a registrable, destroyable plugin.</p>
    </a>
  </div>
</div>

<div class="doc-section">
  <h2>Minimal example</h2>
  <p class="subtitle">One container, one stylesheet, one constructor call.</p>
</div>

```html
<link rel="stylesheet" href="@ew-color-picker/style/dist/index.css" />
<link rel="stylesheet" href="@ew-color-picker/style/dist/input-number.css" />

<div id="picker"></div>

<script type="module">
  import ewColorPicker from '@ew-color-picker/ew-color-picker'

  const picker = new ewColorPicker({
    el: '#picker',
    defaultColor: '#6366f1',
    predefineColor: ['#6366f1', '#8b5cf6', '#06b6d4', '#22c55e'],
    changeColor(color) {
      console.log('Current color:', color)
    }
  })
</script>
```
