'use client'

import { useRef, useCallback, useState } from 'react'
import { toPng } from 'html-to-image'
import { Download, Copy, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ShareModalProps {
  open: boolean
  onClose: () => void
  personaName: string
  personaBio: string
  shareUrl: string
  /** 对话样本 [{q, a}] */
  samples?: { q: string; a: string }[]
  /** 主题色 */
  theme?: string
}

const themeGradients: Record<string, { bg: string; accent: string; text: string }> = {
  tech: { bg: 'linear-gradient(135deg, #0a0e27, #1a1f4a)', accent: '#3b82f6', text: '#e8f0ff' },
  minimal: { bg: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)', accent: '#f5f5f5', text: '#f0f0f0' },
  scholar: { bg: 'linear-gradient(135deg, #1a0e0e, #3d1a1a)', accent: '#c9a96e', text: '#f5f0e8' },
  bold: { bg: 'linear-gradient(135deg, #1a0505, #4a1010)', accent: '#f59e0b', text: '#fff5e8' },
  classic: { bg: 'linear-gradient(135deg, #1a2414, #2d3d1f)', accent: '#a3c98f', text: '#f2f7f0' },
  artistic: { bg: 'linear-gradient(135deg, #1a0a20, #3d1040)', accent: '#e8a0bf', text: '#fdf5f9' },
  ancient: { bg: 'linear-gradient(135deg, #0d0d0d, #1a1210)', accent: '#c24141', text: '#f5f0e8' },
  nature: { bg: 'linear-gradient(135deg, #0e1a0e, #1a2d1a)', accent: '#7ab87a', text: '#f2f7f2' },
  poet: { bg: 'linear-gradient(135deg, #0a0e1a, #1a1530)', accent: '#c0c8e8', text: '#f0f0f8' },
  mythic: { bg: 'linear-gradient(135deg, #1a0800, #3d1200)', accent: '#f0a030', text: '#fff5e8' },
  default: { bg: 'linear-gradient(135deg, #0f1117, #1c2333)', accent: '#6080c0', text: '#f0f2f8' },
}

export function ShareModal({
  open,
  onClose,
  personaName,
  personaBio,
  shareUrl,
  samples = [],
  theme = 'default',
}: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  const t = themeGradients[theme] || themeGradients.default
  const initials = personaName[0] || '?'
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}&bgcolor=transparent&color=${t.accent.replace('#', '')}`

  const handleSaveImage = useCallback(async () => {
    if (!cardRef.current) return
    setSaving(true)
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      })
      const link = document.createElement('a')
      link.download = `${personaName}-炼化自己.png`
      link.href = dataUrl
      link.click()
    } catch (e) {
      console.error('Save failed:', e)
    } finally {
      setSaving(false)
    }
  }, [personaName])

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [shareUrl])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-page-enter">
      <div className="relative w-full max-w-md space-y-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 flex size-8 items-center justify-center rounded-full bg-background border border-border/50 text-muted-foreground hover:text-foreground shadow-md"
        >
          <X className="size-4" />
        </button>

        {/* Card preview */}
        <div
          ref={cardRef}
          className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl relative"
          style={{ background: t.bg }}
        >
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Top: Persona info */}
            <div className="flex items-center gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
                style={{ background: `${t.accent}22`, color: t.accent }}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: t.text }}>
                  {personaName}
                </p>
                <p className="text-[11px] opacity-60 truncate" style={{ color: t.text }}>
                  {personaBio.slice(0, 40)}
                </p>
              </div>
              <div
                className="ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                style={{ background: `${t.accent}22`, color: t.accent }}
              >
                AI 数字分身
              </div>
            </div>

            {/* Middle: Chat samples */}
            {samples.length > 0 && (
              <div className="flex-1 flex flex-col justify-center gap-2 my-4 px-2">
                {samples.slice(0, 2).map((s, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-end">
                      <span
                        className="max-w-[75%] rounded-2xl rounded-tr-sm px-3 py-1.5 text-[11px] leading-relaxed"
                        style={{ background: `${t.accent}44`, color: t.text }}
                      >
                        {s.q.length > 40 ? s.q.slice(0, 40) + '…' : s.q}
                      </span>
                    </div>
                    <div className="flex justify-start">
                      <span
                        className="max-w-[80%] rounded-2xl rounded-tl-sm px-3 py-1.5 text-[11px] leading-relaxed"
                        style={{ background: 'rgba(255,255,255,0.08)', color: t.text }}
                      >
                        {s.a.length > 50 ? s.a.slice(0, 50) + '…' : s.a}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom: Brand + QR */}
            <div className="flex items-end justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] font-medium opacity-50" style={{ color: t.text }}>
                  扫描二维码 · 和 TA 对话
                </p>
                <p className="text-xs font-semibold tracking-wide" style={{ color: t.accent }}>
                  炼化自己
                </p>
              </div>
              <div className="flex size-[72px] shrink-0 items-center justify-center rounded-xl bg-white/90 p-1.5">
                <img
                  src={qrUrl}
                  alt="QR"
                  className="size-full rounded-lg"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div
            className="absolute -top-20 -right-20 size-64 rounded-full border opacity-[0.06]"
            style={{ borderColor: t.accent, borderWidth: 2 }}
          />
          <div
            className="absolute -bottom-16 -left-16 size-48 rounded-full border opacity-[0.04]"
            style={{ borderColor: t.accent, borderWidth: 2 }}
          />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-24"
            style={{ background: `linear-gradient(90deg, transparent, ${t.accent}, transparent)` }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            className="flex-1 btn-press gap-2"
            onClick={handleSaveImage}
            disabled={saving}
          >
            <Download className="size-4" />
            {saving ? '生成中...' : '保存图片'}
          </Button>
          <Button
            variant="outline"
            className="flex-1 btn-press gap-2 border-border/50"
            onClick={handleCopyLink}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? '已复制' : '复制链接'}
          </Button>
        </div>
        <p className="text-center text-[11px] text-muted-foreground/60">
          保存图片发到朋友圈或微信群，朋友扫码即可对话
        </p>
      </div>
    </div>
  )
}
