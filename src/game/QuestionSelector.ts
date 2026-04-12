import type { Question } from './types'
import { questionsData } from '../data/questions'
import { oceansData } from '../data/oceans'
import {
  getQuestionsByGradeAndSubject,
  getQuestionsByDifficulty as getGradedQuestionsByDifficulty,
} from '../data/questions/graded'
import { getOceanQuestionBank } from '../data/questions/ocean'
import type { BattleState } from './types'

export interface QuestionSelectorOptions {
  oceanId: string
  difficulty?: number | null
  category?: string
  grade?: number  // 年级 (1-9)
  subject?: 'chinese' | 'math' | 'english' | 'science'
  excludeIds?: string[]  // 排除的问题ID（避免重复）
}

export function getRandomQuestion(options: QuestionSelectorOptions): Question | null {
  const { oceanId, difficulty, category, grade, excludeIds = [] } = options

  // P0-5: Fallback to 1 if difficulty is null/undefined
  const effectiveDifficulty = difficulty ?? 1

  // Get ocean difficulty range
  const ocean = Object.values(oceansData).find(o => o.id === oceanId)
  if (!ocean) return null

  // Try ocean-specific question bank first
  const oceanBank = getOceanQuestionBank(oceanId)
  if (oceanBank) {
    // Filter by category (use category field from Question, not subject)
    const filterCategory = category as string | undefined

    // Try specified difficulty first
    let questions = oceanBank.getQuestions({
      category: filterCategory,
      difficulty: effectiveDifficulty,
      grade,
      excludeIds,
    })

    if (questions.length > 0) {
      return questions[Math.floor(Math.random() * questions.length)]
    }

    // Fallback: try lower difficulties within same ocean (D4→D3→D2→D1)
    for (let diff = effectiveDifficulty - 1; diff >= 1; diff--) {
      const fallback = oceanBank.getQuestions({
        category: filterCategory,
        difficulty: diff,
        grade,
        excludeIds,
      })
      if (fallback.length > 0) {
        return fallback[Math.floor(Math.random() * fallback.length)]
      }
    }

    // No questions in this ocean at any difficulty - do NOT fallback to other oceans
    return null
  }

  // Fallback to old questionsData (no ocean isolation)
  const [minDiff, maxDiff] = difficulty != null
    ? [effectiveDifficulty, effectiveDifficulty]
    : ocean.difficulty

  const filtered = questionsData.filter(q => {
    if (q.difficulty < minDiff || q.difficulty > maxDiff) return false
    if (category && category.length > 0) {
      if (q.category !== category) return false
    }
    if (excludeIds.includes(q.id)) return false
    return true
  })

  if (filtered.length === 0) return null

  // Random selection
  const index = Math.floor(Math.random() * filtered.length)
  return filtered[index]
}

export function getQuestionsByDifficulty(difficulty: number): Question[] {
  // Try to use graded questions first
  const graded = getGradedQuestionsByDifficulty(difficulty)
  if (graded.length > 0) return graded
  // Fallback to original
  return questionsData.filter(q => q.difficulty === difficulty)
}

export { getQuestionsByGradeAndSubject }

interface BattleQuestionOptions {
  oceanId: string
  battle: BattleState
  subject: string
  selectedGrade: number
  excludeIds?: string[]
}

/**
 * 根据当前战斗状态获取题目
 * - 单人模式：使用当前玩家年级选题（从battle.players获取）
 * - 双人模式：使用当前玩家年级选题
 * - 难度：始终使用 ocean 难度
 * - excludeIds: 已使用的问题ID，用于避免重复
 */
export function getQuestionForBattle(
  options: BattleQuestionOptions
): Question | null {
  const { oceanId, battle, subject, selectedGrade, excludeIds = [] } = options
  const { players, currentPlayerIndex } = battle

  // 确定使用哪个年级选题
  // 始终使用battle.players中存储的玩家年级，确保单人模式也正确
  const questionGrade = players[currentPlayerIndex]?.grade ?? selectedGrade

  return getRandomQuestion({
    oceanId,
    grade: questionGrade,
    subject: subject as 'math' | 'chinese' | 'english',
    excludeIds,
    // difficulty 由 getRandomQuestion 内部根据 grade 自行处理
  })
}