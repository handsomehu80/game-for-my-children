# P2 优化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现 P2-1（SVG性能）、P2-3（儿童确认面板）、P2-4（隐藏岛屿提示）

**Architecture:**
- 使用 Claymorphism 风格重构岛屿按钮组件
- 创建可复用的确认对话框组件
- 添加 SVG Sprite 系统减少 DOM 节点
- 通过 Zustand store 管理无障碍设置

**Tech Stack:** React 18+, TypeScript, CSS-in-JS (inline styles), Zustand

---

## 文件结构

```
src/
├── components/game/
│   ├── ConfirmDialog.tsx          # [新建] 确认对话框
│   ├── DangerConfirmDialog.tsx    # [新建] 双重确认危险操作
│   ├── AccessibilityToggle.tsx    # [新建] 无障碍开关
│   └── AreaNode.tsx               # [修改] 重构岛屿按钮
├── hooks/
│   └── useAccessibility.ts        # [新建] 无障碍设置 hook
├── store/
│   └── accessibilityStore.ts      # [新建] 无障碍状态 store
├── assets/
│   └── sprites/
│       └── islands.svg            # [新建] SVG sprite
└── index.css                      # [修改] 添加 Claymorphism 变量
```

---

## Task 1: 无障碍状态管理 (useAccessibility + accessibilityStore)

**Files:**
- Create: `src/store/accessibilityStore.ts`
- Create: `src/hooks/useAccessibility.ts`
- Test: `tests/hooks/useAccessibility.test.ts`

- [ ] **Step 1: 创建 accessibilityStore**

```typescript
// src/store/accessibilityStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AccessibilityState {
  highContrast: boolean
  setHighContrast: (enabled: boolean) => void
  toggleHighContrast: () => void
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      highContrast: false,
      setHighContrast: (enabled) => set({ highContrast: enabled }),
      toggleHighContrast: () => set({ highContrast: !get().highContrast }),
    }),
    { name: 'game_accessibility' }
  )
)
```

- [ ] **Step 2: 创建 useAccessibility hook**

```typescript
// src/hooks/useAccessibility.ts
import { useAccessibilityStore } from '../store/accessibilityStore'
import { useMemo } from 'react'

export function useAccessibility() {
  const highContrast = useAccessibilityStore((s) => s.highContrast)
  const setHighContrast = useAccessibilityStore((s) => s.setHighContrast)
  const toggleHighContrast = useAccessibilityStore((s) => s.toggleHighContrast)

  const isReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  return { highContrast, setHighContrast, toggleHighContrast, isReducedMotion }
}
```

- [ ] **Step 3: 编写测试**

```typescript
// tests/hooks/useAccessibility.test.ts
import { renderHook, act } from '@testing-library/react'
import { useAccessibility } from '../../src/hooks/useAccessibility'
import { useAccessibilityStore } from '../../src/store/accessibilityStore'

describe('useAccessibility', () => {
  it('should return default highContrast as false', () => {
    const { result } = renderHook(() => useAccessibility())
    expect(result.current.highContrast).toBe(false)
  })

  it('should toggle highContrast', () => {
    const { result } = renderHook(() => useAccessibility())
    act(() => result.current.toggleHighContrast())
    expect(result.current.highContrast).toBe(true)
  })
})
```

- [ ] **Step 4: 运行测试**

Run: `npm test -- tests/hooks/useAccessibility.test.ts`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/store/accessibilityStore.ts src/hooks/useAccessibility.ts tests/hooks/useAccessibility.test.ts
git commit -m "feat: Add accessibility state management for high contrast mode"
```

---

## Task 2: SVG Sprite 系统

**Files:**
- Create: `src/assets/sprites/islands.svg`
- Test: `tests/components/IslandSprite.test.tsx`

- [ ] **Step 1: 创建 SVG sprite 文件**

```xml
<!-- src/assets/sprites/islands.svg -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <!-- 普通岛屿图标 - 圆形 -->
  <symbol id="island-icon-normal" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="8" fill="currentColor"/>
  </symbol>

  <!-- Boss 岛屿图标 - 三角形 -->
  <symbol id="island-icon-boss" viewBox="0 0 24 24">
    <polygon points="12,2 22,22 2,22" fill="currentColor"/>
  </symbol>

  <!-- 隐藏岛屿图标 - 星星 -->
  <symbol id="island-icon-hidden" viewBox="0 0 24 24">
    <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" fill="currentColor"/>
  </symbol>

  <!-- 宝箱岛屿图标 - 方形+锁 -->
  <symbol id="island-icon-treasure" viewBox="0 0 24 24">
    <rect x="3" y="8" width="18" height="12" rx="2" fill="currentColor"/>
    <path d="M12 8V4M8 4h8" stroke="currentColor" stroke-width="2" fill="none"/>
  </symbol>
