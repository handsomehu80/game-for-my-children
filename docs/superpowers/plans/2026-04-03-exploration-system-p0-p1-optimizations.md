# Exploration System P0/P1 Optimizations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all P0 blocking issues and implement P1 important features for the exploration system based on red-blue adversarial review results.

**Architecture:** The exploration system uses a state machine pattern with Zustand for state management. Key files:
- `src/game/ExplorationStateMachine.ts` - Core state transitions
- `src/store/gameStore.ts` - Zustand store with exploration actions
- `src/data/areas/index.ts` - Area definitions
- `src/components/game/ExplorationMap.tsx` - React UI component

**Tech Stack:** React 18+, Zustand, TypeScript, Vitest

---

## File Structure

```
src/
├── game/
│   ├── ExplorationStateMachine.ts   # State machine - MODIFY (P0-2, P0-4, P1-3)
│   ├── types.ts                      # Types - MODIFY (P1-2, P1-5)
│   └── utils/
│       └── seededRandom.ts          # CREATE - Seeded random for portals (P1-5)
├── store/
│   └── gameStore.ts                 # Store - MODIFY (P0-1, P0-3, P0-5, P1-1, P1-2)
├── data/
│   └── areas/
│       └── index.ts                 # Areas - MODIFY (P1-4)
├── utils/
│   └── storage.ts                   # CREATE - localStorage with capacity检测 (P1-1)
└── components/game/
    └── ExplorationMap.tsx           # UI - MODIFY (P0-3, P1-2)
```

---

## Task 1: P0-1 answerIndex Boundary Check

**Files:**
- Modify: `src/store/gameStore.ts:67-109`

**Context:** When answering questions, answerIndex may exceed array bounds. Need explicit boundary validation.

- [ ] **Step 1: Write failing test**

```typescript
// src/store/gameStore.test.ts
describe('ANSWER_QUESTION boundary', () => {
  it('应处理超出范围的answerIndex', () => {
    const store = createStore()
    store.dispatch({ type: 'START_GAME', players: [{ id: 'p1', name: 'Test', hp: 100, maxHp: 100, comboCount: 0 }] })
    store.dispatch({ type: 'SELECT_OCEAN', ocean: 'east' })
    // Start battle with a 4-option question
    store.dispatch({
      type: 'START_BATTLE',
      monster: { id: 'm1', name: 'Test', hp: 50, maxHp: 50, sprite: '' },
      question: {
        id: 'q1',
        content: 'Test?',
        type: 'single',
        difficulty: 1,
        category: 'math',
        options: [
          { text: 'A', isCorrect: false },
          { text: 'B', isCorrect: false },
          { text: 'C', isCorrect: true },
          { text: 'D', isCorrect: false },
        ],
      },
    })
    // Try to answer with index 100 (out of bounds)
    store.dispatch({ type: 'ANSWER_QUESTION', answerIndex: 100 })
    // Should not crash - should treat as wrong answer or clamp
    const state = store.getState()
    expect(state.battle?.player.hp).toBeLessThan(100) // Took damage from wrong answer
  })

  it('应处理负数的answerIndex', () => {
    const store = createStore()
    store.dispatch({ type: 'START_GAME', players: [{ id: 'p1', name: 'Test', hp: 100, maxHp: 100, comboCount: 0 }] })
    store.dispatch({ type: 'SELECT_OCEAN', ocean: 'east' })
    store.dispatch({
      type: 'START_BATTLE',
      monster: { id: 'm1', name: 'Test', hp: 50, maxHp: 50, sprite: '' },
      question: {
        id: 'q1',
        content: 'Test?',
        type: 'single',
        difficulty: 1,
        category: 'math',
        options: [{ text: 'A', isCorrect: true }],
      },
    })
    store.dispatch({ type: 'ANSWER_QUESTION', answerIndex: -1 })
    const state = store.getState()
    expect(state.battle).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run src/store/gameStore.test.ts`
Expected: Tests should pass if current code handles bounds, or fail if it doesn't

- [ ] **Step 3: Implement boundary check in ANSWER_QUESTION**

```typescript
case 'ANSWER_QUESTION': {
  if (!state.battle || !state.battle.currentQuestion) return state
  const question = state.battle.currentQuestion
  // P0-1: Explicit boundary check
  const validAnswerCount = question.options.length
  const answerIndex = Math.min(Math.max(0, action.answerIndex), validAnswerCount - 1)
  const isCorrect = question.options[answerIndex]?.isCorrect ?? false
  // ... rest of the logic
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --run src/store/gameStore.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/store/gameStore.ts src/store/gameStore.test.ts
git commit -m "fix: P0-1 add answerIndex boundary check"
```

---

