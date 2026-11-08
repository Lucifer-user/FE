import type {
  AdminBillingOrganization,
  AdminPayment,
  BillingAuditLog,
  BillingItemResponse,
  BillingListResponse,
  BillingPlan,
  BillingTopupPackage,
  FieldErrors,
} from '~/types/admin-billing'
import { compactBillingQuery, joinApiUrl } from '~/utils/adminBilling'

const errorMessages: Record<string, string> = {
  ADMIN_ONLY: 'Chỉ quản trị viên mới được thực hiện thao tác này.',
  BILLING_PLAN_NOT_FOUND: 'Không tìm thấy gói dịch vụ.',
  BILLING_TOPUP_PACKAGE_NOT_FOUND: 'Không tìm thấy gói nạp token.',
  BILLING_PLAN_CODE_EXISTS: 'Mã gói dịch vụ đã tồn tại.',
  BILLING_TOPUP_PACKAGE_CODE_EXISTS: 'Mã gói nạp token đã tồn tại.',
  PAYMENT_NOT_FOUND: 'Không tìm thấy giao dịch.',
  BILLING_AUDIT_LOG_NOT_FOUND: 'Không tìm thấy audit log.',
  PAYMENT_ALREADY_PROCESSED: 'Giao dịch đã được xử lý, dữ liệu sẽ được tải lại.',
  PAYMENT_CANNOT_BE_CANCELLED: 'Chỉ giao dịch đang chờ mới có thể hủy.',
  PAYMENT_CANNOT_BE_EXPIRED: 'Chỉ giao dịch đang chờ mới có thể đánh dấu hết hạn.',
  INVALID_BILLING_CYCLE: 'Chu kỳ thanh toán không hợp lệ hoặc chưa được cấu hình.',
  INVALID_TOKEN_AMOUNT: 'Số token phải là số nguyên lớn hơn 0.',
  INSUFFICIENT_TOPUP_TOKENS: 'Ví top-up không đủ token để thực hiện thao tác.',
  ORGANIZATION_NOT_FOUND: 'Không tìm thấy tổ chức.',
  ORGANIZATION_PLAN_NOT_FOUND: 'Không tìm thấy gói hiện tại hoặc gói được chọn.',
  INVALID_PLAN_EXPIRY: 'Thời hạn gói không hợp lệ.',
  INVALID_PLAN_SELECTOR: 'Phải chọn đúng một gói dịch vụ.',
  PLAN_EXTENSION_NOT_ALLOWED: 'Gói mặc định không có thời hạn và không thể gia hạn.',
  ORGANIZATION_DELETE_NOT_ALLOWED: 'Không được phép xóa tổ chức có dữ liệu Billing.',
  VALIDATION_ERROR: 'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra các trường bên dưới.',
}

Object.assign(errorMessages, {
  DEFAULT_PLAN_NOT_ELIGIBLE: 'Gói mặc định phải không bán và có giá 0 cho mọi chu kỳ.',
  DEFAULT_BILLING_PLAN_NOT_CONFIGURED: 'Chưa có gói mặc định. Quản trị viên cần chọn gói mặc định.',
  DEFAULT_PLAN_NOT_PURCHASABLE: 'Gói mặc định không thể mua.',
  BILLING_PLAN_NOT_SELLABLE: 'Gói dịch vụ hiện không được bán.',
})

export class AdminBillingError extends Error {
  code: string
  status: number
  errors: FieldErrors

  constructor(code: string, message: string, status = 500, errors: FieldErrors = {}) {
    super(message)
    this.name = 'AdminBillingError'
    this.code = code
    this.status = status
    this.errors = errors
  }
}

export const getAdminBillingErrorMessage = (error: unknown) => {
  if (error instanceof AdminBillingError) return error.message
  return 'Không thể hoàn tất yêu cầu. Vui lòng thử lại.'
}

