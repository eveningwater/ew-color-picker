import { defineConfig } from 'vitepress'


const SITE = process.env.DOCS_SITE || 'https://eveningwater.github.io/ew-color-picker/'
const CLEAN = process.env.DOCS_CLEAN_URLS !== 'false'

const BASE = process.env.DOCS_BASE || '/'

const GITHUB = 'https://github.com/eveningwater/ew-color-picker'

const joinUrl = (path: string) => `${SITE}${path.replace(/^\/+/, '')}`

const pageUrl = (path: string) =>
  joinUrl(!CLEAN && path && !path.endsWith('/') ? `${path}.html` : path)

const CN_MIRROR = 'https://ew-color-picker.eveningwater.com/'

const zhNav = [
  { text: '指南', link: '/zh/guide/', activeMatch: '/zh/guide/' },
  { text: 'API', link: '/zh/api/options', activeMatch: '/zh/api/' },
  { text: '插件', link: '/zh/plugins/', activeMatch: '/zh/plugins/' },
  { text: '示例', link: '/zh/examples/', activeMatch: '/zh/examples/' },
  { text: '更新日志', link: '/zh/guide/changelog', activeMatch: '/zh/guide/changelog' },
  { text: '框架集成', link: '/zh/guide/framework-integration', activeMatch: '/zh/guide/framework-integration' },
  { text: '在线演示', link: '/zh/examples/demo', activeMatch: '/zh/examples/demo' },
  { text: '国内访问', link: `${CN_MIRROR}zh/`, target: '_blank', rel: 'noopener' },
  { text: '其他项目', link: 'https://www.eveningwater.com', target: '_blank', rel: 'noopener' },
]

const enNav = [
  { text: 'Guide', link: '/guide/', activeMatch: '/guide/' },
  { text: 'API', link: '/api/options', activeMatch: '/api/' },
  { text: 'Plugins', link: '/plugins/', activeMatch: '/plugins/' },
  { text: 'Examples', link: '/examples/', activeMatch: '/examples/' },
  { text: 'Changelog', link: '/guide/changelog', activeMatch: '/guide/changelog' },
  { text: 'Frameworks', link: '/guide/framework-integration', activeMatch: '/guide/framework-integration' },
  { text: 'Live Demo', link: '/examples/demo', activeMatch: '/examples/demo' },
  { text: 'China Site', link: `${CN_MIRROR}`, target: '_blank', rel: 'noopener' },
  { text: 'More Projects', link: 'https://www.eveningwater.com', target: '_blank', rel: 'noopener' },
]

const zhSidebar = {
  '/zh/guide/': [
    {
      text: '开始',
      items: [
        { text: '项目介绍', link: '/zh/guide/' },
        { text: '竞品对比与定位', link: '/zh/guide/comparison' },
        { text: '安装', link: '/zh/guide/installation' },
        { text: '快速开始', link: '/zh/guide/getting-started' },
        { text: '核心概念', link: '/zh/guide/concepts' },
        { text: '编写自定义插件', link: '/zh/guide/plugin-dev' },
        { text: '框架集成', link: '/zh/guide/framework-integration' },
        { text: '更新日志', link: '/zh/guide/changelog' },
      ],
    },
  ],
  '/zh/api/': [
    {
      text: 'API 参考',
      items: [
        { text: '配置项', link: '/zh/api/options' },
        { text: '实例方法', link: '/zh/api/methods' },
        { text: '事件', link: '/zh/api/events' },
        { text: '回调', link: '/zh/api/callbacks' },
        { text: '样式与类名', link: '/zh/api/styles' },
      ],
    },
  ],
  '/zh/plugins/': [
    {
      text: '插件',
      items: [
        { text: '插件总览', link: '/zh/plugins/' },
        { text: 'Box 颜色盒', link: '/zh/plugins/box' },
        { text: 'Panel 颜色面板', link: '/zh/plugins/panel' },
        { text: 'Hue 色相滑块', link: '/zh/plugins/hue' },
        { text: 'Alpha 透明度滑块', link: '/zh/plugins/alpha' },
        { text: 'Input 输入框', link: '/zh/plugins/input' },
        { text: 'InputNumber 数字输入框', link: '/zh/plugins/input-number' },
        { text: 'Button 按钮', link: '/zh/plugins/button' },
        { text: 'Predefine 预定义颜色', link: '/zh/plugins/predefine' },
        { text: 'ColorMode 颜色模式', link: '/zh/plugins/color-mode' },
        { text: 'Eyedropper 吸管', link: '/zh/plugins/eyedropper' },
        { text: 'CopyColor 复制颜色', link: '/zh/plugins/copy-color' },
        { text: 'Console 控制台', link: '/zh/plugins/console' },
      ],
    },
  ],
  '/zh/examples/': [
    {
      text: '示例',
      items: [
        { text: '示例索引', link: '/zh/examples/' },
        { text: '在线演示', link: '/zh/examples/demo' },
      ],
    },
  ],
}

