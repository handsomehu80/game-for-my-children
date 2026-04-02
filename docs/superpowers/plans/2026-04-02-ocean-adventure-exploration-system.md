# 海上探险系统实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现海上探险系统，包括知识区域、探索状态机、钥匙机制、传送门系统

**Scope Note (本计划范围):**
- 本计划实现**东大洋**的完整探索系统
- 其他大洋（西洋大洋、南热大洋、北冰大洋、神秘大洋）标记为 `待实现`
- 战斗系统联动（连击、技能）在本计划中预留接口
- 合作模式（题目分配）将在后续计划中实现
- 组合技能（spec Section 4.3）将在后续计划中实现

**Architecture:**
- 探索状态机作为纯函数定义在 `src/game/ExplorationStateMachine.ts`
- Zustand store 管理探索状态
- UI 组件订阅 store 状态，触发状态机转换
- 数据层定义知识区域和海洋的关联

**Tech Stack:** TypeScript, Zustand, React-Three-Fiber (预留)

---

## 文件结构

```
src/
├── game/
│   ├── ExplorationStateMachine.ts   # 探索状态机（新建）
│   ├── types.ts                    # 探索相关类型（扩展）
│   └── transitions.ts               # 状态转换规则（新建）
├── store/
│   └── gameStore.ts                 # Zustand store（扩展探索状态）
├── components/game/
│   ├── ExplorationMap.tsx           # 探索地图UI（新建）
│   ├── AreaNode.tsx                 # 区域节点组件（新建）
│   └── Portal.tsx                   # 传送门组件（新建）
└── data/
    └── areas/
        └── index.ts                 # 知识区域数据（新建）
```

---

## Task 1: 探索类型定义

**Files:**
- Modify: `src/game/types.ts`
- Test: `src/game/types.test.ts` (扩展)

**重要**: 需要同时更新现有的 `GamePhase` 类型以包含 `'exploration'`

```typescript
// 在 src/game/types.ts 中找到 GamePhase 定义并修改：
export type GamePhase = 'title' | 'world_map' | 'battle' | 'result' | 'game_over' | 'exploration'
```

- [ ] **Step 1: 添加探索相关类型到 types.ts**

在 `src/game/types.ts` 末尾添加：

```typescript
// ==================== 探索系统类型 ====================

// 探索 Phase
export type ExplorationPhase =
  | 'exploring'        // 选择目的地
  | 'moving'           // 移动动画
  | 'encounter'        // 遭遇判定
  | 'battle'           // 战斗中
  | 'hidden_area'      // 进入隐藏区域
  | 'treasure'         // 宝箱/奖励
  | 'portal_appear'    // 传送门出现
  | 'boss_appearing'   // 大Boss出现
  | 'victory'          // 区域胜利
  | 'error'            // 异常状态
  | 'rollback'         // 回滚状态

// 知识区域类型
export type KnowledgeArea = 'math' | 'chinese' | 'english' | 'comprehensive'

// 区域
export interface Area {
  id: string
  oceanId: string
  knowledgeArea: KnowledgeArea
  name: string
  difficulty: 1 | 2 | 3  // 1-3星
  type: 'normal' | 'hidden' | 'treasure' | 'boss'
  position: { x: number; z: number }  // 地图坐标
  requiredKeys: number         // 需要钥匙数量 (0 = 不需要)
  monsterId?: string           // 关联怪物
  connections: string[]        // 连接的区域ID
}

// 传送门
export interface Portal {
  id: string
  targetAreaId: string
  type: 'normal' | 'hidden' | 'event'
}

// 传送门配置
export interface PortalConfig {
  seed: number
  portals: Portal[]
  generatedAt: number
}

// 探索状态
export interface ExplorationState {
  phase: ExplorationPhase
  currentOcean: string | null
  currentArea: string | null
  visitedAreas: string[]           // 已访问区域
  defeatedMiniBosses: string[]     // 已击败小boss
  unlockedAreas: string[]          // 已解锁区域（使用钥匙后）
  collectedKeys: number            // 收集的钥匙数量
  collectedItems: Item[]           // 收集的物品
  availablePortals: Portal[]       // 当前可选传送门
  portalSeed: number | null        // 传送门随机种子
  failedAttempts: Record<string, number>  // 每个区域的失败次数
  lastError: string | null         // 最后错误信息
  // 回滚相关
  savepoints: Savepoint[]          // 存档点历史
  lastSavepoint: Savepoint | null  // 上一个存档点
  retryCount: number              // 当前区域的失败重试次数
}

// 存档点类型
export type SavepointType = 'battle_win' | 'area_unlock' | 'treasure'

// 存档点
export interface Savepoint {
  type: SavepointType
  createdAt: number
  stateSnapshot: {
    visitedAreas: string[]
    defeatedMiniBosses: string[]
    unlockedAreas: string[]
    collectedKeys: number
    collectedItems: Item[]
  }
}

// 游戏状态扩展 - 添加探索相关字段
export interface GameState {
  // ... 现有字段
  gamePhase: GamePhase
  currentOcean: string | null
  players: Player[]
  unlockedOceans: string[]
  completedOceans: string[]
  battle: BattleState | null
  totalScore: number
  // 新增探索状态
  exploration: ExplorationState | null
}

// 探索动作
export type ExplorationAction =
  | { type: 'START_EXPLORATION'; oceanId: string }
  | { type: 'SELECT_AREA'; areaId: string }
  | { type: 'MOVE_COMPLETE' }
  | { type: 'ENCOUNTER_RESULT'; result: 'battle' | 'treasure' | 'hidden_event' }
  | { type: 'BATTLE_WIN'; areaId: string }
  | { type: 'BATTLE_LOSE' }
  | { type: 'OPEN_TREASURE'; treasures: Item[] }
  | { type: 'RECEIVE_KEY'; count: number }
  | { type: 'UNLOCK_AREA'; areaId: string }
  | { type: 'GENERATE_PORTALS'; portals: Portal[]; seed: number }
  | { type: 'SELECT_PORTAL'; portal: Portal }
  | { type: 'BOSS_APPEAR' }
  | { type: 'AREA_COMPLETE' }
  | { type: 'CREATE_SAVEPOINT'; savepointType: SavepointType }
  | { type: 'EXPLORATION_ERROR'; error: string }
  | { type: 'ROLLBACK_TO_SAVEPOINT' }
  | { type: 'RESET_EXPLORATION' }
```

- [ ] **Step 2: 运行测试验证类型编译**

Run: `cd "/Users/xihualiu/code/game for my children" && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/game/types.ts
git commit -m "feat: add exploration system types"
```

---

## Task 2: 知识区域数据

