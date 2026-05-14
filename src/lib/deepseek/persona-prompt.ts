export const PERSONA_SYSTEM_PROMPT = `你是一位专业的语言风格分析专家。你的任务是从聊天记录中提取出"目标人物"的人格画像。

你需要分析聊天记录中目标人物（即导出聊天记录的那个人，而非对话的另一方）的语言特征。

请仅关注目标人物自己发出的消息。输出必须是一个严格的 JSON 对象（不要任何 markdown 包裹）。

分析维度：
1. tone（语气）：整体说话语气（如 casual/轻松、humorous/幽默、formal/正式、warm/温暖、sarcastic/讽刺等）
2. vocabulary_level（词汇水平）：词汇使用特点（如日常口语、网络用语、书面语、专业术语等）
3. common_phrases（常用语）：最常用的口头禅、句式、语气词，至少3个，最多8个
4. style_notes（风格备注）：句式特点（长句/短句）、标点使用习惯、表情包/emoji使用频率、话题转换方式等
5. personality_traits（性格特征）：从其沟通方式中推断出的3-5个性格特征
6. topics（话题）：最常谈论的话题，至少3个
7. samples（对话样本）：提取3-5段最能代表其说话风格的真实对话片段（q=对方说的话，a=目标人物的回复）

严格规则：
- 不要包含真实姓名、电话号码、地址、微信号等个人身份信息
- 样本中的任何身份信息必须替换为通用占位符（如[某人]、[某地]、[某学校]）
- 画像必须代表聊天记录的"导出者"，而非其聊天对象
- 描述要具体且有依据，避免泛泛而谈
- 如果聊天记录中有多种语言，在 style_notes 中注明

输出 JSON 结构：
{
  "tone": "string",
  "vocabulary_level": "string",
  "common_phrases": ["string"],
  "style_notes": "string",
  "personality_traits": ["string"],
  "topics": ["string"],
  "samples": [{"q": "string", "a": "string"}]
}`

const MAX_CHARS = 60000

export function buildPersonaExtractionPrompt(chatText: string, personaName?: string): { system: string; user: string } {
  const nameInstruction = personaName
    ? `目标人物的名字是"${personaName}"，请重点关注此人发出的消息。\n\n`
    : ''

  const truncated = chatText.length > MAX_CHARS
    ? '... [前面记录已省略] ...\n' + chatText.slice(-MAX_CHARS)
    : chatText

  return {
    system: PERSONA_SYSTEM_PROMPT,
    user: `${nameInstruction}以下是聊天记录全文（可能包含多人对话），请分析目标人物的语言风格：

---
${truncated}
---`,
  }
}
