<template>
  <div class="hero-section">
    <div class="hero-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <div class="hero-content">
      <div class="hero-badge">
        <span class="badge-icon">🎓</span>
        <span class="badge-text">{{ isZh ? '教学项目' : 'Teaching Project' }}</span>
      </div>
      
      <h1 class="hero-title">
        <span class="gradient-text">{{ title }}</span>
      </h1>
      
      <p class="hero-subtitle">{{ subtitle }}</p>
      
      <div class="tech-stack-badges">
        <span class="tech-badge">Go</span>
        <span class="tech-badge">React</span>
        <span class="tech-badge">PostgreSQL</span>
        <span class="tech-badge">WebSocket</span>
      </div>
      
      <p class="hero-description">{{ description }}</p>
      
      <div class="hero-actions">
        <a :href="startLink" class="btn btn-primary">
          <span>{{ startButton }}</span>
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="https://github.com/LessUp/chatroom" class="btn btn-secondary" target="_blank" rel="noopener">
          <svg class="btn-icon-github" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span>GitHub</span>
        </a>
      </div>
    </div>
    
    <div class="hero-visual">
      <div class="chat-preview">
        <div class="chat-header">
          <div class="chat-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="chat-title">{{ isZh ? '聊天室' : 'ChatRoom' }}</span>
        </div>
        <div class="chat-messages">
          <div class="message received">
            <div class="avatar"></div>
            <div class="bubble">{{ msg1 }}</div>
          </div>
          <div class="message sent">
            <div class="bubble">{{ msg2 }}</div>
            <div class="avatar"></div>
          </div>
          <div class="message received">
            <div class="avatar"></div>
            <div class="bubble">{{ msg3 }}</div>
          </div>
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Safe initialization for SSR
const isZh = ref(false)

// Content strings
const title = ref('')
const subtitle = ref('')
const description = ref('')
const startButton = ref('')
const startLink = ref('')
const msg1 = ref('')
const msg2 = ref('')
const msg3 = ref('')

// Initialize on client side only
onMounted(() => {
  const lang = document.documentElement.lang || 'en'
  isZh.value = lang.startsWith('zh')
  
  if (isZh.value) {
    title.value = '用实战项目学会全栈开发'
    subtitle.value = '从零构建实时聊天室'
    description.value = '一个完整的 Go + React + WebSocket 项目，包含 JWT 认证、消息广播、PostgreSQL 存储、Prometheus 监控——从入门到部署的最佳实践'
    startButton.value = '开始学习'
    startLink.value = '/zh/getting-started'
    msg1.value = '这个项目结构很清晰！'
    msg2.value = 'WebSocket 实现很简洁 👍'
    msg3.value = '适合用来学习全栈开发'
  } else {
    title.value = 'Learn Full-Stack Development'
    subtitle.value = 'Build a Real-Time Chat Room from Scratch'
    description.value = 'A complete Go + React + WebSocket project with JWT auth, message broadcasting, PostgreSQL storage, and Prometheus monitoring—best practices from development to deployment'
    startButton.value = 'Start Learning'
    startLink.value = '/en/getting-started'
    msg1.value = 'The project structure is so clean!'
    msg2.value = 'WebSocket implementation is elegant 👍'
    msg3.value = 'Perfect for learning full-stack dev'
  }
})
</script>

<style scoped>
.hero-section {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: calc(100vh - 64px);
  padding: 2rem 24px;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  top: -100px;
  right: -100px;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
  bottom: -50px;
  left: 10%;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  top: 40%;
  left: -50px;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(37, 99, 235, 0.1);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 9999px;
  margin-bottom: 1.5rem;
}

.badge-icon {
  font-size: 1rem;
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #2563eb 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 4s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
}

.tech-stack-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-badge {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.hero-description {
  font-size: 1.125rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 2rem;
  max-width: 540px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-primary {
  color: white;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
}

.btn-secondary {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.btn-secondary:hover {
  background: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-icon-github {
  width: 1.25rem;
  height: 1.25rem;
}

.hero-visual {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chat-preview {
  width: 100%;
  max-width: 380px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 20px 50px -12px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.05));
  border-bottom: 1px solid var(--vp-c-divider);
}

.chat-dots {
  display: flex;
  gap: 0.375rem;
}

.chat-dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
}

.chat-dots span:nth-child(1) { background: #ef4444; }
.chat-dots span:nth-child(2) { background: #f59e0b; }
.chat-dots span:nth-child(3) { background: #10b981; }

.chat-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.chat-messages {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 240px;
}

.message {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  animation: message-in 0.4s ease forwards;
  opacity: 0;
  transform: translateY(10px);
}

.message:nth-child(1) { animation-delay: 0.2s; }
.message:nth-child(2) { animation-delay: 0.6s; }
.message:nth-child(3) { animation-delay: 1s; }

@keyframes message-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.sent {
  flex-direction: row-reverse;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  flex-shrink: 0;
}

.message.sent .avatar {
  background: linear-gradient(135deg, #10b981, #059669);
}

.bubble {
  padding: 0.75rem 1rem;
  border-radius: 16px;
  font-size: 0.875rem;
  line-height: 1.5;
  max-width: 220px;
}

.message.received .bubble {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-bottom-left-radius: 4px;
}

.message.sent .bubble {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  border-bottom-right-radius: 4px;
}

.typing-indicator {
  display: flex;
  gap: 0.25rem;
  padding: 1rem;
  opacity: 0;
  animation: show-typing 0.3s ease 1.4s forwards;
}

@keyframes show-typing {
  to { opacity: 1; }
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: var(--vp-c-text-3);
  border-radius: 50%;
  animation: typing-bounce 1.4s ease infinite;
}

.typing-indicator span:nth-child(1) { animation-delay: 0s; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
}

@media (max-width: 960px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
    min-height: auto;
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  .hero-content {
    order: 1;
  }

  .hero-visual {
    order: 0;
  }

  .hero-description {
    margin-left: auto;
    margin-right: auto;
  }

  .tech-stack-badges,
  .hero-actions {
    justify-content: center;
  }

  .chat-preview {
    max-width: 320px;
  }

  .hero-background {
    opacity: 0.6;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 3rem 24px;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .chat-preview {
    max-width: 280px;
  }
}
</style>
