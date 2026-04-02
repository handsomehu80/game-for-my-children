import type { ExplorationState, ExplorationAction, Portal, Area, Item, Savepoint } from './types'
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
  // RESET_EXPLORATION 可以在任何阶段生效
  if (action.type === 'RESET_EXPLORATION') {
    return initialExplorationState
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