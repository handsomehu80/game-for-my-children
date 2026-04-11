import { create } from 'zustand'
import type {
  GameState,
  GameAction,
  BattlePhase,
  ExplorationState,
  ExplorationAction,
  Portal,
  SaveSlot,
  SaveSlotInfo,
} from '../game/types'
import { safeSetItem, safeGetItem } from '../utils/storage'
import {
  initialExplorationState,
  explorationTransition,
} from '../game/ExplorationStateMachine'
import { getAreasByOcean, getAreaById } from '../data/areas'
import { getQuestionForBattle } from '../game/QuestionSelector'
import { SeededRandom, generatePortalSeed } from '../game/utils/seededRandom'

// ==================== SaveSlot validation ====================

/**
 * Type guard to validate SaveSlot structure
 * Checks nested properties to prevent runtime errors from malformed save data
 */
function isValidSaveSlot(data: unknown): data is SaveSlot {
  if (!data || typeof data !== 'object') return false

  const slot = data as Record<string, unknown>

  // Validate version
  if (slot.version !== 1) return false

  // Validate gameState
  if (!slot.gameState || typeof slot.gameState !== 'object') return false
  const gameState = slot.gameState as Record<string, unknown>
  if (typeof gameState.currentOcean !== 'string' && gameState.currentOcean !== null) return false
  if (!Array.isArray(gameState.players)) return false
  if (typeof gameState.selectedGrade !== 'number') return false
  if (typeof gameState.selectedSubject !== 'string') return false
  if (typeof gameState.totalScore !== 'number') return false

  // Validate players array structure
  for (const player of gameState.players) {
    if (!player || typeof player !== 'object') return false
    const p = player as Record<string, unknown>
    if (typeof p.id !== 'string') return false
    if (typeof p.name !== 'string') return false
    if (typeof p.hp !== 'number') return false
    if (typeof p.maxHp !== 'number') return false
  }

  // Validate explorationState
  if (!slot.explorationState || typeof slot.explorationState !== 'object') return false
  const explorationState = slot.explorationState as Record<string, unknown>
  if (typeof explorationState.currentOcean !== 'string' && explorationState.currentOcean !== null) return false
  if (typeof explorationState.currentArea !== 'string' && explorationState.currentArea !== null) return false
  if (!Array.isArray(explorationState.visitedAreas)) return false
  if (!Array.isArray(explorationState.defeatedMiniBosses)) return false
  if (!Array.isArray(explorationState.unlockedAreas)) return false
  if (!Array.isArray(explorationState.reachableAreas)) return false
  if (typeof explorationState.collectedKeys !== 'number') return false
  if (!Array.isArray(explorationState.collectedItems)) return false
  if (typeof explorationState.consecutiveVictoriesWithoutKey !== 'number') return false

  // Validate globalProgress
  if (!slot.globalProgress || typeof slot.globalProgress !== 'object') return false
  const globalProgress = slot.globalProgress as Record<string, unknown>
  if (!Array.isArray(globalProgress.unlockedOceans)) return false
  if (!Array.isArray(globalProgress.completedOceans)) return false

  // Validate savedAt
  if (typeof slot.savedAt !== 'number') return false

  return true
}

// ==================== 探索相关 reducer ====================

function explorationReducer(state: ExplorationState, action: ExplorationAction): ExplorationState {
  return explorationTransition(state, action)
}

