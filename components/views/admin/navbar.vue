<template>
  <!-- Desktop Sidebar -->
  <aside class="fixed inset-y-0 left-0 z-40 hidden lg:flex w-[260px] flex-col bg-white/90 dark:bg-black backdrop-blur-xl border-r border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-500">
    
    <!-- Brand Header -->
    <div class="flex items-center gap-3 h-16 shrink-0 px-6 mt-2 mb-2">
      <div class="flex items-center justify-center w-9 h-9 rounded-xl ">
        <img src="/brand/logo-mark.png" alt="" aria-hidden="true" class="h-8 w-9 object-contain" />
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-extrabold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent leading-none tracking-tight">Orbit AI</span>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] font-semibold mt-0.5">{{ $t('admin.navbar.console') }}</span>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex flex-1 flex-col px-4 py-2 overflow-y-auto space-y-1">
      <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] mb-2 px-2">{{ $t('admin.navbar.navigation') }}</div>
      
      <NuxtLink v-for="item in navigation" :key="item.name" :to="item.href"
        :class="[
          item.current 
            ? 'bg-cyan-50/80 dark:bg-white/10 text-cyan-700 dark:text-cyan-400' 
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white', 
          'flex items-center gap-3 px-3 h-[44px] rounded-xl text-sm font-semibold tracking-[0.02em] transition-all group relative'
        ]"
        :aria-current="item.current ? 'page' : undefined">
        <!-- Active Indicator -->
        <div v-if="item.current" class="absolute left-0 w-1 h-5 bg-cyan-500 rounded-r-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
        
        <span class="material-symbols-outlined text-[20px] transition-colors" 
              :class="item.current ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-cyan-500'">
          {{ item.icon }}
        </span>
        {{ $t(item.name) }}
      </NuxtLink>

      <Disclosure as="div" class="mt-4 mb-2" :defaultOpen="route.path.startsWith('/admin/services') || route.path.startsWith('/admin/token-usage')" v-slot="{ open }">
        <DisclosureButton class="flex w-full items-center justify-between px-3 min-h-[42px] rounded-xl text-sm font-semibold tracking-[0.02em] transition-all group text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white" :class="{'bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white': open}">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[20px] transition-colors" :class="open ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-cyan-500'">hub</span>
            {{ $t('admin.navbar.services') }}
          </div>
          <span class="material-symbols-outlined text-[18px] transition-transform duration-200" :class="open ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : 'text-slate-400'">expand_more</span>
        </DisclosureButton>
        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-y-95 opacity-0" enter-to-class="transform scale-y-100 opacity-100" leave-active-class="transition duration-100 ease-in" leave-from-class="transform scale-y-100 opacity-100" leave-to-class="transform scale-y-95 opacity-0">
          <DisclosurePanel class="pl-4 pr-1 mt-1 space-y-1 origin-top">
            <NuxtLink v-for="item in servicesNavigation" :key="item.name" :to="item.href"
              :class="[
                item.current
                  ? 'bg-cyan-50/80 dark:bg-white/10 text-cyan-700 dark:text-cyan-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white',
                'flex items-center gap-3 px-3 min-h-[40px] rounded-xl text-[13px] font-semibold tracking-[0.02em] transition-all group relative'
              ]"
              :aria-current="item.current ? 'page' : undefined">
              <div v-if="item.current" class="absolute -left-[14px] h-5 w-[3px] rounded-r-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
              <span class="material-symbols-outlined text-[18px]" :class="item.current ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-cyan-500'">{{ item.icon }}</span>
              {{ $t(item.name) }}
            </NuxtLink>
          </DisclosurePanel>
        </transition>
      </Disclosure>

      <Disclosure as="div" class="mt-2 mb-2" :defaultOpen="route.path.startsWith('/admin/billing')" v-slot="{ open }">
        <DisclosureButton class="flex w-full items-center justify-between px-3 min-h-[42px] rounded-xl text-sm font-semibold tracking-[0.02em] transition-all group text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white" :class="{'bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white': open}">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[20px] transition-colors" :class="open ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-cyan-500'">account_balance_wallet</span>
            {{ t('admin_billing.sidebar_title') }}
          </div>
          <span class="material-symbols-outlined text-[18px] transition-transform duration-200" :class="open ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : 'text-slate-400'">expand_more</span>
        </DisclosureButton>
        <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-y-95 opacity-0" enter-to-class="transform scale-y-100 opacity-100" leave-active-class="transition duration-100 ease-in" leave-from-class="transform scale-y-100 opacity-100" leave-to-class="transform scale-y-95 opacity-0">
          <DisclosurePanel class="pl-4 pr-1 mt-1 space-y-1 origin-top">
            <NuxtLink v-for="item in billingNavigation" :key="item.name" :to="item.href"
              :class="[
                item.current
                  ? 'bg-cyan-50/80 dark:bg-white/10 text-cyan-700 dark:text-cyan-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white',
                'flex items-center gap-3 px-3 min-h-[40px] rounded-xl text-[13px] font-semibold tracking-[0.02em] transition-all group relative'
              ]"
              :aria-current="item.current ? 'page' : undefined">
              <div v-if="item.current" class="absolute -left-[14px] h-5 w-[3px] rounded-r-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
              <span class="material-symbols-outlined text-[18px]" :class="item.current ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-cyan-500'">{{ item.icon }}</span>
              {{ $t(item.name) }}
            </NuxtLink>
          </DisclosurePanel>
        </transition>
      </Disclosure>
    </nav>

    <div class="p-4 mt-auto border-t border-slate-100 dark:border-white/5 bg-slate-50/30 dark:bg-black/10">
      
      <!-- Toolbar -->
      <div class="flex items-center justify-between mb-4 gap-2 px-1">
        <button @click="switchLanguage(locale === 'en' ? 'vi' : 'en')" :disabled="isLanguageSwitching" type="button" 
          class="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-800/50 transition-all font-bold text-xs shadow-sm hover:shadow disabled:cursor-not-allowed disabled:opacity-50">
          {{ locale === 'en' ? 'EN' : 'VI' }}
        </button>
        <button @click="toggleTheme" type="button" 
          class="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-800/50 transition-all shadow-sm hover:shadow">
          <span class="sr-only">{{ $t('admin.navbar.toggle_theme') }}</span>
          <span v-if="isDark" class="material-symbols-outlined text-[18px]">light_mode</span>
          <span v-else class="material-symbols-outlined text-[18px]">dark_mode</span>
        </button>
        <Menu as="div" class="relative">
          <MenuButton
            type="button"
            class="flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-800/50 transition-all shadow-sm hover:shadow relative"
          >
            <span class="sr-only">{{ $t('admin.navbar.view_notifications') }}</span>
            <span class="material-symbols-outlined text-[18px]">notifications</span>
            <span
              v-if="unreadNotificationCount > 0"
              class="absolute top-2 right-2 flex min-w-4 h-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black leading-none text-white border border-white dark:border-[#181a20]"
            >
              {{ unreadNotificationCount > 9 ? '9+' : unreadNotificationCount }}
            </span>
          </MenuButton>

          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="absolute bottom-full left-0 z-50 mb-3 w-[360px] max-w-[calc(100vw-2rem)] origin-bottom-left overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ring-1 ring-black/5 focus:outline-none dark:border-white/10 dark:bg-black">
              <div class="flex items-center justify-between gap-4 border-b border-slate-100 px-3 py-3 dark:border-white/10">
                <div class="min-w-0">
                  <p class="whitespace-nowrap text-base font-extrabold text-slate-900 dark:text-white">{{ $t('admin.navbar.notifications_title') }}</p>
                  <p class="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                    {{ notificationSubtitle }}
                  </p>
                </div>
                <button
                  v-if="notifications.length > 0"
                  type="button"
                  class="shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-cyan-700 transition-colors hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-cyan-500/10"
                  @click="markNotificationsRead"
                >
                  {{ $t('admin.navbar.mark_read') }}
                </button>
              </div>

              <div v-if="notificationsLoading" class="px-3 py-8 text-center">
                <div class="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
                <p class="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ $t('admin.navbar.loading_notifications') }}</p>
              </div>

              <div v-else-if="notifications.length === 0" class="px-3 py-8 text-center">
                <span class="material-symbols-outlined text-3xl text-emerald-500">notifications_active</span>
                <p class="mt-2 text-sm font-bold text-slate-800 dark:text-white">{{ $t('admin.navbar.no_notifications') }}</p>
                <p class="mt-1 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">{{ $t('admin.navbar.no_notifications_desc') }}</p>
              </div>

              <div v-else class="max-h-[360px] overflow-y-auto py-1 pr-1">
                <MenuItem v-for="item in notifications" :key="item.id" v-slot="{ active }">
                  <button
                    type="button"
                    :class="[active ? 'bg-slate-50 dark:bg-white/5' : '', 'flex w-full gap-3 rounded-xl px-3 py-3 text-left transition-colors']"
                  >
                    <span
                      class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      :class="item.toneClass"
                    >
                      <span class="material-symbols-outlined text-[19px]">{{ item.icon }}</span>
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="block text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">{{ item.title }}</span>
                      <span class="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400 line-clamp-2">{{ item.description }}</span>
                      <span class="mt-1 block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ item.time }}</span>
                    </span>
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>

      <Menu as="div" class="relative">
        <MenuButton class="flex w-full items-center justify-between gap-3 rounded-2xl p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-800/50 shadow-sm hover:shadow transition-all focus:outline-none group">
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative shrink-0">
              <img
                class="w-9 h-9 rounded-full bg-slate-200 dark:bg-gray-700 object-cover border border-slate-200 dark:border-gray-600"
                :src="user?.photoURL || 'https://ui-avatars.com/api/?name=Admin&background=374151&color=fff'"
                :alt="user?.displayName || 'User'"
                referrerpolicy="no-referrer"
              />
              <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div class="flex flex-col items-start min-w-0">
              <span class="text-sm font-bold text-slate-900 dark:text-white truncate w-full text-left">{{ user?.displayName || $t('admin.navbar.administrator') }}</span>
              <span class="text-xs text-slate-400 dark:text-slate-500 truncate w-full text-left tracking-wide">{{ user?.email || 'admin@orbit.ai' }}</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 text-[18px] shrink-0 transition-colors">expand_more</span>
        </MenuButton>
        
        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100" leave-to-class="transform opacity-0 scale-95">
          <MenuItems class="absolute bottom-full left-0 z-50 mb-2 w-full origin-bottom rounded-2xl bg-white dark:bg-black p-1.5 shadow-xl border border-slate-200 dark:border-white/10 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
            <MenuItem v-slot="{ active }">
              <NuxtLink to="/profile" :class="[active ? 'bg-slate-50 dark:bg-white/5 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-gray-400', 'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold tracking-wide transition-colors no-underline']">
                <span class="material-symbols-outlined text-[16px]">person</span>
                {{ $t('admin.navbar.profile') }}
              </NuxtLink>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <NuxtLink to="/" :class="[active ? 'bg-slate-50 dark:bg-white/5 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-gray-400', 'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold tracking-wide transition-colors no-underline']">
                <span class="material-symbols-outlined text-[16px]">public</span>
                {{ $t('admin.navbar.public_view') }}
              </NuxtLink>
            </MenuItem>
            <div class="h-px bg-slate-100 dark:bg-white/10 my-1"></div>
            <MenuItem v-slot="{ active }">
              <button
                @click="handleLogout"
                :class="[active ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'text-rose-500/80', 'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold tracking-wide transition-colors']"
              >
                <span class="material-symbols-outlined text-[16px]">logout</span>
                {{ $t('admin.navbar.sign_out') }}
              </button>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>
  </aside>

  <!-- Mobile Top Bar -->
  <Disclosure as="nav" class="relative z-40 bg-white/90 dark:bg-black backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-500 lg:hidden" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center">
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white focus:outline-none transition-colors">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">{{ $t('admin.navbar.open_main_menu') }}</span>
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center">
          <div class="flex items-center gap-2">
            <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 text-white">
              <img src="/brand/logo-mark.png" alt="" aria-hidden="true" class="h-5 w-6 object-contain" />
            </div>
            <div class="text-lg font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">Orbit AI</div>
          </div>
        </div>
        
        <div class="absolute inset-y-0 right-0 flex items-center">
          <!-- Profile Dropdown Mobile -->
          <Menu as="div" class="relative">
            <div>
              <MenuButton class="relative flex rounded-full border border-slate-200 dark:border-white/10 p-0.5 transition-colors focus:outline-none">
                <span class="absolute -inset-1.5"></span>
                <span class="sr-only">{{ $t('admin.navbar.open_user_menu') }}</span>
                <img
                  class="size-8 rounded-full bg-slate-200 dark:bg-black shrink-0 object-cover"
                  :src="user?.photoURL || 'https://ui-avatars.com/api/?name=Admin&background=374151&color=fff'"
                  :alt="user?.displayName || 'User'"
                  referrerpolicy="no-referrer"
                />
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl bg-white dark:bg-black p-1.5 shadow-xl border border-slate-200 dark:border-white/10 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                <div class="px-3 py-3 border-b border-slate-100 dark:border-white/10 mb-1">
                  <p class="text-sm text-slate-900 dark:text-white font-bold truncate">{{ user?.displayName || $t('admin.navbar.administrator') }}</p>
                  <p class="text-[10px] text-slate-400 dark:text-gray-500 truncate tracking-wide mt-0.5">{{ user?.email }}</p>
                </div>
                
                <div class="px-3 py-2 flex items-center justify-between border-b border-slate-100 dark:border-white/10 mb-1">
                  <button @click="switchLanguage(locale === 'en' ? 'vi' : 'en')" :disabled="isLanguageSwitching" type="button" class="text-slate-500 dark:text-slate-400 font-bold text-xs tracking-widest uppercase hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50">
                    {{ locale === 'en' ? 'EN' : 'VI' }}
                  </button>
                  <button @click="toggleTheme" type="button" class="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center">
                    <span v-if="isDark" class="material-symbols-outlined text-[18px]">light_mode</span>
                    <span v-else class="material-symbols-outlined text-[18px]">dark_mode</span>
                  </button>
                </div>

                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/profile" :class="[active ? 'bg-slate-50 dark:bg-white/5 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-gray-400', 'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold tracking-wide transition-colors no-underline']">
                    <span class="material-symbols-outlined text-[16px]">person</span>
                    {{ $t('admin.navbar.profile') }}
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/" :class="[active ? 'bg-slate-50 dark:bg-white/5 text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-gray-400', 'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold tracking-wide transition-colors no-underline']">
                    <span class="material-symbols-outlined text-[16px]">public</span>
                    {{ $t('admin.navbar.public_view') }}
                  </NuxtLink>
                </MenuItem>
                <div class="h-px bg-slate-100 dark:bg-white/10 my-1"></div>
                <MenuItem v-slot="{ active }">
                  <button
                    @click="handleLogout"
                    :class="[active ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'text-rose-500/80', 'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold tracking-wide transition-colors']"
                  >
                    <span class="material-symbols-outlined text-[16px]">logout</span>
                    {{ $t('admin.navbar.sign_out') }}
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel>
      <div class="space-y-1 px-2 pt-2 pb-3 bg-white dark:bg-black border-b border-slate-200 dark:border-white/10">
        <NuxtLink v-for="item in navigation" :key="item.name" :to="item.href"
          :class="[
            item.current 
              ? 'bg-cyan-50 dark:bg-white/10 text-cyan-700 dark:text-cyan-400' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white', 
            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold tracking-wide transition-all'
          ]"
          :aria-current="item.current ? 'page' : undefined">
          <span class="material-symbols-outlined text-[20px]" :class="item.current ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'">{{ item.icon }}</span>
          {{ $t(item.name) }}
        </NuxtLink>
        <Disclosure as="div" class="mt-2 pt-2 border-t border-slate-100 dark:border-white/5" :defaultOpen="route.path.startsWith('/admin/services') || route.path.startsWith('/admin/token-usage')" v-slot="{ open }">
          <DisclosureButton class="flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white" :class="{'bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white': open}">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[20px]" :class="open ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'">hub</span>
              {{ $t('admin.navbar.services') }}
            </div>
            <span class="material-symbols-outlined text-[18px] transition-transform duration-200" :class="open ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : 'text-slate-400'">expand_more</span>
          </DisclosureButton>
          <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-y-95 opacity-0" enter-to-class="transform scale-y-100 opacity-100" leave-active-class="transition duration-100 ease-in" leave-from-class="transform scale-y-100 opacity-100" leave-to-class="transform scale-y-95 opacity-0">
            <DisclosurePanel class="pl-4 pr-1 mt-1 space-y-1 origin-top">
              <NuxtLink v-for="item in servicesNavigation" :key="item.name" :to="item.href"
                :class="[
                  item.current ? 'bg-cyan-50 dark:bg-white/10 text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white',
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold tracking-wide transition-all'
                ]"
                :aria-current="item.current ? 'page' : undefined">
                <span class="material-symbols-outlined text-[18px]" :class="item.current ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'">{{ item.icon }}</span>
                {{ $t(item.name) }}
              </NuxtLink>
            </DisclosurePanel>
          </transition>
        </Disclosure>
        
        <Disclosure as="div" class="mt-2" :defaultOpen="route.path.startsWith('/admin/billing')" v-slot="{ open }">
          <DisclosureButton class="flex w-full items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white" :class="{'bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white': open}">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-[20px]" :class="open ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'">account_balance_wallet</span>
              {{ t('admin_billing.sidebar_title') }}
            </div>
            <span class="material-symbols-outlined text-[18px] transition-transform duration-200" :class="open ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : 'text-slate-400'">expand_more</span>
          </DisclosureButton>
          <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-y-95 opacity-0" enter-to-class="transform scale-y-100 opacity-100" leave-active-class="transition duration-100 ease-in" leave-from-class="transform scale-y-100 opacity-100" leave-to-class="transform scale-y-95 opacity-0">
            <DisclosurePanel class="pl-4 pr-1 mt-1 space-y-1 origin-top">
              <NuxtLink v-for="item in billingNavigation" :key="item.name" :to="item.href"
                :class="[
                  item.current ? 'bg-cyan-50 dark:bg-white/10 text-cyan-700 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white',
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold tracking-wide transition-all'
                ]"
                :aria-current="item.current ? 'page' : undefined">
                <span class="material-symbols-outlined text-[18px]" :class="item.current ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'">{{ item.icon }}</span>
                {{ $t(item.name) }}
              </NuxtLink>
            </DisclosurePanel>
          </transition>
        </Disclosure>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useTheme } from '~/composables/useTheme'
