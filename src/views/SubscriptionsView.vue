<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Subscription } from '@/api/types'

const { t } = useI18n()

// Mock data
const subscriptions = ref<Subscription[]>([
  {
    id: '1',
    name: '🌟 Basic Plan',
    user: 'Zhang San',
    status: 'active',
    price: '¥99/month',
    expiryDate: '2025-12-31',
  },
  {
    id: '2',
    name: '💎 Premium Plan',
    user: 'Li Si',
    status: 'expiring',
    price: '¥299/month',
    expiryDate: '2025-12-15',
  },
  {
    id: '3',
    name: '🚀 Enterprise Plan',
    user: 'Wang Wu',
    status: 'active',
    price: '¥999/month',
    expiryDate: '2026-06-30',
  },
])

function getStatusType(status: string): 'success' | 'warning' | 'danger' {
  const map = {
    active: 'success',
    expiring: 'warning',
    expired: 'danger',
  }
  return map[status as keyof typeof map] || 'info'
}
</script>

<template>
  <div class="subscriptions">
    <div class="page-header">
      <h1 class="page-title">📦 {{ t('subscription.title') }}</h1>
    </div>

    <div class="table-card">
      <el-table :data="subscriptions" style="width: 100%">
        <el-table-column prop="name" :label="t('subscription.name')" />
        <el-table-column prop="user" :label="t('subscription.user')" />
        <el-table-column prop="status" :label="t('subscription.status')">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ t(`subscription.${row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="t('subscription.price')" />
        <el-table-column prop="expiryDate" :label="t('subscription.expiryDate')" />
        <el-table-column :label="t('subscription.actions')">
          <template #default>
            <el-button size="small" type="primary">
              {{ t('common.edit') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>
.subscriptions {
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
}

.table-card {
  background: white;
  border-radius: var(--radius-medium);
  padding: 24px;
  box-shadow: var(--shadow-card);
  flex: 1;
  overflow: auto;
}
</style>
