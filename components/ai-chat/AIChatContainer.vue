<template>
  <div class="pointer-events-none fixed inset-x-3 bottom-3 z-[9999] sm:inset-x-auto sm:bottom-6 sm:right-6">
    <div class="pointer-events-auto ml-auto flex w-full max-w-[400px] flex-col items-end gap-3">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-3 opacity-0 scale-[0.98]"
        enter-to-class="translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100 scale-100"
        leave-to-class="translate-y-3 opacity-0 scale-[0.98]"
      >
        <div
          v-if="isOpen"
          class="chat-shell relative flex h-[calc(100vh-6.5rem)] max-h-[550px] w-full flex-col overflow-hidden rounded-[28px] border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/95 shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:h-[550px]"
          style="isolation: isolate;"
        >
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_40%)]"></div>

          <div class="relative border-b border-slate-200/50 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 backdrop-blur-xl">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-2.5 min-w-0">
                <button
                  v-if="currentConversationId && activeTab === 'messages'"
                  @click="backToServices"
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                  :title="$t('ai_chat.back')"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>

                <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 dark:bg-cyan-400 text-white dark:text-slate-900 shadow-sm">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div class="flex items-center gap-2 truncate">
                  <h2 class="text-[14px] font-bold text-slate-900 dark:text-white truncate">{{ $t('ai_chat.support_chat') }}</h2>
                  <span class="flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                </div>
              </div>

              <div class="flex shrink-0 items-center gap-1.5">
                <button
                  v-if="!currentConversationId"
                  class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-sky-600 dark:hover:text-sky-400"
                  :title="$t('ai_chat.reload')"
                  @click="backToServices"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white/50 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500"
                  :title="$t('ai_chat.close')"
                  @click="isOpen = false"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <AITabs v-model="activeTab" />

          <div
            v-if="activeTab === 'messages'"
            ref="messagesContainer"
            class="chat-scroll relative flex-1 overflow-y-auto px-4 pb-4 pt-4"
          >
            <div v-if="!currentConversationId" class="relative space-y-4">
              <section class="overflow-hidden rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
                <div class="flex items-start gap-4">
                  <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-sky-100 text-sky-700">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 8h2a2 2 0 012 2v9a1 1 0 01-1 1H4a1 1 0 01-1-1v-9a2 2 0 012-2h2m10 0V6a3 3 0 00-3-3H10a3 3 0 00-3 3v2m10 0H7" />
                    </svg>
                  </div>

                  <div class="min-w-0">
                    <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-600">{{ $t('ai_chat.quick_start') }}</p>
                    <h3 class="mt-1 text-lg font-bold text-slate-900">{{ $t('ai_chat.choose_assistant') }}</h3>
                    <p class="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                      Mỗi trợ lý có vai trò và kiến thức riêng biệt. Chọn đúng trợ lý để nhận câu trả lời sát thực tế nhất.
                    </p>
                  </div>
                </div>
              </section>

              <div v-if="conversationsList.length > 0" class="space-y-2 bg-slate-50/50 dark:bg-white/5 p-3 rounded-[24px] border border-slate-100 dark:border-white/5">
                <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 px-1">
                  Cuộc trò chuyện gần đây
                </p>
                <div class="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 chat-scroll">
                  <button
                    v-for="conv in conversationsList"
                    :key="conv.id"
                    class="w-full flex items-center justify-between p-2.5 rounded-xl border border-white bg-white/90 dark:bg-slate-800/90 shadow-sm hover:border-sky-300 hover:bg-sky-50/50 text-left transition"
                    @click="handleResumeConversation(conv.id)"
                  >
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm">
                        {{ getBotIconById(conv.partner_service_id) }}
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-slate-800 dark:text-white truncate">
                          {{ getBotNameById(conv.partner_service_id) }}
                        </p>
                        <p class="text-[10px] text-slate-400">
                          Mã phòng: #{{ conv.id }} • {{ formatDate(conv.updated_at) }}
                        </p>
                      </div>
                    </div>
                    <svg class="h-3 w-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 px-1 pt-1">
                Tạo cuộc hội thoại mới
              </p>
              <div class="grid gap-3">
                <button
                  v-for="service in partnerServices"
                  :key="service.id"
                  class="group relative overflow-hidden rounded-[24px] border bg-white/85 p-4 text-left shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
                  :class="selectedServiceId === service.id ? 'border-sky-400 ring-2 ring-sky-100' : 'border-white/70 hover:border-sky-200'"
                  @click="handleSelectService(service.id)"
                >
                  <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.4),rgba(241,245,249,0.25))]"></div>

                  <div class="relative flex items-start gap-4">
                    <div
                      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] text-lg font-semibold transition"
                      :class="selectedServiceId === service.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white'"
                    >
                      {{ getServiceIcon(service) }}
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-start justify-between gap-3">
                        <div class="min-w-0">
                          <h4 class="truncate text-sm font-bold text-slate-900">{{ service.name }}</h4>
                          <p class="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            {{ getServiceTypeLabel(service) }}
                          </p>
                        </div>

                        <span
                          class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                          :class="getServiceStatusClass(service.status)"
                        >
                          {{ getServiceStatusLabel(service.status) }}
                        </span>
                      </div>

                      <p class="mt-3 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
                        {{ service.config?.system_prompt || 'Trợ lý AI hỗ trợ bạn thông minh và chính xác.' }}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div
                v-if="partnerServices.length === 0 && !isLoading"
                class="rounded-[24px] border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-sm text-slate-500"
              >
                Chưa có trợ lý khả dụng để hiển thị.
              </div>
            </div>

            <div v-else class="relative">
              <div v-if="messages.length === 0 && !isLoading" class="space-y-4">
                <AIChatEmptyState />
                <AIChatWelcome
                  :service-name="currentService?.name"
                  :service-type="currentService?.type || currentService?.category"
                  @suggest="handleSendMessage"
                />
              </div>

              <div v-else class="space-y-5">
                <div
                  v-if="currentService"
                  class="rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      {{ getServiceIcon(currentService) }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-slate-900">{{ currentService.name }}</p>
                      <p class="text-xs text-slate-500">
                        Phiên trò chuyện đang hoạt động và sẵn sàng phản hồi.
                      </p>
                    </div>
                  </div>
                </div>

                <AIChatMessage
                  v-for="msg in messages"
                  :key="msg.id"
                  :role="msg.role"
                  :content="msg.content"
                  :products="msg.products"
                  :is-completed="msg.isCompleted"
                />

                <div v-if="isLoading" class="flex justify-start">
                  <div class="flex items-end gap-3">
                    <div class="hidden h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-xs font-semibold text-white shadow-sm sm:flex">
                      AI
                    </div>

                    <div class="rounded-[24px] rounded-bl-md border border-white/70 bg-white/90 px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                      <div class="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">{{ $t('ai_chat.answering') }}</div>
                      <div class="flex gap-1.5">
                        <span class="h-2.5 w-2.5 rounded-full bg-sky-500 animate-bounce" style="animation-delay: 0ms"></span>
                        <span class="h-2.5 w-2.5 rounded-full bg-sky-500 animate-bounce" style="animation-delay: 150ms"></span>
                        <span class="h-2.5 w-2.5 rounded-full bg-sky-500 animate-bounce" style="animation-delay: 300ms"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="chat-scroll relative flex-1 overflow-y-auto px-4 pb-4 pt-4">
            <AINewsList @askNews="handleAskNews" />
          </div>

          <AIChatInput
            v-if="activeTab === 'messages' && currentConversationId"
            :loading="isLoading"
            @send="handleSendMessage"
          />
        </div>
      </Transition>

      <button
        class="group flex items-center gap-2.5 rounded-full bg-slate-900/95 dark:bg-neon-cyan px-3.5 py-2 text-white dark:text-slate-900 shadow-[0_20px_60px_rgba(0,240,255,0.2)] ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
        @click="isOpen = !isOpen"
      >
        <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
          <svg v-if="!isOpen" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <svg v-else class="h-4 w-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <div class="flex flex-col text-left leading-none">
          <div class="mb-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-slate-400/80 dark:text-slate-900/60">{{ $t('ai_chat.label') }}</div>
          <div class="text-[12px] font-bold tracking-tight">{{ isOpen ? 'Thu gọn' : 'Chat ngay' }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, computed } from 'vue'
