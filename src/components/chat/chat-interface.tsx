'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { PersonaHeader } from './persona-header'
import { ChatMessageBubble } from './chat-message'
import { ChatInput } from './chat-input'
import { TypingIndicator } from './typing-indicator'
import { EmptyState } from './empty-state'
import { ShareModal } from '../shared/share-modal'
import { Toaster, toast } from 'sonner'
import {
  saveConversation,
  loadConversation,
  generateMessageId,
} from '@/lib/chat-storage'
import type { Persona } from '@/types/persona'
import type { ChatMessage } from '@/types/chat'

interface ChatInterfaceProps {
  persona: Persona
}

export function ChatInterface({ persona }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setShareUrl(window.location.href)
  }, [])

  // 推断 persona 主题
  const personaTheme = persona.id.startsWith('prebuilt-')
    ? persona.id.replace('prebuilt-', '')
    : 'default'

  useEffect(() => {
    const saved = loadConversation(persona.id)
    if (saved) {
      setMessages(saved.messages)
    }
  }, [persona.id])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: generateMessageId(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      }

      const updated = [...messages, userMsg]
      setMessages(updated)
      setIsLoading(true)

      const history = updated.slice(-20).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      const isPrebuilt = persona.id.startsWith('prebuilt-')
      const chatApi = isPrebuilt
        ? `/api/chat/prebuilt/${persona.id.replace('prebuilt-', '')}`
        : `/api/chat/${persona.id}`

      try {
        const res = await fetch(chatApi, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history }),
        })

        const json = await res.json()

        if (!json.ok) {
          toast.error(json.error || '回复失败')
          return
        }

        const reply: ChatMessage = {
          id: generateMessageId(),
          role: 'assistant',
          content: json.data.reply,
          timestamp: new Date().toISOString(),
        }

        const withReply = [...updated, reply]
        setMessages(withReply)

        saveConversation(persona.id, {
          id: persona.id,
          personaId: persona.id,
          messages: withReply,
          createdAt: withReply[0]?.timestamp || new Date().toISOString(),
          updatedAt: reply.timestamp,
        })
      } catch {
        toast.error('网络错误，请重试')
      } finally {
        setIsLoading(false)
      }
    },
    [messages, persona.id],
  )

  // 对话样本：优先用真实对话，否则用人设样本
  const profile = persona.persona_profile as Record<string, unknown> | null
  const presetSamples = (profile?.conversation_samples || profile?.samples || []) as { q: string; a: string }[]
  const chatSamples = messages.length >= 2
    ? messages.filter(m => m.role === 'user').slice(0, 2).map(m => {
        const reply = messages.find(r => r.role === 'assistant' && r.timestamp > m.timestamp)
        return { q: m.content, a: reply?.content || '...' }
      })
    : presetSamples

  return (
    <div className="flex flex-1 flex-col">
      <PersonaHeader
        name={persona.name}
        bio={persona.bio}
        profile={persona.persona_profile}
        onShare={() => setShowShare(true)}
      />

      <div className="flex flex-1 flex-col overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState personaName={persona.name} />
        ) : (
          <div className="flex-1 space-y-3 px-4 py-4">
            {messages.map((msg, i) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                personaName={persona.name}
                index={i}
              />
            ))}
          </div>
        )}

        {isLoading && (
          <div className="px-4 pb-2">
            <TypingIndicator personaName={persona.name} />
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={isLoading} />
      <Toaster position="top-center" richColors />

      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        personaName={persona.name}
        personaBio={persona.bio}
        shareUrl={shareUrl}
        samples={chatSamples}
        theme={personaTheme}
      />
    </div>
  )
}
