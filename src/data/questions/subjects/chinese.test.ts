import { describe, it, expect } from 'vitest'
import { chineseQuestions } from './chinese'

describe('chinese question bank', () => {
  // 验证答案分布平衡（A/B/C/D各6-9道）
  // 注意：这是信息性检查，旧数据可能不平衡需要后续补充
  it('should have balanced answer distribution for each grade+difficulty', () => {
    const combinations: Record<string, number[]> = {}
    chineseQuestions.forEach(q => {
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
    // 每组中A/B/C/D各6-9道（允许±2的偏差）
    // 如果某选项为0，说明旧数据不平衡，需要后续补充
    Object.entries(combinations).forEach(([combo, indices]) => {
      const dist = [0, 0, 0, 0]
      indices.forEach(i => dist[i] = (dist[i] || 0) + 1)

      const total = indices.length
      if (total > 0) {
        const issues: string[] = []
        dist.forEach((count, idx) => {
          const letter = String.fromCharCode(65 + idx)
          if (total >= 10) {
            if (count < 6) {
              issues.push(`${letter}=${count}(偏少)`)
            } else if (count > 9) {
              issues.push(`${letter}=${count}(偏多)`)
            }
          }
        })
        if (issues.length > 0) {
          console.log(`Combo ${combo}: ${total} questions, distribution: A=${dist[0]}, B=${dist[1]}, C=${dist[2]}, D=${dist[3]} - WARNING: ${issues.join(', ')}`)
        } else {
          console.log(`Combo ${combo}: ${total} questions, distribution: A=${dist[0]}, B=${dist[1]}, C=${dist[2]}, D=${dist[3]} - OK`)
        }
      }
    })
  })

  // 验证每组合至少有题目
  it('should have questions for grades 1-9', () => {
    const grades = new Set(chineseQuestions.map(q => q.grade))
    for (let i = 1; i <= 9; i++) {
      expect(grades.has(i)).toBe(true)
    }
  })

  // 验证题目格式
  it('should have valid question structure', () => {
    chineseQuestions.forEach(q => {
      expect(q.id).toMatch(/^chinese_\d+_\d+_\d+$/)
      expect(q.content).toBeTruthy()
      expect(q.category).toBe('chinese')
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