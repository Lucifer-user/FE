<template>
  <div class="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-[#e1e2ec] font-body-base antialiased p-6 md:p-10 transition-colors duration-500">
    <div class="max-w-[1440px] mx-auto">
      
      <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
        <div class="animate-in fade-in slide-in-from-left duration-700">
          <h1 class="font-display-lg text-3xl md:text-4xl font-bold tracking-tighter text-slate-900 dark:text-[#e1e2ec] mb-2 transition-colors flex items-center gap-3">
            {{ $t('admin.users.title') }}
            <span v-if="!loading" class="text-lg font-normal bg-slate-100 dark:bg-black px-3 py-1 rounded-full text-slate-500 dark:text-[#8c909f]">
              {{ totalUsers || users.length }}
            </span>
          </h1>
          <p class="font-body-base text-sm text-slate-500 dark:text-[#c2c6d6] flex items-center gap-2 transition-colors">
            <span class="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#4edea3] shadow-[0_0_8px_rgba(16,185,129,0.4)] dark:shadow-[0_0_8px_rgba(78,222,163,0.8)]"></span>
            {{ $t('admin.users.subtitle') }}
          </p>
        </div>
        
        <div class="flex gap-3 animate-in fade-in slide-in-from-right duration-700">
          <button @click="showTrash = !showTrash" 
            :class="[
              'px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all active:scale-95 text-sm font-medium border shadow-sm',
              showTrash 
                ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50' 
                : 'bg-white dark:bg-black/40 text-slate-700 dark:text-[#c2c6d6] border-slate-200 dark:border-[#27272A] hover:bg-slate-50 dark:hover:bg-[#32353c]'
            ]">
            <span class="material-symbols-outlined text-[18px]">{{ showTrash ? 'person' : 'delete' }}</span>
            {{ showTrash ? $t('admin.users.back_to_users') : $t('admin.users.trash_bin') }}
          </button>
          <button @click="handleExportCsv" class="bg-white dark:bg-black/40 backdrop-blur-xl px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-[#32353c] transition-all active:scale-95 text-sm font-medium border border-slate-200 dark:border-[#27272A] shadow-sm">
            <span class="material-symbols-outlined text-[18px]">download</span>
            {{ $t('admin.users.export_csv') }}
          </button>
          <button @click="isInviteModalOpen = true" class="bg-indigo-600 dark:bg-[#adc6ff] text-white dark:text-[#002e6a] px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-indigo-700 dark:hover:bg-[#4d8eff] transition-all active:scale-95 font-bold text-sm shadow-lg dark:shadow-[0_0_20px_rgba(173,198,255,0.3)]">
            <span class="material-symbols-outlined text-[18px]">person_add</span>
            {{ $t('admin.users.invite_user') }}
          </button>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="bg-white dark:bg-black/40 backdrop-blur-xl rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center border border-slate-200 dark:border-[#27272A] animate-in fade-in slide-in-from-bottom duration-700 delay-100 shadow-sm transition-colors">
        <div class="w-full md:w-1/3 relative group">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8c909f] group-focus-within:text-indigo-600 dark:group-focus-within:text-[#adc6ff] transition-colors" style="font-size: 20px;">search</span>
          <input 
            v-model="searchQuery" 
            @keyup.enter="handleSearch"
            class="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#424754] rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-[#e1e2ec] focus:outline-none focus:border-indigo-500 dark:focus:border-[#adc6ff] focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#adc6ff] transition-all font-body-sm text-sm placeholder:text-slate-400 dark:placeholder:text-[#424754]" 
            :placeholder="$t('admin.users.search_placeholder')" 
            type="text"
          />
        </div>
        
        <div class="w-full md:w-auto flex gap-3 flex-wrap">
          <div class="relative min-w-[140px]">
            <select v-model="filterStatus"
              class="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#424754] rounded-lg px-4 py-2.5 text-slate-600 dark:text-[#c2c6d6] focus:outline-none focus:border-indigo-500 dark:focus:border-[#adc6ff] appearance-none font-body-sm text-sm cursor-pointer pr-10 transition-colors">
              <option value="">{{ $t('admin.users.status_all') }}</option>
              <option value="active">{{ $t('admin.users.status_active') }}</option>
              <option value="banned">{{ $t('admin.users.status_banned') }}</option> 
              <option value="deleted">{{ $t('admin.users.status_deleted') }}</option>
            </select>
            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-[#8c909f] text-[18px]">expand_more</span>
          </div>
          
          <button @click="handleSearch" 
            class="bg-slate-800 dark:bg-black hover:bg-slate-900 dark:hover:bg-[#424754] text-white dark:text-[#e1e2ec] px-6 py-2.5 rounded-lg font-bold text-xs tracking-widest transition-all active:scale-95 border border-slate-700 dark:border-[#424754] uppercase shadow-sm">
            {{ $t('admin.users.execute_query') }}
          </button>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white dark:bg-black/40 backdrop-blur-xl rounded-xl overflow-hidden border border-slate-200 dark:border-[#27272A] animate-in fade-in slide-in-from-bottom duration-700 delay-200 shadow-xl transition-colors">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100 dark:border-[#27272A] bg-slate-50/50 dark:bg-black/50 transition-colors">
                <th class="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-slate-400 dark:text-[#8c909f]">{{ $t('admin.users.profile') }}</th>
                <th class="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-slate-400 dark:text-[#8c909f]">{{ $t('admin.users.registration_date') }}</th>
                <th class="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-slate-400 dark:text-[#8c909f] text-center">{{ $t('admin.users.role') }}</th>
                <th class="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-slate-400 dark:text-[#8c909f] text-center">{{ $t('admin.users.status') }}</th>
                <th class="px-6 py-5 font-bold text-[11px] uppercase tracking-widest text-slate-400 dark:text-[#8c909f] text-right">{{ $t('admin.users.actions') }}</th>
              </tr>
            </thead>
            <tbody class="font-body-sm text-sm text-slate-900 dark:text-[#e1e2ec]">
              <tr v-if="loading">
                <td colspan="5" class="p-32 text-center">
                  <div class="flex flex-col items-center gap-6">
                    <div class="relative w-16 h-16">
                      <div class="absolute inset-0 border-4 border-indigo-500/10 dark:border-[#adc6ff]/20 rounded-full"></div>
                      <div class="absolute inset-0 border-4 border-indigo-600 dark:border-[#adc6ff] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span class="text-[11px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-[0.3em] animate-pulse">{{ $t('admin.users.loading') }}</span>
                  </div>
                </td>
              </tr>

              <tr v-for="user in users" :key="`${user.id}-${user.status}`" 
                  class="border-b border-slate-50 dark:border-[#424754]/30 hover:bg-slate-50/80 dark:hover:bg-[#272a31]/30 transition-colors group relative"
                  :class="{'opacity-40 grayscale': user.status === 'deleted'}">
                <td class="px-6 py-5">
                  <div class="flex items-center gap-5">
                    <div class="relative">
                      <div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-black border border-slate-200 dark:border-[#424754] flex items-center justify-center text-indigo-600 dark:text-[#adc6ff] font-bold text-xl overflow-hidden group-hover:border-indigo-500 dark:group-hover:border-[#adc6ff] transition-colors shadow-sm">
                        {{ user.fullName ? user.fullName.charAt(0).toUpperCase() : '?' }}
                      </div>
                      <div v-if="user.status === 'active'" class="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 dark:bg-[#4edea3] border-2 border-white dark:border-[#09090B] rounded-full shadow-sm dark:shadow-[0_0_8px_rgba(78,222,163,0.8)]"></div>
                    </div>
                    <div>
                      <div class="font-bold text-slate-900 dark:text-[#e1e2ec] group-hover:text-indigo-600 dark:group-hover:text-[#adc6ff] transition-colors flex items-center gap-2">
                        {{ user.fullName || $t('admin.users.unnamed') }}
                        <span v-if="user.id === 'current'" class="text-[9px] bg-indigo-50 dark:bg-[#adc6ff]/10 text-indigo-600 dark:text-[#adc6ff] px-1.5 py-0.5 rounded border border-indigo-100 dark:border-[#adc6ff]/20 uppercase">{{ $t('admin.users.you') }}</span>
                      </div>
                      <div class="text-[12px] text-slate-400 dark:text-[#8c909f] font-data-mono mt-0.5">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-5">
                  <div class="text-[13px] font-medium text-slate-700 dark:text-[#c2c6d6]">{{ formatDate(user.created_at) }}</div>
                </td>
                <td class="px-6 py-5 text-center">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest border"
                        :class="user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-black dark:text-slate-400 dark:border-slate-700'">
                    {{ user.role || 'partner' }}
                  </span>
                </td>
                <td class="px-6 py-5 text-center">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all"
                        :class="getStatusStyle(user.status)">
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(user.status)"></span>
                    {{ user.status || 'active' }}
                  </span>
                </td>
                <td class="px-6 py-5 text-right">
                  <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <template v-if="!showTrash">
                      <button @click="openDetail(user.id)" 
                        class="p-2 rounded-lg bg-slate-50 dark:bg-black text-slate-400 dark:text-[#c2c6d6] hover:text-indigo-600 dark:hover:text-[#adc6ff] border border-slate-200 dark:border-[#424754] hover:border-indigo-500 dark:hover:border-[#adc6ff] transition-all" :title="$t('admin.users.details')">
                        <span class="material-symbols-outlined text-[20px]">visibility</span>
                      </button>

                      <button v-if="user.id !== 'current'" @click="openRoleModal(user)" 
                        class="p-2 rounded-lg bg-slate-50 dark:bg-black text-slate-400 dark:text-[#c2c6d6] hover:text-amber-500 dark:hover:text-[#ffca28] border border-slate-200 dark:border-[#424754] hover:border-amber-500 dark:hover:border-[#ffca28] transition-all" :title="$t('admin.users.change_role')">
                        <span class="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                      </button>
                      
                      <button v-if="user.status === 'active'" @click="handleStatus(user.id)" 
                        class="p-2 rounded-lg bg-slate-50 dark:bg-black text-slate-400 dark:text-[#c2c6d6] hover:text-rose-500 dark:hover:text-[#ffb3ad] border border-slate-200 dark:border-[#424754] hover:border-rose-500 dark:hover:border-[#ffb3ad] transition-all" :title="$t('admin.users.ban_user')">
                        <span class="material-symbols-outlined text-[20px]">block</span>
                      </button>
                      <button v-if="user.status === 'banned'" @click="handleStatus(user.id)" 
                        class="p-2 rounded-lg bg-slate-50 dark:bg-black text-slate-400 dark:text-[#c2c6d6] hover:text-emerald-500 dark:hover:text-[#4edea3] border border-slate-200 dark:border-[#424754] hover:border-emerald-500 dark:hover:border-[#4edea3] transition-all" :title="$t('admin.users.activate')">
                        <span class="material-symbols-outlined text-[20px]">check_circle</span>
                      </button>
                      
                      <button @click="handleSoftDelete(user.id)" 
                        class="p-2 rounded-lg bg-slate-50 dark:bg-black text-rose-300 dark:text-[#ffb3ad]/70 hover:text-rose-600 dark:hover:text-[#ffb3ad] border border-slate-200 dark:border-[#424754] hover:border-rose-500 dark:hover:border-[#ffb3ad] transition-all" :title="$t('admin.users.move_to_trash')">
                        <span class="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </template>
                    <template v-else>
                      <button @click="handleRestore(user.id)" 
                        class="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 transition-all" :title="$t('admin.users.restore_user')">
                        <span class="material-symbols-outlined text-[20px]">settings_backup_restore</span>
                      </button>
                      <button @click="handleHardDelete(user.id)" 
                        class="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 border border-rose-200 dark:border-rose-900/50 transition-all" :title="$t('admin.users.delete_permanently')">
                        <span class="material-symbols-outlined text-[20px]">delete_forever</span>
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div v-if="!loading && users.length > 0" class="px-6 py-4 border-t border-slate-100 dark:border-[#27272A] bg-slate-50/50 dark:bg-black/30 flex items-center justify-between transition-colors">
          <div class="text-slate-400 dark:text-[#8c909f] text-[12px] font-medium transition-colors">
            {{ $t('admin.users.page_of', { current: currentPage, last: totalPages, count: users.length }) }}
          </div>
          <div class="flex gap-2">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="p-1.5 rounded-md text-slate-400 dark:text-[#8c909f] hover:text-slate-900 dark:hover:text-[#e1e2ec] hover:bg-slate-100 dark:hover:bg-[#32353c] transition-all disabled:opacity-20 disabled:cursor-not-allowed border border-transparent hover:border-slate-200 dark:hover:border-[#424754]">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="p-1.5 rounded-md text-slate-400 dark:text-[#8c909f] hover:text-slate-900 dark:hover:text-[#e1e2ec] hover:bg-slate-100 dark:hover:bg-[#32353c] transition-all disabled:opacity-20 disabled:cursor-not-allowed border border-transparent hover:border-slate-200 dark:hover:border-[#424754]">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div v-if="!loading && users.length === 0" class="p-32 text-center">
          <div class="material-symbols-outlined text-6xl text-slate-200 dark:text-[#272a31] mb-4">database_off</div>
          <p class="text-slate-400 dark:text-[#8c909f] font-bold uppercase text-xs tracking-[0.3em] transition-colors">{{ $t('admin.users.no_users') }}</p>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-all">
      <div class="bg-white dark:bg-black w-full max-w-xl rounded-2xl p-10 border border-slate-200 dark:border-[#424754] shadow-2xl animate-in fade-in zoom-in duration-300 transition-colors">
        <div v-if="currentUserDetail" class="flex flex-col items-center">
          <div class="relative mb-8">
            <div class="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-black border-2 border-slate-200 dark:border-[#424754] text-indigo-600 dark:text-[#adc6ff] flex items-center justify-center text-4xl font-bold shadow-sm dark:shadow-[0_0_30px_rgba(173,198,255,0.1)] transition-colors">
              {{ currentUserDetail.fullName?.charAt(0) }}
            </div>
            <div class="absolute -bottom-2 -right-2 px-3 py-1 bg-emerald-50 dark:bg-[#4edea3]/10 text-emerald-600 dark:text-[#4edea3] text-[10px] font-bold border border-emerald-200 dark:border-[#4edea3]/30 rounded-full uppercase tracking-tighter transition-all">
              {{ currentUserDetail.status }}
            </div>
          </div>
          
          <h2 class="text-2xl font-bold text-slate-900 dark:text-[#e1e2ec] mb-1 transition-colors">{{ currentUserDetail.fullName }}</h2>
          <p class="text-slate-500 dark:text-[#8c909f] font-data-mono text-sm mb-10 transition-colors">{{ currentUserDetail.email }}</p>

          <div class="grid grid-cols-2 gap-4 w-full mb-10">
            <div class="bg-slate-50 dark:bg-black p-6 rounded-xl border border-slate-100 dark:border-[#27272A] flex flex-col items-center group hover:border-indigo-500 dark:hover:border-[#adc6ff] transition-colors shadow-sm">
              <span class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest mb-2 transition-colors">{{ $t('admin.users.active_sessions') }}</span>
              <span class="text-3xl font-bold text-slate-900 dark:text-[#e1e2ec] group-hover:text-indigo-600 dark:group-hover:text-[#adc6ff] transition-colors">{{ currentUserDetail.activeSessions?.length || 0 }}</span>
            </div>
            <div class="bg-slate-50 dark:bg-black p-6 rounded-xl border border-slate-100 dark:border-[#27272A] flex flex-col items-center group hover:border-rose-500 dark:hover:border-[#ffb3ad] transition-colors shadow-sm">
              <span class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest mb-2 transition-colors">{{ $t('admin.users.security_clearance') }}</span>
              <span class="text-lg font-bold text-slate-900 dark:text-[#e1e2ec] group-hover:text-rose-600 dark:group-hover:text-[#ffb3ad] transition-colors uppercase">{{ currentUserDetail.role || 'Member' }}</span>
            </div>
          </div>

          <div class="w-full space-y-3">
            <button @click="isModalOpen = false" class="w-full py-4 bg-slate-800 dark:bg-black hover:bg-slate-900 dark:hover:bg-[#424754] text-white dark:text-[#e1e2ec] rounded-lg font-bold text-xs tracking-[0.2em] transition-all active:scale-95 border border-slate-700 dark:border-[#424754] uppercase shadow-lg">
              {{ $t('admin.users.close') }}
            </button>
          </div>
        </div>
        <div v-else class="py-20 text-center">
          <div class="w-10 h-10 border-4 border-indigo-600 dark:border-[#adc6ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <span class="text-[11px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-[0.2em] animate-pulse transition-colors">{{ $t('admin.users.loading_detail') }}</span>
        </div>
      </div>
    </div>
    <div v-if="isInviteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-all">
      <div class="bg-white dark:bg-black w-full max-w-md rounded-2xl p-8 border border-slate-200 dark:border-[#424754] shadow-2xl animate-in fade-in zoom-in duration-300 transition-colors">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-[#e1e2ec] mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-indigo-600 dark:text-[#adc6ff]">person_add</span>
          {{ $t('admin.users.invite_new') }}
        </h2>
        
        <div v-if="!generatedPassword">
          <div class="space-y-4 mb-8">
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-[#8c909f] uppercase tracking-wider mb-2">{{ $t('admin.users.email_address') }}</label>
              <input v-model="inviteEmail" type="email" placeholder="user@example.com" class="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#424754] rounded-lg px-4 py-3 text-slate-900 dark:text-[#e1e2ec] focus:outline-none focus:border-indigo-500 dark:focus:border-[#adc6ff] font-body-sm text-sm" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 dark:text-[#8c909f] uppercase tracking-wider mb-2">{{ $t('admin.users.role') }}</label>
              <select v-model="inviteRole" class="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#424754] rounded-lg px-4 py-3 text-slate-900 dark:text-[#e1e2ec] focus:outline-none focus:border-indigo-500 dark:focus:border-[#adc6ff] font-body-sm text-sm">
                <option value="partner">Partner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="isInviteModalOpen = false" class="flex-1 py-3 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-[#32353c] text-slate-700 dark:text-[#e1e2ec] rounded-lg font-bold text-xs tracking-wider transition-all border border-slate-200 dark:border-[#424754] uppercase">
              {{ $t('admin.users.cancel') }}
            </button>
            <button @click="handleInvite" :disabled="isInviting" class="flex-1 py-3 bg-indigo-600 dark:bg-[#adc6ff] hover:bg-indigo-700 dark:hover:bg-[#4d8eff] text-white dark:text-[#002e6a] rounded-lg font-bold text-xs tracking-wider transition-all border border-transparent uppercase disabled:opacity-50">
              {{ isInviting ? $t('admin.users.sending') : $t('admin.users.invite') }}
            </button>
          </div>
        </div>
        
        <div v-else class="text-center py-4">
          <div class="w-16 h-16 bg-emerald-100 dark:bg-[#4edea3]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-3xl text-emerald-600 dark:text-[#4edea3]">check</span>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-[#e1e2ec] mb-2">{{ $t('admin.users.created_success') }}</h3>
          <p class="text-sm text-slate-500 dark:text-[#8c909f] mb-6">{{ $t('admin.users.password_once') }}</p>
          
          <div class="bg-slate-100 dark:bg-black border border-slate-200 dark:border-[#424754] rounded-lg p-4 mb-8 flex items-center justify-between">
            <code class="text-lg font-data-mono font-bold text-indigo-600 dark:text-[#adc6ff]">{{ generatedPassword }}</code>
            <button @click="copyPassword" class="p-2 hover:bg-slate-200 dark:hover:bg-[#272a31] rounded transition-colors text-slate-500 dark:text-[#8c909f]" :title="$t('admin.users.copy_password')">
              <span class="material-symbols-outlined text-[20px]">content_copy</span>
            </button>
          </div>
          
          <button @click="closeInviteModal" class="w-full py-3 bg-indigo-600 dark:bg-[#adc6ff] hover:bg-indigo-700 dark:hover:bg-[#4d8eff] text-white dark:text-[#002e6a] rounded-lg font-bold text-xs tracking-wider transition-all uppercase">
            {{ $t('admin.users.done') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Change Role Modal -->
    <div v-if="isRoleModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md transition-all">
      <div class="bg-white dark:bg-black w-full max-w-md rounded-2xl p-8 border border-slate-200 dark:border-[#424754] shadow-2xl animate-in fade-in zoom-in duration-300 transition-colors">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-[#e1e2ec] mb-6 flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-500 dark:text-[#ffca28]">admin_panel_settings</span>
          {{ $t('admin.users.change_role') }}
        </h2>
        
        <div class="space-y-4 mb-8">
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-[#8c909f] uppercase tracking-wider mb-2">{{ $t('admin.users.profile') }}</label>
            <div class="bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#424754] rounded-lg px-4 py-3 text-slate-900 dark:text-[#e1e2ec] font-body-sm text-sm">
              <div class="font-bold">{{ selectedUserForRole?.fullName }}</div>
              <div class="text-xs text-slate-500 dark:text-[#8c909f]">{{ selectedUserForRole?.email }}</div>
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 dark:text-[#8c909f] uppercase tracking-wider mb-2">{{ $t('admin.users.select_new_role') }}</label>
            <select v-model="newRole" class="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#424754] rounded-lg px-4 py-3 text-slate-900 dark:text-[#e1e2ec] focus:outline-none focus:border-indigo-500 dark:focus:border-[#adc6ff] font-body-sm text-sm">
              <option value="partner">Partner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        
        <div class="flex gap-3">
          <button @click="isRoleModalOpen = false" class="flex-1 py-3 bg-white dark:bg-black hover:bg-slate-50 dark:hover:bg-[#32353c] text-slate-700 dark:text-[#e1e2ec] rounded-lg font-bold text-xs tracking-wider transition-all border border-slate-200 dark:border-[#424754] uppercase">
            {{ $t('admin.users.cancel') }}
          </button>
          <button @click="handleUpdateRole" :disabled="isUpdatingRole" class="flex-1 py-3 bg-amber-500 dark:bg-[#ffca28] hover:bg-amber-600 dark:hover:bg-[#ffca28]/80 text-white dark:text-black rounded-lg font-bold text-xs tracking-wider transition-all border border-transparent uppercase disabled:opacity-50">
            {{ isUpdatingRole ? $t('admin.users.saving') : $t('admin.users.save_role') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-data-mono {
  font-family: 'JetBrains Mono', monospace;
}

.font-display-lg {
  font-family: 'Space Grotesk', sans-serif;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #272a31;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: #424754;
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-from-left {
  from { transform: translateX(-20px); }
  to { transform: translateX(0); }
}

@keyframes slide-in-from-right {
  from { transform: translateX(20px); }
  to { transform: translateX(0); }
}

@keyframes slide-in-from-bottom {
  from { transform: translateY(20px); }
  to { transform: translateY(0); }
}

@keyframes zoom-in {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}

.animate-in {
  animation-fill-mode: both;
}

.fade-in { animation-name: fade-in; }
.slide-in-from-left { animation-name: slide-in-from-left; }
.slide-in-from-right { animation-name: slide-in-from-right; }
.slide-in-from-bottom { animation-name: slide-in-from-bottom; }
.zoom-in { animation-name: zoom-in; }

.duration-700 { animation-duration: 700ms; }
.duration-300 { animation-duration: 300ms; }
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
</style>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import useUserAdmin from '~/composables/useUserAdmin'

const { t } = useI18n()
const toast = useToast()

const { 
  users, 
  currentUserDetail, 
  loading, 
  totalPages,
  totalUsers,
  fetchUsers, 
  fetchUserDetails, 
  updateStatus, 
  softDeleteUser, 
  restoreUser, 
  hardDeleteUser,
  inviteUser,
  updateUserRole,
  exportCsv
} = useUserAdmin()

const showTrash = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const isModalOpen = ref(false)
const isInviteModalOpen = ref(false)
const inviteEmail = ref('')
const inviteRole = ref('partner')
const isInviting = ref(false)
const generatedPassword = ref('')

const isRoleModalOpen = ref(false)
const selectedUserForRole = ref(null)
const newRole = ref('partner')
const isUpdatingRole = ref(false)

// Pagination State
const currentPage = ref(1)
const itemsPerPage = 5

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    refresh()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    refresh()
  }
}

const refresh = () => {
  fetchUsers({
    page: currentPage.value,
    limit: itemsPerPage,
    search: searchQuery.value,
    status: filterStatus.value
  })
}

// Update status filter based on Trash toggle
watch(showTrash, (newVal) => {
  filterStatus.value = newVal ? 'deleted' : ''
  refresh()
})

onMounted(() => refresh())

// Reset to first page when searching or filtering
watch([searchQuery, filterStatus], () => {
  if (!showTrash.value) { // Only auto-refresh if not in trash mode or manually triggered
     refresh()
  }
})

const handleSearch = () => {
  currentPage.value = 1
  refresh()
}

const openDetail = async (id) => {
  isModalOpen.value = true
  currentUserDetail.value = null
  await fetchUserDetails(id)
}

const handleStatus = async (id) => {
  const ok = await updateStatus(id)
  if (!ok) alert("Failed to update status")
  else refresh()
}

const handleSoftDelete = async (id) => {
  const ok = await softDeleteUser(id)
  if (!ok) alert("Error deleting user")
  else refresh()
}

const handleRestore = async (id) => {
  await restoreUser(id)
  refresh()
}

const handleHardDelete = async (id) => {
  const confirmed = window.confirm(t('admin.users.confirm_delete_permanently'))
  if (!confirmed) return

  const ok = await hardDeleteUser(id)
  if (ok) refresh()
}

const handleExportCsv = () => {
  exportCsv(searchQuery.value, filterStatus.value);
}

const handleInvite = async () => {
  if (!inviteEmail.value) return;
  isInviting.value = true;
  const res = await inviteUser(inviteEmail.value, inviteRole.value);
  isInviting.value = false;
  if (res && res.generated_password) {
    toast.success(res.message || t('admin.users.invite_success'))
    generatedPassword.value = res.generated_password;
    refresh();
  }
}

const closeInviteModal = () => {
  isInviteModalOpen.value = false;
  generatedPassword.value = '';
  inviteEmail.value = '';
}

const openRoleModal = (user) => {
  selectedUserForRole.value = user;
  newRole.value = user.role ? user.role.toLowerCase() : 'partner';
  isRoleModalOpen.value = true;
}

const handleUpdateRole = async () => {
  if (!selectedUserForRole.value) return;
  isUpdatingRole.value = true;
  const res = await updateUserRole(selectedUserForRole.value.id, newRole.value);
  isUpdatingRole.value = false;
  
  if (res && res.success) {
    toast.success(t('admin.users.role_updated_success'));
    isRoleModalOpen.value = false;
    selectedUserForRole.value = null;
    refresh();
  } else {
    if (res && res.error === 'own_role') {
      toast.error(t('admin.users.cannot_change_own_role'));
    } else {
      toast.error('Failed to update role.');
    }
  }
}

const copyPassword = () => {
  navigator.clipboard.writeText(generatedPassword.value);
  toast.success(t('admin.users.password_copied'));
}

const getStatusStyle = (status) => {
  if (status === 'active') return 'bg-emerald-50 dark:bg-[#4edea3]/10 text-emerald-600 dark:text-[#4edea3] border-emerald-100 dark:border-[#4edea3]/20 shadow-sm dark:shadow-[0_0_10px_rgba(78,222,163,0.1)]'
  if (status === 'banned') return 'bg-rose-50 dark:bg-[#ffb3ad]/10 text-rose-600 dark:text-[#ffb3ad] border-rose-100 dark:border-[#ffb3ad]/20'
  return 'bg-slate-100 dark:bg-black text-slate-500 dark:text-[#8c909f] border-slate-200 dark:border-[#424754]'
}

const getStatusDotClass = (status) => {
  if (status === 'active') return 'bg-emerald-500 dark:bg-[#4edea3] shadow-sm dark:shadow-[0_0_8px_rgba(78,222,163,0.8)]'
  if (status === 'banned') return 'bg-rose-500 dark:bg-[#ffb3ad] shadow-sm dark:shadow-[0_0_8px_rgba(255,179,173,0.8)]'
  return 'bg-slate-400 dark:bg-[#8c909f]'
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
</script>
