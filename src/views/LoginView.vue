<template>
  <div class="login-wrapper">
    <ElCard class="card login-card" shadow="never">
      <div class="login-header">
        <span class="brand-mark">★</span>
        <div>
          <div class="brand-name">{{ t('app.title') }}</div>
          <div class="brand-sub">{{ t('auth.subtitle') }}</div>
        </div>
      </div>
      <ElForm @submit.prevent="onSubmit" :model="form" label-width="90px" label-position="left">
        <ElFormItem :label="t('auth.email')">
          <ElInput v-model="form.email" autocomplete="email" />
        </ElFormItem>
        <ElFormItem :label="t('auth.password')">
          <ElInput
            v-model="form.password"
            type="password"
            show-password
            autocomplete="current-password"
          />
        </ElFormItem>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <ElButton
          type="warning"
          native-type="submit"
          :loading="auth.loading"
          style="width: 100%; margin-top: 4px"
        >
          {{ t('auth.login') }}
        </ElButton>
      </ElForm>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const errorMessage = ref('');

const onSubmit = async () => {
  errorMessage.value = '';
  try {
    await auth.login({ email: form.email, password: form.password });
    const redirect = (route.query.redirect as string) || '/';
    router.replace(redirect);
  } catch (err) {
    console.error(err);
    errorMessage.value = t('auth.failed');
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fff7e0 0%, #ffe6ad 100%);
  padding: 20px;
}

.login-card {
  width: min(420px, 100%);
  padding: 18px 20px;
}

.login-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #ffc94a;
  color: #1f2937;
  font-weight: 800;
}

.brand-name {
  font-weight: 700;
  color: #1f2937;
}

.brand-sub {
  color: var(--muted);
  font-size: 13px;
}

.el-form-item {
  margin-bottom: 14px;
}

.error {
  color: #b91c1c;
  margin: 4px 0 10px 0;
}
</style>
