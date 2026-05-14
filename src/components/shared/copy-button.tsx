'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  text: string
  label?: string
}

export function CopyButton({ text, label = '复制' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
      {copied ? (
        <>
          <span className="size-3.5">✓</span>
          已复制
        </>
      ) : (
        <>
          <span className="size-3.5">📋</span>
          {label}
        </>
      )}
    </Button>
  )
}
