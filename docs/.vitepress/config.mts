import { defineConfig } from 'vitepress'

const SITE = 'https://eveningwater.github.io/ew-color-picker/'

const BASE = process.env.DOCS_BASE || '/'

const GITHUB = 'https://github.com/eveningwater/ew-color-picker'

const joinUrl = (path: string) => `${SITE}${path.replace(/^\/+/, '')}`

const zhNav = [
  { text: '指南', link: '/guide/', activeMatch: '/guide/' },
  { text: 'API', link: '/api/options', activeMatch: '/api/' },
  { text: '插件', link: '/plugins/', activeMatch: '/plugins/' },
  { text: '示例', link: '/examples/', activeMatch: '/examples/' },
  { text: '在线演示', link: '/examples/demo', activeMatch: '/examples/demo' },
  { text: '其他项目', link: 'https://www.eveningwater.com', target: '_blank', rel: 'noopener' },
]

const enNav = [
  { text: 'Guide', link: '/en/guide/', activeMatch: '/en/guide/' },
  { text: 'API', link: '/en/api/options', activeMatch: '/en/api/' },
  { text: 'Plugins', link: '/en/plugins/', activeMatch: '/en/plugins/' },
  { text: 'Examples', link: '/en/examples/', activeMatch: '/en/examples/' },
  { text: 'Live Demo', link: '/en/examples/demo', activeMatch: '/en/examples/demo' },
  { text: 'More Projects', link: 'https://www.eveningwater.com', target: '_blank', rel: 'noopener' },
]

const zhSidebar = {
  '/guide/': [
    {
      text: '开始',
      items: [
        { text: '项目介绍', link: '/guide/' },
        { text: '竞品对比与定位', link: '/guide/comparison' },
        { text: '安装', link: '/guide/installation' },
        { text: '快速开始', link: '/guide/getting-started' },
        { text: '核心概念', link: '/guide/concepts' },
        { text: '编写自定义插件', link: '/guide/plugin-dev' },
        { text: '框架集成', link: '/guide/framework-integration' },
      ],
    },
  ],
  '/api/': [
    {
      text: 'API 参考',
      items: [
        { text: '配置项', link: '/api/options' },
        { text: '实例方法', link: '/api/methods' },
        { text: '事件', link: '/api/events' },
        { text: '回调', link: '/api/callbacks' },
        { text: '样式与类名', link: '/api/styles' },
      ],
    },
  ],
  '/plugins/': [
    {
      text: '插件',
      items: [
        { text: '插件总览', link: '/plugins/' },
        { text: 'Box 颜色盒', link: '/plugins/box' },
        { text: 'Panel 颜色面板', link: '/plugins/panel' },
        { text: 'Hue 色相滑块', link: '/plugins/hue' },
        { text: 'Alpha 透明度滑块', link: '/plugins/alpha' },
        { text: 'Input 输入框', link: '/plugins/input' },
        { text: 'InputNumber 数字输入框', link: '/plugins/input-number' },
        { text: 'Button 按钮', link: '/plugins/button' },
        { text: 'Predefine 预定义颜色', link: '/plugins/predefine' },
        { text: 'ColorMode 颜色模式', link: '/plugins/color-mode' },
        { text: 'Console 控制台', link: '/plugins/console' },
      ],
    },
  ],
  '/examples/': [
    {
      text: '示例',
      items: [
        { text: '示例索引', link: '/examples/' },
        { text: '在线演示', link: '/examples/demo' },
      ],
    },
  ],
}

const enSidebar = {
  '/en/guide/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/en/guide/' },
        { text: 'Comparison & Positioning', link: '/en/guide/comparison' },
        { text: 'Installation', link: '/en/guide/installation' },
        { text: 'Quick Start', link: '/en/guide/getting-started' },
        { text: 'Core Concepts', link: '/en/guide/concepts' },
        { text: 'Writing a Plugin', link: '/en/guide/plugin-dev' },
        { text: 'Framework Integration', link: '/en/guide/framework-integration' },
      ],
    },
  ],
  '/en/api/': [
    {
      text: 'API Reference',
      items: [
        { text: 'Options', link: '/en/api/options' },
        { text: 'Methods', link: '/en/api/methods' },
        { text: 'Events', link: '/en/api/events' },
        { text: 'Callbacks', link: '/en/api/callbacks' },
        { text: 'Styles & Classes', link: '/en/api/styles' },
      ],
    },
  ],
  '/en/plugins/': [
    {
      text: 'Plugins',
      items: [
        { text: 'Overview', link: '/en/plugins/' },
        { text: 'Box', link: '/en/plugins/box' },
        { text: 'Panel', link: '/en/plugins/panel' },
        { text: 'Hue', link: '/en/plugins/hue' },
        { text: 'Alpha', link: '/en/plugins/alpha' },
        { text: 'Input', link: '/en/plugins/input' },
        { text: 'InputNumber', link: '/en/plugins/input-number' },
        { text: 'Button', link: '/en/plugins/button' },
        { text: 'Predefine', link: '/en/plugins/predefine' },
        { text: 'ColorMode', link: '/en/plugins/color-mode' },
        { text: 'Console', link: '/en/plugins/console' },
      ],
    },
  ],
  '/en/examples/': [
    {
      text: 'Examples',
      items: [
        { text: 'Index', link: '/en/examples/' },
        { text: 'Live Demo', link: '/en/examples/demo' },
      ],
    },
  ],
}

