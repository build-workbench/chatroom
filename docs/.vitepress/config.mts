import { defineConfig } from 'vitepress'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'chatroom'
const base = process.env.GITHUB_ACTIONS === 'true' ? `/${repoName}/` : '/'
const siteUrl = `https://lessup.github.io/${repoName}/`

export default defineConfig({
  lang: 'zh-CN',
  title: 'ChatRoom',
  description: '面向教学的 Go + React + WebSocket 实时聊天室 | A teaching-oriented real-time chat room with Go, React, WebSocket',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [/^http:\/\/localhost:\d+(?:\/.*)?$/],

  sitemap: {
    hostname: siteUrl,
  },

  head: [
    ['link', { rel: 'canonical', href: siteUrl }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'author', content: 'LessUp' }],
    ['meta', { name: 'keywords', content: 'ChatRoom, real-time chat, Go, React, WebSocket, PostgreSQL, teaching project, 教学项目, 聊天室' }],
    ['meta', { name: 'google-site-verification', content: '' }],

    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'ChatRoom Documentation' }],
    ['meta', { property: 'og:description', content: 'A teaching-oriented real-time chat room project with Go, React, PostgreSQL, and WebSocket' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:image', content: `${siteUrl}logo.svg` }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:locale:alternate', content: 'en_US' }],
    ['meta', { property: 'og:site_name', content: 'ChatRoom Documentation' }],

    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'ChatRoom Documentation' }],
    ['meta', { name: 'twitter:description', content: 'A teaching-oriented real-time chat room project with Go, React, PostgreSQL, and WebSocket' }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}logo.svg` }],

    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'apple-touch-icon', href: `${base}logo.svg` }],
  ],

  // Theme configuration
  themeConfig: {
    siteTitle: 'ChatRoom',
    logo: '/logo.svg',

    // Navigation - Will be overridden per locale
    nav: [
      { text: '快速开始', link: '/zh/getting-started' },
      { text: 'API', link: '/zh/api' },
      { text: '架构', link: '/zh/architecture' },
      { text: '设计', link: '/zh/design' },
      { text: 'FAQ', link: '/zh/faq' },
    ],

    // Sidebar - Will be overridden per locale
    sidebar: {
      '/zh/': [
        {
          text: '📖 入门指南',
          collapsed: false,
          items: [
            { text: '文档首页', link: '/zh/' },
            { text: '快速开始', link: '/zh/getting-started' },
            { text: '手动测试实验', link: '/zh/manual-testing' },
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
            { text: '监控指南', link: '/zh/monitoring/' },
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
      '/en/': [
        {
          text: '📖 Getting Started',
          collapsed: false,
          items: [
            { text: 'Home', link: '/en/' },
            { text: 'Getting Started', link: '/en/getting-started' },
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
            { text: 'Monitoring Guide', link: '/en/monitoring/' },
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

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/LessUp/chatroom' },
    ],

    // Search
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

    // Features
    externalLinkIcon: true,
    outline: {
      level: [2, 3],
      label: 'On this page',
    },
    docFooter: {
      prev: 'Previous Page',
      next: 'Next Page',
    },
    editLink: {
      pattern: 'https://github.com/LessUp/chatroom/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-2026 LessUp — MIT License',
    },

    // Labels
    returnToTopLabel: 'Return to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Theme',
    lightModeSwitchTitle: 'Switch to light mode',
    darkModeSwitchTitle: 'Switch to dark mode',
    lastUpdated: {
      text: 'Last updated',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },
  },

  // Markdown configuration
  markdown: {
    lineNumbers: false,
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },

  // Locale configuration for different languages
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '快速开始', link: '/zh/getting-started' },
          { text: 'API', link: '/zh/api' },
          { text: '架构', link: '/zh/architecture' },
          { text: '设计', link: '/zh/design' },
          { text: 'FAQ', link: '/zh/faq' },
        ],
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
          message: '基于 MIT 许可证发布。',
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
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '快速开始', link: '/zh/getting-started' },
          { text: 'API', link: '/zh/api' },
          { text: '架构', link: '/zh/architecture' },
          { text: '设计', link: '/zh/design' },
          { text: 'FAQ', link: '/zh/faq' },
        ],
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
          message: '基于 MIT 许可证发布。',
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
          { text: 'API', link: '/en/api' },
          { text: 'Architecture', link: '/en/architecture' },
          { text: 'Design', link: '/en/design' },
          { text: 'FAQ', link: '/en/faq' },
        ],
        outline: {
          level: [2, 3],
          label: 'On this page',
        },
        docFooter: {
          prev: 'Previous Page',
          next: 'Next Page',
        },
        editLink: {
          pattern: 'https://github.com/LessUp/chatroom/edit/master/docs/:path',
          text: 'Edit this page on GitHub',
        },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2025-2026 LessUp — MIT License',
        },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode',
        lastUpdated: {
          text: 'Last updated',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short',
          },
        },
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
})
