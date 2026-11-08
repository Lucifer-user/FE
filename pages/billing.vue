<template>
  <div class="billing-page min-h-screen overflow-x-hidden bg-[#f7f9fc] font-['Inter'] text-slate-900 selection:bg-cyan-500/20 dark:bg-[#0b1016] dark:text-white transition-colors duration-500">
    <div class="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_8%_8%,rgba(34,211,238,0.08),transparent_28%),radial-gradient(circle_at_92%_18%,rgba(124,58,237,0.06),transparent_25%)]"></div>

    <main class="relative z-10 mx-auto max-w-[1180px] px-5 pb-20 pt-24 sm:px-8 sm:pt-28 lg:px-10">
      
      <div class="mb-10 animate-in fade-in slide-in-from-top-4 duration-700 sm:mb-12">
        <div class="mb-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-600 dark:text-cyan-400">
          <span class="h-px w-8 bg-cyan-400"></span>
          <span>{{ t('pricing_ui.account') }}</span>
        </div>
        <h1 class="font-['Space_Grotesk'] text-4xl font-bold tracking-[-0.04em] text-slate-950 transition-colors dark:text-white sm:text-5xl">{{ $t('billing.title') }}</h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-500 transition-colors dark:text-white/45 sm:text-base">{{ $t('billing.desc') }}</p>
      </div>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.42fr)_minmax(320px,0.78fr)]">
        
        <div class="space-y-7">
          <BillingBalanceCard />
          
          <!-- History Table -->
          <BillingHistoryTable />
        </div>

        <div class="flex flex-col gap-7">
          <!-- Quick Top Up (Replaced TopupModal with inline UX for premium feel) -->
          <div class="glass-container flex h-fit flex-col rounded-[1.5rem] border border-slate-200/90 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)] transition-colors duration-500 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none sm:p-8 animate-in slide-in-from-right-4 duration-700">
            <div class="mb-8 flex items-center gap-3 text-slate-900 transition-colors dark:text-white">
              <span class="material-symbols-outlined text-cyan-500 dark:text-cyan-400 text-2xl">bolt</span>
              <h3 class="font-['Space_Grotesk'] text-xl font-bold tracking-tight sm:text-2xl">{{ $t('billing.topup.title') }}</h3>
            </div>

            <div class="flex flex-1 flex-col space-y-8">
              <div>
                <label class="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors dark:text-white/30">{{ $t('billing.billing_cycle') }}</label>
                <div class="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/5">
                  <button
                    v-for="cycle in billingCycles"
                    :key="cycle.id"
                    type="button"
                    @click="selectedBillingCycle = cycle.id"
                    class="min-h-10 rounded-lg px-3 text-xs font-bold transition-all"
                    :class="selectedBillingCycle === cycle.id
                      ? 'bg-white dark:bg-cyan-400 text-slate-900 dark:text-black shadow-sm'
                      : 'text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white'"
                  >
                    {{ cycle.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors dark:text-white/30">{{ $t('billing.select_pkg') }}</label>
                <div class="grid grid-cols-2 gap-4">
                  <button v-for="pkg in inlinePackages" :key="pkg.id"
                    :disabled="!pkg.is_sellable"
                    @click="pkg.is_sellable && (selectedPkgId = pkg.id)"
                    :class="selectedPkgId === pkg.id ? 'active-tile border-cyan-500/50 bg-cyan-50 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white', !pkg.is_sellable ? 'cursor-not-allowed opacity-50' : ''"
                    class="rounded-xl border py-4 text-sm font-bold transition-all">
                    {{ pkg.name }}
                    <span v-if="!pkg.is_sellable" class="block mt-1 text-[9px] uppercase tracking-widest">{{ t('pricing_ui.not_for_sale') }}</span>
                  </button>
                </div>
              </div>

              <div>
                <label class="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors dark:text-white/30">{{ $t('billing.topup.payment_gateway') }}</label>
                <div class="group flex cursor-pointer items-center gap-4 rounded-xl border border-cyan-500/25 bg-cyan-50/45 p-4 transition-all hover:bg-cyan-50 dark:border-cyan-400/30 dark:bg-white/5 dark:hover:bg-white/10">
                  <div class="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-100 bg-white p-2 shadow-inner dark:border-none">
                    <img alt="VNPAY" class="w-full object-contain" src="https://payos.vn/docs/img/logo.svg" />
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-bold text-slate-900 dark:text-white transition-colors">{{ $t('billing.topup.secure_gateway') }}</div>
                    <div class="text-[10px] text-slate-500 dark:text-white/40 uppercase tracking-widest mt-0.5 transition-colors">{{ $t('billing.topup.gateway_desc') }}</div>
                  </div>
                  <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400 transition-colors">check_circle</span>
                </div>
              </div>

              <div class="mt-auto pt-8 border-t border-slate-200 dark:border-white/5 transition-colors">
                <div class="mb-6 flex items-start justify-between gap-4">
                  <span class="text-sm text-slate-500 dark:text-white/40 font-medium transition-colors">{{ $t('billing.topup.total_value') }}</span>
                  <div class="text-right">
                    <span class="text-3xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ currentPkg ? formatCurrency(currentPkg.price, currentPkg.currency) : '—' }}</span>
                    <p v-if="currentPkg?.discount_percent > 0" class="mt-1 text-xs text-slate-400 line-through">
                      {{ formatCurrency(currentPkg.base_price, currentPkg.currency) }}
                    </p>
                    <p v-if="currentPkg?.discount_percent > 0" class="mt-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                      {{ t('pricing_ui.annual_discount', { percent: currentPkg.discount_percent }) }}
                    </p>
                    <p class="mt-1 text-[10px] text-slate-400 dark:text-white/30">
                      {{ paymentPeriodNote }}
                    </p>
                  </div>
                </div>
                <button :disabled="!currentPkg?.is_sellable || blockReason" @click="showModal = true" class="deposit-btn w-full rounded-xl py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all disabled:cursor-not-allowed disabled:opacity-50">
                  {{ $t('billing.topup.confirm') }}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Bottom: Dynamic pricing cards followed by the comparison table -->
      <div class="mt-16 sm:mt-20">
        <div class="mb-8 text-center">
          <h2 class="font-['Space_Grotesk'] text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">{{ t('pricing_ui.section_title') }}</h2>
          <p class="text-slate-500 dark:text-white/40 mt-2 transition-colors">{{ t('pricing_ui.section_desc') }}</p>
        </div>
        <BillingPricingCards
          :plans="billingPlans"
          :billing-cycle="selectedBillingCycle"
          :current-plan="currentPlanCode"
          :loading="catalogPending"
          :error="catalogError"
          @retry="retryCatalog"
        />

        <section v-if="!catalogPending && !catalogError && billingPlans.length" id="pricing-comparison" class="mt-16 sm:mt-20" aria-labelledby="billing-comparison-title">
          <div class="mb-7 text-center">
            <h2 id="billing-comparison-title" class="font-['Space_Grotesk'] text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">{{ t('pricing_ui.comparison_title') }}</h2>
            <p class="text-slate-500 dark:text-white/40 mt-2 transition-colors">{{ t('pricing_ui.comparison_desc') }}</p>
          </div>
          <BillingPlanComparisonTable :plans="billingPlans" :billing-cycle="selectedBillingCycle" :current-plan="currentPlanCode" />
        </section>
      </div>

    </main>

    <!-- Payment Modal -->
    <BillingTopupModal 
      v-if="showModal" 
      payment-type="subscription_upgrade"
      :initial-plan-id="selectedPkgId"
      :billing-cycle="selectedBillingCycle"
      @close-modal="showModal = false" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const route = useRoute()
const router = useRouter()

definePageMeta({
  middleware: [
    function () {
      const accessToken = useCookie('accessToken')
      if (!accessToken.value) {
        return navigateTo('/Login')
      }
    }
  ]
})

const showModal = ref(false)

const { t, locale } = useI18n()

const billingCycles = computed(() => [
  { id: 'monthly', label: t('public.pricing.monthly') },
  { id: 'annual', label: t('public.pricing.annual') }
])

const selectedBillingCycle = ref(route.query.cycle === 'monthly' ? 'monthly' : 'annual')

const {
  plans: billingPlans,
  loaded: catalogLoaded,
  loadError: catalogError,
  loading: catalogLoading,
  load: loadBillingCatalog,
  reload: retryCatalog,
} = useBillingCatalog()

const catalogPending = computed(() => catalogLoading.value || !catalogLoaded.value)

const inlinePackages = computed(() => billingPlans.value.map((plan) => ({
  id: plan.code,
  name: plan.name,
  price: selectedBillingCycle.value === 'annual'
    ? Number(plan.final_annual_price ?? plan.annual_price ?? 0)
    : Number(plan.final_monthly_price ?? plan.monthly_price ?? 0),
  base_price: selectedBillingCycle.value === 'annual'
    ? Number(plan.annual_price || 0)
    : Number(plan.monthly_price || 0),
  discount_percent: selectedBillingCycle.value === 'annual'
    ? Number(plan.annual_discount_percent || 0)
    : 0,
  monthly_duration_months: Number(plan.monthly_duration_months ?? plan.duration_months ?? 1),
  annual_duration_months: Number(plan.annual_duration_months ?? plan.duration_months_annual ?? 12),
  currency: plan.currency || 'VND',
  level: Number(plan.rank || 0),
  is_sellable: Boolean(plan.is_sellable),
})))

const selectedPkgId = ref('')
const usageStats = ref(null)
const currentPlanCode = computed(() => usageStats.value?.plan_code || usageStats.value?.plan || null)
const config = useRuntimeConfig()
const accessToken = useCookie('accessToken')
const formatCurrency = (value, currency = 'VND') => `${new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(value)} ${currency}`
const fetchUsageStats = async () => {
  try {
    const res = await $fetch(`${config.public.apiBase}/partner/usage`, {
      headers: { 'Authorization': `Bearer ${accessToken.value}` }
    })
    usageStats.value = res
  } catch (e) { console.error('Failed to fetch usage stats', e) }
}

onMounted(async () => {
  await loadBillingCatalog(true)
  fetchUsageStats()
  if (route.query.plan) {
    const validPlan = inlinePackages.value.find(p => p.id === route.query.plan && p.is_sellable)
    if (validPlan) {
      selectedPkgId.value = validPlan.id
    }
  }
  if (!selectedPkgId.value) {
    selectedPkgId.value = inlinePackages.value.find(p => p.is_sellable)?.id || inlinePackages.value[0]?.id || ''
  }
  if (['monthly', 'annual'].includes(route.query.cycle)) {
    selectedBillingCycle.value = route.query.cycle
  }
})

watch([selectedPkgId, selectedBillingCycle], ([plan, cycle]) => {
  router.replace({ query: { plan, cycle } })
})

const currentPkg = computed(() => inlinePackages.value.find(p => p.id === selectedPkgId.value) || null)

const paymentPeriodNote = computed(() => {
  const months = selectedBillingCycle.value === 'annual'
    ? Number(currentPkg.value?.annual_duration_months || 12)
    : Number(currentPkg.value?.monthly_duration_months || 1)
  return selectedBillingCycle.value === 'annual'
    ? t('pricing_ui.payment_once_for_months', { months })
    : t('pricing_ui.payment_for_months', { months })
})

const blockReason = computed(() => {
  if (!usageStats.value) return null
  if (!currentPkg.value) return t('pricing_ui.catalog_not_ready')
  const targetLevel = currentPkg.value.level || 0
  const currentPlanStr = usageStats.value.plan ? usageStats.value.plan.toLowerCase() : ''
  const currentPlan = inlinePackages.value.find(p => p.id === currentPlanStr)
  const currentLevel = currentPlan ? currentPlan.level : 0
  const isExpired = usageStats.value.plan_expires_at && new Date(usageStats.value.plan_expires_at) < new Date()

  if (!isExpired) {
    if (targetLevel === currentLevel) {
      return t('pricing_ui.same_plan')
    }
    if (targetLevel < currentLevel) {
      return t('pricing_ui.downgrade_block')
    }
  }
  return null
})
</script>

<style>
.glass-container {
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
  position: relative;
  overflow: hidden;
}

.active-tile {
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.15);
}

.deposit-btn {
  background: linear-gradient(90deg, #00f0ff, #7701d0);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.3);
}

.deposit-btn:hover {
  box-shadow: 0 0 50px rgba(0, 240, 255, 0.5);
  filter: brightness(1.1);
  transform: translateY(-2px);
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0, 240, 255, 0.2); }
</style>
