<template>
  <div class="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] tracking-tight transition-colors">{{ $t('partner.aiconfig.title') }} <span class="shimmer-text">{{ $t('partner.aiconfig.title_highlight') }}</span></h1>
        <p class="text-slate-500 dark:text-white/40 text-sm mt-1 max-w-xl transition-colors">{{ $t('partner.aiconfig.subtitle') }}</p>
        <p v-if="organizationId" class="text-slate-400 dark:text-white/30 text-[10px] mt-2 font-mono bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md inline-block">Project ID: {{ organizationId }}</p>
      </div>
      <div class="flex gap-4">
        <button type="button" @click="exportConfigCsv" :disabled="exporting" class="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all disabled:pointer-events-none disabled:opacity-50">
          <span v-if="exporting" class="material-symbols-outlined mr-2 inline-block animate-spin align-middle text-sm">sync</span>
          <span v-else class="material-symbols-outlined mr-2 inline-block align-middle text-sm">download</span>
          {{ $t('partner.aiconfig.export_log') }}
        </button>
        <button @click="saveConfig" class="luminous-btn px-6 py-2.5 rounded-xl text-[10px] font-bold text-white dark:text-black uppercase tracking-widest shadow-lg dark:shadow-none transition-all" :class="{ 'opacity-50 pointer-events-none': saving }">
          <span v-if="saving" class="material-symbols-outlined text-sm animate-spin mr-2">sync</span>
          {{ saving ? 'SAVING...' : $t('partner.aiconfig.save_config') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <div class="col-span-12 xl:col-span-8 glass-card rounded-3xl p-10 flex flex-col gap-8 relative group overflow-hidden bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors">
        <div class="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/5 dark:bg-cyan-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/10 dark:group-hover:bg-cyan-500/20 transition-all duration-700"></div>
        
        <div class="flex justify-between items-start relative z-10">
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ $t('partner.aiconfig.global_token_throughput') }}</h3>
            <p class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] mt-1 font-bold transition-colors">{{ $t('partner.aiconfig.current_billing_cycle') }}</p>
          </div>
          <div class="bg-slate-50 dark:bg-white/5 px-4 py-1.5 rounded-full border border-slate-100 dark:border-white/5 flex items-center gap-2 transition-colors">
            <div class="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            <span class="text-[9px] font-bold text-slate-500 dark:text-white uppercase tracking-widest transition-colors">{{ $t('partner.aiconfig.live_sync') }}</span>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-10 items-end relative z-10">
          <div class="flex-1 w-full">
            <div class="flex items-baseline gap-3 mb-4 transition-colors">
              <span class="text-6xl font-bold text-cyan-600 dark:text-cyan-400 font-['Space_Grotesk']">{{ formatTokens(totalTokenUsage) }}</span>
              <span class="text-sm text-slate-400 dark:text-white/20">/ {{ tokenLimitLabel }} {{ $t('partner.aiconfig.limit') }}</span>
            </div>
            <div v-if="tokenLimit !== -1" class="mb-4 rounded-2xl border px-4 py-3 text-xs transition-colors"
              :class="quotaExceeded ? 'border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400' : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'">
              <div class="flex items-center justify-between gap-3">
                <span class="font-bold uppercase tracking-widest">{{ $t('partner.aiconfig.allocated_quota') }}</span>
                <span class="font-data-mono font-bold">{{ allocatedQuota.toLocaleString() }} / {{ tokenLimit.toLocaleString() }} TKN</span>
              </div>
              <p class="mt-1 text-[11px] opacity-80">
                {{ quotaExceeded
                  ? $t('partner.aiconfig.quota_exceeded', { amount: Math.abs(quotaRemaining).toLocaleString() })
                  : $t('partner.aiconfig.quota_remaining', { amount: quotaRemaining.toLocaleString() }) }}
              </p>
            </div>
            <div class="w-full h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden relative transition-colors">
              <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 dark:from-purple-600 to-cyan-600 dark:to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] rounded-full transition-all" :style="{ width: quotaProgressWidth + '%' }"></div>
              <div class="absolute top-0 left-[65%] h-full w-[1px] bg-slate-200 dark:bg-white/20 z-10 transition-colors"></div>
            </div>
            <div class="flex justify-between mt-3 text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest transition-colors">
              <span>0</span>
              <span>{{ $t('partner.aiconfig.projected') }}: 6.5M</span>
              <span>{{ tokenLimitLabel }} {{ $t('partner.aiconfig.max') }}</span>
            </div>
          </div>
          <div class="flex flex-row md:flex-col gap-4 shrink-0">
            <div class="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 min-w-[140px] transition-colors">
              <span class="text-[9px] text-slate-400 dark:text-white/30 font-bold uppercase tracking-widest block mb-2 transition-colors">{{ $t('partner.aiconfig.avg_latency') }}</span>
              <span class="text-2xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ latencyMs }}ms</span>
            </div>
            <div class="bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-100 dark:border-white/5 min-w-[140px] transition-colors">
              <span class="text-[9px] text-slate-400 dark:text-white/30 font-bold uppercase tracking-widest block mb-2 transition-colors">{{ $t('partner.aiconfig.active_models') }}</span>
              <span class="text-2xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ nodes.length }} {{ $t('partner.aiconfig.types') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-4 glass-card rounded-3xl p-10 flex flex-col gap-8 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors">
        <div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] mb-2 transition-colors">{{ $t('partner.aiconfig.failover_policy') }}</h3>
          <p class="text-xs text-slate-500 dark:text-white/40 leading-relaxed transition-colors">{{ $t('partner.aiconfig.failover_desc') }}</p>
        </div>
        <div class="flex flex-col gap-4 mt-auto">
          <label v-for="policy in [
            { id: 'local', label: $t('partner.aiconfig.drop_to_local'), icon: 'psychology' },
            { id: 'stop', label: $t('partner.aiconfig.hard_stop'), icon: 'block' }
          ]" :key="policy.id" 
            @click="failoverPolicy = policy.id"
            class="flex items-center justify-between p-4 rounded-2xl border bg-slate-50 dark:bg-white/5 cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-white/10"
            :class="failoverPolicy === policy.id ? 'border-cyan-500/40 bg-slate-100 dark:bg-white/10' : 'border-slate-100 dark:border-white/5'">
            <div class="flex items-center gap-4">
              <span class="material-symbols-outlined text-lg transition-colors" :class="policy.id === 'stop' ? 'text-rose-500 dark:text-red-400' : 'text-indigo-600 dark:text-purple-400'">{{ policy.icon }}</span>
              <span class="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-widest transition-colors">{{ policy.label }}</span>
            </div>
            <div class="w-4 h-4 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center transition-colors">
              <div v-if="failoverPolicy === policy.id" class="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            </div>
          </label>
        </div>
      </div>

      <div class="col-span-12 mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="flex items-center gap-6 flex-1 w-full">
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ $t('partner.aiconfig.node_configuration') }}</h2>
          <div class="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent transition-all"></div>
        </div>
        <div class="relative w-full md:w-64">
           <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
           <input v-model="searchQuery" type="text" placeholder="Search nodes..." class="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500/50 transition-all" />
        </div>
      </div>

      <div v-for="node in displayedNodes" :key="node.id" class="col-span-12 lg:col-span-6 glass-card rounded-3xl p-10 flex flex-col gap-8 group hover:border-cyan-500/30 transition-all duration-300 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none">
        <div class="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-6 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 shadow-inner transition-colors">
              <span class="material-symbols-outlined text-xl transition-colors" :class="node.color === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' : 'text-indigo-600 dark:text-purple-400'">{{ node.icon }}</span>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ node.name }}</h3>
          </div>
          <span class="px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all" 
            :class="node.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-white/30 border-slate-200 dark:border-white/10'">
            {{ node.tier }}
          </span>
        </div>

        <div class="space-y-3">
          <span class="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] transition-colors">{{ $t('partner.aiconfig.auth_model_arch') }}</span>
          <div class="flex flex-wrap gap-2">
            <button v-for="m in node.models" :key="m" 
              @click="node.activeModel = m"
              class="px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all"
              :class="m === node.activeModel ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 shadow-sm' : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-white/30 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'">
              {{ m }}
            </button>
          </div>
        </div>

        <div class="bg-slate-50 dark:bg-black/40 p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6 transition-colors">
          <div class="flex justify-between items-end">
            <span class="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] transition-colors">{{ $t('partner.aiconfig.monthly_token_quota') }}</span>
            <div class="flex items-center gap-2">
              <input type="number" v-model="node.quota" class="bg-transparent border-b border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold text-right text-lg focus:border-cyan-600 dark:focus:border-cyan-400 outline-none w-32 pb-1 transition-all" />
              <span class="text-[10px] text-slate-400 dark:text-white/20 font-bold transition-colors">TKN</span>
            </div>
          </div>
          <div class="relative h-2 bg-slate-200 dark:bg-white/5 rounded-full transition-colors group/bar">
            <div class="absolute h-full rounded-full bg-gradient-to-r from-indigo-600 dark:from-purple-600 to-cyan-600 dark:to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all" :style="{ width: nodeQuotaPercent(node) + '%' }"></div>
            <div class="absolute w-5 h-5 bg-white dark:bg-cyan-400 border-2 border-cyan-600 dark:border-transparent rounded-full top-1/2 -translate-y-1/2 shadow-lg dark:shadow-[0_0_15px_rgba(0,240,255,1)] cursor-pointer transition-all hover:scale-125 group-hover/bar:border-cyan-400" :style="{ left: nodeQuotaPercent(node) + '%' }"></div>
            
            <div class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20">
              Đã tiêu thụ: {{ node.tokens_used ? node.tokens_used.toLocaleString() : 0 }} TKN
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45"></div>
            </div>
          </div>
          <div class="flex justify-between text-[9px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest transition-colors">
            <span>0</span>
            <span>{{ tokenLimitLabel }} {{ $t('partner.aiconfig.max') }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasMoreNodes" class="flex justify-center mt-6">
      <button @click="loadMoreNodes" class="px-6 py-2.5 rounded-full border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">expand_more</span>
        Load More
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  organizationId: {
    type: String,
    required: false,
    default: ''
  }
})