**Files:**
- Create: `src/data/areas/index.ts`
- Test: `src/data/areas/areas.test.ts`

- [ ] **Step 1: 创建知识区域数据文件**

创建 `src/data/areas/index.ts`：

```typescript
import { Area } from '../../game/types'

// 东大洋区域布局 (13个区域)
export const eastAreas: Area[] = [
  // 数学区域 (3个难度)
  {
    id: 'east_math_1',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '数学迷宫 - 入门',
    difficulty: 1,
    type: 'normal',
    position: { x: -2, z: 0 },
    requiredKeys: 0,
    monsterId: 'math_slime_1',
    connections: ['east_chinese_1', 'east_english_1'],
  },
  {
    id: 'east_math_2',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '数学迷宫 - 进阶',
    difficulty: 2,
    type: 'normal',
    position: { x: -3, z: 1 },
    requiredKeys: 0,
    monsterId: 'math_slime_2',
    connections: ['east_math_1', 'east_chinese_2'],
  },
  {
    id: 'east_math_3',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '数学迷宫 - 挑战',
    difficulty: 3,
    type: 'normal',
    position: { x: -4, z: 2 },
    requiredKeys: 0,
    monsterId: 'math_slime_3',
    connections: ['east_math_2', 'east_boss'],
  },

  // 语文区域 (3个难度)
  {
    id: 'east_chinese_1',
    oceanId: 'east',
    knowledgeArea: 'chinese',
    name: '文字森林 - 入门',
    difficulty: 1,
    type: 'normal',
    position: { x: 0, z: -1 },
    requiredKeys: 0,
    monsterId: 'chinese_slime_1',
    connections: ['east_math_1', 'east_english_1'],
  },
  {
    id: 'east_chinese_2',
    oceanId: 'east',
    knowledgeArea: 'chinese',
    name: '文字森林 - 进阶',
    difficulty: 2,
    type: 'normal',
    position: { x: 0, z: 1 },
    requiredKeys: 0,
    monsterId: 'chinese_slime_2',
    connections: ['east_chinese_1', 'east_english_2'],
  },
  {
    id: 'east_chinese_3',
    oceanId: 'east',
    knowledgeArea: 'chinese',
    name: '文字森林 - 挑战',
    difficulty: 3,
    type: 'normal',
    position: { x: 0, z: 2 },
    requiredKeys: 0,
    monsterId: 'chinese_slime_3',
    connections: ['east_chinese_2', 'east_boss'],
  },

  // 英语区域 (3个难度)
  {
    id: 'east_english_1',
    oceanId: 'east',
    knowledgeArea: 'english',
    name: '单词海洋 - 入门',
    difficulty: 1,
    type: 'normal',
    position: { x: 2, z: 0 },
    requiredKeys: 0,
    monsterId: 'english_slime_1',
    connections: ['east_math_1', 'east_chinese_1'],
  },
  {
    id: 'east_english_2',
    oceanId: 'east',
    knowledgeArea: 'english',
    name: '单词海洋 - 进阶',
    difficulty: 2,
    type: 'normal',
    position: { x: 3, z: 1 },
    requiredKeys: 0,
    monsterId: 'english_slime_2',
    connections: ['east_english_1', 'east_chinese_2'],
  },
  {
    id: 'east_english_3',
    oceanId: 'east',
    knowledgeArea: 'english',
    name: '单词海洋 - 挑战',
    difficulty: 3,
    type: 'normal',
    position: { x: 4, z: 2 },
    requiredKeys: 0,
    monsterId: 'english_slime_3',
    connections: ['east_english_2', 'east_boss'],
  },

  // 隐藏区域 (需要钥匙)
  {
    id: 'east_hidden_A',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '秘密宝藏室 A',
    difficulty: 2,
    type: 'hidden',
    position: { x: -1, z: -1 },
    requiredKeys: 1,
    monsterId: 'treasure_guardian',
    connections: ['east_math_1'],
  },
  {
    id: 'east_hidden_B',
    oceanId: 'east',
    knowledgeArea: 'chinese',
    name: '秘密宝藏室 B',
    difficulty: 2,
    type: 'hidden',
    position: { x: 1, z: -1 },
    requiredKeys: 1,
    monsterId: 'treasure_guardian',
    connections: ['east_chinese_1'],
  },

  // 宝箱区域
  {
    id: 'east_treasure_1',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '奖励宝箱',
    difficulty: 1,
    type: 'treasure',
    position: { x: -2, z: 2 },
    requiredKeys: 0,
    connections: ['east_math_2'],
  },

  // 大Boss区域
  {
    id: 'east_boss',
    oceanId: 'east',
    knowledgeArea: 'comprehensive',
    name: '东大洋守护者',
    difficulty: 3,
    type: 'boss',
    position: { x: 0, z: 3 },
    requiredKeys: 0,
    monsterId: 'jellyfish_king',  // 复用现有的boss
    connections: ['east_math_3', 'east_chinese_3', 'east_english_3'],
  },
]

// 导出所有大洋区域数据
export const areasData: Record<string, Area[]> = {
  east: eastAreas,
  west: [],  // 待实现 - 西洋大洋
  southHot: [],  // 待实现 - 南热大洋
  northIce: [],  // 待实现 - 北冰大洋
  mysterious: [],  // 待实现 - 神秘大洋
}

// 获取指定大洋的区域
export function getAreasByOcean(oceanId: string): Area[] {
  return areasData[oceanId] || []
}

// 获取指定区域
export function getAreaById(areaId: string): Area | undefined {
  for (const areas of Object.values(areasData)) {
    const area = areas.find(a => a.id === areaId)
    if (area) return area
  }
  return undefined
}

// 获取区域的难度标签
export function getDifficultyStars(difficulty: 1 | 2 | 3): string {
  return '⭐'.repeat(difficulty)
}
```

- [ ] **Step 2: 创建测试文件**

