<template>
  <header class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <NuxtLink v-if="backTo" :to="backTo" class="mb-2 inline-flex items-center gap-1 text-sm font-bold text-cyan-700 hover:underline dark:text-cyan-300"><span class="material-symbols-outlined text-base">arrow_back</span>{{ t('admin_billing.back') }}</NuxtLink>
      <h1 class="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">{{ title }}</h1>
      <p class="mt-2 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{{ description }}</p>
    </div>
    <slot />
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()
withDefaults(defineProps<{ title: string; description: string; backTo?: string }>(), { backTo: '' })
</script>
