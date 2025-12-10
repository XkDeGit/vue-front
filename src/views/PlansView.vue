<template>
  <ElCard class="card" shadow="never">
    <header class="card-header">
      <h2>{{ t('plans.title') }}</h2>
      <ElButton type="warning" plain>{{ t('home.cta') }}</ElButton>
    </header>
    <ElTable :data="displayPlans" style="width: 100%">
      <ElTableColumn prop="name" :label="t('plans.name')" />
      <ElTableColumn prop="price" :label="t('plans.price')">
        <template #default="{ row }">
          {{ row.currency }} {{ row.price }} / {{ row.interval }}
        </template>
      </ElTableColumn>
      <ElTableColumn prop="status" :label="t('plans.status')" />
    </ElTable>
    <div v-if="isError" class="error">
      Failed to load plans. Please check API base URL or auth.
    </div>
  </ElCard>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { listPlans } from '@api/plans';
import type { Plan } from '@api/types';

const { t } = useI18n();

const fallbackPlans: Plan[] = [
  { id: 'basic', name: 'Basic', price: 19, currency: '$', interval: 'month', status: 'active' },
  { id: 'pro', name: 'Pro', price: 49, currency: '$', interval: 'month', status: 'active' }
];

const { data, isError } = useQuery({
  queryKey: ['plans'],
  queryFn: listPlans,
  staleTime: 60_000,
  retry: 1
});

const displayPlans = computed(() => data.value ?? fallbackPlans);
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.error {
  margin-top: 10px;
  color: #b91c1c;
}
</style>
