# 双人回合制战斗系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现支持单人/双人模式的回合制战斗系统，玩家轮流答题，共用队伍HP，题目根据当前玩家年级从对应题库选取。

**Architecture:**
- 扩展 `BattleState` 增加 `players[]`、`currentPlayerIndex`、`teamHP` 字段
- 新增 `BattlePlayer` 类型区分战斗中的玩家信息
- 通过 `players.length >= 2` 判断单人/双人模式
- 题目选择按当前玩家年级选题，难度使用ocean难度

**Tech Stack:** TypeScript, Zustand, React

---

## 一、文件结构

| 文件 | 修改类型 | 职责 |
|------|----------|------|
| `src/game/types.ts` | 修改 | 新增`BattlePlayer`类型，扩展`BattleState` |
| `src/utils/gameHelpers.ts` | 新建 | 单人/双人模式判断和辅助函数 |
| `src/game/QuestionSelector.ts` | 修改 | 新增`getQuestionForBattle`函数 |
| `src/store/gameStore.ts` | 修改 | 战斗流程逻辑（START_BATTLE、ANSWER_QUESTION、NEXT_QUESTION） |
| `src/components/game/Battle/BattleScreen.tsx` | 修改 | 战斗界面UI |
| `src/components/game/Battle/TeamHPBar.tsx` | 新建 | 队伍HP条组件 |
| `src/components/game/Battle/PlayerStatus.tsx` | 新建 | 玩家状态栏组件 |
| `src/components/game/Battle/CurrentTurnIndicator.tsx` | 新建 | 当前回合指示器组件 |

---

## 二、任务分解

### Task 1: 类型定义扩展

**Files:**
- Modify: `src/game/types.ts:1-95`

- [ ] **Step 1: 在 types.ts 中新增 BattlePlayer 类型**

在 `Player` 类型之后添加：

```typescript
// 战斗中的玩家（独立于GameState.players）
export interface BattlePlayer {
  id: string
  name: string
  grade: number  // 年级 (1-9)
  avatar?: string
}
```

- [ ] **Step 2: 扩展 BattleState 接口**

修改 `BattleState` 接口：

```typescript
// 战斗状态
export interface BattleState {
  phase: BattlePhase
  player: Player  // 当前玩家（保持兼容）
  monster: Monster
  currentQuestion: Question | null
  comboCount: number
  isPlayerTurn: boolean
  battleLog: BattleLogEntry[]
  activeSkills: ActiveSkill[]

  // === 新增字段 ===
  players: BattlePlayer[]        // 参战玩家列表 [玩家1] 或 [玩家1, 玩家2]
  currentPlayerIndex: number    // 当前应答题的玩家索引：0=玩家1, 1=玩家2
  teamHP: number               // 队伍共享HP
  maxTeamHP: number            // 最大HP
}
```

- [ ] **Step 3: 扩展 GameAction 类型**

修改 `START_BATTLE` action 支持传入多个玩家：

```typescript
| { type: 'START_BATTLE'; monster: Monster; question: Question; players: BattlePlayer[]; explorationContext?: { areaId: string; monsterId: string } }
```

- [ ] **Step 4: Commit**

```bash
git add src/game/types.ts
git commit -m "feat: add BattlePlayer type and extend BattleState for multiplayer battle"
```

---

### Task 2: 辅助函数

**Files:**
- Create: `src/utils/gameHelpers.ts`

- [ ] **Step 1: 创建 gameHelpers.ts**

```typescript
import type { BattlePlayer, BattleState } from '../game/types'

/**
 * 判断是否为多人模式
 */
export function isMultiplayer(players: BattlePlayer[]): boolean {
  return players.length >= 2
}

/**
 * 获取当前玩家
 */
export function getCurrentPlayer(players: BattlePlayer[], index: number): BattlePlayer {
  return players[index] ?? players[0]
}

/**
 * 切换到下一个玩家
 * 单人模式：返回 0
 * 双人模式：在 0 和 1 之间切换
 */
export function getNextPlayerIndex(players: BattlePlayer[], currentIndex: number): number {
  if (players.length < 2) {
    return 0
  }
  return 1 - currentIndex
}

/**
 * 获取当前玩家名称
 */
export function getCurrentPlayerName(battle: BattleState): string {
  if (isMultiplayer(battle.players)) {
    return battle.players[battle.currentPlayerIndex]?.name ?? '玩家'
  }
  return battle.player?.name ?? '玩家'
}
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/gameHelpers.ts
git commit -m "feat: add gameHelpers for multiplayer battle utilities"
```

---

### Task 3: 题目选择逻辑

