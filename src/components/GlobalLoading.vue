<script setup lang="ts">
import { ref } from 'vue'

// Expose methods for parent components
defineExpose({
  show,
  hide,
})

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null
let showTime: number = 0

function show(): void {
  showTime = Date.now()
  visible.value = true
}

function hide(): void {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  const elapsed = Date.now() - showTime
  const minDisplayTime = 300 // Minimum 300ms to avoid flashing

  if (elapsed < minDisplayTime) {
    // Delay hiding to meet minimum display time
    timer = setTimeout(() => {
      visible.value = false
      timer = null
    }, minDisplayTime - elapsed)
  } else {
    visible.value = false
  }
}
</script>

<template>
  <transition name="fade">
    <div v-if="visible" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </transition>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 247, 224, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 201, 74, 0.2);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
