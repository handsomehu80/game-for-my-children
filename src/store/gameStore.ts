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
        // 普通岛屿/隐藏区域/宝箱完成后：
        // 传送门只通向当前岛屿相邻的未完成岛屿
        const connectedAreas = currentArea.connections
          .map(connId => areas.find(a => a.id === connId))
          .filter(a => a && !state.exploration!.defeatedMiniBosses.includes(a!.id) && a!.type !== 'boss') as Area[]

        // 宝藏和隐藏岛屿有随机概率不出现（30%概率被跳过）
        const eligibleAreas = connectedAreas.filter(a => {
          if (a.type === 'treasure' || a.type === 'hidden') {
            return rng.chance(0.7)  // 70%概率出现
          }
          return true  // 普通岛屿必定出现
        })

        if (eligibleAreas.length > 0) {
          // 随机选择1个作为传送门目标
          const target = rng.pick(eligibleAreas)
          if (target) {
            portals.push({
              id: `portal_${timestamp}_0`,
              targetAreaId: target.id,
              type: target.type === 'hidden' ? 'hidden' : target.type === 'treasure' ? 'treasure' : 'normal',
            })
          }
        }

        // 如果有更多相邻未完成区域，补充更多传送门（随机补充，最多portalCount个）
        const remainingAreas = eligibleAreas.filter(
          (a) => !portals.some((p) => p.targetAreaId === a.id)
        )
        while (portals.length < portalCount && remainingAreas.length > 0) {
          const target = rng.pick(remainingAreas)
          if (!target) break
          const idx = remainingAreas.indexOf(target)
          if (idx > -1) remainingAreas.splice(idx, 1)
          portals.push({
            id: `portal_${timestamp}_${portals.length}`,
            targetAreaId: target.id,
            type: target.type === 'hidden' ? 'hidden' : target.type === 'treasure' ? 'treasure' : 'normal',
          })
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