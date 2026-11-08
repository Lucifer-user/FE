<template>
  <BaseModal v-model="open" :title="editing ? t('admin_billing.plan_modal_edit') : t('admin_billing.plan_modal_create')" :description="t('admin_billing.plan_modal_desc')" :busy="busy" size="xl">
    <form id="billing-plan-form" class="grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
      <div v-if="!editing">
        <label :class="labelClass">{{ t('admin_billing.field_code') }} *</label>
        <input v-model.trim="form.code" :class="inputClass" placeholder="business_pro" />
        <FieldError :errors="errors.code" />
      </div>
      <div :class="editing ? 'sm:col-span-2' : ''">
        <label :class="labelClass">{{ t('admin_billing.field_name') }} *</label>
        <input v-model.trim="form.name" :class="inputClass" />
        <FieldError :errors="errors.name" />
      </div>
      <div class="sm:col-span-2">
        <label :class="labelClass">{{ t('admin_billing.field_description') }}</label>
        <textarea v-model="form.description" rows="3" :class="inputClass"></textarea>
        <FieldError :errors="errors.description" />
      </div>
      <div><label :class="labelClass">{{ t('admin_billing.field_monthly_price') }} *</label><input v-model="form.monthly_price" type="number" min="0" step="1" :disabled="isDefault" :class="inputClass" /><FieldError :errors="errors.monthly_price" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_annual_price') }} *</label><input v-model="form.annual_price" type="number" min="0" step="1" :disabled="isDefault" :class="inputClass" /><FieldError :errors="errors.annual_price" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_annual_discount') }}</label><input v-model="form.annual_discount_percent" type="number" min="0" max="100" step="0.01" :disabled="isDefault" :class="inputClass" /><FieldError :errors="errors.annual_discount_percent" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_currency') }} *</label><input v-model.trim="form.currency" maxlength="3" :class="inputClass" /><FieldError :errors="errors.currency" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_rank') }} *</label><input v-model="form.rank" type="number" min="0" step="1" :class="inputClass" /><FieldError :errors="errors.rank" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_token_limit') }}</label><input v-model="form.token_limit" type="number" min="-1" step="1" :class="inputClass" /><FieldError :errors="errors.token_limit" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_chatbot_limit') }}</label><input v-model="form.chatbot_limit" type="number" min="-1" step="1" :class="inputClass" /><FieldError :errors="errors.chatbot_limit" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_document_limit') }}</label><input v-model="form.document_limit" type="number" min="-1" step="1" :class="inputClass" /><FieldError :errors="errors.document_limit" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_storage_limit') }}</label><input v-model="form.storage_limit" type="number" min="-1" step="1" :class="inputClass" /><FieldError :errors="errors.storage_limit" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_member_limit') }}</label><input v-model="form.member_limit" type="number" min="-1" step="1" :class="inputClass" /><FieldError :errors="errors.member_limit" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_duration_months') }} *</label><input v-model="form.duration_months" type="number" min="1" max="120" step="1" :class="inputClass" /><FieldError :errors="errors.duration_months" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_duration_annual') }}</label><input v-model="form.duration_months_annual" type="number" min="1" max="120" step="1" :class="inputClass" /><FieldError :errors="errors.duration_months_annual" /></div>
      <div class="sm:col-span-2 rounded-xl border border-cyan-500/20 bg-cyan-50/60 p-4 text-sm dark:bg-cyan-400/5">
        <p class="mb-2 font-bold text-slate-700 dark:text-slate-200">{{ t('admin_billing.annual_preview') }}</p>
        <div class="grid gap-1 text-slate-600 dark:text-slate-300">
          <span>{{ t('admin_billing.original_annual_price', { price: formatPreviewMoney(form.annual_price, form.currency) }) }}</span>
          <span>{{ t('admin_billing.discount_value', { percent: normalizedDiscount }) }}</span>
          <span class="font-bold text-cyan-700 dark:text-cyan-300">{{ t('admin_billing.customer_price', { price: formatPreviewMoney(finalAnnualPrice, form.currency), months: annualDurationPreview }) }}</span>
        </div>
      </div>
      <div><label :class="labelClass">{{ t('admin_billing.field_sort_order') }} *</label><input v-model="form.sort_order" type="number" min="0" step="1" :class="inputClass" /><FieldError :errors="errors.sort_order" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.field_effective_from') }}</label><input v-model="form.effective_from" type="datetime-local" :class="inputClass" /><FieldError :errors="errors.effective_from" /></div>
      <div class="flex flex-wrap items-center gap-6 sm:col-span-2">
        <label class="inline-flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"><input v-model="form.is_sellable" type="checkbox" :disabled="isDefault" class="h-4 w-4 rounded text-cyan-600" /> {{ t('admin_billing.sellable') }}</label>
        <label class="inline-flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200"><input v-model="form.is_visible" type="checkbox" class="h-4 w-4 rounded text-cyan-600" /> {{ t('admin_billing.visible') }}</label>
        <span v-if="isDefault" class="text-xs font-semibold text-amber-700 dark:text-amber-300">{{ t('admin_billing.default_free_note') }}</span>
      </div>
      <div class="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <div class="mb-3">
          <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ t('admin_billing.integration_advanced') }}</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ t('admin_billing.integration_hint') }}</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-400 dark:border-white/10 dark:bg-black/10">
            <input v-model="form.allow_web_widget" type="checkbox" class="mt-0.5 h-4 w-4 rounded text-cyan-600" />
            <span><span class="block text-sm font-bold text-slate-700 dark:text-slate-200">{{ t('admin_billing.web_widget') }}</span><span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{{ t('admin_billing.web_widget_desc') }}</span></span>
          </label>
          <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-400 dark:border-white/10 dark:bg-black/10">
            <input v-model="form.allow_telegram" type="checkbox" class="mt-0.5 h-4 w-4 rounded text-cyan-600" />
            <span><span class="block text-sm font-bold text-slate-700 dark:text-slate-200">{{ t('admin_billing.telegram') }}</span><span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{{ t('admin_billing.telegram_desc') }}</span></span>
          </label>
          <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-400 dark:border-white/10 dark:bg-black/10">
            <input v-model="form.allow_members" type="checkbox" class="mt-0.5 h-4 w-4 rounded text-cyan-600" />
            <span><span class="block text-sm font-bold text-slate-700 dark:text-slate-200">{{ t('admin_billing.members') }}</span><span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{{ t('admin_billing.members_desc') }}</span></span>
          </label>
          <label class="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-cyan-400 dark:border-white/10 dark:bg-black/10">
            <input v-model="form.allow_departments" type="checkbox" class="mt-0.5 h-4 w-4 rounded text-cyan-600" />
            <span><span class="block text-sm font-bold text-slate-700 dark:text-slate-200">{{ t('admin_billing.departments') }}</span><span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{{ t('admin_billing.departments_desc') }}</span></span>
          </label>
        </div>
      </div>
      <div class="sm:col-span-2 -mt-3"><FieldError :errors="errors.is_sellable || errors.is_visible" /></div>
      <div class="sm:col-span-2">
        <label :class="labelClass">{{ t('admin_billing.benefits') }}</label>
        <p class="mb-2 text-xs text-slate-500">{{ t('admin_billing.benefits_hint') }}</p>
        <textarea v-model="benefitsText" rows="5" :class="inputClass"></textarea>
        <FieldError :errors="errors.benefits" />
      </div>
      <div class="sm:col-span-2">
        <label :class="labelClass">{{ t('admin_billing.reason') }} {{ editing ? '*' : '' }}</label>
        <textarea v-model="form.reason" rows="3" maxlength="1000" :class="inputClass" :placeholder="t('admin_billing.reason_audit_placeholder')"></textarea>
        <FieldError :errors="errors.reason" />
      </div>
    </form>
    <template #footer>
      <div class="flex justify-end gap-3">
        <button type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold dark:border-white/10" :disabled="busy" @click="open = false">{{ t('admin_billing.cancel') }}</button>
        <button form="billing-plan-form" type="submit" class="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50" :disabled="busy">{{ busy ? t('admin_billing.saving') : (editing ? t('admin_billing.update') : t('admin_billing.create_plan')) }}</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { BillingPlan, FieldErrors } from '~/types/admin-billing'
