<template>
  <BaseModal v-model="open" :title="content.title" :description="organization.name" :busy="busy" size="lg">
    <div class="space-y-5">
      <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">{{ content.warning }}</div>
      <template v-if="mode === 'change-plan'">
        <div><label :class="labelClass">{{ t('admin_billing.new_plan') }} *</label><select v-model="form.billing_plan_id" :class="inputClass"><option value="">{{ t('admin_billing.select_plan') }}</option><option v-for="plan in plans" :key="plan.id" :value="plan.id">{{ plan.name }} ({{ plan.code }})</option></select><FieldError :errors="errors.billing_plan_id || errors.plan_selector" /></div>
        <div><label :class="labelClass">{{ t('admin_billing.cycle') }} *</label><select v-model="form.billing_cycle" :class="inputClass"><option value="monthly">{{ t('admin_billing.monthly') }}</option><option value="annual">{{ t('admin_billing.annual') }}</option></select><FieldError :errors="errors.billing_cycle" /></div>
      </template>
      <div v-else-if="mode === 'extend'"><label :class="labelClass">{{ t('admin_billing.months_input') }} *</label><input v-model="form.months" type="number" min="1" max="120" step="1" :class="inputClass" /><FieldError :errors="errors.months" /></div>
      <div v-else-if="mode === 'grant' || mode === 'deduct'"><label :class="labelClass">{{ t('admin_billing.amount_token') }} *</label><input v-model="form.amount" type="number" min="1" step="1" :max="mode === 'deduct' ? organization.topup_tokens : undefined" :class="inputClass" /><p v-if="mode === 'deduct'" class="mt-1 text-xs text-slate-500">{{ t('admin_billing.topup_wallet', { amount: formatBillingNumber(organization.topup_tokens) }) }}</p><FieldError :errors="errors.amount" /></div>
      <div><label :class="labelClass">{{ t('admin_billing.reason') }} *</label><textarea v-model="form.reason" rows="4" maxlength="1000" :class="inputClass" :placeholder="t('admin_billing.audit_reason_placeholder')"></textarea><FieldError :errors="errors.reason" /></div>
    </div>
    <template #footer><div class="flex justify-end gap-3"><button type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold dark:border-white/10" :disabled="busy" @click="open = false">{{ t('admin_billing.cancel') }}</button><button type="button" class="rounded-xl px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50" :class="mode === 'deduct' || mode === 'reset' ? 'bg-rose-600' : 'bg-cyan-600'" :disabled="busy" @click="submit">{{ busy ? t('admin_billing.saving') : content.action }}</button></div></template>
  </BaseModal>
</template>

<script setup lang="ts">
import type { AdminBillingOrganization, BillingPlan, FieldErrors } from '~/types/admin-billing'; import { formatBillingNumber, toBillingInteger } from '~/utils/adminBilling'; import BaseModal from './BaseModal.vue'; import FieldError from './FieldError.vue'
type Mode = 'change-plan' | 'extend' | 'grant' | 'deduct' | 'reset'
const props = withDefaults(defineProps<{ modelValue: boolean; mode: Mode; organization: AdminBillingOrganization; plans?: BillingPlan[]; busy?: boolean; serverErrors?: FieldErrors }>(), { plans: () => [], busy: false, serverErrors: () => ({}) })
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; submit: [payload: { mode: Mode; billingPlanId?: number; billingCycle?: 'monthly'|'annual'; months?: number; amount?: number; reason: string }] }>()
const { t } = useI18n()
const open = computed({ get: () => props.modelValue, set: value => emit('update:modelValue', value) }); const form = reactive<Record<string, any>>({}); const localErrors = ref<FieldErrors>({}); const errors = computed(() => ({ ...localErrors.value, ...props.serverErrors })); const labelClass = 'mb-1.5 block text-sm font-bold text-slate-700 dark:text-slate-200'; const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white'
const content = computed(() => ({
  'change-plan': { title: t('admin_billing.action_change_plan'), action: t('admin_billing.action_apply_plan'), warning: t('admin_billing.warning_change_plan') },
  extend: { title: t('admin_billing.action_extend'), action: t('admin_billing.action_extend'), warning: t('admin_billing.warning_extend') },
  grant: { title: t('admin_billing.action_grant'), action: t('admin_billing.action_grant'), warning: t('admin_billing.warning_grant') },
  deduct: { title: t('admin_billing.action_deduct'), action: t('admin_billing.action_deduct'), warning: t('admin_billing.warning_deduct') },
  reset: { title: t('admin_billing.action_reset'), action: t('admin_billing.confirm'), warning: t('admin_billing.warning_reset') },
}[props.mode]))
watch(() => props.modelValue, value => { if (value) { Object.assign(form, { billing_plan_id: '', billing_cycle: 'monthly', months: '', amount: '', reason: '' }); localErrors.value = {} } })
const submit = () => { if (props.busy) return; const next: FieldErrors = {}; const reason = String(form.reason).trim(); if (!reason) next.reason = [t('admin_billing.required_reason')]; const payload: any = { mode: props.mode, reason }
  if (props.mode === 'change-plan') { const id = toBillingInteger(form.billing_plan_id); if (!id || id < 1) next.billing_plan_id = [t('admin_billing.validation_select_plan')]; else payload.billingPlanId = id; payload.billingCycle = form.billing_cycle }
  if (props.mode === 'extend') { const months = toBillingInteger(form.months); if (!months || months < 1 || months > 120) next.months = [t('admin_billing.validation_months')]; else payload.months = months }
  if (props.mode === 'grant' || props.mode === 'deduct') { const amount = toBillingInteger(form.amount); if (!amount || amount < 1) next.amount = [t('admin_billing.validation_token_positive')]; else if (props.mode === 'deduct' && amount > props.organization.topup_tokens) next.amount = [t('admin_billing.validation_token_wallet')]; else payload.amount = amount }
  localErrors.value = next; if (!Object.keys(next).length) emit('submit', payload)
}
</script>
