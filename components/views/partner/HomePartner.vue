<template>
  <div class="flex h-screen bg-slate-50 dark:bg-[#09090B] text-slate-900 dark:text-white selection:bg-cyan-500/30 overflow-hidden font-['Inter'] relative transition-colors duration-500">
    
    <!-- VERTICAL SIDEBAR -->
    <nav class="h-screen w-64 border-r border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/60 backdrop-blur-2xl flex flex-col p-4 gap-2 flex-shrink-0 z-20 transition-colors">
      <!-- Sidebar Header -->
      <div class="flex items-center gap-3 px-2 py-4 mb-4">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
          <img src="/brand/logo-mark.png" alt="" aria-hidden="true" class="h-8 w-10 object-contain" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-slate-900 dark:text-white leading-tight font-['Space_Grotesk'] transition-colors">{{ $t('partner.home.orbit_enterprise') }}</span>
          <span class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest font-bold transition-colors">{{ $t('partner.home.partner_console') }}</span>
        </div>
      </div>

      <!-- Main Navigation -->
      <div class="flex-1 flex flex-col gap-4 font-['Space_Grotesk'] text-sm overflow-y-auto pr-1">
        <div v-for="group in visibleNavGroups" :key="group.label" class="space-y-1">
          <p class="px-3 text-[9px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-white/25 mb-2">
            {{ group.label }}
          </p>
          <button v-for="nav in group.items" :key="nav.id"
            @click="handleNavClick(nav)"
            :title="navLocked(nav) ? $t('partner.home.professional_required') : nav.label"
            :class="[
              navLocked(nav)
                ? 'text-slate-300 dark:text-white/20 border-transparent cursor-not-allowed'
                : activeTab === nav.id
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
                  : 'text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 border-transparent'
            ]"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 border group">
            <span class="material-symbols-outlined text-lg group-hover:scale-110 transition-transform" :style="activeTab === nav.id ? 'font-variation-settings: \'FILL\' 1;' : ''">{{ nav.icon }}</span>
            <span class="text-xs font-bold uppercase tracking-widest flex-1 text-left">{{ nav.label }}</span>
            <span v-if="navLocked(nav)" class="material-symbols-outlined text-sm">lock</span>
          </button>
        </div>
      </div>

      <!-- Footer Navigation -->
      <div class="mt-auto flex flex-col gap-1 border-t border-slate-100 dark:border-white/5 pt-4 font-['Space_Grotesk'] text-sm">
        <button @click="router.push('/')" class="text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-white/60 transition-all flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <span class="material-symbols-outlined text-lg">home</span>
          {{ $t('partner.home.back_to_home') }}
        </button>
        <button @click="handleLogout" class="text-rose-500/60 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all flex items-center gap-3 px-3 py-2.5 rounded-xl">
          <span class="material-symbols-outlined text-lg">logout</span>
          {{ $t('partner.home.sign_out') }}
        </button>
      </div>
    </nav>

    <div class="flex-1 flex flex-col min-w-0 relative overflow-hidden">
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-purple-600/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <!-- SHOOTING STARS (Only in dark mode) -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div v-for="star in stars" :key="star.id" class="shooting-star hidden dark:block" 
          :style="{ top: star.top, left: star.left, animationDelay: star.delay, animationDuration: star.duration }"></div>
      </div>

      <!-- TOP BAR -->
      <header class="bg-white/40 dark:bg-black/20 backdrop-blur-md w-full h-16 border-b border-slate-100 dark:border-white/5 flex justify-between items-center px-8 flex-shrink-0 z-40 relative transition-colors">
        <div class="flex items-center gap-4">
          <h2 class="font-['Space_Grotesk'] text-lg font-bold text-slate-700 dark:text-white/80 uppercase tracking-widest transition-colors">
            {{ activeTitle }}
          </h2>
          <span class="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
          <span class="w-1.5 h-1.5 rounded-full" :class="hasElevatedPlan ? 'bg-purple-500' : 'bg-cyan-500'"></span>
            {{ currentPlanLabel }}
          </span>

          <span v-if="hasElevatedPlan" class="hidden lg:inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {{ currentRoleLabel }}
          </span>
        </div>

        <!-- Sub-tabs for AI Configuration -->
        <div v-if="activeTab === 'ai-config'" class="flex items-center gap-2 bg-slate-100/80 dark:bg-white/5 p-1 rounded-xl border border-slate-200/50 dark:border-white/5">
          <button 
            @click="aiSubTab = 'resource-allocation'" 
            :class="aiSubTab === 'resource-allocation' ? 'bg-white dark:bg-white/10 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60'" 
            class="px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all">
            {{ $t('partner.home.allocation') }}
          </button>
          <button 
            @click="aiSubTab = 'data-ingestion'" 
            :class="aiSubTab === 'data-ingestion' ? 'bg-white dark:bg-white/10 text-cyan-600 dark:text-cyan-400 font-bold shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60'" 
            class="px-3 sm:px-4 py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all">
            {{ $t('partner.home.data_ingestion') }}
          </button>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative hidden xl:flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2">
            <span class="material-symbols-outlined text-sm text-slate-400">domain</span>
            <Listbox v-model="selectedOrganizationId" as="div" class="w-full" @update:modelValue="handleOrganizationChange">
              <ListboxButton class="w-full min-w-[200px] max-w-[220px] bg-transparent text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-white/60 outline-none flex items-center justify-between gap-2 cursor-pointer text-left" :title="''">
                <span class="truncate block">
                  <template v-if="availableOrganizations.length === 0">{{ currentOrganizationName }}</template>
                  <template v-else>
                    {{ availableOrganizations.find(org => org.id === selectedOrganizationId)?.name || $t('partner.home.untitled_project') }} - {{ availableOrganizations.find(org => org.id === selectedOrganizationId)?.role }}
                  </template>
                </span>
                <span class="material-symbols-outlined text-base">expand_more</span>
              </ListboxButton>

              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute left-0 top-full mt-2 w-full max-h-60 overflow-auto rounded-xl bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 py-1 text-sm shadow-2xl focus:outline-none z-50">
                  <ListboxOption
                    v-for="organization in availableOrganizations"
                    :key="organization.id"
                    :value="organization.id"
                    v-slot="{ active, selected }"
                  >
                    <li :class="[active ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-white/80', 'relative cursor-pointer select-none py-2 pl-4 pr-4 transition-colors text-[10px] font-bold uppercase tracking-widest flex justify-between items-center']">
                      <span :class="[selected ? 'font-black' : 'font-bold', 'block truncate']">
                        {{ organization.name || $t('partner.home.untitled_project') }} - {{ organization.role }}
                      </span>
                      <span v-if="selected" class="material-symbols-outlined text-sm text-cyan-500">check</span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </Listbox>
          </div>
          <!-- Nút tạo project bị ẩn vì nghiệp vụ 1 Owner = 1 Org -->
          
          <div class="h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2"></div>
          <div class="group relative flex items-center gap-3">
             <div class="text-right hidden md:block">
                <p class="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest leading-none mb-1">{{ profile?.displayName || $t('partner.home.operator') }}</p>
                <p class="text-[9px] text-slate-400 dark:text-white/40 uppercase font-medium">{{ $t('partner.home.zenith_partner') }}</p>
             </div>
             <button class="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden transition-all hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]">
               <img :src="profile?.photoURL || 'https://ui-avatars.com/api/?name=Partner&background=0A0A0A&color=fff'" 
                class="w-full h-full object-cover" />
             </button>

             <!-- Avatar Dropdown Menu -->
             <div class="absolute right-0 top-full mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-50">
               <div class="bg-white/90 dark:bg-black/80 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl p-2 shadow-2xl space-y-1 transition-colors">
                 
                 <NuxtLink v-if="isAdmin" to="/admin" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-white/60 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors no-underline">
                   <span class="material-symbols-outlined text-lg">admin_panel_settings</span>
                   <span class="text-[0.7rem] font-bold uppercase tracking-widest">{{ $t('navbar.admin_nexus') }}</span>
                 </NuxtLink>

                 <NuxtLink to="/partner/home" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-white/60 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors no-underline">
                   <span class="material-symbols-outlined text-lg">handshake</span>
                   <span class="text-[0.7rem] font-bold uppercase tracking-widest">{{ $t('navbar.partner_portal') }}</span>
                 </NuxtLink>

                 <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-white/60 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors no-underline">
                   <span class="material-symbols-outlined text-lg">dashboard_customize</span>
                   <span class="text-[0.7rem] font-bold uppercase tracking-widest">{{ $t('navbar.user_dashboard') }}</span>
                 </NuxtLink>

                 <div class="h-[1px] bg-slate-100 dark:bg-white/5 my-1"></div>

                 <div class="flex items-center justify-between gap-3 px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-white/60 transition-colors">
                   <div class="flex items-center gap-3 min-w-0">
                     <span class="material-symbols-outlined text-lg">language</span>
                     <span class="text-[0.7rem] font-bold uppercase tracking-widest">{{ $t('navbar.language') }}</span>
                   </div>
                   <div class="flex bg-slate-100 dark:bg-black/50 rounded-lg p-0.5 border border-slate-200/70 dark:border-white/5">
                     <button @click.stop="switchLanguage('vi')" :disabled="isLanguageSwitching" :class="locale === 'vi' ? 'bg-white dark:bg-white/10 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80'" class="px-2 py-1 rounded text-[0.6rem] font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50">VI</button>
                     <button @click.stop="switchLanguage('en')" :disabled="isLanguageSwitching" :class="locale === 'en' ? 'bg-white dark:bg-white/10 text-cyan-600 dark:text-cyan-400 shadow-sm' : 'text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80'" class="px-2 py-1 rounded text-[0.6rem] font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50">EN</button>
                   </div>
                 </div>

                 <button @click.stop="toggleTheme" class="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-white/60 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                   <div class="flex items-center gap-3 min-w-0">
                     <span class="material-symbols-outlined text-lg">{{ isDark ? 'dark_mode' : 'light_mode' }}</span>
                     <span class="text-[0.7rem] font-bold uppercase tracking-widest">{{ $t('navbar.theme') }}</span>
                   </div>
                   <span class="text-[0.6rem] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">{{ isDark ? 'Dark' : 'Light' }}</span>
                 </button>

                 <div class="h-[1px] bg-slate-100 dark:bg-white/5 my-1"></div>

                 <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-white/60 hover:text-red-500 transition-colors">
                   <span class="material-symbols-outlined text-lg">logout</span>
                   <span class="text-[0.7rem] font-bold uppercase tracking-widest">{{ $t('navbar.sign_out') }}</span>
                 </button>
               </div>
             </div>
          </div>
        </div>
      </header>

      <div v-if="loading" class="bg-indigo-500/10 border-b border-indigo-500/20 px-8 py-2 flex items-center justify-center z-10 relative transition-colors">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest">{{ $t('partner.home.loading_data') }}</p>
        </div>
      </div>
      
      <div v-else-if="orgData?.status === 'suspended'" class="bg-rose-500/10 border-b border-rose-500/20 px-8 py-3 flex items-center justify-between z-10 relative transition-colors">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-rose-600 dark:text-rose-400 text-[18px]">warning</span>
          <p class="text-rose-700 dark:text-rose-400 text-[11px] font-bold uppercase tracking-widest">
            {{ $t('partner.home.organization_suspended') }}
          </p>
        </div>
        <button @click="openEditModal" class="text-[10px] bg-rose-500 text-white px-4 py-1.5 rounded-lg font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-sm">
          {{ $t('partner.home.view_details') }}
        </button>
      </div>

      <div v-if="upgradeNotice" class="bg-amber-500/10 border-b border-amber-500/20 px-8 py-3 flex items-center justify-between z-10 relative transition-colors">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[18px]">lock</span>
          <p class="text-amber-700 dark:text-amber-300 text-[11px] font-bold uppercase tracking-widest">
            {{ upgradeNotice }}
          </p>
        </div>
        <button @click="activeTab = 'billing'; upgradeNotice = ''" class="text-[10px] bg-amber-500 text-white px-4 py-1.5 rounded-lg font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-sm">
          {{ $t('partner.home.upgrade') }}
        </button>
      </div>

      <!-- SCROLLABLE CANVAS -->
      <main class="flex-1 z-0 relative flex flex-col" :class="activeTab === 'workspace' ? 'p-0 overflow-hidden' : 'p-10 overflow-y-auto'">
        <div v-if="activeTab === 'billing'" class="absolute inset-0 pointer-events-none opacity-10 dark:opacity-20" style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 50px 50px;"></div>

        <template v-if="activeTab === 'workspace'">
          <PartnerWorkspace class="flex-1" :key="projectComponentKey" :organization-id="currentOrganizationId" />
        </template>
        
        <div v-else class="max-w-6xl mx-auto relative z-10 w-full">
          <PartnerOverview v-if="activeTab === 'overview'" :key="projectComponentKey" :organization-id="currentOrganizationId" @switch-tab="activeTab = $event" />
          <PartnerOrganization v-if="activeTab === 'organization'" :key="projectComponentKey" :orgData="orgData" :profile="profile" :loading="loading" @edit="openEditModal" />
          <PartnerDepartments v-if="activeTab === 'departments'" :key="projectComponentKey" :organization-id="currentOrganizationId" />
          <PartnerMembersRoles v-if="activeTab === 'members'" :key="projectComponentKey" :organization-id="currentOrganizationId" />
          <PartnerBotAccess v-if="activeTab === 'bot-access'" :key="projectComponentKey" :organization-id="currentOrganizationId" />
          <PartnerManagementAI v-if="activeTab === 'management-ai'" :role="currentRole" />
          <PartnerBilling v-if="activeTab === 'billing'" :key="projectComponentKey" :organization-id="currentOrganizationId" @topup="showTopupModal = true" />

          <template v-if="activeTab === 'ai-config'">
            <PartnerAIConfig v-if="aiSubTab === 'resource-allocation'" :key="projectComponentKey + '-allocation'" :organization-id="currentOrganizationId" @save="saveAIConfig" />
            <PartnerDataIngestion v-else-if="aiSubTab === 'data-ingestion'" :key="projectComponentKey + '-data'" :organization-id="currentOrganizationId" />
          </template>

          <PartnerIntegrations
            v-if="activeTab === 'integrations'"
            :key="projectComponentKey"
            :organization-id="currentOrganizationId"
          />
        </div>
      </main>
    </div>

    <!-- MODALS -->
    <div v-if="showEditModal" class="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
      <div class="bg-white dark:bg-[#1a1a1a] w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative border border-slate-200 dark:border-purple-500/20">
        <button v-if="isOrgExists" @click="closeEditModal" class="absolute top-6 right-6 text-slate-400 dark:text-white/20 hover:text-slate-900 dark:hover:text-white transition-colors">
           <span class="material-symbols-outlined">close</span>
        </button>
        <h2 class="text-2xl font-bold mb-2 font-['Space_Grotesk'] text-slate-900 dark:text-white">
          {{ isOrgExists ? $t('partner.home.registry_config') : $t('partner.home.registry_setup') }}
        </h2>
        
        <!-- WARNING MESSAGE FOR ONBOARDING -->
        <div v-if="!isOrgExists" class="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start gap-3">
          <span class="material-symbols-outlined text-amber-600 dark:text-amber-400 mt-0.5">info</span>
          <div>
            <h4 class="text-amber-800 dark:text-amber-400 font-bold text-sm">{{ $t('partner.home.onboarding_welcome') }}</h4>
            <p class="text-amber-700/80 dark:text-amber-400/80 text-xs mt-1">{{ $t('partner.home.onboarding_desc') }}</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6 mt-4">
          <div v-for="f in [{label: $t('partner.home.entity_name'),k:'name',t:'text'}, {label: $t('partner.home.email_vector'),k:'email',t:'email', readonly: true}, {label: $t('partner.home.phone_link'),k:'phone',t:'text'}]" :key="f.k" class="flex flex-col gap-2">
            <label class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-widest font-bold">{{f.label}}</label>
            <input v-model="profileForm[f.k]" :type="f.t" :disabled="f.readonly" :class="f.readonly ? 'opacity-60 cursor-not-allowed bg-slate-100 dark:bg-white/5' : 'bg-slate-50 dark:bg-black/40'" class="w-full border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-cyan-500/50 outline-none transition-all" />
          </div>
          <div class="flex flex-col gap-2 md:col-span-2">
            <label class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-widest font-bold">{{ $t('partner.home.mission_desc') }}</label>
            <textarea v-model="profileForm.description" rows="3" class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none resize-none"></textarea>
          </div>
          <div class="md:col-span-2 flex flex-col gap-2">
            <label class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-widest font-bold">{{ $t('partner.home.physical_address') }}</label>
            <textarea v-model="profileForm.address" rows="2" class="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none resize-none"></textarea>
          </div>
        </div>
        <div class="flex gap-4 mt-10">
          <button v-if="isOrgExists" @click="closeEditModal" class="flex-1 py-3 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">{{ $t('partner.home.discard') }}</button>
          <button @click="saveProfile" class="flex-1 luminous-btn py-3 rounded-xl text-[10px] font-bold text-white dark:text-black uppercase tracking-widest" :class="{'w-full': !isOrgExists}">
            {{ isOrgExists ? $t('partner.home.update_registry') : $t('partner.home.init_registry') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Topup Modal -->
    <BillingTopupModal 
      v-if="showTopupModal" 
      payment-type="token_topup"
      :organization-id="currentOrganizationId"
      @close-modal="showTopupModal = false" 
      @payment-success="handlePaymentSuccess"
    />

    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '~/composables/useTheme'
import { auth, signOut } from '~/utils/auth/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import PartnerOverview from '~/components/partner/PartnerOverview.vue'
import PartnerOrganization from '~/components/partner/PartnerOrganization.vue'
import PartnerBilling from '~/components/partner/PartnerBilling.vue'
import PartnerAIConfig from '~/components/partner/PartnerAIConfig.vue'
import PartnerDataIngestion from '~/components/partner/PartnerDataIngestion.vue'
import PartnerWorkspace from '~/components/partner/PartnerWorkspace.vue'
import PartnerIntegrations from '~/components/partner/PartnerIntegrations.vue'
import PartnerDepartments from '../../partner/PartnerDepartments.vue'
import PartnerMembersRoles from '../../partner/PartnerMembersRoles.vue'
import PartnerBotAccess from '../../partner/PartnerBotAccess.vue'
import PartnerManagementAI from '../../partner/PartnerManagementAI.vue'

// TABS & UI STATE
const route = useRoute()
const router = useRouter()
const { t, locale, setLocale } = useI18n()
const isLanguageSwitching = useState('isLanguageSwitching', () => false)
const { isDark, toggleTheme } = useTheme()
const activeTab = ref(route.query.tab || 'overview')
const aiSubTab = ref(route.query.subTab || 'resource-allocation')
const showEditModal = ref(false)
const showTopupModal = ref(false)
const { success: showSuccessToast, error: showErrorToast } = useToast()

const handlePaymentSuccess = (data) => {
  showTopupModal.value = false
  if (data?.purchased_tokens) {
     const formattedTokens = new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(data.purchased_tokens)
     showSuccessToast(t('partner.home.tokens_added', { tokens: formattedTokens }))
   } else {
     showSuccessToast(t('partner.home.payment_success'))
  }
}
const profile = ref(null)
const orgData = ref(null)
const organizationContext = ref(null)
const selectedOrganizationId = ref('')
const isOrgExists = ref(false)
const loading = ref(false)
const upgradeNotice = ref('')
const usagePlan = ref(null)
const { user: loggedInUser, logout } = useAuthToken();

const switchLanguage = async (newLocale) => {
  if (isLanguageSwitching.value || newLocale === locale.value) return

  isLanguageSwitching.value = true
  try {
    await setLocale(newLocale)
    const i18nCookie = useCookie('i18n_redirected')
    i18nCookie.value = newLocale

    const config = useRuntimeConfig()
    const accessToken = useCookie('accessToken')
    if (accessToken.value) {
      await $fetch(`${config.public.apiBase}/user/set-locale`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken.value}` },
        body: { locale: newLocale }
      })
    }
  } catch (e) {
    console.error('Unable to switch language:', e)
  } finally {
    isLanguageSwitching.value = false
  }
}

// Watch activeTab changes and update URL
watch(activeTab, (newTab) => {
  const query = { ...route.query, tab: newTab }
  if (newTab !== 'ai-config') {
    delete query.subTab
  } else {
    query.subTab = aiSubTab.value
  }
  router.push({ query })
})

watch(aiSubTab, (newSub) => {
  if (activeTab.value === 'ai-config') {
    router.push({ query: { ...route.query, subTab: newSub } })
  }
})

const roleOptions = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' }
]

const roleRank = {
  owner: 5,
  admin: 4,
  manager: 3,
  member: 2,
  viewer: 1
}

const currentRole = computed(() => {
  return organizationContext.value?.membership?.role || orgData.value?.membership?.role || 'owner'
})

const canSee = (minimumRole = 'viewer') => roleRank[currentRole.value] >= roleRank[minimumRole]

const currentPlan = computed(() => organizationContext.value?.current_organization?.plan || {})
const navLocked = (item) => Boolean(item.entitlement && currentPlan.value[item.entitlement] !== true)

const handleNavClick = (item) => {
  if (navLocked(item)) {
    upgradeNotice.value = t('partner.home.feature_requires_professional', {
      feature: item.label,
      plan: currentPlanLabel.value
    })
    return
  }

  upgradeNotice.value = ''
  activeTab.value = item.id
}

const navGroups = computed(() => [
  {
    label: t('partner.home.group_workspace'),
    items: [
      { id: 'overview', label: t('partner.home.overview'), icon: 'dashboard', minimumRole: 'viewer' },
      { id: 'workspace', label: t('partner.home.chat'), icon: 'forum', minimumRole: 'member' }
    ]
  },
  {
    label: t('partner.home.group_organization'),
    items: [
      { id: 'organization', label: t('partner.home.company'), icon: 'corporate_fare', minimumRole: 'viewer' },
      { id: 'departments', label: t('partner.home.departments'), icon: 'groups', minimumRole: 'manager', entitlement: 'allow_departments' },
      { id: 'members', label: t('partner.home.members_roles'), icon: 'manage_accounts', minimumRole: 'admin', entitlement: 'allow_members' },
      { id: 'bot-access', label: t('partner.home.bot_access'), icon: 'lock_person', minimumRole: 'admin', entitlement: 'allow_members' }
    ]
  },
  {
    label: t('partner.home.group_ai_management'),
    items: [
      //{ id: 'management-ai', label: t('partner.home.management_ai'), icon: 'query_stats', minimumRole: 'manager' },
      { id: 'ai-config', label: t('partner.home.ai_config'), icon: 'psychology_alt', minimumRole: 'admin' }
    ]
  },
  {
    label: t('partner.home.group_operations'),
    items: [
      { id: 'integrations', label: t('partner.home.integrations'), icon: 'hub', minimumRole: 'admin' },
      { id: 'billing', label: t('partner.home.billing'), icon: 'payments', minimumRole: 'owner' }
    ]
  }
])

const visibleNavGroups = computed(() => {
  return navGroups.value
    .map(group => ({
      ...group,
      items: group.items.filter(item => canSee(item.minimumRole))
    }))
    .filter(group => group.items.length > 0)
})

const currentPlanType = computed(() => {
  return String(
    organizationContext.value?.current_organization?.plan_type ||
    usagePlan.value ||
    orgData.value?.plan_type ||
    ''
  ).toLowerCase()
})

const hasElevatedPlan = computed(() => {
  return Number(currentPlan.value.rank || 0) > 0
})

const currentPlanLabel = computed(() => {
  return currentPlan.value.name || `${currentPlanType.value} Plan`
})

const currentRoleLabel = computed(() => {
  return roleOptions.find(role => role.value === currentRole.value)?.label || 'Viewer'
})

const currentOrganizationName = computed(() => {
  return organizationContext.value?.current_organization?.name || orgData.value?.name || t('partner.home.personal_project')
})

const currentOrganizationId = computed(() => {
  return selectedOrganizationId.value || organizationContext.value?.current_organization?.id || ''
})

const availableOrganizations = computed(() => {
  return organizationContext.value?.available_organizations || []
})

const projectComponentKey = computed(() => {
  return currentOrganizationId.value || 'no-project'
})

const activeTitle = computed(() => {
  if (activeTab.value === 'ai-config') {
    return aiSubTab.value === 'data-ingestion' ? t('partner.home.title_data_ingestion') : t('partner.home.title_resource_allocation')
  }
  const titles = {
    overview: t('partner.home.title_overview'),
    workspace: t('partner.home.title_workspace'),
    organization: t('partner.home.title_organization'),
    departments: t('partner.home.title_departments'),
    members: t('partner.home.title_members'),
    'bot-access': t('partner.home.title_bot_access'),
    'management-ai': t('partner.home.title_management_ai'),
    billing: t('partner.home.title_billing'),
    integrations: t('partner.home.title_integrations')
  }
  return titles[activeTab.value] || ''
})

watch([currentRole, currentPlan], () => {
  const unlockedTabs = visibleNavGroups.value
    .flatMap(group => group.items)
    .filter(item => !navLocked(item))
    .map(item => item.id)

  if (!unlockedTabs.includes(activeTab.value)) {
    activeTab.value = unlockedTabs[0] || 'overview'
  }
}, { immediate: true })

// FORM STATE
const profileForm = ref({ id: "", name: "", phone: "", email: "", description: "", address: "", status: "pending" })

// SHOOTING STARS
const stars = ref(Array.from({ length: 6 }, (_, i) => ({
  id: i, top: `${Math.random() * 50}%`, left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 10}s`, duration: `${2 + Math.random() * 3}s`
})));


// METHODS
const loadOrganization = async () => {
  loading.value = true;
  try {
    const config = useRuntimeConfig();
    const accessToken = useCookie('accessToken');
    const result = await $fetch(`${config.public.apiBase}/partner/organization`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/json',
        ...(selectedOrganizationId.value ? { 'X-Organization-Id': selectedOrganizationId.value } : {})
      }
    });
    
    if (result && result.data) {
      orgData.value = result.data;
      isOrgExists.value = true;
      
      const isComplete = organizationContext.value?.current_organization?.is_profile_complete;
      if (isComplete === false) {
        openEditModal();
      }
      return true;
    } else {
      orgData.value = null;
      isOrgExists.value = false;
      // Chỉ mở onboarding khi API trả lời thành công rằng user chưa có organization.
      openEditModal();
      return true;
    }
  } catch (err) { 
    console.error("Org load failed:", err);
    // Lỗi mạng/xác thực/backend không có nghĩa là organization không tồn tại.
    // Giữ nguyên dữ liệu và tuyệt đối không bật nhầm modal onboarding.
    showErrorToast(t('partner.home.organization_load_error'), 5000);
    return false;
  } finally {
    loading.value = false;
  }
}

