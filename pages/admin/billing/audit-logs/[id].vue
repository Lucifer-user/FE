<template>
  <div class="min-h-screen px-4 py-8 sm:px-6 lg:px-8"><div class="mx-auto max-w-6xl space-y-6">
    <PageHeader :title="t('admin_billing.audit_detail_title')" :description="t('admin_billing.audit_detail_desc')" back-to="/admin/billing/audit-logs" />
    <PageState :loading="loading" :error="error" :empty="!log" :empty-text="t('admin_billing.audit_not_found')" @retry="load"><template v-if="log">
      <section class="detail-card"><dl class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><div><dt>{{ t('admin_billing.header_action') }}</dt><dd><code>{{ log.action }}</code></dd></div><div><dt>{{ t('admin_billing.header_time_short') }}</dt><dd>{{ formatBillingDate(log.created_at, true) }}</dd></div><div><dt>{{ t('admin_billing.header_admin') }}</dt><dd>{{ log.admin?.name || '—' }}</dd><dd class="text-xs text-slate-500">{{ log.admin?.email || '—' }}</dd></div><div><dt>{{ t('admin_billing.organization_id') }}</dt><dd class="break-all font-mono text-xs">{{ log.organization_id || '—' }}</dd></div><div><dt>{{ t('admin_billing.target_type') }}</dt><dd>{{ log.target_type }}</dd></div><div><dt>{{ t('admin_billing.target_id') }}</dt><dd class="break-all font-mono text-xs">{{ log.target_id }}</dd></div><div class="sm:col-span-2"><dt>{{ t('admin_billing.header_reason') }}</dt><dd>{{ log.reason || '—' }}</dd></div></dl></section>
      <div class="grid gap-4 lg:grid-cols-2"><section class="detail-card"><h2 class="section-title">{{ t('admin_billing.old_values') }}</h2><pre>{{ formatBillingJson(log.old_values) }}</pre></section><section class="detail-card"><h2 class="section-title">{{ t('admin_billing.new_values') }}</h2><pre>{{ formatBillingJson(log.new_values) }}</pre></section></div><section class="detail-card"><h2 class="section-title">{{ t('admin_billing.metadata') }}</h2><pre>{{ formatBillingJson(log.metadata) }}</pre></section>
    </template></PageState>
  </div></div>
</template>

<script setup lang="ts">
import type { BillingAuditLog } from '~/types/admin-billing'; import PageHeader from '~/components/admin/billing/PageHeader.vue'; import PageState from '~/components/admin/billing/PageState.vue'; import { formatBillingDate, formatBillingJson } from '~/utils/adminBilling'
const { t } = useI18n()
definePageMeta({ layout: 'layout-admin' }); const route = useRoute(); const api = useAdminBilling(); const log = ref<BillingAuditLog | null>(null); const loading = ref(true); const error = ref(''); const load = async () => { loading.value = true; error.value = ''; try { log.value = (await api.getAuditLog(String(route.params.id))).data } catch (e) { error.value = getAdminBillingErrorMessage(e) } finally { loading.value = false } }; onMounted(load)
</script>
<style scoped>.detail-card{ @apply rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5; }.section-title{ @apply mb-4 text-base font-extrabold dark:text-white; }dt{ @apply text-xs font-bold uppercase tracking-wide text-slate-500; }dd{ @apply mt-1 font-semibold text-slate-900 dark:text-slate-100; }pre{ @apply max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100; }</style>
