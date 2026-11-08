<template>
  <div class="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
    <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] tracking-tight transition-colors">
          {{ $t('partner.data_ingestion.title') }} <span class="shimmer-text">{{ $t('partner.data_ingestion.title_highlight') }}</span>
          <span class="inline-flex h-3 w-3 relative ml-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.8)]"></span>
          </span>
        </h1>
        <p class="text-slate-500 dark:text-white/40 text-sm mt-1 max-w-xl transition-colors">
          {{ $t('partner.data_ingestion.subtitle') }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-4 bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/5 mb-4 shadow-sm">
      <div class="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400">smart_toy</span>
      </div>
      <div class="flex-1 relative">
        <p class="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">{{ $t('partner.data_ingestion.target_bot') }}</p>
        
        <button 
          @click="isDropdownOpen = !isDropdownOpen" 
          class="w-full text-left bg-transparent border-none p-0 text-sm font-bold text-slate-900 dark:text-white focus:ring-0 outline-none flex items-center justify-between"
        >
          <span v-if="ragBots.length === 0">{{ $t('partner.data_ingestion.no_bots') }}</span>
          <span v-else>
            {{ ragBots.find(b => b.id === selectedBotId)?.name || $t('partner.data_ingestion.select_bot_fallback') }} 
            <span class="text-xs font-medium opacity-60 ml-1">({{ ragBots.find(b => b.id === selectedBotId)?.status || 'N/A' }})</span>
          </span>
          <span class="material-symbols-outlined text-slate-400 transition-transform duration-300" :class="{'rotate-180': isDropdownOpen}">expand_more</span>
        </button>

        <div 
          v-if="isDropdownOpen" 
          class="absolute top-full mt-3 left-0 w-full min-w-[240px] bg-white dark:bg-[#111111] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2"
        >
          <div v-if="ragBots.length === 0" class="px-4 py-3 text-sm text-slate-500">{{ $t('partner.data_ingestion.no_bots') }}</div>
          <button 
            v-for="bot in ragBots" :key="bot.id"
            @click="selectBot(bot.id)"
            class="w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between"
            :class="selectedBotId === bot.id ? 'bg-cyan-50/50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold border-l-2 border-cyan-500' : 'text-slate-700 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5 border-l-2 border-transparent'"
          >
            <span>{{ bot.name }}</span>
            <span class="text-[10px] uppercase tracking-wider font-medium opacity-50">{{ bot.status }}</span>
          </button>
        </div>
      </div>
    </div>

    <PartnerRagV2TestPanel
      v-if="selectedBotId"
      :organization-id="organizationId"
      :bot-id="selectedBotId"
      :bot-name="ragBots.find(bot => bot.id === selectedBotId)?.name || ''"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRuntimeConfig, useCookie } from '#app'
import PartnerRagV2TestPanel from '~/components/partner/rag-v2/RagV2TestPanel.vue'

const props = defineProps({
  organizationId: {
    type: String,
    default: ''
  }
})

const config = useRuntimeConfig()
const token = useCookie('accessToken')
const { t } = useI18n()

const partnerBots = ref([])
const selectedBotId = ref('')
const isDropdownOpen = ref(false)

const organizationHeaders = () => {
  const organizationId = props.organizationId || (process.client ? localStorage.getItem('orbit_current_organization_id') : '')

  return {
    'Authorization': `Bearer ${token.value}`,
    'Accept': 'application/json',
    ...(organizationId ? { 'X-Organization-Id': organizationId } : {})
  }
}

const ragBots = computed(() => {
  return partnerBots.value.filter(bot => {
    let type = 'chat' 
    if (bot.ai_service && bot.ai_service.category) {
      type = bot.ai_service.category.type
    }
    return type === 'rag'
  })
})

const selectBot = (id) => {
  selectedBotId.value = id
  isDropdownOpen.value = false
}



watch(() => props.organizationId, async () => {
  partnerBots.value = []
  selectedBotId.value = ''
  
  try {
    const res = await $fetch(`${config.public.apiBase}/auth/partner-services`, {
      headers: organizationHeaders()
    })
    partnerBots.value = res.data || res || []
    if (ragBots.value.length > 0) {
      selectedBotId.value = ragBots.value[0].id
    }
  } catch (error) {
    console.error('Lỗi lấy danh sách Bot:', error)
  }
}, { immediate: true })
</script>

<style scoped>
.shimmer-text {
  background: linear-gradient(90deg, #00f0ff, #7701d0, #00f0ff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: 200% center;
  }
}

.luminous-btn {
  background: linear-gradient(90deg, #00f0ff, #7701d0);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
}

.luminous-btn:hover {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.4);
}
</style>
