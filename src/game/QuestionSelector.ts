import type { Question } from './types'
import { allQuestions } from '../data/questions'
import type { BattleState } from './types'

export type QuestionCategory = 'math' | 'chinese' | 'english' | 'science' | 'physics' | 'chemistry' | 'history' | 'general'

export interface QuestionSelectorOptions {
  oceanId?: string  // Kept for compatibility/logging, NOT used for filtering
  difficulty?: number | null
  category?: string
  grade?: number  // 年级 (1-9)
  excludeIds?: string[]  // 排除的问题ID（避免重复）
}

/**
 * 根据 category+grade+difficulty 随机选择一道题目
 * - 按 category、grade、difficulty 筛选
 * - 排除 excludeIds 中已使用的题目
 * - 如果没有找到指定难度的题目，尝试其他难度（降级策略）
 * - 返回 null 如果没有可用题目
 */
export function getRandomQuestion(options: QuestionSelectorOptions): Question | null {
  const { category, grade, difficulty, excludeIds = [] } = options

  // Fallback to 1 if difficulty is null/undefined
  const effectiveDifficulty = difficulty ?? 1

  // 尝试查找指定难度的题目
  let filtered = allQuestions.filter(q => {
    if (category && q.category !== category) return false
    if (grade !== undefined && q.grade !== grade) return false
    if (q.difficulty !== effectiveDifficulty) return false
    if (excludeIds.includes(q.id)) return false
    return true
  })

  // 如果没有找到，尝试其他难度但同grade（按难度从低到高降级）
  if (filtered.length === 0 && grade !== undefined && difficulty !== null && difficulty !== undefined) {
    for (let fallbackDiff = 1; fallbackDiff <= 3; fallbackDiff++) {
      if (fallbackDiff === difficulty) continue
      filtered = allQuestions.filter(q => {
        if (category && q.category !== category) return false
        if (q.difficulty !== fallbackDiff) return false
        if (excludeIds.includes(q.id)) return false
        return true
      })
      if (filtered.length > 0) break
    }
  }

  // 如果仍然没有，尝试其他难度其他年级（最后兜底）
  if (filtered.length === 0) {
    filtered = allQuestions.filter(q => {
      if (category && q.category !== category) return false
      if (grade !== undefined && q.grade !== grade) return false
      if (excludeIds.includes(q.id)) return false
      return true
    })
  }

  if (filtered.length === 0) return null

  const index = Math.floor(Math.random() * filtered.length)
  return filtered[index]
}

/**
 * 按难度获取所有题目（兼容性函数，仅用于旧代码）
 */
export function getQuestionsByDifficulty(difficulty: number): Question[] {
  return allQuestions.filter(q => q.difficulty === difficulty)
}

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
    category: subject,
    excludeIds,
  })
}