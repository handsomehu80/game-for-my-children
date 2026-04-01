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
})