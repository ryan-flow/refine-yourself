'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prebuiltPersonas } from '@/data/prebuilt-personas'
import { ArrowLeft } from 'lucide-react'

export default function ExplorePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-1 flex-col px-4 py-6 animate-page-enter">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="size-3.5" />
          返回首页
        </Link>
      </div>

      <div className="text-center space-y-3 mb-10">
        <div className="mx-auto h-px w-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-4" />
        <h1 className="text-2xl font-bold tracking-tight">现成角色</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          选择一位角色，立即开始对话。无需上传任何数据。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prebuiltPersonas.map((p) => (
          <Card
            key={p.slug}
            className="group border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* 顶部微光条 */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="pb-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {p.avatar}
              </div>
              <h2 className="text-lg font-semibold mt-3">{p.name}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {p.bio}
              </p>
            </CardHeader>

            <CardContent className="pt-0 mt-auto">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[11px]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Link href={`/chat/prebuilt/${p.slug}`}>
                <Button className="w-full btn-press" size="sm">开始对话</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