const enSidebar = {
  '/guide/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/guide/' },
        { text: 'Comparison & Positioning', link: '/guide/comparison' },
        { text: 'Installation', link: '/guide/installation' },
        { text: 'Quick Start', link: '/guide/getting-started' },
        { text: 'Core Concepts', link: '/guide/concepts' },
        { text: 'Writing a Plugin', link: '/guide/plugin-dev' },
        { text: 'Framework Integration', link: '/guide/framework-integration' },
        { text: 'Changelog', link: '/guide/changelog' },
      ],
    },
  ],
  '/api/': [
    {
      text: 'API Reference',
      items: [
        { text: 'Options', link: '/api/options' },
        { text: 'Methods', link: '/api/methods' },
        { text: 'Events', link: '/api/events' },
        { text: 'Callbacks', link: '/api/callbacks' },
        { text: 'Styles & Classes', link: '/api/styles' },
      ],
    },
  ],
  '/plugins/': [
    {
      text: 'Plugins',
      items: [
        { text: 'Overview', link: '/plugins/' },
        { text: 'Box', link: '/plugins/box' },
        { text: 'Panel', link: '/plugins/panel' },
        { text: 'Hue', link: '/plugins/hue' },
        { text: 'Alpha', link: '/plugins/alpha' },
        { text: 'Input', link: '/plugins/input' },
        { text: 'InputNumber', link: '/plugins/input-number' },
        { text: 'Button', link: '/plugins/button' },
        { text: 'Predefine', link: '/plugins/predefine' },
        { text: 'ColorMode', link: '/plugins/color-mode' },
        { text: 'Eyedropper', link: '/plugins/eyedropper' },
        { text: 'CopyColor', link: '/plugins/copy-color' },
        { text: 'Console', link: '/plugins/console' },
      ],
    },
  ],
  '/examples/': [
    {
      text: 'Examples',
      items: [
        { text: 'Index', link: '/examples/' },
        { text: 'Live Demo', link: '/examples/demo' },
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

  const cleanUrl = pageUrl(path)

  const isZh = path.startsWith('zh/')
  const zhPath = isZh ? path : `zh/${path}`
  const enPath = isZh ? path.replace(/^zh\//, '') : path

  const zhUrl = pageUrl(zhPath)
  const enUrl = pageUrl(enPath)

  const title = pageData.frontmatter?.title
    ? `${pageData.frontmatter.title} | ew-color-picker`
    : pageData.title || 'ew-color-picker'
  const description =
    pageData.frontmatter?.description ||
    pageData.description ||
    'Event-driven, plugin-based modern color picker with Hex / RGB / HSL support and alpha adjustment.'

  const head: any[] = [
    ['link', { rel: 'canonical', href: cleanUrl }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: zhUrl }],
    ['link', { rel: 'alternate', hreflang: 'en', href: enUrl }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: enUrl }],
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
        name: 'ew-color-picker',
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
  lang: 'en-US',
  title: 'ew-color-picker',
  titleTemplate: ':title | ew-color-picker',
  description:
    'Event-driven, plugin-based modern color picker with Hex / RGB / HSL support and alpha adjustment.',
  base: BASE,
  cleanUrls: CLEAN,
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
      label: 'English',
      lang: 'en-US',
      title: 'ew-color-picker',
      description:
        'Event-driven, plugin-based modern color picker with Hex / RGB / HSL support and alpha adjustment.',
      themeConfig: {
        logo: '/logo.svg',
        siteTitle: 'ew-color-picker',
        nav: enNav,
        sidebar: enSidebar,
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        lastUpdated: { text: 'Last updated' },
        search: enSearch,
        socialLinks: [{ icon: 'github', link: GITHUB }],
        footer: {
          message: `Released under the MIT License · <a href="${BASE}llms.txt">llms.txt</a> · <a href="${CN_MIRROR}" target="_blank" rel="noopener">China site</a> · <a href="https://www.eveningwater.com" target="_blank" rel="noopener">More projects</a>`,
          copyright: 'Copyright © 2024-present eveningwater',
        },
      },
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'ew-color-picker',
      description: '事件驱动 + 插件化的现代颜色选择器，支持 Hex / RGB / HSL 与透明度调节',
      themeConfig: {
        logo: '/logo.svg',
        siteTitle: 'ew-color-picker',
        nav: zhNav,
        sidebar: zhSidebar,
        outline: { level: [2, 3], label: '本页目录' },
        docFooter: { prev: '上一篇', next: '下一篇' },
        lastUpdated: { text: '最后更新' },
        search: zhSearch,
        socialLinks: [{ icon: 'github', link: GITHUB }],
        footer: {
          message: `基于 MIT 许可发布 · <a href="${BASE}llms.txt">llms.txt</a> · <a href="${CN_MIRROR}zh/" target="_blank" rel="noopener">国内访问</a> · <a href="https://www.eveningwater.com" target="_blank" rel="noopener">其他项目</a>`,
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
