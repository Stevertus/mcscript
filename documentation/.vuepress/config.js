module.exports = {
    title: 'mcscript',
    description: 'mcscript is a programming language for Minecraft.',
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }],
        ['link', { rel: 'manifest', href: '/manifest.json' }],
        ['meta', { name: 'theme-color', content: '#86d286' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
        ['link', { rel: 'apple-touch-icon', href: '/icons/icon-152x152.png' }],
        ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#86d286' }],
        ['meta', { name: 'msapplication-TileImage', content: '/icons/icon-144x144.png' }],
        ['meta', { name: 'msapplication-TileColor', content: '#1069b4' }],
        ['script', {}, "var lyra=window.lyra||[];lyra.push(['lyra_Id', '5d74e4e574d14']);"],
        ['script', { async: true, src: 'https://thelyra.pro/a/analytics.js' }],
    ],
    dest: "../docs",
    themeConfig: {
        sidebar: 'auto',
        logo: '/logo.png',
        lastUpdated: 'Last Updated',
        nav: [
            { text: 'Guide', link: '/guide/' },
            { text: 'CLI', link: '/cli/' },
            { text: 'File System', link: '/files/' },
            { text: 'Syntax', link: '/syntax/' },
            { text: 'IDEs', link: '/ides/' },
            
        ],
    },
    plugins: [
        '@vuepress/last-updated', ['@vuepress/pwa', {
            serviceWorker: true,
            updatePopup: true
        }]
    ],
}