创建 `src/data/areas/areas.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { eastAreas, getAreasByOcean, getAreaById, getDifficultyStars } from './index'

describe('Areas Data', () => {
  it('东大洋应有13个区域', () => {
    const areas = getAreasByOcean('east')
    expect(areas.length).toBe(13)
  })

  it('东大洋应有3个数学、3个语文、3个英语、1个大boss、2个隐藏、1个宝箱', () => {
    const areas = getAreasByOcean('east')
    const mathAreas = areas.filter(a => a.knowledgeArea === 'math' && a.type === 'normal')
    const chineseAreas = areas.filter(a => a.knowledgeArea === 'chinese' && a.type === 'normal')
    const englishAreas = areas.filter(a => a.knowledgeArea === 'english' && a.type === 'normal')
    const bossAreas = areas.filter(a => a.type === 'boss')
    const hiddenAreas = areas.filter(a => a.type === 'hidden')
    const treasureAreas = areas.filter(a => a.type === 'treasure')

    expect(mathAreas.length).toBe(3)
    expect(chineseAreas.length).toBe(3)
    expect(englishAreas.length).toBe(3)
    expect(bossAreas.length).toBe(1)
    expect(hiddenAreas.length).toBe(2)
    expect(treasureAreas.length).toBe(1)
  })

  it('隐藏区域需要钥匙', () => {
    const hiddenArea = getAreaById('east_hidden_A')
    expect(hiddenArea?.requiredKeys).toBe(1)
  })

  it('普通区域不需要钥匙', () => {
    const normalArea = getAreaById('east_math_1')
    expect(normalArea?.requiredKeys).toBe(0)
  })

  it('难度星数正确', () => {
    expect(getDifficultyStars(1)).toBe('⭐')
    expect(getDifficultyStars(2)).toBe('⭐⭐')
    expect(getDifficultyStars(3)).toBe('⭐⭐⭐')
  })
})
```

- [ ] **Step 3: 运行测试**

Run: `cd "/Users/xihualiu/code/game for my children" && npm test -- src/data/areas/areas.test.ts`
Expected: 5 tests pass

- [ ] **Step 4: 提交**

```bash
git add src/data/areas/index.ts src/data/areas/areas.test.ts
git commit -m "feat: add knowledge areas data structure for East Ocean"
```

---

## Task 3: 探索状态机核心

**Files:**
- Create: `src/game/ExplorationStateMachine.ts`
- Test: `src/game/ExplorationStateMachine.test.ts`

- [ ] **Step 1: 创建探索状态机纯函数**

创建 `src/game/ExplorationStateMachine.ts`：

```typescript
import type { ExplorationState, ExplorationAction, Portal, Area, Item } from './types'
import { getAreaById } from '../data/areas'

// 初始探索状态
export const initialExplorationState: ExplorationState = {
  phase: 'exploring',
  currentOcean: null,
  currentArea: null,
  visitedAreas: [],
  defeatedMiniBosses: [],
  unlockedAreas: [],
  collectedKeys: 0,
  collectedItems: [],
  availablePortals: [],
  portalSeed: null,
  failedAttempts: {},
  lastError: null,
  savepoints: [],
  lastSavepoint: null,
  retryCount: 0,
}

// 状态转换函数（纯函数）
export function explorationTransition(
  state: ExplorationState,
  action: ExplorationAction
): ExplorationState {
  switch (state.phase) {
    case 'exploring':
      switch (action.type) {
        case 'START_EXPLORATION':
          return {
            ...initialExplorationState,
            phase: 'exploring',
            currentOcean: action.oceanId,
          }
        case 'SELECT_AREA': {
          const area = getAreaById(action.areaId)
          if (!area) {
            return { ...state, phase: 'error', lastError: `Area ${action.areaId} not found` }
          }
          // 检查是否已解锁
          if (area.requiredKeys > 0 && !state.unlockedAreas.includes(area.id)) {
            return { ...state, phase: 'error', lastError: `Area ${action.areaId} requires keys` }
          }
          return {
            ...state,
            phase: 'moving',
            currentArea: action.areaId,
          }
        }
        default:
          return state
      }

    case 'moving':
      switch (action.type) {
        case 'MOVE_COMPLETE':
          return { ...state, phase: 'encounter' }
        default:
          return state
      }

    case 'encounter':
      switch (action.type) {
        case 'ENCOUNTER_RESULT':
          if (action.result === 'battle') {
            return { ...state, phase: 'battle' }
          } else if (action.result === 'treasure') {
            return { ...state, phase: 'treasure' }
          } else {
            // hidden_event - 触发隐藏事件
            return { ...state, phase: 'hidden_area' }
          }
        default:
          return state
      }

    case 'battle':
      switch (action.type) {
        case 'BATTLE_WIN': {
          const newVisited = state.visitedAreas.includes(action.areaId)
            ? state.visitedAreas
            : [...state.visitedAreas, action.areaId]
          const newDefeated = state.defeatedMiniBosses.includes(action.areaId)
            ? state.defeatedMiniBosses
            : [...state.defeatedMiniBosses, action.areaId]
          // 创建存档点
          const savepoint: Savepoint = {
            type: 'battle_win',
            createdAt: Date.now(),
            stateSnapshot: {
              visitedAreas: newVisited,
              defeatedMiniBosses: newDefeated,
              unlockedAreas: state.unlockedAreas,
              collectedKeys: state.collectedKeys,
              collectedItems: state.collectedItems,
            },
          }
          return {
            ...state,
            phase: 'victory',
            visitedAreas: newVisited,
            defeatedMiniBosses: newDefeated,
            savepoints: [...state.savepoints, savepoint],
            lastSavepoint: savepoint,
            retryCount: 0,  // 重置重试计数
          }
        }
        case 'BATTLE_LOSE': {
          // 增加失败计数
          const newRetryCount = state.retryCount + 1
          const failedAttempts = {
            ...state.failedAttempts,
            [state.currentArea || '']: (state.failedAttempts[state.currentArea || ''] || 0) + 1,
          }
          // 检查是否超过最大重试次数（3次）
          if (newRetryCount >= 3) {
            return {
              ...state,
              phase: 'rollback',
              failedAttempts,
              retryCount: newRetryCount,
              lastError: 'Max retries exceeded, rolling back',
            }
          }
          return {
            ...state,
            phase: 'error',
            failedAttempts,
            retryCount: newRetryCount,
            lastError: `Battle lost (retry ${newRetryCount}/3)`,
          }
        }
        default:
          return state
      }

    case 'treasure':
      switch (action.type) {
        case 'OPEN_TREASURE':
          return {
            ...state,
            phase: 'portal_appear',
            collectedItems: [...state.collectedItems, ...action.treasures],
          }
        default:
          return state
      }

    case 'hidden_area':
      // 隐藏区域战斗后同普通战斗
      switch (action.type) {
        case 'BATTLE_WIN':
          return { ...state, phase: 'portal_appear' }
        case 'BATTLE_LOSE':
          return { ...state, phase: 'error', lastError: 'Hidden area battle lost' }
        default:
          return state
      }

    case 'victory':
      switch (action.type) {
        case 'GENERATE_PORTALS':
          return { ...state, phase: 'portal_appear', availablePortals: action.portals, portalSeed: action.seed }
        case 'RECEIVE_KEY':
          return { ...state, collectedKeys: state.collectedKeys + action.count }
        case 'CREATE_SAVEPOINT': {
          const savepoint: Savepoint = {
            type: action.savepointType,
            createdAt: Date.now(),
            stateSnapshot: {
              visitedAreas: state.visitedAreas,
              defeatedMiniBosses: state.defeatedMiniBosses,
              unlockedAreas: state.unlockedAreas,
              collectedKeys: state.collectedKeys,
              collectedItems: state.collectedItems,
            },
          }
          return {
            ...state,
            savepoints: [...state.savepoints, savepoint],
            lastSavepoint: savepoint,
          }
        }
        default:
          return state
      }

    case 'portal_appear':
      switch (action.type) {
        case 'SELECT_PORTAL':
          return { ...state, phase: 'moving', currentArea: action.portal.targetAreaId }
        case 'UNLOCK_AREA':
          return {
            ...state,
            unlockedAreas: state.unlockedAreas.includes(action.areaId)
              ? state.unlockedAreas
              : [...state.unlockedAreas, action.areaId],
            collectedKeys: state.collectedKeys - 1,
          }
        default:
          return state
      }

    case 'boss_appearing':
      switch (action.type) {
        case 'BATTLE_WIN':
          return { ...state, phase: 'area_complete' }
        case 'BATTLE_LOSE':
          return { ...state, phase: 'error', lastError: 'Boss battle lost' }
        default:
          return state
      }

    case 'area_complete':
      switch (action.type) {
        case 'AREA_COMPLETE':
          return { ...state, phase: 'exploring' }  // 返回探索选择
        default:
          return state
      }

    case 'error':
      switch (action.type) {
        case 'ROLLBACK_TO_SAVEPOINT':
          // 回滚到上一个存档点
          if (state.lastSavepoint) {
            return {
              ...state,
              phase: 'exploring',
              currentArea: null,  // 回到选择区域
              ...state.lastSavepoint.stateSnapshot,
              retryCount: 0,
              lastError: null,
            }
          }
          return { ...state, phase: 'exploring', lastError: null }
        case 'RESET_EXPLORATION':
          return initialExplorationState
        default:
          return state
      }

    case 'rollback':
      // 回滚到存档点
      if (state.lastSavepoint) {
        return {
          ...state,
          phase: 'exploring',
          currentArea: null,
          ...state.lastSavepoint.stateSnapshot,
          retryCount: 0,
          lastError: null,
        }
      }
      return { ...state, phase: 'exploring', lastError: null }

    default:
      return state
  }
}

// 获取当前有效的动作
export function getAvailableActions(state: ExplorationState): ExplorationAction['type'][] {
  switch (state.phase) {
    case 'exploring':
      return ['START_EXPLORATION', 'SELECT_AREA']
    case 'victory':
      return ['GENERATE_PORTALS', 'RECEIVE_KEY']
    case 'portal_appear':
      return ['SELECT_PORTAL', 'UNLOCK_AREA']
    case 'error':
      return ['ROLLBACK_TO_SAVEPOINT', 'RESET_EXPLORATION']
    default:
      return []
  }
}

// 检查是否可以进入区域
export function canEnterArea(state: ExplorationState, areaId: string): { allowed: boolean; reason?: string } {
  const area = getAreaById(areaId)
  if (!area) return { allowed: false, reason: 'Area not found' }
  if (area.requiredKeys > 0 && !state.unlockedAreas.includes(areaId)) {
    if (state.collectedKeys < area.requiredKeys) {
      return { allowed: false, reason: `Requires ${area.requiredKeys} key(s), have ${state.collectedKeys}` }
    }
  }
  return { allowed: true }
}
```

