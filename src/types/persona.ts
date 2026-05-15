export interface SampleDialogue {
  q: string
  a: string
}

export interface PersonaProfile {
  /** 五层人格结构（新，可能缺失于旧记录） */
  identity?: string
  rules?: string[]
  expression_style?: string
  decision_patterns?: string[]
  conversation_samples?: SampleDialogue[]

  /** 原有字段（向后兼容） */
  tone: string
  vocabulary_level: string
  common_phrases: string[]
  style_notes: string
  personality_traits: string[]
  topics: string[]
  samples: SampleDialogue[]
}

/** 统一规范化：新旧格式都兼容 */
export function normalizeProfile(p: Partial<PersonaProfile>): PersonaProfile {
  return {
    identity: p.identity ?? p.style_notes ?? p.tone ?? '',
    rules: p.rules ?? [],
    expression_style: p.expression_style ?? p.style_notes ?? p.tone ?? '',
    decision_patterns: p.decision_patterns ?? p.personality_traits ?? [],
    conversation_samples: p.conversation_samples ?? p.samples ?? [],
    // legacy
    tone: p.tone ?? p.expression_style ?? '',
    vocabulary_level: p.vocabulary_level ?? '日常',
    common_phrases: p.common_phrases ?? [],
    style_notes: p.style_notes ?? p.expression_style ?? '',
    personality_traits: p.personality_traits ?? p.decision_patterns ?? [],
    topics: p.topics ?? [],
    samples: p.samples ?? p.conversation_samples ?? [],
  }
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

/** 预置角色（跳过提炼，直接对话） */
export interface PrebuiltPersona {
  slug: string
  name: string
  bio: string
  avatar: string
  tags: string[]
  profile: PersonaProfile
}
