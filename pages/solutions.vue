<template>
  <div class="font-body text-slate-900 bg-[#F9F9F6] dark:text-slate-300 dark:bg-[#0A0A0A] min-h-screen selection:bg-cyan-500/30 selection:text-black dark:selection:text-white overflow-x-hidden relative transition-colors duration-500">
    
    <div class="fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.04] z-0" style="background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px); background-size: 50px 50px; background-position: center center;"></div>

    <main class="relative z-10 flex-grow pt-24 sm:pt-32 pb-20 sm:pb-24">
      
      <section class="relative w-full flex flex-col items-center justify-start text-center pt-16 sm:pt-24 pb-16 sm:pb-20 overflow-visible perspective-container">
        
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite] mix-blend-multiply dark:mix-blend-screen pointer-events-none z-0"></div>
        <div class="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-cyan-400/10 dark:bg-cyan-600/20 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite_alternate] mix-blend-multiply dark:mix-blend-screen pointer-events-none z-0"></div>

        <div class="relative z-20 w-full max-w-5xl mx-auto px-5 sm:px-8 space-y-5 sm:space-y-6 flex flex-col items-center">
          <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 dark:bg-white/[0.05] border border-black/5 dark:border-white/10 backdrop-blur-xl opacity-0 animate-[fade-in-up_1s_ease-out_0.2s_forwards] shadow-sm">
            <span class="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 animate-pulse rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></span>
            <span class="font-mono text-[10px] font-bold text-slate-700 dark:text-white/80 uppercase tracking-[0.2em]">{{ $t('public.solutions.badge') }}</span>
          </div>
          
          <h1 class="font-display text-[clamp(2.75rem,13vw,4.5rem)] md:text-7xl lg:text-8xl font-semibold text-[#111111] dark:text-white leading-[1.08] tracking-tight opacity-0 animate-[fade-in-up_1s_ease-out_0.4s_forwards] relative z-20">
            {{ $t('public.solutions.title_part1') }} <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-500">{{ $t('public.solutions.title_part2') }}</span>
          </h1>
          
          <p class="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 dark:text-white/60 max-w-2xl opacity-0 animate-[fade-in-up_1s_ease-out_0.6s_forwards] relative z-20">
            {{ $t('public.solutions.subtitle') }}
          </p>
        </div>

        <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 mt-12 opacity-0 animate-[fade-in-up_1s_ease-out_forwards]" style="animation-delay: 0.8s; animation-duration: 1.2s;">
          <div class="tilt-card relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-[32px] overflow-hidden border border-white dark:border-white/10 bg-white/50 dark:bg-black/50 p-2 md:p-3">
            <div class="relative w-full h-full rounded-xl md:rounded-[20px] overflow-hidden bg-black/5 dark:bg-white/5">
              <img src="/images/solutions-brandkit-light.png" alt="Orbit Solutions" class="w-full h-full object-cover block dark:hidden object-center" />
              <img src="/images/solutions-brandkit.png" alt="Orbit Solutions" class="w-full h-full object-cover hidden dark:block object-center" />
              
              <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 dark:via-white/10 translate-x-[-150%] shimmer-effect pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 opacity-0 animate-[fade-in-up_1s_ease-out_forwards]" style="animation-delay: 1s;">
        <div class="mb-12 font-mono text-xs text-slate-400 dark:text-white/40 uppercase tracking-[0.2em] border-b border-black/5 dark:border-white/10 pb-4 flex justify-between items-end">
          <span>{{ $t('public.solutions.features_subtitle') }}</span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 md:auto-rows-[280px]">
          
          <div class="md:col-span-8 md:row-span-2 relative group bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-sm p-7 sm:p-10 flex flex-col justify-between gap-14 md:gap-0 hover:border-black/10 dark:hover:bg-white/[0.04] dark:hover:border-white/20 transition-all duration-500 md:overflow-hidden cursor-crosshair shadow-sm hover:shadow-md dark:shadow-none">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div class="relative z-10 flex justify-between items-start transform group-hover:translate-x-2 transition-transform duration-500">
               <span class="material-symbols-outlined text-slate-400 dark:text-white/50 text-3xl font-light group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">shopping_cart_checkout</span>
               <span class="font-mono text-[10px] text-slate-400 dark:text-white/30 border border-black/5 dark:border-white/10 px-2 py-1 rounded-sm uppercase tracking-widest">[ 01 ]</span>
            </div>
            <div class="relative z-10 transform group-hover:-translate-y-2 transition-transform duration-500">
              <h3 class="font-display text-2xl font-medium text-[#111111] dark:text-white mb-4">{{ $t('public.solutions.feat1_title') }}</h3>
              <p class="font-mono text-sm text-slate-500 dark:text-white/50 max-w-md leading-relaxed mb-6">
                {{ $t('public.solutions.feat1_desc') }}
              </p>
              <button class="font-mono text-[10px] text-purple-600 dark:text-purple-400 uppercase tracking-widest font-bold group-hover:underline">{{ $t('public.solutions.feat1_link') }}</button>
            </div>
          </div>

          <div class="md:col-span-4 md:row-span-1 bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-sm p-7 sm:p-8 flex flex-col justify-between gap-12 md:gap-0 hover:border-black/10 dark:hover:bg-white/[0.04] dark:hover:border-white/20 transition-all duration-500 group cursor-crosshair shadow-sm hover:shadow-md dark:shadow-none">
            <div class="flex justify-between items-start transform group-hover:translate-x-1 transition-transform duration-500">
               <span class="material-symbols-outlined text-slate-400 dark:text-white/50 text-2xl font-light group-hover:text-[#111111] dark:group-hover:text-white transition-colors">support_agent</span>
               <span class="font-mono text-[10px] text-slate-400 dark:text-white/30 border border-black/5 dark:border-white/10 px-2 py-1 rounded-sm uppercase tracking-widest">[ 02 ]</span>
            </div>
            <div class="transform group-hover:-translate-y-1 transition-transform duration-500">
              <h3 class="font-display text-lg font-medium text-[#111111] dark:text-white mb-2">{{ $t('public.solutions.feat2_title') }}</h3>
              <p class="font-mono text-xs text-slate-500 dark:text-white/50 leading-relaxed">{{ $t('public.solutions.feat2_desc') }}</p>
            </div>
          </div>

          <div class="md:col-span-4 md:row-span-1 bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-sm p-7 sm:p-8 flex flex-col justify-between gap-12 md:gap-0 hover:border-black/10 dark:hover:bg-white/[0.04] dark:hover:border-white/20 transition-all duration-500 group cursor-crosshair shadow-sm hover:shadow-md dark:shadow-none">
            <div class="flex justify-between items-start transform group-hover:translate-x-1 transition-transform duration-500">
               <span class="material-symbols-outlined text-slate-400 dark:text-white/50 text-2xl font-light group-hover:text-[#111111] dark:group-hover:text-white transition-colors">hub</span>
               <span class="font-mono text-[10px] text-slate-400 dark:text-white/30 border border-black/5 dark:border-white/10 px-2 py-1 rounded-sm uppercase tracking-widest">[ 03 ]</span>
            </div>
            <div class="transform group-hover:-translate-y-1 transition-transform duration-500">
              <h3 class="font-display text-lg font-medium text-[#111111] dark:text-white mb-2">{{ $t('public.solutions.feat3_title') }}</h3>
              <p class="font-mono text-xs text-slate-500 dark:text-white/50 leading-relaxed">{{ $t('public.solutions.feat3_desc') }}</p>
            </div>
          </div>

        </div>
      </section>
      
      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-32 text-center opacity-0 animate-[fade-in-up_1s_ease-out_forwards]" style="animation-delay: 1.2s;">
        <h2 class="font-display text-3xl md:text-5xl font-medium text-[#111111] dark:text-white mb-8">{{ $t('public.solutions.cta_title') }}</h2>
        <NuxtLink to="/partner" class="inline-block bg-[#111111] dark:bg-white text-white dark:text-black px-10 py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-purple-700 dark:hover:bg-purple-400 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)] dark:hover:shadow-[0_10px_30px_rgba(192,132,252,0.2)]">
          {{ $t('public.solutions.cta_btn') }}
        </NuxtLink>
      </section>

    </main>
    <ClientOnly>
      <AIChatContainer />
    </ClientOnly>
  </div>
</template>

<script setup>
import AIChatContainer from '~/components/ai-chat/AIChatContainer.vue'

definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  100% { transform: translateX(150%); }
}

.perspective-container { perspective: 2000px; }
.tilt-card {
  transform: rotateX(15deg) scale(0.95);
  box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.15);
  transition: all 1s cubic-bezier(0.23, 1, 0.32, 1);
}
:global(.dark) .tilt-card { box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8); }
.perspective-container:hover .tilt-card {
  transform: rotateX(0deg) scale(1.02);
  box-shadow: 0 60px 120px -20px rgba(168, 85, 247, 0.15);
}
.perspective-container:hover .shimmer-effect { animation: shimmer 2s ease-in-out forwards; }

.animate-\[fade-in-up_1s_ease-out_forwards\] { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-\[fade-in-up_1s_ease-out_0\.2s_forwards\] { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; }
.animate-\[fade-in-up_1s_ease-out_0\.4s_forwards\] { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; }
.animate-\[fade-in-up_1s_ease-out_0\.6s_forwards\] { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; }
</style>
