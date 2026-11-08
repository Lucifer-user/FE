<template>
  <BaseModal v-model="open" :title="title" :description="description" :busy="busy" size="md">
    <div v-if="warning" class="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">{{ warning }}</div>
    <label class="block text-sm font-bold text-slate-700 dark:text-slate-200">{{ t('admin_billing.reason') }} <span class="text-rose-500">*</span></label>
    <textarea v-model="reason" rows="4" maxlength="1000" class="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white" :placeholder="t('admin_billing.action_reason_placeholder')"></textarea>
    <p v-if="error" class="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">{{ error }}</p>
    <template #footer>
      <div class="flex justify-end gap-3">
        <button type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold dark:border-white/10" :disabled="busy" @click="open = false">{{ t('admin_billing.cancel') }}</button>
        <button type="button" class="rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50" :class="danger ? 'bg-rose-600' : 'bg-cyan-600'" :disabled="busy" @click="submit">
          {{ busy ? t('admin_billing.saving') : (actionLabel || t('admin_billing.confirm')) }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'
const { t } = useI18n()

const props = withDefaults(defineProps<{ modelValue: boolean; title: string; description?: string; warning?: string; actionLabel?: string; busy?: boolean; danger?: boolean; serverError?: string }>(), { description: '', warning: '', actionLabel: '', busy: false, danger: false, serverError: '' })
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; submit: [reason: string] }>()
const reason = ref('')
const localError = ref('')
const open = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) })
const error = computed(() => props.serverError || localError.value)
watch(() => props.modelValue, value => { if (value) { reason.value = ''; localError.value = '' } })
const submit = () => {
  if (!reason.value.trim()) { localError.value = t('admin_billing.required_reason'); return }
  if (!props.busy) emit('submit', reason.value.trim())
}
</script>
