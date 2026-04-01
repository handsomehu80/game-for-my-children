import type { Question } from './types'
import { questionsData } from '../data/questions'
import { oceansData } from '../data/oceans'

export interface QuestionSelectorOptions {
  oceanId: string
  difficultyOverride?: number
  categoryFilter?: string[]
}

export function getRandomQuestion(options: QuestionSelectorOptions): Question | null {
  const { oceanId, difficultyOverride, categoryFilter } = options

  // Get ocean difficulty range
  const ocean = Object.values(oceansData).find(o => o.id === oceanId)
  if (!ocean) return null

  const [minDiff, maxDiff] = difficultyOverride
    ? [difficultyOverride, difficultyOverride]
    : ocean.difficulty

  // Filter questions by difficulty and category
  const filtered = questionsData.filter(q => {
    if (q.difficulty < minDiff || q.difficulty > maxDiff) return false
    if (categoryFilter && categoryFilter.length > 0) {
      if (!categoryFilter.includes(q.category)) return false
    }
    return true
  })

  if (filtered.length === 0) return null

  // Random selection
  const index = Math.floor(Math.random() * filtered.length)
  return filtered[index]
}

export function getQuestionsByDifficulty(difficulty: number): Question[] {
  return questionsData.filter(q => q.difficulty === difficulty)
}