**Files:**
- Modify: `src/game/QuestionSelector.ts`

- [ ] **Step 1: 添加 getQuestionForBattle 函数**

在文件末尾添加：

```typescript
import type { BattlePlayer, BattleState } from './types'
import { isMultiplayer } from '../utils/gameHelpers'

interface BattleQuestionOptions {
  oceanId: string
  battle: BattleState
  subject: string
  selectedGrade: number
}

/**
 * 根据当前战斗状态获取题目
 * - 单人模式：使用 selectedGrade 选题
 * - 双人模式：使用当前玩家年级选题
 * - 难度：始终使用 ocean 难度
 */
export function getQuestionForBattle(
  options: BattleQuestionOptions
): Question | null {
  const { oceanId, battle, subject, selectedGrade } = options
  const { players, currentPlayerIndex } = battle

  // 确定使用哪个年级选题
  let questionGrade: number
  if (isMultiplayer(players)) {
    questionGrade = players[currentPlayerIndex]?.grade ?? selectedGrade
  } else {
    questionGrade = selectedGrade
  }

  // 获取海域难度
  const ocean = Object.values(oceansData).find(o => o.id === oceanId)
  const difficulty = ocean?.difficulty ?? 1

  return getRandomQuestion({
    oceanId,
    grade: questionGrade,
    subject: subject as 'math' | 'chinese' | 'english',
    difficulty,
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add src/game/QuestionSelector.ts
git commit -m "feat: add getQuestionForBattle for multiplayer question selection"
```

---

### Task 4: 战斗流程逻辑

**Files:**
- Modify: `src/store/gameStore.ts:1-265`

- [ ] **Step 1: 修改 START_BATTLE action**

```typescript
case 'START_BATTLE':
  const battlePlayers = action.players  // [玩家1] 或 [玩家1, 玩家2]

  return {
    ...state,
    gamePhase: 'battle',
    battle: {
      phase: 'showing_question' as BattlePhase,
      player: { ...state.players[0], hp: 100, maxHp: 100, comboCount: 0 },  // 兼容
      players: battlePlayers,              // 新增
      currentPlayerIndex: 0,                // 玩家1先答
      teamHP: 100,                         // 新增：队伍共享HP
      maxTeamHP: 100,                     // 新增
      monster: action.monster,
      currentQuestion: action.question,
      comboCount: 0,
      isPlayerTurn: true,
      battleLog: [],
      activeSkills: [],
    },
    explorationBattle: action.explorationContext ?? null,
  }
```

- [ ] **Step 2: 修改 ANSWER_QUESTION action（单人/双人兼容）**

原 ANSWER_QUESTION 逻辑中：
- 答对：monsterHP -= 20（保持不变）
- 答错：改为扣 teamHP 而不是 playerHP

```typescript
case 'ANSWER_QUESTION': {
  if (!state.battle) return state
  if (!state.battle.currentQuestion) return state
  if (!state.battle.currentQuestion.options) return state

  const question = state.battle.currentQuestion
  const validAnswerCount = question.options.length
  if (validAnswerCount === 0) return state

  const answerIndex = Math.min(Math.max(0, action.answerIndex), validAnswerCount - 1)
  const isCorrect = question.options[answerIndex]?.isCorrect ?? false

  // 获取当前玩家名称
  const currentPlayerName = state.battle.players.length >= 2
    ? state.battle.players[state.battle.currentPlayerIndex]?.name ?? '玩家'
    : state.battle.player?.name ?? '玩家'

  const newBattleLog = [
    ...state.battle.battleLog,
    {
      type: (isCorrect ? 'correct' : 'wrong') as 'correct' | 'wrong',
      message: isCorrect
        ? `${currentPlayerName} 回答正确！`
        : `${currentPlayerName} 回答错误！`,
      timestamp: Date.now(),
    },
  ]

  if (isCorrect) {
    const newMonsterHp = Math.max(0, state.battle.monster.hp - 20)
    const isVictory = newMonsterHp === 0
    return {
      ...state,
      battle: {
        ...state.battle,
        monster: { ...state.battle.monster, hp: newMonsterHp },
        comboCount: state.battle.comboCount + 1,
        battleLog: newBattleLog,
        phase: isVictory ? 'victory' : 'animating_damage',
      },
    }
  } else {
    // 答错：扣队伍HP（单人/双人通用）
    const newTeamHP = Math.max(0, state.battle.teamHP - 10)
    const isDefeat = newTeamHP === 0
    return {
      ...state,
      battle: {
        ...state.battle,
        teamHP: newTeamHP,
        comboCount: 0,
        battleLog: newBattleLog,
        phase: isDefeat ? 'defeat' : 'animating_damage',
      },
    }
  }
}
```

