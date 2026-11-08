<template>
  <div class="border-b border-slate-200/70 bg-white/75 px-3 py-2 backdrop-blur-xl">
    <div class="grid grid-cols-2 gap-2 rounded-[14px] bg-slate-100/90 p-1">
      <button
        class="rounded-xl px-3 py-1.5 text-[13px] font-semibold transition"
        :class="modelValue === 'messages' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        @click="$emit('update:modelValue', 'messages')"
      >
        {{ $t('ai_chat.messages') }}
      </button>

      <button
        class="relative rounded-xl px-3 py-1.5 text-[13px] font-semibold transition"
        :class="modelValue === 'news' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        @click="$emit('update:modelValue', 'news')"
      >
        <span>{{ $t('ai_chat.news') }}</span>
        <span class="absolute right-2.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
