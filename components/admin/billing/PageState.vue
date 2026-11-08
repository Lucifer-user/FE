<template>
  <div v-if="loading" class="flex min-h-56 flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400" role="status">
    <div class="h-9 w-9 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
    <span class="text-sm font-semibold">{{ t('admin_billing.loading') }}</span>
  </div>
  <div v-else-if="error" class="flex min-h-56 flex-col items-center justify-center gap-3 px-5 text-center">
    <span class="material-symbols-outlined text-4xl text-rose-500">error</span>
    <p class="max-w-lg text-sm text-slate-600 dark:text-slate-300">{{ error }}</p>
    <button type="button" class="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-slate-900" @click="$emit('retry')">{{ t('admin_billing.retry') }}</button>
  </div>
  <div v-else-if="empty" class="flex min-h-56 flex-col items-center justify-center gap-2 px-5 text-center text-slate-500 dark:text-slate-400">
    <span class="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">inbox</span>
    <p class="text-sm font-semibold">{{ emptyText || t('admin_billing.no_data') }}</p>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
const { t } = useI18n()
withDefaults(defineProps<{ loading?: boolean; error?: string; empty?: boolean; emptyText?: string }>(), { loading: false, error: '', empty: false, emptyText: '' })
defineEmits<{ retry: [] }>()
</script>
