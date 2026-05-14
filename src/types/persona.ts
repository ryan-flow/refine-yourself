export interface PersonaProfile {
  tone: string
  vocabulary_level: string
  common_phrases: string[]
  style_notes: string
  personality_traits: string[]
  topics: string[]
  samples: SampleDialogue[]
}

export interface SampleDialogue {
  q: string
  a: string
}

export interface Persona {
  id: string
  name: string
  bio: string
  persona_profile: PersonaProfile
  created_at: string
  chat_count: number
}

export interface PersonaWithToken extends Persona {
  admin_token: string
}
