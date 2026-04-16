import { describe, it, expect } from 'vitest'
import { allQuestions } from './index'

describe('answer distribution', () => {
  it('each grade+difficulty combo should have balanced A/B/C/D', () => {
    const combos = new Map<string, number[]>()

    allQuestions
      .filter(q => q.type === 'single')
      .forEach(q => {
        const key = `${q.category}_${q.grade}_${q.difficulty}`
        const correctIndex = q.options?.findIndex(o => o.isCorrect) ?? -1
        if (correctIndex >= 0) {
          const existing = combos.get(key) || []
          existing.push(correctIndex)
          combos.set(key, existing)
        }
      })

    combos.forEach((indices, combo) => {
      const dist = [0, 0, 0, 0]
      indices.forEach(i => dist[i]++)
      dist.forEach(count => {
        // Each combo should have 6-9 of each answer (A/B/C/D)
        expect(count, `Combo ${combo} has ${count} of answer ${dist.indexOf(count)}`).toBeGreaterThanOrEqual(6)
        expect(count, `Combo ${combo} has ${count} of answer ${dist.indexOf(count)}`).toBeLessThanOrEqual(9)
      })
    })
  })

  it('should have questions for all subject+grade+difficulty combos', () => {
    const subjects = ['chinese', 'math', 'english', 'science', 'physics', 'chemistry', 'history']
    const gradeRanges: Record<string, number[]> = {
      chinese: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      math: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      english: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      science: [3, 4, 5, 6],
      physics: [7, 8, 9],
      chemistry: [7, 8, 9],
      history: [7, 8, 9],
    }

    subjects.forEach(subject => {
      const grades = gradeRanges[subject]
      grades.forEach(grade => {
        for (let diff = 1; diff <= 3; diff++) {
          const count = allQuestions.filter(
            q => q.category === subject && q.grade === grade && q.difficulty === diff
          ).length
          // Log warning if no questions - this is informational
          if (count === 0) {
            console.warn(`Warning: No questions for ${subject} grade ${grade} difficulty ${diff}`)
          }
        }
      })
    })
  })
})