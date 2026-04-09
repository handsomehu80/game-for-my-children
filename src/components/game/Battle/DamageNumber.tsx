// src/components/game/Battle/DamageNumber.tsx
interface DamageNumberProps {
  value: number
  target: 'monster' | 'player'
}

export default function DamageNumber({ value, target }: DamageNumberProps) {
  // 怪物扣血红色，玩家扣血橙色
  const color = target === 'monster' ? '#ff4444' : '#ff9800'

  return (
    <div
      className="damage-number"
      style={{ color }}
    >
      -{value}
    </div>
  )
}