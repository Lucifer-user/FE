<template>
  <div class="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <PageHeader :title="t('admin_billing.overview_title')" :description="t('admin_billing.overview_desc')" />
      <PageState :loading="loading" :error="error" :empty="isEmpty" :empty-text="t('admin_billing.overview_empty')" @retry="load">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <NuxtLink v-for="card in cards" :key="card.to" :to="card.to" class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:bg-white/5">
            <div class="flex items-center justify-between"><span class="material-symbols-outlined text-2xl text-cyan-600 dark:text-cyan-300">{{ card.icon }}</span><span class="material-symbols-outlined text-slate-300 transition group-hover:translate-x-1">arrow_forward</span></div>
            <p class="mt-5 text-3xl font-black text-slate-950 dark:text-white">{{ formatBillingNumber(card.value) }}</p>
            <p class="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">{{ card.label }}</p>
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-8 lg:grid-cols-3">
          <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 class="mb-6 text-lg font-extrabold text-slate-900 dark:text-white">{{ t('admin_billing.revenue_30d') }}</h2>
            <BillingRevenueChart v-if="statsData.revenue_chart" :data="statsData.revenue_chart" />
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 class="mb-6 text-lg font-extrabold text-slate-900 dark:text-white">{{ t('admin_billing.org_by_plan') }}</h2>
            <BillingOrgChart v-if="statsData.organization_chart" :data="statsData.organization_chart" />
          </div>
        </div>
      </PageState>
      
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h2 class="text-lg font-extrabold text-slate-900 dark:text-white">{{ t('admin_billing.quick_access') }}</h2>
          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <NuxtLink v-for="link in quickLinks" :key="link.to" :to="link.to" class="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 dark:bg-black/20 dark:text-slate-200 dark:hover:bg-cyan-500/10"><span class="material-symbols-outlined text-lg">{{ link.icon }}</span>{{ link.label }}</NuxtLink>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/admin/billing/PageHeader.vue'
import PageState from '~/components/admin/billing/PageState.vue'
import BillingRevenueChart from '~/components/admin/billing/BillingRevenueChart.vue'
import BillingOrgChart from '~/components/admin/billing/BillingOrgChart.vue'
import { formatBillingNumber } from '~/utils/adminBilling'
import { getAdminBillingErrorMessage } from '~/composables/useAdminBilling'

definePageMeta({ layout: 'layout-admin' })
const api = useAdminBilling()
const loading = ref(true)
const error = ref('')
const { t } = useI18n()

const counts = reactive({ plans: 0, topups: 0, pending: 0, expiring: 0, total_revenue: 0 })
const statsData = reactive({ revenue_chart: [], organization_chart: [] })

const isEmpty = computed(() => !loading.value && !error.value && Object.values(counts).every((count) => count === 0))

const cards = computed(() => [
  { label: t('admin_billing.total_revenue'), value: counts.total_revenue, icon: 'payments', to: '/admin/billing/payments' },
  { label: t('admin_billing.service_plans'), value: counts.plans, icon: 'workspace_premium', to: '/admin/billing/plans' },
  { label: t('admin_billing.topup_packages'), value: counts.topups, icon: 'toll', to: '/admin/billing/topup-packages' },
  { label: t('admin_billing.status_pending'), value: counts.pending, icon: 'pending_actions', to: '/admin/billing/payments?status=pending' },
  { label: t('admin_billing.organizations'), value: counts.expiring, icon: 'schedule', to: '/admin/billing/organizations?plan_status=expiring_soon' },
])

const quickLinks = computed(() => [
  { label: t('admin_billing.service_plans'), icon: 'workspace_premium', to: '/admin/billing/plans' }, { label: t('admin_billing.topup_packages'), icon: 'toll', to: '/admin/billing/topup-packages' },
  { label: t('admin_billing.transactions'), icon: 'receipt_long', to: '/admin/billing/payments' }, { label: t('admin_billing.organizations'), icon: 'apartment', to: '/admin/billing/organizations' },
  { label: t('admin_billing.audit_logs'), icon: 'history', to: '/admin/billing/audit-logs' },
])

const load = async () => { 
  loading.value = true
  error.value = ''
  try { 
    const response = await api.getStats()
    const { overview, revenue_chart, organization_chart } = response.data
    counts.plans = overview.plans
    counts.topups = overview.topups
    counts.pending = overview.pending
    counts.expiring = overview.expiring
    counts.total_revenue = overview.total_revenue || 0
    statsData.revenue_chart = revenue_chart || []
    statsData.organization_chart = organization_chart || []
  } catch (e) { 
    error.value = getAdminBillingErrorMessage(e) 
  } finally { 
    loading.value = false 
  } 
}

onMounted(load)
</script>