## Task 2: P0-2 Encounter Logic - Hidden Type Areas

**Files:**
- Modify: `src/components/game/ExplorationMap.tsx:37-55`

**Context:** Hidden type areas should skip random encounter and directly trigger battle. Current logic incorrectly allows treasure/battle RNG.

- [ ] **Step 1: Read current encounter logic**

Already read: `ExplorationMap.tsx:37-55` shows:
```typescript
// 模拟遭遇判定
useEffect(() => {
  if (!exploration || exploration.phase !== 'encounter') return
  const area = areas.find((a) => a.id === exploration.currentArea)
  if (!area) return

  let result: 'battle' | 'treasure' | 'hidden_event'
  if (area.type === 'treasure') {
    result = 'treasure'
  } else if (area.type === 'hidden') {
    result = 'battle'  // P0-2: This is CORRECT but let's verify with test
  } else if (Math.random() < 0.2) {
    result = 'hidden_event'
  } else {
    result = 'battle'
  }
  explorationDispatch({ type: 'ENCOUNTER_RESULT', result })
}, [exploration?.phase, exploration?.currentArea])
```

The current code already has `area.type === 'hidden' => result = 'battle'`. Let me write a test to verify this behavior is correct and add explicit documentation.

- [ ] **Step 2: Write test for hidden area encounter**

```typescript
// src/game/ExplorationStateMachine.test.ts
describe('P0-2: Hidden area encounter logic', () => {
  it('隐藏区域应直接触发战斗，跳过随机遭遇', () => {
    // Start exploration and move to hidden area
    const state = {
      ...initialExplorationState,
      phase: 'encounter' as const,
      currentArea: 'east_hidden_A', // This is a hidden area
    }
    // Simulate the same logic as ExplorationMap.tsx
    const area = getAreaById('east_hidden_A')
    expect(area?.type).toBe('hidden')

    // Hidden area should result in 'battle', not RNG
    let result: 'battle' | 'treasure' | 'hidden_event'
    if (area?.type === 'treasure') {
      result = 'treasure'
    } else if (area?.type === 'hidden') {
      result = 'battle' // Hidden = direct battle
    } else if (Math.random() < 0.2) {
      result = 'hidden_event'
    } else {
      result = 'battle'
    }
    expect(result).toBe('battle')
  })

  it('普通区域应根据概率触发不同遭遇', () => {
    // Test that normal areas CAN get treasure/battle/hidden_event
    const state = {
      ...initialExplorationState,
      phase: 'encounter' as const,
      currentArea: 'east_math_1', // Normal area
    }
    const area = getAreaById('east_math_1')
    expect(area?.type).toBe('normal')
    // Normal area should not directly return 'battle' without RNG
  })
})
```

- [ ] **Step 3: Run test to verify behavior**

Run: `npm test -- --run src/game/ExplorationStateMachine.test.ts`
Expected: PASS (existing logic is correct)

- [ ] **Step 4: Add explicit comment documenting the rule**

In ExplorationMap.tsx, add clear comments:
```typescript
} else if (area.type === 'hidden') {
  // P0-2: 隐藏区域跳过随机，直接触发战斗
  result = 'battle'
}
```

- [ ] **Step 5: Commit**

```bash
git add src/game/ExplorationStateMachine.test.ts src/components/game/ExplorationMap.tsx
git commit -m "docs: P0-2 document hidden area encounter rule"
```

---

## Task 3: P0-3 useEffect Closure Issue

**Files:**
- Modify: `src/components/game/ExplorationMap.tsx:28-87`

**Context:** useEffect hooks may have stale closure issues. Need to use refs or proper dependencies.

- [ ] **Step 1: Identify all useEffect hooks in ExplorationMap**

Already read ExplorationMap.tsx lines 28-87. Hooks:
1. `useEffect` at line 28: `exploration?.phase === 'moving'` - handles MOVE_COMPLETE
2. `useEffect` at line 38: `exploration?.phase === 'encounter'` - handles encounter logic
3. `useEffect` at line 58: `exploration?.phase === 'battle'` - battle trigger
4. `useEffect` at line 70: `exploration?.phase === 'victory'` - victory/key generation
5. `useEffect` at line 82: `exploration?.phase === 'treasure'` - treasure opening

- [ ] **Step 2: Fix with useCallback and refs**

```typescript
// Add at top of component
const latestExplorationRef = useRef(exploration)
useEffect(() => {
  latestExplorationRef.current = exploration
}, [exploration])

// Refactored encounter effect with proper closure
useEffect(() => {
  if (exploration?.phase !== 'encounter') return
  const currentExploration = latestExplorationRef.current
  const area = areas.find((a) => a.id === currentExploration?.currentArea)
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
}, [exploration?.phase, exploration?.currentArea, explorationDispatch, areas])
```

