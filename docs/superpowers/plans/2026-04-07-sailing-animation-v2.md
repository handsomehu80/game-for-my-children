# 航行动画 v2 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现两种航行动画风格 - 普通岛屿用极简快速(0.8s)，Boss岛屿用电影感(4s)

**Architecture:**
- OceanSailingScene 组件重构，根据 `style` prop 渲染不同视觉效果
- `seed` prop 用于生成确定性星空（仅 cinematic 模式）
- ExplorationMap 根据岛屿类型选择动画风格

**Tech Stack:** React 18+, TypeScript, CSS Animation

---

## 文件结构

```
src/components/game/
├── OceanSailingScene.tsx    # [修改] 支持两种动画风格
└── ExplorationMap.tsx        # [修改] 集成动画风格选择

src/game/utils/
└── seededRandom.ts          # [已存在] 提供 seeded random

tests/
└── components/
    └── OceanSailingScene.test.tsx  # [新建] 航行动画测试
```

---

## Task 1: 重构 OceanSailingScene 组件

**Files:**
- Modify: `src/components/game/OceanSailingScene.tsx`
- Test: `tests/components/OceanSailingScene.test.tsx`

- [ ] **Step 1: 编写测试 - 验证 minimal 风格存在**

```typescript
// tests/components/OceanSailingScene.test.tsx
import { render, screen } from '@testing-library/react'
import OceanSailingScene from '../../src/components/game/OceanSailingScene'

describe('OceanSailingScene', () => {
  it('renders minimal style correctly', () => {
    render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        onArrived={() => {}}
      />
    )
    // minimal 风格应有渐变背景和帆船
    expect(document.body.innerHTML).toContain('⛵')
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

Run: `npm test -- tests/components/OceanSailingScene.test.tsx --watch`
Expected: FAIL - OceanSailingScene 不接受 `style` prop

- [ ] **Step 3: 更新 OceanSailingScene Props 接口 (移除未使用的 props)**

```typescript
// src/components/game/OceanSailingScene.tsx

interface Star {
  x: number
  y: number
  size: number
  twinkleDelay: number
}

interface OceanSailingSceneProps {
  isActive: boolean
  onArrived: () => void
  isReducedMotion?: boolean
  style: 'minimal' | 'cinematic'  // 新增
  seed?: number  // 新增，默认 Date.now()
}

// 移除: startPosition, endPosition (全屏覆盖不需要)
```

- [ ] **Step 4: 实现 generateStars 函数 (使用 SeededRandom)**

```typescript
// 在 OceanSailingScene.tsx 内部
import { SeededRandom } from '../../game/utils/seededRandom'

interface Star {
  x: number      // 百分比位置 (0-100)
  y: number      // 百分比位置 (0-50)
  size: number   // 2-3px
  twinkleDelay: number  // 闪烁延迟 (ms)
}

