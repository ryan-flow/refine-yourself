import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { callDeepSeek } from '@/lib/deepseek/client'
import { buildPersonaExtractionPrompt } from '@/lib/deepseek/persona-prompt'
import { validateChatFile } from '@/lib/validators'
import type { PersonaProfile } from '@/types/persona'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const personaName = (formData.get('name') as string | null) || ''

    if (!file) {
      return NextResponse.json(
        { ok: false, error: '请上传聊天记录文件' },
        { status: 400 },
      )
    }

    const validationError = validateChatFile(file)
    if (validationError) {
      return NextResponse.json(
        { ok: false, error: validationError },
        { status: 400 },
      )
    }

    const chatText = await file.text()

    if (chatText.trim().length < 50) {
      return NextResponse.json(
        { ok: false, error: '聊天记录内容太少，请提供更多数据' },
        { status: 400 },
      )
    }

    const prompts = buildPersonaExtractionPrompt(chatText, personaName || undefined)
    const rawResponse = await callDeepSeek(
      [
        { role: 'system', content: prompts.system },
        { role: 'user', content: prompts.user },
      ],
      { temperature: 0.8, max_tokens: 4096, jsonMode: true },
    )

    let extracted: Record<string, unknown>
    try {
      extracted = JSON.parse(rawResponse)
      if (!extracted.identity || !extracted.rules || !extracted.conversation_samples) {
        throw new Error('Missing required fields')
      }
    } catch {
      return NextResponse.json(
        { ok: false, error: 'AI 分析结果格式异常，请重试' },
        { status: 500 },
      )
    }

    // 构建完整的 PersonaProfile（五层结构 + 遗留字段兼容）
    const identity = (extracted.identity as string) || ''
    const rules = (extracted.rules as string[]) || []
    const expressionStyle = (extracted.expression_style as string) || ''
    const decisionPatterns = (extracted.decision_patterns as string[]) || []
    const conversationSamples = (extracted.conversation_samples as { q: string; a: string }[]) || []

    const profile: PersonaProfile = {
      identity,
      rules,
      expression_style: expressionStyle,
      decision_patterns: decisionPatterns,
      conversation_samples: conversationSamples,
      // 向后兼容字段
      tone: identity.split('。')[0] || '未知',
      vocabulary_level: expressionStyle.includes('白话') ? '口语化' : expressionStyle.includes('书面') ? '书面化' : '日常',
      common_phrases: [],
      style_notes: expressionStyle,
      personality_traits: decisionPatterns,
      topics: [],
      samples: conversationSamples,
    }

    const finalName = personaName || '未知人格'

    const traits = profile.personality_traits.slice(0, 3).join('、')
    const bio = traits
      ? `${identity.split('。')[0]}。性格特征：${traits}。`
      : ''

    const { data, error } = await supabaseAdmin
      .from('personas')
      .insert({
        name: finalName,
        bio,
        persona_profile: profile,
      })
      .select('*')
      .single()

    if (error || !data) {
      throw new Error(error?.message || 'Failed to save persona')
    }

    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin}/chat/${data.id}`

    return NextResponse.json({
      ok: true,
      data: {
        persona: {
          id: data.id,
          name: data.name,
          bio: data.bio,
          persona_profile: data.persona_profile,
          admin_token: data.admin_token,
          created_at: data.created_at,
          chat_count: data.chat_count,
        },
        shareUrl,
      },
    })
  } catch (err) {
    console.error('POST /api/persona error:', err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : '服务器内部错误' },
      { status: 500 },
    )
  }
}
