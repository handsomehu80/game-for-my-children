
interface TeamHPBarProps {
  current: number
  max: number
}

export function TeamHPBar({ current, max }: TeamHPBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))
  const isLow = percentage < 30

  return (
    <div className="team-hp-bar">
      <div className="team-hp-label">
        <span className="label-text">队伍 HP</span>
        <span className="hp-value">{current} / {max}</span>
      </div>
      <div className="hp-bar-container">
        <div
          className={`hp-bar-fill ${isLow ? 'low' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}