import { Input } from '@/components/ui/input'
import { CopyButton } from '@/components/shared/copy-button'
import { Button } from '@/components/ui/button'

interface ShareResultProps {
  shareUrl: string
  adminToken: string
  personaId: string
}

export function ShareResult({ shareUrl, adminToken, personaId }: ShareResultProps) {
  return (
    <div className="space-y-4 rounded-xl border p-5">
      <div className="space-y-2">
        <label className="text-sm font-medium">分享链接</label>
        <div className="flex gap-2">
          <Input value={shareUrl} readOnly className="text-xs" />
          <CopyButton text={shareUrl} label="复制" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">管理令牌</label>
        <div className="flex gap-2">
          <Input value={adminToken} readOnly className="text-xs font-mono" />
          <CopyButton text={adminToken} label="复制" />
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400">
          ⚠ 请保存好此令牌，删除分身需要它。此令牌只会显示一次。
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button className="flex-1" onClick={() => window.location.href = `/chat/${personaId}`}>
          立即对话
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => window.location.href = '/'}>
          再炼一个
        </Button>
      </div>
    </div>
  )
}
