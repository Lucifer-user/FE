<template>
  <section id="pricing" class="relative min-h-screen overflow-x-hidden border-b border-slate-200/80 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-500 dark:border-white/10 dark:bg-transparent">
    <div class="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.025]" style="background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px); background-size: 52px 52px; background-position: center center;"></div>
    <div class="pointer-events-none absolute -left-48 top-28 h-[28rem] w-[28rem] rounded-full bg-cyan-200/15 blur-[100px] dark:bg-cyan-500/10"></div>
    <div class="pointer-events-none absolute -right-48 bottom-40 h-[30rem] w-[30rem] rounded-full bg-blue-200/15 blur-[100px] dark:bg-blue-500/10"></div>

    <div class="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:px-10">
      <header class="mx-auto max-w-3xl text-center">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">{{ pricingCopy.eyebrow }}</p>
        <h1 class="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl dark:text-white">{{ pricingCopy.title }}</h1>
        <p class="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300/70">{{ pricingCopy.description }}</p>

        <div class="mx-auto mt-7 max-w-2xl rounded-xl border border-cyan-200/80 bg-cyan-50/65 px-5 py-3 text-xs font-medium leading-6 text-cyan-800 dark:border-cyan-300/15 dark:bg-cyan-300/[0.06] dark:text-cyan-200">
          {{ $t('public.pricing.plan_note') }}
        </div>

        <div class="mt-10 inline-flex flex-wrap items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white/75 p-2.5 text-[10px] font-bold uppercase tracking-[0.14em] shadow-[0_10px_26px_rgba(15,23,42,0.04)] sm:gap-4 sm:text-xs dark:border-white/10 dark:bg-[#0A0A0A]/75 dark:shadow-none">
          <span :class="billingCycle === 'monthly' ? 'text-slate-950 dark:text-white' : 'text-slate-400 dark:text-slate-500'">{{ $t('public.pricing.monthly') }}</span>
          <button
            type="button"
            role="switch"
            :aria-checked="billingCycle === 'annual'"
            :aria-label="$t('billing.billing_cycle')"
            class="pricing-toggle"
            @click="billingCycle = billingCycle === 'annual' ? 'monthly' : 'annual'"
          >
            <span class="pricing-toggle__thumb" :class="billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'"></span>
          </button>
          <span :class="billingCycle === 'annual' ? 'text-slate-950 dark:text-white' : 'text-slate-400 dark:text-slate-500'">{{ $t('public.pricing.annual') }}</span>
          <span v-if="maxAnnualDiscount > 0" class="rounded-md bg-cyan-500 px-2.5 py-1 text-[8px] font-black tracking-[0.08em] text-white sm:text-[9px]">
            {{ $t('pricing_ui.annual_discount', { percent: maxAnnualDiscount }) }}
          </span>
        </div>
      </header>

      <section class="pricing-cards-section relative mt-16 sm:mt-20" :aria-label="$t('public.pricing.plans_aria')">
        <div class="pricing-orbit pointer-events-none absolute inset-[-5%] hidden lg:block" aria-hidden="true">
          <svg viewBox="0 0 1200 620" class="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="600" cy="310" rx="500" ry="220" stroke="url(#pricing-orbit-gradient)" stroke-width="1" transform="rotate(-8 600 310)" />
            <ellipse cx="600" cy="310" rx="430" ry="170" stroke="url(#pricing-orbit-gradient)" stroke-width="1" transform="rotate(12 600 310)" />
            <defs><linearGradient id="pricing-orbit-gradient" x1="100" y1="100" x2="1080" y2="520" gradientUnits="userSpaceOnUse"><stop stop-color="#22D3EE" stop-opacity="0.02" /><stop offset="0.5" stop-color="#06B6D4" stop-opacity="0.32" /><stop offset="1" stop-color="#3B82F6" stop-opacity="0.02" /></linearGradient></defs>
          </svg>
        </div>

        <div class="pricing-surface relative z-10">
          <div class="mb-7 flex flex-col gap-2 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{{ pricingCopy.catalogEyebrow }}</p>
              <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{{ pricingCopy.catalogTitle }}</h2>
            </div>
            <p class="text-xs leading-5 text-slate-500 sm:max-w-xs sm:text-right dark:text-slate-400">{{ pricingCopy.catalogDescription }}</p>
          </div>

          <BillingPricingCards
            :plans="billingPlans"
            :billing-cycle="billingCycle"
            :loading="catalogPending"
            :error="catalogError"
            @retry="retryCatalog"
          />
        </div>
      </section>

      <section
        v-if="!catalogPending && !catalogError && billingPlans.length"
        id="pricing-comparison"
        class="comparison-section relative z-10 mx-auto mt-20 scroll-mt-12 sm:mt-28"
        aria-labelledby="pricing-comparison-title"
      >
        <div class="mb-7 flex flex-col gap-2 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">{{ pricingCopy.comparisonEyebrow }}</p>
            <h2 id="pricing-comparison-title" class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">{{ $t('pricing_ui.comparison_title') }}</h2>
          </div>
          <p class="max-w-sm text-xs leading-5 text-slate-500 sm:text-right dark:text-slate-400">{{ $t('pricing_ui.comparison_desc') }}</p>
        </div>
        <div class="comparison-surface">
          <BillingPlanComparisonTable :plans="billingPlans" :billing-cycle="billingCycle" />
        </div>
      </section>

      <section v-if="!catalogPending && !catalogError && billingPlans.length" class="relative z-10 mt-20 text-center sm:mt-28">
        <p class="text-[9px] font-black uppercase tracking-[0.48em] text-slate-400 dark:text-slate-500">{{ $t('public.pricing.trusted_by') }}</p>
      </section>
    </div>

    <footer v-if="catalogLoaded && !catalogPending" class="relative z-10 border-t border-slate-200/80 py-10 dark:border-white/10">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-center sm:px-8 md:flex-row md:text-left lg:px-10">
        <div>
          <div class="text-lg font-bold tracking-tight text-slate-950 dark:text-white">{{ $t('public.pricing.footer_brand') }}</div>
          <p class="mt-1 text-[9px] font-medium uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('public.pricing.footer_slogan') }}</p>
        </div>
        <div class="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">{{ $t('public.pricing.footer_rights') }}</div>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const pricingCopy = computed(() => locale.value === 'vi'
  ? {
      eyebrow: 'PRICING',
      title: 'Gói dịch vụ phù hợp với quy mô doanh nghiệp',
      description: 'Lựa chọn gói dịch vụ và tài nguyên AI phù hợp với nhu cầu sử dụng của tổ chức.',
      catalogEyebrow: 'ORBIT AI PLANS',
      catalogTitle: 'Chọn nền tảng phù hợp với tổ chức',
      catalogDescription: 'Các gói và giới hạn được tải trực tiếp từ billing catalog hiện tại.',
      comparisonEyebrow: 'PLAN DETAILS',
    }
  : {
      eyebrow: 'PRICING',
      title: 'Plans that fit your enterprise scale',
      description: 'Choose the service plan and AI resources that match your organization’s usage needs.',
      catalogEyebrow: 'ORBIT AI PLANS',
      catalogTitle: 'Choose the right foundation for your organization',
      catalogDescription: 'Plans and limits are loaded directly from the current billing catalog.',
      comparisonEyebrow: 'PLAN DETAILS',
    })

const billingCycle = ref('annual')

const {
  plans: billingPlans,
  loaded: catalogLoaded,
  loadError: catalogError,
  loading: catalogLoading,
  load: loadBillingCatalog,
  reload: retryCatalog,
} = useBillingCatalog()

const catalogPending = computed(() => catalogLoading.value || !catalogLoaded.value)
const maxAnnualDiscount = computed(() => billingPlans.value.reduce(
  (maximum, plan) => Math.max(maximum, Number(plan.annual_discount_percent || 0)),
  0,
))

onMounted(() => loadBillingCatalog(true))
</script>

<style scoped>
.pricing-toggle {
  @apply relative h-7 w-14 rounded-full border border-cyan-200 bg-cyan-50 p-1 shadow-inner transition focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:border-cyan-300/20 dark:bg-slate-800/80;
}

.pricing-toggle__thumb {
  @apply block h-5 w-5 rounded-full bg-cyan-500 shadow-[0_2px_10px_rgba(34,211,238,0.45)] transition-transform duration-300 dark:bg-cyan-300;
}

.pricing-surface {
  @apply p-5 sm:p-8;
}

.comparison-surface {
  @apply p-3 sm:p-5;
}

@media (prefers-reduced-motion: reduce) {
  .pricing-toggle,
  .pricing-toggle__thumb {
    transition: none;
  }
}
</style>
