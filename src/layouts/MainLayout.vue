<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const currentRoute = computed(() => router.currentRoute.value.path)

const menuItems = [
  { path: '/dashboard', icon: '📊', label: 'nav.dashboard' },
  { path: '/subscriptions', icon: '📦', label: 'nav.subscriptions' },
]

function toggleLanguage(): void {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}

async function handleLogout(): Promise<void> {
  await authStore.logout()
  ElMessage.success(t('common.success'))
  router.push('/login')
}
</script>

<template>
  <div class="main-layout">
    <!-- Navbar -->
    <div class="navbar">
      <div class="navbar-left">
        <div class="logo">
          <div class="logo-icon">🎯</div>
          <span>{{ t('app.title') }}</span>
        </div>
      </div>
      <div class="navbar-right">
        <el-button text @click="toggleLanguage">
          🌐 {{ locale === 'zh' ? '中文' : 'EN' }}
        </el-button>
        <el-dropdown>
          <div class="avatar">👤</div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleLogout">
                {{ t('common.logout') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="main-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <div
          v-for="item in menuItems"
          :key="item.path"
          :class="['menu-item', { active: currentRoute === item.path }]"
          @click="router.push(item.path)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span>{{ t(item.label) }}</span>
        </div>
      </div>

      <!-- Content -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.navbar {
  height: 60px;
  background: var(--color-text-primary);
  color: white;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-navbar);
  flex-shrink: 0;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border-radius: var(--radius-base);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.1) rotate(5deg);
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  box-shadow: 2px 0 8px rgba(255, 201, 74, 0.1);
  overflow-y: auto;
  flex-shrink: 0;
}

.menu-item {
  padding: 12px 24px;
  margin: 4px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: var(--radius-medium);
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
}

.menu-item:hover {
  background: rgba(255, 201, 74, 0.2);
  transform: translateX(4px);
}

.menu-item.active {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-button);
}

.menu-icon {
  font-size: 18px;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