import { useAuthToken } from '~/composables/useAuthToken'
import { useI18n } from 'vue-i18n'

const { theme, isDark, toggleTheme } = useTheme()
const route = useRoute()
const { user: loggedInUser, logout } = useAuthToken()
const { locale, setLocale, t } = useI18n()
const config = useRuntimeConfig()
const isLanguageSwitching = useState('isLanguageSwitching', () => false)
const adminNotifications = ref([])
const notificationsLoading = ref(false)
const notificationsReadAt = ref(0)

const formatNumber = (value) => {
  return new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(Number(value || 0))
}

const formatMoney = (value) => {
  return `${formatNumber(value)}đ`
}

const formatNotificationTime = (value) => {
  if (!value) return t('admin.navbar.just_now')
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return t('admin.navbar.just_now')

  return new Intl.DateTimeFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const notificationMeta = {
  user_registered: {
    icon: 'person_add',
    toneClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300'
  },
  plan_upgraded: {
    icon: 'workspace_premium',
    toneClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-300'
  },
  token_purchased: {
    icon: 'paid',
    toneClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300'
  }
}

const notifications = computed(() => {
  const items = Array.isArray(adminNotifications.value) ? adminNotifications.value : []

  return items.map((item) => {
    const payload = item.payload || {}
    const meta = notificationMeta[item.type] || notificationMeta.user_registered
    let title = t('admin.navbar.notification_user_registered')
    let description = t('admin.navbar.notification_user_registered_desc', {
      name: payload.name || payload.email || 'N/A',
      email: payload.email || 'N/A',
    })

    if (item.type === 'plan_upgraded') {
      title = t('admin.navbar.notification_plan_upgraded')
      description = t('admin.navbar.notification_plan_upgraded_desc', {
        organization: payload.organization || 'N/A',
        plan: payload.plan_type || 'N/A',
        amount: formatMoney(payload.amount),
      })
    } else if (item.type === 'token_purchased') {
      title = t('admin.navbar.notification_token_purchased')
      description = t('admin.navbar.notification_token_purchased_desc', {
        organization: payload.organization || 'N/A',
        tokens: formatNumber(payload.tokens),
        amount: formatMoney(payload.amount),
      })
    }

    return {
      id: item.id,
      type: item.type,
      icon: meta.icon,
      toneClass: meta.toneClass,
      title,
      description,
      createdAt: item.created_at,
      time: formatNotificationTime(item.created_at),
    }
  })
})

const unreadNotificationCount = computed(() => {
  if (notifications.value.length === 0) return 0

  return notifications.value.filter((item) => {
    const time = new Date(item.createdAt || 0).getTime()
    return Number.isFinite(time) && time > notificationsReadAt.value
  }).length
})

const notificationSubtitle = computed(() => {
  if (unreadNotificationCount.value > 0) {
    return t('admin.navbar.unread_count', { count: unreadNotificationCount.value })
  }

  return t('admin.navbar.all_read')
})

const markNotificationsRead = () => {
  notificationsReadAt.value = Date.now()
  if (process.client) {
    localStorage.setItem('orbit_admin_notifications_read_at', String(notificationsReadAt.value))
  }
}

const fetchNotifications = async () => {
  notificationsLoading.value = true
  try {
    const token = useCookie('accessToken').value
    if (!token) {
      adminNotifications.value = []
      return
    }

    const response = await $fetch(`${config.public.apiBase}/admin/notifications`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })

    adminNotifications.value = response?.data?.notifications || []
  } catch (error) {
    console.error('Unable to load admin notifications:', error)
    adminNotifications.value = []
  } finally {
    notificationsLoading.value = false
  }
}

