import type { ExplorationState, ExplorationAction, ExplorationPhase, Savepoint } from './types'
import { getAreaById } from '../data/areas'

// 初始探索状态
export const initialExplorationState: ExplorationState = {
  phase: 'exploring',
  currentOcean: null,
  currentArea: null,
  visitedAreas: [],
  defeatedMiniBosses: [],
  unlockedAreas: [],
  reachableAreas: [],  // 可达区域列表（累积增长）
  collectedKeys: 0,
  collectedItems: [],
  availablePortals: [],
  portalSeed: null,
  failedAttempts: {},
  lastError: null,
  savepoints: [],
  lastSavepoint: null,
  battleFailedAttempts: 0,
  consecutiveVictoriesWithoutKey: 0,  // P1-2: Track victories for guaranteed key drop
}

// 状态转换函数（纯函数）
export function explorationTransition(
  state: ExplorationState,
  action: ExplorationAction
): ExplorationState {
  // RESET_EXPLORATION 可以在任何阶段生效
  if (action.type === 'RESET_EXPLORATION') {
    return initialExplorationState
  }

  // P1-2: RESET_VICTORY_COUNTER 可以在任何阶段生效
  if (action.type === 'RESET_VICTORY_COUNTER') {
    return { ...state, consecutiveVictoriesWithoutKey: 0 }
  }

  // P1-2: INCREMENT_VICTORY_COUNTER 可以在任何阶段生效
  if (action.type === 'INCREMENT_VICTORY_COUNTER') {
    return { ...state, consecutiveVictoriesWithoutKey: state.consecutiveVictoriesWithoutKey + 1 }
  }

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
          // 1. 打败所有9个岛屿后才能和boss战斗
          if (area.type === 'boss' && state.defeatedMiniBosses.length < 9) {
            return { ...state, phase: 'error', lastError: `Defeat all 9 islands before challenging the boss (${state.defeatedMiniBosses.length}/9)` }
          }
          return {
            ...state,
            phase: 'sailing',
            currentArea: action.areaId,
          }
        }
        default:
          return state
      }

    case 'sailing':
      switch (action.type) {
        case 'SAILING_COMPLETE':
          return { ...state, phase: 'arrived' as ExplorationPhase }
        default:
          return state
      }

    case 'arrived':
      switch (action.type) {
        case 'ARRIVED':
          return { ...state, phase: 'moving' as ExplorationPhase }
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

          // 获取当前岛屿的连接岛屿，添加为可达区域
          const currentArea = getAreaById(action.areaId)
          const newReachable = currentArea
            ? currentArea.connections.filter(id => {
                const area = getAreaById(id)
                // 只添加未完成的非boss岛屿
                return area && !newDefeated.includes(id) && area.type !== 'boss'
              })
            : []
          const finalReachable = [...state.reachableAreas, ...newReachable.filter(id => !state.reachableAreas.includes(id))]

          // 创建存档点（包含可达区域）
          const savepoint: Savepoint = {
            type: 'battle_win',
            createdAt: Date.now(),
            stateSnapshot: {
              visitedAreas: newVisited,
              defeatedMiniBosses: newDefeated,
              unlockedAreas: state.unlockedAreas,
              reachableAreas: finalReachable,
              collectedKeys: state.collectedKeys,
              collectedItems: state.collectedItems,
            },
          }
          return {
            ...state,
            phase: 'victory',
            visitedAreas: newVisited,
            defeatedMiniBosses: newDefeated,
            // 添加新的可达区域（只增不减）
            reachableAreas: finalReachable,
            savepoints: [...state.savepoints, savepoint],
            lastSavepoint: savepoint,
            battleFailedAttempts: 0,  // 重置重试计数
          }
        }
        case 'BATTLE_LOSE': {
          // 增加失败计数
          const newBattleFailedAttempts = state.battleFailedAttempts + 1
          const failedAttempts = {
            ...state.failedAttempts,
            [state.currentArea || '']: (state.failedAttempts[state.currentArea || ''] || 0) + 1,
          }
          // 检查是否超过最大重试次数（3次）
          if (newBattleFailedAttempts >= 3) {
            return {
              ...state,
              phase: 'rollback',
              failedAttempts,
              battleFailedAttempts: newBattleFailedAttempts,
              lastError: 'Max retries exceeded, rolling back',
            }
          }
          return {
            ...state,
            phase: 'error',
            failedAttempts,
            battleFailedAttempts: newBattleFailedAttempts,
            lastError: `Battle lost (retry ${newBattleFailedAttempts}/3)`,
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
        case 'BATTLE_WIN': {
          // 添加到已击败列表
          const newDefeated = state.defeatedMiniBosses.includes(action.areaId)
            ? state.defeatedMiniBosses
            : [...state.defeatedMiniBosses, action.areaId]
          // 获取当前岛屿的连接岛屿，添加为可达区域
          const currentArea = getAreaById(action.areaId)
          const newReachable = currentArea
            ? currentArea.connections.filter(id => {
                const area = getAreaById(id)
                return area && !newDefeated.includes(id) && area.type !== 'boss'
              })
            : []
          return {
            ...state,
            phase: 'portal_appear',
            defeatedMiniBosses: newDefeated,
            reachableAreas: [...state.reachableAreas, ...newReachable.filter(id => !state.reachableAreas.includes(id))],
          }
        }
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
              reachableAreas: state.reachableAreas,
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
        case 'CLOSE_PORTAL':
          return { ...state, phase: 'exploring' as ExplorationPhase, availablePortals: [] }
        case 'SELECT_PORTAL':
          // 3. 打败完boss后出现传送门要能传送到新的区域
          if (action.portal.type === 'ocean_portal') {
            // 跨大洋传送门：切换到新大洋并重置探索状态
            return {
              ...state,
              phase: 'exploring',
              currentOcean: action.portal.targetAreaId as any,  // targetAreaId 是 oceanId
              currentArea: null,
              visitedAreas: [],
              defeatedMiniBosses: [],
              reachableAreas: [],  // 新大洋的可达区域也要重置
              // 保留钥匙和已解锁区域
              collectedKeys: state.collectedKeys,
              collectedItems: state.collectedItems,
              unlockedAreas: state.unlockedAreas,
              availablePortals: [],
              portalSeed: null,
            }
          }
          // 宝藏岛屿：不需要钥匙，直接进入
          if (action.portal.type === 'treasure') {
            return {
              ...state,
              phase: 'moving',
              currentArea: action.portal.targetAreaId,
              availablePortals: [],
            }
          }
          // 隐藏岛屿：需要钥匙，消耗钥匙并解锁
          if (action.portal.type === 'hidden' && state.collectedKeys > 0) {
            return {
              ...state,
              phase: 'moving',
              currentArea: action.portal.targetAreaId,
              unlockedAreas: state.unlockedAreas.includes(action.portal.targetAreaId)
                ? state.unlockedAreas
                : [...state.unlockedAreas, action.portal.targetAreaId],
              collectedKeys: state.collectedKeys - 1,
              availablePortals: [],
            }
          }
          // 如果没有钥匙但试图进入隐藏岛屿，报错
          if (action.portal.type === 'hidden' && state.collectedKeys <= 0) {
            return { ...state, phase: 'error', lastError: 'Not enough keys to enter hidden area' }
          }
          return { ...state, phase: 'moving', currentArea: action.portal.targetAreaId }
        case 'SELECT_AREA':
          // 允许在 portal_appear 阶段选择新区域开始航行
          return { ...state, phase: 'sailing', currentArea: action.areaId }
        case 'UNLOCK_AREA':
          // P1-4: Validate key count before unlocking
          // 如果区域已经解锁，不消耗钥匙
          if (state.unlockedAreas.includes(action.areaId)) {
            return state
          }
          if (state.collectedKeys < 1) {
            return { ...state, phase: 'error', lastError: 'Not enough keys to unlock area' }
          }
          return {
            ...state,
            unlockedAreas: [...state.unlockedAreas, action.areaId],
            collectedKeys: state.collectedKeys - 1,
          }
        case 'ADD_REACHABLE_AREAS': {
          // 添加新的可达区域（只增不减）
          const newReachable = action.areaIds.filter(id => !state.reachableAreas.includes(id))
          if (newReachable.length === 0) return state
          return {
            ...state,
            reachableAreas: [...state.reachableAreas, ...newReachable],
          }
        }
        default:
          return state
      }

    case 'boss_appearing':
      switch (action.type) {
        case 'BATTLE_WIN':
          // Boss战胜利不需要添加到defeatedMiniBosses，因为Boss是独立存在的
          // 打败9个普通岛屿后才能挑战Boss，Boss战胜利后传送门通向新大洋
          // 改为victory阶段以触发generatePortals()生成通往新大洋的传送门
          return { ...state, phase: 'victory' }
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
        case 'SELECT_AREA': {
          // 允许从错误状态选择新区域开始航行
          const area = getAreaById(action.areaId)
          if (!area) {
            return { ...state, lastError: `Area ${action.areaId} not found` }
          }
          if (area.requiredKeys > 0 && !state.unlockedAreas.includes(area.id)) {
            return { ...state, lastError: `Area ${action.areaId} requires keys` }
          }
          return {
            ...state,
            phase: 'sailing',
            currentArea: action.areaId,
            lastError: null,  // 清除错误状态
          }
        }
        case 'ROLLBACK_TO_SAVEPOINT':
          // 回滚到上一个存档点
          if (state.lastSavepoint) {
            const rolledBackState: ExplorationState = {
              ...state,
              phase: 'exploring' as ExplorationPhase,
              currentArea: null,  // 回到选择区域
              ...state.lastSavepoint.stateSnapshot,
              battleFailedAttempts: 0,
              lastError: null,
            }
            // P0-4: 验证回滚后的状态一致性
            return validateExplorationState(rolledBackState)
          }
          return { ...state, phase: 'exploring', lastError: null }
        default:
          return state
      }

    case 'rollback':
      // 回滚到存档点
      if (state.lastSavepoint) {
        const rolledBackState: ExplorationState = {
          ...state,
          phase: 'exploring' as ExplorationPhase,
          currentArea: null,
          ...state.lastSavepoint.stateSnapshot,
          battleFailedAttempts: 0,
          lastError: null,
        }
        // P0-4: 验证回滚后的状态一致性
        return validateExplorationState(rolledBackState)
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
      return ['SELECT_PORTAL', 'UNLOCK_AREA', 'CLOSE_PORTAL']
    case 'error':
      return ['ROLLBACK_TO_SAVEPOINT', 'RESET_EXPLORATION']
    default:
      return []
  }
}

// P0-4: 验证探索状态一致性
// 检查unlockedAreas是否只包含需要钥匙的区域（requiredKeys > 0）
// 如果一个区域不需要钥匙（requiredKeys === 0）却在unlockedAreas中，这是无效状态
export function validateExplorationState(state: ExplorationState): ExplorationState {
  const validUnlocks = state.unlockedAreas.filter(areaId => {
    const area = getAreaById(areaId)
    return area && area.requiredKeys > 0
  })

  if (validUnlocks.length !== state.unlockedAreas.length) {
    return { ...state, unlockedAreas: validUnlocks }
  }
  return state
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