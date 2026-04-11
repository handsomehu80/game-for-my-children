import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { getAreasByOcean, getAreaById } from '../../data/areas'
import { monstersData } from '../../data/monsters'
import { getRandomQuestion } from '../../game/QuestionSelector'
import { AreaNode } from './AreaNode'
import { Portal } from './Portal'
import { ConfirmDialog } from './ConfirmDialog'
import { DangerConfirmDialog } from './DangerConfirmDialog'
import OceanSailingScene from './OceanSailingScene'

// 生成确定性 seed (基于 areaId)
function generateSailingSeed(areaId: string): number {
  let hash = 0
  for (let i = 0; i < areaId.length; i++) {
    const char = areaId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
  }
  return Math.abs(hash)
}

// 根据岛屿类型选择动画风格
function getAnimationStyle(areaId: string): 'minimal' | 'cinematic' {
  const area = getAreaById(areaId)
  if (area?.type === 'boss') return 'cinematic'
  return 'minimal'
}

export default function ExplorationMap() {
  const exploration = useGameStore((state) => state.exploration)
  const players = useGameStore((state) => state.players)

  // 监控状态变化用于调试
  useEffect(() => {
    // console.log('exploration changed:', exploration?.phase)
  }, [exploration?.phase])

  // P0-3: Use ref to prevent stale closures in useEffect hooks
  const latestExplorationRef = useRef(exploration)
  useEffect(() => {
    latestExplorationRef.current = exploration
  }, [exploration])

  // Guard to prevent START_BATTLE from being dispatched multiple times
  const battleStartedRef = useRef(false)

  const selectArea = useGameStore((state) => state.selectArea)
  const generatePortals = useGameStore((state) => state.generatePortals)
  const explorationDispatch = useGameStore((state) => state.explorationDispatch)

  // Confirm dialogs state
  const [showAreaConfirm, setShowAreaConfirm] = useState(false)
  const [pendingAreaId, setPendingAreaId] = useState<string | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  // Sailing state
  const [isSailing, setIsSailing] = useState(false)

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
    // Boss needs 9 islands completed before becoming clickable
if (area.type === 'boss') {
  return (exploration?.defeatedMiniBosses.length ?? 0) >= 9
}
    // If no current area (first entry to ocean), difficulty-1 normal islands are clickable
    if (!exploration?.currentArea) {
      return area.difficulty === 1 && area.type === 'normal'
    }
    // During exploring and error phases, use reachableAreas to determine clickability.
    // This ensures islands only become clickable AFTER battle is won (via BATTLE_WIN updates reachableAreas).
    // During error phase (after battle loss), player should still be able to select reachable islands.
    if (exploration.phase === 'exploring' || exploration.phase === 'error') {
      const isInReachable = exploration?.reachableAreas.includes(areaId) ?? false
      return isInReachable
    }
    // During other phases (sailing, battle, etc.), don't allow clicking new islands
    return false
  }

  // isLocked: true if the area requires keys to unlock
  const isLocked = (areaId: string): boolean => {
    const area = getAreaById(areaId)
    if (!area) return false
    return area.requiredKeys > 0 && !exploration?.unlockedAreas.includes(areaId)
  }

  // 处理区域点击
  const handleAreaClick = (areaId: string) => {
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
    console.log('[DEBUG] handleAreaConfirm called, pendingAreaId:', pendingAreaId)
    if (pendingAreaId) {
      const area = getAreaById(pendingAreaId)
      console.log('[DEBUG] area found:', area?.name)
      if (area) {
        // Start sailing animation
        setIsSailing(true)
        console.log('[DEBUG] setIsSailing(true) called')
        // Note: The actual state transition to 'sailing' happens via selectArea below
        selectArea(pendingAreaId)
        console.log('[DEBUG] selectArea called')
      }
    }
    setShowAreaConfirm(false)
    setPendingAreaId(null)
  }

  const handleSailingArrived = () => {
    console.log('[DEBUG] handleSailingArrived called')
    setIsSailing(false)
    explorationDispatch({ type: 'SAILING_COMPLETE' })
    // Small delay then transition to moving
    setTimeout(() => {
      console.log('[DEBUG] ARRIVED timeout fired')
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
    if (latestExplorationRef.current?.phase === 'moving') {
      const timer = setTimeout(() => {
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
    if (!latestExplorationRef.current || latestExplorationRef.current.phase !== 'encounter') {
      return
    }
    const area = areas.find((a) => a.id === latestExplorationRef.current?.currentArea)
    if (!area) return

    let result: 'battle' | 'treasure' | 'hidden_event'
    if (area.type === 'treasure') {
      result = 'treasure'
    } else if (area.type === 'hidden' || area.type === 'boss') {
      // P0-2: 隐藏区域和Boss跳过随机，直接触发战斗
      result = 'battle'
    } else if (Math.random() < HIDDEN_EVENT_PROBABILITY) {
      result = 'hidden_event'
    } else {
      result = 'battle'
    }

    explorationDispatch({ type: 'ENCOUNTER_RESULT', result })
  }, [exploration, areas, explorationDispatch])

  // 战斗阶段 - 触发实际战斗（只执行一次）
  useEffect(() => {
    if (battleStartedRef.current) return
    if (latestExplorationRef.current?.phase !== 'battle') return
    if (!latestExplorationRef.current?.currentArea) return

    const area = areas.find((a) => a.id === latestExplorationRef.current?.currentArea)
    if (!area || !area.monsterId) return

    const monster = monstersData[area.monsterId]
    if (!monster) return

    // 双人模式：随机选择先手玩家
    // 单人模式：使用玩家1的年级
    const isMultiplayerBattle = players.length >= 2
    const firstPlayerIndex = isMultiplayerBattle
      ? (Math.random() < 0.5 ? 0 : 1)
      : 0
    const playerGrade = players[firstPlayerIndex]?.grade ?? 1

    const question = getRandomQuestion({
      oceanId: latestExplorationRef.current.currentOcean || 'east',
      difficulty: area.difficulty ?? null,
      grade: playerGrade,
      subject: area.knowledgeArea === 'comprehensive' ? undefined : area.knowledgeArea as 'math' | 'chinese' | 'english',
    })
    if (!question) return

    battleStartedRef.current = true
    useGameStore.getState().dispatch({
      type: 'START_BATTLE',
      monster,
      question,
      players: players.map(p => ({ id: p.id, name: p.name, grade: p.grade })),
      currentPlayerIndex: firstPlayerIndex,
      explorationContext: { areaId: area.id, monsterId: area.monsterId },
    })
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
      {isSailing && (
        <OceanSailingScene
          isActive={isSailing}
          style={getAnimationStyle(pendingAreaId || '')}
          seed={generateSailingSeed(pendingAreaId || '')}
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

      {/* 传送门选择 - 无论是否有传送门，都要显示返回按钮 */}
      {exploration.phase === 'portal_appear' && (
        <div className="portal-selection" style={{ marginTop: '16px' }}>
          {exploration.availablePortals.length > 0 && (
            <>
              <h3 style={{ textAlign: 'center' }}>选择传送门</h3>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {exploration.availablePortals.map((portal) => (
                  <Portal key={portal.id} portal={portal} onClick={handlePortalClick} />
                ))}
              </div>
            </>
          )}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              onClick={() => explorationDispatch({ type: 'CLOSE_PORTAL' })}
              style={{
                padding: '10px 24px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              {exploration.availablePortals.length > 0 ? '关闭传送门，返回地图' : '返回地图'}
            </button>
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