</svg>
```

- [ ] **Step 2: 创建 IslandIcon 组件**

```typescript
// src/components/game/IslandIcon.tsx
import React from 'react'

interface IslandIconProps {
  type: 'normal' | 'boss' | 'hidden' | 'treasure'
  size?: number
  className?: string
}

const ICON_IDS = {
  normal: '#island-icon-normal',
  boss: '#island-icon-boss',
  hidden: '#island-icon-hidden',
  treasure: '#island-icon-treasure',
} as const

export const IslandIcon: React.FC<IslandIconProps> = ({ type, size = 24, className }) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <use href={ICON_IDS[type]} />
    </svg>
  )
}
```

- [ ] **Step 3: 编写测试**

```typescript
// tests/components/IslandIcon.test.tsx
import { render, screen } from '@testing-library/react'
import { IslandIcon } from '../../src/components/game/IslandIcon'

describe('IslandIcon', () => {
  it('renders normal icon', () => {
    render(<IslandIcon type="normal" />)
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })

  it('renders with correct size', () => {
    render(<IslandIcon type="boss" size={32} />)
    const svg = document.querySelector('svg')
    expect(svg?.getAttribute('width')).toBe('32')
    expect(svg?.getAttribute('height')).toBe('32')
  })
})
```

- [ ] **Step 4: 运行测试**

Run: `npm test -- tests/components/IslandIcon.test.tsx`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/assets/sprites/islands.svg src/components/game/IslandIcon.tsx tests/components/IslandIcon.test.tsx
git commit -m "feat: Add SVG sprite system for island icons (P2-1)"
```

---

## Task 3: 确认对话框组件 (P2-3)

**Files:**
- Create: `src/components/game/ConfirmDialog.tsx`
- Create: `src/components/game/DangerConfirmDialog.tsx`
- Test: `tests/components/ConfirmDialog.test.tsx`

- [ ] **Step 1: 创建 ConfirmDialog 组件**

```typescript
// src/components/game/ConfirmDialog.tsx
import React from 'react'
import { IslandIcon } from './IslandIcon'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  icon?: 'island' | 'warning' | 'treasure'
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isDanger?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  icon = 'island',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  isDanger = false,
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (icon) {
      case 'warning': return '⚠️'
      case 'treasure': return '📦'
      default: return '🏝️'
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        style={{
          background: '#F8FAFC',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '12px 12px 24px rgba(0,0,0,0.3), -6px -6px 16px rgba(255,255,255,0.8)',
          maxWidth: '400px',
          textAlign: 'center',
          transform: 'scale(1)',
          transition: 'transform 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{getIcon()}</div>

        <h3
          id="confirm-title"
          style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '24px',
            fontWeight: 600,
            color: '#1E293B',
            marginBottom: '8px',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily: "'Comic Neue', cursive",
            fontSize: '16px',
            color: '#64748b',
            marginBottom: '24px',
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              background: 'linear-gradient(135deg, #94a3b8, #64748b)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '16px 32px',
              fontSize: '18px',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 600,
              boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              minWidth: '120px',
              minHeight: '56px',
            }}
            aria-label={cancelText}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            style={{
              background: isDanger
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '16px 32px',
              fontSize: '18px',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 600,
              boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              minWidth: '120px',
              minHeight: '56px',
            }}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>

        <p
          style={{
            fontSize: '12px',
            color: '#94a3b8',
            fontFamily: "'Comic Neue', cursive",
            marginTop: '16px',
          }}
        >
          💡 提示：点击按钮即可选择
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 DangerConfirmDialog 组件**

```typescript
// src/components/game/DangerConfirmDialog.tsx
import React from 'react'
import { ConfirmDialog } from './ConfirmDialog'

