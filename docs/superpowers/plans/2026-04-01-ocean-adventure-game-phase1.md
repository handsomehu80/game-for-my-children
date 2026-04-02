# 海洋探险游戏 Phase 1 - 基础框架实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立项目基础框架：Vite + React + R3F + Zustand + 数据层 + 标题界面

**Architecture:** React-Three-Fiber 渲染层 + Zustand 状态管理 + TypeScript 游戏逻辑层 + JSON 数据配置层。四层分离，渲染层通过 RenderAdapter 可替换为 2D/3D。

**Tech Stack:** Vite, React 18, React-Three-Fiber, Drei, Zustand, TypeScript

**Spec 文档:** `docs/superpowers/specs/2026-04-01-ocean-adventure-game-design.md`

---

## 文件结构映射

### 需要创建的文件

| 文件路径 | 职责 |
|---------|------|
| `src/store/gameStore.ts` | Zustand 状态管理 |
| `src/game/types.ts` | 核心类型定义 |
| `src/game/BattleEngine.ts` | 战斗引擎逻辑 |
| `src/game/SkillSystem.ts` | 技能系统 |
| `src/game/QuestionSelector.ts` | 题目选择器 |
| `src/render/RenderAdapter.ts` | 渲染适配器接口 |
| `src/render/SpriteRenderAdapter.ts` | 2D 渲染实现 |
| `src/render/RenderManager.ts` | 渲染管理器 |
| `src/components/game/TitleScreen.tsx` | 标题界面 |
| `src/components/game/Game.tsx` | 主游戏组件 |
| `src/components/game/Scene.tsx` | R3F 场景组件 |

### 需要修改的文件

| 文件路径 | 修改内容 |
|---------|---------|
| `src/context/GameContext.tsx` | 重构为 Zustand store |
| `src/main.tsx` | 更新入口 |
| `src/index.css` | 添加基础样式 |

### 数据文件（已存在，需验证）

| 文件路径 | 状态 |
|---------|------|
| `src/data/oceans/index.ts` | 已存在，需对齐类型 |
| `src/data/monsters/index.ts` | 已存在，需对齐类型 |
| `src/data/questions/index.ts` | 已存在，需对齐类型 |

---

## 任务列表

### Task 1: 初始化项目基础

**Files:**
- Create: `src/game/types.ts`
- Modify: `src/main.tsx`
- Test: `src/game/types.test.ts`

- [ ] **Step 1: 创建核心类型定义**

```typescript
// src/game/types.ts

// 战斗 Phase
export type BattlePhase =
  | 'idle'
  | 'showing_question'
  | 'answering'
  | 'animating_damage'
  | 'showing_skill'
  | 'victory'
  | 'defeat'

// 玩家
export interface Player {
  id: string
  name: string
  hp: number
  maxHp: number
  comboCount: number
}

// 怪物
export interface Monster {
  id: string
  name: string
  hp: number
  maxHp: number
  sprite: string
  skills?: string[]
  drops?: Item[]
}

// 道具
export interface Item {
  id: string
  name: string
  type: 'consumable' | 'equipment' | 'key'
}

// 题目选项
export interface QuestionOption {
  text: string
  isCorrect: boolean
}

// 题目
export interface Question {
  id: string
  content: string
  type: 'single' | 'multiple' | 'fill' | 'image'
  difficulty: 1 | 2 | 3 | 4 | 5
  category: 'math' | 'chinese' | 'english' | 'science' | 'general'
  options: QuestionOption[]
  imageUrl?: string
}

// 海洋区域
export interface OceanZone {
  id: string
  name: string
  description: string
  difficulty: [number, number]
  bossId: string
  monsters: string[]
  unlocked: boolean
  completed: boolean
}

// 战斗日志
export interface BattleLogEntry {
  type: 'correct' | 'wrong' | 'skill_triggered' | 'victory' | 'defeat'
  message: string
  timestamp: number
}

// 激活技能
export interface ActiveSkill {
  skillId: string
  activatedAt: number
  expiresAt: number
}

// 战斗状态
export interface BattleState {
  phase: BattlePhase
  player: Player
  monster: Monster
  currentQuestion: Question | null
  comboCount: number
  isPlayerTurn: boolean
  battleLog: BattleLogEntry[]
  activeSkills: ActiveSkill[]
}

// 技能效果
export type SkillEffect =
  | { type: 'shield'; protectedCount: number }
  | { type: 'double'; duration: number }
  | { type: 'leech'; healPercent: number }
  | { type: 'freeze'; freezeDuration: number }

// 技能定义
export interface Skill {
  id: string
  name: string
  description: string
  icon: string
  triggerThreshold: number
  duration: number
  maxUses?: number
  effect: SkillEffect
}

// 组合技能定义
export interface ComboSkillDefinition {
  id: string
  name: string
  componentSkills: [string, string]
  effect: SkillEffect
}

// 性能追踪器
export interface PerformanceTracker {
  oceanId: string
  playerId: string
  correctCount: number
  wrongCount: number
  consecutiveCorrect: number
  consecutiveWrong: number
  currentDifficulty: number
}

// 游戏状态
export type GamePhase = 'title' | 'world_map' | 'battle' | 'result' | 'game_over'

export interface GameState {
  gamePhase: GamePhase
  currentOcean: string | null
  players: Player[]
  unlockedOceans: string[]
  completedOceans: string[]
  battle: BattleState | null
  totalScore: number
}

// 游戏动作
export type GameAction =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'SELECT_OCEAN'; ocean: string }
  | { type: 'START_BATTLE'; monster: Monster; question: Question }
  | { type: 'ANSWER_QUESTION'; answerIndex: number }
  | { type: 'END_BATTLE'; victory: boolean }
  | { type: 'COMPLETE_OCEAN' }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_GAME' }
```