- [ ] **Step 3: 修改 NEXT_QUESTION action（核心切换逻辑）**

```typescript
case 'NEXT_QUESTION': {
  if (!state.battle || !state.currentOcean) return state

  const { players, currentPlayerIndex } = state.battle

  // 计算下一个玩家索引
  const nextPlayerIndex = players.length >= 2
    ? 1 - currentPlayerIndex
    : 0

  const nextPlayer = players[nextPlayerIndex]

  // 确定科目
  let subject = state.selectedSubject
  if (state.exploration?.currentArea) {
    const area = getAreaById(state.exploration.currentArea)
    if (area && area.knowledgeArea !== 'comprehensive') {
      subject = area.knowledgeArea as 'math' | 'chinese' | 'english'
    }
  }

  // 选题（按下一个玩家的年级）
  const question = getQuestionForBattle({
    oceanId: state.currentOcean,
    battle: { ...state.battle, currentPlayerIndex: nextPlayerIndex },
    subject,
    selectedGrade: state.selectedGrade,
  })

  if (!question) return state

  return {
    ...state,
    battle: {
      ...state.battle,
      currentPlayerIndex: nextPlayerIndex,
      player: nextPlayer ? { ...state.battle.player, ...nextPlayer } : state.battle.player,
      currentQuestion: question,
      phase: 'showing_question',
    },
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/store/gameStore.ts
git commit -m "feat: implement multiplayer battle flow in gameStore"
```

---

### Task 5: UI组件 - 队伍HP条

**Files:**
- Create: `src/components/game/Battle/TeamHPBar.tsx`

- [ ] **Step 1: 创建 TeamHPBar 组件**

```tsx
import React from 'react'
import { useGameStore } from '../../store/gameStore'

interface TeamHPBarProps {
  current: number
  max: number
}

export function TeamHPBar({ current, max }: TeamHPBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))
  const isLow = percentage < 30

  return (
    <div className="team-hp-bar">
      <div className="team-hp-label">
        <span className="label-text">队伍 HP</span>
        <span className="hp-value">{current} / {max}</span>
      </div>
      <div className="hp-bar-container">
        <div
          className={`hp-bar-fill ${isLow ? 'low' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 添加样式（在 BattleScreen.module.css 中）**

```css
.team-hp-bar {
  width: 100%;
  padding: 8px 16px;
}

.team-hp-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 14px;
}

.hp-bar-container {
  width: 100%;
  height: 12px;
  background: #333;
  border-radius: 6px;
  overflow: hidden;
}

.hp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  transition: width 0.3s ease;
}

.hp-bar-fill.low {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/game/Battle/TeamHPBar.tsx
git commit -m "feat: add TeamHPBar component"
```

---

### Task 6: UI组件 - 玩家状态栏

**Files:**
- Create: `src/components/game/Battle/PlayerStatus.tsx`

- [ ] **Step 1: 创建 PlayerStatus 组件**

```tsx
import React from 'react'
import type { BattlePlayer } from '../../game/types'

interface PlayerStatusProps {
  players: BattlePlayer[]
  currentIndex: number
}

export function PlayerStatus({ players, currentIndex }: PlayerStatusProps) {
  return (
    <div className="player-status-bar">
      {players.map((player, idx) => (
        <div
          key={player.id}
          className={`player-status-item ${idx === currentIndex ? 'active' : ''}`}
        >
          <div className="player-avatar">
            {player.avatar ? (
              <img src={player.avatar} alt={player.name} />
            ) : (
              <div className="avatar-placeholder">{player.name[0]}</div>
            )}
          </div>
          <div className="player-info">
            <span className="player-name">{player.name}</span>
            <span className="player-grade">G{player.grade}</span>
          </div>
          {idx === currentIndex && (
            <div className="current-turn-badge">答题中</div>
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: 添加样式**

```css
.player-status-bar {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 12px;
}

.player-status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.player-status-item.active {
  opacity: 1;
  background: rgba(59, 130, 246, 0.3);
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
}

.player-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  font-weight: bold;
}

