import { Input } from '@/components/ui/input'

interface NameInputProps {
  value: string
  onChange: (value: string) => void
  disabled: boolean
}

export function NameInput({ value, onChange, disabled }: NameInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">分身名称（可选）</label>
      <Input
        placeholder="给你的数字分身起个名字..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  )
}
