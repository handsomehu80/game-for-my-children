import type { Question } from '../../../game/types'

// Import all Ocean Question Banks
import { eastQuestionBank } from './east'
import { westQuestionBank } from './west'
import { southHotQuestionBank } from './southHot'
import { northIceQuestionBank } from './northIce'
import { mysteriousQuestionBank } from './mysterious'

// Export all Question Banks
export {
  eastQuestionBank,
  westQuestionBank,
  southHotQuestionBank,
  northIceQuestionBank,
  mysteriousQuestionBank,
}

export interface OceanQuestionBank {
  oceanId: string
  questions: Question[]

  // 按条件筛选题目
  getQuestions(options: {
    category?: string
    difficulty?: number
    grade?: number
    excludeIds?: string[]
  }): Question[]

  // 获取题目总数
  getTotalCount(): number
}

/**
 * 创建海洋题库实例
 */
export function createOceanQuestionBank(oceanId: string, questions: Question[]): OceanQuestionBank {
  return {
    oceanId,
    questions,

    getQuestions(options) {
      let result = [...this.questions]

      if (options.category) {
        result = result.filter((q) => q.category === options.category)
      }

      if (options.difficulty !== undefined) {
        result = result.filter((q) => q.difficulty === options.difficulty)
      }

      if (options.grade !== undefined) {
        result = result.filter((q) => q.grade === undefined || q.grade === options.grade)
      }

      if (options.excludeIds && options.excludeIds.length > 0) {
        result = result.filter((q) => !options.excludeIds!.includes(q.id))
      }

      return result
    },

    getTotalCount() {
      return this.questions.length
    },
  }
}

// 各洋题库映射
const questionBanks: Record<string, OceanQuestionBank> = {
  east: eastQuestionBank,
  west: westQuestionBank,
  southHot: southHotQuestionBank,
  northIce: northIceQuestionBank,
  mysterious: mysteriousQuestionBank,
}

/**
 * 获取指定大洋的题库
 * @param oceanId 大洋ID (east/west/southHot/northIce/mysterious)
 * @returns 题库实例，如果不存在返回 null
 */
export function getOceanQuestionBank(oceanId: string): OceanQuestionBank | null {
  return questionBanks[oceanId] ?? null
}

// 导出旧名称以保持兼容
export const southQuestionBank = southHotQuestionBank
export const northQuestionBank = northIceQuestionBank