const switchLanguage = async (newLocale) => {
  if (isLanguageSwitching.value || newLocale === locale.value) return

  isLanguageSwitching.value = true
  try {
    await setLocale(newLocale)
    const i18nCookie = useCookie('i18n_redirected')
    i18nCookie.value = newLocale

    await new Promise(r => setTimeout(r, 600))

    const token = useCookie('accessToken').value
    if (token) {
      await $fetch(`${config.public.apiBase}/user/set-locale`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: { locale: newLocale }
      })
    }
  } catch (e) {
    console.error('Unable to switch language:', e)
  } finally {
    isLanguageSwitching.value = false
  }
}

const user = computed(() => loggedInUser.value)

const navigation = computed(() => [
  { name: 'admin.navbar.dashboard', href: '/admin', icon: 'dashboard', current: route.path === '/admin' },
  { name: 'admin.navbar.organizations', href: '/admin/organizations', icon: 'apartment', current: route.path.startsWith('/admin/organizations') },
  { name: 'admin.navbar.users', href: '/admin/users', icon: 'group', current: route.path.startsWith('/admin/users') },
])

const servicesNavigation = computed(() => [
  { name: 'admin.navbar.services', href: '/admin/services', icon: 'hub', current: route.path.startsWith('/admin/services') },
  { name: 'admin.navbar.token_usage', href: '/admin/token-usage', icon: 'data_usage', current: route.path.startsWith('/admin/token-usage') },
])