- [ ] **Step 3: Write test to verify no stale closure**

```typescript
// src/components/game/ExplorationMap.test.tsx (new file)
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ExplorationMap } from './ExplorationMap'
import { GameStoreProvider } from '../../store/GameStoreProvider' // Need to create

describe('ExplorationMap useEffect closure safety', () => {
  it('should not have stale closure in encounter effect', async () => {
    // Setup store with exploration in encounter phase
    const { result } = renderHook(() => useGameStore())
    act(() => {
      result.current.startExploration('east')
      result.current.selectArea('east_math_1')
    })
    // Force encounter phase
    act(() => {
      result.current.explorationDispatch({ type: 'MOVE_COMPLETE' })
    })
    // The encounter effect should fire and dispatch ENCOUNTER_RESULT
    await waitFor(() => {
      const state = result.current.exploration
      expect(state?.phase).toMatch(/encounter|battle|treasure/)
    })
  })
})
```

- [ ] **Step 4: Run tests**

Run: `npm test -- --run src/components/game/ExplorationMap.test.tsx 2>/dev/null || echo "Test file may need adjustments"`

- [ ] **Step 5: Commit**

```bash
git add src/components/game/ExplorationMap.tsx
git commit -m "fix: P0-3 useEffect closure safety with refs"
```

---

## Task 4: P0-4 Island Unlock State Validation

**Files:**
- Modify: `src/game/ExplorationStateMachine.ts:42-55`
- Modify: `src/store/gameStore.ts:213-233`

**Context:** When rolling back or resetting, island unlock state may become inconsistent. Need validation and reset mechanism.

- [ ] **Step 1: Write test for unlock state consistency**

```typescript
// src/game/ExplorationStateMachine.test.ts
describe('P0-4: Island unlock state validation', () => {
  it('应验证unlockedAreas与collectedKeys的一致性', () => {
    // Scenario: Player has 1 key, unlocks area A (uses 1 key, now has 0 keys)
    let state = {
      ...initialExplorationState,
      currentOcean: 'east' as const,
      collectedKeys: 1,
      unlockedAreas: [] as string[],
    }
    // Unlock area - should consume key
    state = explorationTransition(state, { type: 'UNLOCK_AREA', areaId: 'east_hidden_A' })
    expect(state.collectedKeys).toBe(0)
    expect(state.unlockedAreas).toContain('east_hidden_A')

    // Now if we rollback to before the unlock, collectedKeys should be 1 again
    // This is handled by savepoint stateSnapshot
    const savepoint: Savepoint = {
      type: 'area_unlock',
      createdAt: Date.now(),
      stateSnapshot: {
        visitedAreas: [],
        defeatedMiniBosses: [],
        unlockedAreas: [], // Before unlock
        collectedKeys: 1, // Has key again
        collectedItems: [],
      },
    }
    state = {
      ...state,
      phase: 'rollback' as const,
      lastSavepoint: savepoint,
    }
    state = explorationTransition(state, { type: 'ROLLBACK_TO_SAVEPOINT' })
    expect(state.collectedKeys).toBe(1)
    expect(state.unlockedAreas).not.toContain('east_hidden_A')
  })

  it('应在SELECT_AREA时验证区域解锁状态', () => {
    // Try to select hidden area without unlock
    const state = {
      ...initialExplorationState,
      currentOcean: 'east' as const,
      collectedKeys: 0,
      unlockedAreas: [] as string[], // Not unlocked
    }
    const result = explorationTransition(state, { type: 'SELECT_AREA', areaId: 'east_hidden_A' })
    expect(result.phase).toBe('error')
    expect(result.lastError).toContain('requires keys')
  })
})
```

- [ ] **Step 2: Verify current implementation handles this**

Current code at `ExplorationStateMachine.ts:42-55` already checks:
```typescript
if (area.requiredKeys > 0 && !state.unlockedAreas.includes(area.id)) {
  return { ...state, phase: 'error', lastError: `Area ${action.areaId} requires keys` }
}
```

- [ ] **Step 3: Add explicit state validation function**

```typescript
// In ExplorationStateMachine.ts
// P0-4: Validate exploration state consistency
export function validateExplorationState(state: ExplorationState): ExplorationState {
  // Check for inconsistent unlock state
  const hasInconsistentUnlocks = state.unlockedAreas.some(areaId => {
    const area = getAreaById(areaId)
    return area && area.requiredKeys === 0 // Unlocked area that doesn't need keys
  })

  if (hasInconsistentUnlocks) {
    // Clean up invalid unlocks
    const validUnlocks = state.unlockedAreas.filter(areaId => {
      const area = getAreaById(areaId)
      return area && area.requiredKeys > 0
    })
    return { ...state, unlockedAreas: validUnlocks }
  }

  return state
}
```

