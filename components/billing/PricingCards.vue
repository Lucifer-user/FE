<template>
  <div>
    <div v-if="loading" class="pricing-card-grid">
      <div v-for="item in 3" :key="item" class="min-h-[480px] animate-pulse rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_16px_36px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#111318]">
        <div class="h-7 w-2/3 rounded-lg bg-slate-200"></div>
        <div class="mt-4 h-4 w-full rounded bg-slate-100"></div>
        <div class="mt-2 h-4 w-4/5 rounded bg-slate-100"></div>
        <div class="mt-9 h-12 w-3/4 rounded-xl bg-slate-200"></div>
        <div class="mt-10 space-y-5">
          <div v-for="row in 4" :key="row" class="h-4 rounded bg-slate-100"></div>
        </div>
        <div class="mt-12 h-12 rounded-xl bg-slate-200"></div>
      </div>
    </div>

    <div v-else-if="error" class="mx-auto max-w-3xl rounded-[28px] border border-rose-200 bg-rose-50 p-9 text-center dark:border-rose-900/50 dark:bg-rose-900/10">
      <span class="material-symbols-outlined text-3xl text-rose-500" aria-hidden="true">error</span>
      <p class="mt-3 text-sm font-semibold text-rose-700">{{ t('pricing_ui.billing_error') }}</p>
      <button type="button" class="mt-5 rounded-xl border border-rose-300 px-5 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400" @click="$emit('retry')">{{ t('pricing_ui.retry') }}</button>
    </div>

    <div v-else-if="!plans.length" class="mx-auto max-w-3xl rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center dark:border-white/10 dark:bg-[#111318]">
      <span class="material-symbols-outlined text-3xl text-slate-400" aria-hidden="true">inventory_2</span>
      <p class="mt-3 text-sm font-medium text-slate-500">{{ t('pricing_ui.catalog_empty') }}</p>
    </div>

    <div v-else class="pricing-card-carousel">
      <div class="pricing-card-grid" :class="{ 'pricing-card-grid--compact': visiblePlans.length < 3, 'pricing-card-grid--four-plus': visiblePlans.length >= 4 }" :style="cardGridStyle">
      <article
        v-for="plan in visiblePlans"
        :key="planKey(plan)"
        class="pricing-card group relative flex min-w-0 flex-col rounded-2xl border bg-white px-7 pb-7 pt-8 shadow-[0_16px_36px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_24px_54px_rgba(15,23,42,0.14)] dark:bg-[#111318] dark:shadow-none"
        :class="isFeaturedPlan(plan) ? 'pricing-card--featured border-cyan-300 dark:border-cyan-500/50' : 'border-slate-200 dark:border-white/10'"
      >
        <div v-if="isFeaturedPlan(plan)" class="absolute -top-4 left-1/2 w-[68%] -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 px-4 py-2 text-center text-[9px] font-black uppercase tracking-[0.16em] text-white shadow-[0_8px_18px_rgba(34,211,238,0.24)]">
          {{ t('pricing_ui.most_recommended') }}
        </div>

        <div class="flex min-h-[102px] flex-col">
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="break-words font-['Space_Grotesk'] text-[1.45rem] font-bold tracking-tight text-[#111827] dark:text-white">{{ plan.name }}</h3>
            <span v-if="showAnnualOriginal(plan)" class="rounded-md bg-emerald-50 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-emerald-600">{{ t('pricing_ui.annual_discount', { percent: plan.annual_discount_percent }) }}</span>
          </div>
          <p class="mt-3 text-xs font-medium leading-5 text-slate-500">{{ plan.description || '—' }}</p>
        </div>

        <div class="mt-7 min-h-[72px]">
          <div v-if="hasNumericPrice(plan)" class="flex flex-wrap items-end gap-x-1 gap-y-1">
            <span class="font-['Space_Grotesk'] text-[2.65rem] font-bold leading-none tracking-[-0.055em] text-[#111827] dark:text-white">{{ formatPriceNumber(plan) }}</span>
            <span class="pb-1 font-['Space_Grotesk'] text-xl font-bold" :class="isFeaturedPlan(plan) ? 'text-cyan-600' : 'text-slate-400'">{{ currencyLabel(plan) }}</span>
            <span class="pb-1.5 pl-1 text-[9px] font-black uppercase tracking-wider text-slate-400">{{ formatPeriod(plan) }}</span>
          </div>
          <div v-else class="font-['Space_Grotesk'] text-3xl font-bold text-[#111827] dark:text-white">{{ t('pricing_ui.contact') }}</div>
          <div v-if="showAnnualOriginal(plan)" class="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
            <span class="text-slate-400 line-through">{{ formatCurrency(plan.annual_price, plan.currency) }}</span>
            <span class="font-bold text-emerald-600">{{ t('pricing_ui.annual_discount', { percent: plan.annual_discount_percent }) }}</span>
          </div>
        </div>

        <ul class="mt-7 min-h-[164px] flex-1 space-y-5 transition-all duration-300">
          <li v-for="feature in (isPlanExpanded(plan) ? planHighlights(plan) : planHighlights(plan).slice(0, 5))" :key="feature" class="flex items-start gap-3 font-mono text-[10px] font-medium leading-5 text-slate-500">
            <span class="material-symbols-outlined mt-0.5 text-base" :class="planAccentClass(plan)" aria-hidden="true">{{ isFeaturedPlan(plan) ? 'verified' : 'check_circle' }}</span>
            <span>{{ feature }}</span>
          </li>
        </ul>

        <button
          v-if="planHighlights(plan).length > 5"
          @click.prevent="toggleExpand(plan)"
          type="button"
          class="mx-auto mt-7 inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 transition hover:text-cyan-600 focus:outline-none"
        >
          {{ isPlanExpanded(plan) ? t('pricing_ui.hide_features') : t('pricing_ui.see_all') }}
          <span class="material-symbols-outlined text-sm" aria-hidden="true">{{ isPlanExpanded(plan) ? 'expand_less' : 'expand_more' }}</span>
        </button>

        <button
          type="button"
          :disabled="!canUpgrade(plan)"
          class="mt-7 min-h-12 w-full rounded-[14px] px-4 py-3 text-[9px] font-black uppercase tracking-[0.18em] transition focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 disabled:cursor-not-allowed"
          :class="actionClass(plan)"
          @click="canUpgrade(plan) && navigateTo({ path: '/billing', query: { plan: plan.code, cycle: billingCycle } })"
        >
          {{ actionLabel(plan) }}
        </button>
      </article>
      </div>

      <div v-if="pageCount > 1" class="pricing-card-carousel__navigation" role="navigation" aria-label="Điều hướng gói dịch vụ">
        <button
          type="button"
          class="pricing-card-carousel__arrow"
          :disabled="currentPage === 0"
          aria-label="Trang gói trước"
          @click="previousPage"
        >
          <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
        </button>
        <span class="pricing-card-carousel__status">{{ currentPage + 1 }} / {{ pageCount }}</span>
        <button
          type="button"
          class="pricing-card-carousel__arrow"
          :disabled="currentPage === pageCount - 1"
          aria-label="Trang gói tiếp theo"
          @click="nextPage"
        >
          <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  plans: { type: Array, default: () => [] },
  billingCycle: { type: String, default: 'annual', validator: value => ['monthly', 'annual'].includes(value) },
  currentPlan: { type: [String, Object], default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

defineEmits(['retry'])

const { t, locale } = useI18n()

const pageSize = 4
const currentPage = ref(0)
const pageCount = computed(() => Math.max(1, Math.ceil(props.plans.length / pageSize)))
const visiblePlans = computed(() => {
  const start = currentPage.value * pageSize
  return props.plans.slice(start, start + pageSize)
})

const previousPage = () => {
  currentPage.value = Math.max(0, currentPage.value - 1)
}

const nextPage = () => {
  currentPage.value = Math.min(pageCount.value - 1, currentPage.value + 1)
}

watch(() => props.plans.length, () => {
  currentPage.value = Math.min(currentPage.value, pageCount.value - 1)
})

const planKey = (plan) => String(plan?.code ?? plan?.plan_code ?? plan?.id ?? plan?.slug ?? plan?.name ?? '')
const expandedPlan = ref(null)
const isPlanExpanded = (plan) => expandedPlan.value === plan
const toggleExpand = (plan) => {
  expandedPlan.value = isPlanExpanded(plan) ? null : plan
}

const formatCurrency = (value, currency = 'VND') => {
  if (value === null || value === undefined || value === '') return '—'
  const amount = Number(value)
  return Number.isFinite(amount)
    ? `${new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(Math.round(amount))} ${currency}`
    : t('pricing_ui.contact')
}

const selectedAmount = (plan) => props.billingCycle === 'annual'
  ? plan.final_annual_price ?? plan.annual_price
  : plan.final_monthly_price ?? plan.monthly_price

const hasNumericPrice = (plan) => {
  const value = selectedAmount(plan)
  return value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value))
}

