import { describe, it, expect } from 'vitest'
import { getRandomQuestion, getQuestionsByDifficulty } from './QuestionSelector'

describe('QuestionSelector', () => {
  it('should return a question for valid ocean', () => {
    const question = getRandomQuestion({ oceanId: 'east' })
    expect(question).toBeDefined()
    expect(question?.id).toBeDefined()
  })

  it('should filter by difficulty', () => {
    const questions = getQuestionsByDifficulty(1)
    questions.forEach(q => {
      expect(q.difficulty).toBe(1)
    })
  })

  it('should return null for invalid ocean', () => {
    const question = getRandomQuestion({ oceanId: 'invalid_ocean' })
    expect(question).toBeNull()
  })

  // P0-5: null/undefined difficulty handling
  it('should fallback to default difficulty (1) when difficulty is null', () => {
    const question = getRandomQuestion({ oceanId: 'east', difficulty: null })
    expect(question).toBeDefined()
    expect(question?.difficulty).toBeDefined()
  })

  it('should fallback to default difficulty (1) when difficulty is undefined', () => {
    const question = getRandomQuestion({ oceanId: 'east', difficulty: undefined })
    expect(question).toBeDefined()
    expect(question?.difficulty).toBeDefined()
  })

  it('should use explicit difficulty when provided', () => {
    const question = getRandomQuestion({ oceanId: 'east', difficulty: 2 })
    expect(question).toBeDefined()
    expect(question?.difficulty).toBe(2)
  })

  it('should handle category filter', () => {
    const question = getRandomQuestion({ oceanId: 'east', category: 'math' })
    expect(question).toBeDefined()
  })
})