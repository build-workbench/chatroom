import { defineConfig } from 'vitepress'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'chatroom'
const base = process.env.GITHUB_ACTIONS === 'true' ? `/${repoName}/` : '/'

export default defineConfig({
  lang: 'zh-CN',
  title: 'ChatRoom 教学文档',
  description: '面向练手与教学的 ChatRoom 在线文档站',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [/^http:\/\/localhost:\d+(?:\/.*)?$/],
  head: [
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'ChatRoom 教学文档' }],
    ['meta', { name: 'og:description', content: '面向练手与教学的 Go + React + WebSocket 聊天室文档站' }],
  ],
  themeConfig: {
    siteTitle: 'ChatRoom 教学文档',
    nav: [
      { text: '开始学习', link: '/getting-started' },
      { text: '手动测试', link: '/manual-testing' },
      { text: 'API', link: '/API' },
      { text: '架构', link: '/ARCHITECTURE' },
      { text: 'FAQ', link: '/FAQ' },
    ],
    sidebar: [
      {
        text: '入门',
        items: [
          { text: '文档首页', link: '/' },
          { text: '快速开始', link: '/getting-started' },
          { text: '手动测试实验', link: '/manual-testing' },
          { text: '常见问题', link: '/FAQ' },
        ],
      },
      {
        text: '核心文档',
        items: [
          { text: 'API 文档', link: '/API' },
          { text: '架构文档', link: '/ARCHITECTURE' },
          { text: '设计文档', link: '/DESIGN' },
          { text: '监控指南', link: '/monitoring/README' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/LessUp/chatroom' },
    ],
    search: {
      provider: 'local',
    },
    externalLinkIcon: true,
    outline: {
      level: [2, 3],
      label: '本页导航',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    editLink: {
      pattern: 'https://github.com/LessUp/chatroom/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      message: '教学与练手优先，不做过度生产化设计。',
      copyright: 'Copyright © 2025-2026 LessUp — MIT License',
    },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },
})
