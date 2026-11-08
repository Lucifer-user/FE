<template>
  <BaseModal v-model="open" :title="kind === 'plan' ? t('admin_billing.status_modal_plan') : t('admin_billing.status_modal_topup')" :busy="busy" size="md">
    <div class="space-y-4">
      <p class="text-sm text-slate-600 dark:text-slate-300">{{ itemName }}</p>
      <label class="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-bold dark:border-white/10">
        {{ t('admin_billing.allow_sell') }} <input v-model="sellable" type="checkbox" class="h-5 w-5" :disabled="isDefaultPlan" />
      </label>
      <FieldError :errors="serverErrors.is_sellable" />
      <label class="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-bold dark:border-white/10">
        {{ t('admin_billing.visible') }} <input v-model="visible" type="checkbox" class="h-5 w-5" />
      </label>
      <FieldError :errors="serverErrors.is_visible" />
      <p v-if="isDefaultPlan" class="text-xs font-semibold text-amber-700 dark:text-amber-300">{{ t('admin_billing.default_no_sell') }}</p>
      <div><label class="text-sm font-bold">{{ t('admin_billing.status_reason') }} *</label><textarea v-model="reason" rows="3" maxlength="1000" class="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-black/20 dark:text-white"></textarea><FieldError :errors="reasonError ? [reasonError] : serverErrors.reason" /></div>
    </div>
    <template #footer><div class="flex justify-end gap-3"><button type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold dark:border-white/10" :disabled="busy" @click="open = false">{{ t('admin_billing.cancel') }}</button><button type="button" class="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50" :disabled="busy" @click="submit">{{ busy ? t('admin_billing.saving') : t('admin_billing.update_status') }}</button></div></template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { FieldErrors } from '~/types/admin-billing'
import BaseModal from './BaseModal.vue'
import FieldError from './FieldError.vue'
const props = withDefaults(defineProps<{ modelValue: boolean; itemName: string; kind: 'plan' | 'topup'; initialSellable: boolean; initialVisible: boolean; defaultPlan?: boolean; busy?: boolean; serverErrors?: FieldErrors }>(), { defaultPlan: false, busy: false, serverErrors: () => ({}) })
const { t } = useI18n()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; submit: [payload: { is_sellable: boolean; is_visible: boolean; reason: string }] }>()
const open = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) })
const sellable = ref(false); const visible = ref(false); const reason = ref(''); const reasonError = ref('')
const isDefaultPlan = computed(() => props.defaultPlan)
watch(() => props.modelValue, value => { if (value) { sellable.value = isDefaultPlan.value ? false : props.initialSellable; visible.value = props.initialVisible; reason.value = ''; reasonError.value = '' } })
const submit = () => { if (!reason.value.trim()) { reasonError.value = t('admin_billing.required_reason'); return }; if (!props.busy) emit('submit', { is_sellable: isDefaultPlan.value ? false : sellable.value, is_visible: visible.value, reason: reason.value.trim() }) }
</script>
