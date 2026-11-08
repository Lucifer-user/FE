<template>
  <div class="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-[#e1e2ec] font-inter selection:bg-[#adc6ff]/30 relative overflow-hidden transition-colors duration-500">
    <div class="absolute top-0 left-1/4 w-1/2 h-96 bg-indigo-500/5 dark:bg-[#adc6ff]/5 rounded-full blur-[100px] pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-[#4edea3]/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-6 py-10 relative z-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 class="font-display-md text-[30px] font-bold tracking-tight text-slate-900 dark:text-[#e1e2ec] mb-1">{{ $t('admin.orgs.title') }}</h1>
          <p class="text-[14px] text-slate-500 dark:text-[#8c909f]">{{ $t('admin.orgs.subtitle') }}</p>
        </div>
      </div>

      <div class="bg-white dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-[#424754] rounded-xl overflow-hidden shadow-xl dark:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-[#424754] flex flex-wrap justify-between items-center gap-4 bg-slate-50/50 dark:bg-[#191b23]/50 transition-colors">
          <div class="relative w-full md:w-72">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8c909f] text-[18px]">search</span>
            <input 
              v-model="searchQuery"
              type="text" 
              :placeholder="$t('admin.orgs.search')" 
              class="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-[#424754] rounded-md py-2 pl-10 pr-4 text-[13px] text-slate-900 dark:text-[#e1e2ec] placeholder:text-slate-400 dark:placeholder:text-[#8c909f] focus:outline-none focus:border-indigo-500 dark:focus:border-[#adc6ff] focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#adc6ff] transition-all"
            />
          </div>
          <div class="flex gap-2">
            <button class="p-2 rounded border border-slate-200 dark:border-[#424754] text-slate-400 dark:text-[#8c909f] hover:text-indigo-600 dark:hover:text-[#e1e2ec] hover:bg-slate-50 dark:hover:bg-[#32353c] transition-colors" :title="$t('admin.orgs.filter')">
              <span class="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
            <button @click="exportCsv" class="p-2 rounded border border-slate-200 dark:border-[#424754] text-slate-400 dark:text-[#8c909f] hover:text-indigo-600 dark:hover:text-[#e1e2ec] hover:bg-slate-50 dark:hover:bg-[#32353c] transition-colors" :title="$t('admin.orgs.export')">
              <span class="material-symbols-outlined text-[20px]">download</span>
            </button>
          </div>
        </div>

        <div class="w-full overflow-hidden">
          <table class="w-full table-fixed text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 dark:border-[#424754] bg-slate-50/30 dark:bg-[#191b23]/30">
                <th class="w-[19%] text-[10px] font-bold text-slate-400 dark:text-[#8c909f] px-4 py-4 uppercase tracking-[0.14em]">{{ $t('admin.orgs.organization') }}</th>
                <th class="w-[20%] text-[10px] font-bold text-slate-400 dark:text-[#8c909f] px-4 py-4 uppercase tracking-[0.14em]">{{ $t('admin.orgs.owner') }}</th>
                <th class="w-[16%] text-[10px] font-bold text-slate-400 dark:text-[#8c909f] px-4 py-4 uppercase tracking-[0.14em]">{{ $t('admin.orgs.plan') }}</th>
                <th class="w-[18%] text-[10px] font-bold text-slate-400 dark:text-[#8c909f] px-4 py-4 uppercase tracking-[0.14em]">{{ $t('admin.orgs.resources') }}</th>
                <th class="w-[9%] text-[10px] font-bold text-slate-400 dark:text-[#8c909f] px-3 py-4 uppercase tracking-[0.14em] text-center">{{ $t('admin.orgs.active_bots') }}</th>
                <th class="w-[10%] text-[10px] font-bold text-slate-400 dark:text-[#8c909f] px-3 py-4 uppercase tracking-[0.14em]">{{ $t('admin.orgs.status') }}</th>
                <th class="w-[8%] text-[10px] font-bold text-slate-400 dark:text-[#8c909f] px-3 py-4 uppercase tracking-[0.14em] text-right">{{ $t('admin.orgs.actions') }}</th>
              </tr>
            </thead>
            <tbody v-if="!loading" class="text-[13px]">
              <tr v-for="org in paginatedOrganizations" :key="org.id" 
                  class="border-b border-slate-50 dark:border-[#424754]/50 hover:bg-slate-50/80 dark:hover:bg-[#32353c]/30 transition-colors group">
                <td class="px-4 py-5 align-middle">
                  <div class="flex min-w-0 items-center gap-3">
                    <div class="w-9 h-9 shrink-0 rounded bg-slate-100 dark:bg-[#363941] border border-slate-200 dark:border-[#424754] flex items-center justify-center text-slate-900 dark:text-[#e1e2ec] font-bold text-[14px] shadow-sm transition-colors">
                      {{ org.name?.charAt(0).toUpperCase() }}
                    </div>
                    <div class="min-w-0">
                      <div class="truncate text-[14px] font-semibold text-slate-900 dark:text-[#e1e2ec] group-hover:text-indigo-600 dark:group-hover:text-[#adc6ff] transition-colors" :title="org.name">{{ org.name }}</div>
                      <div class="truncate text-slate-400 dark:text-[#8c909f] text-[11px] font-data-mono mt-0.5 uppercase tracking-tighter">ID: {{ org.id?.slice(0, 8) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-5 align-middle">
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-slate-900 dark:text-[#e1e2ec] font-medium transition-colors" :title="org.ownerName || 'N/A'">{{ org.ownerName || 'N/A' }}</span>
                    <span class="truncate text-slate-400 dark:text-[#8c909f] text-[11px]" :title="org.email">{{ org.email }}</span>
                  </div>
                </td>
                <td class="px-4 py-5 align-middle">
                  <div class="flex flex-col gap-1">
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span :class="getPlanStyle(org.plan_type)" class="inline-flex px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider">
                        {{ org.plan_type || 'Chưa cấu hình' }}
                      </span>
                      <span :class="getPlanStatusStyle(org.plan_status)" class="text-[10px] font-bold uppercase tracking-wider">
                        {{ getPlanStatusLabel(org.plan_status) }}
                      </span>
                    </div>
                    <span class="text-[11px] text-slate-400 dark:text-[#8c909f]">
                      {{ $t('admin.orgs.expires') }}: {{ formatPlanDate(org.plan_expires_at) }}
                    </span>
                  </div>
                </td>
                <td class="px-4 py-5 align-middle">
                  <div class="flex w-full max-w-[170px] flex-col gap-1.5">
                    <div class="flex justify-between items-center font-data-mono text-[10px]">
                      <span class="text-slate-900 dark:text-[#e1e2ec] transition-colors">{{ formatTokens(org.tokens_used) }}</span>
                      <span class="text-slate-400 dark:text-[#8c909f]">/ {{ formatTokens(org.tokens_limit) }} Tokens</span>
                    </div>
                    <div class="h-1.5 w-full bg-slate-100 dark:bg-black rounded-full overflow-hidden transition-colors">
                      <div class="h-full bg-indigo-500 dark:bg-[#adc6ff] rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)] dark:shadow-[0_0_8px_rgba(173,198,255,0.5)] transition-all" :style="{ width: Math.min(100, Math.max(0, ((org.tokens_used || 0) / (org.tokens_limit || 1)) * 100)) + '%' }"></div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-5 align-middle text-center font-data-mono text-slate-900 dark:text-[#e1e2ec] transition-colors">
                  {{ org.active_bots_count || 0 }}
                </td>
                <td class="px-3 py-5 align-middle">
                  <span :class="getStatusStyle(org.status)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(org.status)"></span>
                    {{ org.status }}
                  </span>
                </td>
                <td class="px-3 py-5 align-middle text-right">
                  <div class="flex justify-end items-center gap-1">
                    <button @click="openModal(org)" class="p-2 rounded border border-slate-200 dark:border-[#424754] text-slate-900 dark:text-[#e1e2ec] hover:border-indigo-600 dark:hover:border-[#adc6ff] hover:text-indigo-600 dark:hover:text-[#adc6ff] hover:bg-indigo-50 dark:hover:bg-[#adc6ff]/5 transition-all" :title="$t('admin.orgs.details')">
                      <span class="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                    <button
                      @click="handleToggleStatus(org.id)"
                      class="p-2 rounded border border-slate-200 dark:border-[#424754] text-slate-500 dark:text-[#8c909f] hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                      :title="org.status === 'active' ? $t('admin.orgs.lock_org') : $t('admin.orgs.unlock_org')"
                    >
                      <span class="material-symbols-outlined text-[16px]">{{ org.status === 'active' ? 'lock' : 'lock_open' }}</span>
                    </button>
                    <button
                      @click="handleDelete(org.id)"
                      class="p-2 rounded border border-slate-200 dark:border-[#424754] text-slate-500 dark:text-[#8c909f] hover:border-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                      :title="$t('admin.orgs.delete_org')"
                    >
                      <span class="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!loading && organizations.length === 0" class="py-20 text-center">
          <span class="material-symbols-outlined text-6xl text-slate-200 dark:text-[#32353c] mb-4 transition-colors">business_center</span>
          <p class="text-slate-400 dark:text-[#8c909f] font-bold uppercase text-[12px] tracking-[0.3em] transition-colors">{{ $t('admin.orgs.no_orgs') }}</p>
        </div>

        <div v-if="loading" class="py-20 text-center">
          <div class="w-10 h-10 border-4 border-indigo-500 dark:border-[#adc6ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-indigo-600 dark:text-[#adc6ff] font-bold uppercase text-[10px] tracking-widest transition-colors">{{ $t('admin.orgs.loading') }}</p>
        </div>

        <div v-if="!loading && organizations.length > 0" class="px-6 py-4 border-t border-slate-100 dark:border-[#424754] bg-slate-50/50 dark:bg-[#191b23]/50 flex items-center justify-between transition-colors">
          <div class="text-slate-400 dark:text-[#8c909f] text-[12px] font-medium transition-colors">
            {{ $t('admin.orgs.page') }} <span class="text-indigo-600 dark:text-[#adc6ff]">{{ currentPage }}</span> / {{ totalPages }} — {{ $t('admin.orgs.showing') }} <span class="text-slate-900 dark:text-[#e1e2ec]">{{ paginatedOrganizations.length }}</span> {{ $t('admin.orgs.orgs_count') }}
          </div>
          <div class="flex gap-2">
            <button 
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="p-2 rounded border border-slate-200 dark:border-[#424754] text-slate-400 dark:text-[#8c909f] hover:text-slate-900 dark:hover:text-[#e1e2ec] hover:bg-slate-100 dark:hover:bg-[#32353c] transition-all disabled:opacity-20 disabled:cursor-not-allowed">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="p-2 rounded border border-slate-200 dark:border-[#424754] text-slate-400 dark:text-[#8c909f] hover:text-slate-900 dark:hover:text-[#e1e2ec] hover:bg-slate-100 dark:hover:bg-[#32353c] transition-all disabled:opacity-20 disabled:cursor-not-allowed">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal">
      <div v-if="selectedOrg" class="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-colors">
        <div class="bg-white dark:bg-black border border-slate-200 dark:border-[#424754] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl transition-colors">
          <div class="px-8 py-6 border-b border-slate-100 dark:border-[#424754] flex justify-between items-center bg-slate-50 dark:bg-[#191b23] transition-colors">
            <h3 class="text-xl font-bold text-slate-900 dark:text-[#e1e2ec] transition-colors">{{ selectedOrg.name }}</h3>
            <button @click="selectedOrg = null" class="text-slate-400 dark:text-[#8c909f] hover:text-slate-900 dark:hover:text-[#e1e2ec] transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="p-8 grid grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">{{ $t('admin.orgs.status') }}</span>
                <select v-model="editingOrg.status" class="bg-transparent border-b border-slate-300 dark:border-[#424754] focus:border-indigo-500 outline-none text-slate-900 dark:text-[#e1e2ec] py-1 text-[13px] font-bold uppercase w-fit">
                  <option value="active">{{ $t('admin.orgs.active') }}</option>
                  <option value="suspended">{{ $t('admin.orgs.suspended') }}</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">{{ $t('admin.orgs.owner') }}</span>
                <span class="text-slate-900 dark:text-[#e1e2ec] font-medium transition-colors">{{ editingOrg.ownerName || 'N/A' }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">{{ $t('admin.orgs.email') }}</span>
                <span class="text-slate-900 dark:text-[#e1e2ec] font-medium transition-colors">{{ editingOrg.email }}</span>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">{{ $t('admin.orgs.phone') }}</span>
                <input v-model="editingOrg.phone" type="text" class="bg-transparent border-b border-slate-300 dark:border-[#424754] focus:border-indigo-500 outline-none text-slate-900 dark:text-[#e1e2ec] py-1 text-[13px]" />
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">{{ $t('admin.orgs.address') }}</span>
                <input v-model="editingOrg.address" type="text" class="bg-transparent border-b border-slate-300 dark:border-[#424754] focus:border-indigo-500 outline-none text-slate-900 dark:text-[#e1e2ec] py-1 text-[13px]" />
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">{{ $t('admin.orgs.token_limit') }}</span>
                <input v-model="editingOrg.tokens_limit" type="number" class="bg-transparent border-b border-slate-300 dark:border-[#424754] focus:border-indigo-500 outline-none text-slate-900 dark:text-[#e1e2ec] py-1 text-[13px] font-data-mono" />
              </div>
            </div>
            <div class="col-span-2">
              <div class="flex flex-col gap-1">
                <span class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">{{ $t('admin.orgs.description') }}</span>
                <textarea v-model="editingOrg.description" class="text-slate-900 dark:text-[#e1e2ec] text-[13px] bg-slate-50 dark:bg-[#10131a] p-4 rounded-xl border border-slate-100 dark:border-[#424754] leading-relaxed transition-colors outline-none focus:border-indigo-500 min-h-[80px]"></textarea>
              </div>
            </div>
            <div class="col-span-2 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-500/10 p-4">
              <div class="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div class="text-[11px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">{{ $t('admin.orgs.plan_test_tool') }}</div>
                  <p class="text-[12px] text-amber-700/80 dark:text-amber-200/80 mt-1">
                    {{ $t('admin.orgs.plan_test_desc') }}
                  </p>
                </div>
                <span :class="getPlanStatusStyle(editingOrg.plan_status)" class="text-[10px] font-bold uppercase tracking-wider">
                  {{ getPlanStatusLabel(editingOrg.plan_status) }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label class="flex flex-col gap-1">
                  <span class="text-[10px] font-bold text-slate-500 dark:text-[#8c909f] uppercase tracking-widest">{{ $t('admin.orgs.current_plan') }}</span>
                  <div class="flex items-center gap-3"><span class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-bold text-slate-900 dark:border-[#424754] dark:bg-[#10131a] dark:text-[#e1e2ec]">{{ editingOrg.plan_type || 'Chưa cấu hình' }}</span><NuxtLink :to="`/admin/billing/organizations/${editingOrg.id}`" class="text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:underline">Quản trị Billing</NuxtLink></div>
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[10px] font-bold text-slate-500 dark:text-[#8c909f] uppercase tracking-widest">{{ $t('admin.orgs.start_date') }}</span>
                  <input v-model="editingOrg.plan_started_at_local" type="datetime-local" class="bg-white dark:bg-[#10131a] border border-slate-200 dark:border-[#424754] rounded-lg px-3 py-2 text-[13px] text-slate-900 dark:text-[#e1e2ec] outline-none focus:border-indigo-500" />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[10px] font-bold text-slate-500 dark:text-[#8c909f] uppercase tracking-widest">{{ $t('admin.orgs.expiration_date') }}</span>
                  <input v-model="editingOrg.plan_expires_at_local" type="datetime-local" class="bg-white dark:bg-[#10131a] border border-slate-200 dark:border-[#424754] rounded-lg px-3 py-2 text-[13px] text-slate-900 dark:text-[#e1e2ec] outline-none focus:border-indigo-500" />
                </label>
              </div>

              <label class="mt-4 flex items-center gap-2 text-[12px] text-slate-700 dark:text-[#e1e2ec]">
                <input v-model="editingOrg.reset_plan_tokens" type="checkbox" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                {{ $t('admin.orgs.reset_monthly_tokens') }}
              </label>

              <div class="mt-4 flex flex-wrap gap-2">
                <button @click="setExpireYesterday" class="px-4 py-2 rounded-md border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-200 text-[11px] font-bold uppercase tracking-widest hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all">
                  {{ $t('admin.orgs.expire_yesterday') }}
                </button>
                <button @click="setRenewOneMonth" class="px-4 py-2 rounded-md border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-200 text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all">
                  {{ $t('admin.orgs.renew_month') }}
                </button>
                <button @click="handlePlanTestUpdate(false)" class="px-4 py-2 rounded-md bg-slate-900 dark:bg-black text-white dark:text-[#e1e2ec] text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                  Lưu thời hạn gói
                </button>
                <button @click="handlePlanTestUpdate(true)" class="px-4 py-2 rounded-md bg-rose-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-rose-700 transition-all">
                  Lưu và kiểm tra hết hạn
                </button>
              </div>
            </div>
          </div>
          <div class="px-8 py-6 bg-slate-50 dark:bg-[#191b23] flex justify-end gap-3 transition-colors">
            <button @click="selectedOrg = null" class="px-6 py-2.5 rounded-md border border-slate-200 dark:border-[#424754] text-slate-900 dark:text-[#e1e2ec] text-[11px] font-bold uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-[#32353c] transition-all">{{ $t('admin.orgs.close') }}</button>
            <button @click="handleUpdate" class="px-6 py-2.5 rounded-md bg-indigo-600 dark:bg-[#adc6ff] text-white dark:text-[#002e6a] text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 dark:hover:bg-[#4d8eff] shadow-[0_0_15px_rgba(79,70,229,0.2)] dark:shadow-[0_0_15px_rgba(173,198,255,0.2)] transition-all">{{ $t('admin.orgs.update_registry') }}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useOrganization } from '~/composables/useOrganization'

const { locale } = useI18n()
const localeCode = computed(() => locale.value === 'vi' ? 'vi-VN' : 'en-US')

const { organizations, fetchOrganizations, loading, toggleStatus, updateOrganization, deleteOrganization, exportCsv } = useOrganization()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 7

const selectedOrg = ref(null)
const editingOrg = ref(null)

const openModal = (org) => {
  editingOrg.value = JSON.parse(JSON.stringify(org))
  editingOrg.value.plan_type = (editingOrg.value.plan_type || '').toLowerCase()
  editingOrg.value.plan_started_at_local = toDatetimeLocalValue(editingOrg.value.plan_started_at)
  editingOrg.value.plan_expires_at_local = toDatetimeLocalValue(editingOrg.value.plan_expires_at)
  editingOrg.value.reset_plan_tokens = false
  selectedOrg.value = org
}

const handleUpdate = async () => {
  if (!editingOrg.value) return
  
  const payload = {
    name: editingOrg.value.name,
    phone: editingOrg.value.phone,
    address: editingOrg.value.address,
    description: editingOrg.value.description,
    status: editingOrg.value.status,
    tokens_limit: editingOrg.value.tokens_limit,
  }
  
  const success = await updateOrganization(editingOrg.value.id, payload)
  if (success) {
    selectedOrg.value = null
  }
}

const handlePlanTestUpdate = async (runExpirationCheck = false) => {
  if (editingOrg.value) await navigateTo(`/admin/billing/organizations/${editingOrg.value.id}`)
}

const setExpireYesterday = () => {
  if (!editingOrg.value) return
  const now = new Date()
  const started = new Date(now)
  started.setDate(started.getDate() - 31)
  const expired = new Date(now)
  expired.setDate(expired.getDate() - 1)

  editingOrg.value.plan_started_at_local = toDatetimeLocalValue(started)
  editingOrg.value.plan_expires_at_local = toDatetimeLocalValue(expired)
  editingOrg.value.reset_plan_tokens = true
}

const setRenewOneMonth = () => {
  if (!editingOrg.value) return
  const now = new Date()
  const expires = new Date(now)
  expires.setMonth(expires.getMonth() + 1)

  editingOrg.value.plan_started_at_local = toDatetimeLocalValue(now)
  editingOrg.value.plan_expires_at_local = toDatetimeLocalValue(expires)
  editingOrg.value.reset_plan_tokens = true
}

const { askConfirm } = useToast()

const handleToggleStatus = async (id) => {
  const isConfirmed = await askConfirm('Bạn có chắc chắn muốn thay đổi trạng thái Tổ chức này?')
  if (isConfirmed) {
    await toggleStatus(id)
  }
}

const handleDelete = async (id) => {
  const isConfirmed = await askConfirm('Cảnh báo: Hành động này sẽ xóa hoàn toàn Tổ chức. Bạn có chắc chắn?')
  if (isConfirmed) {
    await deleteOrganization(id)
  }
}

onMounted(async () => {
  await fetchOrganizations()
})

watch(searchQuery, () => {
  currentPage.value = 1
})

const totalPages = computed(() =>
  Math.ceil(organizations.value.length / pageSize) || 1
)

const paginatedOrganizations = computed(() => {
  const filtered = organizations.value.filter(org => 
    org.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    org.ownerName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    org.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  
  const start = (currentPage.value - 1) * pageSize
  return filtered.slice(start, start + pageSize)
})

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const formatTokens = (num) => {
  if (!num) return '0'
  if (Number(num) === -1) return 'Không giới hạn'
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toString()
}

const formatDate = (d) => {
  if (!d) return 'N/A'
  return new Date(d).toLocaleString(localeCode.value, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPlanDate = (d) => {
  if (!d) return 'Không có hạn'
  return new Date(d).toLocaleDateString(localeCode.value, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const toDatetimeLocalValue = (value) => {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60000)
  return localDate.toISOString().slice(0, 16)
}

const fromDatetimeLocalValue = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

const getPlanStyle = (plan) => {
  const styles = [
    'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-100 dark:border-sky-400/20',
    'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-100 dark:border-violet-400/20',
    'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-400/20'
  ]
  const key = String(plan || '')
  const hash = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return styles[hash % styles.length]
}

const getPlanStatusLabel = (status) => {
  const labels = {
    active: 'Đang hoạt động',
    expiring_soon: 'Sắp hết hạn',
    expired: 'Đã hết hạn',
  }
  return labels[status] || 'Không rõ'
}

const getPlanStatusStyle = (status) => {
  const styles = {
    active: 'text-emerald-600 dark:text-emerald-300',
    expiring_soon: 'text-amber-600 dark:text-amber-300',
    expired: 'text-rose-600 dark:text-rose-300',
  }
  return styles[status] || 'text-slate-400 dark:text-[#8c909f]'
}

const getStatusStyle = (s) => {
  const styles = {
    active: 'bg-emerald-50 dark:bg-[#4edea3]/10 text-emerald-600 dark:text-[#4edea3] border-emerald-100 dark:border-[#4edea3]/20 shadow-sm dark:shadow-[0_0_10px_rgba(78,222,163,0.1)]',
    healthy: 'bg-emerald-50 dark:bg-[#4edea3]/10 text-emerald-600 dark:text-[#4edea3] border-emerald-100 dark:border-[#4edea3]/20 shadow-sm dark:shadow-[0_0_10px_rgba(78,222,163,0.1)]',
    pending: 'bg-amber-50 dark:bg-[#ffb3ad]/10 text-amber-600 dark:text-[#ffb3ad] border-amber-100 dark:border-[#ffb3ad]/20',
    suspended: 'bg-rose-50 dark:bg-[#ffb3ad]/10 text-rose-600 dark:text-[#ffb3ad] border-rose-100 dark:border-[#ffb3ad]/20',
    inactive: 'bg-slate-100 dark:bg-black text-slate-500 dark:text-[#8c909f] border-slate-200 dark:border-[#424754]'
  }
  return styles[s?.toLowerCase()] || styles.inactive
}

const getStatusDotClass = (s) => {
  const dots = {
    active: 'bg-emerald-500 dark:bg-[#4edea3] shadow-sm dark:shadow-[0_0_8px_rgba(78,222,163,0.8)]',
    healthy: 'bg-emerald-500 dark:bg-[#4edea3] shadow-sm dark:shadow-[0_0_8px_rgba(78,222,163,0.8)]',
    pending: 'bg-amber-500 dark:bg-[#ffb3ad] shadow-sm dark:shadow-[0_0_8px_rgba(255,179,173,0.8)]',
    suspended: 'bg-rose-500 dark:bg-[#ffb3ad] shadow-sm dark:shadow-[0_0_8px_rgba(255,179,173,0.8)]',
    inactive: 'bg-slate-400 dark:bg-[#8c909f]'
  }
  return dots[s?.toLowerCase()] || dots.inactive
}

definePageMeta({
  layout: 'layout-admin'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

.font-data-mono {
  font-family: 'JetBrains Mono', monospace;
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.3);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(173, 198, 255, 0.3);
}
</style>
