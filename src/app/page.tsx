'use client'

import { useState, useCallback } from 'react'
import { HeroSection } from '@/components/landing/hero-section'
import { UploadArea } from '@/components/landing/upload-area'
import { NameInput } from '@/components/landing/name-input'
import { ProcessingState } from '@/components/landing/processing-state'
import { PersonaResult } from '@/components/landing/persona-result'
import { ShareResult } from '@/components/landing/share-result'
import { Button } from '@/components/ui/button'
import { Toaster, toast } from 'sonner'
import type { CreatePersonaResponse } from '@/types/api'

type PageState = 'idle' | 'uploading' | 'success' | 'error'

export default function HomePage() {
  const [state, setState] = useState<PageState>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [personaName, setPersonaName] = useState('')
  const [result, setResult] = useState<CreatePersonaResponse | null>(null)

  const handleFileSelect = useCallback((f: File) => {
    setFile(f)
    setState('idle')
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!file) return

    setState('uploading')
    const formData = new FormData()
    formData.append('file', file)
    if (personaName) formData.append('name', personaName)

    try {
      const res = await fetch('/api/persona', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (!json.ok) {
        toast.error(json.error || '创建失败')
        setState('error')
        return
      }

      setResult(json.data)
      setState('success')
    } catch {
      toast.error('网络错误，请重试')
      setState('error')
    }
  }, [file, personaName])

  const handleReset = useCallback(() => {
    setFile(null)
    setPersonaName('')
    setResult(null)
    setState('idle')
  }, [])

  return (
    <>
      <main className="mx-auto flex max-w-lg flex-1 flex-col px-4 py-6 animate-page-enter">
        <HeroSection />

        {(state === 'idle' || state === 'error') && (
          <div className="mt-4 space-y-4">
            <UploadArea
              onFileSelect={handleFileSelect}
              disabled={false}
              currentFile={file}
            />
            <NameInput
              value={personaName}
              onChange={setPersonaName}
              disabled={false}
            />
            <Button
              className="w-full"
              size="lg"
              disabled={!file}
              onClick={handleSubmit}
            >
              开始炼化
            </Button>
          </div>
        )}

        {state === 'uploading' && (
          <div className="mt-6">
            <ProcessingState personaName={personaName || undefined} />
          </div>
        )}

        {state === 'success' && result && (
          <div className="mt-4 space-y-4">
            <PersonaResult
              name={result.persona.name}
              bio={result.persona.bio}
              profile={result.persona.persona_profile}
            />
            <ShareResult
              shareUrl={result.shareUrl}
              adminToken={result.persona.admin_token}
              personaId={result.persona.id}
            />
            <Button variant="ghost" className="w-full text-xs" onClick={handleReset}>
              重新开始
            </Button>
          </div>
        )}

        {state === 'error' && (
          <div className="mt-4 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              创建失败，请检查聊天记录后重试
            </p>
            <Button variant="outline" onClick={handleReset}>
              重新上传
            </Button>
          </div>
        )}
      </main>
      <Toaster position="top-center" richColors />
    </>
  )
}
