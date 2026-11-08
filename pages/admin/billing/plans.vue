<template>
  <div class="min-h-screen px-4 py-8 sm:px-6 lg:px-8"><div class="mx-auto max-w-[1500px] space-y-6">
    <PageHeader :title="t('admin_billing.plans_title')" :description="t('admin_billing.plans_desc')"><button type="button" class="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-bold text-white" @click="openCreate"><span class="material-symbols-outlined text-lg">add</span>{{ t('admin_billing.create_plan') }}</button></PageHeader>
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
      <form class="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-5 dark:border-white/10" @submit.prevent="applyFilters">
        <input v-model.trim="filters.search" class="billing-input lg:col-span-2" :placeholder="t('admin_billing.search_plan')" />
        <select v-model="filters.is_sellable" class="billing-input"><option value="">{{ t('admin_billing.all_sale_statuses') }}</option><option value="1">{{ t('admin_billing.sellable') }}</option><option value="0">{{ t('admin_billing.not_sellable') }}</option></select>
        <select v-model="filters.is_visible" class="billing-input"><option value="">{{ t('admin_billing.all_visibility') }}</option><option value="1">{{ t('admin_billing.visible') }}</option><option value="0">{{ t('admin_billing.hidden') }}</option></select>
        <button class="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-slate-900">{{ t('admin_billing.filter') }}</button>
      </form>
      <PageState :loading="loading" :error="error" :empty="!plans.length" :empty-text="t('admin_billing.no_plans')" @retry="load">
        <div class="overflow-x-auto">
          <table class="min-w-full w-full text-left text-sm">
            <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-black/20 dark:text-slate-400">
              <tr>
                <th class="px-3 py-4">{{ t('admin_billing.header_plan') }}</th>
                <th class="px-3 py-4 text-right">{{ t('admin_billing.header_monthly_annual') }}</th>
                <th class="px-3 py-4 text-right">{{ t('admin_billing.header_token') }}</th>
                <th class="px-3 py-4 text-right">{{ t('admin_billing.header_chatbot') }}</th>
                <th class="px-3 py-4 text-right">{{ t('admin_billing.header_document') }}</th>
                <th class="px-3 py-4 text-right">{{ t('admin_billing.header_storage') }}</th>
                <th class="px-3 py-4 text-right">{{ t('admin_billing.header_member') }}</th>
                <th class="px-3 py-4 text-center">{{ t('admin_billing.header_rank') }}</th>
                <th class="px-3 py-4 text-center">{{ t('admin_billing.header_status') }}</th>
                <th class="px-3 py-4 text-center">{{ t('admin_billing.header_order') }}</th>
                <th class="px-3 py-4 text-right">{{ t('admin_billing.header_effective_updated') }}</th>
                <th class="px-3 py-4 text-right">{{ t('admin_billing.header_actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-white/5">
              <tr v-for="plan in plans" :key="plan.id" class="hover:bg-slate-50/70 dark:hover:bg-white/[.03]">
                <td class="px-3 py-4">
                  <p class="font-extrabold text-slate-900 dark:text-white">{{ plan.name }}</p>
                  <code class="text-xs text-cyan-700 dark:text-cyan-300">{{ plan.code }}</code>
                  <p v-if="plan.is_default" class="mt-1 text-xs font-bold text-emerald-600">{{ t('admin_billing.default_plan') }}</p>
                </td>
                <td class="px-3 py-4 text-right font-semibold whitespace-nowrap">
                  {{ formatBillingMoney(plan.monthly_price, plan.currency) }}<br>
                  <span class="text-slate-500 font-normal">{{ formatBillingMoney(plan.annual_price, plan.currency) }}</span>
                </td>
                <td class="px-3 py-4 text-right">{{ formatBillingLimit(plan.token_limit) }}</td>
                <td class="px-3 py-4 text-right">{{ formatBillingLimit(plan.chatbot_limit) }}</td>
                <td class="px-3 py-4 text-right">{{ formatBillingLimit(plan.document_limit) }}</td>
                <td class="px-3 py-4 text-right">{{ formatBillingLimit(plan.storage_limit) }}</td>
                <td class="px-3 py-4 text-right">{{ formatBillingLimit(plan.member_limit) }}</td>
                <td class="px-3 py-4 text-center font-bold">{{ plan.rank }}</td>
                <td class="px-3 py-4">
                  <div class="flex flex-col items-center gap-1">
                    <StatusBadge :status="plan.is_sellable ? 'sellable' : 'not_sellable'" :label="plan.is_sellable ? t('admin_billing.sellable') : t('admin_billing.not_sellable')" />
                    <StatusBadge :status="plan.is_visible ? 'visible' : 'hidden'" :label="plan.is_visible ? t('admin_billing.visible') : t('admin_billing.hidden')" />
                  </div>
                </td>
                <td class="px-3 py-4 text-center">{{ plan.sort_order }}</td>
                <td class="px-3 py-4 text-right whitespace-nowrap">
                  {{ formatBillingDate(plan.effective_from, true) }}<br>
                  <span class="text-xs text-slate-500">{{ formatBillingDate(plan.updated_at, true) }}</span>
                </td>
                <td class="px-3 py-4">
                  <div class="flex flex-nowrap justify-end gap-2">
                    <button v-if="!plan.is_default" class="icon-button" :disabled="!canSetDefault(plan)" :title="t('admin_billing.set_default')" @click="openDefault(plan)">
                      <span class="material-symbols-outlined text-lg">star</span>
                    </button>
                    <button class="icon-button" :title="t('admin_billing.edit')" @click="openEdit(plan)">
                      <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button class="icon-button" :title="t('admin_billing.status_action')" @click="openStatus(plan)">
                      <span class="material-symbols-outlined text-lg">toggle_on</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div><Pagination :pagination="pagination" @change="changePage" />
      </PageState>
    </div>
    <PlanFormModal v-model="formOpen" :plan="selected" :busy="saving" :server-errors="fieldErrors" @submit="save" />
    <CatalogStatusModal v-if="selected" v-model="statusOpen" kind="plan" :item-name="selected.name" :initial-sellable="selected.is_sellable" :initial-visible="selected.is_visible" :default-plan="selected.is_default" :busy="saving" :server-errors="fieldErrors" @submit="saveStatus" />
  </div></div>
</template>

<script setup lang="ts">
import type { BillingPagination, BillingPlan, FieldErrors } from '~/types/admin-billing'
import PageHeader from '~/components/admin/billing/PageHeader.vue'; import PageState from '~/components/admin/billing/PageState.vue'; import Pagination from '~/components/admin/billing/Pagination.vue'; import StatusBadge from '~/components/admin/billing/StatusBadge.vue'; import PlanFormModal from '~/components/admin/billing/PlanFormModal.vue'; import CatalogStatusModal from '~/components/admin/billing/CatalogStatusModal.vue'
import { formatBillingDate, formatBillingLimit, formatBillingMoney } from '~/utils/adminBilling'
definePageMeta({ layout: 'layout-admin' })
const { t } = useI18n()
const api = useAdminBilling(); const toast = useToast(); const plans = ref<BillingPlan[]>([]); const pagination = ref<BillingPagination>({ current_page: 1, per_page: 20, total: 0, last_page: 1 }); const filters = reactive({ search: '', is_sellable: '', is_visible: '', page: 1, per_page: 20 }); const loading = ref(true); const saving = ref(false); const error = ref(''); const fieldErrors = ref<FieldErrors>({}); const formOpen = ref(false); const statusOpen = ref(false); const selected = ref<BillingPlan | null>(null)
const load = async () => { loading.value = true; error.value = ''; try { const response = await api.listPlans(filters); plans.value = response.data; pagination.value = response.pagination } catch (e) { error.value = getAdminBillingErrorMessage(e) } finally { loading.value = false } }
const applyFilters = () => { filters.page = 1; load() }; const changePage = (page: number) => { filters.page = page; load() }
const openCreate = () => { selected.value = null; fieldErrors.value = {}; formOpen.value = true }; const openEdit = async (plan: BillingPlan) => { fieldErrors.value = {}; try { selected.value = (await api.getPlan(plan.id)).data; formOpen.value = true } catch (e) { toast.error(getAdminBillingErrorMessage(e)) } }; const openStatus = (plan: BillingPlan) => { selected.value = plan; fieldErrors.value = {}; statusOpen.value = true }
const save = async (payload: Record<string, unknown>) => { if (saving.value) return; saving.value = true; fieldErrors.value = {}; try { if (selected.value) await api.updatePlan(selected.value.id, payload); else await api.createPlan(payload); toast.success(selected.value ? t('admin_billing.plan_updated') : t('admin_billing.plan_created')); formOpen.value = false; await load() } catch (e) { if (e instanceof AdminBillingError) fieldErrors.value = e.errors; toast.error(getAdminBillingErrorMessage(e)) } finally { saving.value = false } }
const saveStatus = async (payload: Record<string, unknown>) => { if (!selected.value || saving.value) return; saving.value = true; fieldErrors.value = {}; try { await api.updatePlanStatus(selected.value.id, payload); toast.success(t('admin_billing.plan_status_updated')); statusOpen.value = false; await load() } catch (e) { if (e instanceof AdminBillingError) fieldErrors.value = e.errors; toast.error(getAdminBillingErrorMessage(e)) } finally { saving.value = false } }
const canSetDefault = (plan: BillingPlan) => !plan.is_default && !plan.is_sellable && Number(plan.monthly_price) === 0 && Number(plan.annual_price) === 0 && Number(plan.annual_discount_percent || 0) === 0
const openDefault = async (plan: BillingPlan) => { if (!canSetDefault(plan) || !(await toast.askConfirm(t('admin_billing.default_confirm', { plan: plan.name })))) return; const reason = window.prompt(t('admin_billing.default_prompt'))?.trim(); if (!reason) return toast.error(t('admin_billing.required_reason')); saving.value = true; try { await api.setDefaultPlan(plan.id, reason); toast.success(t('admin_billing.default_updated')); await load() } catch (e) { if (e instanceof AdminBillingError) fieldErrors.value = e.errors; toast.error(getAdminBillingErrorMessage(e)) } finally { saving.value = false } }
onMounted(load)
</script>

<style scoped>.billing-input{ @apply w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-cyan-500 dark:border-white/10 dark:bg-black/20 dark:text-white; }.icon-button{ @apply rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-cyan-400 hover:text-cyan-600 dark:border-white/10 dark:text-slate-300; }</style>
