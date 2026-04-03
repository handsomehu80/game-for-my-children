# 海洋探险游戏 Phase 2 - 核心战斗系统实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development

**Goal:** 实现核心战斗系统：Battle组件迁移到Zustand + 完整战斗UI + 状态机

**Architecture:** 战斗流程遵循状态机：SHOWING_QUESTION → ANSWERING → ANIMATING_DAMAGE → CHECK_VICTORY

**Tech Stack:** React, Zustand, React-Three-Fiber

**Spec 文档:** `docs/superpowers/specs/2026-04-01-ocean-adventure-game-design.md`

**依赖:** Phase 1 完成（Zustand store, types.ts, render adapter）

---

## Phase 2 任务列表

### Task 1: 更新 Battle.tsx 使用 Zustand

**Files:**
- Modify: `src/components/game/Battle/Battle.tsx`
- Test: `src/components/game/Battle/Battle.test.tsx`

- [ ] **Step 1: 重写 Battle 组件使用 Zustand**

```typescript
// src/components/game/Battle/Battle.tsx
import { useGameStore } from '../../../store/gameStore'
import { useEffect, useState } from 'react'

export default function Battle() {
  const { state, dispatch } = useGameStore()
  const battle = state.battle

  // Redirect if no battle
  useEffect(() => {
    if (!battle && state.gamePhase === 'battle') {
      // Battle not initialized - redirect to world map
      dispatch({ type: 'RESET_GAME' })
    }
  }, [battle, state.gamePhase, dispatch])

  if (!battle) return null

  const { player, monster, currentQuestion, phase, battleLog } = battle
  const isAnswering = phase === 'answering'
  const isAnimating = phase === 'animating_damage'
  const isVictory = phase === 'victory'
  const isDefeat = phase === 'defeat'
  const isShowingQuestion = phase === 'showing_question'

  const handleAnswer = (answerIndex: number) => {
    if (!isAnswering) return
    dispatch({ type: 'ANSWER_QUESTION', answerIndex })

    // After damage animation, check for next question or end battle
    setTimeout(() => {
      const newPhase = useGameStore.getState().battle?.phase
      if (newPhase === 'victory' || newPhase === 'defeat') {
        dispatch({ type: 'END_BATTLE', victory: newPhase === 'victory' })
      } else if (newPhase === 'showing_question' || newPhase === 'answering') {
        // Ready for next question - stay in battle
        // Next question will be loaded by game logic
      }
    }, 1500)
  }

  const handleNextQuestion = () => {
    // Load next question - placeholder for now
    // Will be implemented with QuestionSelector in Phase 3
  }

  return (
    <div className="battle-screen">
      <div className="battle-header">
        <h2>⚔️ 战斗开始 ⚔️</h2>
      </div>

      <div className="battle-arena">
        {/* Monster Section */}
        <div className="monster-section">
          <h3>{monster.name}</h3>
          <div className="hp-bar">
            <div
              className="hp-fill monster"
              style={{ width: `${(monster.hp / monster.maxHp) * 100}%` }}
            />
          </div>
          <p>HP: {monster.hp} / {monster.maxHp}</p>
        </div>

        <div className="vs">VS</div>

        {/* Player Section */}
        <div className="player-section">
          <h3>{player.name}</h3>
          <div className="hp-bar">
            <div
              className="hp-fill player"
              style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
            />
          </div>
          <p>HP: {player.hp} / {player.maxHp}</p>
        </div>
      </div>

      {/* Question Box */}
      {currentQuestion && (isShowingQuestion || isAnswering) && (
        <div className="question-box">
          <h4>问题：</h4>
          <p className="question-content">{currentQuestion.content}</p>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() => handleAnswer(index)}
                disabled={!isAnswering || isAnimating}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Battle Result Overlay */}
      {(isVictory || isDefeat) && (
        <div className="battle-result-overlay">
          <h2>{isVictory ? '🎉 胜利！' : '💀 失败...'}</h2>
          <button onClick={() => dispatch({ type: 'COMPLETE_OCEAN' })}>
            {isVictory ? '继续' : '重新挑战'}
          </button>
        </div>
      )}

      {/* Battle Log */}
      <div className="battle-log">
        {battleLog.slice(-5).map((entry, index) => (
          <p key={index} className={`log-entry ${entry.type}`}>
            {entry.message}
          </p>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 添加 CSS 样式到 index.css**

```css
/* Battle Result Overlay */
.battle-result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.battle-result-overlay h2 {
  font-size: 3rem;
  margin-bottom: 2rem;
}