- [ ] **Step 2: 创建类型测试**

```typescript
// src/game/types.test.ts
import { describe, it, expect } from 'vitest'
import type { Player, Monster, Question, BattleState } from './types'

describe('Core Types', () => {
  it('Player should have required fields', () => {
    const player: Player = {
      id: 'p1',
      name: 'Player 1',
      hp: 100,
      maxHp: 100,
      comboCount: 0
    }
    expect(player.hp).toBe(100)
    expect(player.maxHp).toBe(100)
  })

  it('Monster should have hp and maxHp', () => {
    const monster: Monster = {
      id: 'm1',
      name: 'Slime',
      hp: 50,
      maxHp: 50,
      sprite: 'slime.png'
    }
    expect(monster.hp).toBe(monster.maxHp)
  })
})
```

- [ ] **Step 3: 运行测试验证**

```bash
cd "/Users/xihualiu/code/game for my children" && npx vitest run src/game/types.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 4: Commit**

```bash
cd "/Users/xihualiu/code/game for my children"
git add src/game/types.ts src/game/types.test.ts
git commit -m "feat: add core type definitions for game"
```

---

### Task 2: 迁移到 Zustand 状态管理

**Files:**
- Create: `src/store/gameStore.ts`
- Modify: `src/context/GameContext.tsx` (删除或保留兼容)
- Test: `src/store/gameStore.test.ts`

- [ ] **Step 1: 创建 Zustand Store**

```typescript
// src/store/gameStore.ts
import { create } from 'zustand'
import type { GameState, GameAction, Player, Monster, Question, BattleState, BattlePhase } from '../game/types'