- [ ] **Step 2: 创建测试文件**

创建 `src/game/ExplorationStateMachine.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { explorationTransition, initialExplorationState, canEnterArea } from './ExplorationStateMachine'

describe('ExplorationStateMachine', () => {
  describe('initial state', () => {
    it('应有正确的初始状态', () => {
      expect(initialExplorationState.phase).toBe('exploring')
      expect(initialExplorationState.currentOcean).toBeNull()
      expect(initialExplorationState.visitedAreas).toEqual([])
      expect(initialExplorationState.collectedKeys).toBe(0)
    })
  })

  describe('START_EXPLORATION', () => {
    it('应开始指定大洋的探索', () => {
      const result = explorationTransition(initialExplorationState, {
        type: 'START_EXPLORATION',
        oceanId: 'east',
      })
      expect(result.currentOcean).toBe('east')
      expect(result.phase).toBe('exploring')
    })
  })

  describe('SELECT_AREA', () => {
    it('应从exploring转换到moving', () => {
      const state = { ...initialExplorationState, currentOcean: 'east' }
      const result = explorationTransition(state, {
        type: 'SELECT_AREA',
        areaId: 'east_math_1',
      })
      expect(result.phase).toBe('moving')
      expect(result.currentArea).toBe('east_math_1')
    })

    it('未解锁区域应报错', () => {
      const state = { ...initialExplorationState, currentOcean: 'east', collectedKeys: 0 }
      const result = explorationTransition(state, {
        type: 'SELECT_AREA',
        areaId: 'east_hidden_A',  // 需要钥匙的隐藏区域
      })
      expect(result.phase).toBe('error')
    })
  })

  describe('MOVE_COMPLETE', () => {
    it('应从moving转换到encounter', () => {
      const state = { ...initialExplorationState, phase: 'moving' as const }
      const result = explorationTransition(state, { type: 'MOVE_COMPLETE' })
      expect(result.phase).toBe('encounter')
    })
  })

  describe('ENCOUNTER_RESULT', () => {
    it('battle结果应转换到battle phase', () => {
      const state = { ...initialExplorationState, phase: 'encounter' as const }
      const result = explorationTransition(state, { type: 'ENCOUNTER_RESULT', result: 'battle' })
      expect(result.phase).toBe('battle')
    })

    it('treasure结果应转换到treasure phase', () => {
      const state = { ...initialExplorationState, phase: 'encounter' as const }
      const result = explorationTransition(state, { type: 'ENCOUNTER_RESULT', result: 'treasure' })
      expect(result.phase).toBe('treasure')
    })
  })

  describe('BATTLE_WIN', () => {
    it('应记录已击败的boss', () => {
      const state = {
        ...initialExplorationState,
        phase: 'battle' as const,
        currentArea: 'east_math_1',
        visitedAreas: [],
        defeatedMiniBosses: [],
      }
      const result = explorationTransition(state, {
        type: 'BATTLE_WIN',
        areaId: 'east_math_1',
      })
      expect(result.phase).toBe('victory')
      expect(result.defeatedMiniBosses).toContain('east_math_1')
      expect(result.visitedAreas).toContain('east_math_1')
    })
  })

  describe('RECEIVE_KEY', () => {
    it('应增加钥匙数量', () => {
      const state = { ...initialExplorationState, phase: 'victory' as const }
      const result = explorationTransition(state, { type: 'RECEIVE_KEY', count: 1 })
      expect(result.collectedKeys).toBe(1)
    })
  })

  describe('UNLOCK_AREA', () => {
    it('应解锁区域并消耗钥匙', () => {
      const state = {
        ...initialExplorationState,
        phase: 'portal_appear' as const,
        collectedKeys: 2,
        unlockedAreas: [],
      }
      const result = explorationTransition(state, { type: 'UNLOCK_AREA', areaId: 'east_hidden_A' })
      expect(result.unlockedAreas).toContain('east_hidden_A')
      expect(result.collectedKeys).toBe(1)
    })
  })

  describe('BATTLE_LOSE', () => {
    it('应增加失败计数', () => {
      const state = {
        ...initialExplorationState,
        phase: 'battle' as const,
        currentArea: 'east_math_1',
        failedAttempts: {},
      }
      const result = explorationTransition(state, { type: 'BATTLE_LOSE' })
      expect(result.phase).toBe('error')
      expect(result.failedAttempts['east_math_1']).toBe(1)
    })
  })

  describe('RESET_EXPLORATION', () => {
    it('应重置到初始状态', () => {
      const state = {
        ...initialExplorationState,
        currentOcean: 'east',
        currentArea: 'east_math_1',
        collectedKeys: 5,
      }
      const result = explorationTransition(state, { type: 'RESET_EXPLORATION' })
      expect(result).toEqual(initialExplorationState)
    })
  })

  describe('canEnterArea', () => {
    it('普通区域可以直接进入', () => {
      const state = { ...initialExplorationState, currentOcean: 'east' }
      const result = canEnterArea(state, 'east_math_1')
      expect(result.allowed).toBe(true)
    })

    it('需要钥匙的隐藏区域在有钥匙时可进入', () => {
      const state = {
        ...initialExplorationState,
        currentOcean: 'east',
        collectedKeys: 1,
        unlockedAreas: [],
      }
      const result = canEnterArea(state, 'east_hidden_A')
      expect(result.allowed).toBe(true)
    })

    it('需要钥匙的隐藏区域在无钥匙时不可进入', () => {
      const state = {
        ...initialExplorationState,
        currentOcean: 'east',
        collectedKeys: 0,
        unlockedAreas: [],
      }
      const result = canEnterArea(state, 'east_hidden_A')
      expect(result.allowed).toBe(false)
    })
  })
})
```

