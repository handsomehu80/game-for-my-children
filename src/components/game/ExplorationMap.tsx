import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'
import { getAreasByOcean } from '../../data/areas'
import { AreaNode } from './AreaNode'
import { Portal } from './Portal'

export default function ExplorationMap() {
  const exploration = useGameStore((state) => state.exploration)

  // P0-3: Use ref to prevent stale closures in useEffect hooks
  const latestExplorationRef = useRef(exploration)
  useEffect(() => {
    latestExplorationRef.current = exploration
  }, [exploration])

  const selectArea = useGameStore((state) => state.selectArea)
  const generatePortals = useGameStore((state) => state.generatePortals)
  const explorationDispatch = useGameStore((state) => state.explorationDispatch)

  // P0-1: Extract magic number to named constant
  const HIDDEN_EVENT_PROBABILITY = 0.2

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
    if (latestExplorationRef.current?.phase === 'moving') {
      const timer = setTimeout(() => {
        explorationDispatch({ type: 'MOVE_COMPLETE' })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [explorationDispatch])

  // 模拟遭遇判定
  useEffect(() => {
    if (!latestExplorationRef.current || latestExplorationRef.current.phase !== 'encounter') return
    const area = areas.find((a) => a.id === latestExplorationRef.current?.currentArea)
    if (!area) return

    let result: 'battle' | 'treasure' | 'hidden_event'
    if (area.type === 'treasure') {
      result = 'treasure'
    } else if (area.type === 'hidden') {
      // P0-2: 隐藏区域跳过随机，直接触发战斗
      result = 'battle'
    } else if (Math.random() < HIDDEN_EVENT_PROBABILITY) {
      result = 'hidden_event'
    } else {
      result = 'battle'
    }

    explorationDispatch({ type: 'ENCOUNTER_RESULT', result })
  }, [areas, explorationDispatch])

  // 战斗阶段 - 触发实际战斗
  useEffect(() => {
    if (latestExplorationRef.current && latestExplorationRef.current.phase === 'battle' && latestExplorationRef.current.currentArea) {
      const area = areas.find((a) => a.id === latestExplorationRef.current?.currentArea)
      if (!area || !area.monsterId) return

      // 这里应该触发实际战斗，但目前只是记录状态
      // 战斗逻辑需要在 battle phase 处理
      console.log('Battle started in area:', latestExplorationRef.current.currentArea, 'monster:', area.monsterId)
    }
  }, [areas])

  // 战斗胜利后生成传送门
  useEffect(() => {
    if (latestExplorationRef.current?.phase === 'victory') {
      // 30% 概率掉落钥匙
      if (Math.random() < 0.3) {
        explorationDispatch({ type: 'RECEIVE_KEY', count: 1 })
      }
      // 生成传送门
      generatePortals()
    }
  }, [explorationDispatch, generatePortals])

  // 宝箱开启
  useEffect(() => {
    if (latestExplorationRef.current?.phase === 'treasure') {
      const treasures = [{ id: 'treasure_1', name: '金币 x10', type: 'consumable' as const }]
      explorationDispatch({ type: 'OPEN_TREASURE', treasures })
    }
  }, [explorationDispatch])

  // 手动触发战斗胜利（用于测试）
  const handleBattleWin = () => {
    // P0-3: Only dispatch if in battle phase
    if (exploration?.phase === 'battle' && exploration?.currentArea) {
      explorationDispatch({ type: 'BATTLE_WIN', areaId: exploration.currentArea })
    }
  }

  // 手动触发战斗失败（用于测试）
  const handleBattleLose = () => {
    // P0-3: Only dispatch if in battle phase
    if (exploration?.phase === 'battle') {
      explorationDispatch({ type: 'BATTLE_LOSE' })
    }
  }

  if (!exploration) {
    return (
      <div className="exploration-map">
        <h2>加载中...</h2>
      </div>
    )
  }

  return (
    <div className="exploration-map" style={{ position: 'relative', width: '700px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>🗺️ {exploration.currentOcean === 'east' ? '东大洋' : exploration.currentOcean} 探索地图</h2>

      {/* 玩家状态 */}
      <div className="player-status" style={{ display: 'flex', gap: '16px', marginBottom: '16px', justifyContent: 'center' }}>
        <div>🔑 钥匙: {exploration.collectedKeys}</div>
        <div>⚔️ 已击败: {exploration.defeatedMiniBosses.length} / 9</div>
      </div>

      {/* 地图区域 - 扩大容器确保所有区域可见 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '500px',
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {areas.map((area) => (
          <AreaNode key={area.id} areaId={area.id} onClick={handleAreaClick} />
        ))}

        {/* 连接线 - 使用与 AreaNode 一致的偏移量计算 */}
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
                  x1={area.position.x * 60 + 185}
                  y1={area.position.z * 60 + 115}
                  x2={target.position.x * 60 + 185}
                  y2={target.position.z * 60 + 115}
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
        {exploration.phase === 'victory' && <span>🎉 战斗胜利！</span>}
        {exploration.phase === 'portal_appear' && <span>选择传送门</span>}
        {exploration.phase === 'error' && <span style={{ color: 'red' }}>错误: {exploration.lastError}</span>}
        {exploration.phase === 'rollback' && <span style={{ color: 'orange' }}>回滚中...</span>}
      </div>

      {/* 战斗测试按钮 - 当在 battle phase 时显示 */}
      {exploration.phase === 'battle' && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <p style={{ marginBottom: '8px' }}>当前区域: {areas.find(a => a.id === exploration.currentArea)?.name}</p>
          <button
            onClick={handleBattleWin}
            style={{
              padding: '10px 20px',
              margin: '0 8px',
              background: 'linear-gradient(135deg, #00ff88, #00cc66)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            模拟战斗胜利
          </button>
          <button
            onClick={handleBattleLose}
            style={{
              padding: '10px 20px',
              margin: '0 8px',
              background: 'linear-gradient(135deg, #ff6b6b, #c92a2a)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            模拟战斗失败
          </button>
        </div>
      )}

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

      {/* 返回世界地图按钮 */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => {
            explorationDispatch({ type: 'RESET_EXPLORATION' })
            useGameStore.getState().dispatch({ type: 'RESET_GAME' } as any)
          }}
          style={{
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          返回标题
        </button>
      </div>
    </div>
  )
}