.current-turn-badge {
  padding: 2px 8px;
  border-radius: 4px;
  background: #22c55e;
  font-size: 12px;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/game/Battle/PlayerStatus.tsx
git commit -m "feat: add PlayerStatus component"
```

---

### Task 7: UI组件 - 当前回合指示器

**Files:**
- Create: `src/components/game/Battle/CurrentTurnIndicator.tsx`

- [ ] **Step 1: 创建 CurrentTurnIndicator 组件**

```tsx
import React from 'react'
import type { BattlePlayer } from '../../game/types'

interface CurrentTurnIndicatorProps {
  player: BattlePlayer
  playerIndex: number
}

export function CurrentTurnIndicator({ player, playerIndex }: CurrentTurnIndicatorProps) {
  return (
    <div className={`current-turn-indicator player-${playerIndex}`}>
      <div className="turn-content">
        <span className="turn-label">轮到</span>
        <span className="player-name">{player.name}</span>
        <span className="turn-label">答题</span>
      </div>
      <div className="grade-badge">G{player.grade}</div>
    </div>
  )
}
```

- [ ] **Step 2: 添加样式**

```css
.current-turn-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
  border: 2px solid #3b82f6;
  border-radius: 24px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
}

.turn-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.turn-label {
  color: #94a3b8;
  font-weight: normal;
}

.grade-badge {
  padding: 2px 8px;
  background: #3b82f6;
  border-radius: 4px;
  font-size: 12px;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/game/Battle/CurrentTurnIndicator.tsx
git commit -m "feat: add CurrentTurnIndicator component"
```

---

### Task 8: 集成到 BattleScreen

**Files:**
- Modify: `src/components/game/Battle/BattleScreen.tsx`

- [ ] **Step 1: 修改 BattleScreen 集成新组件**

```tsx
import React from 'react'
import { useGameStore } from '../../store/gameStore'
import { isMultiplayer } from '../../utils/gameHelpers'
import { TeamHPBar } from './TeamHPBar'
import { PlayerStatus } from './PlayerStatus'
import { CurrentTurnIndicator } from './CurrentTurnIndicator'

export function BattleScreen() {
  const battle = useGameStore(s => s.battle)
  const players = battle?.players ?? []
  const multi = isMultiplayer(players)
  const currentPlayer = players[battle?.currentPlayerIndex ?? 0]

  if (!battle) return null

  return (
    <div className="battle-screen">
      {/* 怪物信息 */}
      <MonsterPanel monster={battle.monster} />

      {/* 队伍HP（单人/双人都显示） */}
      <TeamHPBar current={battle.teamHP} max={battle.maxTeamHP} />

      {/* 双人模式：当前回合指示器 */}
      {multi && currentPlayer && (
        <CurrentTurnIndicator
          player={currentPlayer}
          playerIndex={battle.currentPlayerIndex}
        />
      )}

      {/* 双人模式：双方玩家状态 */}
      {multi && (
        <PlayerStatus
          players={players}
          currentIndex={battle.currentPlayerIndex}
        />
      )}

      {/* 题目卡片 */}
      <QuestionCard question={battle.currentQuestion} />

      {/* 答案选项 */}
      <AnswerOptions onAnswer={handleAnswer} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/game/Battle/BattleScreen.tsx
git commit -m "feat: integrate multiplayer components into BattleScreen"
```

---

### Task 9: 向后兼容性

**Files:**
- Modify: `src/store/gameStore.ts` (START_BATTLE)

- [ ] **Step 1: 确保单人模式兼容**

START_BATTLE 需要处理旧版调用（没有 players 参数）：

```typescript
case 'START_BATTLE':
  // 兼容旧版：players 参数可能不存在
  const battlePlayers = action.players ?? [
    { id: 'player1', name: state.players[0]?.name ?? '玩家', grade: state.selectedGrade }
  ]

  return {
    ...state,
    gamePhase: 'battle',
    battle: {
      phase: 'showing_question' as BattlePhase,
      player: state.players[0],
      players: battlePlayers,
      currentPlayerIndex: 0,
      teamHP: 100,
      maxTeamHP: 100,
      monster: action.monster,
      currentQuestion: action.question,
      comboCount: 0,
      isPlayerTurn: true,
      battleLog: [],
      activeSkills: [],
    },
    explorationBattle: action.explorationContext ?? null,
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/store/gameStore.ts
git commit -m "fix: ensure backward compatibility for single-player mode"
```

---

## 三、执行顺序

1. Task 1: 类型定义扩展
2. Task 2: 辅助函数
3. Task 3: 题目选择逻辑
4. Task 4: 战斗流程逻辑
5. Task 5: TeamHPBar 组件
6. Task 6: PlayerStatus 组件
7. Task 7: CurrentTurnIndicator 组件
8. Task 8: 集成到 BattleScreen
9. Task 9: 向后兼容性

---

## 四、测试验证

每个任务完成后验证：
1. 单人模式游戏能正常进行
2. 双人模式游戏能正常进行
3. 题目按正确年级选取
4. 队伍HP正确显示和扣减
5. 玩家轮流正确切换
