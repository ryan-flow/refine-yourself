import { notFound } from 'next/navigation'
import { ChatInterface } from '@/components/chat/chat-interface'
import { getPrebuiltPersona } from '@/data/prebuilt-personas'
import type { Persona } from '@/types/persona'
import type { Metadata } from 'next'

const personaTheme: Record<string, string> = {
  musk: 'tech',
  jobs: 'minimal',
  luoxiang: 'scholar',
  zhangxuefeng: 'bold',
  einstein: 'classic',
  taylor: 'artistic',
  zhugeliang: 'ancient',
  miyazaki: 'nature',
}

function buildOgImageUrl(name: string, bio: string, theme: string): string {
  const params = new URLSearchParams({ name, bio, theme })
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://refineyourself.asia'
  return `${base}/api/og?${params.toString()}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = getPrebuiltPersona(slug)

  if (!data) return { title: '角色不存在' }

  const theme = personaTheme[data.slug] || 'default'
  const ogImage = buildOgImageUrl(data.name, data.bio, theme)

  return {
    title: `${data.name} — 炼化自己`,
    description: data.bio,
    openGraph: {
      title: `${data.name} — AI 数字分身`,
      description: data.bio,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.name} — AI 数字分身`,
      description: data.bio,
      images: [ogImage],
    },
  }
}

export async function generateStaticParams() {
  const { getAllPersonaSlugs } = await import('@/data/prebuilt-personas')
  return getAllPersonaSlugs().map((slug) => ({ slug }))
}

export default async function PrebuiltChatPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = getPrebuiltPersona(slug)

  if (!data) {
    notFound()
  }

  // 转成 Persona 格式，ChatInterface 复用
  const persona: Persona = {
    id: `prebuilt-${data.slug}`,
    name: data.name,
    bio: data.bio,
    persona_profile: data.profile,
    created_at: new Date().toISOString(),
    chat_count: 0,
  }

  return (
    <main className="flex flex-1 flex-col h-[calc(100dvh-3.5rem)] max-w-2xl mx-auto w-full border-x animate-page-enter">
      <ChatInterface persona={persona} />
    </main>
  )
}
