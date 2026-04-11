import type { Question } from './types'
import { questionsData } from '../data/questions'
import { oceansData } from '../data/oceans'
import {
  allGradedQuestions,
  getQuestionsByGradeAndSubject,
  getQuestionsByDifficulty as getGradedQuestionsByDifficulty,
} from '../data/questions/graded'
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
  const { oceanId, difficulty, category, grade, subject, excludeIds = [] } = options

  // P0-5: Fallback to 1 if difficulty is null/undefined
  const effectiveDifficulty = difficulty ?? 1

  // Get ocean difficulty range
  const ocean = Object.values(oceansData).find(o => o.id === oceanId)
  if (!ocean) return null

  const [minDiff, maxDiff] = difficulty != null
    ? [effectiveDifficulty, effectiveDifficulty]
    : ocean.difficulty

  // If grade is specified, use graded questions
  if (grade != null) {
    const gradeQuestions = allGradedQuestions.filter(q => {
      if (q.grade !== grade) return false
      if (subject && q.category !== subject) return false
      // When grade is specified, don't filter by difficulty (grade already determines difficulty)
      if (category && category.length > 0 && q.category !== category) return false
      // 排除已使用的问题ID
      if (excludeIds.includes(q.id)) return false
      return true
    })

    // P0-fallback: 如果该年级该科目没有题目，回退到使用ocean难度
    if (gradeQuestions.length === 0 && subject) {
      const fallbackQuestions = allGradedQuestions.filter(q => {
        if (q.difficulty < minDiff || q.difficulty > maxDiff) return false
        if (q.category !== subject) return false
        if (excludeIds.includes(q.id)) return false
        return true
      })
      if (fallbackQuestions.length > 0) {
        const index = Math.floor(Math.random() * fallbackQuestions.length)
        return fallbackQuestions[index]
      }
    }

    if (gradeQuestions.length === 0) return null
    const index = Math.floor(Math.random() * gradeQuestions.length)
    return gradeQuestions[index]
  }

  // Fallback to original questions data
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