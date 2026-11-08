<template>
  <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
    <TransitionGroup 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-12 opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-12 opacity-0"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-md border min-w-[300px] max-w-md group overflow-hidden transition-all duration-500"
        :class="bgClasses[toast.type]"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <component :is="icons[toast.type]" class="h-6 w-6" :class="iconClasses[toast.type]" />
        </div>

        <!-- Content -->
        <div class="flex-1">
          <p class="text-sm font-bold font-['Inter'] leading-tight transition-colors" :class="textClasses[toast.type]">
            {{ toast.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button 
          @click="removeToast(toast.id)"
          class="flex-shrink-0 text-slate-400 dark:text-white/20 hover:text-slate-600 dark:hover:text-white transition-colors p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div 
          class="absolute bottom-0 left-0 h-1 bg-current opacity-20 transition-all duration-[3000ms] ease-linear w-full origin-left scale-x-0 animate-progress"
          :class="textClasses[toast.type]"
        ></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/solid'

const { toasts, removeToast } = useToast()

const bgClasses = {
  success: 'bg-emerald-50/90 dark:bg-emerald-500/10 border-emerald-200/50 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400',
  error: 'bg-rose-50/90 dark:bg-rose-500/10 border-rose-200/50 dark:border-rose-500/20 text-rose-800 dark:text-rose-400',
  info: 'bg-indigo-50/90 dark:bg-indigo-500/10 border-indigo-200/50 dark:border-indigo-500/20 text-indigo-800 dark:text-indigo-400',
  warning: 'bg-amber-50/90 dark:bg-amber-500/10 border-amber-200/50 dark:border-amber-500/20 text-amber-800 dark:text-amber-400'
}

const iconClasses = {
  success: 'text-emerald-500 dark:text-emerald-400',
  error: 'text-rose-500 dark:text-rose-400',
  info: 'text-indigo-500 dark:text-indigo-400',
  warning: 'text-amber-500 dark:text-amber-400'
}

const textClasses = {
  success: 'text-emerald-900 dark:text-emerald-300',
  error: 'text-rose-900 dark:text-rose-300',
  info: 'text-indigo-900 dark:text-indigo-300',
  warning: 'text-amber-900 dark:text-amber-300'
}

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon
}
</script>

<style scoped>
@keyframes progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
.animate-progress {
  animation: progress 3s linear forwards;
}
</style>
