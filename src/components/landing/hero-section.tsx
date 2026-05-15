import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Users } from 'lucide-react'

export function HeroSection() {
  return (
    <div className="text-center space-y-3 py-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        炼化自己
      </h1>
      <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
        上传你的聊天记录，AI 将从你的话语中提炼出属于你的数字分身。
        分享链接，让朋友与&ldquo;你&rdquo;对话。
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Button variant="outline" asChild size="sm">
          <Link href="/explore">
            <Users className="size-3.5 mr-1" />
            试玩现成角色
          </Link>
        </Button>
        <span className="text-xs text-muted-foreground">或</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="size-3" />
          上传自己的聊天记录
        </span>
      </div>
    </div>
  )
}
