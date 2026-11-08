<template>
  <span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold" :class="toneClass">
    <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true"></span>{{ label }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ status?: string | null; label?: string }>()
const { t } = useI18n()
const label = computed(() => {
  if (props.label) return props.label
  const status = String(props.status || '').toLowerCase()
  const key = `admin_billing.status_${status}`
  const translated = t(key)
  return translated === key ? (props.status || t('admin_billing.no_data')) : translated
})
const toneClass = computed(() => {
  const status = String(props.status || '').toLowerCase()
  if (['success', 'completed', 'paid', 'active', 'visible', 'sellable'].includes(status)) return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
  if (['pending', 'expiring_soon', 'upcoming'].includes(status)) return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300'
  if (['failed', 'expired', 'cancelled', 'hidden', 'not_sellable'].includes(status)) return 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300'
  return 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
})
</script>
