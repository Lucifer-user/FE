import { ref } from 'vue'

const defaultSummary = () => ({
  active_bots: 0,
  total_token_used: 0,
  total_token_limit: 0,
  near_limit_bots: 0,
  exhausted_bots: 0,
  unlimited_bots: 0
})

const defaultPagination = () => ({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

const extractList = (response) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.data)) return response.data.data
  return []
}

export function useAdminTokenUsage() {
  const config = useRuntimeConfig()
  const accessToken = useCookie('accessToken')

  const items = ref([])
  const summary = ref(defaultSummary())
  const pagination = ref(defaultPagination())
  const loading = ref(false)
  const error = ref(null)

  let requestSequence = 0

  const headers = () => ({
    Authorization: `Bearer ${accessToken.value}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  })

  const buildQuery = ({ search = '', organizationId = '', aiServiceId = '', quotaStatus = '', page = 1, perPage = 15 } = {}) => {
    const query = new URLSearchParams()
    const normalizedSearch = String(search || '').trim()

    if (normalizedSearch) query.set('search', normalizedSearch)
    if (organizationId) query.set('organization_id', String(organizationId))
    if (aiServiceId) query.set('ai_service_id', String(aiServiceId))
    if (quotaStatus) query.set('quota_status', String(quotaStatus))
    query.set('page', String(page))
    query.set('per_page', String(perPage))

    return query.toString()
  }

  const fetchTokenUsage = async (params = {}) => {
    const sequence = ++requestSequence
    loading.value = true
    error.value = null

    try {
      const query = buildQuery(params)
      const response = await $fetch(`${config.public.apiBase}/admin/partner-services?${query}`, {
        method: 'GET',
        headers: headers()
      })

      if (sequence !== requestSequence) return null

      items.value = response.data || []
      summary.value = response.summary || defaultSummary()
      pagination.value = response.pagination || defaultPagination()

      return response
    } catch (requestError) {
      if (sequence === requestSequence) {
        error.value = requestError
      }
      throw requestError
    } finally {
      if (sequence === requestSequence) {
        loading.value = false
      }
    }
  }

  const updateTokenLimit = async (serviceId, tokenLimit) => {
    return await $fetch(`${config.public.apiBase}/admin/partner-services/${serviceId}/token-limit`, {
      method: 'PATCH',
      headers: headers(),
      body: {
        token_limit: tokenLimit
      }
    })
  }

  const fetchOrganizations = async () => {
    const response = await $fetch(`${config.public.apiBase}/admin/organizations`, {
      method: 'GET',
      headers: headers()
    })

    return extractList(response)
  }

  const fetchAiServices = async () => {
    const response = await $fetch(`${config.public.apiBase}/admin/ai-services?per_page=100`, {
      method: 'GET',
      headers: headers()
    })

    return extractList(response)
  }

  return {
    items,
    summary,
    pagination,
    loading,
    error,
    fetchTokenUsage,
    updateTokenLimit,
    fetchOrganizations,
    fetchAiServices
  }
}