const billingNavigation = computed(() => [
  { name: 'admin_billing.overview_title', href: '/admin/billing', icon: 'account_balance_wallet', current: route.path === '/admin/billing' },
  { name: 'admin_billing.service_plans', href: '/admin/billing/plans', icon: 'workspace_premium', current: route.path.startsWith('/admin/billing/plans') },
  { name: 'admin_billing.topup_packages', href: '/admin/billing/topup-packages', icon: 'toll', current: route.path.startsWith('/admin/billing/topup-packages') },
  { name: 'admin_billing.transactions', href: '/admin/billing/payments', icon: 'receipt_long', current: route.path.startsWith('/admin/billing/payments') },
  { name: 'admin_billing.organizations', href: '/admin/billing/organizations', icon: 'corporate_fare', current: route.path.startsWith('/admin/billing/organizations') },
  { name: 'admin_billing.audit_logs', href: '/admin/billing/audit-logs', icon: 'history', current: route.path.startsWith('/admin/billing/audit-logs') },
])

const handleLogout = () => {
  logout()
}

onMounted(async () => {
  if (process.client) {
    notificationsReadAt.value = Number(localStorage.getItem('orbit_admin_notifications_read_at') || 0)
  }

  try {
    await fetchNotifications()
  } catch (error) {
    console.error('Unable to load admin notifications:', error)
  }
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
