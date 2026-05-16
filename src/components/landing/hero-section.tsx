import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Users, ArrowRight } from 'lucide-react'

export function HeroSection() {
  return (
    <div className="text-center space-y-5 py-12 sm:py-16">
      {/* 顶部装饰线 */}
      <div className="mx-auto mb-4 h-px w-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        炼化自己
      </h1>

      <p className="text-muted-foreground max-w-md mx-auto text-[15px] sm:text-base leading-relaxed">
        上传你的聊天记录，AI 将从你的话语中
        <span className="text-primary font-medium"> 淬炼 </span>
        出属于你的数字分身。分享链接，让朋友与&ldquo;你&rdquo;对话。
      </p>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link href="/explore">
          <Button variant="outline" size="sm" className="group">
            <Users className="size-3.5 mr-1" />
            试玩现成角色
            <ArrowRight className="size-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
        <span className="text-xs text-muted-foreground">或</span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="size-3" />
          上传自己的聊天记录
        </span>
      </div>
    </div>
  )
}