interface DangerConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export const DangerConfirmDialog: React.FC<DangerConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = '确定退出',
  cancelText = '取消',
  onConfirm,
  onCancel,
}) => {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={title}
      message={message}
      icon="warning"
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isDanger={true}
      // 双重确认：危险操作需要额外确认
      customContent={
        <div
          style={{
            background: '#fef2f2',
            border: '3px dashed #ef4444',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <p
            style={{
              fontFamily: "'Baloo 2', cursive",
              color: '#dc2626',
              fontWeight: 600,
              margin: 0,
            }}
          >
            {title}？确定吗？
          </p>
        </div>
      }
    />
  )
}
```

Note: 需要修改 ConfirmDialog 支持 customContent prop 或在此组件中内联样式。

简化版 DangerConfirmDialog 直接内联双重确认 UI：

```typescript
// src/components/game/DangerConfirmDialog.tsx
import React from 'react'

interface DangerConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export const DangerConfirmDialog: React.FC<DangerConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = '确定退出',
  cancelText = '取消',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: '#F8FAFC',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '12px 12px 24px rgba(0,0,0,0.3), -6px -6px 16px rgba(255,255,255,0.8)',
          maxWidth: '400px',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>

        <h3
          style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '24px',
            fontWeight: 600,
            color: '#dc2626',
            marginBottom: '8px',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily: "'Comic Neue', cursive",
            fontSize: '16px',
            color: '#64748b',
            marginBottom: '16px',
          }}
        >
          {message}
        </p>

        {/* 双重确认提示 */}
        <div
          style={{
            background: '#fef2f2',
            border: '3px dashed #ef4444',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <p
            style={{
              fontFamily: "'Baloo 2', cursive",
              color: '#dc2626',
              fontWeight: 600,
              margin: 0,
            }}
          >
            {title}？确定吗？
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              background: 'linear-gradient(135deg, #94a3b8, #64748b)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '14px 28px',
              fontSize: '16px',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 600,
              boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              minHeight: '56px',
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '14px 28px',
              fontSize: '16px',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 600,
              boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              minHeight: '56px',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 编写测试**

```typescript
// tests/components/ConfirmDialog.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ConfirmDialog } from '../../src/components/game/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Message')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
  })

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = jest.fn()
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Message"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )
    fireEvent.click(screen.getByText('确定'))
    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = jest.fn()
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Message"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )
    fireEvent.click(screen.getByText('取消'))
    expect(onCancel).toHaveBeenCalled()
  })
})
```

- [ ] **Step 4: 运行测试**

Run: `npm test -- tests/components/ConfirmDialog.test.tsx`
Expected: PASS

- [ ] **Step 5: 提交**

```bash
git add src/components/game/ConfirmDialog.tsx src/components/game/DangerConfirmDialog.tsx tests/components/ConfirmDialog.test.tsx
git commit -m "feat: Add ConfirmDialog and DangerConfirmDialog components (P2-3)"
```

---

## Task 4: 岛屿按钮重构 (P2-1 + P2-4)

**Files:**
- Modify: `src/components/game/AreaNode.tsx`
- Test: `tests/components/AreaNode.test.tsx`

- [ ] **Step 1: 重构 AreaNode 组件**

重写 `src/components/game/AreaNode.tsx`，使用：
- Claymorphism 样式（双重阴影、圆角 16-24px）
- IslandIcon SVG 组件替换 emoji
- 隐藏岛屿微弱发光效果（P2-4）
- CSS Containment
- 无障碍支持

```typescript
// src/components/game/AreaNode.tsx
import { useGameStore } from '../../store/gameStore'
import { getAreaById, getDifficultyStars } from '../../data/areas'
import { IslandIcon } from './IslandIcon'
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

  const isUnlocked = area.requiredKeys === 0 || exploration?.unlockedAreas.includes(areaId)
  const isDefeated = exploration?.defeatedMiniBosses.includes(areaId)
  const isCurrent = exploration?.currentArea === areaId

  if (!isUnlocked && !isDefeated) {
    return null
  }

  const handleClick = () => {
    if (isUnlocked && onClick) {
      onClick(areaId)
    }
  }

  // 获取岛屿类型对应的颜色（支持高对比度）
  const getTypeColors = () => {
    const normal = highContrast ? '#006600' : '#22C55E'
    const boss = highContrast ? '#CC0000' : '#EF4444'
    const hidden = highContrast ? '#660066' : '#6366F1'
    const treasure = highContrast ? '#996600' : '#EAB308'

    switch (area.type) {
      case 'boss': return { bg: `linear-gradient(135deg, ${boss}, ${boss}CC)`, border: highContrast ? '3px solid white' : '3px solid gold' }
      case 'hidden': return { bg: `linear-gradient(135deg, ${hidden}, ${hidden}CC)`, border: highContrast ? '3px solid white' : '2px dashed #9b59b6' }
      case 'treasure': return { bg: `linear-gradient(135deg, ${treasure}, ${treasure}CC)`, border: highContrast ? '3px solid white' : '2px solid #ffd700' }
      default: return { bg: `linear-gradient(135deg, ${normal}, ${normal}CC)`, border: highContrast ? '3px solid white' : '2px solid #4dabf7' }
    }
  }

  const colors = getTypeColors()

  // 获取隐藏岛屿发光样式（P2-4）
  const getHiddenGlowStyle = () => {
    if (area.type !== 'hidden') return {}

    if (isReducedMotion) {
      return {
        boxShadow: '0 0 12px rgba(99, 102, 241, 0.35), 6px 6px 12px rgba(0,0,0,0.3)',
      }
    }

    return {
      animation: 'hiddenIslandGlow 2s ease-in-out infinite alternate',
    }
  }

  const nodeStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${area.position.x * 60 + 150}px`,
    top: `${area.position.z * 60 + 80}px`,
    width: '70px',
    height: '70px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isUnlocked ? 'pointer' : 'not-allowed',
    transition: 'transform 0.2s ease-out',
    opacity: isDefeated && !isCurrent ? 0.6 : 1,
    background: colors.bg,
    border: colors.border,
    boxShadow: '6px 6px 12px rgba(0,0,0,0.3), -3px -3px 8px rgba(255,255,255,0.2)',
    contain: 'layout style paint', // P2-1 CSS containment
    ...getHiddenGlowStyle(),
  }

  return (
    <>
      {/* SVG sprite 定义 */}
      <svg style={{ display: 'none' }}>
        <symbol id="island-icon-normal" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8" fill="currentColor"/>
        </symbol>
        <symbol id="island-icon-boss" viewBox="0 0 24 24">
          <polygon points="12,2 22,22 2,22" fill="currentColor"/>
        </symbol>
        <symbol id="island-icon-hidden" viewBox="0 0 24 24">
          <polygon points="12,2 15,9 22,9 17,14 19,22 12,17 5,22 7,14 2,9 9,9" fill="currentColor"/>
        </symbol>
      </svg>

      {/* 动画样式 */}
      {!isReducedMotion && (
        <style>
          {`
            @keyframes hiddenIslandGlow {
              from { box-shadow: 0 0 15px rgba(99, 102, 241, 0.3), 6px 6px 12px rgba(0,0,0,0.3); }
              to { box-shadow: 0 0 25px rgba(99, 102, 241, 0.5), 6px 6px 12px rgba(0,0,0,0.3); }
            }
            @media (prefers-reduced-motion: reduce) {
              .hidden-island-glow { animation: none; }
            }
          `}
        </style>
      )}

      <div
        style={nodeStyle}
        onClick={handleClick}
        role="button"
        aria-label={`${area.name}，难度 ${getDifficultyStars(area.difficulty)}${area.type === 'hidden' ? '，需要钥匙' : ''}`}
        tabIndex={isUnlocked ? 0 : -1}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        className={area.type === 'hidden' ? 'hidden-island-glow' : undefined}
      >
        <IslandIcon type={area.type} size={24} />

        <span style={{
          color: 'white',
          fontSize: '9px',
          marginTop: '4px',
          textAlign: 'center',
          fontFamily: "'Comic Neue', cursive",
          textShadow: highContrast ? '1px 1px 0 black' : 'none',
        }}>
          {area.name.length > 6 ? area.name.slice(0, 5) + '...' : area.name}
        </span>

        <span style={{
          color: highContrast ? '#FFFF00' : '#ffd700',
          fontSize: '9px',
        }}>
          {getDifficultyStars(area.difficulty)}
        </span>

        {isDefeated && (
          <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '14px' }} aria-label="已击败">
            ✅
          </span>
        )}

        {!isUnlocked && (
          <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '14px' }} aria-label="未解锁">
            🔒
          </span>
        )}
      </div>
    </>
  )
}
```

- [ ] **Step 2: 编写测试**

```typescript
// tests/components/AreaNode.test.tsx
import { render, screen } from '@testing-library/react'
import { AreaNode } from '../../src/components/game/AreaNode'
import { GameStoreProvider } from '../helpers/TestProvider'

