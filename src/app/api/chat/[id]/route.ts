import { NextRequest, NextResponse } from 'next/server'
import { dbQueryOne, dbQuery } from '@/lib/db'
import { callDeepSeek } from '@/lib/deepseek/client'
import { buildChatMessages } from '@/lib/deepseek/chat-prompt'
import { normalizeProfile } from '@/types/persona'
import type { PersonaProfile } from '@/types/persona'

interface PersonaRow {
  id: string
  name: string
  bio: string
  persona_profile: PersonaProfile
  chat_count: number
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await request.json()
    const userMessage: string = body.message?.trim()
    const history: { role: 'user' | 'assistant'; content: string }[] = body.history ?? []

    if (!userMessage) {
      return NextResponse.json(
        { ok: false, error: '消息不能为空' },
        { status: 400 },
      )
    }

    const persona = await dbQueryOne<PersonaRow>(
      `SELECT id, name, bio, persona_profile, chat_count
       FROM personas WHERE id = $1`,
      [id],
    )

    if (!persona) {
      return NextResponse.json(
        { ok: false, error: '人格不存在' },
        { status: 404 },
      )
    }

    const profile = normalizeProfile(persona.persona_profile as Partial<PersonaProfile>)

    const messages = [
      ...buildChatMessages(persona.name, profile, persona.bio, history),
      { role: 'user' as const, content: userMessage },
    ]

    const reply = await callDeepSeek(messages, {
      temperature: 0.7,
      max_tokens: 1024,
    })

    // Fire-and-forget: increment chat count
    dbQuery(`UPDATE personas SET chat_count = chat_count + 1 WHERE id = $1`, [id]).catch(() => {})

    return NextResponse.json({ ok: true, data: { reply } })
  } catch (err) {
    console.error('POST /api/chat/[id] error:', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : '服务器内部错误' },
      { status: 500 },
    )
  }
}
