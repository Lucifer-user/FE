<template>
  <section class="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden">
    <div class="flex items-start justify-between gap-4 mb-6">
      <div class="flex items-center gap-4 min-w-0">
        <div class="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-[#229ED9] text-2xl">send</span>
        </div>
        <div class="min-w-0">
          <h3 class="font-bold text-slate-900 dark:text-white text-lg font-['Space_Grotesk']">
            {{ t('partner.integrations.telegram_title') }}
          </h3>
          <p class="text-xs text-slate-500 dark:text-white/50">
            {{ t('partner.integrations.telegram_desc') }}
          </p>
        </div>
      </div>
      <span class="shrink-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg border" :class="statusClass">
        {{ statusLabel }}
      </span>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else class="flex flex-col gap-5">
      <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-700 dark:text-rose-300">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
        {{ successMessage }}
      </div>

      <div class="flex flex-col gap-2">
        <label class="field-label">{{ t('partner.integrations.select_bot') }}</label>
        <BaseSelect
          v-model="selectedBotId"
          :options="[
            { value: '', label: t('partner.integrations.select_option') },
            ...bots.map(b => ({ value: String(b.id), label: b.name }))
          ]"
          buttonClass="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all"
        />
      </div>

      <template v-if="currentIntegration?.hasToken">
        <div class="rounded-xl border border-sky-100 dark:border-sky-500/20 bg-sky-50/70 dark:bg-sky-500/10 p-4 flex items-center justify-between gap-4">
          <div class="min-w-0">
            <p class="text-xs text-slate-500 dark:text-white/50">{{ t('partner.integrations.telegram_bot') }}</p>
            <p class="font-bold text-slate-900 dark:text-white truncate">
              @{{ currentIntegration.botUsername || currentIntegration.name }}
            </p>
          </div>
          <span class="material-symbols-outlined text-emerald-500">verified</span>
        </div>

        <div class="rounded-xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-500/10 p-3 flex gap-3">
          <span class="material-symbols-outlined text-emerald-500 text-lg">forum</span>
          <div class="min-w-0">
            <p class="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {{ t('partner.integrations.private_chat_ready') }}
            </p>
            <p class="text-[11px] text-emerald-600/80 dark:text-emerald-300/70">
              {{ currentIntegration.lastWebhookAt
                ? t('partner.integrations.last_webhook_at', { time: formatDateTime(currentIntegration.lastWebhookAt) })
                : t('partner.integrations.waiting_first_message') }}
            </p>
          </div>
        </div>

        <div v-if="currentIntegration.lastError" class="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-700 dark:text-rose-300">
          {{ currentIntegration.lastError }}
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label class="setting-row">
            <span>{{ t('partner.integrations.private_chat') }}</span>
            <input v-model="privateChatEnabled" type="checkbox" class="accent-sky-500" />
          </label>
          <label class="setting-row">
            <span>{{ t('partner.integrations.group_chat_phase4') }}</span>
            <input v-model="groupChatEnabled" type="checkbox" class="accent-sky-500" disabled />
          </label>
        </div>

        <div v-if="groupChatEnabled" class="flex flex-col gap-2">
          <label class="field-label">{{ t('partner.integrations.group_reply_mode') }}</label>
          <BaseSelect
            v-model="groupReplyMode"
            :options="[
              { value: TELEGRAM_GROUP_REPLY_MODE.MENTION_OR_REPLY, label: t('partner.integrations.mention_or_reply') },
              { value: TELEGRAM_GROUP_REPLY_MODE.COMMAND_ONLY, label: t('partner.integrations.command_only') },
              { value: TELEGRAM_GROUP_REPLY_MODE.ALL_MESSAGES, label: t('partner.integrations.all_messages') }
            ]"
            buttonClass="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>

        <div v-if="pendingUpdates !== null" class="text-xs text-slate-500 dark:text-white/50">
          {{ t('partner.integrations.webhook_pending', { count: pendingUpdates }) }}
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-auto">
          <button class="secondary-button" :disabled="busy" @click="handleRefresh">
            <span class="material-symbols-outlined text-base">refresh</span>
            {{ t('partner.integrations.refresh_status') }}
          </button>
          <button class="primary-button" :disabled="busy" @click="handleSaveSettings">
            <span class="material-symbols-outlined text-base">save</span>
            {{ t('partner.integrations.save_settings') }}
          </button>
          <button class="danger-button col-span-2 sm:col-span-1" :disabled="busy" @click="handleDisconnect">
            <span class="material-symbols-outlined text-base">link_off</span>
            {{ t('partner.integrations.disconnect') }}
          </button>
        </div>
      </template>

      <template v-else>
        <div class="flex flex-col gap-2">
          <label class="field-label">{{ t('partner.integrations.bot_token') }}</label>
          <div class="flex gap-2">
            <div class="relative flex-1">
              <input
                v-model.trim="token"
                :type="showToken ? 'text' : 'password'"
                :placeholder="t('partner.integrations.token_placeholder')"
                autocomplete="off"
                class="field-control pr-11"
              />
              <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" @click="showToken = !showToken">
                <span class="material-symbols-outlined text-lg">{{ showToken ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <button class="secondary-button px-4" :disabled="busy || !token" @click="handleTestToken">
              {{ t('partner.integrations.test_token') }}
            </button>
          </div>
          <p class="text-[11px] text-slate-400 dark:text-white/40">{{ t('partner.integrations.bot_token_hint') }}</p>
        </div>

        <div v-if="testedBot" class="rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 p-3 flex items-center gap-3">
          <span class="material-symbols-outlined text-emerald-500">verified</span>
          <div class="min-w-0">
            <p class="text-xs font-bold text-emerald-700 dark:text-emerald-300">{{ t('partner.integrations.token_valid') }}</p>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 truncate">@{{ testedBot.username || testedBot.first_name }}</p>
          </div>
        </div>

        <button class="primary-button w-full py-3 mt-auto" :disabled="busy || !selectedBotId || !token" @click="handleConnect">
          <span v-if="busy" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span v-else class="material-symbols-outlined text-lg">link</span>
          {{ t('partner.integrations.connect_telegram') }}
        </button>

        <p class="text-[11px] text-slate-400 dark:text-white/40 text-center">
          {{ t('partner.integrations.webhook_https_note') }}
        </p>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseSelect from '~/components/shared/BaseSelect.vue'
import { TELEGRAM_GROUP_REPLY_MODE } from '../constants'
import { useTelegramIntegration } from '../composables/useTelegramIntegration'

const props = defineProps({
  organizationId: { type: String, default: '' },
  bots: { type: Array, default: () => [] }
})

const { t, locale } = useI18n()
const organizationIdRef = computed(() => props.organizationId)
const {
  integrations,
  loading,
  fetchIntegrations,
  testToken,
  connect,
  refreshStatus,
  updateSettings,
  disconnect
} = useTelegramIntegration(organizationIdRef)

const selectedBotId = ref('')
const token = ref('')
const showToken = ref(false)
const testedBot = ref(null)
const busy = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const pendingUpdates = ref(null)
const privateChatEnabled = ref(true)
const groupChatEnabled = ref(false)
const groupReplyMode = ref(TELEGRAM_GROUP_REPLY_MODE.MENTION_OR_REPLY)

const currentIntegration = computed(() => integrations.value.find(
  item => String(item.partnerServiceId) === String(selectedBotId.value)
))

const statusLabel = computed(() => {
  if (currentIntegration.value?.status === 'active') return t('partner.integrations.connected')
  if (currentIntegration.value?.status === 'error') return t('partner.integrations.connection_error')
  return t('partner.integrations.not_connected')
})

const statusClass = computed(() => {
  if (currentIntegration.value?.status === 'active') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  if (currentIntegration.value?.status === 'error') return 'bg-rose-500/10 text-rose-600 border-rose-500/20'
  return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
})

const syncSettings = () => {
  const integration = currentIntegration.value
  privateChatEnabled.value = integration?.privateChatEnabled ?? true
  groupChatEnabled.value = integration?.groupChatEnabled ?? false
  groupReplyMode.value = integration?.groupReplyMode || TELEGRAM_GROUP_REPLY_MODE.MENTION_OR_REPLY
}

const apiMessage = (error, fallbackKey) => error?.data?.message || error?.response?._data?.message || t(fallbackKey)
const clearMessages = () => {
  errorMessage.value = ''
  successMessage.value = ''
}

const formatDateTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

const loadIntegrations = async () => {
  if (!props.organizationId) return
  clearMessages()
  try {
    await fetchIntegrations()
    if (!selectedBotId.value) {
      selectedBotId.value = String(integrations.value[0]?.partnerServiceId || props.bots[0]?.id || '')
    }
    syncSettings()
  } catch (error) {
    errorMessage.value = apiMessage(error, 'partner.integrations.telegram_load_error')
  }
}

const handleTestToken = async () => {
  clearMessages()
  busy.value = true
  try {
    testedBot.value = await testToken(token.value)
    successMessage.value = t('partner.integrations.token_valid')
  } catch (error) {
    testedBot.value = null
    errorMessage.value = apiMessage(error, 'partner.integrations.token_test_error')
  } finally {
    busy.value = false
  }
}

const handleConnect = async () => {
  clearMessages()
  busy.value = true
  try {
    await connect({
      partner_service_id: Number(selectedBotId.value),
      token: token.value,
      private_chat_enabled: privateChatEnabled.value,
      group_chat_enabled: groupChatEnabled.value,
      group_reply_mode: groupReplyMode.value
    })
    token.value = ''
    testedBot.value = null
    successMessage.value = t('partner.integrations.connected_success')
    syncSettings()
  } catch (error) {
    errorMessage.value = apiMessage(error, 'partner.integrations.connect_error')
  } finally {
    busy.value = false
  }
}

const handleRefresh = async () => {
  if (!currentIntegration.value) return
  clearMessages()
  busy.value = true
  try {
    const result = await refreshStatus(currentIntegration.value.id)
    pendingUpdates.value = result.webhook?.pending_update_count ?? 0
    successMessage.value = t('partner.integrations.status_refreshed')
  } catch (error) {
    errorMessage.value = apiMessage(error, 'partner.integrations.status_error')
  } finally {
    busy.value = false
  }
}

const handleSaveSettings = async () => {
  if (!currentIntegration.value) return
  clearMessages()
  busy.value = true
  try {
    await updateSettings(currentIntegration.value.id, {
      private_chat_enabled: privateChatEnabled.value,
      group_chat_enabled: groupChatEnabled.value,
      group_reply_mode: groupReplyMode.value
    })
    successMessage.value = t('partner.integrations.settings_saved')
  } catch (error) {
    errorMessage.value = apiMessage(error, 'partner.integrations.settings_error')
  } finally {
    busy.value = false
  }
}

const handleDisconnect = async () => {
  if (!currentIntegration.value || !window.confirm(t('partner.integrations.disconnect_confirm'))) return
  clearMessages()
  busy.value = true
  try {
    await disconnect(currentIntegration.value.id)
    successMessage.value = t('partner.integrations.disconnected_success')
    pendingUpdates.value = null
  } catch (error) {
    errorMessage.value = apiMessage(error, 'partner.integrations.disconnect_error')
  } finally {
    busy.value = false
  }
}

watch(() => props.organizationId, loadIntegrations, { immediate: true })
watch(() => props.bots, (bots) => {
  if (!selectedBotId.value && bots.length) selectedBotId.value = String(bots[0].id)
}, { immediate: true })
watch(currentIntegration, syncSettings)
</script>

<style scoped>
.field-label {
  @apply text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold;
}
.field-control {
  @apply w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 transition-all;
}
.setting-row {
  @apply flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-4 py-3 text-xs font-semibold text-slate-700 dark:text-white/70;
}
.primary-button, .secondary-button, .danger-button {
  @apply min-h-10 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors;
}
.primary-button { @apply bg-sky-500 text-white hover:bg-sky-600; }
.secondary-button { @apply border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:border-sky-400 hover:text-sky-600; }
.danger-button { @apply border border-rose-200 dark:border-rose-500/20 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10; }
select option { background: white; color: black; }
.dark select option { background: #1a1a1a; color: white; }
</style>
