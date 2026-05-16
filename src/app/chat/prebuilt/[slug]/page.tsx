import { notFound } from 'next/navigation'
import { ChatInterface } from '@/components/chat/chat-interface'
import { getPrebuiltPersona } from '@/data/prebuilt-personas'
import type { Persona } from '@/types/persona'

export async function generateStaticParams() {
  const { getAllPersonaSlugs } = await import('@/data/prebuilt-personas')
  return getAllPersonaSlugs().map((slug) => ({ slug }))
}

export default async function PrebuiltChatPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getPrebuiltPersona(slug)

  if (!data) {
    notFound()
  }

  // 转成 Persona 格式，ChatInterface 复用
  const persona: Persona = {
    id: `prebuilt-${data.slug}`,
    name: data.name,
    bio: data.bio,
    persona_profile: data.profile,
    created_at: new Date().toISOString(),
    chat_count: 0,
  }

  return (
    <main className="flex flex-1 flex-col h-[calc(100dvh-3.5rem)] max-w-2xl mx-auto w-full border-x animate-page-enter">
      <ChatInterface persona={persona} />
    </main>
  )
}
