import type { Portal as PortalType } from '../../game/types'
import { getAreaById } from '../../data/areas'

interface PortalProps {
  portal: PortalType
  onClick: (portal: PortalType) => void
}

// 大洋名称映射（按顺序）
const oceanNames: Record<string, string> = {
  east: '东大洋',
  west: '西洋',
  southHot: '南热洋',
  northIce: '北冰洋',
  mysterious: '神秘洋',
}

export function Portal({ portal, onClick }: PortalProps) {
  const targetArea = getAreaById(portal.targetAreaId)

  // 跨大洋传送门不查找区域
  if (portal.type === 'ocean_portal') {
    const oceanName = oceanNames[portal.targetAreaId] || portal.targetAreaId
    return (
      <div
        onClick={() => onClick(portal)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px',
          background: 'linear-gradient(135deg, #ff6b6b, #c0392b)',
          borderRadius: '12px',
          cursor: 'pointer',
          minWidth: '100px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s',
          border: '2px solid gold',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <span style={{ fontSize: '32px' }}>🚀</span>
        <span style={{ color: 'white', fontSize: '12px', marginTop: '8px' }}>
          跨洋传送
        </span>
        <span style={{ color: '#ffd700', fontSize: '10px', marginTop: '4px' }}>
          → {oceanName}
        </span>
      </div>
    )
  }

  if (!targetArea) return null

  const getPortalColor = () => {
    switch (portal.type) {
      case 'hidden':
        return 'linear-gradient(135deg, #9b59b6, #6c3483)'
      case 'event':
        return 'linear-gradient(135deg, #f39c12, #d68910)'
      case 'treasure':
        return 'linear-gradient(135deg, #eab308, #ca8a04)'
      default:
        return 'linear-gradient(135deg, #00d9ff, #0097b2)'
    }
  }

  return (
    <div
      onClick={() => onClick(portal)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        background: getPortalColor(),
        borderRadius: '12px',
        cursor: 'pointer',
        minWidth: '100px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <span style={{ fontSize: '32px' }}>
        {portal.type === 'hidden' ? '🏝️' : portal.type === 'treasure' ? '📦' : portal.type === 'event' ? '🎁' : '🌀'}
      </span>
      <span style={{ color: 'white', fontSize: '12px', marginTop: '8px' }}>
        {portal.type === 'hidden' ? '隐藏区域' : portal.type === 'event' ? '随机事件' : portal.type === 'treasure' ? '宝藏区域' : '传送'}
      </span>
      <span style={{ color: '#ffd700', fontSize: '10px', marginTop: '4px' }}>
        → {targetArea.name}
      </span>
    </div>
  )
}