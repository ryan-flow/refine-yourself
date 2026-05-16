import { Input } from '@/components/ui/input'
import { CopyButton } from '@/components/shared/copy-button'
import { Button } from '@/components/ui/button'
import { ShieldAlert, ExternalLink, Copy, Check, Share2 } from 'lucide-react'
import { useState } from 'react'

interface ShareResultProps {
  shareUrl: string
  adminToken: string
  personaId: string
  personaName?: string
  personaBio?: string
}

export function ShareResult({ shareUrl, adminToken, personaId, personaName, personaBio }: ShareResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm p-5">
      {/* 分享预览卡片 */}
      <div className="rounded-lg border border-border/30 bg-background/50 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50" />
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Share2 className="size-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">分享预览</span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {personaName || 'AI 数字分身'} — 炼化自己
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {personaBio || '来和这个 AI 数字分身聊天吧'}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
            <ExternalLink className="size-3" />
            {shareUrl.length > 40 ? shareUrl.slice(0, 40) + '...' : shareUrl}
          </div>
        </div>
      </div>

      {/* 分享链接 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">分享链接</label>
        <div className="flex gap-2">
          <Input value={shareUrl} readOnly className="text-xs bg-muted/50" />
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-1"
            onClick={handleCopyUrl}
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? '已复制' : '复制'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground/60">
          将链接分享到微信、朋友圈或任何地方，朋友即可与你的数字分身对话
        </p>
      </div>

      {/* 管理令牌 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground/80">管理令牌</label>
        <div className="flex gap-2">
          <Input value={adminToken} readOnly className="text-xs font-mono bg-muted/50" />
          <CopyButton text={adminToken} label="复制" />
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldAlert className="size-3" />
          请保存好此令牌，删除分身需要它。此令牌只显示一次。
        </p>
      </div>

      {/* 操作 */}
      <div className="flex gap-3 pt-1">
        <Button className="flex-1 btn-press" onClick={() => window.location.href = `/chat/${personaId}`}>
          立即对话
        </Button>
        <Button variant="outline" className="flex-1 btn-press border-border/50" onClick={() => window.location.href = '/'}>
          再炼一个
        </Button>
      </div>
    </div>
  )
}
