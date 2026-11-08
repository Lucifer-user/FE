import {
  DEFAULT_TELEGRAM_SETTINGS,
  TELEGRAM_INTEGRATION_STATUS
} from './constants'

export const normalizeTelegramIntegration = (integration = {}) => ({
  id: integration.id || null,
  organizationId: integration.organization_id || null,
  partnerServiceId: integration.partner_service_id || null,
  name: integration.name || '',
  status: integration.status || TELEGRAM_INTEGRATION_STATUS.DISCONNECTED,
  botId: integration.external_bot_id || null,
  botUsername: integration.external_bot_username || '',
  hasToken: Boolean(integration.has_token),
  privateChatEnabled: integration.private_chat_enabled ?? DEFAULT_TELEGRAM_SETTINGS.privateChatEnabled,
  groupChatEnabled: integration.group_chat_enabled ?? DEFAULT_TELEGRAM_SETTINGS.groupChatEnabled,
  groupReplyMode: integration.group_reply_mode || DEFAULT_TELEGRAM_SETTINGS.groupReplyMode,
  lastError: integration.last_error || null,
  connectedAt: integration.connected_at || null,
  lastWebhookAt: integration.last_webhook_at || null
})
