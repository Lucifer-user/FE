<template>
  <div class="w-full font-['Inter']">
    <div class="mb-8">
      <h2 class="text-3xl font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white mb-2">
        {{ $t('partner.integrations.title') }}
      </h2>
      <p class="text-sm text-slate-500 dark:text-white/60">
        {{ $t('partner.integrations.subtitle') }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
      <section class="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden">
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

        <div class="flex items-start justify-between gap-4 mb-6 relative z-10">
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-cyan-600 dark:text-cyan-400 text-2xl">web</span>
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-slate-900 dark:text-white text-lg font-['Space_Grotesk']">{{ $t('partner.integrations.website_widget') }}</h3>
              <p class="text-xs text-slate-500 dark:text-white/50">{{ $t('partner.integrations.widget_desc') }}</p>
            </div>
          </div>
          <span class="shrink-0 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-emerald-500/20">
            {{ $t('partner.integrations.ready') }}
          </span>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-10">
          <div class="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span class="ml-3 text-xs text-slate-500 dark:text-white/60 font-bold uppercase tracking-widest">{{ $t('partner.integrations.loading_bots') }}</span>
        </div>

        <div v-else-if="errorMessage" class="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-sm text-rose-700 dark:text-rose-300">
          {{ errorMessage }}
        </div>

        <div v-else-if="bots.length === 0" class="flex flex-col items-center justify-center py-10 text-center">
          <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-white/20 mb-3">robot_2</span>
          <p class="text-sm text-slate-500 dark:text-white/60">{{ $t('partner.integrations.need_bot') }}</p>
        </div>

        <div v-else class="flex flex-col gap-5 relative z-10">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold">{{ $t('partner.integrations.select_bot') }}</label>
            <div class="relative">
              <select
                v-model="selectedBot"
                class="w-full appearance-none bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
              >
                <option disabled value="">{{ $t('partner.integrations.select_option') }}</option>
                <option v-for="bot in bots" :key="bot.id" :value="bot.id">{{ bot.name }}</option>
              </select>
              <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-white/40">
                <span class="material-symbols-outlined text-lg">expand_more</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold">{{ $t('partner.integrations.embed_code') }}</label>
            <div class="relative">
              <textarea
                readonly
                :value="embedScript"
                rows="3"
                class="w-full bg-slate-100 dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-xl p-4 pr-12 text-xs font-mono text-slate-700 dark:text-cyan-300/80 outline-none resize-none"
              ></textarea>
              <button
                @click="copyScript"
                :disabled="!selectedBot"
                class="absolute top-2 right-2 p-2 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-white/60 hover:text-cyan-600 dark:hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                :title="copied ? $t('partner.integrations.copied') : $t('partner.integrations.copy_code')"
              >
                <span class="material-symbols-outlined text-[18px]">{{ copied ? 'check' : 'content_copy' }}</span>
              </button>
            </div>
            <p v-if="copied" class="text-xs text-emerald-500 font-medium">{{ $t('partner.integrations.copied_clipboard') }}</p>
          </div>

          <div class="p-3 bg-blue-50 dark:bg-cyan-500/10 border border-blue-100 dark:border-cyan-500/20 rounded-xl flex items-start gap-3">
            <span class="material-symbols-outlined text-blue-500 dark:text-cyan-400 text-[18px] mt-0.5">info</span>
            <p class="text-xs text-blue-700 dark:text-cyan-100/70 leading-relaxed">
              {{ $t('partner.integrations.embed_hint') }}
            </p>
          </div>
        </div>
      </section>

      <TelegramIntegrationCard
        :organization-id="organizationId"
        :bots="bots"
      />

      <section v-for="channel in comingSoonChannels" :key="channel.name" class="bg-white/50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 rounded-3xl p-6 shadow-sm flex flex-col">
        <div class="flex items-start justify-between gap-4 mb-6 opacity-70">
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/5 flex items-center justify-center flex-shrink-0">
              <span class="material-symbols-outlined text-2xl" :class="channel.color">{{ channel.icon }}</span>
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-slate-900 dark:text-white text-lg font-['Space_Grotesk']">{{ channel.name }}</h3>
              <p class="text-xs text-slate-500 dark:text-white/50">{{ channel.description }}</p>
            </div>
          </div>
          <span class="shrink-0 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-amber-500/20">
            {{ $t('partner.integrations.coming_soon') }}
          </span>
        </div>

        <div class="flex-1 flex flex-col gap-4 opacity-50 pointer-events-none">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold">{{ channel.fieldLabel }}</label>
            <input
              type="text"
              :placeholder="$t('partner.integrations.token_placeholder')"
              disabled
              class="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none"
            />
          </div>
          <button disabled class="mt-auto w-full py-3 bg-slate-200 dark:bg-white/5 text-slate-400 dark:text-white/30 rounded-xl text-[11px] font-bold uppercase tracking-widest">
            {{ $t('partner.integrations.configuring') }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TelegramIntegrationCard from '../../features/telegram/components/TelegramIntegrationCard.vue'

const props = defineProps({
  organizationId: { type: String, default: '' }
})

const { t } = useI18n()

const config = useRuntimeConfig()
const loading = ref(false)
const bots = ref([])
const selectedBot = ref('')
const copied = ref(false)
const errorMessage = ref('')

const comingSoonChannels = computed(() => [
  {
    name: 'Zalo OA',
    description: t('partner.integrations.zalo_desc'),
    fieldLabel: 'Zalo Access Token',
    icon: 'forum',
    color: 'text-[#0190F3]'
  },
  {
    name: 'Facebook Messenger',
    description: t('partner.integrations.facebook_desc'),
    fieldLabel: 'Page Access Token',
    icon: 'chat',
    color: 'text-[#006AFF]'
  }
])

const embedScript = computed(() => {
  if (!selectedBot.value) return ''

 
 const localWidgetUrl = process.client ? `${window.location.origin}/orbit-widget.js` : '/orbit-widget.js'
   return `<script src="${localWidgetUrl}" data-bot-id="${selectedBot.value}" data-api-base="http://127.0.0.1:8000/api"><\/script>`

  
})

const copyScript = async () => {
  if (!embedScript.value || !process.client) return

  try {
    await navigator.clipboard.writeText(embedScript.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    errorMessage.value = t('partner.integrations.copy_manual')
  }
}

const fetchBots = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const accessToken = useCookie('accessToken')
    const response = await $fetch(`${config.public.apiBase}/auth/partner-services`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        Accept: 'application/json',
        ...(props.organizationId ? { 'X-Organization-Id': props.organizationId } : {})
      }
    })

    bots.value = (Array.isArray(response?.data) ? response.data : []).filter(
      bot => bot.status === 'active' && !bot.is_plan_locked
    )
    selectedBot.value = bots.value[0]?.id || ''
  } catch (error) {
    bots.value = []
    selectedBot.value = ''
    errorMessage.value = t('partner.integrations.bots_load_error')
  } finally {
    loading.value = false
  }
}

watch(
  () => props.organizationId,
  (organizationId) => {
    if (organizationId) fetchBots()
  },
  { immediate: true }
)
</script>

<style scoped>
select option {
  background: white;
  color: black;
}

.dark select option {
  background: #1a1a1a;
  color: white;
}
</style>
