import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { getAreasByOcean } from '../../data/areas'
import { AreaNode } from './AreaNode'
import { Portal } from './Portal'

export default function ExplorationMap() {
  const exploration = useGameStore((state) => state.exploration)

  const selectArea = useGameStore((state) => state.selectArea)
  const generatePortals = useGameStore((state) => state.generatePortals)
  const explorationDispatch = useGameStore((state) => state.explorationDispatch)

  // 获取当前大洋的区域
  const areas = exploration?.currentOcean ? getAreasByOcean(exploration.currentOcean) : []

  // 处理区域点击
  const handleAreaClick = (areaId: string) => {
    selectArea(areaId)
  }

  // 处理传送门点击
  const handlePortalClick = (portal: any) => {
    explorationDispatch({ type: 'SELECT_PORTAL', portal })
  }

  // 模拟移动动画完成
  useEffect(() => {
    if (exploration?.phase === 'moving') {
      const timer = setTimeout(() => {
        explorationDispatch({ type: 'MOVE_COMPLETE' })
      }, 1000) // 1秒移动动画
      return () => clearTimeout(timer)
    }
  }, [exploration?.phase])

  // 模拟遭遇判定
  useEffect(() => {
    if (exploration?.phase === 'encounter') {
      const area = areas.find((a) => a.id === exploration.currentArea)
      if (!area) return

      let result: 'battle' | 'treasure' | 'hidden_event'
      if (area.type === 'treasure') {
        result = 'treasure'
      } else if (area.type === 'hidden') {
        result = 'battle'
      } else if (Math.random() < 0.2) {
        result = 'hidden_event'
      } else {
        result = 'battle'
      }

      explorationDispatch({ type: 'ENCOUNTER_RESULT', result })
    }
  }, [exploration?.phase])

  // 战斗胜利后生成传送门
  useEffect(() => {
    if (exploration?.phase === 'victory') {
      // 30% 概率掉落钥匙
      if (Math.random() < 0.3) {
        explorationDispatch({ type: 'RECEIVE_KEY', count: 1 })
      }
      // 生成传送门
      generatePortals()
    }
  }, [exploration?.phase])

  // 宝箱开启
  useEffect(() => {
    if (exploration?.phase === 'treasure') {
      const treasures = [{ id: 'treasure_1', name: '金币 x10', type: 'consumable' as const }]
      explorationDispatch({ type: 'OPEN_TREASURE', treasures })
    }
  }, [exploration?.phase])

  if (!exploration) {
    return (
      <div className="exploration-map">
        <h2>加载中...</h2>
      </div>
    )
  }

  return (
    <div className="exploration-map" style={{ position: 'relative', width: '600px', height: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>🗺️ {exploration.currentOcean} 探索地图</h2>

      {/* 玩家状态 */}
      <div className="player-status" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div>🔑 钥匙: {exploration.collectedKeys}</div>
        <div>⚔️ 已击败: {exploration.defeatedMiniBosses.length} / 9</div>
      </div>

      {/* 地图区域 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {areas.map((area) => (
          <AreaNode key={area.id} areaId={area.id} onClick={handleAreaClick} />
        ))}

        {/* 连接线（简化版） */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {areas.map((area) =>
            area.connections.map((connId) => {
              const target = areas.find((a) => a.id === connId)
              if (!target) return null
              return (
                <line
                  key={`${area.id}-${connId}`}
                  x1={area.position.x * 80 + 240}
                  y1={area.position.z * 80 + 240}
                  x2={target.position.x * 80 + 240}
                  y2={target.position.z * 80 + 240}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
              )
            })
          )}
        </svg>
      </div>

      {/* 当前状态提示 */}
      <div className="phase-indicator" style={{ marginTop: '16px', textAlign: 'center' }}>
        {exploration.phase === 'exploring' && <span>选择要探索的区域</span>}
        {exploration.phase === 'moving' && <span>移动中...</span>}
        {exploration.phase === 'encounter' && <span>遭遇判定中...</span>}
        {exploration.phase === 'battle' && <span>战斗开始！</span>}
        {exploration.phase === 'treasure' && <span>发现宝箱！</span>}
        {exploration.phase === 'victory' && <span>战斗胜利！</span>}
        {exploration.phase === 'portal_appear' && <span>选择传送门</span>}
        {exploration.phase === 'error' && <span style={{ color: 'red' }}>错误: {exploration.lastError}</span>}
      </div>

      {/* 传送门选择 */}
      {exploration.phase === 'portal_appear' && exploration.availablePortals.length > 0 && (
        <div className="portal-selection" style={{ marginTop: '16px' }}>
          <h3 style={{ textAlign: 'center' }}>选择传送门</h3>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {exploration.availablePortals.map((portal) => (
              <Portal key={portal.id} portal={portal} onClick={handlePortalClick} />
            ))}
          </div>
        </div>
      )}

      {/* 钥匙解锁提示 */}
      {exploration.phase === 'exploring' && exploration.collectedKeys > 0 && (
        <div className="unlock-hint" style={{ marginTop: '16px', textAlign: 'center', color: '#9b59b6' }}>
          🔑 你有 {exploration.collectedKeys} 把钥匙，可以解锁隐藏区域
        </div>
      )}
    </div>
  )
}