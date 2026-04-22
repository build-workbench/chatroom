import { defineConfig } from 'vitepress'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'chatroom'
const base = process.env.GITHUB_ACTIONS === 'true' ? `/${repoName}/` : '/'
const siteUrl = `https://lessup.github.io/${repoName}/`

export default defineConfig({
  // Core configuration
  title: 'ChatRoom',
  description: 'A teaching-oriented real-time chat application with Go, React, PostgreSQL, and WebSocket',
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
    // Basic
    ['link', { rel: 'canonical', href: siteUrl }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'author', content: 'LessUp' }],
    ['meta', { name: 'keywords', content: 'ChatRoom, Go, React, WebSocket, PostgreSQL, real-time chat, teaching project, 全栈教学, 聊天室' }],
    
    // Viewport
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ChatRoom Documentation' }],
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

  // Locale configuration
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '快速开始', link: '/zh/getting-started' },
          { text: '学习路径', link: '/zh/learning-path' },
          { text: 'API', link: '/zh/api' },
          { text: '架构', link: '/zh/architecture' },
        ],
        sidebar: {
          '/zh/': [
            {
              text: '📖 入门指南',
              collapsed: false,
              items: [
                { text: '快速开始', link: '/zh/getting-started' },
                { text: '学习路径', link: '/zh/learning-path' },
                { text: '手动测试', link: '/zh/manual-testing' },
                { text: '常见问题', link: '/zh/faq' },
              ],
            },
            {
              text: '📚 核心文档',
              collapsed: false,
              items: [
                { text: 'API 文档', link: '/zh/api' },
                { text: '架构文档', link: '/zh/architecture' },
                { text: '设计文档', link: '/zh/design' },
              ],
            },
            {
              text: '🔧 运维指南',
              collapsed: false,
              items: [
                { text: '监控指南', link: '/zh/monitoring/README' },
              ],
            },
            {
              text: '📋 项目规范',
              collapsed: true,
              items: [
                { text: '贡献指南', link: 'https://github.com/LessUp/chatroom/blob/master/CONTRIBUTING.md' },
                { text: '安全策略', link: 'https://github.com/LessUp/chatroom/blob/master/SECURITY.md' },
                { text: '变更日志', link: 'https://github.com/LessUp/chatroom/blob/master/CHANGELOG.md' },
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
          { text: 'Getting Started', link: '/en/getting-started' },
          { text: 'Learning Path', link: '/en/learning-path' },
          { text: 'API', link: '/en/api' },
          { text: 'Architecture', link: '/en/architecture' },
        ],
        sidebar: {
          '/en/': [
            {
              text: '📖 Getting Started',
              collapsed: false,
              items: [
                { text: 'Getting Started', link: '/en/getting-started' },
                { text: 'Learning Path', link: '/en/learning-path' },
                { text: 'Manual Testing', link: '/en/manual-testing' },
                { text: 'FAQ', link: '/en/faq' },
              ],
            },
            {
              text: '📚 Core Documentation',
              collapsed: false,
              items: [
                { text: 'API Documentation', link: '/en/api' },
                { text: 'Architecture', link: '/en/architecture' },
                { text: 'Design', link: '/en/design' },
              ],
            },
            {
              text: '🔧 Operations',
              collapsed: false,
              items: [
                { text: 'Monitoring Guide', link: '/en/monitoring/README' },
              ],
            },
            {
              text: '📋 Project Guidelines',
              collapsed: true,
              items: [
                { text: 'Contributing', link: 'https://github.com/LessUp/chatroom/blob/master/CONTRIBUTING.md' },
                { text: 'Security Policy', link: 'https://github.com/LessUp/chatroom/blob/master/SECURITY.md' },
                { text: 'Changelog', link: 'https://github.com/LessUp/chatroom/blob/master/CHANGELOG.md' },
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
})
