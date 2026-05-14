import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { PersonaProfile } from '@/types/persona'

interface PersonaResultProps {
  name: string
  bio: string
  profile: PersonaProfile
}

export function PersonaResult({ name, bio, profile }: PersonaResultProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
            {name[0]}
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            {bio && (
              <p className="text-xs text-muted-foreground mt-0.5">{bio}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-xs font-medium text-muted-foreground">语气</span>
          <Badge variant="secondary" className="ml-2">
            {profile.tone}
          </Badge>
        </div>

        <div>
          <span className="text-xs font-medium text-muted-foreground">性格特征</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {profile.personality_traits?.map((trait: string) => (
              <Badge key={trait} variant="outline">
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <span className="text-xs font-medium text-muted-foreground">常聊话题</span>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {(profile.topics || []).map((topic: string) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {profile.samples && profile.samples.length > 0 && (
          <>
            <Separator />
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                对话样本
              </span>
              <div className="space-y-2 mt-2">
                {profile.samples.slice(0, 2).map((s, i) => (
                  <div key={i} className="rounded-lg bg-muted/50 p-2.5 text-xs space-y-1">
                    <p className="text-muted-foreground">
                      <span className="font-medium">对方：</span>
                      {s.q}
                    </p>
                    <p>
                      <span className="font-medium">{name}：</span>
                      {s.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