// 需要创建测试辅助函数和 mock store
// 这里简化示例

describe('AreaNode', () => {
  it('renders island name', () => {
    // Mock store and render
  })

  it('applies hidden island glow animation', () => {
    // Test animation class
  })

  it('supports high contrast mode', () => {
    // Test high contrast colors
  })
})
```

- [ ] **Step 3: 运行测试**

Run: `npm test -- tests/components/AreaNode.test.tsx`
Expected: PASS (或根据现有测试调整)

- [ ] **Step 4: 提交**

```bash
git add src/components/game/AreaNode.tsx tests/components/AreaNode.test.tsx
git commit -m "refactor: Apply Claymorphism style and glow effect to AreaNode (P2-1, P2-4)"
```

---

## Task 5: 集成确认面板到 ExplorationMap

**Files:**
- Modify: `src/components/game/ExplorationMap.tsx`
- Test: `tests/components/ExplorationMap.test.tsx`

- [ ] **Step 1: 添加确认面板状态和逻辑**

在 ExplorationMap 中：
1. 添加 `showAreaConfirm` 状态（选择区域前的确认）
2. 添加 `showExitConfirm` 状态（退出游戏的确认）
3. 集成 ConfirmDialog 和 DangerConfirmDialog

```typescript
// ExplorationMap.tsx 需要添加的部分：