const zhSearch = {
  provider: 'local' as const,
  options: {
    translations: {
      button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
      modal: {
        noResultsText: '没有找到相关结果',
        resetButtonTitle: '清除查询',
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
        },
      },
    },
  },
}

const enSearch = {
  provider: 'local' as const,
  options: {
    translations: {
      button: { buttonText: 'Search docs', buttonAriaLabel: 'Search docs' },
      modal: {
        noResultsText: 'No results found',
        resetButtonTitle: 'Reset search',
        footer: {
          selectText: 'Select',
          navigateText: 'Navigate',
          closeText: 'Close',
        },
      },
    },
  },
}

/**
 * 生成 canonical / hreflang / Open Graph 元信息
 */
function transformHead({ pageData }: any) {
  const relative = pageData.relativePath || 'index.md'
  const path = relative
    .replace(/(^|\/)index\.md$/, '$1')
    .replace(/\.md$/, '')

  const cleanUrl = joinUrl(path)

  const isEn = path.startsWith('en/')
  const zhPath = isEn ? path.replace(/^en\//, '') : path
  const enPath = isEn ? path : `en/${path}`

  const zhUrl = joinUrl(zhPath)
  const enUrl = joinUrl(enPath)

  const title = pageData.frontmatter?.title
    ? `${pageData.frontmatter.title} | EW Color Picker`
    : pageData.title || 'EW Color Picker'
  const description =
    pageData.frontmatter?.description ||
    pageData.description ||
    'Event-driven, plugin-based modern color picker with Hex / RGB / HSL support and alpha adjustment.'

  const head: any[] = [
    ['link', { rel: 'canonical', href: cleanUrl }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: zhUrl }],
    ['link', { rel: 'alternate', hreflang: 'en', href: enUrl }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: zhUrl }],
    ['meta', { property: 'og:url', content: cleanUrl }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
  ]

  if (path === '' || path === 'index') {
    head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'EW Color Picker',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        description:
          'Event-driven, plugin-based color picker. Supports Hex / RGB / HSL and alpha, i18n docs, and a plugin architecture.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        url: SITE,
        codeRepository: GITHUB,
        license: `${GITHUB}/blob/main/LICENSE`,
      }),
    ])
  }

  return head
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'EW Color Picker',
  titleTemplate: ':title | EW Color Picker',
  description: '事件驱动 + 插件化的现代颜色选择器，支持 Hex / RGB / HSL 与透明度调节',
  base: BASE,
  cleanUrls: true,
  outDir: '../gh-pages',
  sitemap: {
    hostname: SITE,
  },
  head: [
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { name: 'author', content: 'eveningwater' }],
    ['link', { rel: 'icon', href: `${BASE}logo.svg`, type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: `${BASE}logo.svg` }],
    ['meta', { name: 'robots', content: 'index, follow' }],
  ],
  transformHead,
  markdown: {
    lineNumbers: true,
    theme: { light: 'github-light', dark: 'github-dark' },
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'EW Color Picker',
      description: '事件驱动 + 插件化的现代颜色选择器，支持 Hex / RGB / HSL 与透明度调节',
      themeConfig: {
        logo: '/logo.svg',
        siteTitle: 'EW Color Picker',
        nav: zhNav,
        sidebar: zhSidebar,
        outline: { level: [2, 3], label: '本页目录' },
        docFooter: { prev: '上一篇', next: '下一篇' },
        lastUpdated: { text: '最后更新' },
        search: zhSearch,
        socialLinks: [{ icon: 'github', link: GITHUB }],
        footer: {
          message: `基于 MIT 许可发布 · <a href="${BASE}llms.txt">llms.txt</a> · <a href="https://www.eveningwater.com" target="_blank" rel="noopener">其他项目</a>`,
          copyright: 'Copyright © 2024-present eveningwater',
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'EW Color Picker',
      description:
        'Event-driven, plugin-based modern color picker with Hex / RGB / HSL support and alpha adjustment.',
      themeConfig: {
        logo: '/logo.svg',
        siteTitle: 'EW Color Picker',
        nav: enNav,
        sidebar: enSidebar,
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        lastUpdated: { text: 'Last updated' },
        search: enSearch,
        socialLinks: [{ icon: 'github', link: GITHUB }],
        footer: {
          message: `Released under the MIT License · <a href="${BASE}llms.txt">llms.txt</a> · <a href="https://www.eveningwater.com" target="_blank" rel="noopener">More projects</a>`,
          copyright: 'Copyright © 2024-present eveningwater',
        },
      },
    },
  },
  vite: {
    server: {
      fs: { allow: ['..'] },
    },
  },
})