const formatPriceNumber = (plan) => new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(Math.round(Number(selectedAmount(plan))))
const currencyLabel = (plan) => String(plan.currency || 'VND').toUpperCase() === 'VND' ? 'đ' : String(plan.currency || '')

const formatPeriod = (plan) => {
  if (props.billingCycle === 'annual') {
    const months = Number(plan.annual_duration_months ?? plan.duration_months_annual ?? 12)
    return t('pricing_ui.period_months', { months })
  }
  const months = Number(plan.monthly_duration_months ?? plan.duration_months ?? 1)
  return months === 1 ? t('pricing_ui.period_month') : t('pricing_ui.period_months', { months })
}

const formatLimit = (value) => {
  if (value === null || value === undefined || value === '') return t('pricing_ui.not_configured')
  if (Number(value) === -1) return t('public.pricing.unlimited')
  return new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(Number(value))
}

const benefitLabel = (key) => ({
  allow_web_widget: t('pricing_ui.benefit_web_widget'),
  allow_telegram: t('pricing_ui.benefit_telegram'),
  allow_members: t('pricing_ui.benefit_members'),
  allow_departments: t('pricing_ui.benefit_departments'),
}[key] || key.replace(/^allow_/, '').replace(/_/g, ' ').replace(/^./, value => value.toUpperCase()))

