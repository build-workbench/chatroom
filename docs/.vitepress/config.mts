import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import llmstxt from 'vitepress-plugin-llms'

// 环境变量驱动的 base path 配置（GitHub Pages 子路径）
const rawBase = process.env.VITEPRESS_BASE ?? (
  process.env.GITHUB_ACTIONS === 'true'
    ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'chatroom'}/`
    : '/'
)
const base = rawBase.startsWith('/')
  ? rawBase.endsWith('/')
    ? rawBase
    : `${rawBase}/`
  : `/${rawBase}/`

const siteUrl = `https://lessup.github.io/chatroom/`

export default withMermaid(defineConfig({
  title: 'ChatRoom',
  description: '面向教学的实时聊天室技术白皮书',
  lang: 'zh-CN',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [/^http:\/\/localhost:\d+(?:\/.*)?$/],

  sitemap: {
    hostname: siteUrl,
  },

  head: [
    ['link', { rel: 'canonical', href: siteUrl }],
    ['meta', { name: 'theme-color', content: '#1e3a5f' }],
    ['meta', { name: 'author', content: 'LessUp' }],
    ['meta', { name: 'keywords', content: 'ChatRoom, Go, React, WebSocket, PostgreSQL, 实时聊天, 架构, 技术白皮书' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ChatRoom 技术白皮书' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:image', content: `${siteUrl}og-image.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}og-image.png` }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'icon', type: 'image/png', href: `${base}favicon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'manifest', href: `${base}manifest.json` }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }],
  ],

  markdown: {
    lineNumbers: true,
    theme: { light: 'github-light', dark: 'github-dark' },
  },

  mermaid: {
    startOnLoad: true,
    theme: 'default',
  },

  vite: {
    plugins: [llmstxt()],
  },

  themeConfig: {
    siteTitle: 'ChatRoom',
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/LessUp/chatroom' },
    ],
    externalLinkIcon: true,
    editLink: {
      pattern: 'https://github.com/LessUp/chatroom/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    nav: [
      { text: '白皮书', link: '/whitepaper/', activeMatch: '/whitepaper/' },
      { text: '架构', link: '/architecture/system', activeMatch: '/architecture/' },
      { text: '设计决策', link: '/decisions/', activeMatch: '/decisions/' },
      { text: '技术深度', link: '/deep-dives/performance/benchmarks', activeMatch: '/deep-dives/' },
      { text: 'API', link: '/api/rest', activeMatch: '/api/' },
      { text: '教程', link: '/tutorials/local-dev', activeMatch: '/tutorials/' },
    ],
    sidebar: [
      {
        text: '白皮书',
        collapsed: false,
        items: [
          { text: '执行摘要', link: '/whitepaper/index' },
          { text: '问题陈述', link: '/whitepaper/problem' },
          { text: '方案概述', link: '/whitepaper/solution' },
          { text: '技术架构', link: '/whitepaper/architecture' },
          { text: '关键决策', link: '/whitepaper/decisions' },
        ],
      },
      {
        text: '架构',
        collapsed: false,
        items: [
          { text: '系统架构', link: '/architecture/system' },
          { text: '数据流', link: '/architecture/data-flow' },
          { text: '数据模型', link: '/architecture/data-model' },
        ],
      },
      {
        text: '设计决策 (ADR)',
        collapsed: false,
        items: [
          { text: 'ADR-001 WebSocket 认证方案', link: '/decisions/001-ws-auth' },
          { text: 'ADR-002 Token Rotation 策略', link: '/decisions/002-token-rotation' },
          { text: 'ADR-003 分布式消息同步', link: '/decisions/003-distributed-sync' },
        ],
      },
      {
        text: '技术深度',
        collapsed: false,
        items: [
          { text: '性能基准', link: '/deep-dives/performance/benchmarks' },
          { text: '威胁模型', link: '/deep-dives/security/threat-model' },
          { text: '认证深度分析', link: '/deep-dives/security/auth-deep-dive' },
          { text: '水平扩展', link: '/deep-dives/scalability/horizontal' },
        ],
      },
      {
        text: 'API 参考',
        collapsed: false,
        items: [
          { text: 'REST API', link: '/api/rest' },
          { text: 'WebSocket 协议', link: '/api/websocket' },
        ],
      },
      {
        text: '教程',
        collapsed: false,
        items: [
          { text: '本地开发', link: '/tutorials/local-dev' },
          { text: '测试指南', link: '/tutorials/testing' },
          { text: '学习路径', link: '/tutorials/learning-path' },
          { text: '开发指南', link: '/tutorials/development-guide' },
        ],
      },
      {
        text: '参考',
        collapsed: true,
        items: [
          { text: '常见问题', link: '/reference/faq' },
          { text: '变更日志', link: '/reference/changelog' },
        ],
      },
    ],
    outline: { label: '本页目录' },
    docFooter: { prev: '上一页', next: '下一页' },
    footer: {
      message: '基于 MIT 许可证发布',
      copyright: 'Copyright © 2025-2026 LessUp',
    },
    lastUpdated: { text: '最后更新于' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
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
  },
}))