- [ ] **Step 3: 运行测试**

Run: `cd "/Users/xihualiu/code/game for my children" && npm test -- src/game/ExplorationStateMachine.test.ts`
Expected: 12 tests pass

- [ ] **Step 4: 提交**

```bash
git add src/game/ExplorationStateMachine.ts src/game/ExplorationStateMachine.test.ts
git commit -m "feat: add exploration state machine core logic"
```

---

## Task 4: 扩展 Zustand Store

**Files:**
- Modify: `src/store/gameStore.ts`
- Test: `src/store/gameStore.test.ts` (扩展)

- [ ] **Step 1: 扩展 gameStore 添加探索状态**

修改 `src/store/gameStore.ts`：

```typescript
import { create } from 'zustand'
import type {
  GameState,
  GameAction,
  BattlePhase,
  ExplorationState,
  ExplorationAction,
  Portal,
  Item,
} from '../game/types'
import {
  initialExplorationState,
  explorationTransition,
} from '../game/ExplorationStateMachine'
import { getAreasByOcean, getAreaById } from '../data/areas'

// ==================== 探索相关 reducer ====================

function explorationReducer(state: ExplorationState, action: ExplorationAction): ExplorationState {
  return explorationTransition(state, action)
}

// ==================== 初始状态 ====================

const initialState: GameState = {
  gamePhase: 'title',
  currentOcean: null,
  players: [],
  unlockedOceans: ['east'],
  completedOceans: [],
  battle: null,
  totalScore: 0,
  exploration: null,
}

// ==================== 游戏 reducer ====================

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // ... 现有的 START_GAME, SELECT_OCEAN 等逻辑保持不变
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
      // ... 保持现有逻辑
      if (!state.battle || !state.battle.currentQuestion) return state
      const question = state.battle.currentQuestion
      const isCorrect = question.options[action.answerIndex]?.isCorrect ?? false

      const newBattleLog = [
        ...state.battle.battleLog,
        {
          type: (isCorrect ? 'correct' : 'wrong') as 'correct' | 'wrong',
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

    case 'NEXT_QUESTION':
      // ... 保持现有逻辑
      return state

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
      const oceanOrder = ['east', 'west', 'south', 'north', 'mysterious'] as const
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
        exploration: null,
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

// ==================== Store Interface ====================

interface GameStore extends GameState {
  dispatch: (action: GameAction) => void
  // 探索相关方法
  explorationDispatch: (action: ExplorationAction) => void
  startExploration: (oceanId: string) => void
  selectArea: (areaId: string) => void
  generatePortals: () => void
  receiveKey: (count: number) => void
  unlockArea: (areaId: string) => void
  checkDifficultyDowngrade: () => void
}

// ==================== 创建 Store ====================

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  dispatch: (action) => set((state) => gameReducer(state, action)),

  // 探索 dispatch
  explorationDispatch: (action) =>
    set((state) => {
      if (!state.exploration) return state
      const newExploration = explorationReducer(state.exploration, action)
      return { exploration: newExploration }
    }),

  // 开始探索
  startExploration: (oceanId) => {
    set({
      exploration: {
        ...initialExplorationState,
        phase: 'exploring',
        currentOcean: oceanId,
      },
      gamePhase: 'exploration',  // 新增探索模式
    })
  },

  // 选择区域
  selectArea: (areaId) => {
    const state = get()
    if (!state.exploration) return

    const area = getAreaById(areaId)
    if (!area) return

    // 检查钥匙
    if (area.requiredKeys > 0 && !state.exploration.unlockedAreas.includes(areaId)) {
      if (state.exploration.collectedKeys < area.requiredKeys) {
        get().explorationDispatch({
          type: 'EXPLORATION_ERROR',
          error: `需要 ${area.requiredKeys} 把钥匙`,
        })
        return
      }
    }

    get().explorationDispatch({ type: 'SELECT_AREA', areaId })
  },

  // 生成传送门
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

    // 生成2-3个传送门
    const portalCount = Math.random() > 0.5 ? 3 : 2
    const portals: Portal[] = []

    // 至少1个通向未完成区域
    if (unexploredAreas.length > 0) {
      const randomIndex = Math.floor(Math.random() * unexploredAreas.length)
      portals.push({
        id: `portal_${Date.now()}_0`,
        targetAreaId: unexploredAreas[randomIndex].id,
        type: 'normal',
      })
    }

    // 其余随机
    const availableTargets = [...unexploredAreas, ...completedAreas].filter(
      (a) => !portals.some((p) => p.targetAreaId === a.id)
    )

    while (portals.length < portalCount && availableTargets.length > 0) {
      const idx = Math.floor(Math.random() * availableTargets.length)
      const target = availableTargets.splice(idx, 1)[0]
      portals.push({
        id: `portal_${Date.now()}_${portals.length}`,
        targetAreaId: target.id,
        type: target.type === 'hidden' ? 'hidden' : 'normal',
      })
    }

    const seed = Date.now()
    get().explorationDispatch({ type: 'GENERATE_PORTALS', portals, seed })
  },

  // 接收钥匙（30%概率掉落）
  receiveKey: (count) => {
    get().explorationDispatch({ type: 'RECEIVE_KEY', count })
  },

  // 解锁区域
  unlockArea: (areaId) => {
    const state = get()
    if (!state.exploration) return
    if (state.exploration.collectedKeys < 1) return

    get().explorationDispatch({ type: 'UNLOCK_AREA', areaId })
  },

  // 检查是否需要降级难度
  checkDifficultyDowngrade: () => {
    const state = get()
    if (!state.exploration || !state.exploration.currentArea) return

    const failedAttempts = state.exploration.failedAttempts[state.exploration.currentArea] || 0
    if (failedAttempts >= 5) {
      // 触发降级逻辑
      console.log('Should downgrade difficulty for area:', state.exploration.currentArea)
      // TODO: 实现降级逻辑
    }
  },
}))
```

