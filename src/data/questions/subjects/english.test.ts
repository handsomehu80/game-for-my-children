import { describe, it, expect } from 'vitest'
import { englishQuestions } from './english'

describe('english question bank', () => {
  // 验证答案分布 - English questions are migrated from ocean banks so we just check no single answer dominates
  it('should have answer distribution for single choice questions', () => {
    const combinations: Record<string, number[]> = {}
    englishQuestions.forEach(q => {
      if (q.type === 'single') {
        const key = `${q.grade}_${q.difficulty}`
        const correctIndex = q.options?.findIndex(o => o.isCorrect)
        if (correctIndex !== undefined && correctIndex >= 0) {
          combinations[key] = combinations[key] || []
          combinations[key].push(correctIndex)
        }
      }
    })
    // A=0, B=1, C=2, D=3
    // Just check that no single answer option exceeds 70% (relaxed for migrated data)
    Object.entries(combinations).forEach(([combo, indices]) => {
      const dist = [0,0,0,0]
      indices.forEach(i => dist[i] = (dist[i] || 0) + 1)
      const total = indices.length
      dist.forEach(count => {
        expect(count / total).toBeLessThanOrEqual(0.70)
      })
    })
  })

  // 验证每组合至少有题目
  it('should have questions for grades 1-9', () => {
    const grades = new Set(englishQuestions.map(q => q.grade))
    for (let i = 1; i <= 9; i++) {
      expect(grades.has(i)).toBe(true)
    }
  })

  // 验证题目格式
  it('should have valid question structure', () => {
    englishQuestions.forEach(q => {
      expect(q.id).toMatch(/^english_\d+_\d+_[a-zA-Z]+_\d+$/)
      expect(q.content).toBeTruthy()
      expect(q.category).toBe('english')
      expect(q.grade).toBeGreaterThanOrEqual(1)
      expect(q.grade).toBeLessThanOrEqual(9)
      expect(q.difficulty).toBeGreaterThanOrEqual(1)
      expect(q.difficulty).toBeLessThanOrEqual(3)
      if (q.type === 'single') {
        expect(q.options).toBeDefined()
        expect(q.options?.length).toBe(4)
        const correctCount = q.options?.filter(o => o.isCorrect).length
        expect(correctCount).toBe(1)
      }
    })
  })
})