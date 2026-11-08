<template>
  <section class="rounded-[24px] border border-dashed border-slate-300 bg-white/75 px-6 py-8 text-center shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
    <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
      <svg class="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </div>

    <h3 class="mt-4 text-lg font-semibold text-slate-800">{{ $t('ai_chat.new_chat_ready') }}</h3>
    <p class="mt-2 text-sm leading-6 text-slate-500">
      Chọn một gợi ý để bắt đầu nhanh hoặc gửi câu hỏi đầu tiên của bạn ngay bên dưới.
    </p>
  </section>
</template>