import { useAIChat } from '~/composables/useAIChat'

const toast = useToast()
const { t, locale } = useI18n()

import AITabs from './AITabs.vue'
import AIChatMessage from './AIChatMessage.vue'
import AIChatInput from './AIChatInput.vue'
import AIChatWelcome from './AIChatWelcome.vue'
import AIChatEmptyState from './AIChatEmptyState.vue'
import AINewsList from './AINewsList.vue'

const isOpen = ref(false)
const activeTab = ref('messages')
const messagesContainer = ref(null)
const selectedServiceId = ref(null)

const accessToken = useCookie('accessToken')

const {
  messages,
  isLoading,
  sendMessage,
  resetChat,
  createConversation,
  loadConversationHistory,
  loadConversations,
  loadPartnerServices,
  loadOrganization,
  partnerServices,
  conversationsList,
  currentConversationId
} = useAIChat()

const currentService = computed(() => {
  if (selectedServiceId.value) {
    return partnerServices.value.find(service => service.id === selectedServiceId.value)
  }

  if (currentConversationId.value && conversationsList.value.length > 0) {
    const conversation = conversationsList.value.find(item => item.id == currentConversationId.value)
    if (conversation) {
      return partnerServices.value.find(service => service.id == conversation.partner_service_id)
    }
  }

  return null
})

