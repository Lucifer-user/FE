<template>
  <section class="space-y-6 animate-in fade-in duration-500">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400">{{ $t('partner.departments.eyebrow') }}</p>
        <h1 class="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{{ $t('partner.departments.title') }}</h1>
        <p class="mt-1 max-w-2xl text-sm text-slate-500 dark:text-white/45">
          {{ $t('partner.departments.subtitle') }}
        </p>
      </div>
      <button
        :disabled="!canManage"
        @click="openCreateModal"
        class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-white dark:text-slate-950 dark:hover:bg-white/85"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        {{ $t('partner.departments.create') }}
      </button>
    </div>

    <div v-if="featureBlocked" class="rounded-lg border border-amber-500/25 bg-amber-500/10 px-5 py-4 text-sm text-amber-700 dark:text-amber-300">
      {{ $t('partner.departments.feature_locked') }}
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
    </div>

    <div v-else-if="!featureBlocked && departments.length === 0" class="rounded-lg border border-dashed border-slate-300 py-12 text-center dark:border-white/20">
      <span class="material-symbols-outlined text-4xl text-slate-400">corporate_fare</span>
      <h3 class="mt-2 text-lg font-medium text-slate-900 dark:text-white">{{ $t('partner.departments.empty_title') }}</h3>
      <p class="mt-1 text-sm text-slate-500">{{ $t('partner.departments.empty_desc') }}</p>
      <button v-if="canManage" @click="openCreateModal" class="mt-4 text-sm font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400">
        + {{ $t('partner.departments.create_first') }}
      </button>
    </div>

    <div v-else-if="!featureBlocked" class="grid grid-cols-1 gap-4 xl:grid-cols-4">
      <article
        v-for="department in departments"
        :key="department.id"
        class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-400/40"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
              <span class="material-symbols-outlined text-[20px]">corporate_fare</span>
            </div>
            <div class="min-w-0">
              <h3 class="truncate font-['Space_Grotesk'] text-base font-bold text-slate-900 dark:text-white">{{ department.name }}</h3>
              <p class="truncate text-xs text-slate-400 dark:text-white/35">{{ department.manager?.user?.name || $t('partner.departments.no_manager') }}</p>
            </div>
          </div>
          <span v-if="department.status === 'active'" class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">{{ $t('partner.departments.active') }}</span>
          <span v-else class="rounded-full border border-slate-500/20 bg-slate-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">{{ $t('partner.departments.inactive') }}</span>
        </div>

        <div class="mt-5 grid grid-cols-3 gap-2 text-center">
          <div class="rounded-lg bg-slate-50 p-3 dark:bg-black/20">
            <p class="text-lg font-bold text-slate-900 dark:text-white">{{ department.members_count || 0 }}</p>
            <p class="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.departments.members') }}</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-3 dark:bg-black/20">
            <p class="text-lg font-bold text-slate-900 dark:text-white">{{ department.bots_count || 0 }}</p>
            <p class="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.departments.bots') }}</p>
          </div>
          <div class="rounded-lg bg-slate-50 p-3 dark:bg-black/20">
            <p class="text-lg font-bold text-slate-900 dark:text-white">{{ department.chats_count || 0 }}</p>
            <p class="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.departments.chats') }}</p>
          </div>
        </div>

        <div class="mt-4 border-t border-slate-100 pt-4 dark:border-white/5">
          <button
            :disabled="!canManage"
            @click="openManageModal(department)"
            class="w-full rounded-lg border border-slate-200 bg-white py-2 text-[10px] font-bold uppercase tracking-widest text-slate-700 transition hover:border-cyan-300 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
          >
            {{ $t('partner.departments.manage') }}
          </button>
        </div>
      </article>
    </div>

    <div v-if="!featureBlocked && departments.length > 0" class="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div class="border-b border-slate-100 px-6 py-4 dark:border-white/10">
        <h2 class="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-white">{{ $t('partner.departments.bot_map') }}</h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-white/40">{{ $t('partner.departments.bot_map_desc') }}</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:border-white/10">
            <tr>
              <th class="px-6 py-4">{{ $t('partner.departments.department') }}</th>
              <th class="px-6 py-4">{{ $t('partner.departments.bot_name') }}</th>
              <th class="px-6 py-4">{{ $t('partner.departments.access') }}</th>
              <th class="px-6 py-4">{{ $t('partner.departments.allowed_roles') }}</th>
              <th class="px-6 py-4">{{ $t('partner.departments.default') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-white/10">
            <template v-for="department in departments" :key="department.id">
              <tr v-if="!department.bots || department.bots.length === 0" class="text-slate-500 dark:text-white/50">
                <td class="px-6 py-4 font-semibold text-slate-900 dark:text-white">{{ department.name }}</td>
                <td class="px-6 py-4 italic" colspan="4">{{ $t('partner.departments.no_bots_assigned') }}</td>
              </tr>
              <tr v-for="botLink in department.bots" :key="botLink.id" class="text-slate-700 dark:text-white/70">
                <td class="px-6 py-4 font-semibold text-slate-900 dark:text-white">{{ department.name }}</td>
                <td class="px-6 py-4">{{ botLink.partner_service?.name || $t('partner.departments.unknown_bot') }}</td>
                <td class="px-6 py-4"><span class="rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-300">{{ accessLabel(botLink.access_level) }}</span></td>
                <td class="px-6 py-4 text-xs text-slate-500">{{ roleList(botLink.allowed_roles) }}</td>
                <td class="px-6 py-4">
                  <span v-if="botLink.is_default" class="material-symbols-outlined text-sm text-emerald-500">check_circle</span>
                  <span v-else class="text-slate-300">-</span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900">
        <div class="flex items-start justify-between gap-4">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ $t('partner.departments.create_title') }}</h2>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <form @submit.prevent="createDepartment" class="mt-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">{{ $t('partner.departments.name') }}</label>
            <input v-model="form.name" type="text" required class="mt-2 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">{{ $t('partner.departments.manager') }}</label>
            <BaseSelect
              v-model="form.manager_member_id"
              :options="[
                { value: '', label: $t('partner.departments.not_selected') },
                ...managerOptions.map(m => ({ value: m.id, label: `${m.name || m.email} - ${m.role}` }))
              ]"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">{{ $t('partner.departments.description') }}</label>
            <textarea v-model="form.description" class="mt-2 block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500 focus:ring-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white"></textarea>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <button type="button" @click="showCreateModal = false" class="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{{ $t('partner.departments.cancel') }}</button>
            <button type="submit" :disabled="saving" class="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50">{{ $t('partner.departments.save') }}</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showManageModal && selectedDepartment" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm">
      <div class="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#10131a]">
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5 dark:border-white/10">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">{{ $t('partner.departments.admin_title') }}</p>
            <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{{ selectedDepartment.name }}</h3>
          </div>
          <button @click="closeManageModal" class="text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="grid max-h-[calc(90vh-92px)] grid-cols-1 gap-0 overflow-y-auto lg:grid-cols-2">
          <div class="space-y-5 border-b border-slate-100 p-6 dark:border-white/10 lg:border-b-0 lg:border-r">
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white">{{ $t('partner.departments.info') }}</h4>
              <div class="mt-4 grid gap-3">
                <input v-model="editForm.name" class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white" :placeholder="$t('partner.departments.name')" />
                <BaseSelect
                  v-model="editForm.status"
                  :options="[
                    { value: 'active', label: $t('partner.departments.active') },
                    { value: 'inactive', label: $t('partner.departments.inactive') }
                  ]"
                />
                <BaseSelect
                  v-model="editForm.manager_member_id"
                  :options="[
                    { value: '', label: $t('partner.departments.no_manager') },
                    ...managerOptions.map(m => ({ value: m.id, label: `${m.name || m.email} - ${m.role}` }))
                  ]"
                />
                <textarea v-model="editForm.description" class="min-h-[88px] rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white" :placeholder="$t('partner.departments.description')"></textarea>
              </div>
              <button @click="updateDepartment" :disabled="saving" class="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-50 dark:bg-white dark:text-slate-950">
                {{ $t('partner.departments.save_info') }}
              </button>
            </div>

            <div>
              <h4 class="font-bold text-slate-900 dark:text-white">{{ $t('partner.departments.department_members') }}</h4>
              <div class="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                <div v-for="memberLink in selectedDepartment.members || []" :key="memberLink.id" class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                  <div>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ memberLink.organization_member?.user?.name || memberLink.organization_member?.user?.email }}</p>
                    <p class="text-xs text-slate-400">{{ memberLink.organization_member?.role }} - {{ memberLink.role_in_department }}</p>
                  </div>
                  <button @click="removeMember(memberLink.organization_member_id)" class="text-rose-500 hover:text-rose-600">
                    <span class="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
                <p v-if="!selectedDepartment.members?.length" class="rounded-lg border border-dashed border-slate-200 py-5 text-center text-sm text-slate-400 dark:border-white/10">{{ $t('partner.departments.no_members') }}</p>
              </div>
              <div class="mt-3 flex gap-2">
                <BaseSelect
                  v-model="memberForm.organization_member_id"
                  :options="[
                    { value: '', label: $t('partner.departments.select_member') },
                    ...unassignedMembers.map(m => ({ value: m.id, label: `${m.name || m.email} - ${m.role}` }))
                  ]"
                  buttonClass="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black/20 dark:text-white"
                />
                <button @click="addMember" :disabled="!memberForm.organization_member_id || saving" class="rounded-lg bg-cyan-600 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-50">{{ $t('partner.departments.add') }}</button>
              </div>
            </div>
          </div>

          <div class="space-y-5 p-6">
            <div>
              <h4 class="font-bold text-slate-900 dark:text-white">{{ $t('partner.departments.assigned_bots') }}</h4>
              <div class="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
                <div v-for="botLink in selectedDepartment.bots || []" :key="botLink.id" class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                  <div>
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ botLink.partner_service?.name || $t('partner.departments.unknown_bot') }}</p>
                    <p class="text-xs text-slate-400">{{ accessLabel(botLink.access_level) }} - {{ roleList(botLink.allowed_roles) }}</p>
                  </div>
                  <button @click="removeBot(botLink.partner_service_id)" class="text-rose-500 hover:text-rose-600">
                    <span class="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
                <p v-if="!selectedDepartment.bots?.length" class="rounded-lg border border-dashed border-slate-200 py-5 text-center text-sm text-slate-400 dark:border-white/10">{{ $t('partner.departments.no_bot') }}</p>
              </div>
            </div>

            <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
              <h5 class="text-sm font-bold text-slate-900 dark:text-white">{{ $t('partner.departments.assign_bot') }}</h5>
              <div class="mt-3 space-y-3">
                <BaseSelect
                  v-model="botForm.partner_service_id"
                  :options="[
                    { value: '', label: $t('partner.departments.select_bot') },
                    ...unassignedBots.map(b => ({ value: b.id, label: `${b.name} - ${b.type}` }))
                  ]"
                  buttonClass="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black/20 dark:text-white"
                />
                <BaseSelect
                  v-model="botForm.access_level"
                  :options="[
                    { value: 'team', label: $t('partner.departments.team') },
                    { value: 'private', label: $t('partner.departments.private') },
                    { value: 'public', label: $t('partner.departments.public') }
                  ]"
                  buttonClass="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black/20 dark:text-white"
                />
                <div>
                  <p class="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.departments.allowed_roles') }}</p>
                  <div class="grid grid-cols-2 gap-2">
                    <label v-for="role in departmentRoles" :key="role" class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-white/10 dark:bg-white/5 dark:text-white">
                      <input v-model="botForm.allowed_roles" :value="role" type="checkbox" class="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500" />
                      {{ role }}
                    </label>
                  </div>
                </div>
                <label class="flex items-center gap-2 text-sm text-slate-600 dark:text-white/70">
                  <input v-model="botForm.is_default" type="checkbox" class="rounded border-slate-300 text-cyan-500 focus:ring-cyan-500" />
                  {{ $t('partner.departments.set_default') }}
                </label>
                <button @click="addBot" :disabled="!botForm.partner_service_id || saving" class="w-full rounded-lg bg-cyan-600 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-50">{{ $t('partner.departments.assign') }}</button>
              </div>
            </div>

            <button @click="deleteDepartment" :disabled="saving" class="w-full rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-rose-600 disabled:opacity-50">
              {{ $t('partner.departments.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseSelect from '~/components/shared/BaseSelect.vue'

const props = defineProps({
  organizationId: {
    type: String,
    default: ''
  }
})

const config = useRuntimeConfig()
const token = useCookie('accessToken')
const toast = useToast()
const { t } = useI18n()

const departments = ref([])
const availableMembers = ref([])
const availableBots = ref([])
const canManage = ref(false)
const loading = ref(false)
const saving = ref(false)
const featureBlocked = ref(false)
const showCreateModal = ref(false)
const showManageModal = ref(false)
const selectedDepartment = ref(null)
const form = ref({ name: '', description: '', manager_member_id: '' })
const editForm = ref({ name: '', description: '', manager_member_id: '', status: 'active' })
const memberForm = ref({ organization_member_id: '', role_in_department: 'member' })
const departmentRoles = ['owner', 'admin', 'manager', 'member', 'viewer']
const botForm = ref({
  partner_service_id: '',
  access_level: 'team',
  allowed_roles: ['manager', 'member'],
  is_default: false
})

const headers = () => {
  const organizationId = props.organizationId || (process.client ? localStorage.getItem('orbit_current_organization_id') : '')
  return {
    Authorization: `Bearer ${token.value}`,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(organizationId ? { 'X-Organization-Id': organizationId } : {})
  }
}

const managerOptions = computed(() => {
  return availableMembers.value.filter(member => ['owner', 'admin', 'manager'].includes(member.role))
})

const assignedMemberIds = computed(() => {
  return new Set((selectedDepartment.value?.members || []).map(member => Number(member.organization_member_id)))
})

const assignedBotIds = computed(() => {
  return new Set((selectedDepartment.value?.bots || []).map(bot => Number(bot.partner_service_id)))
})

const unassignedMembers = computed(() => {
  return availableMembers.value.filter(member => !assignedMemberIds.value.has(Number(member.id)))
})

const unassignedBots = computed(() => {
  return availableBots.value.filter(bot => !assignedBotIds.value.has(Number(bot.id)))
})

const syncSelectedDepartment = () => {
  if (!selectedDepartment.value) return
  const fresh = departments.value.find(department => department.id === selectedDepartment.value.id)
  if (fresh) {
    selectedDepartment.value = fresh
  } else {
    closeManageModal()
  }
}

const fetchDepartments = async () => {
  loading.value = true
  featureBlocked.value = false
  try {
    const res = await $fetch(`${config.public.apiBase}/partner/departments`, {
      method: 'GET',
      headers: headers()
    })
    departments.value = res.data || []
    availableMembers.value = res.available_members || []
    availableBots.value = res.available_bots || []
    canManage.value = Boolean(res.access?.can_manage)
    syncSelectedDepartment()
  } catch (error) {
    console.error('Lỗi khi tải phòng ban:', error)
    if (error.response?.status === 403 || error?.status === 403) {
      featureBlocked.value = error?.data?.code === 'FEATURE_NOT_ALLOWED'
      canManage.value = false
      if (!featureBlocked.value) {
        toast.error(error?.data?.message || t('partner.departments.error_no_permission_view'))
      }
    } else {
      toast.error(t('partner.departments.error_load_list'))
    }
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  if (!canManage.value) return
  form.value = { name: '', description: '', manager_member_id: '' }
  showCreateModal.value = true
}

const openManageModal = (department) => {
  if (!canManage.value) return
  selectedDepartment.value = department
  editForm.value = {
    name: department.name || '',
    description: department.description || '',
    manager_member_id: department.manager_member_id || '',
    status: department.status || 'active'
  }
  memberForm.value = { organization_member_id: '', role_in_department: 'member' }
  resetBotForm()
  showManageModal.value = true
}

const closeManageModal = () => {
  showManageModal.value = false
  selectedDepartment.value = null
}

const createDepartment = async () => {
  saving.value = true
  try {
    await $fetch(`${config.public.apiBase}/partner/departments`, {
      method: 'POST',
      headers: headers(),
      body: {
        ...form.value,
        manager_member_id: form.value.manager_member_id || null
      }
    })
    toast.success(t('partner.departments.success_create'))
    showCreateModal.value = false
    await fetchDepartments()
  } catch (error) {
    console.error('Lỗi khi tạo phòng ban:', error)
    toast.error(error?.data?.message || t('partner.departments.error_create'))
  } finally {
    saving.value = false
  }
}

const updateDepartment = async () => {
  if (!selectedDepartment.value) return
  saving.value = true
  try {
    await $fetch(`${config.public.apiBase}/partner/departments/${selectedDepartment.value.id}`, {
      method: 'PUT',
      headers: headers(),
      body: {
        ...editForm.value,
        manager_member_id: editForm.value.manager_member_id || null
      }
    })
    toast.success(t('partner.departments.success_update'))
    await fetchDepartments()
  } catch (error) {
    console.error('Lỗi khi cập nhật phòng ban:', error)
    toast.error(error?.data?.message || t('partner.departments.error_update'))
  } finally {
    saving.value = false
  }
}

const deleteDepartment = async () => {
  if (!selectedDepartment.value) return
  const confirmed = window.confirm(`Xóa phòng ban "${selectedDepartment.value.name}"?`)
  if (!confirmed) return

  saving.value = true
  try {
    await $fetch(`${config.public.apiBase}/partner/departments/${selectedDepartment.value.id}`, {
      method: 'DELETE',
      headers: headers()
    })
    toast.success(t('partner.departments.success_delete'))
    closeManageModal()
    await fetchDepartments()
  } catch (error) {
    console.error('Lỗi khi xóa phòng ban:', error)
    toast.error(error?.data?.message || t('partner.departments.error_delete'))
  } finally {
    saving.value = false
  }
}

const addMember = async () => {
  if (!selectedDepartment.value || !memberForm.value.organization_member_id) return
  saving.value = true
  try {
    await $fetch(`${config.public.apiBase}/partner/departments/${selectedDepartment.value.id}/members`, {
      method: 'POST',
      headers: headers(),
      body: memberForm.value
    })
    toast.success(t('partner.departments.success_add_member'))
    memberForm.value = { organization_member_id: '', role_in_department: 'member' }
    await fetchDepartments()
  } catch (error) {
    console.error('Lỗi khi thêm thành viên:', error)
    toast.error(error?.data?.message || t('partner.departments.error_add_member'))
  } finally {
    saving.value = false
  }
}

const removeMember = async (organizationMemberId) => {
  if (!selectedDepartment.value) return
  saving.value = true
  try {
    await $fetch(`${config.public.apiBase}/partner/departments/${selectedDepartment.value.id}/members/${organizationMemberId}`, {
      method: 'DELETE',
      headers: headers()
    })
    toast.success(t('partner.departments.success_remove_member'))
    await fetchDepartments()
  } catch (error) {
    console.error('Lỗi khi bỏ thành viên:', error)
    toast.error(error?.data?.message || t('partner.departments.error_remove_member'))
  } finally {
    saving.value = false
  }
}

const resetBotForm = () => {
  botForm.value = {
    partner_service_id: '',
    access_level: 'team',
    allowed_roles: ['manager', 'member'],
    is_default: false
  }
}

const addBot = async () => {
  if (!selectedDepartment.value || !botForm.value.partner_service_id) return
  saving.value = true
  try {
    await $fetch(`${config.public.apiBase}/partner/departments/${selectedDepartment.value.id}/bots`, {
      method: 'POST',
      headers: headers(),
      body: botForm.value
    })
    toast.success(t('partner.departments.success_assign_bot'))
    resetBotForm()
    await fetchDepartments()
  } catch (error) {
    console.error('Lỗi khi gán bot:', error)
    toast.error(error?.data?.message || t('partner.departments.error_assign_bot'))
  } finally {
    saving.value = false
  }
}

const removeBot = async (partnerServiceId) => {
  if (!selectedDepartment.value) return
  saving.value = true
  try {
    await $fetch(`${config.public.apiBase}/partner/departments/${selectedDepartment.value.id}/bots/${partnerServiceId}`, {
      method: 'DELETE',
      headers: headers()
    })
    toast.success(t('partner.departments.success_remove_bot'))
    await fetchDepartments()
  } catch (error) {
    console.error('Lỗi khi bỏ bot:', error)
    toast.error(error?.data?.message || t('partner.departments.error_remove_bot'))
  } finally {
    saving.value = false
  }
}

const accessLabel = (accessLevel) => {
  const labels = {
    public: t('partner.departments.public'),
    team: t('partner.departments.team'),
    private: t('partner.departments.private')
  }
  return labels[accessLevel] || accessLevel || t('partner.departments.team')
}

const roleList = (roles = []) => {
  if (!roles || roles.length === 0) return t('partner.departments.allowed_roles')
  return roles.join(', ')
}

watch(() => props.organizationId, () => {
  closeManageModal()
  fetchDepartments()
}, { immediate: true })
</script>