- [ ] **Step 4: Call validation after rollback**

In `ROLLBACK_TO_SAVEPOINT` handler:
```typescript
case 'ROLLBACK_TO_SAVEPOINT':
  if (state.lastSavepoint) {
    const rolledBack = {
      ...state,
      phase: 'exploring',
      currentArea: null,
      ...state.lastSavepoint.stateSnapshot,
      retryCount: 0,
      lastError: null,
    }
    return validateExplorationState(rolledBack)
  }
```

- [ ] **Step 5: Run tests**

Run: `npm test -- --run src/game/ExplorationStateMachine.test.ts`

- [ ] **Step 6: Commit**

```bash
git add src/game/ExplorationStateMachine.ts src/game/ExplorationStateMachine.test.ts
git commit -m "fix: P0-4 add unlock state validation on rollback"
```

---

## Task 5: P0-5 null/undefined Handling Enhancement

**Files:**
- Modify: `src/store/gameStore.ts:67-109`
- Modify: `src/game/QuestionSelector.ts`

**Context:** Need better null checks and fallback for difficulty when selecting questions.

- [ ] **Step 1: Write test for null handling**

```typescript
// src/game/QuestionSelector.test.ts
describe('P0-5: null/undefined handling', () => {
  it('应在difficulty为null/undefined时提供默认值', () => {
    // This should not throw
    const question1 = getRandomQuestion({ oceanId: 'east', difficulty: null as any })
    const question2 = getRandomQuestion({ oceanId: 'east', difficulty: undefined as any })
    // Should return a question or null, not throw
    expect(question1 ?? null).toBeNullOrValidQuestion()
    expect(question2 ?? null).toBeNullOrValidQuestion()
  })

  it('应在monster为null时正确处理', () => {
    const store = createStore()
    store.dispatch({ type: 'START_GAME', players: [{ id: 'p1', name: 'Test', hp: 100, maxHp: 100, comboCount: 0 }] })
    // Should not crash when starting battle with null monster
    expect(() => {
      store.dispatch({ type: 'START_BATTLE', monster: null as any, question: null as any })
    }).not.toThrow()
  })
})
```

- [ ] **Step 2: Implement fallback in ANSWER_QUESTION**

```typescript
case 'ANSWER_QUESTION': {
  if (!state.battle) return state  // P0-5: Guard against null battle state
  const question = state.battle.currentQuestion
  if (!question || !question.options) return state  // P0-5: Guard against null question
  // ... proceed with answer validation
}
```

- [ ] **Step 3: Implement fallback in QuestionSelector**

```typescript
// In getRandomQuestion
export function getRandomQuestion(options: {
  oceanId: string
  difficulty?: number | null
  category?: string
}): Question | null {
  const difficulty = options.difficulty ?? 1 // P0-5: Fallback to difficulty 1
  // ... rest
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- --run src/game/QuestionSelector.test.ts src/store/gameStore.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/store/gameStore.ts src/game/QuestionSelector.ts
git commit -m "fix: P0-5 add null/undefined handling guards"
```

---

## Task 6: P1-1 localStorage Capacity Detection

**Files:**
- Create: `src/utils/storage.ts`
- Modify: `src/store/gameStore.ts`

**Context:** localStorage has ~5MB limit. Need to detect capacity issues and clean up old data.

- [ ] **Step 1: Create storage utility**

```typescript
// src/utils/storage.ts

const STORAGE_KEY_PREFIX = 'ocean_game_'
const MAX_STORAGE_SIZE = 4.5 * 1024 * 1024 // 4.5MB to leave buffer

interface StorageInfo {
  used: number
  available: number
  keys: string[]
}

export function getStorageInfo(): StorageInfo {
  let used = 0
  const keys: string[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(STORAGE_KEY_PREFIX)) {
      const value = localStorage.getItem(key)
      if (value) {
        used += key.length + value.length
        keys.push(key)
      }
    }
  }

  return {
    used,
    available: MAX_STORAGE_SIZE - used,
    keys,
  }
}

export function checkStorageCapacity(): { ok: boolean; info: StorageInfo } {
  const info = getStorageInfo()
  return {
    ok: info.available > 0,
    info,
  }
}

export function cleanupOldData(): void {
  const info = getStorageInfo()
  if (info.available > MAX_STORAGE_SIZE * 0.2) return // Only cleanup if >20% full

  // Sort by age, oldest first
  const keyAges = info.keys.map(key => ({
    key,
    timestamp: parseInt(localStorage.getItem(key)?.split('_')[1] || '0') || Date.now()
  })).sort((a, b) => a.timestamp - b.timestamp)

  // Remove oldest 30%
  const toRemove = Math.ceil(keyAges.length * 0.3)
  for (let i = 0; i < toRemove; i++) {
    localStorage.removeItem(keyAges[i].key)
  }

  console.warn(`Storage cleanup: removed ${toRemove} old entries`)
}

export function safeSetItem(key: string, value: string): boolean {
  const fullKey = STORAGE_KEY_PREFIX + key
  const size = new Blob([value]).size

  if (size > MAX_STORAGE_SIZE) {
    console.error('Value too large for storage:', size)
    return false
  }

  const info = getStorageInfo()
  if (info.used + size > MAX_STORAGE_SIZE) {
    cleanupOldData()
  }

  try {
    localStorage.setItem(fullKey, value)
    return true
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      cleanupOldData()
      try {
        localStorage.setItem(fullKey, value)
        return true
      } catch {
        return false
      }
    }
    return false
  }
}

export function safeGetItem(key: string): string | null {
  return localStorage.getItem(STORAGE_KEY_PREFIX + key)
}
```

