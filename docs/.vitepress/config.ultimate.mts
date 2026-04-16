import { defineConfig } from 'vitepress'
import { readFileSync } from 'fs'
import { join } from 'path'

// =============================================================================
// ULTIMATE VITEPRESS CONFIGURATION
// Version: 3.0.0 - Beast Mode Enabled
// =============================================================================

const repoOwner = 'LessUp'
const repoName = 'chatroom'
const base = process.env.GITHUB_ACTIONS === 'true' ? `/${repoName}/` : '/'
const siteUrl = `https://${repoOwner}.github.io/${repoName}/`

// Build mode detection
const isAggressive = process.env.VITE_OPTIMIZE === 'aggressive'
const localeFilter = process.env.VITE_LOCALE

// Head metadata factory
function createHead(lang: string): any[] {
  const isZh = lang === 'zh'
  const title = isZh ? 'ChatRoom 教学文档' : 'ChatRoom Documentation'
  const desc = isZh
    ? '面向练手与教学的 Go + React + WebSocket 聊天室文档站'
    : 'A teaching-oriented real-time chat room project with Go, React, PostgreSQL, and WebSocket'

  return [
    ['link', { rel: 'canonical', href: siteUrl }],
    ['meta', { name: 'theme-color', content: '#2563eb' }],
    ['meta', { name: 'author', content: repoOwner }],
    ['meta', { name: 'keywords', content: 'ChatRoom, real-time chat, Go, React, WebSocket, PostgreSQL, teaching project, 聊天室, 教学项目' }],
    
    // PWA
    ['link', { rel: 'manifest', href: `${base}manifest.json` }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    
    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: desc }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:image', content: `${siteUrl}og-image.png` }],
    ['meta', { property: 'og:locale', content: isZh ? 'zh_CN' : 'en_US' }],
    ['meta', { property: 'og:site_name', content: title }],
    
    // Twitter
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: desc }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}og-image.png` }],
    
    // Preconnect
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
    
    // Icons
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}logo.svg` }],
    ['link', { rel: 'apple-touch-icon', href: `${base}logo.svg` }],
    
    // Service Worker registration (injected via transform)
  ]
}

// Sidebar configurations
const sidebarZh = [
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
]

const sidebarEn = [
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
]

// =============================================================================
// MAIN CONFIGURATION
// =============================================================================
export default defineConfig({
  // Base settings
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [
    /^http:\/\/localhost:\d+(?:\/.*)?$/,
    /^https:\/\/github\.com\/LessUp\/chatroom\/edit/
  ],

  // Build optimization
  buildConcurrency: isAggressive ? 8 : 4,
  
  // Head
  head: createHead('en'),

  // Theme configuration
  themeConfig: {
    siteTitle: 'ChatRoom',
    logo: '/logo.svg',

    // Social links
    socialLinks: [
      { icon: 'github', link: `https://github.com/${repoOwner}/${repoName}` },
    ],

    // Search
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          searchOptions: {
            boost: { title: 4, text: 2, titles: 1 },
            fuzzy: 0.2,
            prefix: true,
          },
        },
        translations: {
          button: {
            buttonText: 'Search',
            buttonAriaLabel: 'Search documentation',
          },
          modal: {
            noResultsText: 'No results found',
            resetButtonTitle: 'Clear search',
            displayDetails: 'Show detailed results',
            footer: {
              selectText: 'to select',
              navigateText: 'to navigate',
              closeText: 'to close',
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
      prev: 'Previous',
      next: 'Next',
    },
    editLink: {
      pattern: `https://github.com/${repoOwner}/${repoName}/edit/master/docs/:path`,
      text: 'Edit this page',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} ${repoOwner}`,
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
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    },
  },

  // Markdown
  markdown: {
    lineNumbers: true,
    config: (md) => {
      // Add any custom markdown plugins here
    },
  },

  // Vite config
  vite: {
    build: {
      target: 'esnext',
      minify: isAggressive ? 'terser' : 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue'],
            'ui': [],
          },
        },
      },
      cssCodeSplit: true,
      sourcemap: !isAggressive,
    },
    optimizeDeps: {
      include: ['vue', '@vueuse/core'],
    },
    ssr: {
      noExternal: ['vitepress'],
    },
  },

  // =============================================================================
  // INTERNATIONALIZATION
  // =============================================================================
  locales: {
    root: {
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
        sidebar: sidebarZh,
        outline: { label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        editLink: { text: '在 GitHub 上编辑此页' },
        footer: { message: '基于 MIT 许可证发布。', copyright: `Copyright © ${new Date().getFullYear()} ${repoOwner}` },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        lastUpdated: { text: '最后更新于' },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
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
        sidebar: sidebarZh,
        outline: { label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        editLink: { text: '在 GitHub 上编辑此页' },
        footer: { message: '基于 MIT 许可证发布。', copyright: `Copyright © ${new Date().getFullYear()} ${repoOwner}` },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        lastUpdated: { text: '最后更新于' },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
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
        sidebar: sidebarEn,
        outline: { label: 'On this page' },
        docFooter: { prev: 'Previous', next: 'Next' },
        editLink: { text: 'Edit this page on GitHub' },
        footer: { message: 'Released under the MIT License.', copyright: `Copyright © ${new Date().getFullYear()} ${repoOwner}` },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode',
        lastUpdated: { text: 'Last updated' },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search documentation' },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Clear search',
                footer: { selectText: 'to select', navigateText: 'to navigate', closeText: 'to close' },
              },
            },
          },
        },
      },
    },
  },

  // =============================================================================
  // HOOKS & TRANSFORM
  // =============================================================================
  transformHtml: (code, id, context) => {
    // Inject service worker registration
    if (id.endsWith('index.html')) {
      const swScript = `
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }
</script>`
      return code.replace('</head>', `${swScript}</head>`)
    }
    return code
  },

  transformPageData: (pageData) => {
    // Add custom frontmatter processing
    return pageData
  },
})
