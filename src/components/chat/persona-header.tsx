'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { PersonaProfile } from '@/types/persona'

interface PersonaHeaderProps {
  name: string
  bio: string
  profile: PersonaProfile
}

export function PersonaHeader({ name, bio, profile }: PersonaHeaderProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="border-b bg-background">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link
          href="/"
          className="flex size-8 items-center justify-center rounded-full hover:bg-muted transition-colors text-sm"
        >
          ←
        </Link>
        <div
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {name[0]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            {bio && (
              <p className="text-xs text-muted-foreground truncate">{bio}</p>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="border-t px-4 py-3 space-y-2">
          <div>
            <span className="text-xs font-medium text-muted-foreground">语气</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              {profile.tone}
            </Badge>
          </div>
          <div>
            <span className="text-xs font-medium text-muted-foreground">性格</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.personality_traits?.map((t) => (
                <Badge key={t} variant="outline" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
          {profile.style_notes && (
            <p className="text-xs text-muted-foreground">{profile.style_notes}</p>
          )}
        </div>
      )}
    </div>
  )
}
