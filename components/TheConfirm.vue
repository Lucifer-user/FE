<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="confirmData" class="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" @click="confirmData.resolve(false)"></div>

      <div class="relative bg-white dark:bg-[#1a1a1a] w-full max-w-[400px] rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden group transition-colors duration-500">
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 dark:bg-white/5 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>

        <div class="relative">
          <div class="flex items-center gap-4 mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-indigo-600 dark:text-cyan-400 shadow-inner transition-colors">
              <QuestionMarkCircleIcon class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] tracking-tight transition-colors">{{ $t('global.confirm_title') }}</h3>
          </div>

          <p class="text-slate-600 dark:text-white/60 text-sm leading-relaxed mb-8 transition-colors">
            {{ confirmData.message }}
          </p>

          <div class="flex gap-3">
            <button
              @click="confirmData.resolve(false)"
              class="flex-1 py-3.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-white/40 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
            >
              {{ $t('global.cancel') }}
            </button>
            <button
              @click="confirmData.resolve(true)"
              class="flex-1 py-3.5 bg-indigo-600 dark:bg-cyan-500 hover:bg-indigo-700 dark:hover:bg-cyan-400 text-white dark:text-black rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg dark:shadow-none active:scale-95"
            >
              {{ $t('global.agree') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'

const { confirmData } = useToast()
</script>
