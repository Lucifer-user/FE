<template>
  <BaseModal v-model="open" :title="editing ? t('admin_billing.topup_modal_edit') : t('admin_billing.topup_modal_create')" :description="t('admin_billing.topup_modal_desc')" :busy="busy" size="lg">
    <form id="topup-form" class="grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <div v-if="!editing"><label :class="labelClass">{{ t('admin_billing.field_code') }} *</label><input v-model.trim="form.code" :class="inputClass" /><FieldError :errors="errors.code" /></div>
      <div :class="editing ? 'sm:col-span-2' : ''"><label :class="labelClass">{{ t('admin_billing.field_name') }} *</label><input v-model.trim="form.name" :class="inputClass" /><FieldError :errors="errors.name" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_price') }} *</label><input v-model="form.price" type="number" min="0" step="1" :class="inputClass" /><FieldError :errors="errors.price" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_currency') }} *</label><input v-model.trim="form.currency" maxlength="3" :class="inputClass" /><FieldError :errors="errors.currency" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_token_amount') }} *</label><input v-model="form.token_amount" type="number" min="1" step="1" :class="inputClass" /><FieldError :errors="errors.token_amount" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_sort_order') }} *</label><input v-model="form.sort_order" type="number" min="0" step="1" :class="inputClass" /><FieldError :errors="errors.sort_order" /></div>
      <div class="flex flex-wrap items-center gap-6 sm:col-span-2">
        <label class="inline-flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"><input v-model="form.is_sellable" type="checkbox" class="h-4 w-4 rounded text-cyan-600" /> {{ t('admin_billing.sellable') }}</label>
        <label class="inline-flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"><input v-model="form.is_visible" type="checkbox" class="h-4 w-4 rounded text-cyan-600" /> {{ t('admin_billing.visible') }}</label>
      </div>
      <div class="sm:col-span-2"><label :class="labelClass">{{ t('admin_billing.reason') }} {{ editing ? '*' : '' }}</label><textarea v-model="form.reason" rows="3" maxlength="1000" :class="inputClass" :placeholder="t('admin_billing.reason_audit_placeholder')"></textarea><FieldError :errors="errors.reason" /></div>
    </form>
    <template #footer><div class="flex justify-end gap-3"><button type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold dark:border-white/10" :disabled="busy" @click="open = false">{{ t('admin_billing.cancel') }}</button><button form="topup-form" type="submit" class="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50" :disabled="busy">{{ busy ? t('admin_billing.saving') : (editing ? t('admin_billing.update') : t('admin_billing.create_topup')) }}</button></div></template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { BillingTopupPackage, FieldErrors } from '~/types/admin-billing'
import { toBillingInteger } from '~/utils/adminBilling'
import BaseModal from './BaseModal.vue'
import FieldError from './FieldError.vue'
const { t } = useI18n()
const props = withDefaults(defineProps<{ modelValue: boolean; item?: BillingTopupPackage | null; busy?: boolean; serverErrors?: FieldErrors }>(), { item: null, busy: false, serverErrors: () => ({}) })
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; submit: [payload: Record<string, unknown>] }>()
const open = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) })
const editing = computed(() => Boolean(props.item))
const form = reactive<Record<string, any>>({})
const localErrors = ref<FieldErrors>({})
const errors = computed(() => ({ ...localErrors.value, ...props.serverErrors }))
const labelClass = 'mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-200'
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white'
watch(() => props.modelValue, value => { if (value) { const item = props.item; Object.assign(form, { code: item?.code || '', name: item?.name || '', price: item?.price ?? '', currency: item?.currency || 'VND', token_amount: item?.token_amount ?? '', is_sellable: item?.is_sellable ?? true, is_visible: item?.is_visible ?? true, sort_order: item?.sort_order ?? '', reason: '' }); localErrors.value = {} } })
const submit = () => {
  if (props.busy) return
  const next: FieldErrors = {}
  const price = toBillingInteger(form.price); const tokens = toBillingInteger(form.token_amount); const order = toBillingInteger(form.sort_order)
  if (!editing.value && !String(form.code).trim()) next.code = [t('admin_billing.field_code') + ' ' + t('admin_billing.required') + '.']
  if (!String(form.name).trim()) next.name = [t('admin_billing.field_name') + ' ' + t('admin_billing.required') + '.']
  if (price === null || price < 0) next.price = [t('admin_billing.validation_price_integer')]
  if (tokens === null || tokens <= 0) next.token_amount = [t('admin_billing.validation_token_positive')]
  if (order === null || order < 0) next.sort_order = [t('admin_billing.validation_order_nonnegative')]
  if (editing.value && !String(form.reason).trim()) next.reason = [t('admin_billing.required_reason')]
  localErrors.value = next; if (Object.keys(next).length) return
  const payload: Record<string, unknown> = { name: String(form.name).trim(), price, currency: String(form.currency).trim().toUpperCase(), token_amount: tokens, is_sellable: Boolean(form.is_sellable), is_visible: Boolean(form.is_visible), sort_order: order, reason: String(form.reason).trim() || undefined }
  if (!editing.value) payload.code = String(form.code).trim().toLowerCase()
  emit('submit', payload)
}
</script>