function generateStars(seed: number): Star[] {
  const rng = new SeededRandom(seed)
  const stars: Star[] = []
  const starCount = 10  // 固定 10 颗

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: rng.next() * 100,  // 0-100%
      y: rng.next() * 50,   // 0-50% (上半部分)
      size: 2 + rng.next(), // 2-3px
      twinkleDelay: rng.next() * 2000,  // 0-2000ms
    })
  }
  return stars
}
```

- [ ] **Step 5: 实现 minimal 风格渲染**

```typescript
// OceanSailingScene.tsx 内部
function renderMinimalStyle(isReducedMotion: boolean) {
  return (
    <div className="minimal-scene" style={{
      background: 'linear-gradient(180deg, #87CEEB 0%, #4A90B8 100%)',
      // ...
    }}>
      {/* 帆船 */}
      <div
        className="sailing-ship"
        style={{
          animation: isReducedMotion ? 'none' : 'minimalSail 0.8s ease-out forwards',
          animationDelay: '0.2s',
          opacity: 0,
        }}
      >
        ⛵
      </div>
      {/* 目标岛屿 */}
      <div className="target-island" style={{ /* ... */ }}>🏝️</div>
    </div>
  )
}
```

- [ ] **Step 6: 实现 cinematic 风格渲染**

```typescript
// OceanSailingScene.tsx 内部
function renderCinematicStyle(stars: Star[], isReducedMotion: boolean) {
  return (
    <div className="cinematic-scene" style={{
      background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      // 电影黑边
      border: '8px solid rgba(0,0,0,0.8)',
      boxSizing: 'border-box',
    }}>
      {/* 星空 */}
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 3px white',
            animation: isReducedMotion ? 'none' : `starTwinkle 2s ease-in-out infinite`,
            animationDelay: `${star.twinkleDelay}ms`,
          }}
        />
      ))}

      {/* 月光 */}
      <div className="moonlight" style={{
        position: 'absolute',
        top: '15px',
        right: '60px',
        width: '25px',
        height: '25px',
        background: 'radial-gradient(circle at 30% 30%, #f5f5f5, #c0c0c0)',
        borderRadius: '50%',
        boxShadow: '0 0 15px rgba(255,255,255,0.3)',
      }} />

      {/* 岛屿剪影 */}
      <div className="island-silhouette" style={{ /* ... */ }} />

      {/* 帆船 - 带初始 position 用于 keyframe 动画 */}
      <div
        className="sailing-ship"
        style={{
          position: 'absolute',
          left: '5%',
          bottom: '30%',
          animation: isReducedMotion ? 'none' : 'cinematicSail 4s ease-in-out forwards',
        }}
      >
        ⛵
      </div>
    </div>
  )
}
```

- [ ] **Step 7: 添加 CSS 动画**

```typescript
// 在 style 标签内
const animationStyles = `
  @keyframes minimalSail {
    0% { opacity: 0; transform: translateX(-20px); }
    20% { opacity: 1; }
    100% { opacity: 1; transform: translateX(calc(100vw - 100px)); }
  }

  @keyframes cinematicSail {
    0% { left: 5%; bottom: 30%; opacity: 0; }
    10% { opacity: 0.3; }
    20% { opacity: 1; }
    90% { opacity: 1; }
    100% { left: 75%; bottom: 35%; opacity: 0; }
  }

  @keyframes starTwinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sailing-ship { animation: none !important; }
    .star { animation: none !important; }
  }
`
```

- [ ] **Step 8: 更新主组件渲染逻辑**

```typescript
// OceanSailingScene.tsx 的 return 部分
export default function OceanSailingScene({
  isActive,
  onArrived,
  isReducedMotion = false,
  style = 'minimal',
  seed = Date.now(),
}: OceanSailingSceneProps) {
  useEffect(() => {
    if (!isActive) return
    const duration = style === 'cinematic' ? 4000 : 800
    const timer = setTimeout(onArrived, duration)
    return () => clearTimeout(timer)
  }, [isActive, onArrived, style])

  if (!isActive) return null

  const stars = style === 'cinematic' ? generateStars(seed) : []

  return (
    <div className="ocean-sailing-scene" style={{ /* 全屏样式 */ }}>
      <style>{animationStyles}</style>
      {style === 'minimal'
        ? renderMinimalStyle(isReducedMotion)
        : renderCinematicStyle(stars, isReducedMotion)
      }
    </div>
  )
}
```

- [ ] **Step 9: 运行测试验证通过**

Run: `npm test -- tests/components/OceanSailingScene.test.tsx`
Expected: PASS

- [ ] **Step 10: 提交**

```bash
git add src/components/game/OceanSailingScene.tsx tests/components/OceanSailingScene.test.tsx
git commit -m "refactor: add dual sailing animation styles (minimal/cinematic)"
```

---

## Task 2: ExplorationMap 集成动画风格选择

**Files:**
- Modify: `src/components/game/ExplorationMap.tsx:1-50` (props 和 state)
- Modify: `src/components/game/ExplorationMap.tsx:300-400` (OceanSailingScene 使用处)

- [ ] **Step 1: 添加 seed 生成函数和动画风格选择逻辑**

在 ExplorationMap 组件上方添加:

```typescript
import { SeededRandom } from '../../game/utils/seededRandom'

