<template>
  <nav class="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/90 font-display tracking-tight shadow-[0_8px_28px_rgba(15,23,42,0.04)] backdrop-blur-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#000000]/90 dark:shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
    <div class="absolute left-0 top-0 h-px bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 transition-all duration-300" :style="{ width: `${scrollProgress}%` }"></div>

    <div class="flex h-16 w-full items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex min-w-0 shrink-0 items-center gap-2.5 no-underline">
        <img src="/brand/logo-mark.png" alt="" aria-hidden="true" class="h-7 w-9 object-contain sm:h-8 sm:w-10" />
        <span class="truncate bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-lg font-bold text-transparent sm:text-xl dark:from-cyan-300 dark:to-blue-400">Orbit AI</span>
      </NuxtLink>

      <ul class="hidden h-full list-none items-center gap-7 p-0 lg:absolute lg:left-1/2 lg:top-0 lg:flex lg:h-full lg:-translate-x-1/2">
        <li><NuxtLink to="/#platform" @click="activeSection = 'platform'" :class="{ 'nav-active': activeSection === 'platform' }" class="nav-link">{{ $t('navbar.platform') }}</NuxtLink></li>
        <li><NuxtLink to="/#solutions" @click="activeSection = 'solutions'" :class="{ 'nav-active': activeSection === 'solutions' }" class="nav-link">{{ $t('navbar.solutions') }}</NuxtLink></li>
        <li><NuxtLink to="/#news" @click="activeSection = 'news'" :class="{ 'nav-active': activeSection === 'news' }" class="nav-link">{{ $t('navbar.news') }}</NuxtLink></li>
        <li><NuxtLink to="/#enterprise" @click="activeSection = 'enterprise'" :class="{ 'nav-active': activeSection === 'enterprise' }" class="nav-link">{{ $t('navbar.enterprise') }}</NuxtLink></li>
        <li><NuxtLink to="/#pricing" @click="activeSection = 'pricing'" :class="{ 'nav-active': activeSection === 'pricing' }" class="nav-link">{{ $t('navbar.pricing') }}</NuxtLink></li>
      </ul>

      <div class="flex shrink-0 items-center gap-2.5 sm:gap-4">
        <template v-if="user">
          <div class="group relative">
            <button aria-label="Open account menu" class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-cyan-700 transition hover:border-cyan-300 hover:shadow-[0_0_18px_rgba(34,211,238,0.18)] dark:border-white/10 dark:bg-white/[0.06] dark:text-cyan-300">
              <img
                v-if="user.photoURL && user.photoURL !== 'null' && !imageError"
                :src="user.photoURL"
                referrerpolicy="no-referrer"
                @error="imageError = true"
                class="h-full w-full object-cover"
              />
              <span v-else class="material-symbols-outlined text-[21px]">account_circle</span>
            </button>

            <div class="invisible absolute right-0 top-full z-50 mt-3 w-56 translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div class="space-y-1 rounded-xl border border-slate-200 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#0A0A0A]/95">
                <NuxtLink v-if="isAdmin" to="/admin" class="flex items-center gap-3 rounded-lg px-3.5 py-3 text-slate-500 no-underline transition-colors hover:bg-slate-50 hover:text-cyan-700 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-cyan-300"><span class="material-symbols-outlined text-lg">admin_panel_settings</span><span class="text-[0.68rem] font-bold uppercase tracking-widest">{{ $t('navbar.admin_nexus') }}</span></NuxtLink>
                <NuxtLink v-if="isPartner || isAdmin" to="/partner/home" class="flex items-center gap-3 rounded-lg px-3.5 py-3 text-slate-500 no-underline transition-colors hover:bg-slate-50 hover:text-cyan-700 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-cyan-300"><span class="material-symbols-outlined text-lg">handshake</span><span class="text-[0.68rem] font-bold uppercase tracking-widest">{{ $t('navbar.partner_portal') }}</span></NuxtLink>
                <NuxtLink to="/profile" class="flex items-center gap-3 rounded-lg px-3.5 py-3 text-slate-500 no-underline transition-colors hover:bg-slate-50 hover:text-cyan-700 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-cyan-300"><span class="material-symbols-outlined text-lg">dashboard_customize</span><span class="text-[0.68rem] font-bold uppercase tracking-widest">{{ $t('navbar.user_dashboard') }}</span></NuxtLink>

                <div class="my-1 h-px bg-slate-100 dark:bg-white/5"></div>
                <div class="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-slate-500 dark:text-white/60">
                  <div class="flex items-center gap-3"><span class="material-symbols-outlined text-lg">language</span><span class="text-[0.68rem] font-bold uppercase tracking-widest">{{ $t('navbar.language') }}</span></div>
                  <div class="flex rounded-md bg-slate-100 p-0.5 dark:bg-black/30">
                    <button @click.stop="switchLanguage('vi')" :disabled="isLanguageSwitching" :class="locale === 'vi' ? 'bg-white text-cyan-700 shadow-sm dark:bg-white/10 dark:text-cyan-300' : 'text-slate-500 dark:text-white/40'" class="rounded px-2 py-1 text-[0.6rem] font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50">VI</button>
                    <button @click.stop="switchLanguage('en')" :disabled="isLanguageSwitching" :class="locale === 'en' ? 'bg-white text-cyan-700 shadow-sm dark:bg-white/10 dark:text-cyan-300' : 'text-slate-500 dark:text-white/40'" class="rounded px-2 py-1 text-[0.6rem] font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50">EN</button>
                  </div>
                </div>

                <button @click.stop="toggleTheme" class="flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-cyan-700 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-cyan-300">
                  <div class="flex items-center gap-3"><span class="material-symbols-outlined text-lg">{{ isDark ? 'dark_mode' : 'light_mode' }}</span><span class="text-[0.68rem] font-bold uppercase tracking-widest">{{ $t('navbar.theme') }}</span></div>
                  <span class="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">{{ isDark ? 'Dark' : 'Light' }}</span>
                </button>

                <div class="my-1 h-px bg-slate-100 dark:bg-white/5"></div>
                <button @click="handleLogout" class="flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-slate-500 transition-colors hover:bg-slate-50 hover:text-red-500 dark:text-white/60 dark:hover:bg-white/5"><span class="material-symbols-outlined text-lg">logout</span><span class="text-[0.68rem] font-bold uppercase tracking-widest">{{ $t('navbar.sign_out') }}</span></button>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <NuxtLink to="/login" class="hidden whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] text-slate-500 no-underline transition-colors hover:text-cyan-700 sm:inline-flex dark:text-slate-300/70 dark:hover:text-cyan-300">{{ $t('navbar.sign_in') }}</NuxtLink>
        </template>

        <button v-if="!user" type="button" :aria-label="$t('navbar.theme')" :title="$t('navbar.theme')" @click="toggleTheme" class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-slate-300 dark:hover:border-cyan-300/40 dark:hover:text-cyan-300">
          <span class="material-symbols-outlined text-[20px]">{{ isDark ? 'dark_mode' : 'light_mode' }}</span>
        </button>

        <NuxtLink to="/user/Register" class="hidden items-center justify-center whitespace-nowrap rounded-lg bg-slate-950 px-4 py-2.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white no-underline transition hover:-translate-y-0.5 hover:bg-cyan-700 sm:inline-flex dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200">{{ $t('navbar.get_started') }}</NuxtLink>

        <button
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 lg:hidden dark:border-white/10 dark:text-slate-300 dark:hover:border-cyan-300/40 dark:hover:text-cyan-300"
          aria-label="Toggle navigation"
          :aria-expanded="mobileMenuOpen"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="material-symbols-outlined text-[21px]">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </div>

    <div v-if="mobileMenuOpen" class="border-t border-slate-200 bg-white/95 px-4 pb-5 pt-3 shadow-xl backdrop-blur-xl lg:hidden dark:border-white/10 dark:bg-[#000000]/95">
      <div class="grid gap-1">
        <NuxtLink to="/#platform" @click="mobileMenuOpen = false; activeSection = 'platform'" :class="{ 'mobile-nav-active': activeSection === 'platform' }" class="mobile-nav-link">{{ $t('navbar.platform') }}</NuxtLink>
        <NuxtLink to="/#solutions" @click="mobileMenuOpen = false; activeSection = 'solutions'" :class="{ 'mobile-nav-active': activeSection === 'solutions' }" class="mobile-nav-link">{{ $t('navbar.solutions') }}</NuxtLink>
        <NuxtLink to="/#news" @click="mobileMenuOpen = false; activeSection = 'news'" :class="{ 'mobile-nav-active': activeSection === 'news' }" class="mobile-nav-link">{{ $t('navbar.news') }}</NuxtLink>
        <NuxtLink to="/#enterprise" @click="mobileMenuOpen = false; activeSection = 'enterprise'" :class="{ 'mobile-nav-active': activeSection === 'enterprise' }" class="mobile-nav-link">{{ $t('navbar.enterprise') }}</NuxtLink>
        <NuxtLink to="/#pricing" @click="mobileMenuOpen = false; activeSection = 'pricing'" :class="{ 'mobile-nav-active': activeSection === 'pricing' }" class="mobile-nav-link">{{ $t('navbar.pricing') }}</NuxtLink>
      </div>
      <div class="mt-4 flex gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
        <NuxtLink v-if="!user" to="/login" @click="mobileMenuOpen = false" class="flex flex-1 items-center justify-center rounded-lg border border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-600 no-underline dark:border-white/10 dark:text-slate-300">{{ $t('navbar.sign_in') }}</NuxtLink>
        <NuxtLink to="/user/Register" @click="mobileMenuOpen = false" class="flex flex-1 items-center justify-center rounded-lg bg-slate-950 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white no-underline dark:bg-cyan-300 dark:text-slate-950">{{ $t('navbar.get_started') }}</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted, computed, watch } from 'vue'
