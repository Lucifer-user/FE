<template>
  <div class="glass-container rounded-[1.5rem] border border-slate-200/90 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)] transition-colors duration-500 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none sm:p-8 animate-in slide-in-from-bottom-4 duration-700">
    <div class="mb-8 flex items-center justify-between gap-4">
      <div>
        <h3 class="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-slate-900 transition-colors dark:text-white sm:text-2xl">{{ $t('billing.history.title') }}</h3>
        <p class="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors dark:text-white/30">{{ $t('billing.history.subtitle') }}</p>
      </div>
      <button type="button" @click="exportCsv" :disabled="exporting" class="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-cyan-600 shadow-sm transition-all hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-cyan-400 dark:hover:bg-white/10 dark:hover:text-white">
        <span v-if="exporting" class="material-symbols-outlined animate-spin text-sm">sync</span>
        <span v-else class="material-symbols-outlined text-sm">download</span>
        {{ $t('billing.history.export') }}
      </button>
    </div>

    <div class="custom-scrollbar min-h-[360px] overflow-x-auto">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5 font-bold transition-colors">
            <th class="pb-4">{{ $t('billing.history.col_date') }}</th>
            <th class="pb-4">{{ $t('billing.history.col_hash') }}</th>
            <th class="pb-4">{{ $t('billing.history.transaction') }}</th>
            <th class="pb-4 text-right">{{ $t('billing.history.tokens') }}</th>
            <th class="pb-4 text-right">{{ $t('billing.history.col_value') }}</th>
            <th class="pb-4 text-right">{{ $t('billing.history.col_status') }}</th>
          </tr>
        </thead>
        <tbody class="text-sm text-slate-700 dark:text-white/80 divide-y divide-slate-100 dark:divide-white/5">
          <tr v-for="tx in history" :key="tx.id" class="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all duration-300">
            <td class="py-6 text-slate-400 dark:text-white/40 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              <div>{{ tx.date }}</div>
              <div class="text-[10px] opacity-60 mt-0.5">{{ tx.time }}</div>
            </td>
            <td class="py-6 font-mono text-xs text-slate-300 dark:text-white/20 group-hover:text-cyan-600 dark:group-hover:text-cyan-400/60 transition-colors uppercase">{{ tx.id }}</td>
            
            <td class="py-6">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-sm" :class="tx.paymentType === 'token_topup' ? 'text-emerald-500' : 'text-purple-500'">
                   {{ tx.paymentType === 'token_topup' ? 'electric_bolt' : 'workspace_premium' }}
                </span>
                <span class="text-xs font-bold text-slate-700 dark:text-white/80">
                   {{ tx.paymentType === 'token_topup' ? $t('billing.history.token_topup') : $t('billing.history.plan_upgrade') }}
                </span>
              </div>
            </td>
            
            <td class="py-6 text-right">
               <span v-if="tx.purchasedTokens" class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-md text-[10px] font-bold font-['Space_Grotesk'] border border-emerald-500/20">
                 +{{ formatNumber(tx.purchasedTokens) }}
               </span>
               <span v-else class="text-slate-300 dark:text-white/20 text-xs">-</span>
            </td>
            
            <td class="py-6 text-right font-['Space_Grotesk'] font-bold text-slate-700 dark:text-white/80 transition-colors">
               {{ formatCurrency(tx.amount) }}
            </td>
            
            <td class="py-6 text-right">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all" :class="getStatusStyles(tx.status)">
                <span class="w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse" :class="tx.status === 'success' || tx.status === 'completed' || tx.status === 'paid' ? 'bg-cyan-600 dark:bg-cyan-400' : 'bg-amber-500'"></span>
                <span class="text-[9px] font-bold uppercase tracking-widest">{{ getStatusText(tx.status) }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!history?.length && !pending" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-20 h-20 rounded-full bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex items-center justify-center mb-6 transition-colors">
          <span class="material-symbols-outlined text-slate-200 dark:text-white/10 text-4xl">inbox</span>
        </div>
        <h3 class="text-slate-400 dark:text-white/40 font-bold uppercase tracking-widest text-xs transition-colors">{{ $t('billing.history.no_transactions') }}</h3>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between transition-colors">
       <span class="text-[10px] text-slate-300 dark:text-white/20 uppercase font-bold tracking-widest transition-colors">{{ $t('billing.history.page') }} {{ currentPage }} {{ $t('billing.history.of') }} {{ totalPages }}</span>
       <div class="flex gap-2">
          <button @click="prevPage" :disabled="currentPage <= 1" class="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-20 transition-all">
             <span class="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button @click="nextPage" :disabled="currentPage >= totalPages" class="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-20 transition-all">
             <span class="material-symbols-outlined text-sm">chevron_right</span>
          </button>
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

const { t, locale } = useI18n()

const config = useRuntimeConfig()
const accessToken = useCookie('accessToken')
const toast = useToast()
const currentPage = ref(1)
const pageSize = ref(5)
const exporting = ref(false)

const { data: paymentsData, pending, refresh } = await useFetch('/partner/billing/payments/list', { 
  baseURL: config.public.apiBase,
  headers: computed(() => ({
    'Authorization': `Bearer ${accessToken.value}`,
    'Accept': 'application/json',
    ...(props.organizationId ? { 'X-Organization-Id': props.organizationId } : {})
  })),
  query: computed(() => ({ 
    page: currentPage.value, 
    page_size: pageSize.value 
  })),
  lazy: true,
  server: false
})

const totalCount = computed(() => {
  const res = paymentsData.value
  return res?.pagination?.total ?? res?.count ?? res?.data?.count ?? res?.total ?? res?.data?.total ?? 0
})
const totalPages = computed(() => {
  const res = paymentsData.value
  return res?.pagination?.last_page ?? Math.max(1, Math.ceil(totalCount.value / pageSize.value))
})

const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }

