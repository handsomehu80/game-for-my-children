import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { getAreasByOcean, getAreaById } from '../../data/areas'
import { AreaNode } from './AreaNode'
import { Portal } from './Portal'
import { ConfirmDialog } from './ConfirmDialog'
import { DangerConfirmDialog } from './DangerConfirmDialog'
import OceanSailingScene from './OceanSailingScene'

export default function ExplorationMap() {
  const exploration = useGameStore((state) => state.exploration)

  // 调试：监控 phase 变化
  useEffect(() => {
    console.log('🔔 exploration.phase changed to:', exploration?.phase)
  }, [exploration?.phase])

  // P0-3: Use ref to prevent stale closures in useEffect hooks
  const latestExplorationRef = useRef(exploration)
  useEffect(() => {
    latestExplorationRef.current = exploration
  }, [exploration])

  const selectArea = useGameStore((state) => state.selectArea)
  const generatePortals = useGameStore((state) => state.generatePortals)
  const explorationDispatch = useGameStore((state) => state.explorationDispatch)

  // Confirm dialogs state
  const [showAreaConfirm, setShowAreaConfirm] = useState(false)
  const [pendingAreaId, setPendingAreaId] = useState<string | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  // Sailing state
  const [isSailing, setIsSailing] = useState(false)
  const [sailingTarget, setSailingTarget] = useState<{x: number, y: number} | null>(null)

  // P0-1: Extract magic number to named constant
  const HIDDEN_EVENT_PROBABILITY = 0.2

  // 获取当前大洋的区域
  const areas = exploration?.currentOcean ? getAreasByOcean(exploration.currentOcean) : []

  // Task 2 Phase 2: Island clickability logic
  // isClickable: true if the area can be clicked (available for exploration)
  const isClickable = (areaId: string): boolean => {
    const area = getAreaById(areaId)
    if (!area) return false
    if (exploration?.defeatedMiniBosses.includes(areaId)) return false
    if (area.type === 'boss') return false  // Boss needs 9 islands completed
    const currentAreaObj = exploration?.currentArea ? getAreaById(exploration.currentArea) : null
    return currentAreaObj?.connections.includes(areaId) ?? false
  }

  // isLocked: true if the area requires keys to unlock
  const isLocked = (areaId: string): boolean => {
    const area = getAreaById(areaId)
    if (!area) return false
    return area.requiredKeys > 0 && !exploration?.unlockedAreas.includes(areaId)
  }

  // 处理区域点击
  const handleAreaClick = (areaId: string) => {
    console.log('handleAreaClick called with:', areaId)
    const area = getAreaById(areaId)
    if (!area) return

    // 所有岛屿都显示确认对话框
    setPendingAreaId(areaId)
    setShowAreaConfirm(true)
  }

  // 处理传送门点击
  const handlePortalClick = (portal: any) => {
    explorationDispatch({ type: 'SELECT_PORTAL', portal })
  }

  // 区域确认对话框处理
  const handleAreaConfirm = () => {
    if (pendingAreaId) {
      const area = getAreaById(pendingAreaId)
      if (area) {
        // Start sailing animation
        setSailingTarget({ x: area.position.x, y: area.position.z })
        setIsSailing(true)
        // Note: The actual state transition to 'sailing' happens via selectArea below
        selectArea(pendingAreaId)
      }
    }
    setShowAreaConfirm(false)
    setPendingAreaId(null)
  }

  const handleSailingArrived = () => {
    console.log('handleSailingArrived called')
    setIsSailing(false)
    setSailingTarget(null)
    explorationDispatch({ type: 'SAILING_COMPLETE' })
    console.log('After SAILING_COMPLETE, phase should be arrived')
    // Small delay then transition to moving
    setTimeout(() => {
      console.log('Dispatching ARRIVED')
      explorationDispatch({ type: 'ARRIVED' })
    }, 300)
  }

  const handleAreaCancel = () => {
    setShowAreaConfirm(false)
    setPendingAreaId(null)
  }

  const handleExitClick = () => {
    setShowExitConfirm(true)
  }

  const handleExitConfirm = () => {
    explorationDispatch({ type: 'RESET_EXPLORATION' })
    useGameStore.getState().dispatch({ type: 'RESET_GAME' } as any)
  }

  // 模拟移动动画完成
  useEffect(() => {
    console.log('moving useEffect triggered, phase:', latestExplorationRef.current?.phase)
    if (latestExplorationRef.current?.phase === 'moving') {
      console.log('Setting timer for MOVE_COMPLETE')
      const timer = setTimeout(() => {
        console.log('Dispatching MOVE_COMPLETE')
        explorationDispatch({ type: 'MOVE_COMPLETE' })
      }, 1000)
      return () => clearTimeout(timer)
    }
    // sailing 阶段：启动航行动画
    if (latestExplorationRef.current?.phase === 'sailing' && isSailing) {
      // OceanSailingScene 已经显示，等待动画完成
    }
  }, [exploration, explorationDispatch, isSailing])

  // 模拟遭遇判定
  useEffect(() => {
    console.log('DEBUG encounter useEffect: phase =', latestExplorationRef.current?.phase)
    if (!latestExplorationRef.current || latestExplorationRef.current.phase !== 'encounter') {
      console.log('DEBUG encounter useEffect: returning early, phase is not encounter')
      return
    }
    const area = areas.find((a) => a.id === latestExplorationRef.current?.currentArea)
    if (!area) {
      console.log('DEBUG encounter useEffect: area not found')
      return
    }

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

    console.log('DEBUG encounter useEffect: dispatching ENCOUNTER_RESULT with result =', result)
    explorationDispatch({ type: 'ENCOUNTER_RESULT', result })
  }, [exploration, areas, explorationDispatch])

  // 战斗阶段 - 触发实际战斗
  useEffect(() => {
    if (latestExplorationRef.current && latestExplorationRef.current.phase === 'battle' && latestExplorationRef.current.currentArea) {
      const area = areas.find((a) => a.id === latestExplorationRef.current?.currentArea)
      if (!area || !area.monsterId) return

      // 这里应该触发实际战斗，但目前只是记录状态
      // 战斗逻辑需要在 battle phase 处理
      console.log('Battle started in area:', latestExplorationRef.current.currentArea, 'monster:', area.monsterId)
    }
  }, [exploration, areas])

  // 战斗胜利后生成传送门
  useEffect(() => {
    // P1-1: 直接使用 exploration 而不是 ref，确保读取最新状态
    if (exploration?.phase === 'victory') {
      // Key drop is now handled inside generatePortals (P1-2 guaranteed system)
      generatePortals()
    }
  }, [exploration, generatePortals])

  // 宝箱开启
  useEffect(() => {
    if (latestExplorationRef.current?.phase === 'treasure') {
      const treasures = [{ id: 'treasure_1', name: '金币 x10', type: 'consumable' as const }]
      explorationDispatch({ type: 'OPEN_TREASURE', treasures })
    }
  }, [exploration, explorationDispatch])

  // 手动触发战斗胜利（用于测试）
  const handleBattleWin = () => {
    console.log('handleBattleWin called, current phase:', exploration?.phase)
    // P0-3: Only dispatch if in battle or hidden_area phase
    if ((exploration?.phase === 'battle' || exploration?.phase === 'hidden_area') && exploration?.currentArea) {
      console.log('Dispatching BATTLE_WIN')
      // P1-2: Increment victory counter BEFORE BATTLE_WIN so generatePortals sees updated value
      explorationDispatch({ type: 'INCREMENT_VICTORY_COUNTER' })
      explorationDispatch({ type: 'BATTLE_WIN', areaId: exploration.currentArea })
      // P1-1: generatePortals 由 useEffect 在 phase === 'victory' 时自动触发，不再直接调用
    }
  }

  // 手动触发战斗失败（用于测试）
  const handleBattleLose = () => {
    console.log('handleBattleLose called, current phase:', exploration?.phase)
    // P0-3: Only dispatch if in battle or hidden_area phase
    if (exploration?.phase === 'battle' || exploration?.phase === 'hidden_area') {
      console.log('Dispatching BATTLE_LOSE')
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
    <>
      {/* Sailing Animation Scene */}
      {isSailing && sailingTarget && (
        <OceanSailingScene
          isActive={isSailing}
          startPosition={{ x: 0, y: 0 }}
          endPosition={sailingTarget}
          onArrived={handleSailingArrived}
          isReducedMotion={false}
        />
      )}

      {/* 全屏海洋背景 */}
      <style>
        {`
          @keyframes waveMove {
            0% { background-position: 0% 0%; }
            100% { background-position: 100% 100%; }
          }
          @keyframes waveFloat {
            0%, 100% { transform: translateY(0px) translateX(0); }
            25% { transform: translateY(-5px) translateX(2px); }
            50% { transform: translateY(-10px) translateX(0); }
            75% { transform: translateY(-5px) translateX(-2px); }
          }
          @keyframes shimmer {
            0% { opacity: 0.4; }
            50% { opacity: 0.8; }
            100% { opacity: 0.4; }
          }
          @keyframes cloudDrift {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100vw); }
          }
          .ocean-fullscreen {
            background: linear-gradient(180deg,
              #87CEEB 0%,
              #4A90B8 15%,
              #2980B9 30%,
              #1E6F9F 50%,
              #154360 70%,
              #0D2D4A 100%);
            background-size: 400% 400%;
            animation: waveMove 12s ease-in-out infinite;
            min-height: 100vh;
          }
          .wave-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100px;
            background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%);
            animation: waveFloat 4s ease-in-out infinite;
            pointer-events: none;
          }
          .wave-line {
            position: absolute;
            bottom: 50px;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg,
              transparent 0%,
              rgba(255,255,255,0.6) 10%,
              rgba(255,255,255,0.8) 30%,
              rgba(255,255,255,0.6) 50%,
              rgba(255,255,255,0.8) 70%,
              rgba(255,255,255,0.6) 90%,
              transparent 100%
            );
            animation: shimmer 3s ease-in-out infinite;
            pointer-events: none;
          }
          .wave-foam {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50px;
            background: repeating-linear-gradient(90deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.3) 20px,
              rgba(255,255,255,0.3) 40px
            );
            animation: shimmer 2s ease-in-out infinite;
            pointer-events: none;
          }
          .cloud-float {
            position: absolute;
            top: 30px;
            font-size: 48px;
            opacity: 0.6;
            animation: cloudDrift 20s linear infinite;
            pointer-events: none;
          }
          .sun-glow {
            position: absolute;
            top: 20px;
            right: 60px;
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, rgba(255,215,0,0.8) 0%, rgba(255,165,0,0.4) 40%, transparent 70%);
            border-radius: 50%;
            animation: shimmer 4s ease-in-out infinite;
            pointer-events: none;
          }
          @keyframes sailingBob {
            0%, 100% { transform: translateY(0px) rotate(-2deg); }
            50% { transform: translateY(-8px) rotate(2deg); }
          }
        `}
      </style>

      <div className="ocean-fullscreen" style={{ position: 'relative', width: '100%', minHeight: '100vh', padding: '20px', boxSizing: 'border-box' }}>
        {/* 装饰元素 */}
        <div className="sun-glow" />
        <div className="cloud-float" style={{ left: '-50px' }}>☁️</div>
        <div className="cloud-float" style={{ left: '-150px', animationDelay: '-7s', fontSize: '36px' }}>☁️</div>
        <div className="cloud-float" style={{ left: '-250px', animationDelay: '-14s', fontSize: '42px' }}>☁️</div>

      <h2 style={{ textAlign: 'center', color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', marginBottom: '20px' }}>
        🗺️ {exploration.currentOcean === 'east' ? '东大洋' : exploration.currentOcean} 探索地图
      </h2>

      {/* 玩家状态 */}
      <div className="player-status" style={{
        display: 'flex',
        gap: '24px',
        marginBottom: '20px',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.3)',
        padding: '12px 24px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>🔑 钥匙: {exploration.collectedKeys}</div>
        <div style={{ color: 'white', fontSize: '18px' }}>⚔️ 已击败: {exploration.defeatedMiniBosses.length} / 9</div>
      </div>

      {/* 地图区域 - 全屏容器 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '600px',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '3px solid rgba(255,255,255,0.2)',
          background: 'linear-gradient(180deg, rgba(30,100,150,0.3) 0%, rgba(20,60,100,0.5) 100%)',
        }}
      >
        {/* 波浪效果层 */}
        <div className="wave-overlay" />
        <div className="wave-line" />
        <div className="wave-foam" />

        {/* 船只指示器 - 显示在当前选择的岛屿位置 */}
        {exploration.currentArea && (
          (() => {
            const currentAreaData = areas.find(a => a.id === exploration.currentArea)
            if (!currentAreaData) return null
            const containerWidth = 800
            const containerHeight = 600
            const shipX = (currentAreaData.position.x / 10) * (containerWidth - 80) + 40 - 10
            const shipY = (currentAreaData.position.z / 10) * (containerHeight - 80) + 40 - 60
            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${shipX}px`,
                  top: `${shipY}px`,
                  fontSize: '40px',
                  zIndex: 100,
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
                  animation: 'sailingBob 2s ease-in-out infinite',
                }}
              >
                ⛵
              </div>
            )
          })()
        )}

        {/* 所有岛屿 */}
        {areas.map((area) => (
          <AreaNode
            key={area.id}
            areaId={area.id}
            onClick={handleAreaClick}
            isClickable={isClickable(area.id)}
            isLocked={isLocked(area.id)}
          />
        ))}

        {/* 连接线 - 只显示到已揭示岛屿的连接 */}
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

              // 只显示到已揭示岛屿的连线
              const targetRevealed = exploration?.defeatedMiniBosses.includes(connId) ||
                target.type === 'treasure' ||
                target.difficulty === 1 ||
                (target.type === 'boss' && exploration?.defeatedMiniBosses.length >= 9)
              if (!targetRevealed) return null

              // 位置计算：与 AreaNode 保持一致
              const containerWidth = 800
              const containerHeight = 600
              const x1 = (area.position.x / 10) * (containerWidth - 80) + 80
              const y1 = (area.position.z / 10) * (containerHeight - 80) + 80
              const x2 = (target.position.x / 10) * (containerWidth - 80) + 80
              const y2 = (target.position.z / 10) * (containerHeight - 80) + 80
              return (
                <line
                  key={`${area.id}-${connId}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                />
              )
            })
          )}
        </svg>
      </div>

      {/* 当前状态提示 */}
      <div className="phase-indicator" style={{ marginTop: '16px', textAlign: 'center', background: 'rgba(0,255,0,0.3)', padding: '10px', borderRadius: '10px' }}>
        <strong>DEBUG: phase = "{exploration.phase}"</strong>
        {exploration.phase === 'battle' && <span style={{background: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px'}}>应该显示战斗按钮！</span>}
        {exploration.phase === 'exploring' && <span> - 选择要探索的区域</span>}
        {exploration.phase === 'sailing' && <span> - ⛵ 航行中...</span>}
        {exploration.phase === 'arrived' && <span> - 🏝️ 到达！</span>}
        {exploration.phase === 'moving' && <span>移动中...</span>}
        {exploration.phase === 'encounter' && <span>遭遇判定中...</span>}
        {exploration.phase === 'battle' && <span>⚔️ 战斗开始！</span>}
        {exploration.phase === 'hidden_area' && <span>🔮 隐藏事件触发！</span>}
        {exploration.phase === 'treasure' && <span>发现宝箱！</span>}
        {exploration.phase === 'victory' && <span>🎉 战斗胜利！</span>}
        {exploration.phase === 'portal_appear' && <span>选择传送门</span>}
        {exploration.phase === 'error' && <span style={{ color: 'red' }}>错误: {exploration.lastError}</span>}
        {exploration.phase === 'rollback' && <span style={{ color: 'orange' }}>回滚中...</span>}
      </div>

      {/* 战斗测试按钮 - 当在 battle 或 hidden_area phase 时显示 */}
      {(() => {
        console.log('JSX evaluation: exploration.phase =', exploration.phase, 'condition =', exploration.phase === 'battle' || exploration.phase === 'hidden_area')
        return (exploration.phase === 'battle' || exploration.phase === 'hidden_area')
      })() && (
        <div style={{ marginTop: '16px', textAlign: 'center', background: 'rgba(255,0,0,0.8)', padding: '20px', borderRadius: '10px' }}>
          <h3 style={{ color: 'white', margin: '0 0 10px 0' }}>⚔️ 战斗阶段 ⚔️</h3>
          <p style={{ marginBottom: '8px', color: 'white' }}>当前区域: {areas.find(a => a.id === exploration.currentArea)?.name}</p>
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

      {/* 战斗测试按钮 - 独立渲染确保可见 */}
      {exploration.phase === 'battle' && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'red',
          color: 'white',
          padding: '40px',
          borderRadius: '20px',
          zIndex: 9999,
          fontSize: '24px',
          boxShadow: '0 0 50px rgba(255,0,0,0.5)'
        }}>
          <h2>🎮 BATTLE PHASE 🎮</h2>
          <p>当前区域: {exploration.currentArea}</p>
          <button
            onClick={handleBattleWin}
            style={{
              padding: '15px 30px',
              margin: '10px',
              background: 'linear-gradient(135deg, #00ff88, #00cc66)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            模拟战斗胜利
          </button>
          <button
            onClick={handleBattleLose}
            style={{
              padding: '15px 30px',
              margin: '10px',
              background: 'linear-gradient(135deg, #ff6b6b, #c92a2a)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            模拟战斗失败
          </button>
        </div>
      )}

      {/* hidden_area 战斗按钮 */}
      {exploration.phase === 'hidden_area' && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'purple',
          color: 'white',
          padding: '40px',
          borderRadius: '20px',
          zIndex: 9999,
          fontSize: '24px',
          boxShadow: '0 0 50px rgba(128,0,128,0.5)'
        }}>
          <h2>🔮 HIDDEN EVENT 🔮</h2>
          <p>当前区域: {exploration.currentArea}</p>
          <button
            onClick={handleBattleWin}
            style={{
              padding: '15px 30px',
              margin: '10px',
              background: 'linear-gradient(135deg, #00ff88, #00cc66)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            模拟战斗胜利
          </button>
          <button
            onClick={handleBattleLose}
            style={{
              padding: '15px 30px',
              margin: '10px',
              background: 'linear-gradient(135deg, #ff6b6b, #c92a2a)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            模拟战斗失败
          </button>
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
            handleExitClick()
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

      {/* 区域确认对话框 */}
      <ConfirmDialog
        isOpen={showAreaConfirm}
        title="确定要去这个岛屿吗？"
        message={`你要去「${getAreaById(pendingAreaId || '')?.name}」探索，可能会遇到怪物哦！`}
        icon="island"
        confirmText="要去！出发"
        cancelText="不去！取消"
        onConfirm={handleAreaConfirm}
        onCancel={handleAreaCancel}
      />

      {/* 退出确认对话框 */}
      <DangerConfirmDialog
        isOpen={showExitConfirm}
        title="确定要退出游戏吗？"
        message="你的进度会自动保存，但当前战斗会结束哦！"
        confirmText="确定退出"
        cancelText="取消"
        onConfirm={handleExitConfirm}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
    </>
  )
}