const formatBenefit = (value) => {
  if (value === false || value === null || value === undefined || value === '') return ''
  if (value === true) return t('pricing_ui.yes')
  if (Number(value) === -1) return t('public.pricing.unlimited')
  if (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value)))) {
    return new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(Number(value))
  }
  return String(value)
}

const planHighlights = (plan) => {
  const features = [
    `${formatLimit(plan.chatbot_limit)} ${t('pricing_ui.quota_chatbots')}`,
    `${formatLimit(plan.token_limit)} ${t('pricing_ui.quota_tokens')}`,
    `${formatLimit(plan.document_limit)} ${t('pricing_ui.quota_documents')}`,
  ]

  const benefits = plan.benefits || {}
  const additionalBenefits = []
  Object.keys(benefits).forEach((key) => {
    if (key === 'items') return

    const value = Object.prototype.hasOwnProperty.call(plan, key) ? plan[key] : benefits[key]
    if (value === true) additionalBenefits.push(benefitLabel(key))
    else if (value !== false && value !== null && value !== undefined && value !== '') {
      const formatted = formatBenefit(value)
      if (formatted) additionalBenefits.push(`${benefitLabel(key)}: ${formatted}`)
    }
  })

  features.push(...additionalBenefits)

  return [...new Set(features)]
}

const currentPlanCode = () => {
  if (typeof props.currentPlan === 'string') return props.currentPlan.toLowerCase()
  return String(props.currentPlan?.code ?? props.currentPlan?.plan_code ?? '').toLowerCase()
}

const isCurrentPlan = (plan) => plan.is_current === true
  || plan.is_current_plan === true
  || (currentPlanCode() && String(plan.code).toLowerCase() === currentPlanCode())

const isFreePlan = (plan) => {
  const monthlyValue = plan.final_monthly_price ?? plan.monthly_price
  const annualValue = plan.final_annual_price ?? plan.annual_price
  const values = [monthlyValue, annualValue].filter(value => value !== null && value !== undefined && value !== '')
  return values.length > 0 && values.every(value => Number.isFinite(Number(value)) && Number(value) === 0)
}

