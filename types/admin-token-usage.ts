export interface AdminTokenUsageOrganization {
  id: string | number
  name: string
}

export interface AdminTokenUsagePartner {
  id: string | number
  name?: string | null
  email?: string | null
}

export interface AdminTokenUsageAiService {
  id: string | number
  name: string
  type?: string | null
}

export type AdminTokenQuotaStatus = 'normal' | 'warning' | 'danger' | 'exhausted' | 'unlimited'

export interface AdminTokenUsageItem {
  id: string | number
  name: string
  status: string
  token_used: number
  token_limit: number | null
  remaining_tokens: number | null
  usage_percent: number | null
  quota_status: AdminTokenQuotaStatus
  organization?: AdminTokenUsageOrganization | null
  partner?: AdminTokenUsagePartner | null
  ai_service?: AdminTokenUsageAiService | null
  created_at?: string | null
  updated_at?: string | null
}

export interface AdminTokenUsageSummary {
  active_bots: number
  total_token_used: number
  total_token_limit: number
  near_limit_bots: number
  exhausted_bots: number
  unlimited_bots: number
}

export interface AdminTokenUsagePagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface AdminTokenUsageResponse {
  status: string
  data: AdminTokenUsageItem[]
  summary: AdminTokenUsageSummary
  pagination: AdminTokenUsagePagination
}
