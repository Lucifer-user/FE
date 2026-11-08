<template>
  <div class="flex gap-3" :class="isUser ? 'justify-end' : 'justify-start'">
    <div
      v-if="!isUser"
      class="mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xs font-semibold text-white shadow-sm sm:flex"
    >
      AI
    </div>

    <div class="max-w-[85%] min-w-0">
      <div class="mb-2 flex items-center gap-2" :class="isUser ? 'justify-end' : 'justify-start'">
        <span
          v-if="!isUser"
          class="text-[10px] font-bold uppercase tracking-[0.1em] text-sky-600"
        >
          Trợ lý AI
        </span>

        <span
          v-if="!isUser && !isCompleted"
          class="inline-flex items-center rounded-full bg-sky-100 px-2 py-1 text-[10px] font-medium text-sky-700"
        >
          Đang phản hồi
        </span>
      </div>

      <div
        class="overflow-hidden rounded-[22px] border px-4 py-2.5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
        :class="bubbleClass"
      >
        <div class="chat-markdown whitespace-pre-wrap break-words text-[13px] leading-relaxed" v-html="parsedContent"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  role: String,
  content: {
    type: String,
    default: ''
  },
  products: {
    type: Array,
    default: () => []
  },
  isCompleted: {
    type: Boolean,
    default: true
  }
})

const isUser = computed(() => props.role === 'user')

const parsedContent = computed(() => {
  if (!props.content) return ''
  return marked(props.content, { breaks: true })
})

const bubbleClass = computed(() => (
  isUser.value
    ? 'border-sky-500/15 bg-gradient-to-br from-sky-500 to-cyan-500 text-white rounded-br-md'
    : 'border-white/80 bg-white/90 text-slate-700 backdrop-blur rounded-bl-md'
))
</script>

<style scoped>
/* Markdown styling */
:deep(.chat-markdown p) {
  margin-bottom: 0.5rem;
}
:deep(.chat-markdown p:last-child) {
  margin-bottom: 0;
}
:deep(.chat-markdown strong) {
  font-weight: 700;
}
:deep(.chat-markdown em) {
  font-style: italic;
}
:deep(.chat-markdown ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}
:deep(.chat-markdown ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}
:deep(.chat-markdown li) {
  margin-bottom: 0.25rem;
}
:deep(.chat-markdown code) {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
  font-family: monospace;
}
</style>