const explicitFeaturedPlan = computed(() => props.plans.find(plan => plan.is_popular === true || plan.popular === true))
const fallbackFeaturedPlan = computed(() => [...props.plans]
  .filter(plan => Boolean(plan.is_sellable) && !isFreePlan(plan))
  .sort((left, right) => Number(left.rank ?? 0) - Number(right.rank ?? 0))[0])
const featuredPlanCode = computed(() => explicitFeaturedPlan.value?.code ?? fallbackFeaturedPlan.value?.code ?? null)
const isFeaturedPlan = (plan) => featuredPlanCode.value !== null && plan.code === featuredPlanCode.value
const cardGridStyle = computed(() => ({
  maxWidth: `${Math.min(1160, Math.max(320, (visiblePlans.value.length * 300) + (Math.max(0, visiblePlans.value.length - 1) * 28)))}px`,
}))

const showAnnualOriginal = (plan) => {
  const discount = Number(plan.annual_discount_percent || 0)
  const original = Number(plan.annual_price)
  const finalPrice = Number(plan.final_annual_price ?? plan.annual_price)
  return props.billingCycle === 'annual' && discount > 0 && Number.isFinite(original) && original > finalPrice
}

const highestRank = computed(() => Math.max(...props.plans.map(plan => Number(plan.rank ?? 0)), 0))
const planAccentClass = (plan) => Number(plan.rank ?? 0) === highestRank.value && !isFeaturedPlan(plan) ? 'text-violet-500' : 'text-cyan-600'

const canUpgrade = (plan) => Boolean(plan.is_sellable) && !isCurrentPlan(plan) && !isFreePlan(plan)
const actionLabel = (plan) => {
  if (isCurrentPlan(plan)) return t('pricing_ui.current')
  if (isFreePlan(plan)) return t('pricing_ui.free')
  return plan.is_sellable ? t('pricing_ui.upgrade') : t('pricing_ui.not_sellable_action')
}

const actionClass = (plan) => {
  if (!canUpgrade(plan)) return 'border border-cyan-200 bg-white text-cyan-600 dark:border-cyan-800 dark:bg-[#111318] dark:text-cyan-400'
  if (isFeaturedPlan(plan)) return 'bg-gradient-to-r from-cyan-400 to-violet-700 text-white shadow-[0_12px_24px_rgba(76,29,149,0.18)] hover:brightness-110'
  return 'bg-[#0f172a] text-white shadow-[0_10px_20px_rgba(15,23,42,0.16)] hover:bg-[#172033] dark:bg-white dark:text-[#0f172a] dark:hover:bg-slate-200'
}
</script>

<style scoped>
.pricing-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  align-items: stretch;
  gap: 1.75rem;
  max-width: 1160px;
  margin-inline: auto;
}

.pricing-card {
  min-height: 505px;
  height: 100%;
}

.pricing-card-carousel__navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.pricing-card-carousel__arrow {
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(226 232 240);
  border-radius: 0.75rem;
  color: rgb(15 23 42);
  transition: background-color 150ms ease, color 150ms ease, opacity 150ms ease;
}

.pricing-card-carousel__arrow:hover:not(:disabled) {
  background: rgb(241 245 249);
}

.pricing-card-carousel__arrow:disabled {
  cursor: not-allowed;
  opacity: 0.35;
}

.pricing-card-carousel__status {
  min-width: 3rem;
  text-align: center;
  color: rgb(100 116 139);
  font-size: 0.75rem;
  font-weight: 700;
}

:global(.dark) .pricing-card-carousel__arrow {
  border-color: rgb(255 255 255 / 0.1);
  color: white;
}

:global(.dark) .pricing-card-carousel__arrow:hover:not(:disabled) {
  background: rgb(255 255 255 / 0.08);
}

@media (min-width: 1024px) {
  .pricing-card-grid--four-plus {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .pricing-card-grid:has(.pricing-card:hover) .pricing-card:not(:hover) {
    opacity: 0.35;
    filter: blur(2px);
    transform: scale(0.96);
  }

  .pricing-card--featured {
    box-shadow: 0 26px 60px rgba(15, 23, 42, 0.16);
  }

  .pricing-card:hover {
    z-index: 10;
  }

  .pricing-card--featured:hover {
    transform: translateY(-0.5rem);
  }
}
</style>
