import { describe, it, expect } from 'vitest'
import { oceansData } from './oceans'
import { monstersData } from './monsters'
import { questionsData } from './questions'

describe('Data Validation', () => {
  it('oceans should have required fields', () => {
    Object.values(oceansData).forEach((ocean) => {
      expect(ocean.id).toBeDefined()
      expect(ocean.name).toBeDefined()
      expect(ocean.difficulty).toHaveLength(2)
      expect(Array.isArray(ocean.difficulty)).toBe(true)
      expect(ocean.monsters).toBeDefined()
    })
  })

  it('monsters should have hp and maxHp', () => {
    Object.values(monstersData).forEach((monster) => {
      expect(monster.hp).toBeDefined()
      expect(monster.maxHp).toBeDefined()
      expect(monster.sprite).toBeDefined()
      expect(monster.hp).toBeLessThanOrEqual(monster.maxHp)
    })
  })

  it('questions should have correct options structure', () => {
    Object.values(questionsData).flat().forEach((question) => {
      expect(question.options).toBeDefined()
      expect(question.options.length).toBeGreaterThan(0)
      question.options.forEach((opt) => {
        expect(opt.text).toBeDefined()
        expect(typeof opt.isCorrect).toBe('boolean')
      })
      // Verify at least one correct answer
      const hasCorrect = question.options.some((opt) => opt.isCorrect)
      expect(hasCorrect).toBe(true)
    })
  })
})