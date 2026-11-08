<template>
    <NuxtLayout>
      <NuxtPage />
      <TheToast />
      <TheConfirm />
    </NuxtLayout>
    <Transition name="language-loading">
      <div
        v-if="isLanguageSwitching"
        role="status"
        aria-live="polite"
        aria-busy="true"
        class="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80"
      >
        <div class="flex flex-col items-center gap-4">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p class="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">
            {{ locale === 'vi' ? 'Đang chuyển ngôn ngữ...' : 'Switching language...' }}
          </p>
        </div>
      </div>
    </Transition>
</template>

<script setup>
const { locale } = useI18n()
const isLanguageSwitching = useState('isLanguageSwitching', () => false)

useHead(() => ({
  htmlAttrs: { lang: locale.value }
}))
</script>

<style>
html, body {
  background-color: var(--bg-color) !important;
  margin: 0;
  padding: 0;
}

.language-loading-enter-active,
.language-loading-leave-active {
  transition: opacity 180ms ease;
}

.language-loading-enter-from,
.language-loading-leave-to {
  opacity: 0;
}
</style>
