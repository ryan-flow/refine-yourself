'use client'

import { useEffect, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'

const STEPS = [
  { key: 'reading', label: '读取聊天记录', detail: '解析消息结构...' },
  { key: 'analyzing', label: '分析语言风格', detail: '识别用词习惯、语气特征...' },
  { key: 'generating', label: '淬炼人格画像', detail: '生成五层人格特征...' },
]

interface ProcessingStateProps {
  personaName?: string
}

export function ProcessingState({ personaName }: ProcessingStateProps) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 1500),
      setTimeout(() => setActiveStep(2), 3500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="space-y-2 py-10 relative overflow-hidden rounded-2xl border border-border/30 bg-card/40 backdrop-blur-sm p-6 animate-card-in">
      {/* 进度线 + 步骤 */}
      <div className="relative space-y-0">
        {/* 竖线 */}
        <div className="absolute left-[15px] top-3 bottom-3 w-px bg-border/60" />

        {STEPS.map((step, i) => (
          <div
            key={step.key}
            className="relative flex items-start gap-4 py-3 animate-slide-in"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            {/* 节点 */}
            <div className="relative z-10 flex size-[30px] shrink-0 items-center justify-center rounded-full border-2 transition-all duration-500 bg-background">
              {i < activeStep ? (
                <span className="flex size-full items-center justify-center rounded-full bg-primary border-2 border-primary text-primary-foreground animate-check-pop">
                  <Check className="size-3.5" />
                </span>
              ) : i === activeStep ? (
                <span className="flex size-full items-center justify-center rounded-full border-primary animate-pulse-node">
                  <span className="size-2.5 rounded-full bg-primary animate-pulse" />
                </span>
              ) : (
                <span className="size-2 rounded-full bg-muted-foreground/30" />
              )}
            </div>

            {/* 文字 */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p
                className={
                  i <= activeStep
                    ? 'text-sm font-medium text-foreground'
                    : 'text-sm text-muted-foreground/50'
                }
              >
                {step.label}
              </p>
              {i === activeStep && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                  <Sparkles className="size-3 text-primary" />
                  {step.detail}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {personaName && activeStep === 2 && (
        <p className="text-xs text-center text-muted-foreground animate-slide-in pt-4">
          正在为「{personaName}」完成最后的提炼...
        </p>
      )}
    </div>
  )
}
