<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: undefined
  }
})

const displayValue = computed(() => props.value ?? '—')
</script>

<template>
  <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
    <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
      {{ label }}
    </p>
    <p class="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-100">
      {{ displayValue }}
    </p>
  </div>
</template>
