'use client'

import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          炼化自己
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/about" className="hover:text-foreground transition-colors">
            关于
          </Link>
        </nav>
      </div>
    </header>
  )
}
