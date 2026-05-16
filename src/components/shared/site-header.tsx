'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-3.5" />
          </span>
          炼化自己
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/explore" className="hover:text-foreground transition-colors duration-200">
            现成角色
          </Link>
          <Link href="/about" className="hover:text-foreground transition-colors duration-200">
            关于
          </Link>
        </nav>
      </div>
    </header>
  )
}