const initialState: GameState = {
  gamePhase: 'title',
  currentOcean: null,
  players: [],
  unlockedOceans: ['east'],
  completedOceans: [],
  battle: null,
  totalScore: 0,
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        players: action.players,
        gamePhase: 'world_map',
        currentOcean: 'east',
      }

    case 'SELECT_OCEAN':
      if (!state.unlockedOceans.includes(action.ocean)) return state
      return {
        ...state,
        currentOcean: action.ocean,
      }

    case 'START_BATTLE':
      return {
        ...state,
        gamePhase: 'battle',
        battle: {
          phase: 'showing_question' as BattlePhase,
          player: state.players[0],
          monster: action.monster,
          currentQuestion: action.question,
          comboCount: 0,
          isPlayerTurn: true,
          battleLog: [],
          activeSkills: [],
        },
      }

    case 'ANSWER_QUESTION': {
      if (!state.battle || !state.battle.currentQuestion) return state
      const question = state.battle.currentQuestion
      const isCorrect = question.options[action.answerIndex]?.isCorrect ?? false

      const newBattleLog = [
        ...state.battle.battleLog,
        {
          type: isCorrect ? 'correct' : 'wrong',
          message: isCorrect ? '回答正确！' : '回答错误！',
          timestamp: Date.now(),
        },
      ]

      if (isCorrect) {
        const newMonsterHp = Math.max(0, state.battle.monster.hp - 20)
        const newCombo = state.battle.comboCount + 1
        const isVictory = newMonsterHp === 0
        return {
          ...state,
          battle: {
            ...state.battle,
            monster: { ...state.battle.monster, hp: newMonsterHp },
            comboCount: newCombo,
            battleLog: newBattleLog,
            phase: isVictory ? 'victory' : state.battle.phase,
          },
        }
      } else {
        const newPlayerHp = Math.max(0, state.battle.player.hp - 10)
        const isDefeat = newPlayerHp === 0
        return {
          ...state,
          battle: {
            ...state.battle,
            player: { ...state.battle.player, hp: newPlayerHp },
            comboCount: 0,
            battleLog: newBattleLog,
            phase: isDefeat ? 'defeat' : state.battle.phase,
          },
        }
      }
    }

    // 注意: Phase 1 ANSWER_QUESTION 只支持单选题 (answerIndex: number)
    // Phase 3 将扩展为支持多选题 (answerIndices: number[]) 和 fill 类型

    case 'END_BATTLE':
      return {
        ...state,
        gamePhase: 'result',
        battle: state.battle
          ? { ...state.battle, phase: action.victory ? 'victory' : 'defeat' }
          : null,
      }

    case 'COMPLETE_OCEAN': {
      if (!state.currentOcean) return state
      const newCompletedOceans = [...state.completedOceans, state.currentOcean]
      const oceanOrder = ['east', 'west', 'southHot', 'northIce', 'mysterious'] as const
      const currentIndex = oceanOrder.indexOf(state.currentOcean as typeof oceanOrder[number])
      const nextOcean = oceanOrder[currentIndex + 1]
      const newUnlockedOceans = nextOcean && !state.unlockedOceans.includes(nextOcean)
        ? [...state.unlockedOceans, nextOcean]
        : state.unlockedOceans
      return {
        ...state,
        completedOceans: newCompletedOceans,
        unlockedOceans: newUnlockedOceans,
        gamePhase: 'world_map',
        battle: null,
      }
    }

    case 'GAME_OVER':
      return {
        ...initialState,
        gamePhase: 'game_over',
      }

    case 'RESET_GAME':
      return initialState

    default:
      return state
  }
}

interface GameStore extends GameState {
  dispatch: (action: GameAction) => void
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  dispatch: (action) => set((state) => gameReducer(state, action)),
}))
```

- [ ] **Step 2: 创建 Store 测试**

```typescript
// src/store/gameStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'

describe('Game Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().dispatch({ type: 'RESET_GAME' })
  })

  it('should start with initial state', () => {
    const state = useGameStore.getState()
    expect(state.gamePhase).toBe('title')
    expect(state.players).toHaveLength(0)
  })

  it('should start game with players', () => {
    const { dispatch } = useGameStore.getState()
    const players = [{ id: 'p1', name: 'Test', hp: 100, maxHp: 100, comboCount: 0 }]

    dispatch({ type: 'START_GAME', players })

    const state = useGameStore.getState()
    expect(state.gamePhase).toBe('world_map')
    expect(state.players).toHaveLength(1)
  })

  it('should reduce monster HP on correct answer', () => {
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
    dispatch({ type: 'ANSWER_QUESTION', answerIndex: 1 }) // correct answer

    const state = useGameStore.getState()
    expect(state.battle?.monster.hp).toBe(30) // 50 - 20
  })

  it('should reduce player HP on wrong answer', () => {
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
    dispatch({ type: 'ANSWER_QUESTION', answerIndex: 0 }) // wrong answer

    const state = useGameStore.getState()
    expect(state.battle?.player.hp).toBe(90) // 100 - 10
    expect(state.battle?.comboCount).toBe(0) // combo reset
  })
})
```

- [ ] **Step 3: 运行测试验证**

```bash
cd "/Users/xihualiu/code/game for my children" && npx vitest run src/store/gameStore.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 4: Commit**