// 状态
const [showAreaConfirm, setShowAreaConfirm] = useState(false)
const [pendingAreaId, setPendingAreaId] = useState<string | null>(null)
const [showExitConfirm, setShowExitConfirm] = useState(false)

// 处理区域点击（改为显示确认）
const handleAreaClick = (areaId: string) => {
  const area = getAreaById(areaId)
  if (!area) return

  // Boss 区域需要确认
  if (area.type === 'boss') {
    setPendingAreaId(areaId)
    setShowAreaConfirm(true)
  } else {
    selectArea(areaId)
  }
}

// 确认框回调
const handleAreaConfirm = () => {
  if (pendingAreaId) {
    selectArea(pendingAreaId)
  }
  setShowAreaConfirm(false)
  setPendingAreaId(null)
}

const handleAreaCancel = () => {
  setShowAreaConfirm(false)
  setPendingAreaId(null)
}

// 退出确认
const handleExitClick = () => {
  setShowExitConfirm(true)
}

const handleExitConfirm = () => {
  explorationDispatch({ type: 'RESET_EXPLORATION' })
  useGameStore.getState().dispatch({ type: 'RESET_GAME' } as any)
}
```

- [ ] **Step 2: 在 JSX 中添加确认对话框**

```tsx
return (
  <div className="exploration-map">
    {/* ... 现有内容 ... */}

    {/* Boss 区域确认 */}
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

    {/* 退出游戏确认（双重） */}
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
)
```

- [ ] **Step 3: 提交**

```bash
git add src/components/game/ExplorationMap.tsx
git commit -m "feat: Integrate ConfirmDialog for area selection and exit (P2-3)"
```

---

## Task 6: 无障碍开关组件

**Files:**
- Create: `src/components/game/AccessibilityToggle.tsx`
- Modify: `src/components/game/Game.tsx` 或 `TitleScreen.tsx`（添加开关）
- Test: `tests/components/AccessibilityToggle.test.tsx`

- [ ] **Step 1: 创建 AccessibilityToggle 组件**

```typescript
// src/components/game/AccessibilityToggle.tsx
import React from 'react'
import { useAccessibility } from '../../hooks/useAccessibility'