const loadOrganizationContext = async () => {
  try {
    const config = useRuntimeConfig();
    const accessToken = useCookie('accessToken');
    const result = await $fetch(`${config.public.apiBase}/partner/organization/context`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/json',
        ...(selectedOrganizationId.value ? { 'X-Organization-Id': selectedOrganizationId.value } : {})
      }
    });

    organizationContext.value = result || null;
    const currentId = result?.current_organization?.id || '';
    const isSelectedStillAvailable = (result?.available_organizations || []).some((organization) => organization.id === selectedOrganizationId.value);

    if (currentId && (!selectedOrganizationId.value || !isSelectedStillAvailable)) {
      selectedOrganizationId.value = currentId;
      localStorage.setItem('orbit_current_organization_id', currentId);
    }
    return true;
  } catch (err) {
    console.error("Organization context load failed:", err);
    // Không xóa context cũ và không suy luận rằng user chưa có organization.
    showErrorToast(t('partner.home.organization_load_error'), 5000);
    return false;
  }
}

const loadUsagePlan = async () => {
  try {
    const config = useRuntimeConfig();
    const accessToken = useCookie('accessToken');
    const result = await $fetch(`${config.public.apiBase}/partner/usage`, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/json'
      }
    });

    usagePlan.value = result?.plan || result?.plan_type || null;
  } catch (err) {
    console.error("Usage plan load failed:", err);
    usagePlan.value = null;
  }
}