import { useTheme } from '~/composables/useTheme'
import { useAuthToken } from '~/composables/useAuthToken'
import { useI18n } from 'vue-i18n'

const { isDark, toggleTheme } = useTheme()
const { token, user: loggedInUser, logout } = useAuthToken()
const { locale, setLocale } = useI18n()
const isLanguageSwitching = useState('isLanguageSwitching', () => false)
const route = useRoute()

const switchLanguage = async (newLocale) => {
  if (isLanguageSwitching.value || newLocale === locale.value) return

  isLanguageSwitching.value = true
  try {
    await setLocale(newLocale)
    const i18nCookie = useCookie('i18n_redirected')
    i18nCookie.value = newLocale

    const config = useRuntimeConfig()
    if (token.value) {
      await $fetch(`${config.public.apiBase}/user/set-locale`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: { locale: newLocale },
      })
    }
  } catch (e) {
    console.error('Unable to switch language:', e)
  } finally {
    isLanguageSwitching.value = false
  }
}

const user = computed(() => loggedInUser.value)
const isPartner = computed(() => loggedInUser.value?.role === 'partner')
const isAdmin = computed(() => loggedInUser.value?.role === 'admin')

const imageError = ref(false)
const scrollProgress = ref(0)
const activeSection = ref('platform')
const mobileMenuOpen = ref(false)
const publicSectionIds = ['platform', 'solutions', 'news', 'enterprise', 'pricing']
let sectionObserver = null

