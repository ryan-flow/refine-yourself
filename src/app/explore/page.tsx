'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { prebuiltPersonas } from '@/data/prebuilt-personas'
import { ArrowLeft } from 'lucide-react'

export default function ExplorePage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-1 flex-col px-4 py-6">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          返回首页
        </Link>
      </div>

      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">现成角色</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          选择一位角色，立即开始对话。无需上传任何数据。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prebuiltPersonas.map((p) => (
          <Card key={p.slug} className="group hover:shadow-md transition-shadow flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <span className="text-3xl" role="img" aria-label={p.name}>
                  {p.avatar}
                </span>
              </div>
              <h2 className="text-lg font-semibold mt-2">{p.name}</h2>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {p.bio}
              </p>
            </CardHeader>
            <CardContent className="pt-0 mt-auto">
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button asChild className="w-full" size="sm">
                <Link href={`/chat/prebuilt/${p.slug}`}>开始对话</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
