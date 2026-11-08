<template>
  <div v-if="pagination.total > 0" class="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-slate-400">
    <span>{{ t('admin_billing.page') }} {{ pagination.current_page }}/{{ pagination.last_page }} · {{ formatBillingNumber(pagination.total) }} {{ t('admin_billing.results') }}</span>
    <div class="flex gap-2">
      <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10" :disabled="pagination.current_page <= 1" @click="$emit('change', pagination.current_page - 1)">{{ t('admin_billing.previous') }}</button>
      <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10" :disabled="pagination.current_page >= pagination.last_page" @click="$emit('change', pagination.current_page + 1)">{{ t('admin_billing.next') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BillingPagination } from '~/types/admin-billing'
import { formatBillingNumber } from '~/utils/adminBilling'
const { t } = useI18n()
defineProps<{ pagination: BillingPagination }>()
defineEmits<{ change: [page: number] }>()
</script>
