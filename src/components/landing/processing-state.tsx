'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  { key: 'reading', label: '读取聊天记录...' },
  { key: 'analyzing', label: '分析语言风格...' },
  { key: 'generating', label: '生成人格画像...' },
]

interface ProcessingStateProps {
  personaName?: string
}

export function ProcessingState({ personaName }: ProcessingStateProps) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 1200),
      setTimeout(() => setActiveStep(2), 2800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="space-y-6 py-8">
      <div className="space-y-4">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center">
              {i < activeStep ? (
                <span className="text-green-500 text-sm">✓</span>
              ) : i === activeStep ? (
                <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <span className="size-2 rounded-full bg-muted-foreground/30" />
              )}
            </div>
            <span
              className={
                i <= activeStep ? 'text-foreground' : 'text-muted-foreground/50'
              }
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {personaName && (
        <p className="text-xs text-center text-muted-foreground">
          正在为「{personaName}」提炼人格特征...
        </p>
      )}
    </div>
  )
}