const getNavbarHeight = () => window.matchMedia('(min-width: 640px)').matches ? 80 : 64

const updateActiveSection = (sections) => {
  const navbarHeight = getNavbarHeight()
  const readingLine = navbarHeight + (window.innerHeight - navbarHeight) * 0.35
  const positions = sections
    .map((section) => ({ id: section.id, rect: section.getBoundingClientRect() }))
    .filter(({ rect }) => rect.bottom > navbarHeight && rect.top < window.innerHeight)

  const sectionsAtReadingLine = positions.filter(({ rect }) => rect.top <= readingLine && rect.bottom > readingLine)
  const sectionAtReadingLine = sectionsAtReadingLine[sectionsAtReadingLine.length - 1]

  const nearestSection = positions.slice().sort((a, b) => {
    const aCenter = (a.rect.top + a.rect.bottom) / 2
    const bCenter = (b.rect.top + b.rect.bottom) / 2
    return Math.abs(aCenter - readingLine) - Math.abs(bCenter - readingLine)
  })[0]

  const nextActiveSection = sectionAtReadingLine || nearestSection
  if (nextActiveSection) activeSection.value = nextActiveSection.id
}

const handleScroll = () => {
  if (process.client) {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    scrollProgress.value = height > 0 ? (winScroll / height) * 100 : 0
  }
}

const handleLogout = () => {
  if (process.client) {
    localStorage.removeItem('current_conversation_id')
    localStorage.removeItem('guest_session_id')
    localStorage.removeItem('current_service_name')
    localStorage.removeItem('current_partner_id')
    localStorage.removeItem('chat_user_key')
  }
  logout()
}

const setupObserver = () => {
  if (sectionObserver) {
    sectionObserver.disconnect()
    sectionObserver = null
  }
  setTimeout(() => {
    if (process.client) {
      const sections = publicSectionIds.map((sectionId) => document.getElementById(sectionId)).filter(Boolean)
      if (!sections.length) return

      const hashSection = route.hash.slice(1) || window.location.hash.slice(1)
      const hasValidHash = publicSectionIds.includes(hashSection)
      if (hasValidHash) activeSection.value = hashSection

      const navbarOffset = getNavbarHeight()
      sectionObserver = new IntersectionObserver(() => updateActiveSection(sections), {
        rootMargin: `-${navbarOffset}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      })

      sections.forEach((section) => sectionObserver.observe(section))
      if (!hasValidHash) updateActiveSection(sections)
    }
  }, 200)
}

watch(() => route.fullPath, () => {
  setupObserver()
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  setupObserver()
})

onUnmounted(() => {
  if (process.client) window.removeEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  sectionObserver = null
})
</script>

<style scoped>
.nav-link {
  @apply flex h-full items-center border-b-2 border-transparent pb-1 text-xs font-bold uppercase tracking-widest text-slate-500 no-underline transition-all hover:text-cyan-700 dark:text-slate-300/70 dark:hover:text-cyan-300;
}

.nav-active {
  @apply border-cyan-600 text-cyan-700 dark:border-cyan-300 dark:text-cyan-300;
}

.mobile-nav-link {
  @apply rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 no-underline transition-colors hover:bg-slate-50 hover:text-cyan-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-cyan-300;
}

.mobile-nav-active {
  @apply bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-300;
}
</style>
