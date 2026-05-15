import { NextRequest, NextResponse } from 'next/server'
import { callDeepSeek } from '@/lib/deepseek/client'
import { buildChatMessages } from '@/lib/deepseek/chat-prompt'
import { normalizeProfile } from '@/types/persona'
import { getPrebuiltPersona } from '@/data/prebuilt-personas'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const userMessage: string = body.message?.trim()
    const history: { role: 'user' | 'assistant'; content: string }[] = body.history ?? []

    if (!userMessage) {
      return NextResponse.json(
        { ok: false, error: '消息不能为空' },
        { status: 400 },
      )
    }

    const persona = getPrebuiltPersona(slug)
    if (!persona) {
      return NextResponse.json(
        { ok: false, error: '人格不存在' },
        { status: 404 },
      )
    }

    const profile = normalizeProfile(persona.profile)

    const messages = [
      ...buildChatMessages(persona.name, profile, persona.bio, history),
      { role: 'user' as const, content: userMessage },
    ]

    const reply = await callDeepSeek(messages, {
      temperature: 0.7,
      max_tokens: 1024,
    })

    return NextResponse.json({ ok: true, data: { reply } })
  } catch (err) {
    console.error('POST /api/chat/prebuilt/[slug] error:', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : '服务器内部错误' },
      { status: 500 },
    )
  }
}
