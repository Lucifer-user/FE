<template>
  <footer class="bg-[#0d0d12] relative overflow-hidden z-[1]">

    <!-- Watermark chữ nền -->
    <span
      class="pointer-events-none select-none absolute right-[-2rem] top-1/2 -translate-y-1/2
             font-['Sora'] font-extrabold text-[10rem] text-white/[0.03] whitespace-nowrap tracking-[-0.05em]"
    >
      TravelAI
    </span>

    <div class="max-w-[1280px] mx-auto px-8 py-20 relative z-[1]
                grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-12">

      <!-- Left: Heading + Sub -->
      <div>
        <h2 class="font-['Sora'] text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold text-white tracking-tight leading-[1.15]">
          {{ $t('public.footer.title_line_1') }}<br/>
          <span class="text-[#e8604c]">{{ $t('public.footer.title_line_2') }}</span><br/>
          {{ $t('public.footer.title_line_3') }}
        </h2>
        <p class="text-white/50 mt-3 text-[0.9rem]">
          {{ $t('public.footer.subtitle') }}
        </p>
      </div>

      <!-- Right: Buttons -->
      <div class="flex gap-4 flex-wrap md:justify-end justify-center">
        <button
          class="bg-[#e8604c] text-white px-8 py-[0.85rem] rounded-sm
                 font-['Sora'] text-[0.8rem] font-bold tracking-[0.08em] uppercase border-0
                 cursor-pointer transition-all duration-200 whitespace-nowrap
                 hover:bg-[#d94e3a] hover:-translate-y-0.5"
        >
          {{ $t('public.footer.consult') }}
        </button>
        <button
          class="bg-transparent text-white px-8 py-[0.85rem] rounded-sm
                 font-['Sora'] text-[0.8rem] font-bold tracking-[0.08em] uppercase
                 border border-white/30 cursor-pointer transition-all duration-200 whitespace-nowrap
                 hover:border-white/70 hover:bg-white/5"
        >
          {{ $t('public.footer.demo') }}
        </button>
      </div>

    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/10">
      <div class="max-w-[1280px] mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="font-['Sora'] font-extrabold text-white/80 text-sm tracking-tight flex items-center gap-2">
          <span class="w-1.5 h-1.5 bg-[#e8604c] rounded-full"></span>
          TravelAI
        </div>
        <p class="text-white/30 text-xs">
          {{ $t('public.footer.copyright', { year: currentYear }) }}
        </p>
        <div class="flex gap-5">
          <a
            v-for="link in bottomLinks"
            :key="link.key"
            href="#"
            class="text-white/35 text-xs no-underline transition-colors duration-200 hover:text-white/70"
          >
            {{ $t(link.label) }}
          </a>
        </div>
      </div>
    </div>

  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()

const bottomLinks = [
  { key: 'terms', label: 'public.footer.terms' },
  { key: 'privacy', label: 'public.footer.privacy' },
  { key: 'contact', label: 'public.footer.contact' }
]
</script>
