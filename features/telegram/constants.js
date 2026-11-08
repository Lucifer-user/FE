export const TELEGRAM_CHANNEL = 'telegram'

export const TELEGRAM_INTEGRATION_STATUS = Object.freeze({
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  ACTIVE: 'active',
  ERROR: 'error'
})

export const TELEGRAM_GROUP_REPLY_MODE = Object.freeze({
  MENTION_OR_REPLY: 'mention_or_reply',
  COMMAND_ONLY: 'command_only',
  ALL_MESSAGES: 'all_messages'
})

export const TELEGRAM_CHAT_TYPE = Object.freeze({
  PRIVATE: 'private',
  GROUP: 'group',
  SUPERGROUP: 'supergroup',
  CHANNEL: 'channel'
})

export const DEFAULT_TELEGRAM_SETTINGS = Object.freeze({
  privateChatEnabled: true,
  groupChatEnabled: false,
  groupReplyMode: TELEGRAM_GROUP_REPLY_MODE.MENTION_OR_REPLY
})
