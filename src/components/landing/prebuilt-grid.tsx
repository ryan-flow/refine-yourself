'use client'

import { useRef, useState } from 'react'
import { prebuiltPersonas } from '@/data/prebuilt-personas'
import { MessageCircle } from 'lucide-react'

const personaThemeColor: Record<string, string> = {
  musk: '#3b82f6',
  jobs: '#a3a3a3',
  luoxiang: '#c9a96e',
  zhangxuefeng: '#f59e0b',
  einstein: '#a3c98f',
  taylor: '#e8a0bf',
  zhugeliang: '#c24141',
  miyazaki: '#7ab87a',
  libai: '#c0c8e8',
  wukong: '#f0a030',
  luxun: '#c9a96e',
  curie: '#a3c98f',
}

const personaQuote: Record<string, string> = {
  musk: '「我想死在火星上」',
  jobs: '「Stay hungry, stay foolish」',
  luoxiang: '「法律是最低的道德标准」',
  zhangxuefeng: '「信息差就是命运差」',
  einstein: '「想象力比知识更重要」',
  taylor: '「Shake it off」',
  zhugeliang: '「鞠躬尽瘁，死而后已」',
  miyazaki: '「创作就是把自己逼到极限」',
  libai: '「人生得意须尽欢」',
  wukong: '「俺老孙来也」',
  luxun: '「真的猛士，敢于直面惨淡的人生」',
  curie: '「科学发现属于全人类」',
}

interface PrebuiltGridProps {
  onSelect: (slug: string) => void
}

function PersonaCard({ persona, index, onSelect }: {
  persona: typeof prebuiltPersonas[number]
  index: number
  onSelect: (slug: string) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [glowPos, setGlowPos] = useState({ x: 0.5, y: 0.5 })
  const [isHovered, setIsHovered] = useState(false)
  const accent = personaThemeColor[persona.slug] || '#6080c0'
  const initials = persona.name[0]

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setGlowPos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <button
      className="w-full text-left"
      onClick={() => onSelect(persona.slug)}
    >
      <div
        ref={cardRef}
        className="group relative rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-card-in"
        style={{
          animationDelay: `${index * 0.06}s`,
          boxShadow: isHovered
            ? `0 8px 32px -4px ${accent}22, 0 2px 8px -2px ${accent}18`
            : '0 1px 3px rgba(0,0,0,0.04)',
          borderColor: isHovered ? `${accent}44` : undefined,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
      >
        {/* 鼠标跟随光斑 */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle 160px at ${glowPos.x * 100}% ${glowPos.y * 100}%, ${accent}12, transparent 70%)`,
          }}
        />

        <div className="relative space-y-3">
          {/* 头像 + 名字 */}
          <div className="flex items-center gap-3">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-base font-bold transition-all duration-300"
              style={{
                background: `${accent}18`,
                color: accent,
                boxShadow: isHovered ? `0 0 16px -2px ${accent}44` : undefined,
              }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold truncate">{persona.name}</p>
              <p className="text-[11px] text-muted-foreground/60 truncate">
                {personaQuote[persona.slug] || persona.bio.slice(0, 16)}
              </p>
            </div>
          </div>

          {/* 标签 — 单行截断 */}
          <div className="flex gap-1 overflow-hidden">
            {persona.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium shrink-0"
                style={{ background: `${accent}10`, color: accent }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 开始对话 */}
          <div
            className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-medium transition-all duration-300"
            style={{
              background: isHovered ? `${accent}18` : `${accent}08`,
              color: accent,
            }}
          >
            <MessageCircle className="size-3.5" />
            开始对话
          </div>
        </div>
      </div>
    </button>
  )
}

export function PrebuiltGrid({ onSelect }: PrebuiltGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {prebuiltPersonas.map((persona, i) => (
        <PersonaCard
          key={persona.slug}
          persona={persona}
          index={i}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
