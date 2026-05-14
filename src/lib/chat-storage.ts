import type { SavedConversation } from '@/types/chat'

const STORAGE_PREFIX = 'ry_chat_'

export function saveConversation(personaId: string, conv: SavedConversation): void {
  localStorage.setItem(`${STORAGE_PREFIX}${personaId}`, JSON.stringify(conv))
}

export function loadConversation(personaId: string): SavedConversation | null {
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${personaId}`)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearConversation(personaId: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${personaId}`)
}

export function generateMessageId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
