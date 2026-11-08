export function useWorkspaceChatAPI(organizationId = null) {
  const config = useRuntimeConfig()
  const accessToken = useCookie('accessToken')

  const getOrganizationId = () => {
    if (organizationId && typeof organizationId === 'object' && 'value' in organizationId) {
      return organizationId.value
    }

    if (organizationId) {
      return organizationId
    }

    if (process.client) {
      return localStorage.getItem('orbit_current_organization_id') || ''
    }

    return ''
  }

  const getHeaders = () => {
    const currentOrganizationId = getOrganizationId()

    return {
      'Authorization': `Bearer ${accessToken.value}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(currentOrganizationId ? { 'X-Organization-Id': currentOrganizationId } : {})
    }
  }

  const getConversations = async () => {
    try {
      const result = await $fetch(`${config.public.apiBase}/partner/chat/conversations`, {
        method: 'GET',
        headers: getHeaders()
      })
      return result.data || []
    } catch (error) {
      console.error('Lỗi lấy danh sách hội thoại:', error)
      return []
    }
  }

  // 2. Lấy chi tiết tin nhắn của 1 hội thoại
  const getMessages = async (id) => {
    try {
      const result = await $fetch(`${config.public.apiBase}/partner/chat/conversations/${id}/messages`, {
        method: 'GET',
        headers: getHeaders()
      })
      return result.data || []
    } catch (error) {
      console.error(`Lỗi lấy tin nhắn phòng chat ${id}:`, error)
      return []
    }
  }

  // 3. Gửi tin nhắn mới & Gọi AI
  const sendMessage = async (payload) => {
    try {
      const result = await $fetch(`${config.public.apiBase}/partner/chat/messages/send`, {
        method: 'POST',
        headers: getHeaders(),
        body: payload // { message_text, conversation_id, partner_service_id }
      })
      return result
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error)
      throw error
    }
  }

  // 4. Xóa một cuộc hội thoại
  const deleteConversation = async (id) => {
    try {
      await $fetch(`${config.public.apiBase}/partner/chat/conversations/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      return true
    } catch (error) {
      console.error(`Lỗi xóa phòng chat ${id}:`, error)
      return false
    }
  }

  const loadPartnerServices = async () => {
    try {
      const result = await $fetch(`${config.public.apiBase}/auth/partner-services`, {
        method: 'GET',
        headers: getHeaders()
      })
      return result.data || []
    } catch (error) {
      console.error('Lỗi tải danh sách AI:', error)
      return []
    }
  }

  return {
    getConversations,
    getMessages,
    sendMessage,
    deleteConversation,
    loadPartnerServices
  }
}
