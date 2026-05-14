const DEEPSEEK_BASE_URL = 'https://api.deepseek.com/v1'
const DEFAULT_MODEL = 'deepseek-chat'

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepSeekRequest {
  model: string
  messages: DeepSeekMessage[]
  temperature: number
  max_tokens: number
  response_format?: { type: 'text' | 'json_object' }
}

interface DeepSeekResponse {
  id: string
  choices: {
    index: number
    message: {
      role: 'assistant'
      content: string
    }
    finish_reason: 'stop' | 'length'
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function callDeepSeek(
  messages: DeepSeekMessage[],
  options?: {
    temperature?: number
    max_tokens?: number
    jsonMode?: boolean
  },
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY is not configured')

  const body: DeepSeekRequest = {
    model: DEFAULT_MODEL,
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.max_tokens ?? 2048,
  }

  if (options?.jsonMode) {
    body.response_format = { type: 'json_object' }
  }

  const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errBody = await res.text()
    throw new Error(`DeepSeek API error (${res.status}): ${errBody}`)
  }

  const data: DeepSeekResponse = await res.json()

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('DeepSeek returned empty response')
  }

  return data.choices[0].message.content
}
