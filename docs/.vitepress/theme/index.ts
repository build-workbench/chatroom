import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'

// Import custom components
import HeroSection from './components/HeroSection.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import LearningPath from './components/LearningPath.vue'
import TechStack from './components/TechStack.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {})
  },
  enhanceApp({ app }) {
    // Register custom components
    app.component('HeroSection', HeroSection)
    app.component('FeatureGrid', FeatureGrid)
    app.component('LearningPath', LearningPath)
    app.component('TechStack', TechStack)
  },
} satisfies Theme
