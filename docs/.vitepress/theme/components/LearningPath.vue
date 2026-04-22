<template>
  <section class="learning-paths-section">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="paths-grid">
      <div 
        v-for="(path, index) in paths" 
        :key="index"
        class="path-card"
        :class="`path-${index}`"
      >
        <div class="path-header">
          <div class="path-icon">{{ path.icon }}</div>
          <span class="path-badge">{{ path.duration }}</span>
        </div>
        
        <h3 class="path-title">{{ path.title }}</h3>
        <p class="path-description">{{ path.description }}</p>
        
        <ul class="path-steps">
          <li v-for="(step, stepIndex) in path.steps" :key="stepIndex">
            <span class="step-number">{{ stepIndex + 1 }}</span>
            <span class="step-text">{{ step }}</span>
          </li>
        </ul>
        
        <a :href="path.link" class="path-cta">
          {{ path.cta }}
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
const paths = ref([])

onMounted(() => {
  const lang = document.documentElement.lang || 'en'
  const isZh = lang.startsWith('zh')
  
  if (isZh) {
    title.value = '为你设计的学习路径'
    subtitle.value = '无论你的目标是后端、前端还是全栈，都有适合你的学习路线'
    paths.value = [
      {
        icon: '👨‍💻',
        title: '后端开发者',
        duration: '2-3 小时',
        description: '深入理解 Go 后端开发，从项目结构到部署运维',
        steps: [
          '项目结构与依赖设计',
          'GORM 数据库建模',
          'JWT 双 Token 实现',
          'WebSocket Hub 广播机制',
          'Docker & K8s 部署',
        ],
        link: '/zh/learning-path#backend',
        cta: '开始后端学习',
      },
      {
        icon: '👩‍💻',
        title: '前端开发者',
        duration: '1-2 小时',
        description: '掌握 React + TypeScript，实现实时交互界面',
        steps: [
          'API 接口概览与类型定义',
          'WebSocket 客户端封装',
          'React Hooks 状态管理',
          'Token 自动刷新机制',
          '实时聊天 UI 实现',
        ],
        link: '/zh/learning-path#frontend',
        cta: '开始前端学习',
      },
      {
        icon: '🎯',
        title: '全栈开发者',
        duration: '4-5 小时',
        description: '完整掌握前后端，独立开发部署全栈应用',
        steps: [
          '快速启动与项目概览',
          '代码走读与架构理解',
          '添加新功能实战',
          '编写单元与集成测试',
          '生产环境完整部署',
        ],
        link: '/zh/learning-path#fullstack',
        cta: '开始全栈学习',
      },
    ]
  } else {
    title.value = 'Learning Paths Designed For You'
    subtitle.value = "Whether your goal is backend, frontend, or full-stack, there's a path for you"
    paths.value = [
      {
        icon: '👨‍💻',
        title: 'Backend Developer',
        duration: '2-3 hours',
        description: 'Deep dive into Go backend development, from project structure to deployment',
        steps: [
          'Project structure & dependencies',
          'GORM database modeling',
          'JWT dual token implementation',
          'WebSocket Hub broadcasting',
          'Docker & K8s deployment',
        ],
        link: '/en/learning-path#backend',
        cta: 'Start Backend Path',
      },
      {
        icon: '👩‍💻',
        title: 'Frontend Developer',
        duration: '1-2 hours',
        description: 'Master React + TypeScript to build real-time interactive UIs',
        steps: [
          'API overview & type definitions',
          'WebSocket client wrapper',
          'React Hooks state management',
          'Token auto-refresh mechanism',
          'Real-time chat UI implementation',
        ],
        link: '/en/learning-path#frontend',
        cta: 'Start Frontend Path',
      },
      {
        icon: '🎯',
        title: 'Full-Stack Developer',
        duration: '4-5 hours',
        description: 'Complete mastery of both frontend and backend for independent development',
        steps: [
          'Quick start & project overview',
          'Code walkthrough & architecture',
          'Add new features hands-on',
          'Write unit & integration tests',
          'Production deployment',
        ],
        link: '/en/learning-path#fullstack',
        cta: 'Start Full-Stack Path',
      },
    ]
  }
})
</script>

<style scoped>
.learning-paths-section {
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

.paths-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .paths-grid {
    grid-template-columns: 1fr;
  }
}

.path-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.path-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 2px;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.path-0::before {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}

.path-1::before {
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
}

.path-2::before {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.path-card:hover {
  transform: translateY(-4px);
  border-color: transparent;
}

.path-card:hover::before {
  opacity: 1;
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.path-icon {
  font-size: 2.5rem;
  line-height: 1;
}

.path-badge {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border-radius: 9999px;
}

.path-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.path-description {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.path-steps {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  flex-grow: 1;
}

.path-steps li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.path-steps li:last-child {
  border-bottom: none;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  background: rgba(37, 99, 235, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
}

.step-text {
  font-size: 0.9375rem;
  color: var(--vp-c-text-2);
}

.path-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: auto;
}

.path-0 .path-cta {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}

.path-1 .path-cta {
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
}

.path-2 .path-cta {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.path-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.path-cta svg {
  width: 1.125rem;
  height: 1.125rem;
}
</style>
