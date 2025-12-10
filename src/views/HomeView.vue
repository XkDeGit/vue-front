<template>
  <div class="home-grid">
    <ElCard class="hero card" shadow="never">
      <h2>{{ t('app.title') }}</h2>
      <p class="lead">{{ t('home.welcome') }}</p>
      <ElButton type="warning" plain>{{ t('home.cta') }}</ElButton>
    </ElCard>
    <div class="stats">
      <ElCard class="card" shadow="never">
        <div class="stat-value">18</div>
        <div class="stat-label">{{ t('home.stats.activePlans') }}</div>
      </ElCard>
      <ElCard class="card" shadow="never">
        <div class="stat-value">$48k</div>
        <div class="stat-label">{{ t('home.stats.monthlyRecurring') }}</div>
      </ElCard>
      <ElCard class="card" shadow="never">
        <div class="stat-value">1,240</div>
        <div class="stat-label">{{ t('home.stats.customers') }}</div>
      </ElCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
.home-grid {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 16px;
}

.hero {
  padding: 18px 20px;
}

.lead {
  color: var(--muted);
  margin: 8px 0 16px 0;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
}

.stat-label {
  color: var(--muted);
}

@media (max-width: 900px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
}
</style>
