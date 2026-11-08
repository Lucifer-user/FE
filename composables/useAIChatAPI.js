import { ref } from 'vue'
import { useCookie } from '#app'

export function useAIChatAPI() {
  const config = useRuntimeConfig()
  const isReady = ref(true)
  const messages = ref([])
  const isLoading = ref(false)
  const currentConversationId = ref(null)
  const currentServiceId = ref(null)
  const conversationsList = ref([])
  const partnerServices = ref([])

  const token = useCookie('accessToken')

  const getOrganizationId = () => {
    if (process.client) {
      return localStorage.getItem('orbit_current_organization_id') || ''
    }

    return ''
  }

  const getHeaders = () => {
    const organizationId = getOrganizationId()

    return {
      Authorization: `Bearer ${token.value}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(organizationId ? { 'X-Organization-Id': organizationId } : {})
    }
  }

  const sendMessage = async (text) => {
    if (!text?.trim()) return null

    messages.value.push({ role: 'user', content: text, isCompleted: true })
    isLoading.value = true

    try {
      const response = await $fetch(`${config.public.apiBase}/partner/chat/messages/send`, {
        method: 'POST',
        headers: getHeaders(),
        body: {
          message_text: text,
          conversation_id: currentConversationId.value && Number.isInteger(Number(currentConversationId.value)) ? Number(currentConversationId.value) : null,
          partner_service_id: currentServiceId.value
        }
      })

      if (response?.conversation_id) {
        currentConversationId.value = response.conversation_id
        if (process.client) {
          localStorage.setItem('current_conversation_id', String(response.conversation_id))
        }
      }

      if (response?.status === 'success') {
        messages.value.push({
          role: 'assistant',
          content: response.ai_response || response.answer || '',
          sources: response.sources || [],
          isCompleted: true
        })
      }

      return response
    } catch (error) {
      console.error('AI chat request failed:', error)
      messages.value.push({
        role: 'assistant',
        content: error?.data?.message || 'Xin loi, ket noi den Orbit AI dang bi gian doan. Vui long thu lai.',
        isCompleted: true
      })
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const loadPartnerServices = async () => {
    try {
      const response = await $fetch(`${config.public.apiBase}/auth/partner-services`, {
        headers: getHeaders()
      })
      partnerServices.value = response.data || []
      return partnerServices.value
    } catch (error) {
      console.error('Failed to load partner services:', error)
      partnerServices.value = []
      return []
    }
  }

  const createConversation = async (serviceId) => {
    currentServiceId.value = serviceId
    currentConversationId.value = `draft-${serviceId}`
    messages.value = []
    return null
  }

  const loadConversationHistory = async (id) => {
    try {
      const response = await $fetch(`${config.public.apiBase}/partner/chat/conversations/${id}/messages`, {
        headers: getHeaders()
      })
      messages.value = (response.data || []).map(message => ({
        id: message.id,
        role: message.role || (message.sender === 'ai' ? 'assistant' : 'user'),
        content: message.content || message.message_text || '',
        isCompleted: true
      }))
      currentConversationId.value = Number(id)
      const conversation = conversationsList.value.find(item => item.id == id)
      currentServiceId.value = conversation?.partner_service_id || null
      return true
    } catch (error) {
      console.error('Failed to load chat history:', error)
      messages.value = []
      return false
    }
  }

  const loadConversations = async () => {
    try {
      const response = await $fetch(`${config.public.apiBase}/partner/chat/conversations`, {
        headers: getHeaders()
      })
      conversationsList.value = response.data || []
      return conversationsList.value
    } catch (error) {
      console.error('Failed to load conversations:', error)
      conversationsList.value = []
      return []
    }
  }

  const resetChat = () => {
    messages.value = []
    currentConversationId.value = null
    currentServiceId.value = null
  }

  const connect = async () => {
    isReady.value = true
  }

  const disconnect = () => {
    isReady.value = false
  }

  return {
    isReady,
    messages,
    isLoading,
    currentConversationId,
    conversationsList,
    partnerServices,
    sendMessage,
    connect,
    disconnect,
    createConversation,
    resetChat,
    loadConversationHistory,
    loadConversations,
    loadPartnerServices
  }
}