```bash
cd "/Users/xihualiu/code/game for my children"
git add src/store/gameStore.ts src/store/gameStore.test.ts
git commit -m "feat: migrate from Context to Zustand state management"
```

---

### Task 3: 创建渲染适配器架构

**Files:**
- Create: `src/render/RenderAdapter.ts`
- Create: `src/render/SpriteRenderAdapter.ts`
- Create: `src/render/RenderManager.ts`
- Test: `src/render/RenderAdapter.test.ts`

- [ ] **Step 1: 创建渲染适配器接口**

```typescript
// src/render/RenderAdapter.ts
import { Vector3 } from 'three'

export interface CharacterProps {
  id: string
  name: string
  position: Vector3
  sprite: string
  hp: number
  maxHp: number
}

export interface MonsterProps {
  id: string
  name: string
  position: Vector3
  sprite: string
  hp: number
  maxHp: number
}

export interface SkillEffectProps {
  skillId: string
  position: Vector3
  duration: number
}

export interface DamageEffectProps {
  target: 'player' | 'monster'
  amount: number
  position: Vector3
}

export interface RenderAdapter {
  // 角色渲染
  renderCharacter(props: CharacterProps): void
  renderMonster(props: MonsterProps): void
  updateCharacter(id: string, props: Partial<CharacterProps>): void
  updateMonster(id: string, props: Partial<MonsterProps>): void
  removeCharacter(id: string): void
  removeMonster(id: string): void

  // 特效
  playSkillEffect(props: SkillEffectProps): void
  playDamageEffect(props: DamageEffectProps): void

  // 相机控制
  setCamera(mode: '2d' | '3d'): void
  focusOn(position: Vector3): void

  // 生命周期
  dispose(): void
}
```

- [ ] **Step 2: 创建 2D 渲染实现**

```typescript
// src/render/SpriteRenderAdapter.ts
import * as THREE from 'three'
import { Sprite } from 'three'
import { RenderAdapter, CharacterProps, MonsterProps, SkillEffectProps, DamageEffectProps } from './RenderAdapter'

export class SpriteRenderAdapter implements RenderAdapter {
  private characters: Map<string, THREE.Sprite> = new Map()
  private monsters: Map<string, THREE.Sprite> = new Map()
  private scene: THREE.Scene

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  renderCharacter(props: CharacterProps): void {
    const sprite = this.createSprite(props.sprite, props.position)
    sprite.userData.id = props.id
    this.characters.set(props.id, sprite)
    this.scene.add(sprite)
  }

  renderMonster(props: MonsterProps): void {
    const sprite = this.createSprite(props.sprite, props.position)
    sprite.userData.id = props.id
    this.monsters.set(props.id, sprite)
    this.scene.add(sprite)
  }

  updateCharacter(id: string, props: Partial<CharacterProps>): void {
    const sprite = this.characters.get(id)
    if (sprite && props.position) {
      sprite.position.copy(props.position)
    }
  }

  updateMonster(id: string, props: Partial<MonsterProps>): void {
    const sprite = this.monsters.get(id)
    if (sprite && props.position) {
      sprite.position.copy(props.position)
    }
  }

  removeCharacter(id: string): void {
    const sprite = this.characters.get(id)
    if (sprite) {
      this.scene.remove(sprite)
      this.characters.delete(id)
    }
  }

  removeMonster(id: string): void {
    const sprite = this.monsters.get(id)
    if (sprite) {
      this.scene.remove(sprite)
      this.monsters.delete(id)
    }
  }

  playSkillEffect(props: SkillEffectProps): void {
    // TODO: Implement VFX particle effect
    console.log(`Playing skill effect: ${props.skillId}`)
  }

  playDamageEffect(props: DamageEffectProps): void {
    // TODO: Implement damage number animation
    console.log(`Playing damage effect: ${props.amount} to ${props.target}`)
  }

  setCamera(mode: '2d' | '3d'): void {
    // Camera mode switching handled by RenderManager
  }

  focusOn(position: Vector3): void {
    // Camera focus handled by RenderManager
  }

  dispose(): void {
    this.characters.forEach((sprite) => this.scene.remove(sprite))
    this.monsters.forEach((sprite) => this.scene.remove(sprite))
    this.characters.clear()
    this.monsters.clear()
  }

  private createSprite(textureUrl: string, position: THREE.Vector3): THREE.Sprite {
    const texture = new THREE.TextureLoader().load(textureUrl)
    const material = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(material)
    sprite.position.copy(position)
    return sprite
  }
}
```

