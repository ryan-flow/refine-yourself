'use client'

import { useState, useCallback } from 'react'
import { HeroSection } from '@/components/landing/hero-section'
import { UploadArea } from '@/components/landing/upload-area'
import { NameInput } from '@/components/landing/name-input'
import { ProcessingState } from '@/components/landing/processing-state'
import { PersonaResult } from '@/components/landing/persona-result'
import { PrebuiltGrid } from '@/components/landing/prebuilt-grid'
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
      <main className="mx-auto flex max-w-lg flex-1 flex-col px-4 py-6 animate-page-enter relative">
        {/* 背景氛围光斑 */}
        <div className="ambient-blob -top-40 -left-20 w-72 h-72" style={{ background: 'var(--primary)' }} />
        <div className="ambient-blob -bottom-20 -right-20 w-80 h-80" style={{ background: 'var(--primary)', animationDelay: '-10s', animationDuration: '24s' }} />

        <HeroSection />

        {/* 角色对话广场 */}
        <section className="space-y-3">
          <p className="text-xs text-muted-foreground/60 text-center">选一个角色，立刻开始对话</p>
          <PrebuiltGrid />
        </section>

        {/* 分割线 + 上传区 */}
        <div className="mt-10 mb-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border/50" />
          <span className="text-xs text-muted-foreground/50 shrink-0">或者，炼化你自己</span>
          <div className="flex-1 h-px bg-border/50" />
        </div>

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
              className="w-full btn-press"
              size="lg"
              disabled={!file}
              onClick={handleSubmit}
            >
              开始炼化
            </Button>
            {!file && (
              <p className="text-xs text-center text-muted-foreground/60">
                请先上传聊天记录文件
              </p>
            )}
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
              personaName={result.persona.name}
              personaBio={result.persona.bio}
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
