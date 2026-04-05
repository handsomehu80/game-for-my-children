import { useGameStore } from '../../store/gameStore'
import { getAreaById, getDifficultyStars, isAreaReachable } from '../../data/areas'
import { useAccessibility } from '../../hooks/useAccessibility'

interface AreaNodeProps {
  areaId: string
  onClick?: (areaId: string) => void
}

export function AreaNode({ areaId, onClick }: AreaNodeProps) {
  const area = getAreaById(areaId)
  const exploration = useGameStore((state) => state.exploration)
  const { highContrast, isReducedMotion } = useAccessibility()

  if (!area) return null

  // 检查岛屿是否可达
  const reachability = exploration
    ? isAreaReachable(
        areaId,
        exploration.currentArea,
        exploration.defeatedMiniBosses,
        exploration.reachableAreas
      )
    : { reachable: false }

  // 隐藏岛屿需要钥匙
  const hasRequiredKeys = area.requiredKeys === 0 || exploration?.unlockedAreas.includes(areaId)
  const isReachable = reachability.reachable && hasRequiredKeys

  const isDefeated = exploration?.defeatedMiniBosses.includes(areaId)
  const isCurrent = exploration?.currentArea === areaId

  const handleClick = () => {
    console.log('AreaNode handleClick:', areaId, 'isReachable:', isReachable, 'reason:', reachability.reason)
    if (isReachable && onClick) {
      onClick(areaId)
    } else {
      // 显示不可访问提示
      alert(reachability.reason || '该岛屿暂时无法访问')
    }
  }

  // High contrast color mappings
  const normal = highContrast ? '#006600' : '#22C55E'
  const boss = highContrast ? '#CC0000' : '#EF4444'
  const hidden = highContrast ? '#660066' : '#6366F1'
  const treasure = highContrast ? '#996600' : '#EAB308'

  // Hidden island glow style (P2-4)
  const getHiddenGlowStyle = () => {
    if (area.type !== 'hidden') return {}
    if (isReducedMotion) {
      return { boxShadow: '0 0 12px rgba(99, 102, 241, 0.35), 6px 6px 12px rgba(0,0,0,0.3)' }
    }
    return { animation: 'hiddenIslandGlow 2s ease-in-out infinite alternate' }
  }

  // 根据区域类型渲染不同样式 - Claymorphism with border-radius: 16px, double shadow
  // 位置使用0-10的网格坐标，映射到容器百分比位置
  const getNodeStyle = () => {
    // 容器假设为800x600，位置映射
    const containerWidth = 800
    const containerHeight = 600
    const left = (area.position.x / 10) * (containerWidth - 80) + 40
    const top = (area.position.z / 10) * (containerHeight - 80) + 40

    const base = {
      position: 'absolute' as const,
      left: `${left}px`,
      top: `${top}px`,
      width: '80px',
      height: '80px',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: isReachable ? 'pointer' : 'not-allowed',
      transition: 'transform 0.2s, opacity 0.3s',
      opacity: isDefeated && !isCurrent ? 0.5 : (!isReachable ? 0.4 : 1),  // 已击败或不可达都变灰
      zIndex: 10,
    }

    switch (area.type) {
      case 'boss':
        return {
          ...base,
          background: `linear-gradient(135deg, ${boss}, ${highContrast ? '#880000' : '#B91C1C'})`,
          border: '3px solid gold',
          boxShadow: '6px 6px 12px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.1)',
        }
      case 'hidden':
        return {
          ...base,
          background: `linear-gradient(135deg, ${hidden}, ${highContrast ? '#330033' : '#4C1D95'})`,
          border: '2px dashed #9b59b6',
          boxShadow: '6px 6px 12px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.1)',
          ...getHiddenGlowStyle(),
        }
      case 'treasure':
        return {
          ...base,
          background: `linear-gradient(135deg, ${treasure}, ${highContrast ? '#664400' : '#CA8A04'})`,
          border: '2px solid #ffd700',
          boxShadow: '6px 6px 12px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.1)',
        }
      default:
        return {
          ...base,
          background: `linear-gradient(135deg, ${normal}, ${highContrast ? '#004400' : '#16A34A'})`,
          border: '2px solid #4dabf7',
          boxShadow: '6px 6px 12px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.1)',
        }
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes hiddenIslandGlow {
            from { box-shadow: 0 0 15px rgba(99, 102, 241, 0.3), 6px 6px 12px rgba(0,0,0,0.3); }
            to { box-shadow: 0 0 25px rgba(99, 102, 241, 0.5), 6px 6px 12px rgba(0,0,0,0.3); }
          }
        `}
      </style>
      <div
        style={getNodeStyle()}
        onClick={handleClick}
        title={`${area.name}\n难度: ${getDifficultyStars(area.difficulty)}\n${
          area.type === 'hidden' ? '需要钥匙' : ''
        }`}
        aria-label={`${area.name}, 难度 ${getDifficultyStars(area.difficulty)}${
          area.type === 'hidden' ? ', 需要钥匙' : ''
        }${isDefeated ? ', 已击败' : ''}${!isReachable && !isDefeated ? ', 不可达' : ''}`}
        role="button"
        tabIndex={isReachable ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        {/* 岛屿emoji图标 */}
        <span style={{ fontSize: '28px', lineHeight: 1 }}>
          {area.type === 'boss' ? '🦑' :
           area.type === 'hidden' ? '🏝️' :
           area.type === 'treasure' ? '📦' :
           '🏝️'}
        </span>

        <span style={{ color: 'white', fontSize: '9px', marginTop: '4px', textAlign: 'center' }}>
          {area.name.length > 6 ? area.name.slice(0, 5) + '...' : area.name}
        </span>

        <span style={{ color: '#ffd700', fontSize: '9px' }}>
          {getDifficultyStars(area.difficulty)}
        </span>

        {isDefeated && (
          <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '14px' }} role="img" aria-label="已击败">
            ✅
          </span>
        )}

        {!isReachable && !isDefeated && (
          <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '14px' }} role="img" aria-label="不可达">
            🔒
          </span>
        )}
      </div>
    </>
  )
}