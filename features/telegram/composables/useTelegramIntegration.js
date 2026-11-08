import { ref, unref } from 'vue'
import { normalizeTelegramIntegration } from '../normalizers'

export const useTelegramIntegration = (organizationId) => {
  const config = useRuntimeConfig()
  const integrations = ref([])
  const loading = ref(false)

  const headers = () => {
    const accessToken = useCookie('accessToken')
    const organization = unref(organizationId)

    return {
      Authorization: `Bearer ${accessToken.value}`,
      Accept: 'application/json',
      ...(organization ? { 'X-Organization-Id': organization } : {})
    }
  }

  const api = (path, options = {}) => $fetch(
    `${config.public.apiBase}/partner/integrations/telegram${path}`,
    {
      ...options,
      headers: {
        ...headers(),
        ...(options.headers || {})
      }
    }
  )

  const replaceIntegration = (rawIntegration) => {
    const normalized = normalizeTelegramIntegration(rawIntegration)
    const index = integrations.value.findIndex(item => item.id === normalized.id)

    if (index === -1) integrations.value.unshift(normalized)
    else integrations.value.splice(index, 1, normalized)

    return normalized
  }

  const fetchIntegrations = async () => {
    loading.value = true
    try {
      const response = await api('/')
      integrations.value = (response?.data || []).map(normalizeTelegramIntegration)
      return integrations.value
    } finally {
      loading.value = false
    }
  }

  const testToken = async (token) => {
    const response = await api('/test-token', {
      method: 'POST',
      body: { token }
    })
    return response?.data || null
  }

  const connect = async (payload) => {
    const response = await api('/connect', {
      method: 'POST',
      body: payload
    })
    return replaceIntegration(response?.data || {})
  }

  const refreshStatus = async (integrationId) => {
    const response = await api(`/${integrationId}/status`)
    return {
      integration: replaceIntegration(response?.data || {}),
      webhook: response?.webhook || {}
    }
  }

  const updateSettings = async (integrationId, payload) => {
    const response = await api(`/${integrationId}`, {
      method: 'PATCH',
      body: payload
    })
    return replaceIntegration(response?.data || {})
  }

  const disconnect = async (integrationId, dropPendingUpdates = false) => {
    const response = await api(`/${integrationId}`, {
      method: 'DELETE',
      body: { drop_pending_updates: dropPendingUpdates }
    })
    return replaceIntegration(response?.data || {})
  }

  return {
    integrations,
    loading,
    fetchIntegrations,
    testToken,
    connect,
    refreshStatus,
    updateSettings,
    disconnect
  }
}