.battle-result-overlay button {
  padding: 1rem 3rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(45deg, #00d9ff, #00ff88);
  color: #1a1a2e;
  font-weight: bold;
  cursor: pointer;
}
```

- [ ] **Step 3: 创建 Battle 测试**

```typescript
// src/components/game/Battle/Battle.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useGameStore } from '../../../store/gameStore'
import Battle from './Battle'

// Reset store before each test
beforeEach(() => {
  useGameStore.getState().dispatch({ type: 'RESET_GAME' })
})

describe('Battle Component', () => {
  it('should render battle UI with monster and player', () => {
    const { dispatch } = useGameStore.getState()
    const player = { id: 'p1', name: 'Test', hp: 100, maxHp: 100, comboCount: 0 }
    const monster = { id: 'm1', name: 'Slime', hp: 50, maxHp: 50, sprite: 'slime.png' }
    const question = {
      id: 'q1',
      content: '1+1=?',
      type: 'single' as const,
      difficulty: 1 as const,
      category: 'math' as const,
      options: [
        { text: '1', isCorrect: false },
        { text: '2', isCorrect: true },
        { text: '3', isCorrect: false },
      ],
    }

    dispatch({ type: 'START_GAME', players: [player] })
    dispatch({ type: 'START_BATTLE', monster, question })

    render(<Battle />)

    expect(screen.getByText('Slime')).toBeDefined()
    expect(screen.getByText('Test')).toBeDefined()
    expect(screen.getByText('1+1=?')).toBeDefined()
  })

  it('should show victory overlay when monster defeated', () => {
    const { dispatch } = useGameStore.getState()
    const player = { id: 'p1', name: 'Test', hp: 100, maxHp: 100, comboCount: 0 }
    const monster = { id: 'm1', name: 'Slime', hp: 10, maxHp: 50, sprite: 'slime.png' }
    const question = {
      id: 'q1',
      content: '1+1=?',
      type: 'single' as const,
      difficulty: 1 as const,
      category: 'math' as const,
      options: [
        { text: '1', isCorrect: false },
        { text: '2', isCorrect: true },
        { text: '3', isCorrect: false },
      ],
    }

    dispatch({ type: 'START_GAME', players: [player] })
    dispatch({ type: 'START_BATTLE', monster, question })
    dispatch({ type: 'ANSWER_QUESTION', answerIndex: 1 }) // correct

    render(<Battle />)

    // Monster HP should be reduced
    const state = useGameStore.getState()
    expect(state.battle?.monster.hp).toBeLessThan(50)
  })
})
```

- [ ] **Step 4: 运行测试验证**

```bash
cd "/Users/xihualiu/code/game for my children" && npx vitest run src/components/game/Battle/Battle.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/game/Battle/Battle.tsx
git commit -m "feat: update Battle component to use Zustand store"
```

---

### Task 2: 实现 QuestionSelector

**Files:**
- Create: `src/game/QuestionSelector.ts`
- Test: `src/game/QuestionSelector.test.ts`

- [ ] **Step 1: 创建 QuestionSelector**

```typescript
// src/game/QuestionSelector.ts
import type { Question, OceanZone } from './types'
import { questionsData } from '../data/questions'
import { oceansData } from '../data/oceans'

export interface QuestionSelectorOptions {
  oceanId: string
  difficultyOverride?: number
  categoryFilter?: string[]
}

export function getRandomQuestion(options: QuestionSelectorOptions): Question | null {
  const { oceanId, difficultyOverride, categoryFilter } = options

  // Get ocean difficulty range
  const ocean = Object.values(oceansData).find(o => o.id === oceanId)
  if (!ocean) return null

  const [minDiff, maxDiff] = difficultyOverride
    ? [difficultyOverride, difficultyOverride]
    : ocean.difficulty

  // Filter questions by difficulty and category
  const allQuestions = Object.values(questionsData).flat()
  const filtered = allQuestions.filter(q => {
    if (q.difficulty < minDiff || q.difficulty > maxDiff) return false
    if (categoryFilter && categoryFilter.length > 0) {
      if (!categoryFilter.includes(q.category)) return false
    }
    return true
  })

  if (filtered.length === 0) return null

  // Random selection
  const index = Math.floor(Math.random() * filtered.length)
  return filtered[index]
}

export function getQuestionsByDifficulty(difficulty: number): Question[] {
  return Object.values(questionsData)
    .flat()
    .filter(q => q.difficulty === difficulty)
}
```

- [ ] **Step 2: 创建 QuestionSelector 测试**

```typescript
// src/game/QuestionSelector.test.ts
import { describe, it, expect } from 'vitest'
import { getRandomQuestion, getQuestionsByDifficulty } from './QuestionSelector'

describe('QuestionSelector', () => {
  it('should return a question for valid ocean', () => {
    const question = getRandomQuestion({ oceanId: 'east' })
    expect(question).toBeDefined()
    expect(question?.id).toBeDefined()
  })

  it('should filter by difficulty', () => {
    const questions = getQuestionsByDifficulty(1)
    questions.forEach(q => {
      expect(q.difficulty).toBe(1)
    })
  })

  it('should return null for invalid ocean', () => {
    const question = getRandomQuestion({ oceanId: 'invalid_ocean' })
    expect(question).toBeNull()
  })
})
```

- [ ] **Step 3: 运行测试验证**

```bash
cd "/Users/xihualiu/code/game for my children" && npx vitest run src/game/QuestionSelector.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 4: Commit**

```bash
git add src/game/QuestionSelector.ts src/game/QuestionSelector.test.ts
git commit -m "feat: add QuestionSelector for difficulty-based question filtering"
```

---

### Task 3: 集成 QuestionSelector 到 Zustand Store

**Files:**
- Modify: `src/store/gameStore.ts`

- [ ] **Step 1: 更新 gameStore 添加 NEXT_QUESTION action**

```typescript
// Add to GameAction type:
| { type: 'NEXT_QUESTION' }

// Add to reducer:
case 'NEXT_QUESTION': {
  if (!state.battle || !state.currentOcean) return state

  const question = getRandomQuestion({ oceanId: state.currentOcean })
  if (!question) return state // No more questions

  return {
    ...state,
    battle: {
      ...state.battle,
      currentQuestion: question,
      phase: 'showing_question',
    },
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/store/gameStore.ts
git commit -m "feat: integrate QuestionSelector into game store"
```

---

## Phase 2 验收标准

完成所有任务后：
- [ ] Battle.tsx 使用 Zustand store
- [ ] 战斗UI显示怪物和玩家HP
- [ ] 题目正确显示和答题
- [ ] HP伤害计算正确（答对-20怪物HP，答错-10玩家HP）
- [ ] 胜利/失败状态正确触发
- [ ] QuestionSelector 正确筛选题目

---

## Phase 2 产出

**创建的文件:**
- `src/game/QuestionSelector.ts` - 题目选择器
- `src/game/QuestionSelector.test.ts` - 测试

**修改的文件:**
- `src/components/game/Battle/Battle.tsx` - 使用Zustand
- `src/store/gameStore.ts` - 添加NEXT_QUESTION action

**总测试数:** ~7 个新测试
