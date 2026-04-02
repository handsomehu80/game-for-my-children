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