const initialState: GameState & { currentSaveSlot: number } = {
  gamePhase: 'title',
  currentOcean: null,
  players: [],
  unlockedOceans: ['east'],
  completedOceans: [],
  battle: null,
  totalScore: 0,
  exploration: null,
  explorationBattle: null,
  selectedGrade: 1,
  selectedSubject: 'math',
  currentSaveSlot: 0,
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        players: action.players,
        gamePhase: 'world_map',
        currentOcean: 'east',
        selectedGrade: action.grade ?? state.selectedGrade,
        selectedSubject: action.subject ?? state.selectedSubject,
      }

    case 'SELECT_OCEAN':
      if (!state.unlockedOceans.includes(action.ocean)) return state
      return {
        ...state,
        currentOcean: action.ocean,
      }

    case 'START_BATTLE':
      // 兼容旧版：players 参数可能不存在
      const battlePlayers = action.players ?? [
        { id: 'player1', name: state.players[0]?.name ?? '玩家', grade: state.selectedGrade }
      ]
      // 多人模式时可以使用 action.currentPlayerIndex 指定先手玩家
      const initialPlayerIndex = action.currentPlayerIndex ?? 0
      const initialBattlePlayer = battlePlayers[initialPlayerIndex] ?? battlePlayers[0]
      // 将 BattlePlayer 转换为 Player（用于兼容旧版 battle.player）
      const initialPlayer = {
        ...initialBattlePlayer,
        hp: 100,
        maxHp: 100,
        comboCount: 0,
      }

      return {
        ...state,
        gamePhase: 'battle',
        battle: {
          phase: 'showing_question' as BattlePhase,
          player: initialPlayer,
          players: battlePlayers,
          currentPlayerIndex: initialPlayerIndex,
          teamHP: 100, // 队伍共享HP
          maxTeamHP: 100, // 最大HP
          monster: action.monster,
          currentQuestion: action.question,
          comboCount: 0,
          isPlayerTurn: true,
          battleLog: [],
          activeSkills: [],
          // 初始化已使用的问题ID列表，包含当前题目
          usedQuestionIds: action.question ? [action.question.id] : [],
        },
        explorationBattle: action.explorationContext ?? null,
      }

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

    case 'NEXT_QUESTION': {
      if (!state.battle || !state.currentOcean) return state

      const { players, currentPlayerIndex, usedQuestionIds } = state.battle

      // 计算下一个玩家索引
      // 单人模式：保持0
      // 双人模式：0→1, 1→0
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

      // 选题（按下一个玩家的年级），排除已使用的问题
      const question = getQuestionForBattle({
        oceanId: state.currentOcean,
        battle: { ...state.battle, currentPlayerIndex: nextPlayerIndex },
        subject,
        selectedGrade: state.selectedGrade,
        excludeIds: usedQuestionIds,
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
          // 添加新问题到已使用列表
          usedQuestionIds: [...usedQuestionIds, question.id],
        },
      }
    }

    case 'ENABLE_ANSWERING': {
      if (!state.battle) return state
      return {
        ...state,
        battle: {
          ...state.battle,
          phase: 'answering' as BattlePhase,
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

    case 'END_EXPLORATION_BATTLE': {
      if (!state.exploration || !state.explorationBattle) {
        // No exploration context, fallback to RESET_GAME
        return { ...initialState, gamePhase: 'game_over' }
      }

      const { areaId } = state.explorationBattle
      const exploration = state.exploration

      if (action.victory) {
        // Increment victory counter and dispatch BATTLE_WIN
        const updatedExploration = explorationTransition(exploration, { type: 'INCREMENT_VICTORY_COUNTER' })
        const finalExploration = explorationTransition(updatedExploration, { type: 'BATTLE_WIN', areaId })

        // Generate portals after victory
        const portalSeed = generatePortalSeed(exploration.currentOcean || 'east', Date.now())
        const rng = new SeededRandom(portalSeed)
        const availablePortals: Portal[] = rng.next() < 0.3
          ? (['east_boss', 'west_boss', 'south_boss', 'north_boss', 'mysterious_boss']
              .filter(id => {
                const bossArea = getAreaById(id)
                return bossArea && finalExploration.defeatedMiniBosses.includes(id)
              })
              .map(id => ({ id, targetAreaId: id, type: 'ocean_portal' as const }))
              .slice(0, 2))
          : []

        return {
          ...state,
          gamePhase: 'exploration',
          battle: null,
          exploration: {
            ...finalExploration,
            availablePortals,
          },
          explorationBattle: null,
        }
      } else {
        // Defeat - dispatch BATTLE_LOSE
        const updatedExploration = explorationTransition(exploration, { type: 'BATTLE_LOSE' })
        return {
          ...state,
          gamePhase: 'exploration',
          battle: null,
          exploration: updatedExploration,
          explorationBattle: null,
        }
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
  currentSaveSlot: number
  dispatch: (action: GameAction) => void
  // 探索相关方法
  explorationDispatch: (action: ExplorationAction) => void
  startExploration: (oceanId: string) => void
  selectArea: (areaId: string) => void
  generatePortals: () => void
  receiveKey: (count: number) => void
  unlockArea: (areaId: string) => void
  checkDifficultyDowngrade: () => void
  // Save/Load methods
  saveGame: (slotIndex: number) => void
  loadGame: (slotIndex: number) => boolean
  deleteSave: (slotIndex: number) => void
  getSaveSlotInfo: () => SaveSlotInfo[]
  hasSavedGames: () => boolean
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
    // 获取该大洋的所有岛屿
    const areas = getAreasByOcean(oceanId)
    // 初始化可达区域：所有难度1的普通岛屿
    const initialReachable = areas
      .filter(a => a.type === 'normal' && a.difficulty === 1)
      .map(a => a.id)

    set({
      exploration: {
        ...initialExplorationState,
        phase: 'exploring',
        currentOcean: oceanId,
        reachableAreas: initialReachable,
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
    if (!state.exploration || !state.exploration.currentOcean) return

    const areas = getAreasByOcean(state.exploration.currentOcean!)
    const portals: Portal[] = []

    // P1-5: Use seeded random for reproducible portal generation
    const timestamp = Date.now()
    const seed = generatePortalSeed(state.exploration.currentOcean, timestamp)
    const rng = new SeededRandom(seed)

    // 首次进入大洋条件: defeatedMiniBosses.length === 0 && visitedAreas.length <= 1
    // 首次进入时 currentArea 可能为 null，需要单独处理
    const isFirstEntry = state.exploration.defeatedMiniBosses.length === 0 &&
      state.exploration.visitedAreas.length <= 1

    // 大洋顺序: east → west → southHot → northIce → mysterious
    const oceanSequence: string[] = ['east', 'west', 'southHot', 'northIce', 'mysterious']

    if (isFirstEntry) {
      // 首次进入大洋 → 100% 通往入门岛屿
      const firstIsland = areas.find(a => a.type === 'normal' && a.difficulty === 1)
      if (firstIsland) {
        portals.push({
          id: `portal_${timestamp}_0`,
          targetAreaId: firstIsland.id,
          type: 'normal',
        })
      }
      // 首次进入时不需要生成钥匙，直接返回传送门
      get().explorationDispatch({ type: 'GENERATE_PORTALS', portals, seed })
      return
    }

    // 后续逻辑需要 currentArea
    if (!state.exploration.currentArea) return

    const currentArea = getAreaById(state.exploration.currentArea)
    if (!currentArea) return

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

    if (currentArea.type === 'boss') {
      // Boss胜利 → 100% 通往新大洋
      const currentOceanId = state.exploration.currentOcean ?? 'east'
      const currentIndex = oceanSequence.indexOf(currentOceanId)
      const nextOceanId = currentIndex >= 0 && currentIndex < oceanSequence.length - 1
        ? oceanSequence[currentIndex + 1]
        : undefined

      if (nextOceanId) {
        portals.push({
          id: `portal_${timestamp}_0`,
          targetAreaId: nextOceanId,
          type: 'ocean_portal',
        })
      } else {
        // 最终Boss：显示通往已完成岛屿的传送门作为备选
        const completedAreas = areas.filter(a =>
          state.exploration!.defeatedMiniBosses.includes(a.id)
        )
        completedAreas.forEach(area => {
          portals.push({
            id: `portal_${timestamp}_${portals.length}`,
            targetAreaId: area.id,
            type: area.type === 'hidden' ? 'hidden' : 'normal',
          })
        })
      }
    } else {
      // 宝藏岛屿 - 30% 概率出现
      const treasureIslands = areas.filter(a =>
        a.type === 'treasure' && !state.exploration!.defeatedMiniBosses.includes(a.id)
      )
      if (treasureIslands.length > 0 && rng.chance(0.3)) {
        const target = rng.pick(treasureIslands)
        if (target) {
          portals.push({ id: `portal_${timestamp}_0`, targetAreaId: target.id, type: 'treasure' })
        }
      }

      // 隐藏岛屿 - 持有钥匙时 50% 概率出现
      if (state.exploration.collectedKeys > 0) {
        const hiddenIslands = areas.filter(a =>
          a.type === 'hidden' && !state.exploration!.defeatedMiniBosses.includes(a.id)
        )
        if (hiddenIslands.length > 0 && rng.chance(0.5)) {
          const target = rng.pick(hiddenIslands)
          if (target) {
            portals.push({ id: `portal_${timestamp}_${portals.length}`, targetAreaId: target.id, type: 'hidden' })
          }
        }
      }
    }
    // 否则不显示传送门，玩家通过地图连接访问岛屿

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

  // ==================== Save/Load Methods ====================

  saveGame: (slotIndex) => {
    const state = get()
    if (!state.exploration) return

    const slot: SaveSlot = {
      slotIndex,
      gameState: {
        currentOcean: state.currentOcean,
        players: state.players,
        selectedGrade: state.selectedGrade,
        selectedSubject: state.selectedSubject,
        totalScore: state.totalScore,
      },
      explorationState: {
        currentOcean: state.exploration.currentOcean,
        currentArea: state.exploration.currentArea,
        visitedAreas: state.exploration.visitedAreas,
        defeatedMiniBosses: state.exploration.defeatedMiniBosses,
        unlockedAreas: state.exploration.unlockedAreas,
        reachableAreas: state.exploration.reachableAreas,
        collectedKeys: state.exploration.collectedKeys,
        collectedItems: state.exploration.collectedItems,
        consecutiveVictoriesWithoutKey: state.exploration.consecutiveVictoriesWithoutKey,
      },
      globalProgress: {
        unlockedOceans: state.unlockedOceans,
        completedOceans: state.completedOceans,
      },
      savedAt: Date.now(),
      version: 1,
    }

    safeSetItem('save_' + slotIndex, JSON.stringify(slot))
    set({ currentSaveSlot: slotIndex })
  },

  loadGame: (slotIndex) => {
    const data = safeGetItem('save_' + slotIndex)
    if (!data) return false

    try {
      const parsed = JSON.parse(data)

      // Validate save slot structure using type guard
      if (!isValidSaveSlot(parsed)) return false

      const slot = parsed
      const { gameState, explorationState, globalProgress } = slot

      // Determine game phase based on currentArea
      const gamePhase = explorationState.currentArea === null ? 'world_map' : 'exploration'

      // Reset players HP to maxHp
      const playersWithRestoredHP = gameState.players.map(p => ({ ...p, hp: p.maxHp }))

      set({
        currentOcean: gameState.currentOcean,
        players: playersWithRestoredHP,
        selectedGrade: gameState.selectedGrade,
        selectedSubject: gameState.selectedSubject,
        totalScore: gameState.totalScore,
        unlockedOceans: globalProgress.unlockedOceans,
        completedOceans: globalProgress.completedOceans,
        battle: null,
        explorationBattle: null,
        gamePhase,
        exploration: {
          phase: 'exploring',
          currentOcean: explorationState.currentOcean,
          currentArea: explorationState.currentArea,
          visitedAreas: explorationState.visitedAreas,
          defeatedMiniBosses: explorationState.defeatedMiniBosses,
          unlockedAreas: explorationState.unlockedAreas,
          reachableAreas: explorationState.reachableAreas,
          collectedKeys: explorationState.collectedKeys,
          collectedItems: explorationState.collectedItems,
          availablePortals: [],
          portalSeed: null,
          failedAttempts: {},
          lastError: null,
          savepoints: [],
          lastSavepoint: null,
          battleFailedAttempts: 0,
          consecutiveVictoriesWithoutKey: explorationState.consecutiveVictoriesWithoutKey,
        },
        currentSaveSlot: slotIndex,
      })

      return true
    } catch (e) {
      console.error('Failed to load save:', e)
      return false
    }
  },

  deleteSave: (slotIndex) => {
    localStorage.removeItem('save_' + slotIndex)
  },

  getSaveSlotInfo: () => {
    const slots: SaveSlotInfo[] = []

    for (let i = 0; i < 3; i++) {
      const data = safeGetItem('save_' + i)
      if (data) {
        try {
          const slot: SaveSlot = JSON.parse(data)
          slots.push({
            slotIndex: i,
            occupied: true,
            savedAt: slot.savedAt,
            currentOcean: slot.explorationState.currentOcean ?? undefined,
            defeatedCount: slot.explorationState.defeatedMiniBosses.length,
          })
        } catch {
          slots.push({ slotIndex: i, occupied: false })
        }
      } else {
        slots.push({ slotIndex: i, occupied: false })
      }
    }

    return slots
  },

  hasSavedGames: () => {
    return get().getSaveSlotInfo().some(s => s.occupied)
  },
}))