const history = computed(() => {
  const res = paymentsData.value
  const rawList = res?.data ?? []
  
  if (!Array.isArray(rawList)) return []

  return rawList.map(tx => {
    const { date, time } = formatDateTime(tx.execution_date)
    return {
      id: tx.hash || '---',
      tokenAmount: 0,
      amount: tx.amount || 0,
      method: tx.gateway || 'SePay',
      date: date,
      time: time,
      status: tx.status?.toLowerCase() || 'pending',
      paymentType: tx.payment_type,
      purchasedTokens: tx.purchased_tokens
    }
  })
})

const localeCode = computed(() => locale.value === 'vi' ? 'vi-VN' : 'en-US')
const formatNumber = (val) => new Intl.NumberFormat(localeCode.value).format(Math.floor(Number(val)))
const formatCurrency = (val) => new Intl.NumberFormat(localeCode.value, { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(val))
const formatDateTime = (dateStr) => {
  if (!dateStr) return { date: '---', time: '---' }
  const d = new Date(dateStr)
  return {
    date: new Intl.DateTimeFormat(localeCode.value, { day: '2-digit', month: 'short', year: 'numeric' }).format(d),
    time: new Intl.DateTimeFormat(localeCode.value, { hour: '2-digit', minute: '2-digit', hour12: false }).format(d)
  }
}

const getStatusStyles = (status) => {
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  if (status === 'success' || status === 'completed' || status === 'paid') {
    return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 shadow-sm dark:shadow-[0_0_15px_rgba(0,240,255,0.1)]'
  }
  return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
}

const getStatusText = (status) => {
  if (status === 'success' || status === 'completed' || status === 'paid') return t('billing.history.status_success')
  if (status === 'pending') return t('billing.history.status_pending')
  const key = `admin_billing.status_${status}`
  const translated = t(key)
  return translated === key ? status : translated
}

const exportCsv = async () => {
  exporting.value = true

  try {
    const blob = await $fetch('/partner/billing/payments/export-csv', {
      baseURL: config.public.apiBase,
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'text/csv',
        ...(props.organizationId ? { 'X-Organization-Id': props.organizationId } : {})
      },
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `billing_history_${new Date().getTime()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success(t('billing.history.export_success'))
  } catch (error) {
    console.error('Lỗi xuất lịch sử giao dịch:', error)
    toast.error(error?.data?.message || error?.response?._data?.message || t('billing.history.export_error'))
  } finally {
    exporting.value = false
  }
}

defineExpose({
  refreshHistory: () => {
     refresh()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.3);
}

/* Hide scrollbar for IE, Edge and Firefox */
.custom-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: thin;  /* Firefox */
  scrollbar-color: rgba(0, 240, 255, 0.1) transparent;
}
</style>
