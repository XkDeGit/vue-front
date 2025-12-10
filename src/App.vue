<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand">
        <span class="brand-mark">★</span>
        <span class="brand-name">{{ t('app.title') }}</span>
      </div>
      <nav class="nav">
        <RouterLink to="/">{{ t('nav.dashboard') }}</RouterLink>
        <RouterLink to="/plans">{{ t('nav.plans') }}</RouterLink>
        <RouterLink to="/customers">{{ t('nav.customers') }}</RouterLink>
      </nav>
      <div class="header-actions">
        <ElButton size="small" @click="switchLocale">
          {{ locale === 'en' ? '中文' : 'EN' }}
        </ElButton>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const switchLocale = () => {
  locale.value = locale.value === 'en' ? 'zh' : 'en';
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: linear-gradient(90deg, #fff7e0 0%, #ffe9b3 100%);
  border-bottom: 1px solid #f2dca1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: #ffc94a;
  color: #1f2937;
}

.brand-name {
  color: #1f2937;
}

.nav {
  display: flex;
  gap: 12px;
  font-weight: 600;
}

.nav a {
  color: #374151;
  padding: 6px 10px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.nav a.router-link-active {
  background: #ffe0a3;
  color: #1f2937;
}

.nav a:hover {
  background: #fff2c7;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.app-main {
  padding: 20px;
}
</style>
