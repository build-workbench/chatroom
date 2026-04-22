<template>
  <section class="features-section">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="features-grid">
      <div 
        v-for="(feature, index) in features" 
        :key="index"
        class="feature-card"
        :class="{ 'highlight': feature.highlight }"
      >
        <div class="feature-icon">{{ feature.icon }}</div>
        <h3 class="feature-title">{{ feature.title }}</h3>
        <p class="feature-description">{{ feature.description }}</p>
        <a v-if="feature.link" :href="feature.link" class="feature-link">
          {{ feature.linkText }}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const title = ref('')
const subtitle = ref('')
const features = ref([])

onMounted(() => {
  const lang = document.documentElement.lang || 'en'
  const isZh = lang.startsWith('zh')
  
  if (isZh) {
    title.value = '核心特性'
    subtitle.value = '不仅仅是功能，更是工程化的最佳实践'
    features.value = [
      {
        icon: '🚀',
        title: '5 分钟快速启动',
        description: 'Docker Compose 一键启动，热重载开发服务器，零配置开始全栈开发之旅',
        link: '/zh/getting-started',
        linkText: '开始体验',
      },
      {
        icon: '🔐',
        title: 'JWT 双 Token 认证',
        description: 'Access + Refresh Token 完整实现，自动刷新、Token 轮换、安全登出',
        link: '/zh/api',
        linkText: '查看认证流程',
        highlight: true,
      },
      {
        icon: '⚡',
        title: 'WebSocket 实时通信',
        description: '房间级 Hub 广播、在线状态同步、输入提示、心跳保活',
        link: '/zh/architecture',
        linkText: '了解架构',
      },
      {
        icon: '📊',
        title: 'Prometheus 监控',
        description: '内置 HTTP 请求、WebSocket 连接、消息计数指标，配套 Grafana 仪表盘',
        link: '/zh/monitoring/README',
        linkText: '配置监控',
      },
      {
        icon: '🧪',
        title: '完整测试覆盖',
        description: 'Go 单元测试 + 集成测试，前端 Vitest 测试，CI 自动运行覆盖率报告',
        link: 'https://github.com/LessUp/chatroom/actions',
        linkText: '查看 CI',
      },
      {
        icon: '📦',
        title: '生产就绪部署',
        description: 'Docker 多阶段构建、Kubernetes 部署清单、健康检查、优雅停服',
        link: '/zh/design',
        linkText: '部署指南',
      },
    ]
  } else {
    title.value = 'Core Features'
    subtitle.value = 'Not just functionality, but engineering best practices'
    features.value = [
      {
        icon: '🚀',
        title: '5-Minute Setup',
        description: 'Docker Compose one-click setup, hot-reload dev server, zero-config full-stack development',
        link: '/en/getting-started',
        linkText: 'Get Started',
      },
      {
        icon: '🔐',
        title: 'JWT Dual Token Auth',
        description: 'Complete Access + Refresh Token implementation with auto-refresh, rotation, and secure logout',
        link: '/en/api',
        linkText: 'View Auth Flow',
        highlight: true,
      },
      {
        icon: '⚡',
        title: 'WebSocket Real-time',
        description: 'Room-based Hub broadcasting, presence sync, typing indicators, heartbeat keepalive',
        link: '/en/architecture',
        linkText: 'Learn Architecture',
      },
      {
        icon: '📊',
        title: 'Prometheus Metrics',
        description: 'Built-in HTTP, WebSocket, and message metrics with Grafana dashboard templates',
        link: '/en/monitoring/README',
        linkText: 'Setup Monitoring',
      },
      {
        icon: '🧪',
        title: 'Comprehensive Testing',
        description: 'Go unit + integration tests, frontend Vitest tests, CI automation with coverage',
        link: 'https://github.com/LessUp/chatroom/actions',
        linkText: 'View CI',
      },
      {
        icon: '📦',
        title: 'Production Ready',
        description: 'Docker multi-stage builds, Kubernetes manifests, health checks, graceful shutdown',
        link: '/en/design',
        linkText: 'Deployment Guide',
      },
    ]
  }
})
</script>

<style scoped>
.features-section {
  padding: 4rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}

.feature-card {
  position: relative;
  padding: 1.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.feature-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(124, 58, 237, 0.2));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(37, 99, 235, 0.12);
  border-color: transparent;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card.highlight {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(124, 58, 237, 0.05));
}

.feature-icon {
  font-size: 2.5rem;
  line-height: 1;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.feature-description {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  transition: gap 0.2s ease;
}

.feature-link:hover {
  gap: 0.625rem;
}

.feature-link svg {
  width: 1rem;
  height: 1rem;
}
</style>
