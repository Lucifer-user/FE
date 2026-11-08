<template>
  <div class="glass-container group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/90 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)] transition-colors duration-500 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none sm:p-8 animate-in slide-in-from-left-4 duration-700">
    <div class="pointer-events-none absolute right-0 top-0 p-8">
      <span class="material-symbols-outlined select-none text-[150px] text-slate-100 transition-all duration-700 group-hover:rotate-0 dark:text-white/[0.03]">payments</span>
    </div>

    <div class="relative z-10">
      <div class="mb-8 flex items-center gap-3 text-slate-400 transition-colors dark:text-white/40">
        <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400">account_balance_wallet</span>
        <span class="text-[10px] font-bold uppercase tracking-[0.25em]">{{ $t('billing.balance.title') }}</span>
      </div>

      <div class="mb-4 flex items-baseline gap-4 transition-all">
        <span class="font-['Space_Grotesk'] text-6xl font-bold tracking-[-0.06em] text-slate-900 transition-colors dark:text-white sm:text-7xl shimmer-text">
          {{ formattedBalanceValue }}
        </span>
        <span class="font-['Space_Grotesk'] text-lg font-bold uppercase tracking-[0.18em] text-cyan-600 transition-colors dark:text-cyan-400">{{ $t('billing.balance.tokens') }}</span>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 transition-colors">
          <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-sm transition-colors">schedule</span>
          <p class="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest transition-colors">
            {{ $t('billing.balance.remaining') }}
          </p>
        </div>
        <button @click="handleRefresh" 
                :disabled="isRefreshing"
                class="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white transition-all disabled:opacity-50">
          <span class="material-symbols-outlined text-sm" :class="{'animate-spin': isRefreshing}">refresh</span>
          {{ isRefreshing ? $t('billing.balance.syncing') : $t('billing.balance.sync_data') }}
        </button>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="relative z-10 mt-10 grid grid-cols-2 gap-4 border-t border-slate-100 pt-7 transition-colors dark:border-white/5 sm:gap-5 sm:pt-8">
      <div class="group/stat rounded-xl border border-slate-100 bg-slate-50 p-5 shadow-sm transition-all hover:border-rose-500/30 dark:border-white/5 dark:bg-white/[0.02] dark:shadow-none sm:p-6">
        <div class="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-3 font-bold group-hover/stat:text-slate-900 dark:group-hover/stat:text-white/50 transition-colors">{{ $t('billing.balance.plan_limit') }}</div>
        <div class="text-3xl font-bold text-rose-600 dark:text-red-400 font-['Space_Grotesk'] transition-colors">{{ formattedPlanLimit }}</div>
        <div class="mt-1 text-[10px] font-semibold text-slate-400 dark:text-white/35">
          {{ $t('billing.balance.plan_remaining') }}: {{ formattedPlanRemaining }}
        </div>
      </div>
      <div class="group/stat rounded-xl border border-slate-100 bg-slate-50 p-5 shadow-sm transition-all hover:border-cyan-500/30 dark:border-white/5 dark:bg-white/[0.02] dark:shadow-none sm:p-6">
        <div class="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mb-3 font-bold group-hover/stat:text-slate-900 dark:group-hover/stat:text-white/50 transition-colors">{{ $t('billing.balance.topup_balance') }}</div>
        <div class="text-3xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ formattedTopupTokens }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  organizationId: {
    type: String,
    default: ''
  }
})

const isRefreshing = ref(false)
const { t, locale } = useI18n()

// 1. Lấy thông tin Profile Đối tác
const profile = useCookie('orbit_ai_user')
const partnerName = computed(() => profile.value?.name || profile.value?.email || 'Đối tác AI')

// 2. Lấy số dư từ API
const config = useRuntimeConfig()
const accessToken = useCookie('accessToken')
const { data: balanceData, refresh: refreshBalanceData } = await useFetch('/partner/billing/balance', { 
  baseURL: config.public.apiBase,
  headers: computed(() => ({
    'Authorization': `Bearer ${accessToken.value}`,
    'Accept': 'application/json',
    ...(props.organizationId ? { 'X-Organization-Id': props.organizationId } : {})
  })),
  key: 'billing_balance'
})

// 3. Tính toán số dư
const availableBalance = computed(() => {
  if (!balanceData.value) return 0
  if (balanceData.value.data?.total_available_tokens !== undefined) return balanceData.value.data.total_available_tokens
  if (balanceData.value.total_available_tokens !== undefined) return balanceData.value.total_available_tokens
  return 0
})

const balancePayload = computed(() => balanceData.value?.data ?? balanceData.value ?? {})
const planTokenLimit = computed(() => balancePayload.value?.plan_token_limit ?? balancePayload.value?.tokens_limit ?? 0)
const planRemaining = computed(() => balancePayload.value?.plan_remaining_tokens ?? 0)
const topupTokens = computed(() => balancePayload.value?.topup_tokens ?? 0)

const formatTokenValue = (rawValue) => {
  const val = Number(rawValue ?? 0)
  if (val === -1) return t('pricing_ui.unlimited')
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return (val / 1000).toFixed(1) + 'k';
  return new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(val)
}

const formattedPlanLimit = computed(() => formatTokenValue(planTokenLimit.value))
const formattedPlanRemaining = computed(() => formatTokenValue(planRemaining.value))

const formattedTopupTokens = computed(() => {
  return formatTokenValue(topupTokens.value)
})

const formattedBalanceValue = computed(() => {
  const val = availableBalance.value
  if (val === -1) return t('pricing_ui.unlimited')
  if (val >= 1000000) {
    return (val / 1000000).toFixed(1) + 'M'
  }
  return new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(val)
})

const handleRefresh = async () => {
  isRefreshing.value = true
  await refreshBalanceData()
  setTimeout(() => { isRefreshing.value = false }, 800)
}
</script>

<style scoped>
.shimmer-text {
  display: inline-block;
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 5s linear infinite;
  background-image: linear-gradient(90deg, #1e293b, #00f0ff, #1e293b);
  transition: color 0.5s;
}

.dark .shimmer-text {
  background-image: linear-gradient(90deg, #fff, #00f0ff, #fff);
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
</style>
