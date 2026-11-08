<template>
  <div class="h-full w-full bg-white/50 dark:bg-black/40 backdrop-blur-3xl flex overflow-hidden">
    
    <!-- SIDEBAR LỊCH SỬ CHAT -->
    <div class="w-72 border-r border-slate-200 dark:border-white/10 bg-white/80 dark:bg-black/60 flex flex-col transition-colors">
      <!-- Nút New Chat -->
      <div class="p-4 border-b border-slate-100 dark:border-white/5">
        <button 
          @click="newConversation()"
          class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 dark:bg-cyan-500/10 text-white dark:text-cyan-400 border border-transparent dark:border-cyan-500/20 hover:bg-slate-800 dark:hover:bg-cyan-500/20 transition-all font-bold tracking-widest uppercase text-[10px]"
        >
          <span class="material-symbols-outlined text-[16px]">add</span>
          {{ $t('partner.workspace.new_chat') }}
        </button>
      </div>

      <!-- Danh sách Chat -->
      <div class="flex-1 overflow-y-auto chat-scroll p-3 space-y-1">
        <div v-if="isLoading && conversations.length === 0" class="text-center py-4 text-xs text-slate-400">{{ $t('partner.workspace.loading') }}</div>
        
        <div 
          v-for="conv in conversations" :key="conv.id"
          class="group relative flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border border-transparent"
          :class="activeConversationId === conv.id ? 'bg-slate-100 dark:bg-white/10 border-slate-200 dark:border-white/5' : 'hover:bg-slate-50 dark:hover:bg-white/5'"
          @click="selectConversation(conv.id)"
        >
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <span class="material-symbols-outlined text-slate-400 dark:text-white/40 text-[18px]">chat_bubble</span>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold text-slate-700 dark:text-white/80 truncate">{{ conv.title || $t('partner.workspace.default_chat_title') }}</p>
              <p class="text-[9px] text-slate-400 dark:text-white/40 mt-0.5">{{ formatDate(conv.updated_at) }}</p>
            </div>
          </div>
          <!-- Nút xóa (chỉ hiện khi hover) -->
          <button 
            @click.stop="confirmDeleteChat(conv.id)"
            class="opacity-0 group-hover:opacity-100 p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <span class="material-symbols-outlined text-[14px]">delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MAIN CHAT AREA -->
    <div class="flex-1 flex flex-col bg-slate-50/50 dark:bg-transparent relative overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.02]">
        <span class="material-symbols-outlined text-[300px]">hexagon</span>
      </div>

      <!-- Messages Stream -->
      <div class="flex-1 overflow-y-auto chat-scroll p-6 sm:p-10" ref="messagesContainer">
        <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <span class="material-symbols-outlined text-white text-3xl">auto_awesome</span>
          </div>
          <div>
            <h3 class="text-xl font-bold font-['Space_Grotesk'] text-slate-800 dark:text-white">{{ $t('partner.workspace.welcome') }}</h3>
            <p class="text-xs text-slate-500 dark:text-white/40 mt-2 uppercase tracking-[0.2em] font-bold">{{ $t('partner.workspace.subtitle') }}</p>
          </div>
          
          <!-- Bot Selection -->
          <div class="mt-8 max-w-2xl mx-auto w-full">
            <p class="text-center text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-white/40 mb-4">
              {{ $t('partner.workspace.select_bot') }}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button 
                v-for="bot in partnerServices" :key="bot.id"
                @click="switchBot(bot.id)"
                class="group relative overflow-hidden rounded-2xl border p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1"
                :class="selectedBotId === bot.id 
                  ? 'bg-slate-900 dark:bg-cyan-500/20 border-slate-900 dark:border-cyan-500/50 shadow-md ring-2 ring-slate-200 dark:ring-cyan-500/20' 
                  : 'bg-white/80 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'"
              >
                <div class="flex items-start gap-3">
                  <div 
                    class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
                    :class="selectedBotId === bot.id ? 'bg-white/20 text-white dark:text-cyan-400' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60'"
                  >
                    <span class="material-symbols-outlined text-xl">smart_toy</span>
                  </div>
                  <div class="min-w-0 flex-1 pt-0.5">
                    <p 
                      class="text-sm font-bold truncate transition-colors"
                      :class="selectedBotId === bot.id ? 'text-white' : 'text-slate-800 dark:text-white/90'"
                    >
                      {{ bot.name }}
                    </p>
                    <p 
                      class="text-[10px] mt-1 font-medium tracking-wide uppercase transition-colors"
                      :class="selectedBotId === bot.id ? 'text-white/70' : 'text-slate-500 dark:text-white/40'"
                    >
                      {{ String(bot.type || bot.category || 'Assistant').replace(/_/g, ' ') }}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="max-w-4xl mx-auto space-y-7">
          <div 
            v-for="msg in messages" :key="msg.id"
            class="flex"
            :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
          >
            <!-- User Bubble -->
            <div v-if="msg.sender === 'user'" class="flex max-w-[78%] items-start gap-3">
              <div
                class="min-w-0 rounded-2xl rounded-tr-md border border-slate-800 bg-slate-950 px-5 py-3.5 text-[14px] leading-relaxed text-white shadow-[0_14px_35px_rgba(15,23,42,0.18)] dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-white"
              >
                {{ msg.message_text }}
              </div>
              <div class="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white/70">
                <span class="material-symbols-outlined text-[17px]">person</span>
              </div>
            </div>

            <div v-else class="group flex w-full items-start gap-3 sm:gap-4">
              <div class="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-[0_12px_30px_rgba(8,47,73,0.18)] dark:from-cyan-500/20 dark:to-purple-500/20 dark:text-cyan-200">
                <span class="material-symbols-outlined text-[19px]">auto_awesome</span>
              </div>

              <article class="min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition-all dark:border-slate-700/80 dark:bg-slate-900/85">
                <header class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3 dark:border-slate-700/80 dark:bg-slate-950/25">
                  <div class="flex min-w-0 items-center gap-3">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-bold text-slate-900 dark:text-white">Orbit AI</p>
                        <span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-300">
                          {{ $t('partner.workspace.answer') }}
                        </span>
                      </div>
                      <p class="mt-0.5 text-[11px] font-medium text-slate-400 dark:text-slate-300/70">
                        {{ currentBotLabel }}
                      </p>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span
                      class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      :class="currentBotType === 'chat' ? 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-white/60' : 'bg-cyan-50 text-cyan-600 ring-1 ring-cyan-500/15 dark:bg-cyan-500/10 dark:text-cyan-300'"
                    >
                      <span class="material-symbols-outlined text-[13px]">{{ currentBotType === 'chat' ? 'forum' : 'database' }}</span>
                      {{ currentBotType === 'chat' ? 'Chat' : 'RAG' }}
                    </span>
                  </div>
                </header>

                <div
                  class="markdown-body ai-answer min-w-0 px-5 py-4 text-[14px] leading-7 text-slate-700 dark:text-slate-100"
                  v-html="renderMarkdown(msg.message_text)"
                ></div>
              </article>
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div v-if="isGenerating" class="flex w-full items-start gap-3 sm:gap-4">
            <div class="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-950 to-slate-800 text-white dark:from-cyan-500/20 dark:to-purple-500/20 dark:text-cyan-200">
              <span class="material-symbols-outlined text-[19px]">auto_awesome</span>
            </div>
            <div class="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.045]">
              <div class="mb-4 flex items-center gap-2">
                <span class="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_14px_rgba(6,182,212,0.8)]"></span>
                <span class="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-white/40">{{ $t('partner.workspace.thinking') }}</span>
              </div>
              <div class="space-y-2.5">
                <div class="h-3 w-11/12 animate-pulse rounded-full bg-slate-100 dark:bg-white/10"></div>
                <div class="h-3 w-9/12 animate-pulse rounded-full bg-slate-100 dark:bg-white/10"></div>
                <div class="h-3 w-6/12 animate-pulse rounded-full bg-slate-100 dark:bg-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CHAT INPUT BAR -->
      <div class="p-6 pt-2 bg-gradient-to-t from-slate-50 dark:from-[#09090B] to-transparent">
        <div class="max-w-4xl mx-auto flex flex-col gap-3">
          
          <!-- AI Type Switcher Dropdown -->
          <div class="relative" v-if="partnerServices.length > 0">
            <!-- Dropdown Button -->
            <button 
              @click="isBotDropdownOpen = !isBotDropdownOpen"
              class="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <span class="material-symbols-outlined text-[16px] text-slate-400">add</span>
              {{ partnerServices.find(b => b.id === selectedBotId)?.ai_service?.name || partnerServices.find(b => b.id === selectedBotId)?.name || $t('partner.workspace.select_model') }}
              <span class="material-symbols-outlined text-[16px] text-slate-400">keyboard_arrow_up</span>
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="isBotDropdownOpen"
              class="absolute bottom-full left-0 mb-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2"
            >
              <div class="px-4 py-2.5 text-[11px] font-medium text-slate-400 dark:text-white/40 border-b border-slate-100 dark:border-white/5 uppercase tracking-wider">
                {{ $t('partner.workspace.model') }}
              </div>
              <div class="max-h-60 overflow-y-auto chat-scroll p-1.5 space-y-0.5">
                <button 
                  v-for="bot in uniqueAiServices" :key="bot.id"
                  @click="switchBot(bot.id)"
                  class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors"
                  :class="selectedBotId === bot.id 
                    ? 'bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-inset ring-blue-500/20' 
                    : 'text-slate-600 dark:text-white/80 hover:bg-slate-50 dark:hover:bg-white/5'"
                >
                  <div class="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    <span v-if="selectedBotId === bot.id" class="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] flex-shrink-0"></span>
                    <span v-else class="w-1.5 h-1.5 rounded-full border border-slate-300 dark:border-white/20 flex-shrink-0"></span>
                    <div class="truncate">
                      <p class="text-[13px] font-semibold truncate">{{ bot.ai_service?.name || bot.name }}</p>
                    </div>
                  </div>
                  <!-- Type badge -->
                  <span class="px-2 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-wider flex-shrink-0"
                    :class="getBotType(bot) === 'chat' ? 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/60' : 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'">
                    {{ getBotType(bot) === 'chat' ? 'Chat' : 'RAG' }}
                  </span>
                </button>
              </div>
            </div>
            
            <!-- Overlay to close dropdown -->
            <div 
              v-if="isBotDropdownOpen" 
              @click="isBotDropdownOpen = false" 
              class="fixed inset-0 z-40"
            ></div>
          </div>

          <div class="relative group">
            <textarea 
              v-model="inputText"
              @keydown.enter.prevent="handleSend"
              :placeholder="$t('partner.workspace.input_placeholder')"
              rows="1"
              class="w-full bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 shadow-lg resize-none chat-scroll transition-all group-hover:border-slate-300 dark:group-hover:border-white/20"
              style="min-height: 54px; max-height: 150px;"
              @input="adjustTextareaHeight"
              ref="textareaRef"
            ></textarea>
            
            <button 
              @click="handleSend"
              :disabled="!inputText.trim() || isGenerating"
              class="absolute right-2 bottom-2 w-10 h-10 rounded-xl bg-slate-900 dark:bg-cyan-500/20 text-white dark:text-cyan-400 flex items-center justify-center disabled:opacity-50 transition-all hover:bg-slate-800 dark:hover:bg-cyan-500/40"
            >
              <span class="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
          
          <p class="text-center text-[10px] text-slate-400 dark:text-white/30 mt-1 font-bold uppercase tracking-widest">
            {{ $t('partner.workspace.ai_disclaimer') }}
          </p>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-rose-500 text-2xl">delete_forever</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{ $t('partner.workspace.delete_chat_title') }}</h3>
            <p class="text-sm text-slate-500 dark:text-white/60 mt-0.5">{{ $t('partner.workspace.delete_chat_desc') }}</p>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 mt-6">
          <button 
            @click="cancelDelete"
            class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all"
          >
            {{ $t('partner.workspace.cancel') }}
          </button>
          <button 
            @click="executeDelete"
            class="px-5 py-2.5 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-lg shadow-rose-500/25 transition-all"
          >
            {{ $t('partner.workspace.delete') }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { marked } from 'marked'
import { useWorkspaceChat } from '~/composables/useWorkspaceChat'

const props = defineProps({
  organizationId: {
    type: String,
    default: ''
  }
})

const {
  conversations,
  messages,
  partnerServices,
  activeConversationId,
  selectedBotId,
  isLoading,
  isGenerating,
  fetchConversations,
  fetchPartnerServices,
  selectConversation,
  newConversation,
  sendMessage,
  deleteChat
} = useWorkspaceChat(computed(() => props.organizationId))

const inputText = ref('')
const messagesContainer = ref(null)
const textareaRef = ref(null)

const isBotDropdownOpen = ref(false)

const switchBot = (botId) => {
  if (Number(selectedBotId.value) !== Number(botId) || activeConversationId.value) {
    newConversation(botId)
  } else {
    selectedBotId.value = botId
  }
  isBotDropdownOpen.value = false
}

// Phân biệt loại bot
const getBotType = (bot) => {
  if (bot.ai_service && bot.ai_service.category) {
    return bot.ai_service.category.type === 'chat' ? 'chat' : 'rag'
  }
  return bot.type === 'chat' ? 'chat' : 'rag'
}

// Mỗi chatbot có kho tri thức riêng, vì vậy không gộp các bot cùng loại AI.
const uniqueAiServices = computed(() => {
  return partnerServices.value
})

const currentBot = computed(() => {
  return partnerServices.value.find(bot => bot.id === selectedBotId.value) || null
})

const currentBotType = computed(() => {
  return currentBot.value ? getBotType(currentBot.value) : 'chat'
})

const currentBotLabel = computed(() => {
  if (!currentBot.value) return 'Assistant'
  return currentBot.value.ai_service?.name || currentBot.value.name || 'Assistant'
})

const isDeleteModalOpen = ref(false)
const conversationToDelete = ref(null)

const confirmDeleteChat = (id) => {
  conversationToDelete.value = id
  isDeleteModalOpen.value = true
}

const cancelDelete = () => {
  isDeleteModalOpen.value = false
  conversationToDelete.value = null
}

const executeDelete = async () => {
  if (conversationToDelete.value) {
    await deleteChat(conversationToDelete.value)
    isDeleteModalOpen.value = false
    conversationToDelete.value = null
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} - ${d.getDate()}/${d.getMonth()+1}`
}

const renderMarkdown = (text) => {
  if (!text) return ''
  return marked(text, { breaks: true })
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(messages, scrollToBottom, { deep: true })
watch(isGenerating, scrollToBottom)

const handleSend = async () => {
  const text = inputText.value
  if (!text.trim() || isGenerating.value) return
  
  inputText.value = ''
  adjustTextareaHeight()
  
  // Truyền ID bot đã chọn từ switcher
  await sendMessage(text, selectedBotId.value) 
}

const autoSend = (text) => {
  inputText.value = text
  handleSend()
}

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = (textareaRef.value.scrollHeight) + 'px'
  }
}

onMounted(() => {
  fetchConversations()
  fetchPartnerServices()
})
</script>

<style scoped>
.chat-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.4) transparent;
}
.chat-scroll::-webkit-scrollbar {
  width: 4px;
}
.chat-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.chat-scroll::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(148, 163, 184, 0.4);
}

/* Markdown Styles */
:deep(.markdown-body p) { margin-bottom: 0.7rem; }
:deep(.markdown-body p:last-child) { margin-bottom: 0; }
:deep(.markdown-body a) {
  color: rgb(37 99 235);
  font-weight: 700;
  text-decoration: none;
}
:deep(.markdown-body a:hover) {
  text-decoration: underline;
}
:global(.dark) :deep(.markdown-body),
:global(.dark) :deep(.markdown-body p),
:global(.dark) :deep(.markdown-body li),
:global(.dark) :deep(.markdown-body span) {
  color: rgb(226 232 240 / 0.94);
}
:global(.dark) :deep(.markdown-body a) {
  color: rgb(103 232 249);
}
:deep(.markdown-body hr) {
  margin: 1rem 0;
  border: 0;
  border-top: 1px solid rgb(203 213 225);
}
:global(.dark) :deep(.markdown-body hr) {
  border-top-color: rgb(148 163 184 / 0.35);
}
:deep(.markdown-body strong) { font-weight: 750; color: rgb(15 23 42); }
:global(.dark) :deep(.markdown-body strong) { color: rgb(255 255 255 / 0.98); }
:deep(.markdown-body em) { color: inherit; }
:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  margin: 1rem 0 0.5rem;
  font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
  font-weight: 800;
  line-height: 1.2;
  color: rgb(15 23 42);
}
:global(.dark) :deep(.markdown-body h1),
:global(.dark) :deep(.markdown-body h2),
:global(.dark) :deep(.markdown-body h3) {
  color: rgb(248 250 252);
}
:deep(.markdown-body h1) { font-size: 1.2rem; }
:deep(.markdown-body h2) { font-size: 1.08rem; }
:deep(.markdown-body h3) { font-size: 0.98rem; }
:deep(.markdown-body ul) { list-style-type: disc; padding-left: 1.35rem; margin: 0.6rem 0 0.75rem; }
:deep(.markdown-body ol) { list-style-type: decimal; padding-left: 1.35rem; margin: 0.6rem 0 0.75rem; }
:deep(.markdown-body li) { margin-bottom: 0.35rem; padding-left: 0.1rem; }
:deep(.markdown-body blockquote) {
  margin: 0.8rem 0;
  border-left: 3px solid rgb(6 182 212 / 0.55);
  padding: 0.55rem 0.8rem;
  border-radius: 0 0.75rem 0.75rem 0;
  background: rgb(6 182 212 / 0.06);
  color: rgb(51 65 85);
}
:global(.dark) :deep(.markdown-body blockquote) {
  background: rgb(6 182 212 / 0.10);
  color: rgb(226 232 240 / 0.92);
}
:deep(.markdown-body code) { 
  background-color: rgba(15, 23, 42, 0.08); 
  padding: 0.15rem 0.38rem; 
  border-radius: 6px; 
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; 
  font-size: 0.88em;
  word-break: break-word;
}
:deep(.markdown-body pre) {
  background-color: rgb(15 23 42);
  color: rgb(226 232 240);
  padding: 1rem;
  border-radius: 12px;
  overflow-x: auto;
  margin: 0.8rem 0;
  max-width: 100%;
  border: 1px solid rgb(255 255 255 / 0.08);
}
:deep(.markdown-body pre::-webkit-scrollbar) {
  height: 6px;
}
:deep(.markdown-body pre::-webkit-scrollbar-track) {
  background: transparent;
}
:deep(.markdown-body pre::-webkit-scrollbar-thumb) {
  border-radius: 10px;
  background: rgba(148, 163, 184, 0.4);
}
:deep(.markdown-body pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
  white-space: pre;
}
:deep(.markdown-body table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0.85rem 0;
  overflow: hidden;
  border-radius: 12px;
  font-size: 0.92em;
}
:deep(.markdown-body th),
:deep(.markdown-body td) {
  border: 1px solid rgb(226 232 240);
  padding: 0.55rem 0.7rem;
  text-align: left;
}
:deep(.markdown-body th) {
  background: rgb(248 250 252);
  font-weight: 800;
  color: rgb(51 65 85);
}
:global(.dark) :deep(.markdown-body th),
:global(.dark) :deep(.markdown-body td) {
  border-color: rgb(255 255 255 / 0.1);
}
:global(.dark) :deep(.markdown-body th) {
  background: rgb(255 255 255 / 0.06);
  color: rgb(255 255 255 / 0.86);
}
:global(.dark) :deep(.markdown-body code) {
  background-color: rgb(148 163 184 / 0.16);
  color: rgb(226 232 240);
}
:global(.dark) :deep(.markdown-body pre) {
  background-color: rgb(2 6 23 / 0.85);
}
</style>

<style>
.dark .ai-answer,
.dark .ai-answer p,
.dark .ai-answer li,
.dark .ai-answer span,
.dark .ai-answer div {
  color: rgb(226 232 240 / 0.96) !important;
}

.dark .ai-answer h1,
.dark .ai-answer h2,
.dark .ai-answer h3,
.dark .ai-answer h4,
.dark .ai-answer strong {
  color: rgb(248 250 252) !important;
}

.dark .ai-answer a {
  color: rgb(103 232 249) !important;
  font-weight: 700;
  text-decoration-color: rgb(103 232 249 / 0.55);
}

.dark .ai-answer hr {
  border-color: rgb(148 163 184 / 0.45) !important;
}

.dark .ai-answer code {
  color: rgb(241 245 249) !important;
  background: rgb(148 163 184 / 0.18) !important;
}

.dark .ai-answer pre {
  background: rgb(2 6 23 / 0.92) !important;
  border-color: rgb(148 163 184 / 0.22) !important;
}

.dark .ai-answer pre,
.dark .ai-answer pre *,
.dark .ai-answer pre code {
  color: rgb(226 232 240) !important;
}

.dark .ai-answer blockquote {
  color: rgb(226 232 240 / 0.94) !important;
  background: rgb(8 145 178 / 0.13) !important;
  border-left-color: rgb(34 211 238 / 0.7) !important;
}
</style>
