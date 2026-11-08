<template>
  <div class="h-screen bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
    <div class="text-center text-white">
      <h1 class="text-5xl font-bold mb-4">Orbit AI</h1>
      <p class="text-xl">Welcome to Orbit AI, env-secret-hook : {{ env }}</p>
      <p class="text-xl">Welcome to Orbit AI, test commit : {{ env }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const env = computed(() => import.meta.env.VITE_ENV || 'NONE')
</script>
