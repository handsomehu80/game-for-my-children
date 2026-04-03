import type { Question } from './types'
import { questionsData } from '../data/questions'
import { oceansData } from '../data/oceans'

export interface QuestionSelectorOptions {
  oceanId: string
  difficulty?: number | null
  category?: string
}

export function getRandomQuestion(options: QuestionSelectorOptions): Question | null {
  const { oceanId, difficulty, category } = options

  // P0-5: Fallback to 1 if difficulty is null/undefined
  const effectiveDifficulty = difficulty ?? 1

  // Get ocean difficulty range
  const ocean = Object.values(oceansData).find(o => o.id === oceanId)
  if (!ocean) return null

  const [minDiff, maxDiff] = difficulty != null
    ? [effectiveDifficulty, effectiveDifficulty]
    : ocean.difficulty

  // Filter questions by difficulty and category
  const filtered = questionsData.filter(q => {
    if (q.difficulty < minDiff || q.difficulty > maxDiff) return false
    if (category && category.length > 0) {
      if (q.category !== category) return false
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