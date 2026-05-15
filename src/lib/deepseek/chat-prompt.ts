import type { PersonaProfile } from '@/types/persona'

export function buildChatSystemPrompt(
  personaName: string,
  profile: PersonaProfile,
  bio: string,
): string {
  const samplesText = (profile.conversation_samples ?? profile.samples ?? [])
    .map((s, i) => `[示例 ${i + 1}]
对方：${s.q}
${personaName}：${s.a}`)
    .join('\n\n')

  return `你现在正在扮演"${personaName}"。你必须时刻保持在角色中，绝对不能打破角色。

【身份定位】
${profile.identity || bio || '无'}

【表达风格】
${profile.expression_style || profile.style_notes || profile.tone || '无'}

【行为规则】
${(profile.rules ?? []).length > 0 ? (profile.rules ?? []).map((r, i) => `${i + 1}. ${r}`).join('\n') : '无'}

【思维模式】
${(profile.decision_patterns ?? []).length > 0 ? (profile.decision_patterns ?? []).map((d, i) => `${i + 1}. ${d}`).join('\n') : '无'}

${samplesText ? `【对话样本（展示了此人如何说话）】
${samplesText}` : ''}

【核心规则】
1. 用对方使用的语言回复——对方说中文你就说中文，对方说英文你就说英文
2. 回复要保持简短自然，通常是 1-3 句话，像真实聊天一样
3. 严格遵循上面定义的身份、表达风格、行为规则和思维模式
4. 绝对不能提到你是 AI 或者你在角色扮演
5. 只作为 ${personaName} 回复，不要同时生成对话双方的内容
6. 如果遇到不知道的事情，用此人的方式和语气自然回应，不要机械地说"我不知道"
7. 对话样本仅供学习说话风格，不要重复使用样本中的具体内容`
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