const openEditModal = () => {
  profileForm.value = {
    id: orgData.value?.id || "",
    name: orgData.value?.name || "",
    phone: orgData.value?.phone || "",
    email: orgData.value?.email || profile.value?.email || "",
    description: orgData.value?.description || "",
    address: orgData.value?.address || "",
    status: orgData.value?.status || "pending",
  };
  showEditModal.value = true;
};

const handleOrganizationChange = async () => {
  if (selectedOrganizationId.value) {
    localStorage.setItem('orbit_current_organization_id', selectedOrganizationId.value);
  } else {
    localStorage.removeItem('orbit_current_organization_id');
  }

  const contextLoaded = await loadOrganizationContext();
  if (contextLoaded) {
    await loadOrganization();
  }
};


const closeEditModal = () => { showEditModal.value = false; };

const saveProfile = async () => {
  // Validate trước khi gọi API
  if (!profileForm.value.name || !profileForm.value.phone || !profileForm.value.address) {
    alert(t('partner.home.validation_msg'));
    return;
  }

  try {
    const config = useRuntimeConfig();
    const accessToken = useCookie('accessToken');
    const response = await $fetch(`${config.public.apiBase}/partner/organization`, { 
      method: 'POST', 
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
        'Accept': 'application/json',
        ...(profileForm.value.id ? { 'X-Organization-Id': profileForm.value.id } : {})
      },
      body: profileForm.value 
    });

    if (response?.data?.id) {
        selectedOrganizationId.value = response.data.id;
        localStorage.setItem('orbit_current_organization_id', response.data.id);
    }

    const contextLoaded = await loadOrganizationContext();
    if (contextLoaded) {
      const organizationLoaded = await loadOrganization();
      if (organizationLoaded) {
        showEditModal.value = false;
      }
    }
  } catch (err) { 
    console.error("Save failed:", err); 
    const errMsg = err.response?._data?.message || "Có lỗi xảy ra khi lưu thông tin.";
    alert(errMsg);
  }
};

