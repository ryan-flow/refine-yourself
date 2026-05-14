import { supabaseAdmin } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ChatInterface } from '@/components/chat/chat-interface'

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
    <main className="flex flex-1 flex-col h-[calc(100vh-3.5rem)] max-w-2xl mx-auto w-full border-x">
      <ChatInterface persona={persona as import('@/types/persona').Persona} />
    </main>
  )
}
