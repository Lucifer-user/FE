<template>
  <section class="space-y-6 animate-in fade-in duration-500">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400">{{ $t('partner.bot_access.eyebrow') }}</p>
        <h1 class="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{{ $t('partner.bot_access.title') }}</h1>
        <div v-if="currentProjectName" class="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
          <span class="material-symbols-outlined text-sm">domain</span>
          {{ $t('partner.bot_access.current_project') }}: {{ currentProjectName }}
        </div>
        <p class="mt-1 max-w-2xl text-sm text-slate-500 dark:text-white/45">
          {{ $t('partner.bot_access.subtitle') }}
        </p>
      </div>
      <button
        @click="fetchAccess"
        class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80 dark:hover:bg-white/10"
      >
        <span class="material-symbols-outlined text-sm">refresh</span>
        {{ $t('partner.bot_access.reload') }}
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <article v-for="scope in scopes" :key="scope.name" class="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
        <div class="flex items-center justify-between">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg" :class="scope.tone">
            <span class="material-symbols-outlined text-[20px]">{{ scope.icon }}</span>
          </div>
          <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ scope.count }}</span>
        </div>
        <h3 class="mt-4 font-['Space_Grotesk'] text-base font-bold text-slate-900 dark:text-white">{{ scope.name }}</h3>
        <p class="mt-2 text-xs leading-relaxed text-slate-500 dark:text-white/45">{{ scope.desc }}</p>
      </article>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div class="xl:col-span-5 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div class="border-b border-slate-100 px-6 py-4 dark:border-white/10">
          <h2 class="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-white">{{ $t('partner.bot_access.chatbots') }}</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-white/40">{{ $t('partner.bot_access.select_desc') }}</p>
        </div>

        <div class="max-h-[560px] overflow-y-auto p-3">
          <div v-if="loading" class="p-6 text-center text-sm text-slate-400">{{ $t('partner.bot_access.loading') }}</div>
          <div v-else-if="bots.length === 0" class="p-6 text-center text-sm text-slate-400">{{ $t('partner.bot_access.no_bots') }}</div>

          <button
            v-for="bot in bots"
            :key="bot.id"
            @click="selectBot(bot)"
            class="mb-2 w-full rounded-lg border p-4 text-left transition"
            :class="selectedBot?.id === bot.id
              ? 'border-cyan-500/40 bg-cyan-50 text-slate-900 ring-2 ring-cyan-500/10 dark:bg-cyan-500/10 dark:text-white'
              : 'border-slate-100 bg-slate-50/70 text-slate-700 hover:border-slate-200 hover:bg-white dark:border-white/5 dark:bg-white/[0.03] dark:text-white/70 dark:hover:bg-white/[0.06]'"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex min-w-0 items-start gap-3">
                <span class="material-symbols-outlined mt-0.5 text-slate-400">smart_toy</span>
                <div class="min-w-0">
                  <p class="truncate font-semibold">{{ bot.name }}</p>
                  <p class="mt-1 text-[11px] uppercase tracking-wider text-slate-400">{{ botTypeLabel(bot) }}</p>
                </div>
              </div>
              <span class="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-300">
                {{ bot.status }}
              </span>
            </div>
            <div class="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-white/45">
              <span class="material-symbols-outlined text-sm">groups</span>
              {{ $t('partner.bot_access.assigned_count', { count: bot.assigned_member_ids?.length || 0 }) }}
            </div>
          </button>
        </div>
      </div>

      <div class="xl:col-span-7 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div class="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-white">
              {{ selectedBot ? selectedBot.name : $t('partner.bot_access.select_bot') }}
            </h2>
            <p class="mt-1 text-xs text-slate-500 dark:text-white/40">
              {{ $t('partner.bot_access.owner_note') }}
            </p>
          </div>
          <button
            :disabled="!selectedBot || saving"
            @click="saveAccess"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
          >
            <span class="material-symbols-outlined text-sm">save</span>
            {{ saving ? $t('partner.bot_access.saving') : $t('partner.bot_access.save') }}
          </button>
        </div>

        <div v-if="!selectedBot" class="flex min-h-[360px] items-center justify-center text-sm text-slate-400">
          {{ $t('partner.bot_access.select_left') }}
        </div>

        <div v-else class="divide-y divide-slate-100 dark:divide-white/10">
          <label
            v-for="member in assignableMembers"
            :key="member.user_id"
            class="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50 dark:hover:bg-white/[0.04]"
          >
            <div class="flex min-w-0 items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 dark:bg-white/10 dark:text-white">
                {{ initials(member.name || member.email) }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">{{ member.name || member.email }}</p>
                <p class="truncate text-xs text-slate-500 dark:text-white/40">{{ member.email }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest" :class="roleBadge(member.role)">
                {{ member.role }}
              </span>
              <input
                v-model="selectedMemberIds"
                :value="member.user_id"
                type="checkbox"
                class="h-5 w-5 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
              >
            </div>
          </label>

          <div v-if="assignableMembers.length === 0" class="p-8 text-center text-sm text-slate-400">
            {{ $t('partner.bot_access.no_members') }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  organizationId: {
    type: String,
    default: ''
  }
})

const config = useRuntimeConfig()
const token = useCookie('accessToken')
const toast = useToast()
const { t } = useI18n()

const loading = ref(false)
const saving = ref(false)
const bots = ref([])
const members = ref([])
const selectedBot = ref(null)
const selectedMemberIds = ref([])
const currentProjectId = ref('')
const currentProjectName = ref('')

const headers = () => {
  const organizationId = props.organizationId || (process.client ? localStorage.getItem('orbit_current_organization_id') : '')

  return {
    Authorization: `Bearer ${token.value}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(organizationId ? { 'X-Organization-Id': organizationId } : {})
  }
}

const assignableMembers = computed(() => {
  return members.value.filter(member => !['owner', 'admin'].includes(member.role))
})

const scopes = computed(() => [
  {
    name: t('partner.bot_access.bots'),
    count: bots.value.length,
    icon: 'smart_toy',
    tone: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
    desc: t('partner.bot_access.bots_desc')
  },
  {
    name: t('partner.bot_access.members'),
    count: assignableMembers.value.length,
    icon: 'groups',
    tone: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
    desc: t('partner.bot_access.members_desc')
  },
  {
    name: t('partner.bot_access.assigned'),
    count: bots.value.reduce((sum, bot) => sum + (bot.assigned_member_ids?.length || 0), 0),
    icon: 'verified_user',
    tone: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    desc: t('partner.bot_access.assigned_desc')
  },
  {
    name: t('partner.bot_access.private'),
    count: bots.value.filter(bot => (bot.assigned_member_ids?.length || 0) === 0).length,
    icon: 'lock',
    tone: 'bg-rose-500/10 text-rose-600 dark:text-rose-300',
    desc: t('partner.bot_access.private_desc')
  }
])

const botTypeLabel = (bot) => {
  const categoryType = bot.ai_service?.category?.type
  if (categoryType) return categoryType === 'chat' ? 'Chat' : 'RAG'
  return bot.type === 'chat' ? 'Chat' : 'RAG'
}

const initials = (value = '') => {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'U'
}

const roleBadge = (role) => {
  const badges = {
    manager: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
    member: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
    viewer: 'bg-slate-500/10 text-slate-500 dark:text-slate-300'
  }
  return badges[role] || badges.member
}

const selectBot = (bot) => {
  selectedBot.value = bot
  selectedMemberIds.value = [...(bot.assigned_member_ids || [])]
}

const fetchAccess = async () => {
  loading.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/partner/bot-access`, {
      method: 'GET',
      headers: headers()
    })

    bots.value = res.bots || []
    members.value = res.members || []
    currentProjectId.value = res.organization_id || ''
    currentProjectName.value = res.organization_name || ''

    if (bots.value.length > 0) {
      const nextSelected = selectedBot.value
        ? bots.value.find(bot => bot.id === selectedBot.value.id)
        : bots.value[0]
      selectBot(nextSelected || bots.value[0])
    } else {
      selectedBot.value = null
      selectedMemberIds.value = []
    }
  } catch (error) {
    console.error('Bot access load failed:', error)
    toast.error(error?.data?.message || 'Không tải được phân quyền bot.')
  } finally {
    loading.value = false
  }
}

const saveAccess = async () => {
  if (!selectedBot.value) return

  saving.value = true
  try {
    const res = await $fetch(`${config.public.apiBase}/partner/bot-access/${selectedBot.value.id}/members`, {
      method: 'POST',
      headers: headers(),
      body: {
        user_ids: selectedMemberIds.value
      }
    })

    toast.success(res.message || 'Đã cập nhật quyền bot.')
    await fetchAccess()
  } catch (error) {
    console.error('Bot access save failed:', error)
    toast.error(error?.data?.message || 'Không lưu được phân quyền bot.')
  } finally {
    saving.value = false
  }
}

watch(() => props.organizationId, () => {
  fetchAccess()
}, { immediate: true })
</script>