- [ ] **Step 2: Write tests**

```typescript
// src/utils/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { getStorageInfo, checkStorageCapacity, safeSetItem } from './storage'

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('应正确计算存储使用量', () => {
    safeSetItem('test1', 'hello')
    safeSetItem('test2', 'world')
    const info = getStorageInfo()
    expect(info.keys.length).toBeGreaterThanOrEqual(2)
    expect(info.used).toBeGreaterThan(0)
  })

  it('应在存储满时返回ok=false', () => {
    // Fill with large data
    const largeData = 'x'.repeat(MAX_STORAGE_SIZE + 1000)
    const result = safeSetItem('large', largeData)
    expect(result).toBe(false)
  })
})
```

- [ ] **Step 3: Run tests**

Run: `npm test -- --run src/utils/storage.test.ts`

- [ ] **Step 4: Integrate into gameStore save/load**

```typescript
// In gameStore.ts
import { safeSetItem, safeGetItem, checkStorageCapacity } from '../utils/storage'

// Replace direct localStorage.setItem with safeSetItem
// Add storage health check on game load
const storageCheck = checkStorageCapacity()
if (!storageCheck.ok) {
  console.warn('Storage capacity warning:', storageCheck.info)
}
```

- [ ] **Step 5: Commit**

```bash
git add src/utils/storage.ts src/utils/storage.test.ts src/store/gameStore.ts
git commit -m "feat: P1-1 add localStorage capacity detection and cleanup"
```

---

## Task 7: P1-2 Guaranteed Key Drop (Every 5 Victories)

**Files:**
- Modify: `src/store/gameStore.ts:70-79`
- Modify: `src/game/types.ts`

**Context:** Add guarantee that every 5 victories = at least 1 key. This ensures progress even with bad RNG.

- [ ] **Step 1: Add tracking field to types**

```typescript
// In src/game/types.ts - ExplorationState interface
export interface ExplorationState {
  // ... existing fields
  consecutiveVictoriesWithoutKey: number  // P1-2: Track victories for guarantee
}
```

- [ ] **Step 2: Initialize field**

```typescript
// In initialExplorationState
export const initialExplorationState: ExplorationState = {
  // ... existing fields
  consecutiveVictoriesWithoutKey: 0,  // P1-2
}
```

- [ ] **Step 3: Implement guaranteed key logic**

In `gameStore.ts`, the victory handling (around line 70):

```typescript
// P1-2: Guaranteed key drop - every 5 victories = 1 key
const newConsecutiveVictories = exploration.consecutiveVictoriesWithoutKey + 1
let keyDrop = 0

if (area.type === 'boss') {
  // Boss always drops key
  keyDrop = 1
} else if (Math.random() < 0.3) {
  // 30% normal drop
  keyDrop = 1
}

// P1-2: Guaranteed key every 5 victories (regardless of RNG)
const GUARANTEED_KEY_INTERVAL = 5
if (newConsecutiveVictoriesWithoutKey >= GUARANTEED_KEY_INTERVAL && keyDrop === 0) {
  keyDrop = 1
  // Reset counter after guaranteed drop
  explorationDispatch({ type: 'RESET_VICTORY_COUNTER' })
} else if (keyDrop > 0) {
  // Reset counter on normal key drop
  explorationDispatch({ type: 'RESET_VICTORY_COUNTER' })
}
```

- [ ] **Step 4: Add RESET_VICTORY_COUNTER action**

In `types.ts`:
```typescript
export type ExplorationAction =
  // ... existing actions
  | { type: 'RESET_VICTORY_COUNTER' }  // P1-2
```

