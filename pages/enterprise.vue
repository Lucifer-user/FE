<template>
  <div class="font-body text-slate-900 bg-[#F9F9F6] dark:text-slate-300 dark:bg-[#0A0A0A] min-h-screen selection:bg-rose-500/30 selection:text-black dark:selection:text-white overflow-x-hidden relative transition-colors duration-500">
    
    <div class="fixed inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.04] z-0" style="background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px); background-size: 50px 50px; background-position: center center;"></div>

    <main class="relative z-10 flex-grow pt-24 sm:pt-32 pb-20 sm:pb-24">
      
      <section class="relative w-full flex flex-col items-center justify-start text-center pt-16 sm:pt-24 pb-16 sm:pb-20 overflow-visible perspective-container">
        
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-400/20 dark:bg-rose-600/20 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite] mix-blend-multiply dark:mix-blend-screen pointer-events-none z-0"></div>
        <div class="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-orange-400/10 dark:bg-orange-600/20 rounded-full blur-[150px] animate-[pulse_12s_ease-in-out_infinite_alternate] mix-blend-multiply dark:mix-blend-screen pointer-events-none z-0"></div>

        <div class="relative z-20 w-full max-w-5xl mx-auto px-5 sm:px-8 space-y-5 sm:space-y-6 flex flex-col items-center">
          <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/60 dark:bg-white/[0.05] border border-black/5 dark:border-white/10 backdrop-blur-xl opacity-0 animate-[fade-in-up_1s_ease-out_0.2s_forwards] shadow-sm">
            <span class="w-1.5 h-1.5 bg-rose-600 dark:bg-rose-400 animate-pulse rounded-full shadow-[0_0_10px_rgba(244,63,94,0.8)]"></span>
            <span class="font-mono text-[10px] font-bold text-slate-700 dark:text-white/80 uppercase tracking-[0.2em]">{{ $t('public.enterprise.badge') }}</span>
          </div>
          
          <h1 class="font-display text-[clamp(2rem,11vw,4.5rem)] md:text-7xl lg:text-8xl font-semibold text-[#111111] dark:text-white leading-[1.08] tracking-tight opacity-0 animate-[fade-in-up_1s_ease-out_0.4s_forwards] relative z-20 max-w-full">
            {{ $t('public.enterprise.title_part1') }} <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-500">{{ $t('public.enterprise.title_part2') }}</span>
          </h1>
          
          <p class="font-mono text-xs sm:text-sm md:text-base leading-relaxed text-slate-600 dark:text-white/60 max-w-2xl opacity-0 animate-[fade-in-up_1s_ease-out_0.6s_forwards] relative z-20">
            {{ $t('public.enterprise.subtitle') }}
          </p>
        </div>

        <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 mt-12 opacity-0 animate-[fade-in-up_1s_ease-out_forwards]" style="animation-delay: 0.8s; animation-duration: 1.2s;">
          <div class="tilt-card relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl md:rounded-[32px] overflow-hidden border border-white dark:border-white/10 bg-white/50 dark:bg-black/50 p-2 md:p-3">
            <div class="relative w-full h-full rounded-xl md:rounded-[20px] overflow-hidden bg-black/5 dark:bg-white/5">
              <img src="/images/enterprise-brandkit-light.png" alt="Orbit Enterprise" class="w-full h-full object-cover block dark:hidden object-center" />
              <img src="/images/enterprise-brandkit.png" alt="Orbit Enterprise" class="w-full h-full object-cover hidden dark:block object-center" />
              
              <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 dark:via-white/10 translate-x-[-150%] shimmer-effect pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 border-y border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.01] opacity-0 animate-[fade-in-up_1s_ease-out_forwards]" style="animation-delay: 1s;">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 font-mono">
          <div class="space-y-2 group cursor-default">
            <p class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{{ $t('public.enterprise.metric1_title') }}</p>
            <p class="text-3xl font-light text-[#111111] dark:text-white">99.999<span class="text-slate-300 dark:text-white/30">%</span></p>
          </div>
          <div class="space-y-2 group cursor-default">
            <p class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{{ $t('public.enterprise.metric2_title') }}</p>
            <p class="text-3xl font-light text-[#111111] dark:text-white">&lt; 150<span class="text-slate-300 dark:text-white/30">ms</span></p>
          </div>
          <div class="space-y-2 group cursor-default">
            <p class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{{ $t('public.enterprise.metric3_title') }}</p>
            <p class="text-3xl font-light text-[#111111] dark:text-white">{{ $t('public.enterprise.metric3_val') }}</p>
          </div>
          <div class="space-y-2 group cursor-default">
            <p class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{{ $t('public.enterprise.metric4_title') }}</p>
            <p class="text-3xl font-light text-[#111111] dark:text-white">{{ $t('public.enterprise.metric4_val') }}</p>
          </div>
        </div>
      </section>
      
      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 opacity-0 animate-[fade-in-up_1s_ease-out_forwards]" style="animation-delay: 1.2s;">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-sm p-7 sm:p-12 flex flex-col justify-center">
             <span class="material-symbols-outlined text-rose-500 text-4xl mb-6">vpn_lock</span>
             <h3 class="font-display text-2xl font-medium text-[#111111] dark:text-white mb-4">{{ $t('public.enterprise.vpc_title') }}</h3>
             <p class="font-mono text-sm text-slate-500 dark:text-white/50 leading-relaxed">
               {{ $t('public.enterprise.vpc_desc') }}
             </p>
          </div>
          <div class="bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/10 rounded-sm p-7 sm:p-12 flex flex-col justify-center">
             <span class="material-symbols-outlined text-orange-500 text-4xl mb-6">supervised_user_circle</span>
             <h3 class="font-display text-2xl font-medium text-[#111111] dark:text-white mb-4">{{ $t('public.enterprise.rbac_title') }}</h3>
             <p class="font-mono text-sm text-slate-500 dark:text-white/50 leading-relaxed">
               {{ $t('public.enterprise.rbac_desc') }}
             </p>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-32 text-center opacity-0 animate-[fade-in-up_1s_ease-out_forwards]" style="animation-delay: 1.4s;">
        <div class="p-7 sm:p-16 rounded-2xl sm:rounded-[32px] border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-tr from-rose-500/10 to-transparent dark:from-rose-500/20 dark:to-transparent pointer-events-none"></div>
          <h2 class="font-display text-3xl md:text-5xl font-medium text-[#111111] dark:text-white mb-6 relative z-10">{{ $t('public.enterprise.cta_title') }}</h2>
          <p class="font-mono text-sm text-slate-500 dark:text-white/50 mb-10 max-w-xl mx-auto relative z-10">{{ $t('public.enterprise.cta_desc') }}</p>
          <a href="mailto:enterprise@orbit.ai" class="relative z-10 inline-block bg-[#111111] dark:bg-white text-white dark:text-black px-10 py-4 rounded-sm font-mono text-sm font-bold uppercase tracking-widest hover:bg-rose-700 dark:hover:bg-rose-400 transition-all duration-300 shadow-xl">
            {{ $t('public.enterprise.cta_btn') }}
          </a>
        </div>
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
  box-shadow: 0 60px 120px -20px rgba(244, 63, 94, 0.15);
}
.perspective-container:hover .shimmer-effect { animation: shimmer 2s ease-in-out forwards; }

.animate-\[fade-in-up_1s_ease-out_forwards\] { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-\[fade-in-up_1s_ease-out_0\.2s_forwards\] { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; }
.animate-\[fade-in-up_1s_ease-out_0\.4s_forwards\] { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; }
.animate-\[fade-in-up_1s_ease-out_0\.6s_forwards\] { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; }
</style>
