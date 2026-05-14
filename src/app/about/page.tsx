import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-prose flex-1 px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">关于 炼化自己</h1>
        <p className="text-sm text-muted-foreground">
          从聊天记录中提炼你的数字分身
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">如何使用</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <div className="space-y-1">
            <p className="font-medium">1. 导出聊天记录</p>
            <p className="text-muted-foreground">
              使用 WeChatMsg（Windows）将微信聊天记录导出为 .txt 格式。也支持 WhatsApp / Telegram 等其他聊天工具的导出文件。
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">2. 上传到网站</p>
            <p className="text-muted-foreground">
              在首页上传你的 .txt 文件，可选填分身名称。
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">3. AI 分析人格</p>
            <p className="text-muted-foreground">
              系统自动分析聊天记录中的语言风格、常用词汇、语气特点，生成人格画像。
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">4. 分享与对话</p>
            <p className="text-muted-foreground">
              获得分享链接，发给朋友即可与你的数字分身对话。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">如何导出微信聊天记录</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p>
            推荐使用开源工具{' '}
            <a
              href="https://github.com/LC044/WeChatMsg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              WeChatMsg
            </a>{' '}
            （GitHub 39k+ Stars）：
          </p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>在 Windows 电脑上下载并打开 WeChatMsg</li>
            <li>扫码登录微信</li>
            <li>选择需要导出的聊天对话</li>
            <li>导出格式选择 .txt</li>
            <li>将导出的 .txt 文件上传到本网站即可</li>
          </ol>
          <p className="text-xs text-muted-foreground/60 mt-2">
            ⚠ 仅支持 Windows 端微信，其他平台请使用对应导出工具
          </p>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-xs text-muted-foreground/60 space-y-2">
        <h2 className="font-medium text-foreground">隐私说明</h2>
        <p>
          上传的聊天记录仅用于 AI 分析生成人格画像，分析完成后原始数据不会被存储。
          数据库中仅保留提炼后的人格描述文本。
        </p>
        <p>
          每个分身通过随机生成的唯一链接访问，不存在公开列表页面。
        </p>
      </div>
    </main>
  )
}
