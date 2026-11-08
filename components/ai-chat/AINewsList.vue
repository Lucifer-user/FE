<template>
  <div class="space-y-4">
    <section class="overflow-hidden rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
      <div class="flex items-start gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-amber-100 text-amber-700">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 5H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2zm-8 4h6m-6 4h6M7 9h.01M7 13h.01" />
          </svg>
        </div>

        <div>
          <p class="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-600">{{ $t('ai_chat.news_feed') }}</p>
          <h3 class="mt-1 text-lg font-bold text-slate-900">{{ $t('ai_chat.featured_news') }}</h3>
          <p class="mt-1.5 text-[13px] leading-relaxed text-slate-500">
            Chọn tin để xem thêm chi tiết ngay trong khung chat này.
          </p>
        </div>
      </div>
    </section>

    <article
      v-for="news in newsList"
      :key="news.id"
      class="group overflow-hidden rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(15,23,42,0.12)]"
    >
      <div class="flex items-start gap-4">
        <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-slate-100 text-2xl">
          {{ news.icon }}
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0">
              <h4 class="text-[15px] font-bold leading-SNUG text-slate-900">{{ news.title }}</h4>
              <p class="mt-0.5 text-[10px] font-semibold tracking-wide text-slate-400">{{ news.date }}</p>
            </div>

            <span class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              Gợi ý nhanh
            </span>
          </div>

          <p class="mt-3 text-[13px] leading-relaxed text-slate-500">{{ news.description }}</p>

          <div class="mt-4 grid grid-cols-2 gap-2">
            <div class="rounded-xl bg-slate-50 px-3 py-2.5">
              <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Điểm đến
              </div>
              <p class="mt-1 text-[13px] font-semibold text-slate-700">{{ news.location }}</p>
            </div>

            <div class="rounded-xl bg-slate-50 px-3 py-2.5">
              <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thời gian
              </div>
              <p class="mt-1 text-[13px] font-semibold text-slate-700">{{ news.duration }}</p>
            </div>

            <div class="col-span-2 rounded-xl bg-rose-50 px-3 py-2.5">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Giá ưu đãi
                </div>
                <p class="text-[14px] font-bold text-rose-600">{{ news.price }}</p>
              </div>
            </div>
          </div>

          <button
            class="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-950"
            @click="$emit('askNews', news)"
          >
            Đặt câu hỏi về tour này
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
const newsList = [
  {
    id: 1,
    icon: '🏖️',
    title: '🎉 Tour Đà Nẵng - Giảm 30% tháng 6',
    date: '01/06/2024',
    description: 'Khách sạn 4 sao view biển, bao gồm vé tham quan Bà Nà Hills, buffet sáng tại khách sạn',
    location: 'Đà Nẵng, Việt Nam',
    duration: '3 ngày 2 đêm',
    price: '2,990,000đ/khách'
  },
  {
    id: 2,
    icon: '✈️',
    title: '✈️ Vé máy bay đi Thái Lan chỉ từ 1.2tr',
    date: '28/05/2024',
    description: 'Bay cùng VietJet, bao gồm 20kg hành lý ký gửi, chọn chỗ miễn phí',
    location: 'Bangkok, Phuket, Chiang Mai',
    duration: 'Khứ hồi linh hoạt',
    price: '1,200,000đ/vé'
  },
  {
    id: 3,
    icon: '🏔️',
    title: '🏨 Khách sạn Đà Lạt ưu đãi 40%',
    date: '25/05/2024',
    description: 'Nghỉ dưỡng cuối tuần, view đồi thông, bao gồm bữa sáng, spa miễn phí',
    location: 'Đà Lạt, Lâm Đồng',
    duration: '2 ngày 1 đêm',
    price: '1,500,000đ/phòng'
  }
]

defineEmits(['askNews'])
</script>
