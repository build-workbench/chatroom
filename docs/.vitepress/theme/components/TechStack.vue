<template>
  <section class="tech-stack-section">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      <p class="section-subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="tech-categories">
      <div v-for="(category, index) in categories" :key="index" class="tech-category">
        <h3 class="category-title">{{ category.name }}</h3>
        <div class="tech-items">
          <div v-for="tech in category.techs" :key="tech.name" class="tech-item" :title="tech.name">
            <div class="tech-logo" v-html="tech.logo"></div>
            <span class="tech-name">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const title = ref('')
const subtitle = ref('')
const categories = ref([])

// SVG icons
const logos = {
  go: '<svg viewBox="0 0 24 24" fill="#00ADD8"><path d="M1.818 10.535c.95-1.717 2.69-2.87 4.693-2.87 2.12 0 3.79 1.17 4.66 2.84.22.43.38.89.47 1.36.03.17.05.34.05.52 0 .18-.02.35-.05.52-.09.47-.25.93-.47 1.36-.87 1.67-2.54 2.84-4.66 2.84-2.003 0-3.743-1.153-4.693-2.87A5.983 5.983 0 0 1 1 12c0-.715.125-1.4.353-2.036l.465-.429zM6.511 7.665c-1.19 0-2.26.53-2.99 1.36A4.044 4.044 0 0 0 2.91 12c.052.598.228 1.16.51 1.66.73.83 1.8 1.36 2.99 1.36 1.24 0 2.35-.58 3.08-1.47.41-.51.71-1.11.88-1.75.09-.35.14-.71.14-1.08 0-.37-.05-.73-.14-1.08a4.22 4.22 0 0 0-.88-1.75c-.73-.89-1.84-1.47-3.08-1.47zM17.183 10.535c.95-1.717 2.69-2.87 4.693-2.87 2.12 0 3.79 1.17 4.66 2.84.22.43.38.89.47 1.36.03.17.05.34.05.52 0 .18-.02.35-.05.52-.09.47-.25.93-.47 1.36-.87 1.67-2.54 2.84-4.66 2.84-2.003 0-3.743-1.153-4.693-2.87A5.983 5.983 0 0 1 16.365 12c0-.715.125-1.4.353-2.036l.465-.429zM21.876 7.665c-1.19 0-2.26.53-2.99 1.36-.282.5-.458 1.062-.51 1.66a4.044 4.044 0 0 0 .61 1.975c.73.83 1.8 1.36 2.99 1.36 1.24 0 2.35-.58 3.08-1.47.41-.51.71-1.11.88-1.75.09-.35.14-.71.14-1.08 0-.37-.05-.73-.14-1.08a4.22 4.22 0 0 0-.88-1.75c-.73-.89-1.84-1.47-3.08-1.47z"/></svg>',
  react: '<svg viewBox="0 0 24 24" fill="#61DAFB"><circle cx="12" cy="12" r="2"/><path d="M12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6m0-2C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" fill="none" stroke="#61DAFB" stroke-width="1"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" fill="none" stroke="#61DAFB" stroke-width="1"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" fill="none" stroke="#61DAFB" stroke-width="1"/></svg>',
  typescript: '<svg viewBox="0 0 24 24" fill="#3178C6"><path d="M3 3h18v18H3V3zm10.71 13.29v1.85c.3.15.66.27 1.05.35.4.08.81.12 1.25.12.42 0 .8-.04 1.15-.13.35-.09.65-.22.9-.4.25-.18.45-.41.59-.68.14-.27.21-.59.21-.95 0-.27-.04-.51-.13-.71a1.6 1.6 0 0 0-.35-.52 2.1 2.1 0 0 0-.52-.38c-.2-.1-.41-.2-.65-.29l-.55-.21c-.19-.07-.35-.14-.47-.21a.72.72 0 0 1-.27-.22.5.5 0 0 1-.09-.29c0-.11.02-.2.07-.28.05-.08.12-.14.21-.19.09-.05.2-.08.32-.11.12-.02.25-.04.39-.04.13 0 .27.01.42.03.15.02.3.06.45.11.15.05.3.12.44.2.14.08.27.18.38.29v-1.73a4.5 4.5 0 0 0-.88-.29 4.65 4.65 0 0 0-1.01-.11c-.41 0-.79.05-1.13.14-.34.09-.64.23-.89.41-.25.18-.45.41-.59.68-.14.27-.21.58-.21.94 0 .46.13.85.38 1.16.25.32.64.57 1.15.77l.55.21c.2.08.37.15.51.22.14.07.25.15.33.23.08.08.14.17.17.27.03.1.05.21.05.33 0 .12-.03.23-.08.33-.05.1-.13.18-.23.25-.1.07-.22.12-.37.15-.15.03-.32.05-.51.05-.34 0-.67-.06-1-.17-.32-.11-.63-.28-.92-.51zm-4.16-3.47h1.7v7.02h-1.86V13.7l-2.04 3.14H6.35l2.06-3.14H5.5v-1.72h4.05z"/></svg>',
  vite: '<svg viewBox="0 0 24 24" fill="#646CFF"><path d="M12 2L2 19.8h20L12 2zm0 4l6 11H6l6-11z"/></svg>',
  tailwind: '<svg viewBox="0 0 24 24" fill="#06B6D4"><path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.09 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.51 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.49 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.51 12 7 12z"/></svg>',
  postgres: '<svg viewBox="0 0 24 24" fill="#336791"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="3"/></svg>',
  redis: '<svg viewBox="0 0 24 24" fill="#DC382D"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19.5 8 12 11.5 4.5 8 12 4.5zM4 9.5l7 3.5v6.5l-7-3.5V9.5zm9 10v-6.5l7-3.5v6.5L13 19.5z"/></svg>',
  docker: '<svg viewBox="0 0 24 24" fill="#2496ED"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.186.186.186zm5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/></svg>',
  kubernetes: '<svg viewBox="0 0 24 24" fill="#326CE5"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.2l7 3.5-7 3.5-7-3.5 7-3.5zM4 9.3l7 3.5V19l-7-3.5V9.3zm9 9.7v-6.2l7-3.5v6.2L13 19z"/></svg>',
  prometheus: '<svg viewBox="0 0 24 24" fill="#E6522C"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>',
  grafana: '<svg viewBox="0 0 24 24" fill="#F46800"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>',
}

