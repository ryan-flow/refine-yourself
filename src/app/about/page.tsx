import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Download, Upload, Brain, Share2, BookOpen, ExternalLink } from 'lucide-react'

const steps = [
  { icon: Download, title: '导出聊天记录', desc: '使用 WeChatMsg（Windows）将微信聊天记录导出为 .txt 格式。也支持 WhatsApp / Telegram 导出。' },
  { icon: Upload, title: '上传到网站', desc: '在首页上传你的 .txt 文件，可选填分身名称。' },
  { icon: Brain, title: 'AI 分析人格', desc: '系统自动分析聊天记录中的语言风格、常用词汇、语气特点，生成人格画像。' },
  { icon: Share2, title: '分享与对话', desc: '获得分享链接，发给朋友即可与你的数字分身对话。' },
]

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-prose flex-1 px-4 py-10 space-y-8 animate-page-enter bg-mesh-gradient">
      <div className="text-center space-y-3">
        <div className="mx-auto h-px w-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-4" />
        <h1 className="text-2xl font-bold tracking-tight">关于 炼化自己</h1>
        <p className="text-sm text-muted-foreground">
          从聊天记录中淬炼你的数字分身
        </p>
      </div>

      {/* 使用步骤 */}
      <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-base">如何使用</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm leading-relaxed">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                <s.icon className="size-4" />
              </div>
              <div>
                <p className="font-medium text-foreground">{i + 1}. {s.title}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 导出指南 */}
      <Card className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground" />
            如何导出微信聊天记录
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p>
            推荐使用开源工具{' '}
            <a
              href="https://github.com/LC044/WeChatMsg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              WeChatMsg
              <ExternalLink className="size-3" />
            </a>{' '}
            （GitHub 39k+ Stars）：
          </p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-xs">
            <li>在 Windows 电脑上下载并打开 WeChatMsg</li>
            <li>扫码登录微信</li>
            <li>选择需要导出的聊天对话</li>
            <li>导出格式选择 .txt</li>
            <li>将导出的 .txt 文件上传到本网站即可</li>
          </ol>
          <p className="text-[11px] text-muted-foreground/50">
            仅支持 Windows 端微信，其他平台请使用对应导出工具
          </p>
        </CardContent>
      </Card>

      <Separator className="bg-border/30" />

      {/* 隐私 */}
      <div className="text-xs text-muted-foreground/60 space-y-3">
        <h2 className="font-medium text-sm text-foreground/80">隐私说明</h2>
        <p className="leading-relaxed">
          上传的聊天记录仅用于 AI 分析生成人格画像，分析完成后原始数据不会被存储。
          数据库中仅保留提炼后的人格描述文本。
        </p>
        <p className="leading-relaxed">
          每个分身通过随机生成的唯一链接访问，不存在公开列表页面。
        </p>
      </div>
    </main>
  )
}
