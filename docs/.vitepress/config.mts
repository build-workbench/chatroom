import { defineConfig } from 'vitepress'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'chatroom'
const base = process.env.GITHUB_ACTIONS === 'true' ? `/${repoName}/` : '/'

const zhNav = [
  { text: '开始学习', link: '/getting-started' },
  { text: '手动测试', link: '/manual-testing' },
  { text: 'API', link: '/API' },
  { text: '架构', link: '/ARCHITECTURE' },
  { text: 'FAQ', link: '/FAQ' },
]

const zhSidebar = [
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
]

const enNav = [
  { text: 'Start Here', link: '/en/getting-started' },
  { text: 'Manual Testing', link: '/en/manual-testing' },
  { text: 'API', link: '/en/API' },
  { text: 'Architecture', link: '/en/ARCHITECTURE' },
  { text: 'FAQ', link: '/en/FAQ' },
]

const enSidebar = [
  {
    text: 'Getting Started',
    items: [
      { text: 'Home', link: '/en/' },
      { text: 'Quick Start', link: '/en/getting-started' },
      { text: 'Manual Testing Lab', link: '/en/manual-testing' },
      { text: 'FAQ', link: '/en/FAQ' },
    ],
  },
  {
    text: 'Core Docs',
    items: [
      { text: 'API Reference', link: '/en/API' },
      { text: 'Architecture', link: '/en/ARCHITECTURE' },
      { text: 'Design', link: '/en/DESIGN' },
      { text: 'Monitoring', link: '/en/monitoring/README' },
    ],
  },
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'ChatRoom 教学文档',
  description: '面向练手与教学的 ChatRoom 在线文档站',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [/^http:\/\/localhost:\d+(?:\/.*)?$/],
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'ChatRoom 教学文档',
      description: '面向练手与教学的 ChatRoom 在线文档站',
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'ChatRoom Docs',
      description: 'A teaching-first documentation site for the ChatRoom project.',
    },
  },
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/LessUp/chatroom' },
    ],
    search: {
      provider: 'local',
    },
    externalLinkIcon: true,
    locales: {
      root: {
        label: '简体中文',
        siteTitle: 'ChatRoom 教学文档',
        nav: zhNav,
        sidebar: zhSidebar,
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
      en: {
        label: 'English',
        siteTitle: 'ChatRoom Docs',
        nav: enNav,
        sidebar: enSidebar,
        outline: {
          level: [2, 3],
          label: 'On this page',
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page',
        },
        editLink: {
          pattern: 'https://github.com/LessUp/chatroom/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },
        footer: {
          message: 'Teaching-first and practice-first, without unnecessary production complexity.',
          copyright: 'Copyright © 2025-2026 LessUp — MIT License',
        },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode',
      },
    },
  },
})
