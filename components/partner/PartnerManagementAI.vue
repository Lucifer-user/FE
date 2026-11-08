<template>
  <section class="grid grid-cols-1 gap-6 animate-in fade-in duration-500 xl:grid-cols-[minmax(0,1fr)_360px]">
    <div class="space-y-6">
      <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400">{{ $t('partner.management_ai.eyebrow') }}</p>
            <h1 class="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{{ $t('partner.management_ai.title') }}</h1>
            <p class="mt-2 max-w-2xl text-sm text-slate-500 dark:text-white/45">{{ $t('partner.management_ai.subtitle') }}</p>
          </div>
          <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest" :class="roleScope.badge">
            <span class="material-symbols-outlined text-sm">{{ roleScope.icon }}</span>
            {{ roleScope.label }}
          </span>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <button v-for="prompt in quickPrompts" :key="prompt" class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 dark:border-white/10 dark:bg-black/20 dark:text-white/60 dark:hover:border-cyan-400/40 dark:hover:bg-cyan-400/10">
            {{ prompt }}
          </button>
        </div>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div class="border-b border-slate-100 px-6 py-4 dark:border-white/10">
          <h2 class="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-white">{{ $t('partner.management_ai.preview') }}</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-white/40">{{ $t('partner.management_ai.preview_note') }}</p>
        </div>
        <div class="space-y-5 p-6">
          <div class="flex justify-end">
            <div class="max-w-[82%] rounded-lg bg-slate-900 px-4 py-3 text-sm text-white dark:bg-cyan-400 dark:text-slate-950">
              {{ $t('partner.management_ai.sample_question') }}
            </div>
          </div>
          <div class="flex gap-3">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 text-white">
              <span class="material-symbols-outlined text-lg">auto_awesome</span>
            </div>
            <div class="max-w-[88%] rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-white/75">
              <p class="font-semibold text-slate-900 dark:text-white">{{ $t('partner.management_ai.sample_answer') }}</p>
              <p class="mt-2">{{ $t('partner.management_ai.sample_detail') }}</p>
              <div class="mt-4 grid grid-cols-3 gap-2">
                <div class="rounded-lg bg-white p-3 dark:bg-white/5">
                  <p class="text-lg font-bold text-slate-900 dark:text-white">1.62K</p>
                  <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.management_ai.chats') }}</p>
                </div>
                <div class="rounded-lg bg-white p-3 dark:bg-white/5">
                  <p class="text-lg font-bold text-slate-900 dark:text-white">286K</p>
                  <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.management_ai.tokens') }}</p>
                </div>
                <div class="rounded-lg bg-white p-3 dark:bg-white/5">
                  <p class="text-lg font-bold text-slate-900 dark:text-white">8</p>
                  <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.management_ai.bots') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-slate-100 p-4 dark:border-white/10">
          <div class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-black/20">
            <input class="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white/75" :placeholder="$t('partner.management_ai.input_placeholder')" />
            <button class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950">
              <span class="material-symbols-outlined text-base">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <aside class="space-y-4">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <h2 class="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-white">{{ $t('partner.management_ai.metrics') }}</h2>
        <div class="mt-5 space-y-3">
          <div v-for="metric in metrics" :key="metric.label" class="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-black/20">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ metric.label }}</p>
              <p class="mt-1 text-lg font-bold text-slate-900 dark:text-white">{{ metric.value }}</p>
            </div>
            <span class="material-symbols-outlined text-slate-400">{{ metric.icon }}</span>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-amber-500/20 bg-amber-500/10 p-5">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-amber-600 dark:text-amber-300">security</span>
          <div>
            <h3 class="text-sm font-bold text-amber-800 dark:text-amber-200">{{ $t('partner.management_ai.permission_boundary') }}</h3>
            <p class="mt-2 text-xs leading-6 text-amber-800/80 dark:text-amber-100/70">{{ roleScope.description }}</p>
          </div>
        </div>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps({
  role: {
    type: String,
    default: 'owner'
  }
})

const quickPrompts = computed(() => [
  t('partner.management_ai.prompt_active_bots'),
  t('partner.management_ai.prompt_top_token'),
  t('partner.management_ai.prompt_top_department'),
  t('partner.management_ai.prompt_today_conversations')
])

const metrics = computed(() => [
  { label: t('partner.management_ai.active_bots'), value: '8', icon: 'smart_toy' },
  { label: t('partner.management_ai.conversations'), value: '1.62K', icon: 'forum' },
  { label: t('partner.management_ai.token_used'), value: '286K', icon: 'data_usage' },
  { label: t('partner.management_ai.top_team'), value: 'Sales', icon: 'leaderboard' }
])

const roleScope = computed(() => {
  if (props.role === 'owner' || props.role === 'admin') {
    return {
      label: t('partner.management_ai.company_access'),
      icon: 'verified_user',
      badge: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
      description: t('partner.management_ai.company_access_desc')
    }
  }
  if (props.role === 'manager') {
    return {
      label: t('partner.management_ai.department_scope'),
      icon: 'shield_person',
      badge: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
      description: t('partner.management_ai.department_scope_desc')
    }
  }
  return {
    label: t('partner.management_ai.restricted'),
    icon: 'lock',
    badge: 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300',
    description: t('partner.management_ai.restricted_desc')
  }
})
</script>