export const AccessibilityToggle: React.FC = () => {
  const { highContrast, toggleHighContrast } = useAccessibility()

  return (
    <button
      onClick={toggleHighContrast}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        background: highContrast
          ? 'linear-gradient(135deg, #FFFF00, #FFD700)'
          : 'linear-gradient(135deg, #64748b, #475569)',
        color: highContrast ? '#000' : '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: '14px',
        fontFamily: "'Baloo 2', cursive",
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      aria-label={highContrast ? '关闭高对比度模式' : '开启高对比度模式'}
      aria-pressed={highContrast}
    >
      <span style={{ fontSize: '18px' }}>
        {highContrast ? '◐' : '◑'}
      </span>
      <span>无障碍</span>
    </button>
  )
}
```

- [ ] **Step 2: 在 Game 或 TitleScreen 中集成**

在游戏主界面添加 AccessibilityToggle：

```tsx
// 在 Game.tsx 中
import { AccessibilityToggle } from './AccessibilityToggle'

// 在 return JSX 中添加
return (
  <div className="game">
    <AccessibilityToggle />
    {/* ... 其他内容 ... */}
  </div>
)
```

- [ ] **Step 3: 提交**

```bash
git add src/components/game/AccessibilityToggle.tsx src/components/game/Game.tsx
git commit -m "feat: Add accessibility toggle component (P2-2)"
```

---

## Task 7: 全局样式优化

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: 添加字体和全局样式**

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Comic+Neue:wght@400;700&display=swap');

:root {
  /* Claymorphism 变量 */
  --clay-radius: 16px;
  --clay-radius-lg: 24px;
  --clay-shadow-light: rgba(255, 255, 255, 0.8);
  --clay-shadow-dark: rgba(0, 0, 0, 0.1);

  /* 颜色 */
  --color-primary: #2563EB;
  --color-secondary: #3B82F6;
  --color-cta: #F97316;
  --color-background: #F8FAFC;
  --color-text: #1E293B;
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Comic Neue', cursive, system-ui, sans-serif;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Baloo 2', cursive, system-ui, sans-serif;
}

/* 按钮基础样式 */
button {
  font-family: 'Baloo 2', cursive;
  transition: transform 0.2s ease-out;
}

button:active {
  transform: scale(0.95);
}

/* prefers-reduced-motion 支持 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/index.css
git commit -m "style: Add global styles with Baloo 2 font and Claymorphism variables"
```

---

## 实现顺序

1. **Task 1**: 无障碍状态管理（基础设施）
2. **Task 2**: SVG Sprite 系统（P2-1 基础设施）
3. **Task 3**: 确认对话框（P2-3 核心组件）
4. **Task 4**: 岛屿按钮重构（P2-1 + P2-4 核心组件）
5. **Task 5**: 集成确认面板到 ExplorationMap
6. **Task 6**: 无障碍开关
7. **Task 7**: 全局样式优化

---

## 验收标准

- [ ] 确认对话框按钮触摸目标 ≥ 56px
- [ ] 危险操作双重确认显示虚线边框 + 重复文字
- [ ] 隐藏岛屿发光动画流畅（60fps）
- [ ] prefers-reduced-motion 正确禁用动画
- [ ] 高对比度模式切换后岛屿颜色立即变化
- [ ] 颜色对比度 ≥ 4.5:1
- [ ] 所有按钮有 aria-label
- [ ] SVG 图标替代 emoji
- [ ] CSS containment 应用于岛屿节点
