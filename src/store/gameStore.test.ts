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
  })
})