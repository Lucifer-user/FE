import { ref } from 'vue'
import { useWorkspaceChatAPI } from './useWorkspaceChatAPI'

export function useWorkspaceChat(organizationId = null) {
  const api = useWorkspaceChatAPI(organizationId)

  const conversations = ref([])
  const messages = ref([])
  const partnerServices = ref([])
  const activeConversationId = ref(null)
  const selectedBotId = ref(null)
  const isLoading = ref(false)
  const isGenerating = ref(false)

  // Tải danh sách AI assistants
  const fetchPartnerServices = async () => {
    partnerServices.value = await api.loadPartnerServices()
  }

  // Tải danh sách hội thoại
  const fetchConversations = async () => {
    isLoading.value = true
    conversations.value = await api.getConversations()
    isLoading.value = false
  }

  // Chọn 1 phòng chat
  const selectConversation = async (id) => {
    activeConversationId.value = id
    const conversation = conversations.value.find(item => Number(item.id) === Number(id))
    selectedBotId.value = conversation?.partner_service_id || null
    isLoading.value = true
    messages.value = await api.getMessages(id)
    isLoading.value = false
  }

  // Tạo mới 1 đoạn chat
  const newConversation = (botId = null) => {
    activeConversationId.value = null
    selectedBotId.value = botId
    messages.value = []
  }

  // Gửi tin nhắn
  const sendMessage = async (text, overrideBotId = null) => {
    if (!text.trim() || isGenerating.value) return

    let finalBotId = overrideBotId || selectedBotId.value
    if (!activeConversationId.value && !finalBotId && partnerServices.value.length > 0) {
      finalBotId = partnerServices.value[0].id
    }

    // 1. Đẩy tin nhắn của User vào giao diện ngay lập tức
    const tempUserMsg = { id: Date.now(), sender: 'user', message_text: text }
    messages.value.push(tempUserMsg)
    
    // 2. Hiện trạng thái đang gõ
    isGenerating.value = true
    
    try {
      const payload = {
        message_text: text,
        conversation_id: activeConversationId.value,
        partner_service_id: finalBotId
      }
      const res = await api.sendMessage(payload)

      // Nếu đây là chat mới, update lại ID và load lại sidebar
      if (!activeConversationId.value && res.conversation_id) {
        activeConversationId.value = res.conversation_id
        await fetchConversations()
      }

      if (res.status === 'warning') {
        messages.value.push({
          id: Date.now() + 1,
          sender: 'ai',
          message_text: res.message || 'Bot này chưa có dữ liệu tri thức để trả lời.'
        })
        return
      }

      if (res.status !== 'success' || !res.ai_response) {
        throw { response: { _data: { message: res.message || 'AI chưa trả về phản hồi hợp lệ.' } } }
      }

      messages.value.push({
        id: Date.now() + 1,
        sender: 'ai',
        message_text: res.ai_response
      })
    } catch (err) {
      let errorMsg = '⚠️ Xin lỗi, đã xảy ra lỗi kết nối. Vui lòng thử lại.'
      if (err.response && err.response._data && err.response._data.message) {
         errorMsg = `⚠️ ${err.response._data.message}`
         const toast = useToast()
         if (err.response._data.code === 'TOKEN_EXHAUSTED' || err.response._data.code === 'LIMIT_REACHED') {
            toast.error(err.response._data.message)
         } else {
            toast.error('Gửi tin nhắn thất bại')
         }
      }
      
      messages.value.push({
        id: Date.now() + 1,
        sender: 'ai',
        message_text: errorMsg
      })
    } finally {
      isGenerating.value = false
    }
  }

  // Xóa đoạn chat
  const deleteChat = async (id) => {
    const success = await api.deleteConversation(id)
    if (success) {
      conversations.value = conversations.value.filter(c => c.id !== id)
      if (activeConversationId.value === id) {
        newConversation()
      }
    }
  }

  return {
    conversations,
    messages,
    partnerServices,
    activeConversationId,
    selectedBotId,
    isLoading,
    isGenerating,
    fetchConversations,
    fetchPartnerServices,
    selectConversation,
    newConversation,
    sendMessage,
    deleteChat
  }
}
