import { Sparkles } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t py-6 text-center text-xs text-muted-foreground">
      <div className="mx-auto max-w-4xl px-4 flex items-center justify-center gap-1.5">
        <Sparkles className="size-3 text-primary/60" />
        炼化自己 — 从聊天记录中提炼你的数字分身
      </div>
    </footer>
  )
}