// 生成确定性 seed (使用现有的字符串 hash 逻辑)
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
```

**注意**: 移除了 `hash & hash` 这个无意义的操作，直接使用 `Math.abs()` 确保为正数。

- [ ] **Step 2: 更新 OceanSailingScene 使用**

找到现有的 OceanSailingScene 使用处，更新为:

```tsx
<OceanSailingScene
  isActive={isSailing}
  style={getAnimationStyle(pendingAreaId || '')}
  seed={generateSailingSeed(pendingAreaId || '')}
  onArrived={handleSailingArrived}
  isReducedMotion={false}
/>
```

- [ ] **Step 3: 验证构建**

Run: `npm run build`
Expected: 无错误

- [ ] **Step 4: 提交**

```bash
git add src/components/game/ExplorationMap.tsx
git commit -m "feat: integrate sailing animation style selection by island type"
```

---

## Task 3: 集成测试

**Files:**
- Test: `tests/components/OceanSailingScene.test.tsx`

- [ ] **Step 1: 添加测试用例**

```typescript
describe('OceanSailingScene - generateStars', () => {
  it('generates exactly 10 stars', () => {
    const stars = generateStars(12345)
    expect(stars.length).toBe(10)
  })

  it('generates deterministic stars for same seed', () => {
    const stars1 = generateStars(12345)
    const stars2 = generateStars(12345)
    expect(stars1).toEqual(stars2)
  })

  it('generates stars within upper half of screen (y < 50%)', () => {
    const stars = generateStars(12345)
    stars.forEach(star => {
      expect(star.y).toBeLessThan(50)
    })
  })

  it('generates stars within screen width (x < 100%)', () => {
    const stars = generateStars(12345)
    stars.forEach(star => {
      expect(star.x).toBeLessThan(100)
      expect(star.x).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('OceanSailingScene - getAnimationStyle', () => {
  it('applies cinematic style for boss islands', () => {
    expect(getAnimationStyle('east_boss')).toBe('cinematic')
    expect(getAnimationStyle('west_boss')).toBe('cinematic')
  })

  it('applies minimal style for normal islands', () => {
    expect(getAnimationStyle('east_math_1')).toBe('minimal')
    expect(getAnimationStyle('east_chinese_2')).toBe('minimal')
  })
})

describe('OceanSailingScene - prefers-reduced-motion', () => {
  it('handles reduced motion preference', () => {
    // 在 reduced motion 模式下不应渲染动画相关元素
    const { container } = render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        isReducedMotion={true}
        onArrived={() => {}}
      />
    )
    // 组件应正常渲染
    expect(container.querySelector('.minimal-scene')).toBeTruthy()
  })
})
```

- [ ] **Step 2: 运行测试**

Run: `npm test -- tests/components/OceanSailingScene.test.tsx`
Expected: PASS

- [ ] **Step 3: 提交**

```bash
git add tests/components/OceanSailingScene.test.tsx
git commit -m "test: add sailing animation integration tests"
```

---

## 验收清单

- [ ] OceanSailingScene 支持 `style` 和 `seed` props
- [ ] minimal 风格 0.8 秒完成
- [ ] cinematic 风格 4 秒完成，带星空效果
- [ ] 星空使用 seeded random 保证可复现
- [ ] prefers-reduced-motion 正确处理
- [ ] Boss 岛屿使用 cinematic 风格
- [ ] 普通岛屿使用 minimal 风格
- [ ] 所有测试通过

---

## 参考文件

- Spec: `docs/superpowers/specs/2026-04-07-sailing-animation-v2-design.md`
- 现有 OceanSailingScene: `src/components/game/OceanSailingScene.tsx`
- ExplorationMap 集成: `src/components/game/ExplorationMap.tsx`
- Seeded random: `src/game/utils/seededRandom.ts`
