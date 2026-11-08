<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <div class="flex items-end justify-between mb-4">
      <div>
        <h1
          class="text-3xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] tracking-tight transition-colors">
          {{ $t('partner.overview.dashboard') }}</h1>
        <p class="text-slate-500 dark:text-white/40 text-sm mt-1 transition-colors">{{ $t('partner.overview.subtitle') }}</p>
      </div>
      <span
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest transition-colors">
        <span class="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
        {{ $t('partner.overview.system_operational') }}
      </span>
    </div>

    <div v-if="usageStats.previous_plan_type && usageStats.plan_is_default" class="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <span class="material-symbols-outlined text-amber-500">warning</span>
        <span class="text-sm font-medium text-amber-700 dark:text-amber-400">
          {{ $t('partner.overview.expired_notice', { plan: usageStats.previous_plan_type.toUpperCase() }) }}
        </span>
      </div>
      <button type="button" @click="emit('switch-tab', 'billing')" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors text-xs uppercase tracking-widest whitespace-nowrap ml-4">
        {{ $t('partner.overview.upgrade_now') }}
      </button>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <div v-if="!usageStats.current_role || ['owner', 'admin'].includes(usageStats.current_role)"
        class="col-span-12 xl:col-span-8 glass-card rounded-2xl p-8 flex flex-col relative overflow-hidden bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#272a31] shadow-xl dark:shadow-none transition-colors group">
        
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none transition-all duration-700 group-hover:bg-indigo-500/20"></div>

        <div class="flex justify-between items-start mb-10 z-10">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-[#e1e2ec] font-['Space_Grotesk'] transition-colors tracking-tight">{{ $t('partner.overview.token_utilization') }}</h2>
            <p
              class="text-xs text-slate-400 dark:text-[#8c909f] mt-1.5 uppercase tracking-[0.15em] font-bold transition-colors">
              {{ $t('partner.overview.plan') }}: 
              <span class="inline-flex items-center ml-1 px-2.5 py-0.5 rounded-full text-[10px] tracking-widest transition-all"
                :class="planBadgeClass">
                {{ usageStats.plan || 'Chưa cấu hình' }}
              </span>
              <span v-if="!usageStats.plan_is_default && usageStats.plan_expires_at" class="ml-2 text-indigo-500 dark:text-indigo-400 text-[10px]">
                ({{ $t('partner.overview.expires_on') }}: {{ formatDate(usageStats.plan_expires_at) }})
              </span>
            </p>
          </div>
          <div class="text-right flex flex-col items-end">
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-bold text-indigo-600 dark:text-indigo-400 font-['Space_Grotesk'] transition-colors tabular-nums tracking-tight">
                {{ formatTokens(usageStats.token_used_this_month || 0) }}
              </span>
              <span v-if="usageStats.plan_token_limit !== -1" class="text-lg text-slate-400 dark:text-[#5a5f6e] font-['Space_Grotesk'] tabular-nums tracking-tight">
                / {{ formatTokens(usageStats.plan_token_limit) }}
              </span>
            </div>
            <div class="text-[10px] text-slate-500 dark:text-[#8c909f] font-bold uppercase tracking-[0.2em] mt-2 transition-colors flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full" :class="(usageStats.usage_percent_for_plan || 0) > 80 ? 'bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-emerald-500'"></span>
              {{ $t('partner.overview.usage_percent') }}: {{ usageStats.plan_token_limit === -1 ? $t('partner.overview.unlimited') : (usageStats.usage_percent_for_plan || 0) + '%' }}
            </div>
          </div>
        </div>

        <div v-if="usageStats.plan_token_limit !== -1" class="flex-1 flex flex-col justify-end z-10 mt-6 relative">
          <div class="flex justify-between items-end mb-3">
             <div class="flex flex-col">
               <span class="text-[11px] font-bold text-slate-500 dark:text-[#8c909f] uppercase tracking-widest">{{ $t('partner.overview.remaining_tokens') }}</span>
               <span class="text-[9px] text-slate-400">{{ $t('partner.overview.plan_tokens') }}: {{ formatTokens(usageStats.plan_remaining_tokens || 0) }} | {{ $t('partner.overview.topup_tokens') }}: {{ formatTokens(usageStats.topup_tokens || 0) }}</span>
               <span v-if="canManageBots && usageStats.plan_token_limit !== -1" class="text-[9px] text-slate-400 mt-1">
                 {{ $t('partner.overview.allocated_tokens') }}: {{ formatExactTokens(activeAllocatedTokenLimit) }} / {{ formatExactTokens(usageStats.plan_token_limit || 0) }}
               </span>
             </div>
             <span class="text-lg font-bold text-slate-800 dark:text-[#e1e2ec] font-data-mono">
               {{ usageStats.total_available_tokens === -1 ? $t('partner.overview.unlimited') : formatTokens(usageStats.total_available_tokens || 0) }}
             </span>
          </div>
          <div class="w-full h-1.5 bg-slate-100 dark:bg-[#191b23] rounded-full overflow-hidden relative shadow-inner">
            <div 
              class="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out flex justify-end"
              :class="(usageStats.usage_percent_for_plan || 0) > 85 ? 'bg-gradient-to-r from-rose-500/50 to-rose-500' : 'bg-gradient-to-r from-indigo-500/50 to-indigo-500 dark:from-[#adc6ff]/50 dark:to-[#adc6ff]'"
              :style="`width: ${Math.min(100, usageStats.usage_percent_for_plan || 0)}%`">
                <div class="w-2 h-full bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] dark:shadow-[0_0_10px_2px_rgba(173,198,255,0.8)]"></div>
            </div>
          </div>
        </div>
        
        <div v-else class="flex-1 flex flex-col justify-end items-center z-10 mt-6">
          <div class="px-6 py-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
            <span class="material-symbols-outlined text-emerald-500" style="font-variation-settings: 'FILL' 1;">all_inclusive</span>
            <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">{{ $t('partner.overview.unlimited_tier') }}</span>
          </div>
        </div>

      </div>

      <div v-if="usageStats.current_role && !['owner', 'admin'].includes(usageStats.current_role)"
        class="col-span-12 xl:col-span-8 glass-card rounded-2xl p-8 flex flex-col relative overflow-hidden bg-white dark:bg-[#111318] border border-slate-200 dark:border-[#272a31] shadow-xl dark:shadow-none transition-colors group">
        
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none transition-all duration-700 group-hover:bg-emerald-500/20"></div>

        <div class="flex justify-between items-start mb-10 z-10">
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-[#e1e2ec] font-['Space_Grotesk'] transition-colors tracking-tight">{{ $t('partner.overview.my_quota') }}</h2>
            <p class="text-xs text-slate-400 dark:text-[#8c909f] mt-1.5 uppercase tracking-[0.15em] font-bold transition-colors">
              {{ $t('partner.overview.assigned_bots', { count: usageStats.member_assigned_bot_count || 0 }) }}
            </p>
          </div>
          <div class="text-right flex flex-col items-end">
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-bold text-emerald-600 dark:text-emerald-400 font-['Space_Grotesk'] transition-colors tabular-nums tracking-tight">
                {{ formatExactTokens(usageStats.member_assigned_token_used || 0) }}
              </span>
              <span class="text-lg text-slate-400 dark:text-[#5a5f6e] font-['Space_Grotesk'] tabular-nums tracking-tight">
                / {{ formatExactTokens(usageStats.member_assigned_token_limit || 0) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-end z-10 mt-6 relative">
          <div class="flex justify-between items-end mb-3">
             <div class="flex flex-col">
               <span class="text-[11px] font-bold text-slate-500 dark:text-[#8c909f] uppercase tracking-widest">{{ $t('partner.overview.remaining_tokens') }}</span>
             </div>
             <span class="text-lg font-bold text-slate-800 dark:text-[#e1e2ec] font-data-mono">
               {{ formatExactTokens(usageStats.member_assigned_token_remaining || 0) }}
             </span>
          </div>
          <div class="w-full h-1.5 bg-slate-100 dark:bg-[#191b23] rounded-full overflow-hidden relative shadow-inner">
            <div 
              class="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out flex justify-end bg-gradient-to-r from-emerald-500/50 to-emerald-500 dark:from-[#34d399]/50 dark:to-[#34d399]"
              :style="`width: ${usageStats.member_assigned_token_limit ? Math.min(100, ((usageStats.member_assigned_token_used || 0) / usageStats.member_assigned_token_limit) * 100) : 0}%`">
                <div class="w-2 h-full bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] dark:shadow-[0_0_10px_2px_rgba(52,211,153,0.8)]"></div>
            </div>
          </div>
          <div class="mt-4 text-center">
            <span class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-widest italic">{{ $t('partner.overview.quota_note') }}</span>
          </div>
        </div>
      </div>

      <div
        class="col-span-12 xl:col-span-4 glass-card rounded-2xl p-8 flex flex-col bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors">
        <h2 class="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] mb-8 transition-colors">
          {{ $t('partner.overview.service_health') }}</h2>
        <div class="space-y-4">
          <div v-for="s in healthServices" :key="s.name"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 group hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
            <div class="flex items-center gap-3">
              <span
                class="material-symbols-outlined text-lg text-slate-400 dark:text-white/40 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"
                style="font-variation-settings: 'FILL' 1;">{{ s.icon }}</span>
              <span class="text-sm font-medium text-slate-700 dark:text-white/80 transition-colors">{{ s.name }}</span>
            </div>
            <span class="text-[10px] font-bold flex items-center gap-1.5 transition-colors"
              :class="s.color === 'cyan' ? 'text-cyan-600 dark:text-cyan-400' : s.color === 'purple' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-white/20'">{{
                s.status }}</span>
          </div>
        </div>
      </div>

      <div
        class="col-span-12 glass-card rounded-2xl p-8 animate-in slide-in-from-bottom-4 duration-700 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ $t('partner.overview.active_deployments') }}</h2>
          <button v-if="canManageBots" @click="openCreateModal"
            class="luminous-btn px-4 py-2 rounded-lg text-[10px] font-bold text-white dark:text-black uppercase tracking-widest shadow-lg dark:shadow-none">{{ $t('partner.overview.new_services') }}</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="border-b border-slate-100 dark:border-white/5 text-[10px] text-slate-400 dark:text-white/20 font-bold uppercase tracking-[0.2em] transition-colors">
                <th class="pb-4">{{ $t('partner.overview.name') }}</th>
                <th class="pb-4">{{ $t('partner.overview.token_limit') }}</th>
                <th class="pb-4">{{ $t('partner.overview.token_used') }}</th>
                <th class="pb-4 text-right">{{ $t('partner.overview.status') }}</th>
                <th v-if="canManageBots" class="pb-4 text-right">{{ $t('partner.overview.actions') }}</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="service in partnerServices" :key="service.id">
                <td class="py-5">{{ service.name }}</td>
                <td class="py-5">{{ service.token_limit }}</td>
                <td class="py-5">
                  <span v-if="usageStats.current_role && !['owner', 'admin'].includes(usageStats.current_role)">
                    {{ formatExactTokens(service.member_token_used ?? service.token_used) }}
                  </span>
                  <span v-else>
                    {{ service.member_token_used ?? service.token_used }}
                  </span>
                </td>
                <td class="py-5 text-right">
                  <span :class="service.is_plan_locked ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-500/5 px-2.5 py-1 rounded-full border border-amber-500/10' : (Number(service.token_limit) > 0 && Number(service.token_used) >= Number(service.token_limit) ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-500/5 px-2.5 py-1 rounded-full border border-rose-500/10' : (service.status === 'active' ? 'text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/5 px-2.5 py-1 rounded-full border border-cyan-500/10' : 'text-slate-400 dark:text-white/20 px-2.5 py-1'))">
                    <span v-if="service.is_plan_locked" class="flex items-center justify-end gap-1"><span class="material-symbols-outlined text-[14px]">lock</span> {{ $t('partner.overview.locked_over_limit') }}</span>
                    <span v-else-if="Number(service.token_limit) > 0 && Number(service.token_used) >= Number(service.token_limit)" class="flex items-center justify-end gap-1"><span class="material-symbols-outlined text-[14px]">error</span> {{ $t('partner.overview.token_exhausted') }}</span>
                    <span v-else>{{ service.status === 'active' ? $t('partner.overview.status_active') : $t('partner.overview.status_inactive') }}</span>
                  </span>
                </td>
                <td v-if="canManageBots" class="py-5 text-right">
                  <div class="flex justify-end gap-2">

                    <button @click="openEditModal(service)" class="px-3 py-2.5 border border-slate-200 dark:border-[#424754] rounded-lg 
                            text-slate-400 dark:text-[#8c909f] 
                            hover:text-indigo-500 dark:hover:text-[#adc6ff] 
                            hover:border-indigo-200 dark:hover:border-[#adc6ff] 
                            hover:bg-indigo-50 dark:hover:bg-[#adc6ff]/5 
                            transition-all flex items-center justify-center">

                      <span class="material-symbols-outlined text-[20px]">
                        edit_square
                      </span>
                    </button>

                    <button @click="handleDelete(service)" class="px-3 py-2.5 border border-slate-200 dark:border-[#424754] rounded-lg 
                            text-slate-400 dark:text-[#8c909f] 
                            hover:text-rose-500 dark:hover:text-[#ffb3ad] 
                            hover:border-rose-200 dark:hover:border-[#ffb3ad] 
                            hover:bg-rose-50 dark:hover:bg-[#ffb3ad]/5 
                            transition-all flex items-center justify-center">

                      <span class="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

      <div class="col-span-12 glass-card rounded-2xl p-8 animate-in slide-in-from-bottom-6 duration-700 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors mt-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] transition-colors">{{ $t('partner.overview.usage_logs') || 'Lịch sử API (Usage Logs)' }}</h2>
          <button @click="exportUsageCsv" class="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm">
            <span class="material-symbols-outlined text-sm">download</span>
            {{ $t('partner.overview.export_csv') }}
          </button>
        </div>
        
        <div class="overflow-x-auto min-h-[250px] custom-scrollbar">
          <table class="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr class="border-b border-slate-100 dark:border-white/5 text-[10px] text-slate-400 dark:text-white/20 font-bold uppercase tracking-[0.2em] transition-colors">
                <th class="pb-4 pr-4">{{ $t('partner.overview.time') }}</th>
                <th class="pb-4 pr-4">{{ $t('partner.overview.bot_model_mode') }}</th>
                <th class="pb-4 pr-4">{{ $t('partner.overview.user') }}</th>
                <th class="pb-4 pr-4 text-right">{{ $t('partner.overview.token_in') }}</th>
                <th class="pb-4 pr-4 text-right">{{ $t('partner.overview.token_out') }}</th>
                <th class="pb-4 pr-4 text-right">{{ $t('partner.overview.total_token') }}</th>
                <th class="pb-4 text-right">{{ $t('partner.overview.cost') }}</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr v-for="log in usageLogs" :key="log.id" class="border-b border-slate-50 dark:border-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <td class="py-4 pr-4 text-slate-500 dark:text-white/60">
                  {{ formatDateTime(log.created_at) }}
                </td>
                <td class="py-4 pr-4">
                  <div class="font-bold text-slate-700 dark:text-white/90">{{ log.service?.name || 'N/A' }}</div>
                  <div class="text-[10px] text-slate-400 dark:text-white/40 mt-1 uppercase tracking-widest">{{ log.model }} • {{ log.mode || 'chat' }}</div>
                </td>
                <td class="py-4 pr-4 text-slate-600 dark:text-white/70">{{ log.user?.name || $t('partner.overview.guest') }}</td>
                <td class="py-4 pr-4 text-right font-data-mono text-indigo-600 dark:text-indigo-400">{{ formatTokens(log.input_tokens) }}</td>
                <td class="py-4 pr-4 text-right font-data-mono text-purple-600 dark:text-purple-400">{{ formatTokens(log.output_tokens) }}</td>
                <td class="py-4 pr-4 text-right font-data-mono font-bold text-slate-800 dark:text-white">{{ formatTokens(log.total_tokens) }}</td>
                <td class="py-4 text-right font-bold font-data-mono" :class="hasCost(log) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-[#8c909f]'">
                  {{ hasCost(log) ? '$' + resolveCost(log).toFixed(6) : 'N/A' }}
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="!usageLogs?.length" class="py-12 text-center text-slate-400 dark:text-white/40 text-sm font-bold uppercase tracking-widest">
            {{ $t('partner.overview.no_data') }}
          </div>
        </div>

        <div v-if="usagePagination?.total > 0" class="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <span class="text-[10px] text-slate-400 dark:text-white/30 uppercase font-bold tracking-widest">
            {{ $t('partner.overview.page_of', { current: usagePagination.current_page, last: usagePagination.last_page }) }}
          </span>
          <div class="flex gap-2">
            <button @click="changeUsagePage(usagePagination.current_page - 1)" :disabled="usagePagination.current_page <= 1" class="p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 transition-all">
              <span class="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button @click="changeUsagePage(usagePagination.current_page + 1)" :disabled="usagePagination.current_page >= usagePagination.last_page" class="p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 transition-all">
              <span class="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

  </div>
  <transition name="modal">
    <div v-if="showModal"
      class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 dark:bg-[#09090B]/80 backdrop-blur-md p-6 transition-colors">

      <div
        class="bg-white dark:bg-[#1d2027] border border-slate-200 dark:border-[#424754] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300 transition-colors">

        <div
          class="px-8 py-6 border-b border-slate-100 dark:border-[#424754] flex justify-between items-center bg-slate-50 dark:bg-[#191b23] transition-colors">

          <h2 class="text-xl font-bold text-slate-900 dark:text-[#e1e2ec] transition-colors">
            {{ $t('partner.overview.create_service_title') }}
          </h2>

          <button @click="showModal = false"
            class="text-slate-400 dark:text-[#8c909f] hover:text-slate-900 dark:hover:text-[#e1e2ec] transition-colors">

            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="p-8 space-y-6">

          <div class="flex flex-col gap-2">
            <label
              class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">
              {{ $t('partner.overview.display_name') }}
            </label>

            <input v-model="form.name" type="text"
              class="w-full bg-slate-50 dark:bg-[#10131a] border border-slate-200 dark:border-[#424754] rounded-xl px-4 py-3.5 text-slate-900 dark:text-[#e1e2ec] focus:border-indigo-500 dark:focus:border-[#adc6ff]/50 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#adc6ff]/50 outline-none transition-all text-sm font-medium shadow-inner transition-colors"
              :placeholder="$t('partner.overview.display_name_placeholder')" />
          </div>
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">
                {{ $t('partner.overview.system_prompt') }}
              </label>
              <textarea v-model="form.system_prompt" rows="4"
                class="w-full bg-slate-50 dark:bg-[#10131a] border border-slate-200 dark:border-[#424754] rounded-xl px-4 py-3.5 text-slate-900 dark:text-[#e1e2ec] focus:border-indigo-500 dark:focus:border-[#adc6ff]/50 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#adc6ff]/50 outline-none transition-all text-sm font-medium shadow-inner resize-none transition-colors"
                :placeholder="$t('partner.overview.system_prompt_placeholder')"></textarea>
            </div>
          <div class="grid grid-cols-2 gap-6">

            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">
                {{ $t('partner.overview.token_limit') }}
              </label>

              <input v-model.number="form.token_limit" type="number"
                min="0"
                :max="usageStats.plan_token_limit === -1 ? undefined : Math.max(0, allocatableTokenLimitForCurrentForm)"
                class="w-full bg-slate-50 dark:bg-[#10131a] border rounded-xl px-4 py-3.5 text-slate-900 dark:text-[#e1e2ec] focus:border-indigo-500 dark:focus:border-[#adc6ff]/50 outline-none transition-all text-sm font-data-mono transition-colors"
                :class="isAllocationExceeded ? 'border-rose-400 dark:border-rose-500/70 ring-1 ring-rose-400/50' : 'border-slate-200 dark:border-[#424754]'" />
              <div v-if="usageStats.plan_token_limit !== -1" class="text-[10px] leading-relaxed">
                <p class="text-slate-400 dark:text-[#8c909f]">
                  {{ $t('partner.overview.allocated_tokens') }}:
                  <span class="font-bold text-slate-600 dark:text-[#c3c5d0]">{{ formatExactTokens(projectedAllocatedTokenLimit) }}</span>
                  /
                  <span class="font-bold text-slate-600 dark:text-[#c3c5d0]">{{ formatExactTokens(usageStats.plan_token_limit || 0) }}</span>
                </p>
                <p :class="isAllocationExceeded ? 'text-rose-500 dark:text-rose-400 font-bold' : 'text-emerald-600 dark:text-emerald-400'">
                  {{ isAllocationExceeded
                    ? $t('partner.overview.allocation_exceeded', { amount: formatExactTokens(Math.abs(allocationRemainingAfterForm)) })
                    : $t('partner.overview.allocation_remaining', { amount: formatExactTokens(allocationRemainingAfterForm) }) }}
                </p>
              </div>
            </div>

            <div class="flex flex-col gap-2 relative">
              <label
                class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">
                {{ $t('partner.overview.ai_type') }}
              </label>

              <button type="button" @click="showAIDropdown = !showAIDropdown"
                class="w-full flex items-center justify-between bg-slate-50 dark:bg-[#10131a] border border-slate-200 dark:border-[#424754] rounded-xl px-4 py-3.5 text-left cursor-pointer transition-all hover:border-slate-300 dark:hover:border-[#5a5f6e]"
                :class="showAIDropdown ? 'border-indigo-500 dark:border-[#adc6ff]/50 ring-1 ring-indigo-500 dark:ring-[#adc6ff]/50' : ''">
                <div class="flex items-center gap-3">
                  <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="form.service_id ? 'bg-indigo-500 dark:bg-[#adc6ff]' : 'bg-slate-200 dark:bg-white/5'">
                    <span class="material-symbols-outlined text-[14px]"
                      :class="form.service_id ? 'text-white dark:text-[#002e6a]' : 'text-slate-400 dark:text-white/30'"
                      style="font-variation-settings: 'FILL' 1;">
                      {{ form.service_id === 'tour' ? 'travel_explore' : form.service_id === 'villa' ? 'hotel' : form.service_id === 'inventory' ? 'inventory_2' : form.service_id ? 'support_agent' : 'smart_toy' }}
                    </span>
                  </div>
                  <span class="text-sm font-medium" 
                    :class="form.service_id ? 'text-slate-900 dark:text-[#e1e2ec]' : 'text-slate-400 dark:text-[#8c909f]'">
                    {{ selectedAIName || $t('partner.overview.select_ai_type') }}
                  </span>
                </div>
                <span class="material-symbols-outlined text-lg text-slate-400 dark:text-[#8c909f] transition-transform duration-200"
                  :class="showAIDropdown ? 'rotate-180' : ''">
                  expand_more
                </span>
              </button>

              <transition name="dropdown">
                <div v-if="showAIDropdown"
                  class="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white dark:bg-[#1d2027] border border-slate-200 dark:border-[#424754] rounded-xl shadow-xl dark:shadow-2xl overflow-hidden">
                  <div class="max-h-48 overflow-y-auto custom-scrollbar">
                    <div v-for="cat in aiCatalog" :key="cat.id"
                      @click="form.service_id = cat.id; showAIDropdown = false"
                      class="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                      :class="form.service_id === cat.id 
                        ? 'bg-indigo-50 dark:bg-[#adc6ff]/5' 
                        : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'">
                      <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        :class="form.service_id === cat.id ? 'bg-indigo-500 dark:bg-[#adc6ff]' : 'bg-slate-100 dark:bg-white/5'">
                        <span class="material-symbols-outlined text-[14px]"
                          :class="form.service_id === cat.id ? 'text-white dark:text-[#002e6a]' : 'text-slate-400 dark:text-white/30'"
                          style="font-variation-settings: 'FILL' 1;">
                          {{ cat.id === 'tour' ? 'travel_explore' : cat.id === 'villa' ? 'hotel' : cat.id === 'inventory' ? 'inventory_2' : 'support_agent' }}
                        </span>
                      </div>
                      <span class="text-sm font-medium flex-1"
                        :class="form.service_id === cat.id ? 'text-indigo-700 dark:text-[#adc6ff]' : 'text-slate-600 dark:text-[#c3c5d0]'">
                        {{ cat.name }}
                      </span>
                      <span v-if="form.service_id === cat.id" class="material-symbols-outlined text-[16px] text-indigo-500 dark:text-[#adc6ff]">check</span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

          </div>

          <div class="flex flex-col justify-end">

            <div @click="form.active = !form.active"
              class="flex items-center gap-3 bg-indigo-50 dark:bg-[#adc6ff]/5 p-3.5 rounded-xl border border-indigo-100 dark:border-[#adc6ff]/10 hover:bg-indigo-100 dark:hover:bg-[#adc6ff]/10 cursor-pointer transition-all group transition-colors">

              <div
                class="w-5 h-5 rounded border border-slate-200 dark:border-[#424754] flex items-center justify-center transition-all"
                :class="{ 'bg-indigo-600 dark:bg-[#adc6ff] border-indigo-600 dark:border-[#adc6ff]': form.active }">

                <span v-if="form.active"
                  class="material-symbols-outlined text-[16px] text-white dark:text-[#002e6a] font-bold">
                  check
                </span>
              </div>

              <span class="font-bold text-[11px] uppercase tracking-widest transition-colors"
                :class="form.active ? 'text-indigo-600 dark:text-[#adc6ff]' : 'text-slate-400 dark:text-[#8c909f]'">
                {{ $t('partner.overview.is_active') }}
              </span>

            </div>
          </div>

        </div>

        <div class="px-8 py-6 bg-slate-50 dark:bg-[#191b23] flex gap-4 transition-colors">

          <button @click="showModal = false"
            class="flex-1 py-3.5 font-bold text-slate-400 dark:text-[#8c909f] hover:text-slate-900 dark:hover:text-[#e1e2ec] hover:bg-slate-200 dark:hover:bg-[#272a31] rounded-xl transition-all text-[11px] uppercase tracking-[0.2em] border border-transparent hover:border-slate-300 dark:hover:border-[#424754]">

            {{ $t('partner.overview.cancel') }}
          </button>

          <button @click="submitFormServices"
            class="flex-1 py-3.5 font-bold bg-indigo-600 dark:bg-[#adc6ff] text-white dark:text-[#002e6a] rounded-xl hover:bg-indigo-700 dark:hover:bg-[#4d8eff] shadow-lg shadow-indigo-200 dark:shadow-[#adc6ff]/10 transition-all text-[11px] uppercase tracking-[0.2em] active:scale-95">

            {{ $t('partner.overview.activate') }}
          </button>

        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue'
import { useCookie } from '#app'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['switch-tab'])

const props = defineProps({
  organizationId: {
    type: String,
    default: ''
  }
})

const { t, locale } = useI18n()
const toast = useToast();
const token = useCookie('accessToken'); 
const config = useRuntimeConfig();
const baseURL = config.public.apiBase;

const organizationHeaders = () => {
  return {
    'Authorization': `Bearer ${token.value}`,
    'Accept': 'application/json',
    ...(props.organizationId ? { 'X-Organization-Id': props.organizationId } : {})
  }
}

const showModal = ref(false);
const modalType = ref('create')
const currentId = ref(null)
const partnerServices = ref([])
const aiCatalog = ref([])
const showAIDropdown = ref(false)
const serviceAccess = ref({
  role: 'viewer',
  can_manage_bots: false,
  can_chat: false
})

const canManageBots = computed(() => Boolean(serviceAccess.value?.can_manage_bots))

const usageStats = ref({
  plan: '',
  plan_code: '',
  plan_is_default: false,
  plan_token_limit: 0,
  plan_remaining_tokens: 0,
  topup_tokens: 0,
  total_available_tokens: 0,
  token_used_this_month: 0,
  usage_percent_for_plan: 0,
  current_role: null,
  member_assigned_bot_count: 0,
  member_assigned_token_limit: 0,
  member_assigned_token_used: 0,
  member_assigned_token_remaining: 0,
  plan_expires_at: null,
  previous_plan_type: null
})
const planBadgeClass = computed(() => usageStats.value.plan_is_default
  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.15)]')
const totalTokenUsed = computed(() => {
  return partnerServices.value.reduce((sum, s) => sum + (Number(s.token_used) || 0), 0)
})

const activeAllocatedTokenLimit = computed(() => {
  return partnerServices.value
    .filter(service => service.status === 'active' && !service.is_plan_locked)
    .reduce((sum, service) => sum + (Number(service.token_limit) || 0), 0)
})

const formatTokens = (val) => {
  if (val == null) return '0'
  if (val === 0) return '0'
  if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
  if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
  return val.toString()
}

const formatExactTokens = (val) => {
  if (val == null) return '0'
  const num = Number(val)
  if (isNaN(num)) return val.toString()
  const loc = locale?.value || 'vi-VN'
  return new Intl.NumberFormat(loc).format(num)
}

const localeCode = computed(() => locale.value === 'vi' ? 'vi-VN' : 'en-US')
const formatDate = (value) => value ? new Intl.DateTimeFormat(localeCode.value).format(new Date(value)) : ''
const formatDateTime = (value) => value ? new Intl.DateTimeFormat(localeCode.value, { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(value)) : ''

const resolveCost = (log) => Number(log.total_cost ?? log.cost ?? ((Number(log.input_cost ?? 0) + Number(log.output_cost ?? 0))))
const hasCost = (log) => log.total_cost != null || log.cost != null || log.input_cost != null || log.output_cost != null

const selectedAIName = computed(() => {
  const found = aiCatalog.value.find(c => c.id === form.value.service_id)
  return found ? found.name : ''
})

const form = ref({
  name: '',
  token_limit: 0,
  service_id: '',
  active: true,
  system_prompt: ''

})

const currentEditingService = computed(() => {
  if (modalType.value !== 'edit' || !currentId.value) return null
  return partnerServices.value.find(service => String(service.id) === String(currentId.value)) || null
})

const currentEditingAllocatedTokenLimit = computed(() => {
  const service = currentEditingService.value
  if (!service || service.status !== 'active' || service.is_plan_locked) return 0
  return Number(service.token_limit) || 0
})

const projectedAllocatedTokenLimit = computed(() => {
  const requested = form.value.active ? (Number(form.value.token_limit) || 0) : 0
  return Math.max(0, activeAllocatedTokenLimit.value - currentEditingAllocatedTokenLimit.value + requested)
})

const allocationRemainingAfterForm = computed(() => {
  if (usageStats.value.plan_token_limit === -1) return -1
  return (Number(usageStats.value.plan_token_limit) || 0) - projectedAllocatedTokenLimit.value
})

const allocatableTokenLimitForCurrentForm = computed(() => {
  if (usageStats.value.plan_token_limit === -1) return undefined
  return (Number(usageStats.value.plan_token_limit) || 0) - activeAllocatedTokenLimit.value + currentEditingAllocatedTokenLimit.value
})

const isAllocationExceeded = computed(() => {
  return usageStats.value.plan_token_limit !== -1 && allocationRemainingAfterForm.value < 0
})

const openCreateModal = () => {
  if (!canManageBots.value) {
    toast.error(t('partner.overview.error_no_permission_add_bot'))
    return
  }

  modalType.value = 'create' 
  form.value = {
    name: '',
    token_limit: 0,
    service_id: '',
    active: true,
    system_prompt: ''
  }
  currentId.value = null
  showModal.value = true

}

const openEditModal = (service) => {
  if (!canManageBots.value) {
    toast.error(t('partner.overview.error_no_permission_edit_bot'))
    return
  }

  modalType.value = 'edit'
  currentId.value = service.id

  form.value = {
    name: service.name,
    token_limit: service.token_limit,
    service_id: service.type,
    active: service.status === 'active',
    system_prompt: service.system_prompt || ''
  }

  showModal.value = true
}

const fetchServices = async () => {
  try {
    const res = await $fetch(`${baseURL}/partner/all-services`, {
      headers: organizationHeaders()
    })
    aiCatalog.value = res.data || res || []
  } catch (err) {
    console.error('Lỗi lấy danh mục AI:', err)
  }
}

const fetchUsageStats = async () => {
  try {
    const res = await $fetch(`${baseURL}/partner/usage`, {
      headers: organizationHeaders()
    })
    usageStats.value = res || usageStats.value
  } catch (err) {
    console.error('Lỗi lấy Usage Stats:', err)
  }
}

const fetchAllServices = async () => {
  try {
    const res = await $fetch(`${baseURL}/partner/list-services`, {
      headers: organizationHeaders()
    })
    partnerServices.value = res.data || res || []
    serviceAccess.value = res.access || serviceAccess.value
  } catch (err) {
    console.error('Lỗi lấy danh sách Bot:', err)
  }
}


const usageLogs = ref([])
const usagePagination = ref({ current_page: 1, last_page: 1, total: 0 })

const fetchUsageLogs = async (page = 1) => {
  try {
    const res = await $fetch(`${baseURL}/partner/usage/logs`, {
      headers: organizationHeaders(),
      query: { page, page_size: 10 }
    })
    usageLogs.value = res.data || []
    usagePagination.value = res.pagination || { current_page: 1, last_page: 1, total: 0 }
  } catch (err) {
    console.error('Lỗi lấy Usage Logs:', err)
  }
}

const changeUsagePage = (page) => {
  if (page >= 1 && page <= usagePagination.value.last_page) {
    fetchUsageLogs(page)
  }
}

const exportUsageCsv = () => {
  let endpoint = `${baseURL}/partner/usage/export-csv?1=1`
  if (props.organizationId) {
    endpoint += `&organization_id=${props.organizationId}`
  }
  
  $fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token.value}`,
      'Accept': 'text/csv'
    },
    responseType: 'blob'
  }).then(blob => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `usage_logs.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }).catch(err => {
    console.error('Lỗi xuất CSV:', err)
    toast.error(t('partner.overview.error_export_csv'))
  })
}

const submitFormServices = async () => {
  if (!canManageBots.value) {
    toast.error(t('partner.overview.error_no_permission_manage_bot'))
    return
  }

  if (isAllocationExceeded.value) {
    toast.error(
      t('partner.overview.allocation_submit_blocked', {
        amount: formatExactTokens(Math.abs(allocationRemainingAfterForm.value))
      })
    )
    return
  }

  try {
    if (modalType.value === 'edit') {
      await $fetch(`${baseURL}/partner/list-services/${currentId.value}`, {
        method: 'PATCH',
        headers: organizationHeaders(),
        body: form.value
      })
    } else {
      await $fetch(`${baseURL}/partner/list-services`, {
        method: 'POST',
        headers: organizationHeaders(),
        body: form.value
      })
    }

    toast.success(
      modalType.value === 'edit'
        ? t('partner.overview.update_success')
        : t('partner.overview.create_success')
    )

    showModal.value = false

    form.value = {
      name: '',
      token_limit: 0,
      service_id: '',
      active: true,
      system_prompt: '' 
    }

    await fetchAllServices()

  } catch (err) {
    console.error('Lỗi Submit Form:', err)
    if (err.data && err.data.message) {
      toast.error(err.data.message)
    } else if (err.response && err.response._data && err.response._data.message) {
      toast.error(err.response._data.message)
    } else {
      toast.error(t('partner.overview.action_failed'))
    }
  }
}

const handleDelete = async (service) => {
  if (!canManageBots.value) {
    toast.error(t('partner.overview.error_no_permission_delete_bot'))
    return
  }

  const ok = await toast.askConfirm(t('partner.overview.delete_confirm', { name: service.name }))
  if (!ok) return
  try {
    await $fetch(`${baseURL}/partner/list-services/${service.id}`, {
      method: 'DELETE',
      headers: organizationHeaders()
    })
    toast.success(t('partner.overview.delete_success'))
    await fetchAllServices()
  } catch (err) {
    console.error('Lỗi xóa:', err)
    toast.error(t('partner.overview.delete_failed'))
  }
}



const healthServices = computed(() => [
  { name: 'Inference Core', status: '99.9%', color: 'cyan', icon: 'dns' },
  { name: 'API Gateway', status: '99.8%', color: 'purple', icon: 'api' },
  { name: 'Vector Store', status: t('partner.overview.syncing'), color: 'slate', icon: 'database' }
])

const defaultServices = [
  { name: 'prod-chat-us-east', type: 'Orbit Runtime v2.4', latency: '42ms', status: 'active' },
  { name: 'dev-embedding-eu', type: 'Orbit Embed v1', latency: '18ms', status: 'active' }
]

onMounted(async () => {
  await fetchUsageStats()
  await fetchServices()
  await fetchAllServices()
  await fetchUsageLogs()
})



</script>

<style scoped>
.dropdown-enter-active { animation: dropIn 0.15s ease-out; }
.dropdown-leave-active { animation: dropIn 0.1s ease-in reverse; }
@keyframes dropIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.3); border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.5); }
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
  0% {
    background-position: -200% center;
  }

  100% {
    background-position: 200% center;
  }
}
</style>
