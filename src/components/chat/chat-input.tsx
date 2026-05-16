'use client'

import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [text, disabled, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [])

  return (
    <div className="flex items-end gap-2 border-t border-border/40 bg-card/40 backdrop-blur-sm p-3">
      <Textarea
        ref={textareaRef}
        placeholder="说点什么..."
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="min-h-[44px] max-h-[120px] resize-none text-base bg-muted/50 border-border/40 placeholder:text-muted-foreground/50"
        rows={1}
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="shrink-0 size-11 rounded-xl transition-all duration-200 disabled:opacity-30 btn-press"
      >
        <ArrowUp className="size-4" />
      </Button>
    </div>
  )
}