- [ ] **Step 2: 运行 TypeScript 编译检查**

Run: `cd "/Users/xihualiu/code/game for my children" && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 3: 提交**

```bash
git add src/store/gameStore.ts
git commit -m "feat: extend gameStore with exploration state management"
```

---

## Task 5: 探索地图 UI 组件

**Files:**
- Create: `src/components/game/ExplorationMap.tsx`
- Create: `src/components/game/AreaNode.tsx`
- Create: `src/components/game/Portal.tsx`

- [ ] **Step 1: 创建 AreaNode 组件**

创建 `src/components/game/AreaNode.tsx`：

```typescript
import { useGameStore } from '../../store/gameStore'
import { getAreaById, getDifficultyStars } from '../../data/areas'
import type { Area } from '../../game/types'

interface AreaNodeProps {
  areaId: string
  onClick?: (areaId: string) => void
}

export function AreaNode({ areaId, onClick }: AreaNodeProps) {
  const area = getAreaById(areaId)
  const exploration = useGameStore((state) => state.exploration)

  if (!area) return null

  const isUnlocked = area.requiredKeys === 0 || exploration?.unlockedAreas.includes(areaId)
  const isDefeated = exploration?.defeatedMiniBosses.includes(areaId)
  const isCurrent = exploration?.currentArea === areaId

  // 未解锁区域隐藏（探索式隐藏）
  if (!isUnlocked && !isDefeated) {
    return null
  }

  const handleClick = () => {
    if (isUnlocked && onClick) {
      onClick(areaId)
    }
  }

  // 根据区域类型渲染不同样式
  const getNodeStyle = () => {
    const base = {
      position: 'absolute' as const,
      left: `${area.position.x * 80 + 200}px`,
      top: `${area.position.z * 80 + 200}px`,
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: isUnlocked ? 'pointer' : 'not-allowed',
      transition: 'transform 0.2s',
      opacity: isDefeated && !isCurrent ? 0.6 : 1,
    }

    switch (area.type) {
      case 'boss':
        return { ...base, background: 'linear-gradient(135deg, #ff6b6b, #c92a2a)', border: '3px solid gold' }
      case 'hidden':
        return { ...base, background: 'linear-gradient(135deg, #9b59b6, #6c3483)', border: '2px dashed #9b59b6' }
      case 'treasure':
        return { ...base, background: 'linear-gradient(135deg, #ffd700, #f39c12)', border: '2px solid #ffd700' }
      default:
        return { ...base, background: 'linear-gradient(135deg, #4dabf7, #1c7ed6)', border: '2px solid #4dabf7' }
    }
  }

  return (
    <div
      style={getNodeStyle()}
      onClick={handleClick}
      title={`${area.name}\n难度: ${getDifficultyStars(area.difficulty)}\n${
        area.type === 'hidden' ? '需要钥匙' : ''
      }`}
    >
      {area.type === 'boss' && <span style={{ fontSize: '24px' }}>👑</span>}
      {area.type === 'hidden' && <span style={{ fontSize: '20px' }}>🔮</span>}
      {area.type === 'treasure' && <span style={{ fontSize: '20px' }}>📦</span>}
      {area.type === 'normal' && <span style={{ fontSize: '20px' }}>⚔️</span>}

      <span style={{ color: 'white', fontSize: '10px', marginTop: '4px', textAlign: 'center' }}>
        {area.name.length > 6 ? area.name.slice(0, 5) + '...' : area.name}
      </span>

      <span style={{ color: '#ffd700', fontSize: '10px' }}>
        {getDifficultyStars(area.difficulty)}
      </span>

      {isDefeated && (
        <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '16px' }}>
          ✅
        </span>
      )}

      {!isUnlocked && (
        <span style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '16px' }}>
          🔒
        </span>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 创建 Portal 组件**

创建 `src/components/game/Portal.tsx`：

```typescript
import type { Portal as PortalType } from '../../game/types'
import { getAreaById } from '../../data/areas'

interface PortalProps {
  portal: PortalType
  onClick: (portal: PortalType) => void
}

export function Portal({ portal, onClick }: PortalProps) {
  const targetArea = getAreaById(portal.targetAreaId)

  if (!targetArea) return null

  const getPortalColor = () => {
    switch (portal.type) {
      case 'hidden':
        return 'linear-gradient(135deg, #9b59b6, #6c3483)'
      case 'event':
        return 'linear-gradient(135deg, #f39c12, #d68910)'
      default:
        return 'linear-gradient(135deg, #00d9ff, #0097b2)'
    }
  }

  return (
    <div
      onClick={() => onClick(portal)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        background: getPortalColor(),
        borderRadius: '12px',
        cursor: 'pointer',
        minWidth: '100px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <span style={{ fontSize: '32px' }}>🌀</span>
      <span style={{ color: 'white', fontSize: '12px', marginTop: '8px' }}>
        {portal.type === 'hidden' ? '隐藏区域' : portal.type === 'event' ? '随机事件' : '传送'}
      </span>
      <span style={{ color: '#ffd700', fontSize: '10px', marginTop: '4px' }}>
        → {targetArea.name}
      </span>
    </div>
  )
}
```