const emit = defineEmits(['save'])
const toast = useToast()
const { t } = useI18n()
const config = useRuntimeConfig()

const saving = ref(false)
const exporting = ref(false)
const totalTokenUsage = ref(0)
const tokenLimit = ref(0)
const latencyMs = ref(0)
const failoverPolicy = ref('local')

const nodes = ref([])

const searchQuery = ref('')
const itemsPerPage = ref(4)

const formatTokens = (val) => {
  if (val == null) return '0'
  if (val === 0) return '0'
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
  return val.toString()
}

const filteredNodes = computed(() => {
  if (!searchQuery.value) return nodes.value
  return nodes.value.filter(n => n.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const activeQuotaNodes = computed(() => {
  return nodes.value.filter(node => (node.status || 'active') === 'active' && !node.is_plan_locked)
})

const allocatedQuota = computed(() => {
  return activeQuotaNodes.value.reduce((sum, node) => sum + (Number(node.quota) || 0), 0)
})

const quotaRemaining = computed(() => {
  if (tokenLimit.value === -1) return -1
  return (Number(tokenLimit.value) || 0) - allocatedQuota.value
})

const quotaExceeded = computed(() => {
  return tokenLimit.value !== -1 && quotaRemaining.value < 0
})

const tokenLimitLabel = computed(() => tokenLimit.value === -1
  ? '∞'
  : formatTokens(Number(tokenLimit.value) || 0))

const quotaProgressWidth = computed(() => tokenLimit.value === -1 || tokenLimit.value <= 0
  ? 0
  : Math.min((totalTokenUsage.value / tokenLimit.value) * 100, 100))

const nodeQuotaPercent = (node) => tokenLimit.value === -1 || tokenLimit.value <= 0
  ? 0
  : Math.min((Number(node.quota) || 0) / tokenLimit.value * 100, 100)

const displayedNodes = computed(() => {
  return filteredNodes.value.slice(0, itemsPerPage.value)
})

const hasMoreNodes = computed(() => {
  return itemsPerPage.value < filteredNodes.value.length
})

const loadMoreNodes = () => {
  itemsPerPage.value += 4
}

const fetchConfig = async () => {
  nodes.value = []
  try {
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${useCookie('accessToken').value}`
    }
    if (props.organizationId) {
      headers['X-Organization-Id'] = props.organizationId
    }

    const res = await $fetch(`${config.public.apiBase}/partner/ai-config`, {
      headers
    })
    if (res.success) {
      totalTokenUsage.value = res.data.total_token_usage
      tokenLimit.value = res.data.token_limit
      latencyMs.value = res.data.latency_ms
      failoverPolicy.value = res.data.failover_policy
      nodes.value = res.data.nodes || []
    }
  } catch (error) {
    console.error("Failed to fetch config:", error)
    toast.error(t('partner.aiconfig.error_load_config'))
  }
}

const exportConfigCsv = async () => {
  exporting.value = true

  try {
    const headers = {
      'Accept': 'text/csv',
      'Authorization': `Bearer ${useCookie('accessToken').value}`
    }
    if (props.organizationId) {
      headers['X-Organization-Id'] = props.organizationId
    }

    const blob = await $fetch(`${config.public.apiBase}/partner/ai-config/export-csv`, {
      headers,
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ai_config_${new Date().getTime()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success(t('partner.aiconfig.export_success'))
  } catch (error) {
    console.error('Failed to export AI configuration:', error)
    toast.error(error?.data?.message || error?.response?._data?.message || t('partner.aiconfig.error_export_log'))
  } finally {
    exporting.value = false
  }
}

const saveConfig = async () => {
  if (quotaExceeded.value) {
    toast.error($t('partner.aiconfig.quota_submit_blocked', { amount: Math.abs(quotaRemaining.value).toLocaleString() }))
    return
  }

  saving.value = true
  try {
    const payload = {
      failover_policy: failoverPolicy.value,
      nodes: nodes.value
    }
    
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${useCookie('accessToken').value}`
    }
    if (props.organizationId) {
      headers['X-Organization-Id'] = props.organizationId
    }

    await $fetch(`${config.public.apiBase}/partner/ai-config/save`, {
      method: 'POST',
      body: payload,
      headers
    })
    
    toast.success(t('partner.aiconfig.success_save_config'))
    emit('save')
  } catch (error) {
    console.error("Failed to save config:", error)
    toast.error(error?.data?.message || error?.response?._data?.message || t('partner.aiconfig.error_save_config'))
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchConfig()
})

watch(() => props.organizationId, () => {
  nodes.value = []
  searchQuery.value = ''
  itemsPerPage.value = 4
  fetchConfig()
})
</script>

<style scoped>
.glass-card {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.luminous-btn {
  background: linear-gradient(90deg, #00f0ff, #7701d0);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
}

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
