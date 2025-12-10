<template>
  <ElCard class="card" shadow="never">
    <header class="card-header">
      <h2>{{ t('customers.title') }}</h2>
    </header>
    <ElTable :data="customers" style="width: 100%">
      <ElTableColumn prop="name" :label="t('customers.name')" />
      <ElTableColumn prop="email" :label="t('customers.email')" />
      <ElTableColumn prop="status" :label="t('customers.status')" />
    </ElTable>
  </ElCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuery } from '@tanstack/vue-query';
import { listCustomers } from '@api/customers';
import type { Customer } from '@api/types';

const { t } = useI18n();

const fallbackCustomers: Customer[] = [
  { id: '1', name: 'Acme Inc.', email: 'billing@acme.com', status: 'active' },
  { id: '2', name: 'Paper Crane', email: 'hello@papercrane.io', status: 'past_due' }
];

const { data } = useQuery({
  queryKey: ['customers'],
  queryFn: listCustomers,
  staleTime: 60_000,
  retry: 1
});

const customers = computed(() => data.value ?? fallbackCustomers);
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
</style>
