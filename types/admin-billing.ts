export interface BillingPagination {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface BillingListResponse<T> {
  status: 'success'
  data: T[]
  pagination: BillingPagination
}

export interface BillingItemResponse<T> {
  status: 'success'
  data: T
}

export interface BillingPlan {
  id: number
  code: string
  name: string
  description: string | null
  monthly_price: number
  annual_price: number
  annual_discount_percent: number
  final_monthly_price: number
  final_annual_price: number
  monthly_duration_months?: number
  annual_duration_months?: number | null
  currency: string
  token_limit: number
  duration_months: number
  duration_months_annual: number | null
  chatbot_limit: number
  document_limit: number
  storage_limit: number | null
  member_limit: number | null
  benefits: unknown
  rank: number
  is_sellable: boolean
  is_default: boolean
  is_visible: boolean
  sort_order: number
  effective_from: string | null
  created_at: string | null
  updated_at: string | null
}

export interface BillingTopupPackage {
  id: number
  code: string
  name: string
  price: number
  currency: string
  token_amount: number
  is_sellable: boolean
  is_visible: boolean
  sort_order: number
  created_at: string | null
  updated_at: string | null
}

export interface BillingUserSummary {
  id: number
  name: string
  email: string
}

export interface BillingOrganizationSummary {
  id: string
  name: string
  owner?: BillingUserSummary | null
}

export interface AdminLatestPayment {
  id: number
  order_code: string
  status: string
  amount: number
  currency_snapshot?: string | null
  currency?: string | null
  created_at: string | null
}

export interface AdminPayment {
  id: number
  order_code: string
  user: BillingUserSummary | null
  organization: BillingOrganizationSummary | null
  payment_type: string
  status: string
  amount: number
  amount_snapshot: number | null
  base_amount_snapshot?: number | null
  discount_percent_snapshot?: number | null
  final_amount_snapshot?: number | null
  currency_snapshot: string | null
  plan_snapshot: Record<string, unknown>
  topup_snapshot: Record<string, unknown>
  billing_cycle_snapshot: string | null
  duration_snapshot: number | null
  token_amount_snapshot: number | null
  benefits_snapshot: unknown
  transaction_hash: string | null
  created_at: string | null
  expires_at: string | null
  paid_at: string | null
  updated_at: string | null
}

export interface AdminBillingOrganization {
  id: string
  name: string
  status: string
  owner: BillingUserSummary | null
  plan_type: string
  plan_is_default?: boolean
  plan_started_at: string | null
  plan_expires_at: string | null
  previous_plan_type: string | null
  tokens_limit: number
  plan_remaining_tokens: number | null
  topup_tokens: number
  remaining_tokens: number
  tokens_used: number
  payments_count: number | null
  chatbots_count: number | null
  latest_payment: AdminLatestPayment | null
  plan_status: string
  days_remaining: number | null
}

export interface BillingAuditLog {
  id: number
  admin: BillingUserSummary | null
  action: string
  target_type: string
  target_id: string
  organization_id: string | null
  old_values: unknown
  new_values: unknown
  reason: string | null
  metadata: unknown
  created_at: string | null
}

export type FieldErrors = Record<string, string[]>
