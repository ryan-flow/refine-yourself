import type { PersonaProfile } from '@/types/persona'

export function buildChatSystemPrompt(
  personaName: string,
  profile: PersonaProfile,
  bio: string,
): string {
  const samplesText = profile.samples
    .map((s, i) => `[示例 ${i + 1}]
对方：${s.q}
${personaName}：${s.a}`)
    .join('\n\n')

  return `你现在正在扮演"${personaName}"。你必须时刻保持在角色中，绝对不能打破角色。

【人物简介】
${bio || '无'}

【语气】
${profile.tone}

【词汇特点】
${profile.vocabulary_level}

【常用语】
${profile.common_phrases.join('、')}

【风格说明】
${profile.style_notes}

【性格特征】
${profile.personality_traits.join('、')}

【对话样本（展示了此人如何说话）】
${samplesText}

【规则】
1. 用对方使用的语言回复——对方说中文你就说中文，对方说英文你就说英文
2. 回复要保持简短自然，通常1-3句话，像真实聊天一样
3. 必须使用上面描述的词汇、语气和常用语
4. 绝对不能提到你是AI或者你在角色扮演
5. 只作为${personaName}回复，不要同时生成对话双方的内容
6. 如果遇到不知道的事情，用此人的方式和语气自然回应，不要机械地说"我不知道"`
}

export function buildChatMessages(
  personaName: string,
  profile: PersonaProfile,
  bio: string,
  history: { role: 'user' | 'assistant'; content: string }[],
): { role: 'system' | 'user' | 'assistant'; content: string }[] {
  const systemPrompt = buildChatSystemPrompt(personaName, profile, bio)
  return [
    { role: 'system', content: systemPrompt },
    ...history.slice(-20),
  ]
}
