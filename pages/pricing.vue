<template>
  <div class="pricing-page min-h-screen overflow-x-hidden bg-white font-['Inter'] text-[#0f172a] dark:bg-[#0b0f19] dark:text-slate-200">
    <main class="mx-auto max-w-[1240px] px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:px-10">
      <header class="mx-auto max-w-[900px] text-center">
        <h1 class="font-['Space_Grotesk'] text-[clamp(2.55rem,6vw,4.75rem)] font-bold leading-[0.98] tracking-[-0.045em] text-[#111827] dark:text-white">
          <span class="block">{{ $t('public.pricing.title_unlock') }}</span>
          <span class="pricing-gradient-text mt-1 block">{{ $t('public.pricing.title_shimmer') }}</span>
        </h1>

        <p class="mx-auto mt-7 max-w-[660px] text-sm font-medium leading-6 text-slate-500 sm:text-base">
          {{ $t('public.pricing.subtitle') }}
        </p>

        <div class="mx-auto mt-7 max-w-[720px] rounded-full border border-cyan-200 bg-cyan-50/80 px-5 py-2.5 text-[10px] font-bold leading-4 text-cyan-700 sm:text-xs dark:border-cyan-900/50 dark:bg-cyan-900/20 dark:text-cyan-300">
          {{ $t('public.pricing.plan_note') }}
        </div>

        <div class="mt-11 flex flex-wrap items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.13em] sm:gap-4 sm:text-xs">
          <span :class="billingCycle === 'monthly' ? 'text-[#111827] dark:text-white' : 'text-slate-400 dark:text-slate-500'">{{ $t('public.pricing.monthly') }}</span>
          <button
            type="button"
            role="switch"
            :aria-checked="billingCycle === 'annual'"
            :aria-label="$t('billing.billing_cycle')"
            class="relative h-7 w-14 rounded-full border border-slate-200 bg-slate-100 p-1 shadow-inner transition focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:border-slate-700/50 dark:bg-slate-800/80"
            @click="billingCycle = billingCycle === 'annual' ? 'monthly' : 'annual'"
          >
            <span class="block h-5 w-5 rounded-full bg-cyan-400 shadow-[0_2px_10px_rgba(34,211,238,0.55)] transition-transform duration-300" :class="billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'"></span>
          </button>
          <span :class="billingCycle === 'annual' ? 'text-[#111827] dark:text-white' : 'text-slate-400 dark:text-slate-500'">{{ $t('public.pricing.annual') }}</span>
          <span v-if="maxAnnualDiscount > 0" class="rounded-md bg-cyan-400 px-2.5 py-1 text-[8px] font-black tracking-[0.08em] text-[#062a35] sm:text-[9px]">
            {{ $t('pricing_ui.annual_discount', { percent: maxAnnualDiscount }) }}
          </span>
        </div>
      </header>

      <section class="pricing-cards-section mt-20 sm:mt-24" :aria-label="$t('public.pricing.plans_aria')">
        <BillingPricingCards
          :plans="billingPlans"
          :billing-cycle="billingCycle"
          :loading="catalogPending"
          :error="catalogError"
          @retry="retryCatalog"
        />
      </section>

      <section
        v-if="!catalogPending && !catalogError && billingPlans.length"
        id="pricing-comparison"
        class="comparison-section mx-auto mt-24 max-w-[1080px] scroll-mt-12 sm:mt-32"
        aria-labelledby="pricing-comparison-title"
      >
        <div class="mb-10 text-center sm:mb-12">
          <h2 id="pricing-comparison-title" class="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl dark:text-white">{{ $t('pricing_ui.comparison_title') }}</h2>
        </div>
        <BillingPlanComparisonTable :plans="billingPlans" :billing-cycle="billingCycle" />
      </section>

      <section v-if="!catalogPending && !catalogError && billingPlans.length" class="mt-24 text-center sm:mt-32">
        <p class="text-[9px] font-black uppercase tracking-[0.48em] text-slate-300">{{ $t('public.pricing.trusted_by') }}</p>
      </section>
    </main>

    <footer v-if="catalogLoaded && !catalogPending" class="mt-8 border-t border-slate-100 py-10 dark:border-white/5">
      <div class="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-4 px-5 text-center sm:px-8 md:flex-row md:text-left">
        <div>
          <div class="flex items-center justify-center gap-2.5 md:justify-start">
            <img src="/brand/logo-mark.png" alt="" aria-hidden="true" class="h-7 w-9 object-contain" />
            <div class="text-xl font-black italic tracking-tighter text-[#111827] dark:text-white">{{ $t('public.pricing.footer_brand') }}</div>
          </div>
          <p class="mt-1 text-[9px] font-medium uppercase tracking-widest text-slate-400">{{ $t('public.pricing.footer_slogan') }}</p>
        </div>
        <div class="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-300">{{ $t('public.pricing.footer_rights') }}</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

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
.pricing-gradient-text {
  background: linear-gradient(90deg, #22b8f4 20%, #2563eb 42%, #7c3aed 66%, #4c1d95 86%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
