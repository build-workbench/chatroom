---
layout: home
---

# 语言选择 / Language

<div class="language-selector">
  <a href="/zh/" class="language-card">
    <div class="language-icon">🇨🇳</div>
    <div class="language-name">简体中文</div>
    <div class="language-desc">技术白皮书</div>
  </a>
  <a href="/en/" class="language-card">
    <div class="language-icon">🇺🇸</div>
    <div class="language-name">English</div>
    <div class="language-desc">Technical Whitepaper</div>
  </a>
</div>

<style>
.language-selector {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
}

.language-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 3rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
}

.language-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.language-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.language-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.language-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .language-selector {
    flex-direction: column;
    align-items: center;
  }
}
</style>
