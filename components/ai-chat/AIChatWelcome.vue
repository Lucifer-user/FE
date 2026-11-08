<template>
  <section class="overflow-hidden rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
    <div class="flex items-start gap-4">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-slate-900 text-white shadow-lg">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9.75 3.75h4.5m-7.5 5.5h10.5m-13 0h.75m11.5 0h.75m-10 5.5a2.75 2.75 0 015.5 0v.25h-5.5v-.25zm8 0a2.75 2.75 0 015.5 0v.25h-5.5v-.25zM8 7.5a1.25 1.25 0 11-2.5 0A1.25 1.25 0 018 7.5zm10.5 0A1.25 1.25 0 1116 7.5a1.25 1.25 0 012.5 0zM12 3.75v3" />
        </svg>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-medium text-sky-700">
            {{ $t('ai_chat.ready') }}
          </span>
          <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
            {{ serviceName || 'AI Assistant' }}
          </span>
        </div>

        <h3 class="mt-3 text-xl font-semibold text-slate-900">{{ $t('ai_chat.greeting') }}</h3>
        <p class="mt-2 text-sm leading-6 text-slate-500">
          {{ $t('ai_chat.talking_with', { name: serviceName || 'AI Assistant' }) }}
        </p>
      </div>
    </div>

    <div class="mt-5 grid gap-2 sm:grid-cols-2">
      <button
        v-for="suggestion in activeSuggestions"
        :key="suggestion.text"
        class="group rounded-[20px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-left transition hover:border-sky-200 hover:bg-white hover:shadow-sm"
        @click="$emit('suggest', suggestion.message)"
      >
        <div class="flex items-start justify-between gap-3">
          <span class="text-sm font-semibold text-slate-800">{{ suggestion.text }}</span>
          <svg class="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <p class="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
          {{ suggestion.message }}
        </p>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps({
  serviceName: {
    type: String,
    default: 'AI Assistant'
  },
  serviceType: {
    type: String,
    default: 'tour'
  }
})

defineEmits(['suggest'])

const suggestionMap = computed(() => ({
  tour: [
    { text: t('ai_chat.tour_danang'), message: t('ai_chat.tour_danang_q') },
    { text: t('ai_chat.tour_thailand'), message: t('ai_chat.tour_thailand_q') },
    { text: t('ai_chat.dalat_plan'), message: t('ai_chat.dalat_plan_q') }
  ],
  villa: [
    { text: t('ai_chat.villa_availability'), message: t('ai_chat.villa_availability_q') },
    { text: t('ai_chat.room_quote'), message: t('ai_chat.room_quote_q') },
    { text: t('ai_chat.villa_location'), message: t('ai_chat.villa_location_q') }
  ],
  inventory: [
    { text: t('ai_chat.stock_check'), message: t('ai_chat.stock_check_q') },
    { text: t('ai_chat.product_price'), message: t('ai_chat.product_price_q') },
    { text: t('ai_chat.delivery'), message: t('ai_chat.delivery_q') }
  ]
}))

const activeSuggestions = computed(() => {
  return suggestionMap.value[props.serviceType] || suggestionMap.value.tour
})
</script>
