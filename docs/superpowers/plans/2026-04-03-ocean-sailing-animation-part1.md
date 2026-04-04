# Part 1: 海洋航行动画实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development

**Goal:** 实现船只从点击岛屿到到达岛屿的航行动画

**Architecture:**
- 新增 `sailing` 和 `arrived` 探索状态
- 创建 `OceanSailingScene` 组件处理动画
- 通过 CSS animation 实现流畅动画效果

**Tech Stack:** React 18+, TypeScript, CSS Animations

---

## Task 1.1: 状态机扩展

**Files:**
- Modify: `src/game/types.ts`
- Modify: `src/game/ExplorationStateMachine.ts`

### Step 1: 修改 types.ts

在 `ExplorationPhase` 中添加新状态：

```typescript
export type ExplorationPhase =
  | 'exploring'
  | 'sailing'          // 新增：航行中
  | 'arrived'           // 新增：已到达
  | 'moving'
  | 'encounter'
  | 'battle'
  | 'hidden_area'
  | 'treasure'
  | 'portal_appear'
  | 'boss_appearing'
  | 'area_complete'
  | 'victory'
  | 'error'
  | 'rollback'
```

新增 Action 类型：

```typescript
export type ExplorationAction =
  | { type: 'START_SAILING'; targetAreaId: string }
  | { type: 'SAILING_COMPLETE' }
  | { type: 'ARRIVED' }
  // ... existing actions
```

### Step 2: 修改 ExplorationStateMachine.ts

在 `initialExplorationState` 中确保新状态被正确初始化（虽然不需要特殊字段）。

添加新的状态处理：

```typescript
case 'sailing':
  switch (action.type) {
    case 'SAILING_COMPLETE':
      return { ...state, phase: 'arrived' }
    case 'RESET_EXPLORATION':
      return initialExplorationState
    default:
      return state
  }

case 'arrived':
  switch (action.type) {
    case 'ARRIVED':
      // 可选：触发一些到达效果
      return { ...state, phase: 'moving' }
    case 'RESET_EXPLORATION':
      return initialExplorationState
    default:
      return state
  }
```

### Step 3: 测试

```typescript
// tests/game/ExplorationStateMachine.test.ts
describe('Sailing State', () => {
  it('should transition from sailing to arrived on SAILING_COMPLETE', () => {
    const state = { ...initialExplorationState, phase: 'sailing' as ExplorationPhase }
    const newState = explorationReducer(state, { type: 'SAILING_COMPLETE' })
    expect(newState.phase).toBe('arrived')
  })

  it('should transition from arrived to moving on ARRIVED', () => {
    const state = { ...initialExplorationState, phase: 'arrived' as ExplorationPhase }
    const newState = explorationReducer(state, { type: 'ARRIVED' })
    expect(newState.phase).toBe('moving')
  })
})
```

### Step 4: 提交

```bash
git add src/game/types.ts src/game/ExplorationStateMachine.ts tests/game/ExplorationStateMachine.test.ts
git commit -m "feat: Add sailing and arrived exploration phases"
```

---

## Task 1.2: OceanSailingScene 组件

**Files:**
- Create: `src/components/game/OceanSailingScene.tsx`

### Step 1: 创建组件

