<template>
  <div class="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-[#e1e2ec] transition-colors">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 relative z-10">
      <header class="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <div>
          <h1 class="text-[30px] font-bold tracking-tight text-slate-900 dark:text-white">
            {{ t('admin_token_usage.title') }}
          </h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-[#8c909f] max-w-2xl">
            {{ t('admin_token_usage.subtitle') }}
          </p>
        </div>
        <button
          type="button"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 dark:bg-[#adc6ff] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white dark:text-[#002e6a] shadow-lg transition hover:bg-indigo-700 dark:hover:bg-[#4d8eff] disabled:cursor-not-allowed disabled:opacity-60"
          @click="refresh"
        >
          <span class="material-symbols-outlined text-[18px]" :class="loading ? 'animate-spin' : ''">refresh</span>
          {{ t('admin_token_usage.refresh') }}
        </button>
      </header>

      <div v-if="pageError" class="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-5 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p class="font-bold">{{ t('admin_token_usage.error_title') }}</p>
            <p class="mt-1 text-sm opacity-80">{{ getErrorMessage(pageError) }}</p>
          </div>
          <button type="button" class="rounded-lg border border-current px-4 py-2 text-[11px] font-bold uppercase tracking-widest" @click="retry">
            {{ t('admin_token_usage.retry') }}
          </button>
        </div>
      </div>

      <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 mb-8">
        <article
          v-for="card in summaryCards"
          :key="card.key"
          class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#272a31] dark:bg-[#191b23]/70"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-[#8c909f]">{{ card.label }}</span>
            <span class="material-symbols-outlined text-[20px]" :class="card.iconClass">{{ card.icon }}</span>
          </div>
          <p class="mt-4 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">{{ formatTokens(card.value) }}</p>
        </article>
      </section>

      <section class="rounded-xl border border-slate-200 bg-white shadow-xl dark:border-[#272a31] dark:bg-[#191b23]/70 overflow-hidden">
        <div class="border-b border-slate-200 p-4 dark:border-[#272a31]">
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.5fr)_minmax(170px,1fr)_minmax(170px,1fr)_minmax(170px,1fr)_auto] gap-3 items-end">
            <label class="block">
              <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#8c909f]">{{ t('admin_token_usage.search_label') }}</span>
              <input
                v-model="filters.search"
                type="search"
                :placeholder="t('admin_token_usage.search_placeholder')"
                class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-indigo-500 dark:border-[#424754] dark:bg-[#10131a] dark:text-white dark:placeholder:text-[#8c909f]"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#8c909f]">{{ t('admin_token_usage.organization') }}</span>
              <select v-model="filters.organization_id" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-indigo-500 dark:border-[#424754] dark:bg-[#10131a] dark:text-white">
                <option value="">{{ t('admin_token_usage.all_organizations') }}</option>
                <option v-for="organization in organizations" :key="organization.id" :value="organization.id">{{ organization.name }}</option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#8c909f]">{{ t('admin_token_usage.ai_service') }}</span>
              <select v-model="filters.ai_service_id" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-indigo-500 dark:border-[#424754] dark:bg-[#10131a] dark:text-white">
                <option value="">{{ t('admin_token_usage.all_ai_services') }}</option>
                <option v-for="service in aiServices" :key="service.id" :value="service.id">{{ service.name }}</option>
              </select>
            </label>

            <label class="block">
              <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#8c909f]">{{ t('admin_token_usage.quota_status') }}</span>
              <select v-model="filters.quota_status" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-indigo-500 dark:border-[#424754] dark:bg-[#10131a] dark:text-white">
                <option value="">{{ t('admin_token_usage.all_statuses') }}</option>
                <option v-for="status in quotaStatuses" :key="status" :value="status">{{ quotaStatusLabel(status) }}</option>
              </select>
            </label>

            <button type="button" class="rounded-lg border border-slate-200 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-[#424754] dark:text-[#c2c6d6] dark:hover:border-[#adc6ff] dark:hover:text-[#adc6ff]" @click="clearFilters">
              {{ t('admin_token_usage.clear_filters') }}
            </button>
          </div>
        </div>

        <div v-if="loading && !items.length" class="space-y-3 p-5">
          <div v-for="row in 6" :key="row" class="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-white/5"></div>
        </div>

        <div v-else-if="!loading && !items.length" class="px-6 py-16 text-center">
          <span class="material-symbols-outlined text-5xl text-slate-300 dark:text-white/20">database</span>
          <p class="mt-4 text-sm font-bold text-slate-600 dark:text-white/70">{{ filtersActive ? t('admin_token_usage.empty_filtered') : t('admin_token_usage.empty') }}</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-[1120px] w-full text-left text-sm">
            <thead class="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 dark:bg-black/20 dark:text-slate-400">
              <tr>
                <th class="p-4">{{ t('admin_token_usage.table.bot') }}</th>
                <th class="p-4">{{ t('admin_token_usage.table.organization') }}</th>
                <th class="p-4">{{ t('admin_token_usage.table.ai_service') }}</th>
                <th class="p-4 text-right">{{ t('admin_token_usage.table.used') }}</th>
                <th class="p-4 text-right">{{ t('admin_token_usage.table.limit') }}</th>
                <th class="p-4 text-right">{{ t('admin_token_usage.table.remaining') }}</th>
                <th class="p-4 min-w-[170px]">{{ t('admin_token_usage.table.usage') }}</th>
                <th class="p-4">{{ t('admin_token_usage.table.status') }}</th>
                <th class="p-4">{{ t('admin_token_usage.table.updated') }}</th>
                <th class="p-4 text-right">{{ t('admin_token_usage.table.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              <tr v-for="item in items" :key="item.id" class="transition hover:bg-slate-50/70 dark:hover:bg-white/[.03]">
                <td class="p-4">
                  <p class="font-bold text-slate-900 dark:text-white">{{ item.name }}</p>
                  <p class="mt-1 text-xs text-slate-500 dark:text-[#8c909f]">{{ item.partner?.email || item.partner?.name || '—' }}</p>
                </td>
                <td class="p-4 text-slate-600 dark:text-[#c2c6d6]">{{ item.organization?.name || '—' }}</td>
                <td class="p-4">
                  <p class="font-semibold text-slate-700 dark:text-white/80">{{ item.ai_service?.name || '—' }}</p>
                  <p class="mt-1 text-[10px] uppercase tracking-widest text-slate-400 dark:text-[#8c909f]">{{ item.ai_service?.type || '—' }}</p>
                </td>
                <td class="p-4 text-right font-mono tabular-nums text-slate-700 dark:text-white/80">{{ formatTokens(item.token_used) }}</td>
                <td class="p-4 text-right font-mono tabular-nums text-slate-700 dark:text-white/80">{{ formatLimit(item.token_limit) }}</td>
                <td class="p-4 text-right font-mono tabular-nums text-slate-700 dark:text-white/80">{{ formatLimit(item.remaining_tokens) }}</td>
                <td class="p-4">
                  <template v-if="item.usage_percent !== null && item.usage_percent !== undefined">
                    <div class="flex items-center justify-between gap-3 text-[11px] font-semibold tabular-nums text-slate-600 dark:text-white/70">
                      <span>{{ formatPercent(item.usage_percent) }}</span>
                      <span>{{ formatTokens(item.token_used) }} / {{ formatTokens(item.token_limit) }}</span>
                    </div>
                    <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                      <div class="h-full rounded-full transition-all" :class="progressClass(item.quota_status)" :style="{ width: `${Math.min(Number(item.usage_percent) || 0, 100)}%` }"></div>
                    </div>
                  </template>
                  <span v-else class="text-xs font-semibold text-slate-400 dark:text-[#8c909f]">{{ t('admin_token_usage.unlimited') }}</span>
                </td>
                <td class="p-4"><span class="inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" :class="quotaStatusClass(item.quota_status)">{{ quotaStatusLabel(item.quota_status) }}</span></td>
                <td class="p-4 whitespace-nowrap text-xs text-slate-500 dark:text-[#8c909f]">{{ formatDate(item.updated_at) }}</td>
                <td class="p-4">
                  <div class="flex justify-end gap-2">
                    <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-[#424754] dark:text-[#c2c6d6] dark:hover:border-[#adc6ff] dark:hover:text-[#adc6ff]" :title="t('admin_token_usage.view_details')" :aria-label="t('admin_token_usage.view_details')" @click="openDetails(item)">
                      <span class="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-[#424754] dark:text-[#c2c6d6] dark:hover:border-[#adc6ff] dark:hover:text-[#adc6ff]" :title="t('admin_token_usage.adjust_limit')" :aria-label="t('admin_token_usage.adjust_limit')" @click="openEditor(item)">
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="pagination.total > 0" class="border-t border-slate-200 px-5 py-4 dark:border-[#272a31]">
          <Pagination :pagination="pagination" @change="changePage" />
        </div>
      </section>
    </div>

    <Transition name="modal">
      <div v-if="detailItem" class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md dark:bg-black/80" @click.self="closeDetails">
        <div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#424754] dark:bg-black">
          <div class="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#424754]">
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ t('admin_token_usage.detail_title') }}</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-[#8c909f]">{{ detailItem.name }}</p>
            </div>
            <button type="button" class="text-slate-400 transition hover:text-slate-900 dark:hover:text-white" :aria-label="t('admin_token_usage.close')" @click="closeDetails">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <TokenUsageDetailField :label="t('admin_token_usage.detail.bot')" :value="detailItem.name" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.active_status')" :value="detailItem.status" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.organization')" :value="detailItem.organization?.name || '—'" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.partner')" :value="detailItem.partner?.name || '—'" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.email')" :value="detailItem.partner?.email || '—'" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.ai_service')" :value="detailItem.ai_service?.name || '—'" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.ai_type')" :value="detailItem.ai_service?.type || '—'" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.token_used')" :value="formatTokens(detailItem.token_used)" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.token_limit')" :value="formatLimit(detailItem.token_limit)" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.remaining')" :value="formatLimit(detailItem.remaining_tokens)" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.usage')" :value="formatPercent(detailItem.usage_percent)" />
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#424754] dark:bg-[#10131a]">
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#8c909f]">{{ t('admin_token_usage.detail.quota_status') }}</p>
              <span class="mt-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" :class="quotaStatusClass(detailItem.quota_status)">{{ quotaStatusLabel(detailItem.quota_status) }}</span>
            </div>
            <TokenUsageDetailField :label="t('admin_token_usage.detail.created_at')" :value="formatDate(detailItem.created_at)" />
            <TokenUsageDetailField :label="t('admin_token_usage.detail.updated_at')" :value="formatDate(detailItem.updated_at)" />
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="modal">
      <div v-if="editorItem" class="fixed inset-0 z-[210] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md dark:bg-black/80" @click.self="closeEditor">
        <form class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-[#424754] dark:bg-black" @submit.prevent="submitEditor">
          <div class="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-[#424754]">
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ t('admin_token_usage.edit_title') }}</h2>
              <p class="mt-1 text-sm text-slate-500 dark:text-[#8c909f]">{{ editorItem.name }}</p>
            </div>
            <button type="button" class="text-slate-400 transition hover:text-slate-900 dark:hover:text-white" :aria-label="t('admin_token_usage.close')" @click="closeEditor">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="space-y-5 p-6">
            <div class="grid grid-cols-2 gap-3">
              <TokenUsageDetailField :label="t('admin_token_usage.detail.token_used')" :value="formatTokens(editorItem.token_used)" />
              <TokenUsageDetailField :label="t('admin_token_usage.detail.current_limit')" :value="formatLimit(editorItem.token_limit)" />
            </div>

            <fieldset>
              <legend class="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#8c909f]">{{ t('admin_token_usage.limit_mode') }}</legend>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label class="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition" :class="editMode === 'limited' ? 'border-indigo-500 bg-indigo-50 dark:border-[#adc6ff] dark:bg-[#adc6ff]/10' : 'border-slate-200 dark:border-[#424754]'">
                  <input v-model="editMode" type="radio" value="limited" class="accent-indigo-600" />
                  <span class="text-sm font-semibold">{{ t('admin_token_usage.limited') }}</span>
                </label>
                <label class="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition" :class="editMode === 'unlimited' ? 'border-indigo-500 bg-indigo-50 dark:border-[#adc6ff] dark:bg-[#adc6ff]/10' : 'border-slate-200 dark:border-[#424754]'">
                  <input v-model="editMode" type="radio" value="unlimited" class="accent-indigo-600" />
                  <span class="text-sm font-semibold">{{ t('admin_token_usage.unlimited') }}</span>
                </label>
              </div>
            </fieldset>

            <label v-if="editMode === 'limited'" class="block">
              <span class="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#8c909f]">{{ t('admin_token_usage.new_limit') }}</span>
              <input v-model="editTokenLimit" type="text" inputmode="numeric" min="1" autocomplete="off" class="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-mono outline-none transition focus:border-indigo-500 dark:border-[#424754] dark:bg-[#10131a] dark:text-white" :aria-label="t('admin_token_usage.new_limit')" />
              <p v-if="editTokenLimit && !isEditorValueValid" class="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-300">{{ t('admin_token_usage.invalid_limit') }}</p>
            </label>

            <div class="rounded-xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-500/20 dark:bg-cyan-500/10">
              <p class="text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">{{ t('admin_token_usage.preview_title') }}</p>
              <div class="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
                <div><span class="block text-xs text-slate-500 dark:text-white/50">{{ t('admin_token_usage.preview_limit') }}</span><strong>{{ formatLimit(previewQuota.limit) }}</strong></div>
                <div><span class="block text-xs text-slate-500 dark:text-white/50">{{ t('admin_token_usage.preview_remaining') }}</span><strong>{{ formatLimit(previewQuota.remaining) }}</strong></div>
                <div><span class="block text-xs text-slate-500 dark:text-white/50">{{ t('admin_token_usage.preview_status') }}</span><strong>{{ quotaStatusLabel(previewQuota.status) }}</strong></div>
              </div>
            </div>

            <div v-if="lowerThanUsed" class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
              {{ t('admin_token_usage.lower_limit_warning') }}
            </div>
          </div>

          <div class="flex gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 dark:border-[#424754] dark:bg-[#191b23]">
            <button type="button" class="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 transition hover:text-slate-900 dark:border-[#424754] dark:text-[#c2c6d6] dark:hover:text-white" @click="closeEditor">{{ t('admin_token_usage.cancel') }}</button>
            <button type="submit" :disabled="saving || !isEditorValueValid" class="flex-1 rounded-lg bg-indigo-600 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#adc6ff] dark:text-[#002e6a] dark:hover:bg-[#4d8eff]">
              <span v-if="saving" class="material-symbols-outlined mr-1 inline-block animate-spin align-middle text-[16px]">progress_activity</span>
              {{ t('admin_token_usage.save') }}
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useAdminTokenUsage } from '~/composables/useAdminTokenUsage'
import TokenUsageDetailField from '~/components/views/admin/TokenUsageDetailField.vue'

const { t, locale } = useI18n()
const toast = useToast()

const {
  items,
  summary,
  pagination,
  loading,
  error: pageError,
  fetchTokenUsage,
  updateTokenLimit,
  fetchOrganizations,
  fetchAiServices
} = useAdminTokenUsage()

const filters = reactive({
  search: '',
  organization_id: '',
  ai_service_id: '',
  quota_status: '',
  per_page: 15
})

const organizations = ref([])
const aiServices = ref([])
const detailItem = ref(null)
const editorItem = ref(null)
const editMode = ref('unlimited')
const editTokenLimit = ref('')
const saving = ref(false)

const quotaStatuses = ['normal', 'warning', 'danger', 'exhausted', 'unlimited']
let filterTimer = null

const summaryCards = computed(() => [
  { key: 'active_bots', label: t('admin_token_usage.summary.active_bots'), value: summary.value.active_bots, icon: 'smart_toy', iconClass: 'text-cyan-500' },
  { key: 'total_token_used', label: t('admin_token_usage.summary.total_token_used'), value: summary.value.total_token_used, icon: 'data_usage', iconClass: 'text-indigo-500' },
  { key: 'total_token_limit', label: t('admin_token_usage.summary.total_token_limit'), value: summary.value.total_token_limit, icon: 'speed', iconClass: 'text-violet-500' },
  { key: 'near_limit_bots', label: t('admin_token_usage.summary.near_limit_bots'), value: summary.value.near_limit_bots, icon: 'warning', iconClass: 'text-amber-500' },
  { key: 'exhausted_bots', label: t('admin_token_usage.summary.exhausted_bots'), value: summary.value.exhausted_bots, icon: 'error', iconClass: 'text-rose-500' },
  { key: 'unlimited_bots', label: t('admin_token_usage.summary.unlimited_bots'), value: summary.value.unlimited_bots, icon: 'all_inclusive', iconClass: 'text-emerald-500' }
])

const filtersActive = computed(() => Boolean(filters.search || filters.organization_id || filters.ai_service_id || filters.quota_status))

const editNumber = computed(() => {
  const value = String(editTokenLimit.value || '').trim()
  if (!/^\d+$/.test(value)) return null
  const number = Number(value)
  return Number.isSafeInteger(number) ? number : null
})

const isEditorValueValid = computed(() => editMode.value === 'unlimited' || (editNumber.value !== null && editNumber.value >= 1))

const previewQuota = computed(() => {
  const used = Number(editorItem.value?.token_used || 0)
  const limit = editMode.value === 'unlimited' ? 0 : editNumber.value

  if (!limit || limit <= 0) {
    return { limit: 0, remaining: null, status: 'unlimited' }
  }

  const percent = Math.min((used / limit) * 100, 100)
  let status = 'normal'
  if (used >= limit) status = 'exhausted'
  else if (percent >= 90) status = 'danger'
  else if (percent >= 70) status = 'warning'

  return {
    limit,
    remaining: Math.max(limit - used, 0),
    status
  }
})

const lowerThanUsed = computed(() => {
  return editMode.value === 'limited' && editNumber.value !== null && editNumber.value < Number(editorItem.value?.token_used || 0)
})

const loadList = async (page = 1) => {
  try {
    await fetchTokenUsage({
      search: filters.search,
      organizationId: filters.organization_id,
      aiServiceId: filters.ai_service_id,
      quotaStatus: filters.quota_status,
      page,
      perPage: filters.per_page
    })
  } catch {
    // The composable exposes the error state for the page error UI.
  }
}

const loadFilterOptions = async () => {
  const [organizationResult, aiServiceResult] = await Promise.allSettled([
    fetchOrganizations(),
    fetchAiServices()
  ])

  if (organizationResult.status === 'fulfilled') organizations.value = organizationResult.value
  if (aiServiceResult.status === 'fulfilled') aiServices.value = aiServiceResult.value
}

const scheduleFilterReload = () => {
  clearTimeout(filterTimer)
  filterTimer = setTimeout(() => loadList(1), 350)
}

watch(
  () => [filters.search, filters.organization_id, filters.ai_service_id, filters.quota_status, filters.per_page],
  scheduleFilterReload
)

const refresh = async () => {
  if (loading.value) return
  await loadList(pagination.value.current_page || 1)
}

const retry = async () => {
  await loadList(pagination.value.current_page || 1)
}

const changePage = async (page) => {
  const nextPage = typeof page === 'number' ? page : Number(page?.current_page || page?.page || 1)
  await loadList(nextPage)
}

const clearFilters = () => {
  filters.search = ''
  filters.organization_id = ''
  filters.ai_service_id = ''
  filters.quota_status = ''
  filters.per_page = 15
}

const openDetails = (item) => {
  detailItem.value = item
}

const closeDetails = () => {
  detailItem.value = null
}

const openEditor = (item) => {
  editorItem.value = item
  const unlimited = item.token_limit === null || Number(item.token_limit) <= 0
  editMode.value = unlimited ? 'unlimited' : 'limited'
  editTokenLimit.value = unlimited ? '' : String(item.token_limit)
}

const closeEditor = () => {
  if (saving.value) return
  editorItem.value = null
  editTokenLimit.value = ''
  editMode.value = 'unlimited'
}

const getErrorMessage = (requestError) => {
  const payload = requestError?.data || requestError?.response?._data || requestError?.response?.data
  const validationMessage = payload?.errors ? Object.values(payload.errors).flat()?.[0] : null
  return validationMessage || payload?.message || t('admin_token_usage.error_message')
}

const submitEditor = async () => {
  if (!editorItem.value || !isEditorValueValid.value || saving.value) return

  if (lowerThanUsed.value) {
    const confirmed = await toast.askConfirm(t('admin_token_usage.lower_limit_confirm'))
    if (!confirmed) return
  }

  saving.value = true
  try {
    const tokenLimit = editMode.value === 'unlimited' ? null : editNumber.value
    await updateTokenLimit(editorItem.value.id, tokenLimit)
    toast.success(t('admin_token_usage.update_success'))
    closeEditor()
    await loadList(pagination.value.current_page || 1)
  } catch (requestError) {
    toast.error(getErrorMessage(requestError))
  } finally {
    saving.value = false
  }
}

const formatTokens = (value) => {
  return new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(Number(value) || 0)
}

const formatLimit = (value) => {
  if (value === null || value === undefined || Number(value) <= 0) return t('admin_token_usage.unlimited')
  return formatTokens(value)
}

const formatPercent = (value) => {
  if (value === null || value === undefined) return t('admin_token_usage.unlimited')
  return `${Math.min(Number(value) || 0, 100).toFixed(2).replace(/\.00$/, '')}%`
}

const formatDate = (value) => {
  if (!value) return '—'
  return new Intl.DateTimeFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

const quotaStatusLabel = (status) => t(`admin_token_usage.status.${status}`)

const quotaStatusClass = (status) => ({
  normal: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300',
  warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300',
  danger: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300',
  exhausted: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300',
  unlimited: 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300'
}[status] || 'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/70')

const progressClass = (status) => ({
  normal: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-orange-500',
  exhausted: 'bg-rose-500'
}[status] || 'bg-indigo-500')

onMounted(async () => {
  await Promise.all([loadList(1), loadFilterOptions()])
})

onBeforeUnmount(() => clearTimeout(filterTimer))

definePageMeta({
  layout: 'layout-admin'
})
</script>
