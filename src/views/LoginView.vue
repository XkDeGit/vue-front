<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const formData = ref({
  username: '',
  password: '',
})
const loading = ref(false)

async function handleLogin(): Promise<void> {
  if (!formData.value.username || !formData.value.password) {
    ElMessage.warning(t('auth.pleaseEnterUsername'))
    return
  }

  loading.value = true
  try {
    await authStore.login(formData.value.username, formData.value.password)
    ElMessage.success(t('auth.loginSuccess'))
    router.push('/')
  } catch (error) {
    ElMessage.error(t('auth.loginFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-icon">🎯</div>
        <h2>{{ t('auth.loginTitle') }}</h2>
      </div>

      <el-form :model="formData" class="login-form">
        <el-form-item>
          <el-input
            v-model="formData.username"
            :placeholder="t('auth.username')"
            size="large"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="formData.password"
            type="password"
            :placeholder="t('auth.password')"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          :loading="loading"
          class="login-button"
          @click="handleLogin"
        >
          {{ t('auth.login') }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background: white;
  border-radius: var(--radius-large);
  padding: 48px;
  box-shadow: var(--shadow-modal);
  width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border-radius: var(--radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 16px;
}

.login-form {
  margin-top: 24px;
}

.login-button {
  width: 100%;
}
</style>
