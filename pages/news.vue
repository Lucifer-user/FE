<template>
  <div class="bg-white dark:bg-[#09090B] text-slate-900 dark:text-on-background min-h-screen relative overflow-x-hidden font-body transition-colors duration-500">
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-neon-cyan opacity-[0.05] dark:opacity-[0.1] blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-nebula-1"></div>
      <div class="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-deep-purple opacity-[0.05] dark:opacity-[0.1] blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-nebula-2"></div>
    </div>

    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div v-for="n in 5" :key="`star-${n}`" 
        class="shooting-star opacity-0 dark:opacity-0 group-dark:opacity-100"
        :style="{
          left: `${Math.random() * 80 + 10}%`,
          top: `${Math.random() * 40}%`,
          animationDelay: `${Math.random() * 15}s`,
          animationDuration: `${2.5 + Math.random() * 2}s`
        }"
      ></div>
    </div>

    <main class="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-container-max mx-auto">
      <header class="mb-24 flex flex-col items-center text-center">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md mb-8 animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00f0ff]"></span>
          <span class="font-display text-[0.7rem] font-bold text-neon-cyan uppercase tracking-widest">{{ $t('public.news.badge') }}</span>
        </div>
        
        <h1 class="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-8 max-w-4xl animate-fade-in transition-colors">
          {{ $t('public.news.title_prefix') }} <span class="bg-gradient-to-r from-neon-cyan to-deep-purple bg-clip-text text-transparent animate-shimmer">{{ $t('public.news.title_highlight') }}</span>
        </h1>
        
        <p class="text-slate-600 dark:text-on-surface-variant text-lg md:text-xl leading-relaxed max-w-2xl animate-fade-in delay-200 transition-colors">
          {{ $t('public.news.subtitle') }}
        </p>
      </header>

      <div v-if="newsList.length" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <template v-for="(news, index) in newsList" :key="news._id.$oid">
          <NuxtLink 
            :to="`/newdetail/${news._id.$oid}`"
            class="glass-card-wrapper group cursor-pointer transition-all duration-500"
            :class="index === 0 ? 'lg:col-span-8' : 'lg:col-span-4'"
          >
            <div class="glass-card-inner flex flex-col relative h-full overflow-hidden transition-all duration-500 bg-white/20 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 group-hover:bg-white/40 dark:group-hover:bg-white/[0.05] shadow-lg dark:shadow-none group-hover:shadow-[0_0_40px_rgba(0,240,255,0.15)]">
              
              <div :class="index === 0 ? 'h-64 sm:h-80' : 'h-48'" class="w-full relative overflow-hidden rounded-t-2xl">
                <img 
                  v-if="news.cover_image"
                  :src="news.cover_image" 
                  class="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-slate-100 to-white dark:from-white/5 dark:to-white/0 flex items-center justify-center p-8">
                  <span class="font-display text-2xl font-bold text-slate-200 dark:text-white/10 group-hover:text-neon-cyan/20 transition-colors">{{ news.title }}</span>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-white/20 dark:from-[#09090B]/80 to-transparent transition-colors"></div>
              </div>

              <div class="p-6 sm:p-8 flex flex-col flex-grow">
                <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
                  <span v-for="tag in news.tags.slice(0, 2)" :key="tag" 
                    class="bg-deep-purple/10 dark:bg-deep-purple/20 text-deep-purple dark:text-neon-cyan font-display text-[0.6rem] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-deep-purple/20 dark:border-deep-purple/30 transition-colors">
                    {{ tag }}
                  </span>
                  <span v-if="news.status === 'published'" class="text-[0.6rem] font-bold text-neon-cyan uppercase tracking-widest sm:ml-auto">
                    {{ $t('public.news.live') }}
                  </span>
                </div>

                <h2 :class="index === 0 ? 'text-2xl sm:text-3xl' : 'text-xl'" class="font-display font-bold text-slate-900 dark:text-white mb-4 group-hover:text-neon-cyan transition-colors leading-tight">
                  {{ news.title }}
                </h2>

                <p class="text-slate-500 dark:text-on-surface-variant text-sm leading-relaxed mb-8 flex-grow line-clamp-3 transition-colors">
                  {{ news.body }}
                </p>

                <div class="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5 mt-auto transition-colors">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-colors">
                      <span class="material-symbols-outlined text-slate-400 dark:text-white/40 text-[16px]">code</span>
                    </div>
                    <span class="text-[0.7rem] font-bold text-slate-400 dark:text-white/40 uppercase tracking-wider transition-colors">Orbit Core</span>
                  </div>
                  <span class="text-[0.7rem] font-bold text-slate-300 dark:text-white/20 uppercase tracking-widest transition-colors">{{ formatDate(news.published_at) }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </template>
      </div>

      <div v-else class="text-center py-32">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full mb-4"></div>
        <p class="font-display text-sm tracking-widest text-slate-400 dark:text-white/40 transition-colors">{{ $t('public.news.loading') }}</p>
      </div>

      <div v-if="newsList.length" class="mt-24 flex justify-center">
        <button class="bg-white dark:bg-transparent border border-slate-200 dark:border-white/10 hover:border-neon-cyan text-slate-500 dark:text-white/60 hover:text-neon-cyan px-10 py-4 rounded-full font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 group shadow-sm dark:shadow-none">
          {{ $t('public.news.load_more') }}
          <span class="material-symbols-outlined text-[18px] group-hover:translate-y-1 transition-transform">expand_more</span>
        </button>
      </div>
    </main>

    <div class="h-32"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '~/utils/auth/firebase.js';

const { locale } = useI18n();
const localeCode = computed(() => locale.value === 'vi' ? 'vi-VN' : 'en-US');

const accessToken = ref('');
const loading = ref(true);

onMounted(async () => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);

  try {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      const authRes = await fetch('https://platform-gateway-dev.orbitai.fun/v1/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const authData = await authRes.json();
      accessToken.value = authData.accessToken;
    }
  } catch (err) {
    console.error('API Sync Error:', err);
  }
});

