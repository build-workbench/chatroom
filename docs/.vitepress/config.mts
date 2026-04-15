import { defineConfig } from 'vitepress'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'chatroom'
const base = process.env.GITHUB_ACTIONS === 'true' ? `/${repoName}/` : '/'
const siteUrl = `https://lessup.github.io/${repoName}/`

export default defineConfig({
  lang: 'zh-CN',
  title: 'ChatRoom 教学文档',
  description: '面向练手与教学的 Go + React + WebSocket 聊天室文档站',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [/^http:\/\/localhost:\d+(?:\/.*)?$/],
  head: [
    ['link', { rel: 'canonical', href: siteUrl }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'ChatRoom 教学文档' }],
    ['meta', { property: 'og:description', content: '面向练手与教学的 Go + React + WebSocket 聊天室文档站' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'ChatRoom 教学文档' }],
    ['meta', { name: 'twitter:description', content: '面向练手与教学的 Go + React + WebSocket 聊天室文档站' }],
  ],
  themeConfig: {
    siteTitle: 'ChatRoom 教学文档',
    logo: '/logo.svg',
    nav: [
      { text: '快速开始', link: '/getting-started' },
      { text: 'API', link: '/API' },
      { text: '架构', link: '/ARCHITECTURE' },
      { text: '设计', link: '/DESIGN' },
      { text: 'FAQ', link: '/FAQ' },
    ],
    sidebar: [
      {
        text: '📖 入门指南',
        collapsed: false,
        items: [
          { text: '文档首页', link: '/' },
          { text: '快速开始', link: '/getting-started' },
          { text: '手动测试实验', link: '/manual-testing' },
          { text: '常见问题', link: '/FAQ' },
        ],
      },
      {
        text: '📚 核心文档',
        collapsed: false,
        items: [
          { text: 'API 文档', link: '/API' },
          { text: '架构文档', link: '/ARCHITECTURE' },
          { text: '设计文档', link: '/DESIGN' },
        ],
      },
      {
        text: '🔧 运维指南',
        collapsed: false,
        items: [
          { text: '监控指南', link: '/monitoring/README' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/LessUp/chatroom' },
    ],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    externalLinkIcon: true,
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    editLink: {
      pattern: 'https://github.com/LessUp/chatroom/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      message: '教学与练手优先，不做过度生产化设计',
      copyright: 'Copyright © 2025-2026 LessUp — MIT License',
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },
  },
})