import { toBillingInteger } from '~/utils/adminBilling'
import BaseModal from './BaseModal.vue'
import FieldError from './FieldError.vue'

const { t, locale } = useI18n()
const props = withDefaults(defineProps<{ modelValue: boolean; plan?: BillingPlan | null; busy?: boolean; serverErrors?: FieldErrors }>(), { plan: null, busy: false, serverErrors: () => ({}) })
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; submit: [payload: Record<string, unknown>] }>()
const open = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) })
const editing = computed(() => Boolean(props.plan))
const form = reactive<Record<string, any>>({})
const benefitsText = ref('')
const benefitsAreObject = ref(false)
const localErrors = ref<FieldErrors>({})
const errors = computed(() => ({ ...localErrors.value, ...props.serverErrors }))
const isDefault = computed(() => Boolean(editing.value && props.plan?.is_default))
const labelClass = 'mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-200'
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500 disabled:bg-slate-100 dark:border-white/10 dark:bg-black/20 dark:text-white dark:disabled:bg-white/5'

const reset = () => {
  const plan = props.plan
  const planBenefits = plan?.benefits && !Array.isArray(plan.benefits) && typeof plan.benefits === 'object'
    ? plan.benefits as Record<string, unknown>
    : {}
  Object.assign(form, {
    code: plan?.code || '', name: plan?.name || '', description: plan?.description ?? '',
    monthly_price: plan?.monthly_price ?? '', annual_price: plan?.annual_price ?? '', currency: plan?.currency || 'VND',
    annual_discount_percent: plan?.annual_discount_percent ?? 0,
    token_limit: plan?.token_limit ?? '', duration_months: plan?.duration_months ?? '', duration_months_annual: plan?.duration_months_annual ?? '',
    chatbot_limit: plan?.chatbot_limit ?? '', document_limit: plan?.document_limit ?? '', storage_limit: plan?.storage_limit ?? '', member_limit: plan?.member_limit ?? '',
    rank: plan?.rank ?? '', is_sellable: plan?.is_sellable ?? false, is_visible: plan?.is_visible ?? true, sort_order: plan?.sort_order ?? '',
    allow_web_widget: Boolean(planBenefits.allow_web_widget), allow_telegram: Boolean(planBenefits.allow_telegram),
    allow_members: Boolean(planBenefits.allow_members), allow_departments: Boolean(planBenefits.allow_departments),
    effective_from: plan?.effective_from ? String(plan.effective_from).slice(0, 16) : '', reason: '',
  })
  benefitsAreObject.value = Boolean(plan?.benefits && !Array.isArray(plan.benefits) && typeof plan.benefits === 'object')
  benefitsText.value = benefitsAreObject.value ? JSON.stringify(plan?.benefits, null, 2) : (Array.isArray(plan?.benefits) ? plan!.benefits.map(String).join('\n') : '')
  localErrors.value = {}
}
watch(() => props.modelValue, value => { if (value) reset() })
watch(isDefault, defaultPlan => { if (defaultPlan) { form.is_sellable = false; form.monthly_price = 0; form.annual_price = 0; form.annual_discount_percent = 0 } })

