'use client'

import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { validateChatFile } from '@/lib/validators'

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
          'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50',
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
            <p className="text-sm font-medium">{currentFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(currentFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-3xl">📄</div>
            <p className="text-sm text-muted-foreground">
              拖拽 .txt 文件到此处，或点击选择文件
            </p>
            <p className="text-xs text-muted-foreground/60">
              支持微信 / WhatsApp / Telegram 导出的聊天记录
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  )
}
