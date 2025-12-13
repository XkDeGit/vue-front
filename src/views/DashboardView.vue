<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Mock data
const stats = [
  {
    title: 'dashboard.totalSubscriptions',
    value: '1,234',
    trend: '+12.5%',
    icon: '📦',
  },
  {
    title: 'dashboard.activeUsers',
    value: '856',
    trend: '+8.3%',
    icon: '👥',
  },
  {
    title: 'dashboard.monthlyRevenue',
    value: '¥45.2k',
    trend: '+15.8%',
    icon: '💰',
  },
]
</script>

<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">🏠 {{ t('nav.dashboard') }}</h1>
      <p class="page-subtitle">{{ t('app.welcome') }}</p>
    </div>

    <div class="card-grid">
      <div v-for="stat in stats" :key="stat.title" class="stat-card">
        <div class="stat-card-header">
          <div class="stat-card-title">{{ t(stat.title) }}</div>
          <div class="stat-card-icon">{{ stat.icon }}</div>
        </div>
        <div class="stat-card-value">{{ stat.value }}</div>
        <div class="stat-card-trend">↗ {{ stat.trend }} {{ t('dashboard.vsLastMonth') }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.page-subtitle {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: var(--radius-medium);
  padding: 24px;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-primary);
}

.stat-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-card-title {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.stat-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: linear-gradient(135deg, var(--color-bg-base) 0%, var(--color-bg-light) 100%);
}

.stat-card-value {
  font-size: 32px;
  font-weight: bold;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.stat-card-trend {
  font-size: 12px;
  color: var(--color-success);
}
</style>