const normalizedDiscount = computed(() => {
  const value = Number(form.annual_discount_percent)
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0
})
const finalAnnualPrice = computed(() => Math.round((Number(form.annual_price) || 0) * (100 - normalizedDiscount.value) / 100))
const annualDurationPreview = computed(() => Number(form.duration_months_annual) || 12)
const formatPreviewMoney = (value: unknown, currency = 'VND') => {
  const amount = Number(value)
  return Number.isFinite(amount) ? `${new Intl.NumberFormat(locale.value === 'vi' ? 'vi-VN' : 'en-US').format(amount)} ${currency || 'VND'}` : '—'
}

const submit = () => {
  if (props.busy) return
  const requiredNumbers = ['monthly_price', 'annual_price', 'token_limit', 'duration_months', 'chatbot_limit', 'document_limit', 'rank', 'sort_order']
  const optionalNumbers = ['duration_months_annual', 'storage_limit', 'member_limit']
  const nextErrors: FieldErrors = {}
  if (!editing.value && !String(form.code).trim()) nextErrors.code = [t('admin_billing.field_code') + ' ' + t('admin_billing.required') + '.']
  if (!String(form.name).trim()) nextErrors.name = [t('admin_billing.field_name') + ' ' + t('admin_billing.required') + '.']
  if (editing.value && !String(form.reason).trim()) nextErrors.reason = [t('admin_billing.required_reason')]
  for (const field of requiredNumbers) if (toBillingInteger(form[field]) === null) nextErrors[field] = [t('admin_billing.validation_integer')]
  for (const field of optionalNumbers) if (form[field] !== '' && toBillingInteger(form[field]) === null) nextErrors[field] = [t('admin_billing.validation_integer')]
  if ((toBillingInteger(form.monthly_price) ?? -1) < 0) nextErrors.monthly_price = [t('admin_billing.validation_monthly_nonnegative')]
  if ((toBillingInteger(form.annual_price) ?? -1) < 0) nextErrors.annual_price = [t('admin_billing.validation_annual_nonnegative')]
  const rawDiscount = Number(form.annual_discount_percent)
  if (!Number.isFinite(rawDiscount) || rawDiscount < 0 || rawDiscount > 100) nextErrors.annual_discount_percent = [t('admin_billing.validation_discount_range')]
  for (const field of ['token_limit', 'chatbot_limit', 'document_limit']) if ((toBillingInteger(form[field]) ?? -2) < -1) nextErrors[field] = [t('admin_billing.validation_quota_min')]
  if (form.storage_limit !== '' && (toBillingInteger(form.storage_limit) ?? -2) < -1) nextErrors.storage_limit = [t('admin_billing.validation_quota_min')]
  if (form.member_limit !== '' && (toBillingInteger(form.member_limit) ?? -2) < -1) nextErrors.member_limit = [t('admin_billing.validation_quota_min')]
  if ((toBillingInteger(form.duration_months) ?? 0) < 1 || (toBillingInteger(form.duration_months) ?? 121) > 120) nextErrors.duration_months = [t('admin_billing.validation_duration_range')]
  if (!isDefault.value && form.is_sellable && (toBillingInteger(form.duration_months_annual) ?? 0) < 1) nextErrors.duration_months_annual = [t('admin_billing.validation_annual_duration_required')]
  if ((toBillingInteger(form.rank) ?? -1) < 0) nextErrors.rank = [t('admin_billing.validation_rank_negative')]
  if ((toBillingInteger(form.sort_order) ?? -1) < 0) nextErrors.sort_order = [t('admin_billing.validation_order_negative')]

  let benefits: unknown = []
  if (benefitsAreObject.value) {
    try { benefits = benefitsText.value.trim() ? JSON.parse(benefitsText.value) : {} } catch { nextErrors.benefits = [t('admin_billing.validation_json')] }
  } else benefits = benefitsText.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean)
  const featureBenefits = {
    allow_web_widget: Boolean(form.allow_web_widget),
    allow_telegram: Boolean(form.allow_telegram),
    allow_members: Boolean(form.allow_members),
    allow_departments: Boolean(form.allow_departments),
  }
  if (Array.isArray(benefits)) {
    benefits = { items: benefits, ...featureBenefits }
  } else if (benefits && typeof benefits === 'object') {
    benefits = { ...(benefits as Record<string, unknown>), ...featureBenefits }
  } else {
    benefits = featureBenefits
  }
  localErrors.value = nextErrors
  if (Object.keys(nextErrors).length) return

  const payload: Record<string, unknown> = {
    name: String(form.name).trim(), description: form.description || null,
    monthly_price: toBillingInteger(form.monthly_price), annual_price: toBillingInteger(form.annual_price), annual_discount_percent: Number(normalizedDiscount.value.toFixed(2)), currency: String(form.currency).trim().toUpperCase(),
    token_limit: toBillingInteger(form.token_limit), duration_months: toBillingInteger(form.duration_months), duration_months_annual: toBillingInteger(form.duration_months_annual),
    chatbot_limit: toBillingInteger(form.chatbot_limit), document_limit: toBillingInteger(form.document_limit), storage_limit: toBillingInteger(form.storage_limit), member_limit: toBillingInteger(form.member_limit),
    benefits, rank: toBillingInteger(form.rank), is_sellable: Boolean(form.is_sellable), is_visible: Boolean(form.is_visible), sort_order: toBillingInteger(form.sort_order),
    effective_from: form.effective_from || null, reason: String(form.reason).trim() || undefined,
  }
  if (!editing.value) payload.code = String(form.code).trim().toLowerCase()
  emit('submit', payload)
}
</script>
