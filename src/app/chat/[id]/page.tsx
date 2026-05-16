import { supabaseAdmin } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ChatInterface } from '@/components/chat/chat-interface'
import type { Metadata } from 'next'

function buildOgImageUrl(name: string, bio: string, theme: string): string {
  const params = new URLSearchParams({ name, bio, theme })
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://refineyourself.asia'
  return `${base}/api/og?${params.toString()}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params

  try {
    const { data: persona } = await supabaseAdmin
      .from('personas')
      .select('name, bio, persona_profile')
      .eq('id', id)
      .single()

    if (!persona) return { title: '分身不存在' }

    const profile = persona.persona_profile as Record<string, unknown> | null

    const ogImage = buildOgImageUrl(persona.name, persona.bio || '', 'default')

    return {
      title: `${persona.name} — 炼化自己`,
      description: persona.bio || `与 ${persona.name} 的数字分身对话`,
      openGraph: {
        title: `${persona.name} — AI 数字分身`,
        description: persona.bio || '来和这个 AI 数字分身聊天吧',
        images: [{ url: ogImage, width: 1200, height: 630 }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${persona.name} — AI 数字分身`,
        description: persona.bio || '来和这个 AI 数字分身聊天吧',
        images: [ogImage],
      },
    }
  } catch {
    return { title: '炼化自己' }
  }
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: persona } = await supabaseAdmin
    .from('personas')
    .select('id, name, bio, persona_profile, created_at, chat_count')
    .eq('id', id)
    .single()

  if (!persona) {
    notFound()
  }

  return (
    <main className="flex flex-1 flex-col h-[calc(100dvh-3.5rem)] max-w-2xl mx-auto w-full border-x animate-page-enter">
      <ChatInterface persona={persona as import('@/types/persona').Persona} />
    </main>
  )
}
