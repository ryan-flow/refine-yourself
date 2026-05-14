import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { callDeepSeek } from '@/lib/deepseek/client'
import { buildChatMessages } from '@/lib/deepseek/chat-prompt'
import type { PersonaProfile } from '@/types/persona'

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

    const { data: persona, error } = await supabaseAdmin
      .from('personas')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !persona) {
      return NextResponse.json(
        { ok: false, error: '人格不存在' },
        { status: 404 },
      )
    }

    const profile = persona.persona_profile as PersonaProfile

    const messages = [
      ...buildChatMessages(persona.name, profile, persona.bio, history),
      { role: 'user' as const, content: userMessage },
    ]

    const reply = await callDeepSeek(messages, {
      temperature: 0.7,
      max_tokens: 1024,
    })

    void supabaseAdmin
      .from('personas')
      .update({ chat_count: (persona.chat_count ?? 0) + 1 })
      .eq('id', id)

    return NextResponse.json({ ok: true, data: { reply } })
  } catch (err) {
    console.error('POST /api/chat/[id] error:', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : '服务器内部错误' },
      { status: 500 },
    )
  }
}
