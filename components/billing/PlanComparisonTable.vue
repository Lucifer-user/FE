<template>
  <div
    class="w-full overflow-x-auto"
    tabindex="0"
    :aria-label="t('pricing_ui.aria_comparison')"
  >
    <table class="w-full min-w-[780px] border-collapse font-mono text-left">
      <thead>
        <tr class="border-b border-slate-200 dark:border-white/10">
          <th class="sticky left-0 z-10 w-[32%] min-w-[230px] px-5 py-4 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
            {{ t('public.pricing.feature') }}
          </th>
          <th
            v-for="plan in plans"
            :key="plan.code"
            class="min-w-[170px] px-4 py-4 text-center text-[9px] font-black uppercase tracking-[0.12em]"
            :class="planHeaderClass(plan)"
          >
            {{ plan.name }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="row in featureRows"
          :key="row.field"
          class="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/50 dark:border-white/5 dark:hover:bg-white/[0.02]"
        >
          <th
            class="sticky left-0 z-10 px-5 py-4 text-[10px] font-medium leading-5 text-slate-600 dark:text-slate-300"
          >
            {{ t(row.labelKey) }}
          </th>
          <td
            v-for="plan in plans"
            :key="`${row.field}-${plan.code}`"
            class="px-4 py-4 text-center text-[10px] font-semibold text-slate-500"
          >
            <template v-if="row.kind === 'custom'">
              <span
                v-if="row.value(plan) === true || row.value(plan) === 'check_circle'"
                class="material-symbols-outlined text-base"
                :class="planAccentClass(plan)"
                :aria-label="t('pricing_ui.supported')"
              >check_circle</span>
              <span v-else-if="row.value(plan) === false || row.value(plan) === '—'" class="text-slate-300" :aria-label="t('pricing_ui.not_supported')">—</span>
              <span v-else :class="planAccentClass(plan)">{{ row.value(plan) }}</span>
            </template>
            <span v-else :class="Number(plan[row.field]) === -1 ? planAccentClass(plan) : ''">
              {{ formatLimit(plan[row.field], row.field) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  plans: { type: Array, default: () => [] },
  billingCycle: { type: String, default: 'annual', validator: value => ['monthly', 'annual'].includes(value) },
  currentPlan: { type: [String, Object], default: null },
})

const { t, locale } = useI18n()

const quotaRows = [
  { field: 'chatbot_limit', labelKey: 'public.pricing.features.ai_deployments', kind: 'limit' },
  { field: 'document_limit', labelKey: 'public.pricing.features.knowledge_docs', kind: 'limit' },
  { field: 'storage_limit', labelKey: 'pricing_ui.quota_storage', kind: 'limit' },
  { field: 'member_limit', labelKey: 'pricing_ui.quota_members', kind: 'limit' },
  { field: 'token_limit', labelKey: 'public.pricing.features.monthly_tokens', kind: 'limit' },
]

const benefitLabelKey = (key) => ({
  allow_web_widget: 'pricing_ui.benefit_web_widget',
  allow_telegram: 'pricing_ui.benefit_telegram',
  allow_members: 'pricing_ui.benefit_members',
  allow_departments: 'pricing_ui.benefit_departments',
}[key] || null)

const benefitKeys = computed(() => [...new Set(props.plans.flatMap(plan => Object.keys(plan.benefits || {}).filter(key => key !== 'items')))].sort())
const benefitDisplay = (plan, key) => {
  const value = Object.prototype.hasOwnProperty.call(plan, key) ? plan[key] : plan.benefits?.[key]
  if (value === null || value === undefined || value === '' || value === false) return false
  if (value === true) return true
  if (Number(value) === -1) return t('public.pricing.unlimited')
  if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value)))) {
    return new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(Number(value))
  }
  return String(value)
}

const featureRows = computed(() => [
  ...quotaRows,
  ...benefitKeys.value.map(key => ({
    field: `benefit:${key}`,
    labelKey: benefitLabelKey(key) || key.replace(/^allow_/, '').replace(/_/g, ' ').replace(/^./, value => value.toUpperCase()),
    kind: 'custom',
    value: plan => benefitDisplay(plan, key),
  })),
])

const formatLimit = (value, field) => {
  if (value === null || value === undefined || value === '') {
    return field === 'storage_limit' ? t('pricing_ui.not_configured') : '—'
  }
  if (Number(value) === -1) return t('public.pricing.unlimited')
  return new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(Number(value))
}

const isFreePlan = (plan) => {
  const values = [
    plan.final_monthly_price ?? plan.monthly_price,
    plan.final_annual_price ?? plan.annual_price,
  ].filter(value => value !== null && value !== undefined && value !== '')
  return values.length > 0 && values.every(value => Number.isFinite(Number(value)) && Number(value) === 0)
}

const explicitFeaturedPlan = computed(() => props.plans.find(plan => plan.is_popular === true || plan.popular === true))
const fallbackFeaturedPlan = computed(() => [...props.plans]
  .filter(plan => Boolean(plan.is_sellable) && !isFreePlan(plan))
  .sort((left, right) => Number(left.rank ?? 0) - Number(right.rank ?? 0))[0])
const featuredPlanCode = computed(() => explicitFeaturedPlan.value?.code ?? fallbackFeaturedPlan.value?.code ?? null)
const highestRank = computed(() => Math.max(...props.plans.map(plan => Number(plan.rank ?? 0)), 0))

const isFeaturedPlan = (plan) => featuredPlanCode.value !== null && plan.code === featuredPlanCode.value
const isHighestPlan = (plan) => Number(plan.rank ?? 0) === highestRank.value && !isFeaturedPlan(plan)
const planAccentClass = (plan) => isFeaturedPlan(plan) ? 'text-cyan-600' : isHighestPlan(plan) ? 'text-violet-500' : 'text-slate-500'
const planHeaderClass = (plan) => isFeaturedPlan(plan) ? 'text-cyan-600' : isHighestPlan(plan) ? 'text-violet-500' : 'text-slate-400'
</script>