onMounted(() => {
  const lang = document.documentElement.lang || 'en'
  const isZh = lang.startsWith('zh')
  
  if (isZh) {
    title.value = '技术栈'
    subtitle.value = '现代、成熟、生产级技术选型'
    categories.value = [
      { name: '后端', techs: [
        { name: 'Go', logo: logos.go },
        { name: 'Gin', logo: logos.go },
        { name: 'GORM', logo: logos.go },
        { name: 'WebSocket', logo: logos.go },
      ]},
      { name: '前端', techs: [
        { name: 'React', logo: logos.react },
        { name: 'TypeScript', logo: logos.typescript },
        { name: 'Vite', logo: logos.vite },
        { name: 'Tailwind', logo: logos.tailwind },
      ]},
      { name: '数据库', techs: [
        { name: 'PostgreSQL', logo: logos.postgres },
        { name: 'Redis', logo: logos.redis },
      ]},
      { name: '部署', techs: [
        { name: 'Docker', logo: logos.docker },
        { name: 'Kubernetes', logo: logos.kubernetes },
        { name: 'Prometheus', logo: logos.prometheus },
        { name: 'Grafana', logo: logos.grafana },
      ]},
    ]
  } else {
    title.value = 'Tech Stack'
    subtitle.value = 'Modern, proven, production-ready technologies'
    categories.value = [
      { name: 'Backend', techs: [
        { name: 'Go', logo: logos.go },
        { name: 'Gin', logo: logos.go },
        { name: 'GORM', logo: logos.go },
        { name: 'WebSocket', logo: logos.go },
      ]},
      { name: 'Frontend', techs: [
        { name: 'React', logo: logos.react },
        { name: 'TypeScript', logo: logos.typescript },
        { name: 'Vite', logo: logos.vite },
        { name: 'Tailwind', logo: logos.tailwind },
      ]},
      { name: 'Database', techs: [
        { name: 'PostgreSQL', logo: logos.postgres },
        { name: 'Redis', logo: logos.redis },
      ]},
      { name: 'Deployment', techs: [
        { name: 'Docker', logo: logos.docker },
        { name: 'Kubernetes', logo: logos.kubernetes },
        { name: 'Prometheus', logo: logos.prometheus },
        { name: 'Grafana', logo: logos.grafana },
      ]},
    ]
  }
})
</script>

<style scoped>
.tech-stack-section {
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

.tech-categories {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

@media (max-width: 1024px) {
  .tech-categories {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .tech-categories {
    grid-template-columns: 1fr;
  }
}

.tech-category {
  text-align: center;
}

.category-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tech-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.tech-item:hover {
  background: var(--vp-c-bg-soft);
}

.tech-logo {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-logo svg {
  width: 100%;
  height: 100%;
}

.tech-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
</style>
