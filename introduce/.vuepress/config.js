const navZhConfig = require('./config/zh/navConfig.js');
const sidebarZhConfig = require('./config/zh/sidebarConfig.js');
const navEnConfig = require('./config/en/navConfig.js');
const sidebarEnConfig = require('./config/en/sidebarConfig.js');

module.exports = {
    dest: "./docs",
    base: "/ew-color-picker/",
    locales: {
        '/': {
            lang: 'en-US',
            title: 'ew-color-picker',
            description: 'A colorPicker plugin packaged based on native js'
        },
        '/zh/': {
            lang: 'zh-CN',
            title: 'ew-color-picker',
            description: '一个基于原生js而编写的颜色选择器'
        }
    },
    head: [
        ['link', {
            rel: 'icon',
            href: '/logo.png'
        }]
    ],
    themeConfig: {
        locales: {
            '/': {
                label: 'English',
                selectText: 'Languages',
                ariaLabel: 'Select language',
                editLinkText: 'Edit this page on GitHub',
                lastUpdated: 'Last Updated',
                nav: navEnConfig,
                sidebar: {
                    "/docs/introduce/": sidebarEnConfig.introduceSideBars,
                    "/docs/start/": sidebarEnConfig.getStartedSideBars,
                    "/docs/demo/": sidebarEnConfig.demoSideBars,
                    '/docs/api/': sidebarEnConfig.apiSideBars
                }
            },
            '/zh/': {
                label: '简体中文',
                selectText: '选择语言',
                ariaLabel: '选择语言',
                editLinkText: '在 GitHub 上编辑此页',
                lastUpdated: '上次更新',
                nav: navZhConfig,
                sidebar: {
                    "/zh/docs/introduce/": sidebarZhConfig.introduceSideBars,
                    "/zh/docs/start/": sidebarZhConfig.getStartedSideBars,
                    "/zh/docs/demo/": sidebarZhConfig.demoSideBars,
                    '/zh/docs/api/': sidebarZhConfig.apiSideBars
                }
            }
        }
    },
    plugins: {
        '@vuepress/plugin-back-to-top': true
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': '/'
            }
        }
    }
}