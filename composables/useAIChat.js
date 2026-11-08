import { ref, computed } from 'vue'
import { useAIChatAPI } from './useAIChatAPI'
import { useCookie } from '#app'

export function useAIChat() {
  const api = useAIChatAPI()

  const messages = api.messages
  const isLoading = api.isLoading
  const currentConversationId = api.currentConversationId
  const conversationsList = api.conversationsList
  const partnerServices = api.partnerServices

  const selectedServiceId = ref(null)

  const accessToken = useCookie('accessToken')

  const isGuest = computed(() => !accessToken.value)

  const currentService = computed(() => {
    return partnerServices.value?.find?.(
      s => s.id === selectedServiceId.value
    ) || null
  })

  const createConversation = async (serviceId) => {
    selectedServiceId.value = serviceId
    return await api.createConversation(serviceId)
  }

  const sendMessage = async (text) => {
    if (!text?.trim()) return
    return await api.sendMessage(text)
  }

  const resetChat = () => {
    selectedServiceId.value = null
    api.resetChat()
  }

  const loadConversationHistory = async (id) => {
    return await api.loadConversationHistory(id)
  }

  const loadConversations = async () => {
    return await api.loadConversations()
  }

  const loadPartnerServices = async () => {
    return await api.loadPartnerServices()
  }

  const loadOrganization = async () => {
    return { id: 'fake-org' }
  }

  return {
    messages,
    isLoading,
    sendMessage,
    resetChat,
    createConversation,
    loadConversationHistory,
    loadConversations,
    loadPartnerServices,
    loadOrganization,
    partnerServices,
    conversationsList,
    currentConversationId,
    currentService,
    isGuest
  }
}
