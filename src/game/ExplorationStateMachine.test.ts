import { describe, it, expect } from 'vitest'
import type { ExplorationState } from './types'
import { explorationTransition, initialExplorationState, canEnterArea, validateExplorationState } from './ExplorationStateMachine'

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
    it('应从exploring转换到sailing', () => {
      const state = { ...initialExplorationState, currentOcean: 'east' }
      const result = explorationTransition(state, {
        type: 'SELECT_AREA',
        areaId: 'east_math_1',
      })
      expect(result.phase).toBe('sailing')
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

  describe('P0-2: Hidden area encounter logic', () => {
    // NOTE: Encounter determination (battle vs treasure vs hidden_event) happens in
    // ExplorationMap.tsx component's useEffect, NOT in the state machine.
    // The state machine only receives ENCOUNTER_RESULT actions from the component.
    // This test verifies the state machine correctly transitions to 'hidden_area' phase
    // when it receives ENCOUNTER_RESULT with result: 'hidden_event'.
    it('hidden_event结果应转换到hidden_area phase', () => {
      const state = { ...initialExplorationState, phase: 'encounter' as const, currentArea: 'east_hidden_A' }
      const result = explorationTransition(state, { type: 'ENCOUNTER_RESULT', result: 'hidden_event' })
      expect(result.phase).toBe('hidden_area')
      expect(result.currentArea).toBe('east_hidden_A')
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

  describe('P0-4: Island unlock state validation', () => {
    it('应在rollback时验证unlockedAreas一致性', () => {
      // 模拟一个不一致的状态：普通区域（requiredKeys=0）被错误地放入unlockedAreas
      const invalidState: ExplorationState = {
        ...initialExplorationState,
        phase: 'rollback',
        currentArea: 'east_math_1',
        unlockedAreas: ['east_math_1', 'east_hidden_A'],  // east_math_1 不需要钥匙，不应在此
        collectedKeys: 1,
        lastSavepoint: {
          type: 'battle_win',
          createdAt: Date.now(),
          stateSnapshot: {
            visitedAreas: ['east_math_1'],
            defeatedMiniBosses: [],
            unlockedAreas: ['east_math_1', 'east_hidden_A'],
            reachableAreas: [],
            collectedKeys: 1,
            collectedItems: [],
          },
        },
      }

      // 执行 rollback (通过 ROLLBACK_TO_SAVEPOINT action)
      const result = explorationTransition(invalidState, { type: 'ROLLBACK_TO_SAVEPOINT' })

      // east_math_1 应该被移除（因为它 requiredKeys=0，不需要解锁）
      // east_hidden_A 应该保留（因为它 requiredKeys=1）
      expect(result.unlockedAreas).toEqual(['east_hidden_A'])
      expect(result.unlockedAreas).not.toContain('east_math_1')
    })

    it('validateExplorationState应保留有效的unlockedAreas', () => {
      const validState: ExplorationState = {
        ...initialExplorationState,
        phase: 'exploring',
        unlockedAreas: ['east_hidden_A'],  // 只包含需要钥匙的区域
        collectedKeys: 1,
      }

      const result = validateExplorationState(validState)
      expect(result.unlockedAreas).toEqual(['east_hidden_A'])
    })

    it('validateExplorationState应过滤掉无效的unlockedAreas', () => {
      const invalidState: ExplorationState = {
        ...initialExplorationState,
        phase: 'exploring',
        unlockedAreas: ['east_math_1', 'east_hidden_A'],  // east_math_1 不需要钥匙
        collectedKeys: 1,
      }

      const result = validateExplorationState(invalidState)
      expect(result.unlockedAreas).toEqual(['east_hidden_A'])
      expect(result.unlockedAreas).not.toContain('east_math_1')
    })
  })

  describe('P1-2: Guaranteed key drop', () => {
    it('初始状态应有consecutiveVictoriesWithoutKey为0', () => {
      expect(initialExplorationState.consecutiveVictoriesWithoutKey).toBe(0)
    })

    it('RESET_VICTORY_COUNTER应重置consecutiveVictoriesWithoutKey为0', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        consecutiveVictoriesWithoutKey: 5,
      }
      const result = explorationTransition(state, { type: 'RESET_VICTORY_COUNTER' })
      expect(result.consecutiveVictoriesWithoutKey).toBe(0)
    })

    it('RESET_EXPLORATION应重置consecutiveVictoriesWithoutKey为0', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        consecutiveVictoriesWithoutKey: 3,
      }
      const result = explorationTransition(state, { type: 'RESET_EXPLORATION' })
      expect(result.consecutiveVictoriesWithoutKey).toBe(0)
    })

    it('INCREMENT_VICTORY_COUNTER应递增consecutiveVictoriesWithoutKey', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        consecutiveVictoriesWithoutKey: 0,
      }
      const result = explorationTransition(state, { type: 'INCREMENT_VICTORY_COUNTER' })
      expect(result.consecutiveVictoriesWithoutKey).toBe(1)
    })

    it('INCREMENT_VICTORY_COUNTER应从任意值递增', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        consecutiveVictoriesWithoutKey: 3,
      }
      const result = explorationTransition(state, { type: 'INCREMENT_VICTORY_COUNTER' })
      expect(result.consecutiveVictoriesWithoutKey).toBe(4)
    })

    it('连续5次胜利后INCREMENT_VICTORY_COUNTER应使计数器达到5', () => {
      let state: ExplorationState = { ...initialExplorationState, consecutiveVictoriesWithoutKey: 0 }
      // Simulate 4 victories
      for (let i = 0; i < 4; i++) {
        state = explorationTransition(state, { type: 'INCREMENT_VICTORY_COUNTER' })
      }
      expect(state.consecutiveVictoriesWithoutKey).toBe(4)
      // 5th victory
      state = explorationTransition(state, { type: 'INCREMENT_VICTORY_COUNTER' })
      expect(state.consecutiveVictoriesWithoutKey).toBe(5)
    })
  })

  describe('P1-4: Visit-to-unlock rule', () => {
    // P1-4 规则:
    // 1. 收集至少1把钥匙
    // 2. 在传送门界面选择"解锁隐藏岛屿"
    // 3. 解锁后，该区域变为永久可访问（不再需要钥匙）

    it('UNLOCK_AREA应消耗1钥匙并解锁隐藏区域', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        phase: 'portal_appear' as const,
        collectedKeys: 2,
        unlockedAreas: [],
      }
      const result = explorationTransition(state, { type: 'UNLOCK_AREA', areaId: 'east_hidden_A' })
      expect(result.unlockedAreas).toContain('east_hidden_A')
      expect(result.collectedKeys).toBe(1)
    })

    it('解锁后的隐藏区域应在unlockedAreas中', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        phase: 'portal_appear' as const,
        collectedKeys: 1,
        unlockedAreas: [],
      }
      const result = explorationTransition(state, { type: 'UNLOCK_AREA', areaId: 'east_hidden_A' })
      expect(result.unlockedAreas).toEqual(['east_hidden_A'])
    })

    it('已解锁的隐藏区域不需要钥匙即可进入', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        currentOcean: 'east',
        collectedKeys: 0,  // 无钥匙
        unlockedAreas: ['east_hidden_A'],  // 但已解锁
      }
      const result = canEnterArea(state, 'east_hidden_A')
      expect(result.allowed).toBe(true)
    })

    it('未解锁的隐藏区域需要钥匙才能进入', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        currentOcean: 'east',
        collectedKeys: 0,
        unlockedAreas: [],  // 未解锁
      }
      const result = canEnterArea(state, 'east_hidden_A')
      expect(result.allowed).toBe(false)
    })

    it('解锁后的隐藏区域再次进入不需要花费钥匙', () => {
      // Simulate unlock
      let state: ExplorationState = {
        ...initialExplorationState,
        phase: 'portal_appear' as const,
        collectedKeys: 1,
        unlockedAreas: [],
      }
      state = explorationTransition(state, { type: 'UNLOCK_AREA', areaId: 'east_hidden_A' })
      expect(state.collectedKeys).toBe(0)  // 消耗了1钥匙
      expect(state.unlockedAreas).toContain('east_hidden_A')

      // Try to enter - should succeed without spending keys
      const enterResult = canEnterArea(state, 'east_hidden_A')
      expect(enterResult.allowed).toBe(true)
      // Keys should still be 0 (not spent again)
      expect(state.collectedKeys).toBe(0)
    })

    it('解锁隐藏区域时应验证钥匙数量不足', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        phase: 'portal_appear' as const,
        collectedKeys: 0,  // 无钥匙
        unlockedAreas: [],
      }
      const result = explorationTransition(state, { type: 'UNLOCK_AREA', areaId: 'east_hidden_A' })
      expect(result.phase).toBe('error')
      expect(result.unlockedAreas).not.toContain('east_hidden_A')
    })
  })

  describe('CLOSE_PORTAL action', () => {
    it('CLOSE_PORTAL应返回exploring阶段并清空availablePortals', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        phase: 'portal_appear' as const,
        availablePortals: [
          { id: 'p1', targetAreaId: 'east_math_1', type: 'normal' },
          { id: 'p2', targetAreaId: 'east_hidden_A', type: 'hidden' },
        ],
        portalSeed: 12345,
      }
      const result = explorationTransition(state, { type: 'CLOSE_PORTAL' })
      expect(result.phase).toBe('exploring')
      expect(result.availablePortals).toEqual([])
      // portalSeed is retained (not cleared) - only availablePortals is cleared
      expect(result.portalSeed).toBe(12345)
    })

    it('CLOSE_PORTAL应保留其他状态不变', () => {
      const state: ExplorationState = {
        ...initialExplorationState,
        phase: 'portal_appear' as const,
        currentOcean: 'east',
        visitedAreas: ['east_math_1', 'east_math_2'],
        defeatedMiniBosses: ['east_math_1', 'east_math_2'],
        collectedKeys: 2,
        unlockedAreas: ['east_hidden_A'],
        availablePortals: [{ id: 'p1', targetAreaId: 'east_hidden_B', type: 'hidden' }],
        portalSeed: 12345,
      }
      const result = explorationTransition(state, { type: 'CLOSE_PORTAL' })
      expect(result.currentOcean).toBe('east')
      expect(result.visitedAreas).toEqual(['east_math_1', 'east_math_2'])
      expect(result.defeatedMiniBosses).toEqual(['east_math_1', 'east_math_2'])
      expect(result.collectedKeys).toBe(2)
      expect(result.unlockedAreas).toEqual(['east_hidden_A'])
      expect(result.availablePortals).toEqual([])
    })
  })

  describe('地图连接测试 (Map Connection - isAreaReachable)', () => {
    // 导入isAreaReachable函数 - 需要从areas模块测试
    // 这里测试状态转换如何更新reachableAreas

    it('击败math_1后，reachableAreas应包含math_2, chinese_1, english_1', () => {
      // 根据areas数据，east_math_1的connections是:
      // ['east_chinese_1', 'east_english_1', 'east_math_2']
      const state: ExplorationState = {
        ...initialExplorationState,
        currentOcean: 'east',
        phase: 'battle' as const,
        currentArea: 'east_math_1',
        visitedAreas: [],
        defeatedMiniBosses: [],
        reachableAreas: ['east_math_1'], // 初始可达
      }

      const result = explorationTransition(state, {
        type: 'BATTLE_WIN',
        areaId: 'east_math_1',
      })

      // math_1的connections是['east_chinese_1', 'east_english_1', 'east_math_2']
      // 这些应该被添加到reachableAreas
      expect(result.reachableAreas).toContain('east_math_2')
      expect(result.reachableAreas).toContain('east_chinese_1')
      expect(result.reachableAreas).toContain('east_english_1')
    })

    it('击败chinese_2后，reachableAreas应包含chinese_3, math_2, english_2', () => {
      // east_chinese_2的connections是:
      // ['east_math_2', 'east_english_2', 'east_chinese_1', 'east_chinese_3']
      const state: ExplorationState = {
        ...initialExplorationState,
        currentOcean: 'east',
        phase: 'battle' as const,
        currentArea: 'east_chinese_2',
        visitedAreas: [],
        defeatedMiniBosses: [],
        // math_2, english_2, chinese_1, chinese_3都可能是可达的
        reachableAreas: ['east_chinese_2'],
      }

      const result = explorationTransition(state, {
        type: 'BATTLE_WIN',
        areaId: 'east_chinese_2',
      })

      // chinese_2的connections包含math_2, english_2, chinese_3
      expect(result.reachableAreas).toContain('east_math_2')
      expect(result.reachableAreas).toContain('east_english_2')
      expect(result.reachableAreas).toContain('east_chinese_3')
    })

    it('reachableAreas只添加未完成的非boss岛屿', () => {
      // 验证BATTLE_WIN不会添加已经defeated的岛屿或boss岛屿
      const state: ExplorationState = {
        ...initialExplorationState,
        currentOcean: 'east',
        phase: 'battle' as const,
        currentArea: 'east_math_1',
        defeatedMiniBosses: ['east_math_2'], // math_2已被击败
        reachableAreas: ['east_math_1'],
      }

      const result = explorationTransition(state, {
        type: 'BATTLE_WIN',
        areaId: 'east_math_1',
      })

      // math_1的connections包含math_2，但math_2已被击败，不应添加
      expect(result.reachableAreas).not.toContain('east_math_2')
      // boss也不应添加
      expect(result.reachableAreas).not.toContain('east_boss')
    })

    it('reachableAreas累积增长，不会减少', () => {
      // 击败math_1
      let state: ExplorationState = {
        ...initialExplorationState,
        currentOcean: 'east',
        phase: 'battle' as const,
        currentArea: 'east_math_1',
        defeatedMiniBosses: [],
        reachableAreas: ['east_math_1'],
      }
      state = explorationTransition(state, { type: 'BATTLE_WIN', areaId: 'east_math_1' })
      const afterMath1 = state.reachableAreas

      // 击败chinese_1
      state = {
        ...state,
        phase: 'battle' as const,
        currentArea: 'east_chinese_1',
      }
      state = explorationTransition(state, { type: 'BATTLE_WIN', areaId: 'east_chinese_1' })

      // reachableAreas应该包含之前的所有岛屿加上新的
      expect(state.reachableAreas.length).toBeGreaterThanOrEqual(afterMath1.length)
      expect(state.reachableAreas).toContain('east_math_1')
      expect(state.reachableAreas).toContain('east_chinese_1')
    })
  })
})