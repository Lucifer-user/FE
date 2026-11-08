<template>
  <section class="space-y-6 animate-in fade-in duration-500">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-400">{{ $t('partner.members.eyebrow') }}</p>
        <h1 class="mt-2 font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{{ $t('partner.members.title') }}</h1>
        <p class="mt-1 max-w-2xl text-sm text-slate-500 dark:text-white/45">{{ $t('partner.members.subtitle') }}</p>
        <div v-if="currentProjectName" class="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
          <span class="material-symbols-outlined text-sm">domain</span>
          {{ $t('partner.members.current_project', { name: currentProjectName }) }}
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="fetchMembers"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/70 dark:hover:bg-white/10"
        >
          <span class="material-symbols-outlined text-sm">refresh</span>
          {{ $t('partner.members.reload') }}
        </button>
        <button
          @click="showInviteModal = true"
          class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-white/85"
        >
          <span class="material-symbols-outlined text-sm">person_add</span>
          {{ $t('partner.members.invite') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
      <article v-for="role in roleCards" :key="role.name" class="rounded-lg border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
        <div class="flex items-center justify-between">
          <h3 class="font-['Space_Grotesk'] text-base font-bold text-slate-900 dark:text-white">{{ role.name }}</h3>
          <span class="material-symbols-outlined text-lg" :class="role.color">{{ role.icon }}</span>
        </div>
        <p class="mt-3 text-xs leading-relaxed text-slate-500 dark:text-white/45">{{ role.desc }}</p>
        <p class="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ role.count }} {{ $t('partner.members.people') }}</p>
      </article>
    </div>

    <div class="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div class="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 class="font-['Space_Grotesk'] text-lg font-bold text-slate-900 dark:text-white">{{ $t('partner.members.list') }}</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-white/40">
            {{ $t('partner.members.project_data') }}: <span class="font-semibold text-slate-700 dark:text-white/70">{{ currentProjectName || $t('partner.members.loading_project') }}</span>
          </p>
        </div>
        <div class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-white/10">
          <span class="material-symbols-outlined text-sm text-slate-400">search</span>
          <input v-model="search" class="w-52 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-white/70" :placeholder="$t('partner.members.search')" />
        </div>
      </div>

      <div v-if="loading" class="p-10 text-center text-sm text-slate-400">{{ $t('partner.members.loading') }}</div>
      <div v-else-if="errorMessage" class="p-10 text-center text-sm text-rose-500">{{ errorMessage }}</div>

      <div v-else class="overflow-x-auto min-h-[300px]">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:border-white/10">
            <tr>
              <th class="px-6 py-4">{{ $t('partner.members.member') }}</th>
              <th class="px-6 py-4">{{ $t('partner.members.role') }}</th>
              <th class="px-6 py-4">{{ $t('partner.members.permissions') }}</th>
              <th class="px-6 py-4">{{ $t('partner.members.joined') }}</th>
              <th class="px-6 py-4 text-right">{{ $t('partner.members.status') }}</th>
              <th class="px-6 py-4 text-center">{{ $t('partner.members.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-white/10">
            <tr v-for="member in filteredMembers" :key="member.id" class="text-slate-700 dark:text-white/70 group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-white">{{ initials(member) }}</div>
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-white">{{ member.name || $t('partner.members.anonymous') }} <span v-if="isCurrentUser(member)" class="text-[9px] bg-cyan-500/10 text-cyan-500 px-1.5 py-0.5 rounded-md ml-1 font-bold uppercase">({{ $t('partner.members.you') }})</span></p>
                    <p class="text-xs text-slate-400">{{ member.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest" :class="roleBadge(member.role)">{{ member.role }}</span>
              </td>
              <td class="max-w-md px-6 py-4 text-xs text-slate-500 dark:text-white/45">{{ permissionText(member.permissions) }}</td>
              <td class="px-6 py-4 text-xs text-slate-400">{{ formatDate(member.joined_at) }}</td>
              <td class="px-6 py-4 text-right">
                <span class="inline-block whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest" :class="member.status === 'active' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'">{{ member.status === 'active' ? $t('partner.members.active') : $t('partner.members.locked') }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                 <button v-if="canManage(member)" @click="openManageModal(member)" class="text-slate-400 hover:text-cyan-500 transition-colors" :title="$t('partner.members.manage')">
                    <span class="material-symbols-outlined text-lg">manage_accounts</span>
                 </button>
                 <div v-else class="text-[10px] text-slate-300 dark:text-white/20 italic" :title="$t('partner.members.no_permission')">-</div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredMembers.length === 0" class="p-10 text-center text-sm text-slate-400">{{ $t('partner.members.empty') }}</div>
      </div>
    </div>

    <!-- Invite Modal -->
    <div v-if="showInviteModal" class="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#111318]">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-['Space_Grotesk'] text-xl font-bold text-slate-900 dark:text-white">{{ $t('partner.members.invite_title') }}</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-white/45">{{ $t('partner.members.invite_desc') }}</p>
          </div>
          <button @click="showInviteModal = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="mt-6 space-y-4">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.members.email') }}</label>
            <input v-model="inviteForm.email" type="email" class="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white" placeholder="employee@company.com" />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.members.role') }}</label>
            <BaseSelect
              v-model="inviteForm.role"
              :options="[
                { value: 'admin', label: $t('partner.members.role_admin') },
                { value: 'manager', label: $t('partner.members.role_manager') },
                { value: 'member', label: $t('partner.members.role_member') },
                { value: 'viewer', label: $t('partner.members.role_viewer') }
              ]"
            />
          </div>
          <p v-if="inviteError" class="rounded-lg bg-rose-500/10 px-4 py-3 text-xs text-rose-500">{{ inviteError }}</p>
        </div>

        <div class="mt-6 flex gap-3">
          <button @click="showInviteModal = false" class="flex-1 rounded-lg border border-slate-200 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:border-white/10 dark:text-white/50">{{ $t('partner.members.cancel') }}</button>
          <button @click="inviteMember" :disabled="inviteLoading" class="flex-1 rounded-lg bg-slate-900 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-50 dark:bg-white dark:text-slate-950">
            {{ inviteLoading ? $t('partner.members.adding') : $t('partner.members.add_to_project') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Manage Modal -->
    <div v-if="showManageModal" class="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/60 p-6 backdrop-blur-sm">
      <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#111318]">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-['Space_Grotesk'] text-xl font-bold text-slate-900 dark:text-white">{{ $t('partner.members.manage_title') }}</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-white/45">{{ selectedMember?.name }} ({{ selectedMember?.email }})</p>
          </div>
          <button @click="showManageModal = false" class="text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="mt-6 space-y-4">
          <!-- Đổi vai trò -->
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.members.role') }}</label>
            <div class="flex gap-2 mt-2">
              <BaseSelect
                v-model="manageForm.role"
                :disabled="selectedMember?.role === 'owner'"
                :options="selectedMember?.role === 'owner' ? [
                  { value: 'owner', label: $t('partner.members.owner_readonly') }
                ] : [
                  { value: 'admin', label: $t('partner.members.role_admin') },
                  { value: 'manager', label: $t('partner.members.role_manager') },
                  { value: 'member', label: $t('partner.members.role_member') },
                  { value: 'viewer', label: $t('partner.members.role_viewer') }
                ]"
                buttonClass="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
              />
              <button @click="updateRole" :disabled="manageForm.role === selectedMember?.role || selectedMember?.role === 'owner' || manageLoading" class="rounded-lg bg-cyan-500 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-50 hover:bg-cyan-600 transition-colors">
                {{ $t('partner.members.save') }}
              </button>
            </div>
            <p v-if="selectedMember?.role === 'owner'" class="text-[10px] text-amber-500 mt-1">* {{ $t('partner.members.owner_role_note') }}</p>
          </div>

          <!-- Đổi trạng thái -->
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ $t('partner.members.account_status') }}</label>
            <div class="flex items-center justify-between mt-2 rounded-lg border border-slate-200 p-4 dark:border-white/10 bg-slate-50 dark:bg-black/20">
              <div class="flex items-center gap-3">
                 <div class="w-2 h-2 rounded-full" :class="manageForm.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'"></div>
                 <span class="text-sm font-semibold text-slate-700 dark:text-white">{{ manageForm.status === 'active' ? $t('partner.members.active_account') : $t('partner.members.blocked_account') }}</span>
              </div>
              <button @click="toggleStatus" :disabled="manageLoading" class="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 transition-colors disabled:opacity-50">
                {{ manageForm.status === 'active' ? $t('partner.members.lock_account') : $t('partner.members.reactivate') }}
              </button>
            </div>
          </div>

          <p v-if="manageError" class="rounded-lg bg-rose-500/10 px-4 py-3 text-xs text-rose-500">{{ manageError }}</p>
        </div>

        <div class="mt-8 border-t border-slate-100 dark:border-white/10 pt-6">
           <h4 class="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2">{{ $t('partner.members.danger_zone') }}</h4>
           <div class="flex items-center justify-between">
              <p class="text-xs text-slate-500 dark:text-white/45 max-w-[200px]">{{ $t('partner.members.remove_desc') }}</p>
              <button @click="removeMember" :disabled="manageLoading" class="rounded-lg bg-rose-500 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-rose-600 transition-colors disabled:opacity-50">
                 {{ $t('partner.members.remove') }}
              </button>
           </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import BaseSelect from '~/components/shared/BaseSelect.vue'

const props = defineProps({
  organizationId: {
    type: String,
    default: ''
  }
})

const config = useRuntimeConfig()
const token = useCookie('accessToken')
const { user: loggedInUser } = useAuthToken()
const { t, locale } = useI18n()

const loading = ref(false)
const inviteLoading = ref(false)
const manageLoading = ref(false)
const showInviteModal = ref(false)
const showManageModal = ref(false)
const errorMessage = ref('')
const inviteError = ref('')
const manageError = ref('')
const search = ref('')
const members = ref([])
const currentProjectId = ref('')
const currentProjectName = ref('')
const currentRole = ref('')
const selectedMember = ref(null)

const inviteForm = ref({
  email: '',
  role: 'member'
})

const manageForm = ref({
  role: '',
  status: ''
})

const roleMeta = computed(() => [
  { name: 'Owner', key: 'owner', icon: 'workspace_premium', color: 'text-amber-500', desc: t('partner.members.owner_desc') },
  { name: 'Admin', key: 'admin', icon: 'admin_panel_settings', color: 'text-cyan-500', desc: t('partner.members.admin_desc') },
  { name: 'Manager', key: 'manager', icon: 'supervisor_account', color: 'text-indigo-500', desc: t('partner.members.manager_desc') },
  { name: 'Member', key: 'member', icon: 'person', color: 'text-emerald-500', desc: t('partner.members.member_desc') },
  { name: 'Viewer', key: 'viewer', icon: 'visibility', color: 'text-slate-400', desc: t('partner.members.viewer_desc') }
])

const roleCards = computed(() => {
  return roleMeta.value.map(role => ({
    ...role,
    count: members.value.filter(member => member.role === role.key).length
  }))
})

const filteredMembers = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return members.value

  return members.value.filter(member => {
    return [member.name, member.email, member.role].some(value => String(value || '').toLowerCase().includes(keyword))
  })
})

const isCurrentUser = (member) => {
   return member.email === loggedInUser.value?.email;
}

const canManage = (member) => {
   if (!['owner', 'admin'].includes(currentRole.value)) return false;
   if (isCurrentUser(member)) return false; // Không tự quản lý chính mình
   return true;
}

const organizationHeaders = () => {
  const organizationId = props.organizationId || (process.client ? localStorage.getItem('orbit_current_organization_id') : '')

  return {
    'Authorization': `Bearer ${token.value}`,
    'Accept': 'application/json',
    ...(organizationId ? { 'X-Organization-Id': organizationId } : {})
  }
}

const fetchMembers = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res = await $fetch(`${config.public.apiBase}/partner/organization/members`, {
      headers: organizationHeaders()
    })

    members.value = res.data || []
    currentProjectId.value = res.organization_id || ''
    currentProjectName.value = res.organization_name || ''
    currentRole.value = res.current_role || ''
  } catch (err) {
    errorMessage.value = err.response?._data?.message || 'Không thể tải danh sách thành viên.'
  } finally {
    loading.value = false
  }
}

const inviteMember = async () => {
  inviteLoading.value = true
  inviteError.value = ''

  try {
    await $fetch(`${config.public.apiBase}/partner/organization/members`, {
      method: 'POST',
      headers: organizationHeaders(),
      body: inviteForm.value
    })

    inviteForm.value = { email: '', role: 'member' }
    showInviteModal.value = false
    await fetchMembers()
  } catch (err) {
    inviteError.value = err.response?._data?.message || 'Không thể thêm nhân viên.'
  } finally {
    inviteLoading.value = false
  }
}

const openManageModal = (member) => {
   selectedMember.value = member
   manageForm.value.role = member.role
   manageForm.value.status = member.status
   manageError.value = ''
   showManageModal.value = true
}

const updateRole = async () => {
   manageLoading.value = true
   manageError.value = ''
   try {
      await $fetch(`${config.public.apiBase}/partner/organization/members/${selectedMember.value.id}/role`, {
         method: 'PUT',
         headers: organizationHeaders(),
         body: { role: manageForm.value.role }
      })
      await fetchMembers()
      showManageModal.value = false
   } catch (err) {
      manageError.value = err.response?._data?.message || 'Lỗi khi cập nhật vai trò.'
   } finally {
      manageLoading.value = false
   }
}

const toggleStatus = async () => {
   manageLoading.value = true
   manageError.value = ''
   const newStatus = manageForm.value.status === 'active' ? 'inactive' : 'active'
   try {
      await $fetch(`${config.public.apiBase}/partner/organization/members/${selectedMember.value.id}/status`, {
         method: 'PATCH',
         headers: organizationHeaders(),
         body: { status: newStatus }
      })
      await fetchMembers()
      showManageModal.value = false
   } catch (err) {
      manageError.value = err.response?._data?.message || 'Lỗi khi cập nhật trạng thái.'
   } finally {
      manageLoading.value = false
   }
}

const removeMember = async () => {
   if (!confirm(t('partner.members.remove_confirm', { name: selectedMember.value.name || selectedMember.value.email }))) {
      return
   }
   manageLoading.value = true
   manageError.value = ''
   try {
      await $fetch(`${config.public.apiBase}/partner/organization/members/${selectedMember.value.id}`, {
         method: 'DELETE',
         headers: organizationHeaders()
      })
      await fetchMembers()
      showManageModal.value = false
   } catch (err) {
      manageError.value = err.response?._data?.message || 'Lỗi khi xóa thành viên.'
   } finally {
      manageLoading.value = false
   }
}

const initials = (member) => {
  const source = member.name || member.email || '?'
  return source
    .split(/[ @._-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

const permissionText = (permissions = []) => {
  if (!permissions.length) return t('partner.members.limited_access')
  if (permissions.includes('billing.manage')) return t('partner.members.full_access')
  if (permissions.includes('member.manage')) return t('partner.members.manage_access')
  if (permissions.includes('analytics.team.view')) return t('partner.members.team_access')
  if (permissions.includes('bot.chat')) return t('partner.members.chat_access')
  return permissions.join(', ')
}

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US')
}

const roleBadge = (role) => {
  const badges = {
    owner: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
    admin: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-300',
    manager: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300',
    member: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    viewer: 'bg-slate-500/10 text-slate-500 dark:text-slate-300'
  }
  return badges[role] || badges.viewer
}

onMounted(fetchMembers)

watch(() => props.organizationId, () => {
  fetchMembers()
})
</script>
