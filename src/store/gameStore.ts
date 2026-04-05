import { create } from 'zustand'
import type {
  GameState,
  GameAction,
  BattlePhase,
  ExplorationState,
  ExplorationAction,
  Portal,
  Area,
} from '../game/types'
import {
  initialExplorationState,
  explorationTransition,
} from '../game/ExplorationStateMachine'
import { getAreasByOcean, getAreaById } from '../data/areas'
import { getRandomQuestion } from '../game/QuestionSelector'
import { SeededRandom, generatePortalSeed } from '../game/utils/seededRandom'

// ==================== 探索相关 reducer ====================

function explorationReducer(state: ExplorationState, action: ExplorationAction): ExplorationState {
  return explorationTransition(state, action)
}

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
      // P0-5: Enhanced null/undefined handling
      if (!state.battle) return state
      if (!state.battle.currentQuestion) return state
      if (!state.battle.currentQuestion.options) return state

      const question = state.battle.currentQuestion
      // P0-5: Guard against empty options
      const validAnswerCount = question.options.length
      if (validAnswerCount === 0) return state

      // P0-1: Explicit boundary check
      const answerIndex = Math.min(Math.max(0, action.answerIndex), validAnswerCount - 1)
      const isCorrect = question.options[answerIndex]?.isCorrect ?? false

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

    case 'NEXT_QUESTION': {
      if (!state.battle || !state.currentOcean) return state

      const question = getRandomQuestion({ oceanId: state.currentOcean })
      if (!question) return state // No more questions available

      return {
        ...state,
        battle: {
          ...state.battle,
          currentQuestion: question,
          phase: 'showing_question',
        },
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
      gamePhase: 'exploration',
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

    // P1-5: Use seeded random for reproducible portal generation
    const timestamp = Date.now()
    const seed = generatePortalSeed(state.exploration.currentOcean!, timestamp)
    const rng = new SeededRandom(seed)

    // P1-2: Guaranteed key drop - every 5 victories = 1 key
    const newConsecutiveVictories = state.exploration.consecutiveVictoriesWithoutKey + 1
    let keyDrop = 0

    if (currentArea.type === 'boss') {
      keyDrop = 1  // Boss always drops
    } else if (rng.chance(0.3)) {
      keyDrop = 1  // 30% normal drop
    }

    // P1-2: Guaranteed key every 5 victories
    if (newConsecutiveVictories >= 5 && keyDrop === 0) {
      keyDrop = 1
      get().explorationDispatch({ type: 'RESET_VICTORY_COUNTER' })
    } else if (keyDrop > 0) {
      get().explorationDispatch({ type: 'RESET_VICTORY_COUNTER' })
    }

    // Award key if dropped
    if (keyDrop > 0) {
      get().explorationDispatch({ type: 'RECEIVE_KEY', count: keyDrop })
    }

    const areas = getAreasByOcean(state.exploration.currentOcean!)

    // 生成2-3个传送门
    const portalCount = rng.chance(0.5) ? 3 : 2
    const portals: Portal[] = []

    // 3. 打败完boss后出现传送门要能传送到新的区域（按顺序）
    if (currentArea.type === 'boss') {
      // 大洋顺序：东洋 → 西洋 → 南热洋 → 北冰洋 → 神秘洋
      const oceanSequence: string[] = ['east', 'west', 'southHot', 'northIce', 'mysterious']
      const currentOceanId = state.exploration!.currentOcean ?? 'east'
      const currentIndex = oceanSequence.indexOf(currentOceanId)
      const nextOceanId = currentIndex >= 0 && currentIndex < oceanSequence.length - 1
        ? oceanSequence[currentIndex + 1]
        : undefined

      if (nextOceanId) {
        // 下一个大洋的传送门
        portals.push({
          id: `portal_${timestamp}_0`,
          targetAreaId: nextOceanId,
          type: 'ocean_portal',
        })
      }
      // 如果没有更多大洋，生成通往已完成区域的传送门作为备选
      if (!nextOceanId) {
        const completedAreas = areas.filter((a) =>
          state.exploration!.defeatedMiniBosses.includes(a.id)
        )
        while (portals.length < portalCount && completedAreas.length > 0) {
          const target = rng.pick(completedAreas)
          if (!target) break
          const idx = completedAreas.indexOf(target)
          if (idx > -1) completedAreas.splice(idx, 1)
          portals.push({
            id: `portal_${timestamp}_${portals.length}`,
            targetAreaId: target.id,
            type: target.type === 'hidden' ? 'hidden' : 'normal',
          })
        }
      }
    } else {
      // 1. 首次进入大洋时，传送门通向第一个岛屿
      // 判断是否是首次进入（没有任何岛屿完成且没有访问过任何岛屿）
      const isFirstEntry = state.exploration!.defeatedMiniBosses.length === 0 &&
        !state.exploration!.visitedAreas.some(v => v !== currentArea.id)

      if (isFirstEntry) {
        // 首次进入：传送门通向第一个入门的普通岛屿
        const firstIsland = areas.find((a) => a.type === 'normal' && a.difficulty === 1)
        if (firstIsland) {
          portals.push({
            id: `portal_${timestamp}_0`,
            targetAreaId: firstIsland.id,
            type: 'normal',
          })
        }
      } else {
        // === 新可达性算法 ===
        // 计算所有可达的未完成岛屿
        const reachableAreas: Set<string> = new Set()

        // 1. 首先添加同类型下一阶岛屿
        const sameTypeNext = areas.find(a =>
          a.knowledgeArea === currentArea.knowledgeArea &&
          a.difficulty === currentArea.difficulty + 1 &&
          !state.exploration!.defeatedMiniBosses.includes(a.id) &&
          a.type !== 'boss'
        )
        if (sameTypeNext) {
          reachableAreas.add(sameTypeNext.id)
        }

        // 2. 处理相邻岛屿的可达性
        for (const connId of currentArea.connections) {
          const connArea = areas.find(a => a.id === connId)
          if (!connArea || state.exploration!.defeatedMiniBosses.includes(connId) || connArea.type === 'boss') {
            continue
          }

          // 检查相邻岛屿是否是更低难度
          const isLowerDifficulty = connArea.difficulty < currentArea.difficulty

          if (isLowerDifficulty) {
            // 如果相邻是更低难度且未完成，只保留这个连接
            reachableAreas.add(connId)
          } else if (connArea.difficulty === currentArea.difficulty) {
            // 如果相邻是同级难度，检查其下方连接是否都已完成
            const connLowerConnections = connArea.connections
              .map(id => areas.find(a => a.id === id))
              .filter(a => a && a.difficulty < connArea.difficulty)

            const allLowerCompleted = connLowerConnections.every(a =>
              state.exploration!.defeatedMiniBosses.includes(a!.id)
            )

            if (allLowerCompleted) {
              // 下方都已完成，打开这个同级相邻岛屿
              reachableAreas.add(connId)
            } else {
              // 下方未完成，只保留最低难度的连接
              const lowestDifficulty = connLowerConnections
                .filter(a => !state.exploration!.defeatedMiniBosses.includes(a!.id))
                .sort((a, b) => (a!.difficulty || 0) - (b!.difficulty || 0))[0]
              if (lowestDifficulty) {
                reachableAreas.add(lowestDifficulty.id)
              }
            }
          }
        }

        // 3. 宝藏和隐藏岛屿随机增加（30%概率不出现）
        const hiddenAndTreasureAreas = areas.filter(a =>
          (a.type === 'hidden' || a.type === 'treasure') &&
          !state.exploration!.defeatedMiniBosses.includes(a.id)
        )
        hiddenAndTreasureAreas.forEach(a => {
          if (rng.chance(0.7)) {  // 70%概率出现
            reachableAreas.add(a.id)
          }
        })

        // 4. 从可达岛屿中选择传送门目标
        const reachableAreaList = Array.from(reachableAreas)
          .map(id => areas.find(a => a.id === id))
          .filter(a => a) as Area[]

        // 随机打乱顺序
        const shuffled = [...reachableAreaList].sort(() => rng.next() - 0.5)

        // 选择最多portalCount个传送门
        for (let i = 0; i < Math.min(portalCount, shuffled.length); i++) {
          const target = shuffled[i]
          if (target) {
            portals.push({
              id: `portal_${timestamp}_${portals.length}`,
              targetAreaId: target.id,
              type: target.type === 'hidden' ? 'hidden' : target.type === 'treasure' ? 'treasure' : 'normal',
            })
          }
        }
      }
    }

    get().explorationDispatch({ type: 'GENERATE_PORTALS', portals, seed })
  },

  // 接收钥匙（30%概率掉落） - 现在由 generatePortals 内部调用
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