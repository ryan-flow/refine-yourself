interface EmptyStateProps {
  personaName: string
}

export function EmptyState({ personaName }: EmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center space-y-2 max-w-xs">
        <div className="text-4xl">💬</div>
        <p className="text-sm text-muted-foreground">
          开始和 <span className="font-medium text-foreground">{personaName}</span> 对话吧
        </p>
        <p className="text-xs text-muted-foreground/60">
          发送一条消息，AI 将以该人物的语气和风格回复你
        </p>
      </div>
    </div>
  )
}
