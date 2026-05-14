import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import llmstxt from 'vitepress-plugin-llms'

// 环境变量驱动的 base path 配置
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
  // Core configuration
  title: 'ChatRoom',
  description: 'Technical whitepaper for a teaching-oriented real-time chat application',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [/^http:\/\/localhost:\d+(?:\/.*)?$/],

  // Sitemap
  sitemap: {
    hostname: siteUrl,
  },

  // HTML head configuration
  head: [
    ['link', { rel: 'canonical', href: siteUrl }],
    ['meta', { name: 'theme-color', content: '#1e40af' }],
    ['meta', { name: 'author', content: 'LessUp' }],
    ['meta', { name: 'keywords', content: 'ChatRoom, Go, React, WebSocket, PostgreSQL, real-time chat, architecture, whitepaper, 技术白皮书, 架构' }],

    // Viewport
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ChatRoom Technical Whitepaper' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:image', content: `${siteUrl}og-image.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}og-image.png` }],

    // Icons
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'icon', type: 'image/png', href: `${base}favicon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'manifest', href: `${base}manifest.json` }],
  ],

  // Markdown configuration
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },

  // Mermaid configuration
  mermaid: {
    startOnLoad: true,
    theme: 'default',
  },

  // Vite plugins
  vite: {
    plugins: [llmstxt()],
  },

  // Locale configuration - 中文优先策略
  // root locale 映射到 '/' (中文)
  // en locale 映射到 '/en/' (英文)
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      // 不设置 link，root locale 默认映射到 '/'
      themeConfig: {
        nav: [
          { text: '架构', link: '/architecture/system', activeMatch: '/architecture/' },
          { text: '设计决策', link: '/decisions/', activeMatch: '/decisions/' },
          { text: '技术深度', link: '/deep-dives/performance/benchmarks', activeMatch: '/deep-dives/' },
          { text: 'API', link: '/api/rest', activeMatch: '/api/' },
          { text: '快速开始', link: '/getting-started' },
        ],
        sidebar: {
          '/': [
            {
              text: '入门',
              collapsed: false,
              items: [
                { text: '快速开始', link: '/getting-started' },
                { text: '学习路径', link: '/learning-path' },
                { text: '开发指南', link: '/development-guide' },
                { text: '手动测试', link: '/manual-testing' },
                { text: '常见问题', link: '/faq' },
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
              text: '运维',
              collapsed: false,
              items: [
                { text: '部署架构', link: '/operations/deployment' },
                { text: '监控与可观测性', link: '/operations/monitoring' },
              ],
            },
            {
              text: '项目',
              collapsed: true,
              items: [
                { text: '变更日志', link: '/release-notes/changelog' },
                { text: '贡献指南', link: 'https://github.com/LessUp/chatroom/blob/master/CONTRIBUTING.md' },
                { text: '安全策略', link: 'https://github.com/LessUp/chatroom/blob/master/SECURITY.md' },
              ],
            },
          ],
        },
        outline: { label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        editLink: { text: '在 GitHub 上编辑此页' },
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
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Architecture', link: '/en/architecture/system', activeMatch: '/en/architecture/' },
          { text: 'Design Decisions', link: '/en/decisions/', activeMatch: '/en/decisions/' },
          { text: 'Deep Dives', link: '/en/deep-dives/performance/benchmarks', activeMatch: '/en/deep-dives/' },
          { text: 'API', link: '/en/api/rest', activeMatch: '/en/api/' },
          { text: 'Getting Started', link: '/en/getting-started' },
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Getting Started',
              collapsed: false,
              items: [
                { text: 'Getting Started', link: '/en/getting-started' },
                { text: 'Learning Path', link: '/en/learning-path' },
                { text: 'Development Guide', link: '/en/development-guide' },
                { text: 'Manual Testing', link: '/en/manual-testing' },
                { text: 'FAQ', link: '/en/faq' },
              ],
            },
            {
              text: 'Architecture',
              collapsed: false,
              items: [
                { text: 'System Architecture', link: '/en/architecture/system' },
                { text: 'Data Flow', link: '/en/architecture/data-flow' },
                { text: 'Data Model', link: '/en/architecture/data-model' },
              ],
            },
            {
              text: 'Design Decisions (ADR)',
              collapsed: false,
              items: [
                { text: 'ADR-001 WebSocket Auth', link: '/en/decisions/001-ws-auth' },
                { text: 'ADR-002 Token Rotation', link: '/en/decisions/002-token-rotation' },
                { text: 'ADR-003 Distributed Sync', link: '/en/decisions/003-distributed-sync' },
              ],
            },
            {
              text: 'Deep Dives',
              collapsed: false,
              items: [
                { text: 'Performance Benchmarks', link: '/en/deep-dives/performance/benchmarks' },
                { text: 'Threat Model', link: '/en/deep-dives/security/threat-model' },
                { text: 'Auth Deep Dive', link: '/en/deep-dives/security/auth-deep-dive' },
                { text: 'Horizontal Scaling', link: '/en/deep-dives/scalability/horizontal' },
              ],
            },
            {
              text: 'API Reference',
              collapsed: false,
              items: [
                { text: 'REST API', link: '/en/api/rest' },
                { text: 'WebSocket Protocol', link: '/en/api/websocket' },
              ],
            },
            {
              text: 'Operations',
              collapsed: false,
              items: [
                { text: 'Deployment', link: '/en/operations/deployment' },
                { text: 'Monitoring & Observability', link: '/en/operations/monitoring' },
              ],
            },
            {
              text: 'Project',
              collapsed: true,
              items: [
                { text: 'Changelog', link: '/en/release-notes/changelog' },
                { text: 'Contributing', link: 'https://github.com/LessUp/chatroom/blob/master/CONTRIBUTING.md' },
                { text: 'Security Policy', link: 'https://github.com/LessUp/chatroom/blob/master/SECURITY.md' },
              ],
            },
          ],
        },
        outline: { label: 'On this page' },
        docFooter: { prev: 'Previous Page', next: 'Next Page' },
        editLink: { text: 'Edit this page on GitHub' },
        footer: {
          message: 'Released under the MIT License',
          copyright: 'Copyright © 2025-2026 LessUp',
        },
        lastUpdated: { text: 'Last updated' },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode',
        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: 'Search Documentation',
                buttonAriaLabel: 'Search Documentation',
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Clear query',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate',
                  closeText: 'Close',
                },
              },
            },
          },
        },
      },
    },
  },

  // Shared theme config
  themeConfig: {
    siteTitle: 'ChatRoom',
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/LessUp/chatroom' },
    ],
    externalLinkIcon: true,
    editLink: {
      pattern: 'https://github.com/LessUp/chatroom/edit/master/docs/:path',
    },
  },
}))
