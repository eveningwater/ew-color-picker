const navConfig = require('./config/navConfig.js')
const sidebarConfig = require('./config/sidebarConfig.js')

module.exports = {
    dest: "../docs",
    base: "/",
    head: [
        ['link', {
            rel: 'icon',
            href: '/logo.png'
        }]
    ],
    title: 'ew-color-picker颜色选择器', //网站的标题
    description: '一个基于原生js而编写的颜色选择器', //网站的描述
    themeConfig: {
        nav: navConfig,
        sidebar: sidebarConfig
    },
    plugins: {
        '@vuepress/back-to-top': true
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': '/'
            }
        }
    }
}