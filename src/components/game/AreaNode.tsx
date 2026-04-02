import { useGameStore } from '../../store/gameStore'
import { getAreaById, getDifficultyStars } from '../../data/areas'

interface AreaNodeProps {
  areaId: string
  onClick?: (areaId: string) => void
}

export function AreaNode({ areaId, onClick }: AreaNodeProps) {
  const area = getAreaById(areaId)
  const exploration = useGameStore((state) => state.exploration)

  if (!area) return null

  const isUnlocked = area.requiredKeys === 0 || exploration?.unlockedAreas.includes(areaId)
  const isDefeated = exploration?.defeatedMiniBosses.includes(areaId)
  const isCurrent = exploration?.currentArea === areaId

  // 未解锁区域隐藏（探索式隐藏）
  if (!isUnlocked && !isDefeated) {
    return null
  }

  const handleClick = () => {
    if (isUnlocked && onClick) {
      onClick(areaId)
    }
  }

  // 根据区域类型渲染不同样式
  const getNodeStyle = () => {
    const base = {
      position: 'absolute' as const,
      left: `${area.position.x * 80 + 200}px`,
      top: `${area.position.z * 80 + 200}px`,
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: isUnlocked ? 'pointer' : 'not-allowed',
      transition: 'transform 0.2s',
      opacity: isDefeated && !isCurrent ? 0.6 : 1,
    }

    switch (area.type) {
      case 'boss':
        return { ...base, background: 'linear-gradient(135deg, #ff6b6b, #c92a2a)', border: '3px solid gold' }
      case 'hidden':
        return { ...base, background: 'linear-gradient(135deg, #9b59b6, #6c3483)', border: '2px dashed #9b59b6' }
      case 'treasure':
        return { ...base, background: 'linear-gradient(135deg, #ffd700, #f39c12)', border: '2px solid #ffd700' }
      default:
        return { ...base, background: 'linear-gradient(135deg, #4dabf7, #1c7ed6)', border: '2px solid #4dabf7' }
    }
  }

  return (
    <div
      style={getNodeStyle()}
      onClick={handleClick}
      title={`${area.name}\n难度: ${getDifficultyStars(area.difficulty)}\n${
        area.type === 'hidden' ? '需要钥匙' : ''
      }`}
    >
      {area.type === 'boss' && <span style={{ fontSize: '24px' }}>👑</span>}
      {area.type === 'hidden' && <span style={{ fontSize: '20px' }}>🔮</span>}
      {area.type === 'treasure' && <span style={{ fontSize: '20px' }}>📦</span>}
      {area.type === 'normal' && <span style={{ fontSize: '20px' }}>⚔️</span>}

      <span style={{ color: 'white', fontSize: '10px', marginTop: '4px', textAlign: 'center' }}>
        {area.name.length > 6 ? area.name.slice(0, 5) + '...' : area.name}
      </span>

      <span style={{ color: '#ffd700', fontSize: '10px' }}>
        {getDifficultyStars(area.difficulty)}
      </span>

      {isDefeated && (
        <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '16px' }}>
          ✅
        </span>
      )}

      {!isUnlocked && (
        <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '16px' }}>
          🔒
        </span>
      )}
    </div>
  )
}