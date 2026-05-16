'use client'

import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { validateChatFile } from '@/lib/validators'
import { Upload } from 'lucide-react'

interface UploadAreaProps {
  onFileSelect: (file: File) => void
  disabled: boolean
  currentFile: File | null
}

export function UploadArea({ onFileSelect, disabled, currentFile }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateChatFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
      setError(null)
      onFileSelect(file)
    },
    [onFileSelect],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      e.target.value = ''
    },
    [handleFile],
  )

  return (
    <div className="space-y-3">
      <div
        className={cn(
          'group relative rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 cursor-pointer border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/30',
          isDragging && 'border-primary/50 bg-primary/[0.04] shadow-[0_0_32px_-4px_var(--primary)/8] scale-[1.01]',
          disabled && 'opacity-50 pointer-events-none',
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        {currentFile ? (
          <div className="space-y-1">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Upload className="size-5" />
            </div>
            <p className="text-sm font-medium mt-3">{currentFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(currentFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground transition-colors duration-300 group-hover:text-primary">
              <Upload className="size-6" />
            </div>
            <div>
              <p className="text-[15px] text-muted-foreground">
                拖拽 <span className="text-foreground font-medium">.txt</span> 文件到此处
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                或点击选择文件 · 支持微信 / WhatsApp / Telegram 导出
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  )
}
