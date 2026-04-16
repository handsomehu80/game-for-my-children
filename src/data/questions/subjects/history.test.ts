import { describe, it, expect } from 'vitest'
import { historyQuestions } from './history'

describe('history question bank', () => {
  // 验证答案分布 - 确保没有单一答案过度集中 (对迁移数据使用宽松检查)
  it('should have balanced answer distribution for single choice questions', () => {
    const combinations: Record<string, number[]> = {}
    historyQuestions.forEach(q => {
      if (q.type === 'single') {
        const key = `${q.grade}_${q.difficulty}`
        const correctIndex = q.options?.findIndex(o => o.isCorrect)
        if (correctIndex !== undefined && correctIndex >= 0) {
          combinations[key] = combinations[key] || []
          combinations[key].push(correctIndex)
        }
      }
    })
    // 对于迁移数据，验证分布不要严重失衡
    // 任何单一答案选项不超过85%（宽松阈值）
    Object.entries(combinations).forEach(([combo, indices]) => {
      const n = indices.length
      if (n === 0) return
      const dist = [0,0,0,0]
      indices.forEach(i => dist[i] = (dist[i] || 0) + 1)
      dist.forEach(count => {
        expect(count / n).toBeLessThanOrEqual(0.85)
      })
    })
  })

  // 验证覆盖年级 7-9
  it('should have questions for grades 7-9', () => {
    const grades = new Set(historyQuestions.map(q => q.grade))
    for (let i = 7; i <= 9; i++) {
      expect(grades.has(i)).toBe(true)
    }
  })

  // 验证题目格式
  it('should have valid question structure', () => {
    historyQuestions.forEach(q => {
      expect(q.id).toMatch(/^history_\d+_\d+_\d+$/)
      expect(q.content).toBeTruthy()
      expect(q.category).toBe('history')
      expect(q.grade).toBeGreaterThanOrEqual(7)
      expect(q.grade).toBeLessThanOrEqual(9)
      expect(q.difficulty).toBeGreaterThanOrEqual(1)
      expect(q.difficulty).toBeLessThanOrEqual(5)
      if (q.type === 'single') {
        expect(q.options).toBeDefined()
        expect(q.options?.length).toBe(4)
        const correctCount = q.options?.filter(o => o.isCorrect).length
        expect(correctCount).toBe(1)
      }
    })
  })
})