const getServiceIcon = (service) => {
  const source = `${service?.type || ''} ${service?.category || ''} ${service?.name || ''}`.toLowerCase()
  if (source.includes('tour') || source.includes('travel')) return '✈'
  if (source.includes('villa') || source.includes('hotel') || source.includes('room')) return '⌂'
  if (source.includes('inventory') || source.includes('product') || source.includes('shop')) return '◫'
  return 'AI'
}

const getServiceTypeLabel = (service) => {
  const type = service?.type || service?.category || 'assistant'
  return String(type).replace(/_/g, ' ')
}

const getServiceStatusLabel = (status) => {
  return status === 'active' ? t('ai_chat.available') : t('ai_chat.disabled')
}

const getServiceStatusClass = (status) => {
  return status === 'active'
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-slate-100 text-slate-500'
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}

const handleSelectService = async (serviceId) => {
  if (!serviceId) return
  selectedServiceId.value = serviceId
  isLoading.value = true
  try {
    const convId = await createConversation(serviceId)
    if (convId) {
      localStorage.setItem('current_conversation_id', convId)
      await loadConversationHistory(convId)
      scrollToBottom()
    }
  } catch (err) {
    console.error('Error createConversation:', err)
  } finally {
    isLoading.value = false
  }
}

const handleResumeConversation = async (convId) => {
  if (!convId) return
  isLoading.value = true
  try {
    localStorage.setItem('current_conversation_id', convId)
    await loadConversationHistory(convId)
    if (currentService.value) {
      selectedServiceId.value = currentService.value.id
    }
    scrollToBottom()
  } catch (err) {
    console.error('Lỗi khôi phục phòng chat:', err)
  } finally {
    isLoading.value = false
  }
}

const getBotNameById = (botId) => {
  const bot = partnerServices.value.find(b => b.id == botId)
  return bot ? bot.name : t('ai_chat.assistant_number', { id: botId })
}

const getBotIconById = (botId) => {
  const bot = partnerServices.value.find(b => b.id == botId)
  return bot ? getServiceIcon(bot) : '🤖'
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const localeCode = locale.value === 'vi' ? 'vi-VN' : 'en-US'
  return d.toLocaleTimeString(localeCode, { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString(localeCode, { day: '2-digit', month: '2-digit' })
}

const handleSendMessage = async (text) => {
  if (!text || !text.trim() || isLoading.value) return
  await sendMessage(text)
  scrollToBottom()
}

const handleAskNews = (news) => {
  activeTab.value = 'messages'
  setTimeout(() => {
    const prompt = t('ai_chat.ask_news', { title: news.title })
    handleSendMessage(prompt)
  }, 200)
}

const refreshChat = async () => {
  if (await toast.askConfirm(t('ai_chat.change_assistant'))) {
    resetChat()
    localStorage.removeItem('current_conversation_id')
    selectedServiceId.value = null
    activeTab.value = 'messages'
  }
}

const backToServices = () => {
  if (confirm(t('ai_chat.confirm_back'))) {
    resetChat()
    localStorage.removeItem('current_conversation_id')
    selectedServiceId.value = null
  }
}

watch(() => messages.value.length, scrollToBottom)

watch(() => currentConversationId.value, (value) => {
  if (!value) selectedServiceId.value = null
})

onMounted(async () => {
  await loadOrganization()
  await loadPartnerServices()
  await loadConversations()

  const savedConvId = localStorage.getItem('current_conversation_id')

  if (savedConvId) {
    const success = await loadConversationHistory(savedConvId)
    
    if (success && messages.value.length > 0) {
      if (currentService.value) {
        selectedServiceId.value = currentService.value.id
      }
      scrollToBottom()
    } else {
      localStorage.removeItem('current_conversation_id')
      resetChat()
    }
  } else {
    resetChat()
  }
})
</script>

<style scoped>
.chat-shell::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.12), transparent 28%);
}

.chat-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.72) transparent;
}

.chat-scroll::-webkit-scrollbar {
  width: 6px;
}

.chat-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.chat-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.72);
}
</style>
