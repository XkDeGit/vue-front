<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome(): void {
  router.push('/')
}
</script>

<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>Page Not Found</p>
      <el-button type="primary" @click="goHome">Go Home</el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
}

h1 {
  font-size: 120px;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 20px;
}

p {
  font-size: 24px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
}
</style>