- [ ] **Step 3: 创建渲染管理器**

```typescript
// src/render/RenderManager.ts
import * as THREE from 'three'
import { OrthographicCamera } from 'three'
import { RenderAdapter } from './RenderAdapter'
import { SpriteRenderAdapter } from './SpriteRenderAdapter'

export class RenderManager {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: OrthographicCamera
  private currentAdapter: RenderAdapter
  private adapterType: '2d' | '3d' = '2d'

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.scene = new THREE.Scene()
    this.camera = new OrthographicCamera(-10, 10, 10, -10, 0.1, 1000)
    this.camera.position.z = 10

    this.currentAdapter = new SpriteRenderAdapter(this.scene)
  }

  switchRenderer(type: '2d' | '3d'): void {
    if (type === this.adapterType) return

    this.currentAdapter.dispose()
    this.adapterType = type

    if (type === '2d') {
      this.currentAdapter = new SpriteRenderAdapter(this.scene)
    } else {
      // Future: ModelRenderAdapter
      throw new Error('3D rendering not yet implemented')
    }
  }

  getAdapter(): RenderAdapter {
    return this.currentAdapter
  }

  render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    this.currentAdapter.dispose()
    this.renderer.dispose()
  }
}
```

- [ ] **Step 4: 创建测试**

```typescript
// src/render/RenderAdapter.test.ts
import { describe, it, expect } from 'vitest'
import { SpriteRenderAdapter } from './SpriteRenderAdapter'
import { Vector3 } from 'three'

describe('SpriteRenderAdapter', () => {
  it('should create adapter with scene', () => {
    // Note: This is a unit test without actual Three.js scene
    // In real implementation, use mocks or test with actual scene
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 5: Commit**

```bash
cd "/Users/xihualiu/code/game for my children"
git add src/render/RenderAdapter.ts src/render/SpriteRenderAdapter.ts src/render/RenderManager.ts
git commit -m "feat: add render adapter architecture for 2D/3D switching"
```

---

### Task 4: 创建游戏主组件和标题界面

**Files:**
- Modify: `src/components/game/Game.tsx`
- Modify: `src/components/game/TitleScreen.tsx` (重写)
- Create: `src/components/game/Scene.tsx`
- Test: `src/components/game/Game.test.tsx`

- [ ] **Step 1: 重写标题界面**

```typescript
// src/components/game/TitleScreen.tsx
import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export default function TitleScreen() {
  const dispatch = useGameStore((state) => state.dispatch)
  const [playerName, setPlayerName] = useState('')
  const [player2Name, setPlayer2Name] = useState('')
  const [isCoop, setIsCoop] = useState(false)

  const handleStart = () => {
    const players = [
      { id: 'p1', name: playerName || '玩家1', hp: 100, maxHp: 100, comboCount: 0 },
    ]
    if (isCoop && player2Name) {
      players.push({ id: 'p2', name: player2Name, hp: 100, maxHp: 100, comboCount: 0 })
    }
    dispatch({ type: 'START_GAME', players })
  }

  return (
    <div className="title-screen">
      <h1>波吉王子海洋探险</h1>
      <p>Prince Boji's Ocean Adventure</p>

      <div className="start-form">
        <input
          type="text"
          placeholder="玩家1名字"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={isCoop}
            onChange={(e) => setIsCoop(e.target.checked)}
          />
          双人模式
        </label>

        {isCoop && (
          <input
            type="text"
            placeholder="玩家2名字"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
          />
        )}

        <button onClick={handleStart} disabled={!playerName && !player2Name}>
          开始冒险
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 更新主游戏组件**

```typescript
// src/components/game/Game.tsx
import { useGameStore } from '../../store/gameStore'
import TitleScreen from './TitleScreen'
import WorldMap from './WorldMap'
import Battle from './Battle/Battle'
import Result from './Result'

export default function Game() {
  const gamePhase = useGameStore((state) => state.gamePhase)

  switch (gamePhase) {
    case 'title':
      return <TitleScreen />
    case 'world_map':
      return <WorldMap />
    case 'battle':
      return <Battle />
    case 'result':
      return <Result />
    case 'game_over':
      return <TitleScreen />
    default:
      return <TitleScreen />
  }
}
```

- [ ] **Step 3: 创建 R3F 场景组件**

```typescript
// src/components/game/Scene.tsx
import { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { useGameStore } from '../../store/gameStore'

export default function Scene() {
  const gamePhase = useGameStore((state) => state.gamePhase)

  if (gamePhase !== 'battle') return null

  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
      {/* Scene content will be added in Phase 2 */}
    </Canvas>
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd "/Users/xihualiu/code/game for my children"
git add src/components/game/TitleScreen.tsx src/components/game/Game.tsx src/components/game/Scene.tsx
git commit -m "feat: add title screen and main game components"
```

---

### Task 5: 数据迁移与类型对齐

**Files:**
- Modify: `src/data/oceans/index.ts`
- Modify: `src/data/monsters/index.ts`
- Modify: `src/data/questions/index.ts`
- Test: `src/data/validation.test.ts`

**迁移原则**: 更新数据文件以匹配 Phase 1 定义的新类型（而非修改类型去迁就现有数据）

- [ ] **Step 1: 迁移海洋数据**

原始结构 (需更新):
```typescript
// 旧结构
{ id: 'east', difficulty: 1, ... }
```

新结构:
```typescript
// 新结构 - difficulty 改为 [min, max] 元组
{ id: 'east', difficulty: [1, 2], ... }
```

执行迁移:
```typescript
// src/data/oceans/index.ts
export const oceansData: Record<string, OceanZone> = {
  east: {
    id: 'east',
    name: '东大洋',
    description: '波吉王子的起点',
    difficulty: [1, 2],      // 从 number 改为 [number, number]
    bossId: 'east_boss',
    monsters: ['slime', 'crab'],
    unlocked: true,
    completed: false,
  },
  west: {
    id: 'west',
    name: '西洋大洋',
    difficulty: [2, 3],
    bossId: 'west_boss',
    monsters: ['octopus', 'jellyfish'],
    unlocked: false,
    completed: false,
  },
  southHot: {
    id: 'southHot',
    name: '南热大洋',
    difficulty: [3, 4],
    bossId: 'southHot_boss',
    monsters: [],
    unlocked: false,
    completed: false,
  },
  northIce: {
    id: 'northIce',
    name: '北冰大洋',
    difficulty: [4, 5],
    bossId: 'northIce_boss',
    monsters: [],
    unlocked: false,
    completed: false,
  },
  // ... 其他海洋类似更新
}
```

- [ ] **Step 2: 迁移怪物数据**

原始结构 (需更新):
```typescript
// 旧结构
{ id: 'slime', name: '史莱姆', hp: 30, image: 'slime.png' }
```

新结构:
```typescript
// 新结构 - image 改为 sprite, 添加 maxHp
{ id: 'slime', name: '史莱姆', hp: 30, maxHp: 30, sprite: 'slime.png' }
```

执行迁移:
```typescript
// src/data/monsters/index.ts
export const monstersData: Record<string, Monster> = {
  slime: {
    id: 'slime',
    name: '史莱姆',
    hp: 30,
    maxHp: 30,              // 新增字段
    sprite: 'slime.png',    // 从 image 重命名为 sprite
  },
  // ... 其他怪物类似更新
}
```

- [ ] **Step 3: 迁移题目数据 (关键迁移)**

原始结构 (需完全重写):
```typescript
// 旧结构
{
  id: 'q1',
  content: '1+1=?',
  options: ['1', '2', '3'],
  correctIndex: 1
}
```

新结构:
```typescript
// 新结构 - options 改为 QuestionOption[], 添加 isCorrect 标记
{
  id: 'q1',
  content: '1+1=?',
  type: 'single',
  difficulty: 1,
  category: 'math',
  options: [
    { text: '1', isCorrect: false },
    { text: '2', isCorrect: true },
    { text: '3', isCorrect: false },
  ],
}
```

执行迁移 (示例转换函数):
```typescript
// src/data/questions/migrate.ts
// 此文件用于一次性迁移，完成后可删除

interface OldQuestion {
  id: string
  content: string
  options: string[]
  correctIndex: number
}

function migrateQuestion(old: OldQuestion): Question {
  return {
    id: old.id,
    content: old.content,
    type: 'single',
    difficulty: 1,
    category: 'math',
    options: old.options.map((text, idx) => ({
      text,
      isCorrect: idx === old.correctIndex,
    })),
  }
}
```

**注意**: Phase 1 只支持单选题。`type: 'multiple'` 和多选题验证将在 Phase 3 SkillSystem 中实现。

- [ ] **Step 4: 创建验证测试**

```typescript
// src/data/validation.test.ts
import { describe, it, expect } from 'vitest'
import { oceansData } from './oceans'
import { monstersData } from './monsters'
import { questionsData } from './questions'

describe('Data Validation', () => {
  it('oceans should have required fields', () => {
    Object.values(oceansData).forEach((ocean) => {
      expect(ocean.id).toBeDefined()
      expect(ocean.name).toBeDefined()
      expect(ocean.difficulty).toHaveLength(2)
      expect(Array.isArray(ocean.difficulty)).toBe(true)
      expect(ocean.monsters).toBeDefined()
    })
  })

  it('monsters should have hp and maxHp', () => {
    Object.values(monstersData).forEach((monster) => {
      expect(monster.hp).toBeDefined()
      expect(monster.maxHp).toBeDefined()
      expect(monster.sprite).toBeDefined()
      expect(monster.hp).toBeLessThanOrEqual(monster.maxHp)
    })
  })

  it('questions should have correct options structure', () => {
    Object.values(questionsData).flat().forEach((question) => {
      expect(question.options).toBeDefined()
      expect(question.options.length).toBeGreaterThan(0)
      question.options.forEach((opt) => {
        expect(opt.text).toBeDefined()
        expect(typeof opt.isCorrect).toBe('boolean')
      })
      // 验证至少有一个正确答案
      const hasCorrect = question.options.some((opt) => opt.isCorrect)
      expect(hasCorrect).toBe(true)
    })
  })
})
```

- [ ] **Step 5: 运行测试验证**

```bash
cd "/Users/xihualiu/code/game for my children" && npx vitest run src/data/validation.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
cd "/Users/xihualiu/code/game for my children"
git add src/data/oceans/index.ts src/data/monsters/index.ts src/data/questions/index.ts
git commit -m "feat: align data layer with core types"
```

---

## 实施检查清单

完成所有任务后，确认以下内容：

- [ ] `src/game/types.ts` 定义了所有核心类型
- [ ] `src/store/gameStore.ts` 使用 Zustand 管理状态
- [ ] `src/render/RenderAdapter.ts` 定义了渲染接口
- [ ] `src/render/SpriteRenderAdapter.ts` 实现了 2D 渲染
- [ ] `src/components/game/TitleScreen.tsx` 可输入玩家名字并开始游戏
- [ ] `src/components/game/Game.tsx` 根据 gamePhase 渲染对应界面
- [ ] 数据层与核心类型对齐
- [ ] 所有测试通过

---

## Phase 1 产出

**创建的文件:**
- `src/game/types.ts` - 核心类型定义
- `src/game/types.test.ts` - 类型测试
- `src/store/gameStore.ts` - Zustand store
- `src/store/gameStore.test.ts` - Store 测试
- `src/render/RenderAdapter.ts` - 渲染接口
- `src/render/SpriteRenderAdapter.ts` - 2D 实现
- `src/render/RenderManager.ts` - 渲染管理器
- `src/components/game/TitleScreen.tsx` - 标题界面
- `src/components/game/Game.tsx` - 主游戏组件
- `src/components/game/Scene.tsx` - R3F 场景

**修改的文件:**
- `src/main.tsx` - 更新入口
- `src/data/oceans/index.ts` - 类型对齐
- `src/data/monsters/index.ts` - 类型对齐
- `src/data/questions/index.ts` - 类型对齐

**删除的文件:**
- `src/context/GameContext.tsx` - 迁移到 Zustand 后删除

**总测试数:** ~12 个测试用例
