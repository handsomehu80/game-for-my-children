import type { Question } from './types'
import { questionsData } from '../data/questions'
import { oceansData } from '../data/oceans'
import {
  allGradedQuestions,
  getQuestionsByGradeAndSubject,
  getQuestionsByDifficulty as getGradedQuestionsByDifficulty,
} from '../data/questions/graded'
import type { BattlePlayer, BattleState } from './types'
import { isMultiplayer } from '../utils/gameHelpers'

export interface QuestionSelectorOptions {
  oceanId: string
  difficulty?: number | null
  category?: string
  grade?: number  // 年级 (1-9)
  subject?: 'chinese' | 'math' | 'english' | 'science'
}

export function getRandomQuestion(options: QuestionSelectorOptions): Question | null {
  const { oceanId, difficulty, category, grade, subject } = options

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
      return true
    })

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
}

/**
 * 根据当前战斗状态获取题目
 * - 单人模式：使用 selectedGrade 选题
 * - 双人模式：使用当前玩家年级选题
 * - 难度：始终使用 ocean 难度
 */
export function getQuestionForBattle(
  options: BattleQuestionOptions
): Question | null {
  const { oceanId, battle, subject, selectedGrade } = options
  const { players, currentPlayerIndex } = battle

  // 确定使用哪个年级选题
  let questionGrade: number
  if (isMultiplayer(players)) {
    questionGrade = players[currentPlayerIndex]?.grade ?? selectedGrade
  } else {
    questionGrade = selectedGrade
  }

  // 获取海域难度
  const ocean = Object.values(oceansData).find(o => o.id === oceanId)
  const difficulty = ocean?.difficulty ?? 1

  return getRandomQuestion({
    oceanId,
    grade: questionGrade,
    subject: subject as 'math' | 'chinese' | 'english',
    difficulty,
  })
}