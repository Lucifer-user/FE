<template>
  <section class="space-y-8" :class="{ 'pointer-events-none opacity-50': !botId }">
    
    <!-- Premium Drag and Drop Zone (Full Width) -->
    <div class="glass-card rounded-3xl p-1 relative overflow-hidden group transition-all"
             :class="{ 'ring-2 ring-cyan-500 ring-offset-2 dark:ring-offset-[#111]': isDragging }">
          <div class="bg-slate-50/50 dark:bg-[#0e0e0e]/30 rounded-[22px] h-full p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-500/[0.02] dark:hover:bg-cyan-400/[0.01] transition-all duration-300 cursor-pointer relative"
               @dragover.prevent="isDragging = true"
               @dragleave.prevent="isDragging = false"
               @drop.prevent="handleDrop"
               @click="fileInput?.click()">
            
            <!-- decorative ambient glow -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/10 transition-colors duration-700"></div>
            
            <div class="w-16 h-16 rounded-full bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-md dark:shadow-none">
              <span class="material-symbols-outlined text-3xl text-slate-400 dark:text-white/40 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">cloud_upload</span>
            </div>
            
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1 font-['Space_Grotesk']">{{ $t('partner.data_ingestion.drag_drop') }}</h3>
            <p class="text-[11px] text-slate-500 dark:text-white/40 mb-6 text-center max-w-md leading-relaxed">
              {{ supportedFormatsText }}
            </p>
            
            <button type="button" class="luminous-btn text-white dark:text-black font-semibold text-[11px] px-6 py-2.5 rounded-full flex items-center space-x-2 shadow-lg hover:shadow-cyan-500/20 pointer-events-none">
              <span class="material-symbols-outlined text-sm">folder_open</span>
              <span>{{ uploading ? $t('partner.data_ingestion.indexing_v2') : $t('partner.data_ingestion.browse_files') }}</span>
            </button>
          </div>
        </div>

    <!-- V2 document index (Full Width) -->
    <div class="min-w-0 space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ $t('partner.data_ingestion.v2_documents') }}</h2>
            <p class="mt-1 text-xs text-slate-500 dark:text-white/45">
              {{ botName || $t('partner.data_ingestion.select_bot_fallback') }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:border-cyan-400 hover:text-cyan-600 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
              :title="$t('partner.data_ingestion.refresh_v2')"
              :disabled="loadingDocuments"
              @click="fetchDocuments"
            >
              <ArrowPathIcon class="size-4" :class="{ 'animate-spin': loadingDocuments }" />
            </button>
            <input ref="fileInput" class="hidden" type="file" multiple accept=".txt,.pdf,.docx,.xlsx,.xls" @change="handleFiles" />
          </div>
        </div>

        <div v-if="uploadProgress.length" class="space-y-2 border-y border-slate-200 py-3 dark:border-white/10">
          <div v-for="item in uploadProgress" :key="item.id" class="space-y-1.5 text-xs">
            <div class="flex items-center justify-between gap-4">
              <span class="min-w-0 truncate font-medium text-slate-700 dark:text-white/75">{{ item.name }}</span>
              <span :class="item.status === 'failed' ? 'text-rose-600' : item.status === 'ready' ? 'text-emerald-600' : 'text-cyan-600'">
                {{ statusLabel(item.status) }}
              </span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="item.status === 'failed' ? 'bg-rose-500' : item.status === 'ready' ? 'bg-emerald-500' : 'bg-cyan-500'"
                :style="{ width: `${item.progress || 0}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]">
          <div v-if="loadingDocuments" class="flex min-h-44 items-center justify-center text-sm text-slate-400">
            <ArrowPathIcon class="mr-2 size-4 animate-spin" />
            {{ $t('partner.data_ingestion.loading_v2') }}
          </div>

          <div v-else-if="documents.length === 0" class="flex min-h-44 flex-col items-center justify-center px-6 text-center">
            <CircleStackIcon class="mb-3 size-8 text-slate-300 dark:text-white/20" />
            <p class="text-sm font-semibold text-slate-700 dark:text-white/70">{{ $t('partner.data_ingestion.no_v2_documents') }}</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[680px] text-left">
              <thead class="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/35">
                <tr>
                  <th class="px-4 py-3">{{ $t('partner.data_ingestion.dataset_name') }}</th>
                  <th class="px-4 py-3">{{ $t('partner.data_ingestion.v2_chunks') }}</th>
                  <th class="px-4 py-3">{{ $t('partner.data_ingestion.v2_model') }}</th>
                  <th class="px-4 py-3">{{ $t('partner.data_ingestion.status') }}</th>
                  <th class="px-4 py-3">{{ $t('partner.data_ingestion.v2_updated') }}</th>
                  <th class="w-16 px-4 py-3 text-right">{{ $t('partner.data_ingestion.v2_actions') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs dark:divide-white/5">
                <tr v-for="document in documents" :key="document.id" class="text-slate-600 dark:text-white/65">
                  <td class="max-w-[260px] px-4 py-4">
                    <div class="flex items-center gap-3">
                      <DocumentTextIcon class="size-5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                      <span class="truncate font-semibold text-slate-900 dark:text-white">{{ document.source_file }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-4 tabular-nums">{{ formatNumber(document.chunk_count) }}</td>
                  <td class="px-4 py-4">
                    <span class="font-mono text-[11px]">{{ document.embedding_model }}</span>
                    <span class="block text-[10px] text-slate-400">{{ document.embedding_dimensions }}D</span>
                  </td>
                  <td class="px-4 py-4">
                    <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <span class="size-1.5 rounded-full bg-emerald-500"></span>
                      {{ $t(`partner.data_ingestion.v2_status_${document.status}`) }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-4 py-4">{{ formatDate(document.updated_at) }}</td>
                  <td class="px-4 py-4 text-right">
                    <button
                      type="button"
                      class="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 dark:hover:bg-rose-500/10"
                      :title="$t('partner.data_ingestion.delete_v2')"
                      :disabled="deletingId === document.id"
                      @click="deleteDocument(document)"
                    >
                      <ArrowPathIcon v-if="deletingId === document.id" class="size-4 animate-spin" />
                      <TrashIcon v-else class="size-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ $t('partner.data_ingestion.retrieval_test') }}</h2>
            <p class="mt-1 text-xs text-slate-500 dark:text-white/45">{{ $t('partner.data_ingestion.retrieval_result_count', { count: searchResults.length }) }}</p>
          </div>
          <CpuChipIcon class="size-6 text-violet-500" />
        </div>

        <form class="flex gap-2" @submit.prevent="searchKnowledge">
          <input
            v-model.trim="searchQuery"
            type="text"
            class="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
            :placeholder="$t('partner.data_ingestion.retrieval_placeholder')"
            maxlength="2000"
          />
          <button
            type="submit"
            class="inline-flex size-11 shrink-0 items-center justify-center rounded-lg bg-cyan-600 text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            :title="$t('partner.data_ingestion.run_retrieval')"
            :disabled="searching || !botId || searchQuery.length < 2"
          >
            <ArrowPathIcon v-if="searching" class="size-5 animate-spin" />
            <MagnifyingGlassIcon v-else class="size-5" />
          </button>
        </form>

        <div v-if="searchError" class="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
          {{ searchError }}
        </div>

        <div v-if="!searching && searchResults.length === 0" class="flex min-h-64 flex-col items-center justify-center text-center text-slate-400 dark:text-white/30">
          <MagnifyingGlassIcon class="mb-3 size-8" />
          <p class="text-xs font-medium">{{ $t('partner.data_ingestion.no_retrieval_results') }}</p>
        </div>

        <div v-else class="mt-5 space-y-4">
          <div class="flex rounded-lg bg-slate-100 p-1 dark:bg-white/5">
            <button
              type="button"
              class="flex-1 rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors"
              :class="resultView === 'context' ? 'bg-white text-cyan-700 shadow-sm dark:bg-white/10 dark:text-cyan-300' : 'text-slate-500 dark:text-white/45'"
              @click="resultView = 'context'"
            >
              {{ $t('partner.data_ingestion.context_preview') }}
            </button>
            <button
              type="button"
              class="flex-1 rounded-md px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors"
              :class="resultView === 'chunks' ? 'bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white' : 'text-slate-500 dark:text-white/45'"
              @click="resultView = 'chunks'"
            >
              {{ $t('partner.data_ingestion.raw_chunks') }}
            </button>
          </div>

          <div v-if="resultView === 'context' && searchContext" class="space-y-3">
            <div class="grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-3 text-center dark:divide-white/10 dark:border-white/10">
              <div>
                <span class="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{{ $t('partner.data_ingestion.context_sources') }}</span>
                <span class="text-sm font-bold text-slate-800 dark:text-white">{{ formatNumber(searchContext.sources?.length) }}</span>
              </div>
              <div>
                <span class="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{{ $t('partner.data_ingestion.context_tokens') }}</span>
                <span class="text-sm font-bold text-slate-800 dark:text-white">{{ formatNumber(searchContext.estimated_tokens) }}</span>
              </div>
              <div>
                <span class="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{{ $t('partner.data_ingestion.context_included_chunks') }}</span>
                <span class="text-sm font-bold text-slate-800 dark:text-white">{{ formatNumber(searchContext.included_chunk_count) }}</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold">
              <span :class="searchContext.truncated ? 'text-amber-600 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-300'">
                {{ searchContext.truncated ? $t('partner.data_ingestion.context_truncated') : $t('partner.data_ingestion.context_complete') }}
              </span>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-cyan-700 dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-cyan-300"
                @click="copyContext"
              >
                <CheckCircleIcon v-if="contextCopied" class="size-4 text-emerald-500" />
                <ClipboardDocumentIcon v-else class="size-4" />
                {{ contextCopied ? $t('partner.data_ingestion.context_copied') : $t('partner.data_ingestion.copy_context') }}
              </button>
            </div>

            <pre class="max-h-[540px] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-950 p-4 font-mono text-[11px] leading-6 text-slate-200 dark:bg-black/40">{{ searchContext.context }}</pre>
          </div>

          <div v-else class="max-h-[620px] space-y-3 overflow-y-auto pr-1">
            <article v-for="(result, index) in searchResults" :key="result.id" class="rounded-lg border border-slate-200 p-4 dark:border-white/10">
            <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div class="flex min-w-0 items-center gap-2">
                <span class="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold text-white dark:bg-white dark:text-slate-900">{{ index + 1 }}</span>
                <span class="truncate text-xs font-semibold text-slate-800 dark:text-white/80">{{ result.source_file }}</span>
              </div>
              <span class="text-sm font-bold tabular-nums text-cyan-700 dark:text-cyan-300">{{ formatScore(result.hybrid_score) }}</span>
            </div>

            <p class="whitespace-pre-wrap break-words text-xs leading-6 text-slate-600 dark:text-white/65">{{ result.content }}</p>

            <div class="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center dark:border-white/5">
              <div>
                <span class="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Vector</span>
                <span class="text-[11px] font-semibold text-slate-700 dark:text-white/70">{{ formatScore(result.score_breakdown?.vector_similarity) }}</span>
              </div>
              <div>
                <span class="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{{ $t('partner.data_ingestion.lexical_score') }}</span>
                <span class="text-[11px] font-semibold text-slate-700 dark:text-white/70">{{ formatScore(result.score_breakdown?.lexical_normalized) }}</span>
              </div>
              <div>
                <span class="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{{ $t('partner.data_ingestion.overlap_score') }}</span>
                <span class="text-[11px] font-semibold text-slate-700 dark:text-white/70">{{ formatScore(result.score_breakdown?.term_overlap) }}</span>
              </div>
            </div>
            </article>
          </div>
        </div>
      </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import {
  ArrowPathIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  CircleStackIcon,
  ClipboardDocumentIcon,
  CpuChipIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  organizationId: { type: String, default: '' },
  botId: { type: [String, Number], default: '' },
  botName: { type: String, default: '' }
})

const config = useRuntimeConfig()
const token = useCookie('accessToken')
const { t, locale } = useI18n()
const toast = useToast()

const fileInput = ref(null)
const isDragging = ref(false)
const documents = ref([])
const loadingDocuments = ref(false)
const uploading = ref(false)
const uploadProgress = ref([])
const deletingId = ref(null)
const searchQuery = ref('')
const searching = ref(false)
const searchResults = ref([])
const searchContext = ref(null)
const searchError = ref('')
const resultView = ref('context')
const contextCopied = ref(false)
const uploadChunkSize = 5 * 1024 * 1024
const uploadPollIntervalMs = 2000
const uploadPollLimit = 450

const headers = () => ({
  Authorization: `Bearer ${token.value}`,
  Accept: 'application/json',
  ...(props.organizationId ? { 'X-Organization-Id': props.organizationId } : {})
})

const errorMessage = (error) => {
  const msg = error?.data?.message || error?.response?._data?.message || error?.message
  if (!msg) return t('partner.data_ingestion.v2_unknown_error')
  
  const key = `partner.data_ingestion.${msg}`
  const translated = t(key)
  if (translated !== key) return translated
  
  return msg
}
const wait = (ms) => new Promise(resolve => window.setTimeout(resolve, ms))
const supportedFormatsText = computed(() => locale.value === 'vi'
  ? 'Ho tro .txt, .pdf, .docx, .xlsx va .xls. File lon se duoc tai len theo tung phan va xu ly nen.'
  : 'Supports .txt, .pdf, .docx, .xlsx, and .xls. Large files upload in chunks and are processed in the background.')
const fallbackStatusLabels = {
  vi: {
    uploading: 'Dang tai len',
    queued: 'Dang cho xu ly',
    processing: 'Dang xu ly',
    indexing: 'Dang xu ly',
    ready: 'San sang',
    failed: 'That bai'
  },
  en: {
    uploading: 'Uploading',
    queued: 'Queued',
    processing: 'Processing',
    indexing: 'Indexing',
    ready: 'Ready',
    failed: 'Failed'
  }
}
const statusLabel = (status) => {
  const key = `partner.data_ingestion.v2_status_${status || 'indexing'}`
  const translated = t(key)
  if (translated !== key) return translated
  const labels = fallbackStatusLabels[locale.value] || fallbackStatusLabels.en
  return labels[status] || labels.indexing
}

const fetchDocuments = async () => {
  if (!props.botId) {
    documents.value = []
    return
  }

  loadingDocuments.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/partner/knowledge/v2/documents`, {
      headers: headers(),
      params: { partner_service_id: props.botId }
    })
    documents.value = response?.data || []
  } catch (error) {
    documents.value = []
    toast.error(errorMessage(error))
  } finally {
    loadingDocuments.value = false
  }
}

const handleFiles = async (event) => {
  const files = Array.from(event.target?.files || event.dataTransfer?.files || [])
  if (event.target?.value) event.target.value = ''
  if (!files.length || !props.botId) return

  uploading.value = true
  for (const file of files) {
    const item = { id: `${Date.now()}-${file.name}`, name: file.name, status: 'uploading', progress: 0 }
    uploadProgress.value.unshift(item)

    try {
      const totalChunks = Math.max(1, Math.ceil(file.size / uploadChunkSize))
      const extension = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : ''
      const initResponse = await $fetch(`${config.public.apiBase}/partner/knowledge/v2/uploads`, {
        method: 'POST',
        headers: headers(),
        body: {
          partner_service_id: String(props.botId),
          original_name: file.name,
          mime_type: file.type || '',
          extension,
          total_size: file.size,
          chunk_size: uploadChunkSize,
          total_chunks: totalChunks
        }
      })

      const uploadId = initResponse?.data?.id
      if (!uploadId) throw new Error(t('partner.data_ingestion.v2_unknown_error'))

      for (let index = 0; index < totalChunks; index += 1) {
        const start = index * uploadChunkSize
        const chunk = file.slice(start, Math.min(file.size, start + uploadChunkSize))
        const body = new FormData()
        body.append('chunk_index', String(index))
        body.append('chunk', chunk, `${file.name}.part${index}`)

        await $fetch(`${config.public.apiBase}/partner/knowledge/v2/uploads/${uploadId}/chunks`, {
          method: 'POST',
          headers: headers(),
          body
        })

        item.progress = Math.floor(((index + 1) / totalChunks) * 85)
      }

      const completeResponse = await $fetch(`${config.public.apiBase}/partner/knowledge/v2/uploads/${uploadId}/complete`, {
        method: 'POST',
        headers: headers()
      })

      item.status = completeResponse?.data?.status || 'queued'
      item.progress = completeResponse?.data?.progress || Math.max(item.progress, 90)
      await pollUploadStatus(item, uploadId)
      item.status = 'ready'
      item.progress = 100
      toast.success(t('partner.data_ingestion.v2_upload_success', { name: file.name }))
    } catch (error) {
      item.status = 'failed'
      item.progress = 100
      toast.error(errorMessage(error))
    }
  }

  uploading.value = false
  await fetchDocuments()
}

const pollUploadStatus = async (item, uploadId) => {
  for (let attempt = 0; attempt < uploadPollLimit; attempt += 1) {
    const response = await $fetch(`${config.public.apiBase}/partner/knowledge/v2/uploads/${uploadId}`, {
      headers: headers()
    })

    const session = response?.data || {}
    item.status = session.status || item.status
    item.progress = session.progress ?? item.progress

    if (session.status === 'ready') return
    if (session.status === 'failed') {
      throw new Error(session.error_message || t('partner.data_ingestion.v2_unknown_error'))
    }

    await wait(uploadPollIntervalMs)
  }

  throw new Error('error_upload_timeout')
}

const handleDrop = (event) => {
  isDragging.value = false
  handleFiles(event)
}

const deleteDocument = async (document) => {
  const ok = await toast.askConfirm(t('partner.data_ingestion.confirm_delete_v2', { name: document.source_file }))
  if (!ok) return

  deletingId.value = document.id
  try {
    await $fetch(`${config.public.apiBase}/partner/knowledge/v2/documents/${document.id}`, {
      method: 'DELETE',
      headers: headers(),
      params: { partner_service_id: props.botId }
    })
    toast.success(t('partner.data_ingestion.v2_delete_success'))
    await fetchDocuments()
  } catch (error) {
    toast.error(errorMessage(error))
  } finally {
    deletingId.value = null
  }
}

const searchKnowledge = async () => {
  if (!props.botId || searchQuery.value.length < 2) return

  searching.value = true
  searchError.value = ''
  searchResults.value = []
  searchContext.value = null
  contextCopied.value = false
  try {
    const response = await $fetch(`${config.public.apiBase}/partner/knowledge/v2/search-preview`, {
      method: 'POST',
      headers: headers(),
      body: {
        partner_service_id: props.botId,
        query: searchQuery.value,
        limit: 8
      }
    })
    searchResults.value = response?.data?.results || []
    searchContext.value = response?.data?.context || null
    resultView.value = 'context'
  } catch (error) {
    searchError.value = errorMessage(error)
  } finally {
    searching.value = false
  }
}

const copyContext = async () => {
  if (!searchContext.value?.context) return
  await navigator.clipboard.writeText(searchContext.value.context)
  contextCopied.value = true
  window.setTimeout(() => { contextCopied.value = false }, 1800)
}

const formatDate = (value) => value
  ? new Intl.DateTimeFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
  : '—'

const formatNumber = (value) => new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(Number(value || 0))
const formatScore = (value) => `${(Number(value || 0) * 100).toFixed(1)}%`

watch(
  () => [props.organizationId, props.botId],
  async () => {
    documents.value = []
    uploadProgress.value = []
    searchResults.value = []
    searchContext.value = null
    searchError.value = ''
    searchQuery.value = ''
    resultView.value = 'context'
    contextCopied.value = false
    await fetchDocuments()
  },
  { immediate: true }
)
</script>

<style scoped>
.luminous-btn {
  background: linear-gradient(90deg, #00f0ff, #7701d0);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
}

.luminous-btn:hover {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.4);
}
</style>
