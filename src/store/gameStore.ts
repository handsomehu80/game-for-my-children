import { create } from 'zustand'
import type {
  GameState,
  GameAction,
  BattlePhase,
  ExplorationState,
  ExplorationAction,
  Portal,
} from '../game/types'
import {
  initialExplorationState,
  explorationTransition,
} from '../game/ExplorationStateMachine'
import { getAreasByOcean, getAreaById } from '../data/areas'
import { getRandomQuestion } from '../game/QuestionSelector'

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
      if (!state.battle || !state.battle.currentQuestion) return state
      const question = state.battle.currentQuestion
      // P0-1: Explicit boundary check
      const validAnswerCount = question.options.length
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