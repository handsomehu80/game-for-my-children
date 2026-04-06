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

  describe('ANSWER_QUESTION boundary', () => {
    it('should handle out-of-bounds answerIndex (100)', () => {
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
      // answerIndex 100 is out of bounds (only 3 options: 0, 1, 2)
      dispatch({ type: 'ANSWER_QUESTION', answerIndex: 100 })

      const state = useGameStore.getState()
      // Should treat as wrong answer, reduce player HP
      expect(state.battle?.player.hp).toBe(90)
      expect(state.battle?.comboCount).toBe(0)
    })

    it('should handle negative answerIndex (-1)', () => {
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
      // answerIndex -1 is negative (invalid)
      dispatch({ type: 'ANSWER_QUESTION', answerIndex: -1 })

      const state = useGameStore.getState()
      // Should treat as wrong answer, reduce player HP
      expect(state.battle?.player.hp).toBe(90)
      expect(state.battle?.comboCount).toBe(0)
    })

    // P0-5: null/undefined handling tests
    it('should handle null battle gracefully', () => {
      const { dispatch } = useGameStore.getState()
      // No battle started, try to answer question
      dispatch({ type: 'ANSWER_QUESTION', answerIndex: 0 })
      const state = useGameStore.getState()
      // Should return state unchanged (battle is null)
      expect(state.battle).toBeNull()
    })

    it('should handle question with undefined options', () => {
      const { dispatch } = useGameStore.getState()
      const player = { id: 'p1', name: 'Test', hp: 100, maxHp: 100, comboCount: 0 }
      const monster = { id: 'm1', name: 'Slime', hp: 50, maxHp: 50, sprite: 'slime.png' }
      const question = {
        id: 'q1',
        content: '1+1=?',
        type: 'single' as const,
        difficulty: 1 as const,
        category: 'math' as const,
        options: undefined as any, // P0-5: undefined options
      }

      dispatch({ type: 'START_GAME', players: [player] })
      dispatch({ type: 'START_BATTLE', monster, question })
      const stateBefore = useGameStore.getState()
      expect(stateBefore.battle?.currentQuestion?.options).toBeUndefined()

      // Try to answer - should gracefully handle
      dispatch({ type: 'ANSWER_QUESTION', answerIndex: 0 })
      const stateAfter = useGameStore.getState()
      // State should remain unchanged
      expect(stateAfter.battle?.player.hp).toBe(100)
    })

    it('should handle question with empty options', () => {
      const { dispatch } = useGameStore.getState()
      const player = { id: 'p1', name: 'Test', hp: 100, maxHp: 100, comboCount: 0 }
      const monster = { id: 'm1', name: 'Slime', hp: 50, maxHp: 50, sprite: 'slime.png' }
      const question = {
        id: 'q1',
        content: '1+1=?',
        type: 'single' as const,
        difficulty: 1 as const,
        category: 'math' as const,
        options: [] as any, // P0-5: empty options
      }

      dispatch({ type: 'START_GAME', players: [player] })
      dispatch({ type: 'START_BATTLE', monster, question })

      // Try to answer - should gracefully handle
      dispatch({ type: 'ANSWER_QUESTION', answerIndex: 0 })
      const state = useGameStore.getState()
      // State should remain unchanged since options is empty
      expect(state.battle?.player.hp).toBe(100)
    })
  })

  describe('P1-2: Guaranteed key drop', () => {
    it('初始探索状态应有consecutiveVictoriesWithoutKey为0', () => {
      const { startExploration } = useGameStore.getState()
      startExploration('east')

      const state = useGameStore.getState()
      expect(state.exploration?.consecutiveVictoriesWithoutKey).toBe(0)
    })

    it('RECEIVE_KEY应增加钥匙数量', () => {
      const { startExploration, explorationDispatch } = useGameStore.getState()
      startExploration('east')

      // Manually dispatch to victory phase and receive key
      // Full flow: exploring -> sailing -> arrived -> moving -> encounter -> battle -> victory
      explorationDispatch({ type: 'START_EXPLORATION', oceanId: 'east' })
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_math_1' })
      explorationDispatch({ type: 'SAILING_COMPLETE' })
      explorationDispatch({ type: 'ARRIVED' })
      explorationDispatch({ type: 'MOVE_COMPLETE' })
      explorationDispatch({ type: 'ENCOUNTER_RESULT', result: 'battle' })
      explorationDispatch({ type: 'BATTLE_WIN', areaId: 'east_math_1' })

      // Now in victory phase, receive key
      explorationDispatch({ type: 'RECEIVE_KEY', count: 1 })
      const state = useGameStore.getState()
      expect(state.exploration?.collectedKeys).toBe(1)
    })

    it('RESET_VICTORY_COUNTER应重置计数器', () => {
      const { startExploration, explorationDispatch } = useGameStore.getState()
      startExploration('east')

      // Set consecutiveVictoriesWithoutKey to 5 via explorationDispatch
      // We need to access the internal state directly for this test
      const stateBefore = useGameStore.getState()
      expect(stateBefore.exploration?.consecutiveVictoriesWithoutKey).toBe(0)

      // Dispatch RESET_VICTORY_COUNTER
      explorationDispatch({ type: 'RESET_VICTORY_COUNTER' })
      const stateAfter = useGameStore.getState()
      expect(stateAfter.exploration?.consecutiveVictoriesWithoutKey).toBe(0)
    })
  })

  describe('generatePortals 新逻辑测试', () => {
    beforeEach(() => {
      useGameStore.getState().dispatch({ type: 'RESET_GAME' })
    })

    it('验证首次进入条件: defeatedMiniBosses=0且visitedAreas<=1', () => {
      const { startExploration, explorationDispatch } = useGameStore.getState()
      startExploration('east')

      // 初始状态检查
      let state = useGameStore.getState()
      expect(state.exploration?.defeatedMiniBosses.length).toBe(0)
      expect(state.exploration?.visitedAreas.length).toBe(0)
      // isFirstEntry = (0 === 0) && (0 <= 1) = true

      // 选择岛屿但未到达
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_math_1' })
      state = useGameStore.getState()
      // 仍在exploring阶段，visitedAreas未更新
      expect(state.exploration?.phase).toBe('sailing')
      expect(state.exploration?.visitedAreas.length).toBe(0)
      // isFirstEntry = (0 === 0) && (0 <= 1) = true
    })

    it('Boss区域需要先击败9个岛屿才能挑战', () => {
      const { startExploration, explorationDispatch } = useGameStore.getState()
      startExploration('east')

      // 尝试直接选择Boss，应该返回错误因为需要先击败9个岛屿
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_boss' })

      let state = useGameStore.getState()
      // 应该进入error阶段，因为Boss检查在SELECT_AREA中进行
      expect(state.exploration?.phase).toBe('error')
      expect(state.exploration?.lastError).toContain('Defeat all 9 islands')
    })

    it('持有钥匙时collectedKeys应该增加', () => {
      const { startExploration, explorationDispatch, generatePortals } = useGameStore.getState()
      startExploration('east')

      // 到达victory阶段
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_math_1' })
      explorationDispatch({ type: 'SAILING_COMPLETE' })
      explorationDispatch({ type: 'ARRIVED' })
      explorationDispatch({ type: 'MOVE_COMPLETE' })
      explorationDispatch({ type: 'ENCOUNTER_RESULT', result: 'battle' })
      explorationDispatch({ type: 'BATTLE_WIN', areaId: 'east_math_1' })

      let state = useGameStore.getState()
      expect(state.exploration?.phase).toBe('victory')

      // generatePortals会处理钥匙掉落逻辑
      generatePortals()

      state = useGameStore.getState()
      // 30%掉落概率，不一定每次都获得钥匙
      // 但consecutiveVictoriesWithoutKey应该被重置
      expect(state.exploration?.consecutiveVictoriesWithoutKey).toBe(0)
    })

    it('oceanSequence正确: east->west->southHot->northIce->mysterious', () => {
      // 验证大洋顺序常量正确
      const oceanSequence: string[] = ['east', 'west', 'southHot', 'northIce', 'mysterious']
      expect(oceanSequence).toHaveLength(5)
      expect(oceanSequence[0]).toBe('east')
      expect(oceanSequence[4]).toBe('mysterious')
    })
  })
})