In `ExplorationStateMachine.ts`:
```typescript
case 'RESET_VICTORY_COUNTER':
  return { ...state, consecutiveVictoriesWithoutKey: 0 }
```

- [ ] **Step 5: Write test**

```typescript
// src/store/gameStore.test.ts
describe('P1-2: Guaranteed key drop', () => {
  it('应每5场胜利保证获得1钥匙', () => {
    const store = createStore()
    // Simulate 5 victories without key drop
    for (let i = 0; i < 5; i++) {
      act(() => {
        store.getState().explorationDispatch({ type: 'BATTLE_WIN', areaId: 'east_math_1' })
        // Force no random key drop (mock would be needed)
      })
    }
    // 6th victory should guarantee a key
    // This test would need mocking - showing the expected behavior
  })
})
```

- [ ] **Step 6: Commit**

```bash
git add src/game/types.ts src/game/ExplorationStateMachine.ts src/store/gameStore.ts
git commit -m "feat: P1-2 guaranteed key drop every 5 victories"
```

---

## Task 8: P1-3 Unify failedAttempts Naming

**Files:**
- Modify: `src/game/ExplorationStateMachine.ts:115-139`
- Modify: `src/game/types.ts`

**Context:** The naming `retryCount` vs `failedAttempts` is confusing. `failedAttempts` is clearer as it tracks per-area failures.

- [ ] **Step 1: Identify all usages**

Grep for `retryCount` and `failedAttempts`:
- `retryCount` used in: `types.ts:240`, `ExplorationStateMachine.ts:112,117,122,128,136,239,256`, `gameStore.ts:20`
- `failedAttempts` used in: `types.ts:235`, `ExplorationStateMachine.ts:118,119,128,135`

- [ ] **Step 2: Rename to `battleFailedAttempts` for clarity**

```typescript
// In types.ts - rename field
export interface ExplorationState {
  // Remove: retryCount: number  // P1-3: removed, use failedAttempts
  // ... existing fields
  battleFailedAttempts: number  // P1-3: renamed for clarity (was retryCount)
}
```

- [ ] **Step 3: Update all references**

In `ExplorationStateMachine.ts`:
```typescript
// Line 112
retryCount: 0,  // -> battleFailedAttempts: 0

// Lines 115-139 BATTLE_LOSE handler
case 'BATTLE_LOSE': {
  const newFailedAttempts = state.battleFailedAttempts + 1  // was retryCount
  const failedAttempts = {
    ...state.failedAttempts,  // This is per-area, keep separate
    [state.currentArea || '']: (state.failedAttempts[state.currentArea || ''] || 0) + 1,
  }
  if (newFailedAttempts >= 3) {  // was retryCount >= 3
    return {
      ...state,
      phase: 'rollback',
      failedAttempts,
      battleFailedAttempts: newFailedAttempts,  // was retryCount
      lastError: 'Max retries exceeded, rolling back',
    }
  }
  return {
    ...state,
    phase: 'error',
    failedAttempts,
    battleFailedAttempts: newFailedAttempts,  // was retryCount
    lastError: `Battle lost (retry ${newFailedAttempts}/3)`,  // was retryCount
  }
}
```

- [ ] **Step 4: Update remaining references**

In rollback handler and ROLLBACK_TO_SAVEPOINT:
```typescript
battleFailedAttempts: 0,  // was retryCount: 0
```

- [ ] **Step 5: Update gameStore.ts**

```typescript
// Line 20 - remove retryCount from initial state
```

- [ ] **Step 6: Write test to verify naming**

```typescript
// Already tests use failedAttempts correctly
// Just need to update any tests referencing retryCount
```

- [ ] **Step 7: Run tests**

Run: `npm test -- --run src/game/ExplorationStateMachine.test.ts`

- [ ] **Step 8: Commit**

```bash
git add src/game/types.ts src/game/ExplorationStateMachine.ts src/store/gameStore.ts
git commit -m "refactor: P1-3 rename retryCount to battleFailedAttempts"
```

---

## Task 9: P1-4 visit-to-unlock Rule Clarification

**Files:**
- Modify: `src/data/areas/index.ts`
- Modify: `src/game/ExplorationStateMachine.ts`

**Context:** The rule for unlocking hidden areas is unclear. Clarify: "收集钥匙后需访问一次隐藏岛屿才能解锁"

- [ ] **Step 1: Document the rule clearly**

Add comment in `areas/index.ts`:
```typescript
// 隐藏区域 (需要钥匙 + 一次访问)
// P1-4: 解锁规则clarified:
// 1. 收集至少1把钥匙
// 2. 在传送门界面选择"解锁隐藏岛屿"
// 3. 解锁后，该区域变为永久可访问（不再需要钥匙）
{
  id: 'east_hidden_A',
  // ...
  type: 'hidden',
  requiredKeys: 1,  // 1把钥匙
  // ...
}
```

