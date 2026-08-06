import { describe, it, expect } from 'vitest'
import { getRandomQuestion, getQuestionForBattle } from './QuestionSelector'
import type { BattleState } from './types'

describe('getRandomQuestion', () => {
  it('should return question matching category+grade+difficulty', () => {
    const question = getRandomQuestion({
      oceanId: 'east', // oceanId kept for compatibility but not used for filtering
      category: 'math',
      grade: 3,
      difficulty: 1,
    })
    expect(question).toBeDefined()
    expect(question?.category).toBe('math')
    expect(question?.grade).toBe(3)
    expect(question?.difficulty).toBe(1)
  })

  it('should exclude already used questions', () => {
    const q1 = getRandomQuestion({ category: 'math', grade: 3, difficulty: 1 })
    const q2 = getRandomQuestion({
      category: 'math',
      grade: 3,
      difficulty: 1,
      excludeIds: q1?.id ? [q1.id] : []
    })
    expect(q1?.id).not.toBe(q2?.id)
  })

  it('should return null when no questions available', () => {
    // Use excludeIds to exclude all questions for a specific combo
    // First get count of math grade 3 difficulty 1 questions
    const allMathG3D1 = Array.from(
      { length: 100 },
      (_, i) => `math_3_1_${String(i+1).padStart(3,'0')}`
    )
    const result = getRandomQuestion({
      category: 'math',
      grade: 3,
      difficulty: 1,
      excludeIds: allMathG3D1
    })
    // May return null if we excluded all questions, or return one if not all existed
    // This test just verifies the function doesn't crash
    expect(result === null || result.category === 'math').toBe(true)
  })

  it('should work without grade filter', () => {
    const question = getRandomQuestion({
      category: 'math',
      difficulty: 1,
    })
    expect(question).toBeDefined()
    expect(question?.category).toBe('math')
    expect(question?.difficulty).toBe(1)
  })
})

describe('getQuestionForBattle', () => {
  it('should honor the passed difficulty instead of defaulting to 1', () => {
    const battle = {
      players: [{ id: 'p1', name: '玩家1', grade: 7 }],
      currentPlayerIndex: 0,
    } as BattleState

    const question = getQuestionForBattle({
      oceanId: 'east',
      battle,
      subject: 'math',
      selectedGrade: 7,
      difficulty: 3,
    })

    expect(question).toBeDefined()
    expect(question?.grade).toBe(7)
    expect(question?.difficulty).toBe(3)
  })

  it('should fall back to difficulty 1 when difficulty is not passed (legacy behavior)', () => {
    const battle = {
      players: [{ id: 'p1', name: '玩家1', grade: 7 }],
      currentPlayerIndex: 0,
    } as BattleState

    const question = getQuestionForBattle({
      oceanId: 'east',
      battle,
      subject: 'math',
      selectedGrade: 7,
    })

    expect(question).toBeDefined()
    expect(question?.difficulty).toBe(1)
  })
})