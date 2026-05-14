export interface ApiResponse<T = unknown> {
  ok: boolean
  data?: T
  error?: string
}

export interface CreatePersonaResponse {
  persona: {
    id: string
    name: string
    bio: string
    persona_profile: import('./persona').PersonaProfile
    admin_token: string
    created_at: string
    chat_count: number
  }
  shareUrl: string
}

export interface ChatResponse {
  reply: string
}

export interface PersonaPublicResponse {
  persona: {
    id: string
    name: string
    bio: string
    persona_profile: import('./persona').PersonaProfile
    created_at: string
    chat_count: number
  }
}