- [ ] **Step 3: 创建 ExplorationMap 主组件**

创建 `src/components/game/ExplorationMap.tsx`：

```typescript
import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { getAreasByOcean } from '../../data/areas'
import { AreaNode } from './AreaNode'
import { Portal } from './Portal'

export default function ExplorationMap() {
  const exploration = useGameStore((state) => state.exploration)
  const dispatch = useGameStore.getState().dispatch

  const startExploration = useGameStore((state) => state.startExploration)
  const selectArea = useGameStore((state) => state.selectArea)
  const generatePortals = useGameStore((state) => state.generatePortals)
  const explorationDispatch = useGameStore((state) => state.explorationDispatch)

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
    if (exploration?.phase === 'moving') {
      const timer = setTimeout(() => {
        explorationDispatch({ type: 'MOVE_COMPLETE' })
      }, 1000) // 1秒移动动画
      return () => clearTimeout(timer)
    }
  }, [exploration?.phase])

  // 模拟遭遇判定
  useEffect(() => {
    if (exploration?.phase === 'encounter') {
      const area = areas.find((a) => a.id === exploration.currentArea)
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
    }
  }, [exploration?.phase])

  // 战斗胜利后生成传送门
  useEffect(() => {
    if (exploration?.phase === 'victory') {
      // 30% 概率掉落钥匙
      if (Math.random() < 0.3) {
        explorationDispatch({ type: 'RECEIVE_KEY', count: 1 })
      }
      // 生成传送门
      generatePortals()
    }
  }, [exploration?.phase])

  // 宝箱开启
  useEffect(() => {
    if (exploration?.phase === 'treasure') {
      const treasures = [{ id: 'treasure_1', name: '金币 x10', type: 'consumable' as const }]
      explorationDispatch({ type: 'OPEN_TREASURE', treasures })
    }
  }, [exploration?.phase])

  if (!exploration) {
    return (
      <div className="exploration-map">
        <h2>加载中...</h2>
      </div>
    )
  }

  return (
    <div className="exploration-map" style={{ position: 'relative', width: '600px', height: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center' }}>🗺️ {exploration.currentOcean} 探索地图</h2>

      {/* 玩家状态 */}
      <div className="player-status" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div>🔑 钥匙: {exploration.collectedKeys}</div>
        <div>⚔️ 已击败: {exploration.defeatedMiniBosses.length} / 9</div>
      </div>

      {/* 地图区域 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {areas.map((area) => (
          <AreaNode key={area.id} areaId={area.id} onClick={handleAreaClick} />
        ))}

        {/* 连接线（简化版） */}
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
                  x1={area.position.x * 80 + 240}
                  y1={area.position.z * 80 + 240}
                  x2={target.position.x * 80 + 240}
                  y2={target.position.z * 80 + 240}
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
        {exploration.phase === 'victory' && <span>战斗胜利！</span>}
        {exploration.phase === 'portal_appear' && <span>选择传送门</span>}
        {exploration.phase === 'error' && <span style={{ color: 'red' }}>错误: {exploration.lastError}</span>}
      </div>

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
    </div>
  )
}
```

- [ ] **Step 4: 提交**

```bash
git add src/components/game/AreaNode.tsx src/components/game/Portal.tsx src/components/game/ExplorationMap.tsx
git commit -m "feat: add exploration map UI components"
```

---

## Task 6: 集成到 Game 主组件

**Files:**
- Modify: `src/components/game/Game.tsx`

- [ ] **Step 1: 更新 Game.tsx 添加探索模式**

修改 `src/components/game/Game.tsx`：

```typescript
import { useGameStore } from '../../store/gameStore'
import TitleScreen from './TitleScreen'
import WorldMap from './WorldMap'
import Battle from './Battle/Battle'
import Result from './Result'
import ExplorationMap from './ExplorationMap'  // 新增

export default function Game() {
  const gamePhase = useGameStore((state) => state.gamePhase)
  const startExploration = useGameStore((state) => state.startExploration)

  // 处理进入探索
  const handleEnterExploration = (oceanId: string) => {
    startExploration(oceanId)
  }

  // 渲染对应阶段的 UI
  switch (gamePhase) {
    case 'title':
      return <TitleScreen />

    case 'world_map':
      return (
        <div>
          <WorldMap onEnterOcean={handleEnterExploration} />
        </div>
      )

    case 'exploration':
      return <ExplorationMap />

    case 'battle':
      return <Battle />

    case 'result':
      return <Result />

    case 'game_over':
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>游戏结束</h1>
          <button onClick={() => window.location.reload()}>重新开始</button>
        </div>
      )

    default:
      return <TitleScreen />
  }
}
```

- [ ] **Step 2: 更新 WorldMap 支持进入探索**

修改 `src/components/game/WorldMap.tsx` 添加 `onEnterOcean` prop：

```typescript
// 在 WorldMap 组件中添加 onEnterOcean prop
interface WorldMapProps {
  onEnterOcean: (oceanId: string) => void
}

export default function WorldMap({ onEnterOcean }: WorldMapProps) {
  // ... 现有代码 ...

  const handleOceanSelect = (oceanId: string) => {
    // 替换原来的 START_BATTLE 逻辑
    onEnterOcean(oceanId)
  }

  // ... 其余代码保持不变 ...
}
```

- [ ] **Step 3: 运行 TypeScript 编译检查**

Run: `cd "/Users/xihualiu/code/game for my children" && npx tsc --noEmit`
Expected: 无类型错误

- [ ] **Step 4: 提交**

```bash
git add src/components/game/Game.tsx src/components/game/WorldMap.tsx
git commit -m "feat: integrate exploration mode into Game component"
```

---

## Task 7: 难度降级机制

**Files:**
- Modify: `src/store/gameStore.ts`
- Create: `src/game/DifficultyManager.ts`

- [ ] **Step 1: 创建难度管理器**

创建 `src/game/DifficultyManager.ts`：