const newsList = [
  {
    _id: { $oid: "69ce264233c6cfc31e1482b1" },
    title: "Introducing the Quantum-State Routing Protocol",
    body: "Our latest infrastructural update enables sub-millisecond dynamic routing across global node clusters, reducing latency for complex inference tasks by 40%. This breakthrough allows for real-time sentient-grade model interactions.",
    cover_image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2000&auto=format&fit=crop",
    tags: ["Architecture", "Infrastructure"],
    status: "published",
    published_at: { $date: "2024-10-24T08:18:10.599Z" }
  },
  {
    _id: { $oid: "69ce264233c6cfc31e1482c6" },
    title: "Orbit Studio 2.5: Enhanced Context",
    body: "Developers can now leverage expanded continuous context windows within the Studio interface, allowing for deeper semantic tracking in long-form generation and complex codebase analysis.",
    cover_image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2000&auto=format&fit=crop",
    tags: ["Update", "Studio"],
    status: "published",
    published_at: { $date: "2024-10-18T08:18:10.600Z" }
  },
  {
    _id: { $oid: "69ce264233c6cfc31e1482df" },
    title: "Expanding the Enterprise Edge",
    body: "Deployments in the APAC region are now supported by localized edge inference nodes, ensuring strict data residency compliance without sacrificing processing speed or precision.",
    cover_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop",
    tags: ["Ecosystem", "Enterprise"],
    status: "published",
    published_at: { $date: "2024-10-12T08:18:10.600Z" }
  },
  {
    _id: { $oid: "69ce264233c6cfc31e1482e4" },
    title: "Mitigating Hallucinations in LLMs",
    body: "A deep dive into our latest whitepaper detailing asynchronous validation loops that cross-reference model outputs against verified external datasets in real-time.",
    cover_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop",
    tags: ["Research", "Safety"],
    status: "published",
    published_at: { $date: "2024-10-05T08:18:10.600Z" }
  },
  {
    _id: { $oid: "69ce264233c6cfc31e148300" },
    title: "Next-Gen Spatial Analysis Tools",
    body: "Our computer vision APIs have been upgraded to support real-time 3D spatial mapping and depth estimation from standard 2D video feeds using advanced neural depth prediction.",
    cover_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
    tags: ["Vision", "Spatial AI"],
    status: "published",
    published_at: { $date: "2024-09-28T08:18:10.600Z" }
  },
  {
    _id: { $oid: "69ce264233c6cfc31e148301" },
    title: "Securing Proprietary Weights",
    body: "New post-quantum cryptographic primitives are now standard across all Orbit AI clusters, ensuring your intellectual property remains secure against tomorrow's threats.",
    cover_image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
    tags: ["Security", "Encryption"],
    status: "published",
    published_at: { $date: "2024-09-15T08:18:10.600Z" }
  }
];

const formatDate = (date) => {
  if (!date?.$date) return "N/A";
  return new Date(date.$date).toLocaleDateString(localeCode.value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};
</script>

<style scoped>
.glass-card-wrapper {
  position: relative;
  padding: 1px;
  border-radius: 1.5rem;
}

.glass-card-inner {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: calc(1.5rem - 1px);
}

@keyframes nebula-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5%, 10%) scale(1.1); }
  66% { transform: translate(-10%, -5%) scale(0.9); }
}

@keyframes nebula-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-10%, -5%) scale(1.1); }
  66% { transform: translate(5%, 10%) scale(0.9); }
}

.animate-nebula-1 {
  animation: nebula-1 20s infinite ease-in-out;
}

.animate-nebula-2 {
  animation: nebula-2 25s infinite ease-in-out;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.animate-shimmer {
  display: inline-block;
  color: #1e293b;
  position: relative;
  background-size: 200% auto;
  animation: shimmer 5s linear infinite;
}

.dark .animate-shimmer {
  color: #fff;
}

@supports (background-clip: text) or (-webkit-background-clip: text) {
  .animate-shimmer {
    background-image: linear-gradient(90deg, #1e293b, #00f0ff, #1e293b);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .dark .animate-shimmer {
    background-image: linear-gradient(90deg, #fff, #00f0ff, #fff);
  }
}

.shooting-star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1), 0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 1);
  animation: shooting 3s linear infinite;
}

.shooting-star::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 1px;
  background: linear-gradient(90deg, #fff, transparent);
}

@keyframes shooting {
  0% { transform: rotate(-45deg) translateX(0); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: rotate(-45deg) translateX(-1000px); opacity: 0; }
}
</style>