const saveAIConfig = () => {
  console.log("AI Config Saved Locally");
};

const isAdmin = computed(() => loggedInUser.value?.role === 'admin');

const handleLogout = () => {
  logout();
};

// LIFECYCLE
onMounted(async () => {
  if (!process.client) return;
  selectedOrganizationId.value = localStorage.getItem('orbit_current_organization_id') || '';
  
  if (loggedInUser.value) {
    profile.value = {
      displayName: loggedInUser.value.name,
      email: loggedInUser.value.email,
      photoURL: loggedInUser.value.photoURL || ''
    };
  } else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        profile.value = user;
      } else {
        profile.value = {
          displayName: 'Mock Partner',
          email: 'partner@orbit.ai',
          photoURL: ''
        };
      }
    });
  }
  const contextLoaded = await loadOrganizationContext();
  if (contextLoaded) {
    await Promise.all([
      loadOrganization(),
      loadUsagePlan()
    ]);
  } else {
    await loadUsagePlan();
  }
});
</script>

<style scoped>
.luminous-btn {
  background: linear-gradient(90deg, #00f0ff, #7701d0);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
}

.luminous-btn:hover {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.4);
}

.shooting-star {
  position: absolute;
  width: 150px;
  height: 2px;
  background: linear-gradient(90deg, rgba(0, 240, 255, 0.4), transparent);
  transform: rotate(-45deg);
  opacity: 0;
  animation: shooting-star-anim linear infinite;
}

@keyframes shooting-star-anim {
  0% { transform: rotate(-45deg) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  30% { transform: rotate(-45deg) translateX(-1000px); opacity: 0; }
  100% { transform: rotate(-45deg) translateX(-1000px); opacity: 0; }
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
.dark ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
::-webkit-scrollbar-thumb:hover { background: rgba(0, 240, 255, 0.3); }

select option { background: white; color: black; }
.dark select option { background: #1a1a1a; color: white; }
</style>