```typescript
import type { ExplorationState } from './types'

const DIFFICULTY_ADJUSTMENT = {
  maxAttemptsBeforeDowngrade: 5,
  downgradeLevel: 1,  // 降一级
}

export interface DifficultyRecord {
  areaId: string
  originalDifficulty: 1 | 2 | 3
  currentDifficulty: 1 | 2 | 3
  failedAttempts: number
}

export class DifficultyManager {
  private difficulties: Map<string, DifficultyRecord> = new Map()

  // 初始化区域难度
  initializeArea(areaId: string, difficulty: 1 | 2 | 3): void {
    if (!this.difficulties.has(areaId)) {
      this.difficulties.set(areaId, {
        areaId,
        originalDifficulty: difficulty,
        currentDifficulty: difficulty,
        failedAttempts: 0,
      })
    }
  }

  // 记录失败
  recordFailure(areaId: string): boolean {
    // 返回是否触发了降级
    const record = this.difficulties.get(areaId)
    if (!record) return false

    record.failedAttempts++

    if (
      record.failedAttempts >= DIFFICULTY_ADJUSTMENT.maxAttemptsBeforeDowngrade &&
      record.currentDifficulty > 1
    ) {
      record.currentDifficulty = (record.currentDifficulty - DIFFICULTY_ADJUSTMENT.downgradeLevel) as 1 | 2 | 3
      record.failedAttempts = 0  // 重置计数
      return true  // 触发了降级
    }

    return false
  }

  // 成功后重置计数
  resetOnSuccess(areaId: string): void {
    const record = this.difficulties.get(areaId)
    if (record) {
      record.failedAttempts = 0
    }
  }

  // 获取当前难度
  getCurrentDifficulty(areaId: string): 1 | 2 | 3 | null {
    return this.difficulties.get(areaId)?.currentDifficulty ?? null
  }

  // 是否已降级
  hasBeenDowngraded(areaId: string): boolean {
    const record = this.difficulties.get(areaId)
    return record ? record.currentDifficulty < record.originalDifficulty : false
  }
}

// 单例
export const difficultyManager = new DifficultyManager()
```

- [ ] **Step 2: 在 store 中集成降级检查**

修改 `src/store/gameStore.ts` 中的 `checkDifficultyDowngrade`：

```typescript
import { difficultyManager } from '../game/DifficultyManager'

// 在 GameStore 中添加
checkDifficultyDowngrade: () => {
  const state = get()
  if (!state.exploration || !state.exploration.currentArea) return

  const area = getAreaById(state.exploration.currentArea)
  if (!area) return

  // 初始化难度记录
  difficultyManager.initializeArea(state.exploration.currentArea, area.difficulty)

  // 检查是否需要降级
  const downgraded = difficultyManager.recordFailure(state.exploration.currentArea)
  if (downgraded) {
    const newDifficulty = difficultyManager.getCurrentDifficulty(state.exploration.currentArea)
    console.log(
      `难度已从 ${area.difficulty} 降为 ${newDifficulty} (区域: ${state.exploration.currentArea})`
    )
    // TODO: 触发 UI 提示，通知玩家难度已降低
  }
},
```

- [ ] **Step 3: 创建测试**

创建 `src/game/DifficultyManager.test.ts`：

```typescript
import { describe, it, expect } from 'vitest'
import { DifficultyManager } from './DifficultyManager'

describe('DifficultyManager', () => {
  const manager = new DifficultyManager()

  it('应正确初始化区域难度', () => {
    manager.initializeArea('test_area', 2)
    expect(manager.getCurrentDifficulty('test_area')).toBe(2)
  })

  it('失败5次应降级', () => {
    manager.initializeArea('test_area_2', 2)

    // 失败4次不应降级
    for (let i = 0; i < 4; i++) {
      const downgraded = manager.recordFailure('test_area_2')
      expect(downgraded).toBe(false)
    }

    // 第5次失败应降级
    const downgraded = manager.recordFailure('test_area_2')
    expect(downgraded).toBe(true)
    expect(manager.getCurrentDifficulty('test_area_2')).toBe(1)
  })

  it('成功后应重置计数', () => {
    manager.initializeArea('test_area_3', 3)

    // 失败4次
    for (let i = 0; i < 4; i++) {
      manager.recordFailure('test_area_3')
    }

    // 成功
    manager.resetOnSuccess('test_area_3')

    // 再失败4次不应降级（因为计数器被重置）
    for (let i = 0; i < 4; i++) {
      const downgraded = manager.recordFailure('test_area_3')
      expect(downgraded).toBe(false)
    }

    // 第5次失败才会降级
    const downgraded = manager.recordFailure('test_area_3')
    expect(downgraded).toBe(true)
  })

  it('难度1不应再降级', () => {
    manager.initializeArea('test_area_4', 1)

    // 失败5次
    for (let i = 0; i < 5; i++) {
      manager.recordFailure('test_area_4')
    }

    // 难度仍为1
    expect(manager.getCurrentDifficulty('test_area_4')).toBe(1)
  })

  it('hasBeenDowngraded 应正确反映降级状态', () => {
    manager.initializeArea('test_area_5', 2)
    expect(manager.hasBeenDowngraded('test_area_5')).toBe(false)

    // 降级
    for (let i = 0; i < 5; i++) {
      manager.recordFailure('test_area_5')
    }

    expect(manager.hasBeenDowngraded('test_area_5')).toBe(true)
  })
})
```

- [ ] **Step 4: 运行测试**

Run: `cd "/Users/xihualiu/code/game for my children" && npm test -- src/game/DifficultyManager.test.ts`
Expected: 5 tests pass

- [ ] **Step 5: 提交**

```bash
git add src/game/DifficultyManager.ts src/game/DifficultyManager.test.ts
git commit -m "feat: add difficulty downgrade mechanism"
```

---

## Task 8: E2E 验证

**Files:**
- Modify: `src/components/game/ExplorationMap.tsx` (修复可能的 bug)

- [ ] **Step 1: 启动开发服务器**

Run: `cd "/Users/xihualiu/code/game for my children" && npm run dev`

- [ ] **Step 2: 手动测试流程**

测试流程：
1. 进入标题画面 → 开始游戏
2. 选择东大洋 → 进入探索模式
3. 点击 `east_math_1` 区域 → 应该开始移动
4. 等待遭遇判定 → 应该触发战斗
5. 战斗胜利 → 应该获得钥匙或传送门
6. 选择传送门 → 应该返回探索模式

- [ ] **Step 3: 验证难度降级**

1. 连续5次挑战同一区域失败
2. 检查控制台是否输出降级信息

- [ ] **Step 4: 提交最终代码**

```bash
git add .
git commit -m "feat: complete exploration system implementation"
```

---

## 验收标准检查清单

- [ ] 东大洋13个区域正确显示
- [ ] 点击区域开始探索流程
- [ ] 移动动画正确播放
- [ ] 遭遇判定正确执行
- [ ] 战斗胜利后掉落钥匙（30%概率）
- [ ] 传送门正确生成（2-3个，至少1个通向未完成）
- [ ] 隐藏区域需要钥匙解锁
- [ ] 难度降级机制正常工作
- [ ] 所有测试通过
