<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-[#e1e2ec] font-inter selection:bg-[#adc6ff]/30 relative overflow-hidden transition-colors duration-500">
    <div
      class="absolute top-0 left-1/4 w-1/2 h-96 bg-indigo-500/5 dark:bg-[#adc6ff]/5 rounded-full blur-[100px] pointer-events-none">
    </div>
    <div
      class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-[#ffb3ad]/5 rounded-full blur-[150px] pointer-events-none">
    </div>

    <div class="max-w-7xl mx-auto px-6 py-10 relative z-10">
      <header
        class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-slate-200 dark:border-[#272a31] pb-8 transition-colors">
        <div>
          <h1
            class="font-display-lg text-[30px] font-bold tracking-tight text-slate-900 dark:text-[#e1e2ec] mb-2 transition-colors">
            {{ $t('admin.services.title') }}</h1>
          <p class="text-[14px] text-slate-500 dark:text-[#8c909f] max-w-2xl transition-colors">{{ $t('admin.services.subtitle') }}</p>
        </div>
        <div class="flex gap-3">
          <button @click="openCatalogModal"
            class="bg-emerald-600 dark:bg-emerald-400 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white dark:text-[#002e6a] font-bold text-[11px] uppercase tracking-[0.15em] px-6 py-3 rounded-md flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95">
            <span class="material-symbols-outlined text-[18px]">add</span>
            {{ $t('admin.services.create_category') }}
          </button>

          <button @click="openModal('create')"
            class="bg-indigo-600 dark:bg-[#adc6ff] hover:bg-indigo-700 dark:hover:bg-[#4d8eff] text-white dark:text-[#002e6a] font-bold text-[11px] uppercase tracking-[0.15em] px-6 py-3 rounded-md flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] dark:shadow-[0_0_20px_rgba(173,198,255,0.2)] active:scale-95">
            <span class="material-symbols-outlined text-[18px]">add</span>
            {{ $t('admin.services.setup_service') }}
          </button>
        </div>
      </header>

      <!-- Search & Filter Controls -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div class="relative w-full md:w-80">
          <span
            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8c909f] text-[18px]">search</span>
          <input v-model="searchQuery" type="text" :placeholder="$t('admin.services.search')"
            class="w-full bg-white dark:bg-black/50 border border-slate-200 dark:border-[#424754] rounded-lg py-2.5 pl-10 pr-4 text-[13px] text-slate-900 dark:text-[#e1e2ec] placeholder:text-slate-400 dark:placeholder:text-[#8c909f] focus:outline-none focus:border-indigo-500 dark:focus:border-[#adc6ff] focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#adc6ff] transition-all" />
        </div>
        <div class="flex gap-3">
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-black/50 border border-slate-200 dark:border-[#424754] rounded-lg text-slate-900 dark:text-[#e1e2ec] hover:bg-slate-50 dark:hover:bg-[#272a31] transition-all text-[12px] font-medium shadow-sm transition-colors">
            <span class="material-symbols-outlined text-[18px]">filter_list</span>
            {{ $t('admin.services.filter') }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-32 text-center">
        <div
          class="w-12 h-12 border-4 border-indigo-600 dark:border-[#adc6ff] border-t-transparent rounded-full animate-spin mx-auto mb-6">
        </div>
        <p
          class="text-indigo-600 dark:text-[#adc6ff] font-bold uppercase text-[12px] tracking-[0.2em] animate-pulse transition-colors">
          {{ $t('admin.services.loading') }}</p>
      </div>

      <!-- Catalog Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="item in services" :key="item.id"
          class="bg-white dark:bg-[#191b23]/60 backdrop-blur-md border border-slate-200 dark:border-[#272a31] rounded-xl p-6 flex flex-col relative group overflow-hidden transition-all hover:bg-slate-50/50 dark:hover:bg-[#191b23]/80 hover:border-indigo-200 dark:hover:border-[#424754] shadow-xl hover:shadow-2xl hover:-translate-y-1 duration-300"
          :class="{ 'opacity-40 grayscale-[0.5]': item.active === false || item.active === 0 || item.active === '0' }">
          <div
            class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500 dark:from-[#adc6ff] dark:to-[#4edea3] opacity-50 group-hover:opacity-100 transition-opacity">
          </div>

          <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-[#adc6ff]/10 border border-indigo-100 dark:border-[#adc6ff]/20 flex items-center justify-center text-indigo-600 dark:text-[#adc6ff] transition-colors">
                <span class="material-symbols-outlined text-[24px]">{{ getServiceIcon(item.name) }}</span>
              </div>
              <div>
                <h3
                  class="text-[18px] font-bold leading-tight text-slate-900 dark:text-[#e1e2ec] group-hover:text-indigo-600 dark:group-hover:text-[#adc6ff] transition-colors">
                  {{ item.name }}</h3>
                <span
                  class="text-[11px] font-data-mono text-slate-400 dark:text-[#8c909f] uppercase tracking-tighter transition-colors">ID:
                  {{ String(item.id).slice(0, 8) }}</span>
              </div>
            </div>
            <span
              :class="(item.active === false || item.active === 0 || item.active === '0') ? 'bg-rose-50 dark:bg-[#ffb3ad]/10 text-rose-600 dark:text-[#ffb3ad] border-rose-100 dark:border-[#ffb3ad]/20' : 'bg-emerald-50 dark:bg-[#4edea3]/10 text-emerald-600 dark:text-[#4edea3] border-emerald-100 dark:border-[#4edea3]/20'"
              class="px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all">
              {{ (item.active === false || item.active === 0 || item.active === '0') ? $t('admin.services.hidden') : $t('admin.services.active') }}
            </span>
          </div>

          <p class="text-[12px] text-slate-500 dark:text-[#c2c6d6] leading-relaxed mb-6 flex-1 transition-colors">
            {{ $t('admin.services.type') }} <span class="text-slate-900 dark:text-[#e1e2ec] font-medium transition-colors">{{ item.type }}</span>.
            {{ $t('admin.services.desc_default') }}
          </p>

          <div class="flex gap-3 mt-auto">
            <button @click="openModal('edit', item)"
              class="flex-1 py-2.5 bg-indigo-600 dark:bg-[#adc6ff] text-white dark:text-[#002e6a] rounded-lg text-[12px] font-bold uppercase tracking-widest hover:bg-indigo-700 dark:hover:bg-[#4d8eff] transition-all shadow-lg dark:shadow-[0_0_15px_rgba(173,198,255,0.1)]">{{ $t('admin.services.configure') }}</button>
            <button @click="handleSoftDelete(item)"
              class="px-3 py-2.5 border border-slate-200 dark:border-[#424754] rounded-lg text-slate-400 dark:text-[#8c909f] hover:text-rose-500 dark:hover:text-[#ffb3ad] hover:border-rose-200 dark:hover:border-[#ffb3ad] hover:bg-rose-50 dark:hover:bg-[#ffb3ad]/5 transition-all flex items-center justify-center">
              <span class="material-symbols-outlined text-[20px]">{{ item.active !== false ? 'visibility_off' :
                'visibility' }}</span>
            </button>
          </div>
        </div>

        <div @click="openModal('create')"
          class="bg-white/50 dark:bg-[#191b23]/30 border border-dashed border-slate-300 dark:border-[#424754] rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[340px] hover:bg-slate-50 dark:hover:bg-[#191b23]/50 hover:border-indigo-500 dark:hover:border-[#adc6ff] transition-all cursor-pointer group shadow-sm hover:shadow-xl">
          <div
            class="w-14 h-14 rounded-full bg-slate-100 dark:bg-black border border-slate-200 dark:border-[#424754] flex items-center justify-center text-slate-400 dark:text-[#8c909f] group-hover:text-indigo-600 dark:group-hover:text-[#adc6ff] group-hover:border-indigo-600 dark:group-hover:border-[#adc6ff] group-hover:bg-indigo-50 dark:group-hover:bg-[#adc6ff]/10 transition-all mb-4 shadow-sm">
            <span class="material-symbols-outlined text-[28px]">add</span>
          </div>
          <h3 class="text-[18px] font-bold text-slate-900 dark:text-[#e1e2ec] mb-2 transition-colors">{{ $t('admin.services.create_template') }}</h3>
          <p class="text-[12px] text-slate-500 dark:text-[#8c909f] max-w-xs leading-relaxed transition-colors">{{ $t('admin.services.create_template_desc') }}</p>
        </div>
      </div>



      <!-- Pagination Footer -->
      <div v-if="!loading && activeServices.length > 0"
        class="mt-8 px-6 py-4 border-t border-slate-100 dark:border-[#424754] bg-white dark:bg-[#191b23]/50 flex items-center justify-between rounded-xl shadow-xl transition-colors">
        <div class="text-slate-400 dark:text-[#8c909f] text-[12px] font-medium">
          {{ $t('admin.services.page') }} <span class="text-indigo-600 dark:text-[#adc6ff] transition-colors">{{ Math.ceil(filteredServices.length
            / 9) > 0 ? 1 : 0 }}</span> / {{ Math.ceil(filteredServices.length / 9) || 1 }} — {{ $t('admin.services.showing') }} <span
            class="text-slate-900 dark:text-[#e1e2ec] transition-colors">{{ filteredServices.length }}</span> {{ $t('admin.services.services_count') }}
        </div>
        <div class="flex gap-2">
          <button
            class="p-2 rounded border border-slate-200 dark:border-[#424754] text-slate-400 dark:text-[#8c909f] hover:text-slate-900 dark:hover:text-[#e1e2ec] hover:bg-slate-50 dark:hover:bg-[#32353c] transition-all opacity-20 cursor-not-allowed">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            class="p-2 rounded border border-slate-200 dark:border-[#424754] text-slate-400 dark:text-[#e1e2ec] hover:bg-slate-50 dark:hover:bg-[#32353c] transition-all opacity-20 cursor-not-allowed">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Admin Modal -->
    <transition name="modal">
      <div v-if="showModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md p-6 transition-colors">
        <div
          class="bg-white dark:bg-black border border-slate-200 dark:border-[#424754] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300 transition-colors">
          <div
            class="px-8 py-6 border-b border-slate-100 dark:border-[#424754] flex justify-between items-center bg-slate-50 dark:bg-[#191b23] transition-colors">
            <h2 class="text-xl font-bold text-slate-900 dark:text-[#e1e2ec] transition-colors">
              {{ modalType === 'create' ? $t('admin.services.activate_service') : $t('admin.services.update_config') }}
            </h2>
            <button @click="showModal = false"
              class="text-slate-400 dark:text-[#8c909f] hover:text-slate-900 dark:hover:text-[#e1e2ec] transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-8 space-y-6">
            <div class="flex flex-col gap-2">
              <label
                class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">{{ $t('admin.services.display_name') }}</label>
              <input v-model="form.name" type="text"
                class="w-full bg-slate-50 dark:bg-[#10131a] border border-slate-200 dark:border-[#424754] rounded-xl px-4 py-3.5 text-slate-900 dark:text-[#e1e2ec] focus:border-indigo-500 dark:focus:border-[#adc6ff]/50 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-[#adc6ff]/50 outline-none transition-all text-sm font-medium shadow-inner transition-colors"
                :placeholder="$t('admin.services.name_placeholder')">
            </div>

            <div class="grid grid-cols-1 gap-6">
              <div v-if="modalType === 'create'" class="flex flex-col gap-2">
                <label
                  class="text-[10px] font-bold text-slate-400 dark:text-[#8c909f] uppercase tracking-widest transition-colors">{{ $t('admin.services.ai_category') }}</label>
                <select v-model="form.category_id"
                  class="w-full bg-slate-50 dark:bg-[#10131a] border border-slate-200 dark:border-[#424754] rounded-xl px-4 py-3.5 text-slate-900 dark:text-[#e1e2ec] focus:border-indigo-500 dark:focus:border-[#adc6ff]/50 outline-none cursor-pointer text-sm font-medium transition-colors">
                  <option v-for="cat in catalog" :key="cat.id" :value="cat.id" class="text-black">{{ cat.name }}
                  </option>
                </select>
              </div>
              <div v-else class="flex flex-col justify-end">
                <div @click="form.active = !form.active"
                  class="flex items-center gap-3 bg-indigo-50 dark:bg-[#adc6ff]/5 p-3.5 rounded-xl border border-indigo-100 dark:border-[#adc6ff]/10 hover:bg-indigo-100 dark:hover:bg-[#adc6ff]/10 cursor-pointer transition-all group transition-colors">
                  <div
                    class="w-5 h-5 rounded border border-slate-200 dark:border-[#424754] flex items-center justify-center transition-all"
                    :class="{ 'bg-indigo-600 dark:bg-[#adc6ff] border-indigo-600 dark:border-[#adc6ff]': form.active }">
                    <span v-if="form.active"
                      class="material-symbols-outlined text-[16px] text-white dark:text-[#002e6a] font-bold">check</span>
                  </div>
                  <span class="font-bold text-[11px] uppercase tracking-widest transition-colors"
                    :class="form.active ? 'text-indigo-600 dark:text-[#adc6ff]' : 'text-slate-400 dark:text-[#8c909f]'">{{ $t('admin.services.is_active') }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="px-8 py-6 bg-slate-50 dark:bg-[#191b23] flex gap-4 transition-colors">
            <button @click="showModal = false"
              class="flex-1 py-3.5 font-bold text-slate-400 dark:text-[#8c909f] hover:text-slate-900 dark:hover:text-[#e1e2ec] hover:bg-slate-200 dark:hover:bg-[#272a31] rounded-xl transition-all text-[11px] uppercase tracking-[0.2em] border border-transparent hover:border-slate-300 dark:hover:border-[#424754]">{{ $t('admin.services.cancel') }}</button>
            <button @click="submitForm"
              class="flex-1 py-3.5 font-bold bg-indigo-600 dark:bg-[#adc6ff] text-white dark:text-[#002e6a] rounded-xl hover:bg-indigo-700 dark:hover:bg-[#4d8eff] shadow-lg shadow-indigo-200 dark:shadow-[#adc6ff]/10 transition-all text-[11px] uppercase tracking-[0.2em] active:scale-95">
              {{ modalType === 'create' ? $t('admin.services.activate') : $t('admin.services.save_update') }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Create new AI category-->
    <transition name="modal">
      <div v-if="showCatalogModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">

        <div
          class="bg-white dark:bg-black border border-slate-200 dark:border-[#424754] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">

          <div class="px-8 py-6 border-b flex justify-between items-center bg-slate-50 dark:bg-[#191b23]">
            <h2 class="text-xl font-bold">
              {{ catalogModalMode === 'edit' ? $t('admin.services.edit_category') : $t('admin.services.create_new_category') }}
            </h2>
            <button @click="showCatalogModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-8 space-y-6">

            <!-- NAME -->
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-bold uppercase">{{ $t('admin.services.category_name') }}</label>
              <input v-model="catalogForm.name" type="text" :placeholder="$t('admin.services.category_placeholder')"
                class="w-full bg-slate-50 dark:bg-[#10131a] border rounded-xl px-4 py-3.5" />
            </div>

            <!-- TYPE -->
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-bold uppercase">{{ $t('admin.services.type') }}</label>

             <select v-model="catalogForm.type"
        class="w-full bg-slate-50 dark:bg-[#10131a] border rounded-xl px-4 py-3.5 outline-none transition-all focus:border-cyan-500">

  <option value="">{{ $t('admin.services.select_type') }}</option>
  

  <option value="chat">{{ $t('admin.services.type_chat') }}</option>
  <option value="rag">{{ $t('admin.services.type_rag') }}</option>
  
  
  <option value="image">{{ $t('admin.services.type_image') }}</option>
  <option value="audio">{{ $t('admin.services.type_audio') }}</option>
</select>
            </div>

            <!-- DESCRIPTION -->
            <div class="flex flex-col gap-2">
              <label class="text-[10px] font-bold uppercase">{{ $t('admin.services.description') }}</label>
              <textarea v-model="catalogForm.description" :placeholder="$t('admin.services.desc_placeholder')"
                class="w-full bg-slate-50 dark:bg-[#10131a] border rounded-xl px-4 py-3.5" />
            </div>

            <div class="border-t border-slate-200 dark:border-[#424754] pt-6">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-bold text-slate-900 dark:text-[#e1e2ec]">
                  {{ $t('admin.services.category_list') }}
                </h3>
                <button v-if="catalogModalMode === 'edit'" @click="resetCatalogForm"
                  class="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-[#adc6ff] hover:underline">
                  {{ $t('admin.services.create_new') }}
                </button>
              </div>

              <div v-if="catalog.length === 0"
                class="text-sm text-slate-500 dark:text-[#8c909f] py-4 text-center border border-dashed border-slate-200 dark:border-[#424754] rounded-xl">
                {{ $t('admin.services.no_categories') }}
              </div>

              <div v-else class="space-y-2 max-h-56 overflow-y-auto pr-1">
                <div v-for="cat in catalog" :key="cat.id"
                  class="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-[#424754] bg-slate-50 dark:bg-[#10131a]">
                  <div class="min-w-0">
                    <div class="font-bold text-sm text-slate-900 dark:text-[#e1e2ec] truncate">{{ cat.name }}</div>
                    <div class="text-[11px] text-slate-500 dark:text-[#8c909f] uppercase tracking-wider">
                      {{ cat.type }} · {{ categoryUsageCount(cat.id) }} {{ $t('admin.services.services_count') }}
                    </div>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <button @click="editCategory(cat)"
                      class="p-2 rounded-lg border border-slate-200 dark:border-[#424754] text-slate-500 dark:text-[#8c909f] hover:text-indigo-600 dark:hover:text-[#adc6ff] hover:bg-white dark:hover:bg-[#1d2027] transition-all"
                      :title="$t('admin.services.edit_category')">
                      <span class="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button @click="deleteCategory(cat)"
                      class="p-2 rounded-lg border border-slate-200 dark:border-[#424754] text-slate-500 dark:text-[#8c909f] hover:text-rose-600 dark:hover:text-[#ffb3ad] hover:bg-white dark:hover:bg-[#1d2027] transition-all"
                      :title="$t('admin.services.delete_category')">
                      <span class="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="px-8 py-6 bg-slate-50 dark:bg-[#191b23] flex gap-4">
            <button @click="showCatalogModal = false" class="flex-1 py-3 rounded-xl">
              {{ $t('admin.services.cancel_short') }}
            </button>
            <button @click="submitCategoryHandler" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl">
              {{ catalogModalMode === 'edit' ? $t('admin.services.save_update') : $t('admin.services.create_new') }}
            </button>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const toast = useToast()
const { t } = useI18n()

//STATE 
const catalog = ref([])   // admin/services (loại AI)
const services = ref([])  // partner services (instance)

const loading = ref(true)
const showModal = ref(false)
const showCatalogModal = ref(false)

const modalType = ref('create')
const catalogModalMode = ref('create')
const searchQuery = ref('')

const API_PATH = '/api/admin/ai-services'

// FORM 
const form = ref({
  id: null,
  name: '',
  service_id: '',
  active: true
})

const catalogForm = ref({
  id: null,
  name: '',
  type: '',
  description: ''
})

//  FETCH 
const config = useRuntimeConfig()
const accessToken = useCookie('accessToken')

const fetchAll = async () => {
  loading.value = true
  try {
    // 1. Catalog
    const resCatalog = await $fetch(`${config.public.apiBase}/admin/ai-categories`, {
        headers: {
            'Authorization': `Bearer ${accessToken.value}`
        }
    })
    catalog.value = resCatalog.data || []

    const resServices = await $fetch(`${config.public.apiBase}/admin/ai-services`, {
        headers: {
            'Authorization': `Bearer ${accessToken.value}`
        }
    })
    services.value = (resServices.data || []).map(item => ({
      id: item.id,
      category_id: item.category_id,
      name: item.name,
      type: item.type,
      description: item.description,
      status: item.status, 
      active: item.is_visible
    }))


  } catch (err) {
    console.error(err)
    toast.error('Không tải được dữ liệu')
  } finally {
    loading.value = false
  }
}

//  MODAL 
const openModal = (type, item = null) => {
  modalType.value = type

  if (type === 'edit' && item) {
    form.value = {
      ...item,
      active: !(item.active === false || item.active === 0 || item.active === '0')
    }
  } else {
    form.value = {
      id: null,
      name: '',
      category_id: catalog.value[0]?.id || '',
      type: 'LLM',
      active: true
    }
  }

  showModal.value = true
}

const openCatalogModal = () => {
  resetCatalogForm()
  showCatalogModal.value = true
}

const resetCatalogForm = () => {
  catalogModalMode.value = 'create'
  catalogForm.value = {
    id: null,
    name: '',
    type: '',
    description: ''
  }
}

const editCategory = (category) => {
  catalogModalMode.value = 'edit'
  catalogForm.value = {
    id: category.id,
    name: category.name || '',
    type: category.type || '',
    description: category.description || ''
  }
}

//  SUBMIT 
const submitForm = async () => {
  if (!form.value.name) return toast.warning("Vui lòng nhập tên dịch vụ")

  try {
    const isEdit = modalType.value === 'edit'
    const method = isEdit ? 'PUT' : 'POST'
    const url = isEdit ? `${config.public.apiBase}/admin/ai-services/${form.value.id}` : `${config.public.apiBase}/admin/ai-services`

    const res = await $fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      },
      body: {
        category_id: form.value.category_id,
        name: form.value.name,
        type: form.value.type || 'LLM',
        description: form.value.description,
        is_visible: form.value.active
      }
    })

    if (res) {
      toast.success(isEdit ? 'Cập nhật thành công!' : 'Tạo service thành công!')
      showModal.value = false
      await fetchAll()
    }
  } catch (err) {
    toast.error('Lỗi: ' + (err.data?.message || 'Không thể lưu dữ liệu'))
  }
}

// DELETE 
const handleSoftDelete = async (item) => {
  const isHidden = !item.active

  const confirm = await toast.askConfirm(
    isHidden ? 'Khôi phục hiển thị service?' : 'Ẩn service này?'
  )

  if (!confirm) return

  try {
    await $fetch(`${config.public.apiBase}/admin/ai-services/${item.id}/toggle-visibility`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    toast.success(isHidden ? 'Khôi phục hiển thị thành công' : 'Ẩn service thành công')


    await fetchAll()
  } catch (err) {
    const status = err?.statusCode || err?.response?.status

    if (status === 409) {
      toast.error('Không thể ẩn: Service đang được partner sử dụng')
      return
    }
    toast.error(
      err?.data?.message ||
      err?.response?._data?.message ||
      'Thao tác thất bại'
    )
  }
}

// CREATE CATALOG 
const submitCategoryHandler = async () => {
  if (!catalogForm.value.name || !catalogForm.value.type) {
    return toast.warning("Nhập đủ name và type")
  }

  try {
    const isEdit = catalogModalMode.value === 'edit'
    const url = isEdit
      ? `${config.public.apiBase}/admin/ai-categories/${catalogForm.value.id}`
      : `${config.public.apiBase}/admin/ai-categories`

    await $fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      },
      body: {
        name: catalogForm.value.name,
        type: catalogForm.value.type,
        description: catalogForm.value.description
      }
    })

    toast.success(isEdit ? t('admin.services.category_update_success') : t('admin.services.category_create_success'))
    resetCatalogForm()
    await fetchAll()

  } catch (err) {
    toast.error(err.data?.message || err.response?._data?.message || t('admin.services.category_save_failed'))
  }
}

const deleteCategory = async (category) => {
  const confirm = await toast.askConfirm(
    t('admin.services.delete_category_confirm', { name: category.name })
  )

  if (!confirm) return

  try {
    await $fetch(`${config.public.apiBase}/admin/ai-categories/${category.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken.value}`
      }
    })

    toast.success(t('admin.services.category_delete_success'))
    if (catalogForm.value.id === category.id) {
      resetCatalogForm()
    }
    await fetchAll()
  } catch (err) {
    toast.error(err.data?.message || err.response?._data?.message || t('admin.services.category_delete_failed'))
  }
}

//  UTILS 
const activeServices = computed(() => services.value)

const filteredServices = computed(() => {
  return activeServices.value.filter(s =>
    s.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const categoryUsageCount = (categoryId) => {
  return services.value.filter(service => String(service.category_id) === String(categoryId)).length
}

const getServiceIcon = (name) => {
  const n = name?.toLowerCase() || ''
  if (n.includes('chat') || n.includes('gpt')) return 'forum'
  if (n.includes('image')) return 'image'
  if (n.includes('code')) return 'terminal'
  if (n.includes('audio')) return 'settings_voice'
  if (n.includes('tour')) return 'flight_takeoff'
  return 'smart_toy'
}


onMounted(() => {
  fetchAll()
})

definePageMeta({
  layout: 'layout-admin'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

.font-data-mono {
  font-family: 'JetBrains Mono', monospace;
}

.font-display-lg {
  font-family: 'Inter', sans-serif;
}

/* Modal Animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.3);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(173, 198, 255, 0.3);
}
</style>
