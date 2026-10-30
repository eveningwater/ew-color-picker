---
layout: home

hero:
  name: ew-color-picker
  text: 事件驱动 · 插件化颜色选择器
  tagline: 体积小、可组合、可扩展。核心只管颜色与事件，界面交给插件自由拼装。
  image:
    src: /logo.svg
    alt: ew-color-picker
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 在线演示
      link: /examples/demo
    - theme: alt
      text: API 参考
      link: /api/options

features:
  - icon: 🧩
    title: 插件化架构
    details: Core 仅维护颜色状态与事件总线，Box、Panel、Input、Button 等全部以插件按需注册，可自由裁剪与扩展。
  - icon: ⚡
    title: 事件驱动
    details: 基于实例级 EventEmitter，change / sure / clear / toggle 等事件贯穿全流程，UI 与业务逻辑彻底解耦。
  - icon: 🎨
    title: 多色彩空间
    details: 内置 Hex、RGB、HSL 三种输入模式，支持透明度滑块、预定义色板与色相/透明度双方向布局。
  - icon: 📦
    title: 多包分发
    details: 13 个独立子包，既可一键引入聚合包，也可只安装需要的插件，天然支持 Tree Shaking。
  - icon: 🛡️
    title: 类型完备
    details: 全部包使用 TypeScript 编写并输出声明文件，配置项、插件方法、事件回调都有完整类型提示。
  - icon: 🌗
    title: 自适应细节
    details: 颜色盒图标依据 WCAG 相对亮度自动切换深浅，模式切换图标固定尺寸，多实例互不干扰。
---

<div class="doc-section">
  <h2>立即体验</h2>
  <p class="subtitle">下面是一个真实运行的颜色选择器，由本站直接加载构建产物渲染。</p>
  <iframe class="demo-frame" src="./demo.html" title="ew-color-picker 在线演示" loading="lazy"></iframe>
</div>

<div class="doc-section">
  <h2>从这里开始</h2>
  <div class="doc-cards">
    <a class="doc-card" href="./guide/getting-started">
      <h3>5 分钟上手</h3>
      <p>安装、引入样式、初始化实例，三步渲染出第一个颜色选择器。</p>
    </a>
    <a class="doc-card" href="./api/options">
      <h3>配置项速查</h3>
      <p>所有构造参数、插件开关、回调函数与默认值的完整说明。</p>
    </a>
    <a class="doc-card" href="./plugins/">
      <h3>插件体系</h3>
      <p>了解 10 个内置插件各自的职责、配置与方法，以及如何组合使用。</p>
    </a>
    <a class="doc-card" href="./guide/plugin-dev">
      <h3>自定义插件</h3>
      <p>按照 pluginName / applyOrder 约定，编写可注册、可销毁的插件。</p>
    </a>
  </div>
</div>

<div class="doc-section">
  <h2>最小示例</h2>
  <p class="subtitle">一个容器、一份样式、一行初始化，即可获得完整的取色体验。</p>
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
      console.log('当前颜色：', color)
    }
  })
</script>
```
