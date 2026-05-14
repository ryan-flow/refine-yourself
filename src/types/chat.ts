export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface SavedConversation {
  id: string
  personaId: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}