export const useAdminBilling = () => {
  const config = useRuntimeConfig()
  const cookieOptions = { sameSite: 'lax' as const, secure: import.meta.env.PROD, path: '/' }
  const token = useCookie<string | null>('accessToken', cookieOptions)
  const userCookie = useCookie<Record<string, unknown> | null>('orbit_ai_user', cookieOptions)

  const request = async <T>(path: string, options: {
    method?: 'GET' | 'POST' | 'PATCH'
    query?: Record<string, unknown>
    body?: Record<string, unknown>
  } = {}): Promise<T> => {
    try {
      return await $fetch<T>(joinApiUrl(config.public.apiBase, path), {
        method: options.method || 'GET',
        query: options.query ? compactBillingQuery(options.query) : undefined,
        body: options.body,
        headers: {
          Accept: 'application/json',
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        },
      })
    } catch (rawError: any) {
      const payload = rawError?.data || rawError?.response?._data || {}
      const status = Number(rawError?.statusCode || rawError?.response?.status || 500)
      const code = String(payload?.code || (status === 403 ? 'ADMIN_ONLY' : 'UNKNOWN_ERROR'))
      const backendMessage = typeof payload?.message === 'string'
        && payload.message.trim().length > 0
        && payload.message.length <= 300
        && !/stack trace|\bat\s+[^\n]+/i.test(payload.message)
        ? payload.message.trim()
        : ''
      const message = backendMessage
        || errorMessages[code]
        || (status >= 500 ? 'Hệ thống Billing đang gặp sự cố. Vui lòng thử lại sau.' : 'Không thể hoàn tất yêu cầu.')

      if (status === 401) {
        token.value = null
        userCookie.value = null
        await navigateTo('/Login')
      } else if (status === 403 || code === 'ADMIN_ONLY') {
        await navigateTo('/partner/home')
      }

      throw new AdminBillingError(code, message, status, payload?.errors || {})
    }
  }

  return {
    listPlans: (query: Record<string, unknown> = {}) => request<BillingListResponse<BillingPlan>>('/admin/billing/plans', { query }),
    getPlan: (id: number) => request<BillingItemResponse<BillingPlan>>(`/admin/billing/plans/${id}`),
    createPlan: (body: Record<string, unknown>) => request<BillingItemResponse<BillingPlan>>('/admin/billing/plans', { method: 'POST', body }),
    updatePlan: (id: number, body: Record<string, unknown>) => request<BillingItemResponse<BillingPlan>>(`/admin/billing/plans/${id}`, { method: 'PATCH', body }),
    updatePlanStatus: (id: number, body: Record<string, unknown>) => request<BillingItemResponse<BillingPlan>>(`/admin/billing/plans/${id}/status`, { method: 'PATCH', body }),
    setDefaultPlan: (id: number, reason: string) => request<BillingItemResponse<BillingPlan>>(`/admin/billing/plans/${id}/default`, { method: 'PATCH', body: { reason } }),

    listTopupPackages: (query: Record<string, unknown> = {}) => request<BillingListResponse<BillingTopupPackage>>('/admin/billing/topup-packages', { query }),
    getTopupPackage: (id: number) => request<BillingItemResponse<BillingTopupPackage>>(`/admin/billing/topup-packages/${id}`),
    createTopupPackage: (body: Record<string, unknown>) => request<BillingItemResponse<BillingTopupPackage>>('/admin/billing/topup-packages', { method: 'POST', body }),
    updateTopupPackage: (id: number, body: Record<string, unknown>) => request<BillingItemResponse<BillingTopupPackage>>(`/admin/billing/topup-packages/${id}`, { method: 'PATCH', body }),
    updateTopupPackageStatus: (id: number, body: Record<string, unknown>) => request<BillingItemResponse<BillingTopupPackage>>(`/admin/billing/topup-packages/${id}/status`, { method: 'PATCH', body }),

    listPayments: (query: Record<string, unknown> = {}) => request<BillingListResponse<AdminPayment>>('/admin/billing/payments', { query }),
    getPayment: (id: number | string) => request<BillingItemResponse<AdminPayment>>(`/admin/billing/payments/${id}`),
    cancelPayment: (id: number | string, reason: string) => request<BillingItemResponse<AdminPayment>>(`/admin/billing/payments/${id}/cancel`, { method: 'POST', body: { reason } }),
    expirePayment: (id: number | string, reason: string) => request<BillingItemResponse<AdminPayment>>(`/admin/billing/payments/${id}/expire`, { method: 'POST', body: { reason } }),

    listOrganizations: (query: Record<string, unknown> = {}) => request<BillingListResponse<AdminBillingOrganization>>('/admin/billing/organizations', { query }),
    getOrganization: (id: string) => request<BillingItemResponse<AdminBillingOrganization>>(`/admin/billing/organizations/${id}`),
    changeOrganizationPlan: (id: string, billingPlanId: number, billingCycle: 'monthly' | 'annual', reason: string) => request<BillingItemResponse<AdminBillingOrganization>>(`/admin/billing/organizations/${id}/change-plan`, { method: 'POST', body: { billing_plan_id: billingPlanId, billing_cycle: billingCycle, reason } }),
    extendOrganization: (id: string, months: number, reason: string) => request<BillingItemResponse<AdminBillingOrganization>>(`/admin/billing/organizations/${id}/extend`, { method: 'POST', body: { months, reason } }),
    grantOrganizationTokens: (id: string, amount: number, reason: string) => request<BillingItemResponse<AdminBillingOrganization>>(`/admin/billing/organizations/${id}/grant-tokens`, { method: 'POST', body: { amount, reason } }),
    deductOrganizationTokens: (id: string, amount: number, reason: string) => request<BillingItemResponse<AdminBillingOrganization>>(`/admin/billing/organizations/${id}/deduct-tokens`, { method: 'POST', body: { amount, reason } }),
    resetOrganizationPlanTokens: (id: string, reason: string) => request<BillingItemResponse<AdminBillingOrganization>>(`/admin/billing/organizations/${id}/reset-plan-tokens`, { method: 'POST', body: { reason } }),

    listAuditLogs: (query: Record<string, unknown> = {}) => request<BillingListResponse<BillingAuditLog>>('/admin/billing/audit-logs', { query }),
    getAuditLog: (id: number | string) => request<BillingItemResponse<BillingAuditLog>>(`/admin/billing/audit-logs/${id}`),

    getStats: (query: Record<string, unknown> = {}) => request<{status: string, data: any}>('/admin/billing/stats', { query }),
  }
}