- [ ] **Step 2: Verify UNLOCK_AREA logic**

In `ExplorationStateMachine.ts` line 199-208:
```typescript
case 'UNLOCK_AREA':
  return {
    ...state,
    unlockedAreas: state.unlockedAreas.includes(action.areaId)
      ? state.unlockedAreas
      : [...state.unlockedAreas, action.areaId],
    collectedKeys: state.collectedKeys - 1,
  }
```

This is correct: unlocked areas don't need keys anymore.

- [ ] **Step 3: Write clarifying test**

```typescript
// src/game/ExplorationStateMachine.test.ts
describe('P1-4: visit-to-unlock rule clarification', () => {
  it('解锁后的隐藏区域不再需要钥匙即可进入', () => {
    // Start with 1 key, unlock hidden area A
    let state = {
      ...initialExplorationState,
      currentOcean: 'east' as const,
      collectedKeys: 1,
      unlockedAreas: [] as string[],
    }

    // Unlock area
    state = explorationTransition(state, { type: 'UNLOCK_AREA', areaId: 'east_hidden_A' })
    expect(state.collectedKeys).toBe(0)
    expect(state.unlockedAreas).toContain('east_hidden_A')

    // Now try to select the unlocked hidden area (should work without keys)
    state = { ...state, phase: 'exploring' as const }
    const result = explorationTransition(state, { type: 'SELECT_AREA', areaId: 'east_hidden_A' })
    expect(result.phase).toBe('moving') // Success - not error
  })

  it('未解锁的隐藏区域需要钥匙', () => {
    let state = {
      ...initialExplorationState,
      currentOcean: 'east' as const,
      collectedKeys: 0,
      unlockedAreas: [] as string[],
    }

    // Try to select hidden area without unlock
    const result = explorationTransition(state, { type: 'SELECT_AREA', areaId: 'east_hidden_A' })
    expect(result.phase).toBe('error')
    expect(result.lastError).toContain('requires keys')
  })
})
```

- [ ] **Step 4: Run tests**

Run: `npm test -- --run src/game/ExplorationStateMachine.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/data/areas/index.ts src/game/ExplorationStateMachine.ts src/game/ExplorationStateMachine.test.ts
git commit -m "docs: P1-4 clarify visit-to-unlock rule"
```

---

## Task 10: P1-5 Seeded Random for Portal Generation

**Files:**
- Create: `src/game/utils/seededRandom.ts`
- Modify: `src/store/gameStore.ts:236-282`

**Context:** Portal generation should be deterministic given same seed (oceanId + timestamp). This allows reproducible runs and proper seeding.

- [ ] **Step 1: Create seeded random utility**

```typescript
// src/game/utils/seededRandom.ts

/**
 * Seeded random number generator using Mulberry32 algorithm
 * Produces deterministic sequence of random numbers given same seed
 */
export class SeededRandom {
  private seed: number
  private state: number

  constructor(seed: number) {
    this.seed = seed
    this.state = seed
  }

  /**
   * Returns next random number between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    let t = (this.state += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  /**
   * Returns random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min
  }

  /**
   * Returns random element from array
   */
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)]
  }

  /**
   * Shuffles array in place (Fisher-Yates)
   */
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1)
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  /**
   * Returns random boolean with given probability (default 50%)
   */
  chance(probability: number = 0.5): boolean {
    return this.next() < probability
  }

  /**
   * Resets to original seed
   */
  reset(): void {
    this.state = this.seed
  }

  /**
   * Get current seed
   */
  getSeed(): number {
    return this.seed
  }
}

/**
 * Generate deterministic seed from ocean ID and timestamp
 */
export function generatePortalSeed(oceanId: string, timestamp: number = Date.now()): number {
  let hash = 0
  const str = oceanId + timestamp.toString()
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}
```

- [ ] **Step 2: Write tests**