```tsx
// src/components/game/OceanSailingScene.tsx
import { useEffect, useRef } from 'react'

interface OceanSailingSceneProps {
  isActive: boolean
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
  onArrived: () => void
  isReducedMotion?: boolean
}

export default function OceanSailingScene({
  isActive,
  startPosition,
  endPosition,
  onArrived,
  isReducedMotion = false,
}: OceanSailingSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) return

    // 动画持续时间：3秒
    const timer = setTimeout(() => {
      onArrived()
    }, 3000)

    return () => clearTimeout(timer)
  }, [isActive, onArrived])

  if (!isActive) return null

  return (
    <div
      ref={containerRef}
      className="ocean-sailing-scene"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, #87CEEB 0%, #1E3A5F 50%, #0C2340 100%)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* CSS 动画样式 */}
      <style>
        {`
          @keyframes waveSlide {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes cloudFloat {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(20px); }
          }
          @keyframes sailBoat {
            0% { left: 15%; bottom: 35%; }
            50% { left: 50%; bottom: 40%; }
            100% { left: 70%; bottom: 35%; }
          }
          @keyframes shipRock {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(2deg); }
          }
          .sailing-ship {
            animation: sailBoat 3s ease-in-out forwards, shipRock 2s ease-in-out infinite;
          }
          .wave-layer {
            animation: waveSlide 3s linear infinite;
          }
          .cloud {
            animation: cloudFloat 6s ease-in-out infinite;
          }
          ${isReducedMotion ? `
            .sailing-ship { animation: none; left: 70%; bottom: 35%; }
            .wave-layer { animation: none; }
            .cloud { animation: none; }
          ` : ''}
        `}
      </style>

      {/* 太阳 */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          right: '80px',
          width: '50px',
          height: '50px',
          background: 'radial-gradient(circle, #FFD700, #FFA500)',
          borderRadius: '50%',
          boxShadow: '0 0 40px rgba(255,215,0,0.6)',
        }}
      />

      {/* 云朵 */}
      <div className="cloud" style={{ position: 'absolute', top: '40px', left: '10%', fontSize: '36px', opacity: 0.7 }}>
        ☁️
      </div>
      <div className="cloud" style={{ position: 'absolute', top: '60px', right: '15%', fontSize: '28px', opacity: 0.5, animationDelay: '1s' }}>
        ☁️
      </div>

      {/* 海洋波浪层 */}
      <div
        className="wave-layer"
        style={{
          position: 'absolute',
          bottom: '30%',
          left: 0,
          right: 0,
          height: '30px',
          background: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.1) 30px, rgba(255,255,255,0.1) 60px)',
        }}
      />

      {/* 目标岛屿 */}
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '15%',
          width: '100px',
          height: '80px',
        }}
      >
        {/* 岛屿主体 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100px',
            height: '50px',
            background: 'linear-gradient(135deg, #8B4513, #654321)',
            borderRadius: '50% 50% 40% 40%',
          }}
        />
        {/* 树木1 */}
        <div
          style={{
            position: 'absolute',
            bottom: '35px',
            left: '20px',
            width: '25px',
            height: '45px',
            background: 'linear-gradient(180deg, #228B22, #006400)',
            borderRadius: '50% 50% 20% 20%',
          }}
        />
        {/* 树木2 */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '55px',
            width: '20px',
            height: '35px',
            background: 'linear-gradient(180deg, #32CD32, #228B22)',
            borderRadius: '50% 50% 20% 20%',
          }}
        />
      </div>

      {/* 航行中的船只 */}
      <div
        className="sailing-ship"
        style={{
          position: 'absolute',
          fontSize: '64px',
          filter: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.3))',
          zIndex: 10,
        }}
      >
        ⛵
      </div>

      {/* 路径点轨迹 */}
      <div
        style={{
          position: 'absolute',
          bottom: '32%',
          left: '12%',
          width: '60%',
          height: '4px',
          borderBottom: '2px dashed rgba(255,255,255,0.2)',
        }}
      />

      {/* 状态文字 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.5)',
          padding: '12px 24px',
          borderRadius: '20px',
          color: 'white',
          fontFamily: "'Baloo 2', cursive",
          fontSize: '20px',
        }}
      >
        ⛵ 航行中...
      </div>
    </div>
  )
}
```

### Step 2: 提交

```bash
git add src/components/game/OceanSailingScene.tsx
git commit -m "feat: Add OceanSailingScene component with ship animation"
```

---

## Task 1.3: ExplorationMap 集成

**Files:**
- Modify: `src/components/game/ExplorationMap.tsx`

### Step 1: 添加状态和导入

```tsx
import OceanSailingScene from './OceanSailingScene'

// 添加 sailing 相关状态
const [isSailing, setIsSailing] = useState(false)
const [sailingTarget, setSailingTarget] = useState<{x: number, y: number} | null>(null)
```

### Step 2: 修改 handleAreaConfirm

```tsx
const handleAreaConfirm = () => {
  if (pendingAreaId) {
    const area = getAreaById(pendingAreaId)
    if (area) {
      // 设置航行目标位置
      setSailingTarget({ x: area.position.x, y: area.position.z })
      setIsSailing(true)
      // 开始航行状态
      explorationDispatch({ type: 'START_SAILING', targetAreaId: pendingAreaId })
    }
  }
  setShowAreaConfirm(false)
  setPendingAreaId(null)
}
```

### Step 3: 添加航行完成回调

```tsx
const handleSailingArrived = () => {
  explorationDispatch({ type: 'SAILING_COMPLETE' })
  setTimeout(() => {
    explorationDispatch({ type: 'ARRIVED' })
  }, 500) // 短暂停顿后进入 moving
}
```

### Step 4: 添加 OceanSailingScene 组件

在 return JSX 中添加（在主容器之前）：

```tsx
{isSailing && sailingTarget && (
  <OceanSailingScene
    isActive={isSailing}
    startPosition={{ x: 0, y: 0 }}
    endPosition={sailingTarget}
    onArrived={handleSailingArrived}
    isReducedMotion={false}
  />
)}
```

### Step 5: 修改 sailing 状态的显示

在 phase indicator 中添加：

```tsx
{exploration.phase === 'sailing' && <span>⛵ 航行中...</span>}
{exploration.phase === 'arrived' && <span>🏝️ 到达目的地！</span>}
```

### Step 6: 提交

```bash
git add src/components/game/ExplorationMap.tsx
git commit -m "feat: Integrate OceanSailingScene into ExplorationMap"
```

---

## Task 1.4: 测试验证

### Step 1: 运行所有测试

```bash
npm test -- --run
```

### Step 2: 构建验证

```bash
npm run build
```

---

## 验收标准

- [ ] 点击岛屿后确认对话框出现
- [ ] 确认后显示海洋场景
- [ ] 船只沿路径移动到岛屿
- [ ] 航行动画流畅
- [ ] 到达后正确进入下一状态
- [ ] 所有测试通过
- [ ] 构建成功

---

## 实现顺序

1. Task 1.1: 状态机扩展
2. Task 1.2: OceanSailingScene 组件
3. Task 1.3: ExplorationMap 集成
4. Task 1.4: 测试验证
