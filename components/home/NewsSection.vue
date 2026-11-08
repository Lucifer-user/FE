<template>
  <section id="news" class="relative overflow-hidden border-b border-slate-200/80 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-500 dark:border-white/10 dark:bg-transparent">
    <div class="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.025]" style="background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px); background-size: 52px 52px; background-position: center center;"></div>
    <div class="pointer-events-none absolute -right-40 top-24 h-[28rem] w-[28rem] rounded-full bg-cyan-200/15 blur-[100px] dark:bg-cyan-500/10"></div>
    <div class="pointer-events-none absolute -left-48 bottom-16 h-[24rem] w-[24rem] rounded-full bg-blue-200/15 blur-[100px] dark:bg-blue-500/10"></div>

    <div class="relative z-10 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
      <header class="max-w-3xl">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">{{ copy.eyebrow }}</p>
        <h2 class="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl dark:text-white">{{ copy.title }}</h2>
        <p class="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300/70">{{ copy.description }}</p>
      </header>

      <div v-if="newsList.length" class="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <NuxtLink
          v-if="newsList[0]"
          :to="`/newdetail/${newsList[0]._id.$oid}`"
          class="news-card news-card--featured group lg:col-span-7"
        >
          <article class="flex h-full flex-col">
            <div class="news-card__image-wrap aspect-[16/9] sm:aspect-[16/8]">
              <img
                v-if="newsList[0].cover_image"
                :src="newsList[0].cover_image"
                :alt="newsList[0].title"
                class="news-card__image"
              />
              <div v-else class="flex h-full items-center justify-center bg-slate-100 p-8 dark:bg-[#050505]"><span class="text-center text-xl font-semibold text-slate-300 dark:text-slate-600">{{ newsList[0].title }}</span></div>
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent"></div>
              <span class="absolute left-5 top-5 rounded-full border border-white/25 bg-slate-950/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">{{ copy.featuredLabel }}</span>
            </div>

            <div class="flex flex-1 flex-col p-6 sm:p-8">
              <div class="flex flex-wrap items-center gap-2">
                <span v-for="tag in newsList[0].tags.slice(0, 2)" :key="tag" class="news-tag">{{ tag }}</span>
                <span v-if="newsList[0].status === 'published'" class="news-status">{{ $t('public.news.live') }}</span>
              </div>
              <h3 class="mt-5 text-2xl font-semibold leading-tight tracking-[-0.025em] text-slate-950 transition-colors group-hover:text-cyan-700 sm:text-3xl dark:text-white dark:group-hover:text-cyan-300">{{ newsList[0].title }}</h3>
              <p class="mt-4 line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300/65">{{ newsList[0].body }}</p>
              <div class="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 dark:border-white/10">
                <span class="inline-flex items-center gap-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300"><span class="material-symbols-outlined text-[17px]">article</span>{{ copy.readArticle }}</span>
                <span class="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ formatDate(newsList[0].published_at) }}</span>
              </div>
            </div>
          </article>
        </NuxtLink>

        <div class="grid gap-5 lg:col-span-5 lg:grid-rows-3">
          <NuxtLink
            v-for="news in newsList.slice(1, 4)"
            :key="news._id.$oid"
            :to="`/newdetail/${news._id.$oid}`"
            class="news-card news-card--compact group"
          >
            <article class="flex h-full min-w-0 gap-4 p-4 sm:p-5">
              <div class="news-card__compact-image-wrap">
                <img v-if="news.cover_image" :src="news.cover_image" :alt="news.title" class="news-card__image" />
                <div v-else class="flex h-full items-center justify-center bg-slate-100 dark:bg-[#050505]"><span class="material-symbols-outlined text-cyan-600 dark:text-cyan-300">article</span></div>
              </div>
              <div class="flex min-w-0 flex-1 flex-col">
                <div class="flex items-center justify-between gap-3">
                  <span v-if="news.tags?.[0]" class="news-tag news-tag--compact">{{ news.tags[0] }}</span>
                  <span class="shrink-0 text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">{{ formatDate(news.published_at) }}</span>
                </div>
                <h3 class="mt-3 line-clamp-2 text-base font-semibold leading-6 text-slate-950 transition-colors group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">{{ news.title }}</h3>
                <span class="mt-auto inline-flex items-center gap-1.5 pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-700 dark:text-cyan-300"><span>{{ copy.readArticle }}</span><span class="material-symbols-outlined text-[15px] transition-transform group-hover:translate-x-1">arrow_forward</span></span>
              </div>
            </article>
          </NuxtLink>
        </div>
      </div>

      <div v-else class="py-32 text-center">
        <div class="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500/20 border-t-cyan-500"></div>
        <p class="text-sm tracking-widest text-slate-400 dark:text-slate-500">{{ $t('public.news.loading') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { auth } from '~/utils/auth/firebase.js';

const { locale } = useI18n();
const localeCode = computed(() => locale.value === 'vi' ? 'vi-VN' : 'en-US');
const copy = computed(() => locale.value === 'vi'
  ? {
      eyebrow: 'AI INSIGHTS',
      title: 'Tin tức và xu hướng AI',
      description: 'Cập nhật những phát triển mới về trí tuệ nhân tạo và ứng dụng AI trong doanh nghiệp.',
      featuredLabel: 'Featured insight',
      readArticle: 'Đọc bài viết',
    }
  : {
      eyebrow: 'AI INSIGHTS',
      title: 'AI news and insights',
      description: 'Stay informed on the latest developments in artificial intelligence and enterprise AI applications.',
      featuredLabel: 'Featured insight',
      readArticle: 'Read article',
    });

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
.news-card {
  @apply block min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white no-underline shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition duration-300 dark:border-cyan-300/15 dark:bg-[#0A0A0A] dark:shadow-none;
}

.news-card:hover {
  @apply -translate-y-1 border-cyan-300 shadow-[0_18px_36px_rgba(8,145,178,0.12)] dark:border-cyan-300/35 dark:shadow-[0_18px_38px_rgba(6,182,212,0.08)];
}

.news-card__image-wrap {
  @apply relative overflow-hidden bg-slate-100 dark:bg-[#050505];
}

.news-card__image {
  @apply block h-full w-full object-cover transition duration-700 ease-out;
}

.news-card:hover .news-card__image {
  transform: scale(1.035);
}

.news-card__compact-image-wrap {
  @apply aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-36 dark:bg-[#050505];
}

.news-tag {
  @apply rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-300;
}

.news-tag--compact {
  @apply max-w-[9rem] truncate;
}

.news-status {
  @apply ml-auto text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-300;
}

@media (prefers-reduced-motion: reduce) {
  .news-card,
  .news-card__image {
    transition: none;
  }
}
</style>
