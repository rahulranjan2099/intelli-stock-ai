import api from './axios'

export interface Conversation {
  id: number
  title: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: number | string
  conversationId: number
  role: 'USER' | 'ASSISTANT'
  content: string
  createdAt: string
  type?: 'text' | 'forecast'
  data?: unknown
  optimistic?: boolean
}

interface SendMessageResponse {
  userMessage: ChatMessage
  assistantMessage: ChatMessage
  conversation?: Conversation
  type: 'text' | 'forecast'
  data: unknown
}

export const conversationsApi = {
  async list(signal?: AbortSignal) {
    const { data } = await api.get<{ conversations: Conversation[] }>('/conversations', { signal })
    return data.conversations
  },
  async create() {
    const { data } = await api.post<{ conversation: Conversation }>('/conversations')
    return data.conversation
  },
  async messages(id: number) {
    const { data } = await api.get<{ messages: ChatMessage[] }>(`/conversations/${id}/messages`)
    return data.messages
  },
  async send(id: number, content: string) {
    const { data } = await api.post<SendMessageResponse>(`/conversations/${id}/messages`, { content })
    return data
  },
}
