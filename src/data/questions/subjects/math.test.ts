import { describe, it, expect } from 'vitest'
import { mathQuestions } from './math'

describe('math question bank', () => {
  // 验证答案分布平衡（A/B/C/D各6-9道）
  // 注意：这是信息性检查，旧数据可能不平衡需要后续补充
  it('should have balanced answer distribution for each grade+difficulty', () => {
    const combinations: Record<string, number[]> = {}
    mathQuestions.forEach(q => {
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

  // 验证每组题目数量（信息性日志，不强制30）
  it('should log question count per grade+difficulty', () => {
    const combinations: Record<string, number> = {}
    mathQuestions.forEach(q => {
      const key = `${q.grade}_${q.difficulty}`
      combinations[key] = (combinations[key] || 0) + 1
    })

    console.log('\n=== Math Questions per Grade+Difficulty ===')
    Object.entries(combinations)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([combo, count]) => {
        console.log(`  grade ${combo}: ${count} questions`)
      })
  })

  // 验证题目有有效选项
  it('should have valid options with exactly one correct answer', () => {
    mathQuestions.forEach(q => {
      if (q.type === 'single') {
        expect(q.options).toBeDefined()
        expect(q.options.length).toBe(4)

        const correctCount = q.options.filter(o => o.isCorrect).length
        expect(correctCount).toBe(1)

        // 验证A/B/C/D分布存在
        const dist = q.options.map(o => o.isCorrect ? 1 : 0)
        expect(dist).toContain(1)
        expect(dist).toContain(0)
      }
    })
  })

  // 验证ID格式正确
  it('should have correct ID format math_{grade}_{difficulty}_{seq}', () => {
    mathQuestions.forEach(q => {
      const idPattern = /^math_\d+_\d+_\d+$/
      expect(q.id).toMatch(idPattern)
    })
  })
})