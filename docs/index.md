---
layout: home
pageClass: portal-page
---

<HeroSection />

<div class="features-container">
  <FeatureGrid />
</div>

<div class="learning-paths-container">
  <LearningPath />
</div>

<div class="tech-stack-container">
  <TechStack />
</div>

<section class="cta-section">
  <div class="cta-content">
    <h2 class="cta-title">准备好开始学习了吗？</h2>
    <p class="cta-subtitle">Ready to start learning?</p>
    <p class="cta-description">
      无论你是后端开发者、前端开发者，还是想学习全栈技术，这个教程都会帮助你掌握现代 Web 开发的核心技能。
    </p>
    <div class="cta-actions">
      <a href="/zh/getting-started" class="cta-btn cta-btn-primary">
        <span>中文教程</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
      <a href="/en/getting-started" class="cta-btn cta-btn-secondary">
        <span>English Docs</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
      <a href="https://github.com/LessUp/chatroom" class="cta-btn cta-btn-ghost" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
      </a>
    </div>
  </div>
</section>

<section class="footer-section">
  <div class="footer-content">
    <p class="footer-license">
      Released under the MIT License · Copyright © 2025-2026 LessUp
    </p>
  </div>
</section>

<style>
/* Portal page specific styles */
.portal-page .VPHome {
  padding-top: 0 !important;
}

.portal-page .VPContent {
  max-width: 100% !important;
  padding: 0 !important;
}

.portal-page .VPDoc {
  padding: 0 !important;
}

.portal-page .content {
  max-width: 100% !important;
  padding: 0 !important;
}

/* Container styles */
.features-container,
.learning-paths-container,
.tech-stack-container {
  padding: 0 24px;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .features-container,
  .learning-paths-container,
  .tech-stack-container {
    padding: 0 48px;
  }
}

/* CTA Section */
.cta-section {
  padding: 6rem 24px;
  background: linear-gradient(135deg, var(--vp-c-bg-alt) 0%, var(--vp-c-bg) 100%);
  border-top: 1px solid var(--vp-c-divider);
}

.cta-content {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
}

.cta-subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.0625rem;
  color: var(--vp-c-text-2);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-btn {
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

.cta-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.cta-btn-primary {
  color: white;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}

.cta-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45);
}

.cta-btn-secondary {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.cta-btn-secondary:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.cta-btn-ghost {
  color: var(--vp-c-text-2);
  background: transparent;
}

.cta-btn-ghost:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

/* Footer Section */
.footer-section {
  padding: 2rem 24px;
  background: var(--vp-c-bg);
  border-top: 1px solid var(--vp-c-divider);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-license {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .cta-section {
    padding: 4rem 24px;
  }
  
  .cta-title {
    font-size: 1.5rem;
  }
  
  .cta-subtitle {
    font-size: 1.125rem;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .cta-btn {
    justify-content: center;
  }
}
</style>