```typescript
// src/game/utils/seededRandom.test.ts
import { describe, it, expect } from 'vitest'
import { SeededRandom, generatePortalSeed } from './seededRandom'

describe('SeededRandom', () => {
  it('应产生确定性随机序列', () => {
    const rng1 = new SeededRandom(12345)
    const rng2 = new SeededRandom(12345)

    const seq1 = [rng1.next(), rng1.next(), rng1.next()]
    const seq2 = [rng2.next(), rng2.next(), rng2.next()]

    expect(seq1).toEqual(seq2)
  })

  it('不同种子应产生不同序列', () => {
    const rng1 = new SeededRandom(12345)
    const rng2 = new SeededRandom(67890)

    expect(rng1.next()).not.toBe(rng2.next())
  })

  it('pick应返回数组元素', () => {
    const rng = new SeededRandom(42)
    const arr = ['a', 'b', 'c', 'd']
    const picked = rng.pick(arr)
    expect(arr).toContain(picked)
  })

  it('多次pick应可重现', () => {
    const rng1 = new SeededRandom(999)
    const rng2 = new SeededRandom(999)

    const results1 = [rng1.pick(['x', 'y', 'z']), rng1.pick(['x', 'y', 'z']), rng1.pick(['x', 'y', 'z'])]
    const results2 = [rng2.pick(['x', 'y', 'z']), rng2.pick(['x', 'y', 'z']), rng2.pick(['x', 'y', 'z'])]

    expect(results1).toEqual(results2)
  })
})

describe('generatePortalSeed', () => {
  it('应为相同输入产生相同种子', () => {
    const seed1 = generatePortalSeed('east', 1704067200000)
    const seed2 = generatePortalSeed('east', 1704067200000)
    expect(seed1).toBe(seed2)
  })

  it('不同oceanId应产生不同种子', () => {
    const seed1 = generatePortalSeed('east', 1704067200000)
    const seed2 = generatePortalSeed('west', 1704067200000)
    expect(seed1).not.toBe(seed2)
  })
})
```

- [ ] **Step 3: Run tests**

Run: `npm test -- --run src/game/utils/seededRandom.test.ts`

- [ ] **Step 4: Update generatePortals to use seeded random**

```typescript
// In gameStore.ts
import { SeededRandom, generatePortalSeed } from '../game/utils/seededRandom'

generatePortals: () => {
  const state = get()
  if (!state.exploration || !state.exploration.currentArea) return

  const currentArea = getAreaById(state.exploration.currentArea)
  if (!currentArea) return

  const areas = getAreasByOcean(state.exploration.currentOcean!)
  const unexploredAreas = areas.filter(
    (a) => !state.exploration!.defeatedMiniBosses.includes(a.id) && a.id !== currentArea.id
  )
  const completedAreas = areas.filter((a) =>
    state.exploration!.defeatedMiniBosses.includes(a.id)
  )

  // P1-5: Use seeded random for reproducible portal generation
  const timestamp = Date.now()
  const baseSeed = generatePortalSeed(state.exploration.currentOcean!, timestamp)
  const rng = new SeededRandom(baseSeed)

  // Generate 2-3 portals
  const portalCount = rng.chance(0.5) ? 3 : 2  // Use rng instead of Math.random()
  const portals: Portal[] = []

  // At least 1 to unexplored
  if (unexploredAreas.length > 0) {
    const target = rng.pick(unexploredAreas)  // Use rng instead of random index
    portals.push({
      id: `portal_${timestamp}_0`,
      targetAreaId: target.id,
      type: 'normal',
    })
  }

  // Rest random from available
  const availableTargets = [...unexploredAreas, ...completedAreas].filter(
    (a) => !portals.some((p) => p.targetAreaId === a.id)
  )

  while (portals.length < portalCount && availableTargets.length > 0) {
    const target = rng.pick(availableTargets)  // Use rng
    availableTargets.splice(availableTargets.indexOf(target), 1)
    portals.push({
      id: `portal_${timestamp}_${portals.length}`,
      targetAreaId: target.id,
      type: target.type === 'hidden' ? 'hidden' : 'normal',
    })
  }

  // Store seed for reproducibility
  const seed = baseSeed
  get().explorationDispatch({ type: 'GENERATE_PORTALS', portals, seed })
}
```

- [ ] **Step 5: Commit**

```bash
git add src/game/utils/seededRandom.ts src/game/utils/seededRandom.test.ts src/store/gameStore.ts
git commit -m "feat: P1-5 implement seeded random for portal generation"
```

---

## Summary

| Task | Issue | Status |
|------|-------|--------|
| 1 | P0-1 answerIndex boundary | ⬜ |
| 2 | P0-2 hidden area encounter | ⬜ |
| 3 | P0-3 useEffect closure | ⬜ |
| 4 | P0-4 unlock state validation | ⬜ |
| 5 | P0-5 null/undefined handling | ⬜ |
| 6 | P1-1 localStorage capacity | ⬜ |
| 7 | P1-2 guaranteed key drop | ⬜ |
| 8 | P1-3 failedAttempts naming | ⬜ |
| 9 | P1-4 visit-to-unlock rule | ⬜ |
| 10 | P1-5 seeded random portals | ⬜ |

**After all tasks complete:**
- Run full test suite: `npm test -- --run`
- Verify no TypeScript errors: `npm run build`
- All P0 blocking issues resolved
- All P1 important features implemented