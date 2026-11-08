<template>
  <div class="space-y-10 animate-in slide-in-from-right-4 duration-500">
    <div class="flex items-end justify-between mb-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] tracking-tight transition-colors">{{ $t('partner.billing.title') }}</h1>
        <p class="text-slate-500 dark:text-white/40 text-sm mt-1 transition-colors">{{ $t('partner.billing.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="refreshData" :class="{'opacity-50 pointer-events-none': isRefreshing}" class="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-white/60 uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all bg-white dark:bg-white/[0.02]">
          <span class="material-symbols-outlined text-sm" :class="{'animate-spin': isRefreshing}">refresh</span>
          {{ $t('billing.balance.sync_data') }}
        </button>
        <button @click="$emit('topup')" class="deposit-btn px-6 py-2.5 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 shadow-lg">
          <span class="material-symbols-outlined text-sm">add_card</span>
          {{ $t('partner.billing.instant_topup') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-10">
      <!-- Left: Wallet & History -->
      <div class="col-span-12 xl:col-span-8 space-y-10">
        <BillingBalanceCard :organization-id="organizationId" />
        <BillingHistoryTable :organization-id="organizationId" />
      </div>
      <!-- Right: Quick Action / Status -->
      <div class="col-span-12 xl:col-span-4 space-y-10">
        <div class="glass-card rounded-[2rem] p-10 flex flex-col bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors">
           <div class="flex items-center gap-3 text-slate-900 dark:text-white mb-8 transition-colors">
             <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400">workspace_premium</span>
             <h3 class="font-['Space_Grotesk'] text-xl font-bold">{{ $t('partner.overview.plan') }}</h3>
           </div>
           
           <div class="flex items-baseline gap-2 mb-6">
              <span class="text-3xl font-bold text-slate-900 dark:text-white uppercase">{{ organization?.plan_type || 'Chưa cấu hình' }}</span>
           </div>

           <div class="-mt-3 mb-6 text-xs font-semibold text-slate-500 dark:text-white/45">
              {{ $t('billing.balance.plan_limit') }}: {{ formatTokenLimit(organization?.token_limit) }}
           </div>

           <div class="space-y-4 mb-8">
              <div class="flex items-center gap-3 text-xs text-slate-600 dark:text-white/60">
                 <span class="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                 {{ $t('billing.balance.plan_quota') }}
              </div>
              <div class="flex items-center gap-3 text-xs text-slate-600 dark:text-white/60">
                 <span class="material-symbols-outlined text-emerald-500 text-sm">check_circle</span>
                 {{ $t('partner.billing.basic_org_management') }}
              </div>
           </div>

           <p class="text-[10px] text-slate-400 dark:text-white/40 italic mb-6">{{ $t('partner.billing.upgrade_hint') }}</p>

           <NuxtLink to="/pricing" class="w-full py-4 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-center block">
              {{ $t('partner.billing.upgrade_plan') }}
           </NuxtLink>
        </div>

        <!-- Token Topup Prompt -->
        <div class="glass-card rounded-[2rem] p-10 bg-gradient-to-br from-indigo-50 dark:from-cyan-900/20 to-cyan-50 dark:to-purple-900/20 border-indigo-200 dark:border-cyan-500/20 shadow-xl dark:shadow-none transition-colors">
           <h3 class="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-white mb-4 transition-colors">{{ $t('partner.billing.need_tokens') }}</h3>
           <p class="text-xs text-slate-500 dark:text-white/40 leading-relaxed mb-8 transition-colors">{{ $t('partner.billing.topup_note') }}</p>
           <button @click="$emit('topup')" class="deposit-btn w-full py-4 rounded-2xl text-[10px] font-bold text-white uppercase tracking-widest transition-all">{{ $t('partner.billing.buy_tokens') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  organizationId: {
    type: String,
    default: ''
  }
})

defineEmits(['topup'])

const organization = ref(null)
const isRefreshing = ref(false)

const formatTokenLimit = (rawValue) => {
   const value = Number(rawValue ?? 0)
   if (value === -1) return 'UNLIMITED'
   if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
   if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
   return new Intl.NumberFormat().format(value)
}

const refreshData = async () => {
   isRefreshing.value = true
   try {
      const config = useRuntimeConfig()
      const accessToken = useCookie('accessToken')
      
      const res = await $fetch(`${config.public.apiBase}/partner/organization/context`, {
        headers: { 
          'Authorization': `Bearer ${accessToken.value}`,
          ...(props.organizationId ? { 'X-Organization-Id': props.organizationId } : {})
        }
      })
      if (res?.current_organization) {
        organization.value = res.current_organization
      }
      
      refreshNuxtData()
   } catch (e) {
      console.error(e)
   } finally {
      setTimeout(() => {
         isRefreshing.value = false
      }, 500)
   }
}

onMounted(async () => {
    try {
      const config = useRuntimeConfig()
      const accessToken = useCookie('accessToken')
      const res = await $fetch(`${config.public.apiBase}/partner/organization/context`, {
        headers: { 
          'Authorization': `Bearer ${accessToken.value}`,
          ...(props.organizationId ? { 'X-Organization-Id': props.organizationId } : {})
        }
      })
      if (res?.current_organization) {
        organization.value = res.current_organization
      }
    } catch (e) {
      console.error(e)
    }
})
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.deposit-btn {
  background: linear-gradient(90deg, #00f0ff, #7701d0);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
  border: none;
  transition: all 0.3s ease;
}

.deposit-btn:hover {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.4);
  transform: translateY(-1px);
}
</style>
