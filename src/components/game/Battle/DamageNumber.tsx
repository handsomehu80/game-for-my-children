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
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '36px',
        fontWeight: 'bold',
        color,
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        animation: 'damageBounce 800ms ease-out forwards',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      -{value}
    </div>
  )
}