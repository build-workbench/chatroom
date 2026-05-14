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
    ['meta', { name: 'theme-color', content: '#1e3a5f' }],
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

    // Fonts
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }],
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

  // Locale configuration - 中英文对称结构
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      themeConfig: {
        nav: [
          { text: '白皮书', link: '/zh/whitepaper/', activeMatch: '/zh/whitepaper/' },
          { text: '架构', link: '/zh/architecture/system', activeMatch: '/zh/architecture/' },
          { text: '设计决策', link: '/zh/decisions/', activeMatch: '/zh/decisions/' },
          { text: '技术深度', link: '/zh/deep-dives/performance/benchmarks', activeMatch: '/zh/deep-dives/' },
          { text: 'API', link: '/zh/api/rest', activeMatch: '/zh/api/' },
          { text: '教程', link: '/zh/tutorials/local-dev', activeMatch: '/zh/tutorials/' },
        ],
        sidebar: {
          '/zh/': [
            {
              text: '白皮书',
              collapsed: false,
              items: [
                { text: '执行摘要', link: '/zh/whitepaper/index' },
                { text: '问题陈述', link: '/zh/whitepaper/problem' },
                { text: '方案概述', link: '/zh/whitepaper/solution' },
                { text: '技术架构', link: '/zh/whitepaper/architecture' },
                { text: '关键决策', link: '/zh/whitepaper/decisions' },
              ],
            },
            {
              text: '架构',
              collapsed: false,
              items: [
                { text: '系统架构', link: '/zh/architecture/system' },
                { text: '数据流', link: '/zh/architecture/data-flow' },
                { text: '数据模型', link: '/zh/architecture/data-model' },
              ],
            },
            {
              text: '设计决策 (ADR)',
              collapsed: false,
              items: [
                { text: 'ADR-001 WebSocket 认证方案', link: '/zh/decisions/001-ws-auth' },
                { text: 'ADR-002 Token Rotation 策略', link: '/zh/decisions/002-token-rotation' },
                { text: 'ADR-003 分布式消息同步', link: '/zh/decisions/003-distributed-sync' },
              ],
            },
            {
              text: '技术深度',
              collapsed: false,
              items: [
                { text: '性能基准', link: '/zh/deep-dives/performance/benchmarks' },
                { text: '威胁模型', link: '/zh/deep-dives/security/threat-model' },
                { text: '认证深度分析', link: '/zh/deep-dives/security/auth-deep-dive' },
                { text: '水平扩展', link: '/zh/deep-dives/scalability/horizontal' },
              ],
            },
            {
              text: 'API 参考',
              collapsed: false,
              items: [
                { text: 'REST API', link: '/zh/api/rest' },
                { text: 'WebSocket 协议', link: '/zh/api/websocket' },
              ],
            },
            {
              text: '教程',
              collapsed: false,
              items: [
                { text: '本地开发', link: '/zh/tutorials/local-dev' },
                { text: '测试指南', link: '/zh/tutorials/testing' },
                { text: '学习路径', link: '/zh/tutorials/learning-path' },
                { text: '开发指南', link: '/zh/tutorials/development-guide' },
              ],
            },
            {
              text: '参考',
              collapsed: true,
              items: [
                { text: '常见问题', link: '/zh/reference/faq' },
                { text: '变更日志', link: '/zh/reference/changelog' },
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
          { text: 'Whitepaper', link: '/en/whitepaper/', activeMatch: '/en/whitepaper/' },
          { text: 'Architecture', link: '/en/architecture/system', activeMatch: '/en/architecture/' },
          { text: 'Decisions', link: '/en/decisions/', activeMatch: '/en/decisions/' },
          { text: 'Deep Dives', link: '/en/deep-dives/performance/benchmarks', activeMatch: '/en/deep-dives/' },
          { text: 'API', link: '/en/api/rest', activeMatch: '/en/api/' },
          { text: 'Tutorials', link: '/en/tutorials/local-dev', activeMatch: '/en/tutorials/' },
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Whitepaper',
              collapsed: false,
              items: [
                { text: 'Executive Summary', link: '/en/whitepaper/index' },
                { text: 'Problem Statement', link: '/en/whitepaper/problem' },
                { text: 'Solution Overview', link: '/en/whitepaper/solution' },
                { text: 'Architecture', link: '/en/whitepaper/architecture' },
                { text: 'Key Decisions', link: '/en/whitepaper/decisions' },
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
              text: 'Tutorials',
              collapsed: false,
              items: [
                { text: 'Local Development', link: '/en/tutorials/local-dev' },
                { text: 'Testing Guide', link: '/en/tutorials/testing' },
                { text: 'Learning Path', link: '/en/tutorials/learning-path' },
                { text: 'Development Guide', link: '/en/tutorials/development-guide' },
              ],
            },
            {
              text: 'Reference',
              collapsed: true,
              items: [
                { text: 'FAQ', link: '/en/reference/faq' },
                { text: 'Changelog', link: '/en/reference/changelog' },
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
