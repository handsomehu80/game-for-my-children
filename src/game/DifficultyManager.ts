
const DIFFICULTY_ADJUSTMENT = {
  maxAttemptsBeforeDowngrade: 5,
  downgradeLevel: 1,  // 降一级
}

export interface DifficultyRecord {
  areaId: string
  originalDifficulty: 1 | 2 | 3
  currentDifficulty: 1 | 2 | 3
  failedAttempts: number
}

export class DifficultyManager {
  private difficulties: Map<string, DifficultyRecord> = new Map()

  // 初始化区域难度
  initializeArea(areaId: string, difficulty: 1 | 2 | 3): void {
    if (!this.difficulties.has(areaId)) {
      this.difficulties.set(areaId, {
        areaId,
        originalDifficulty: difficulty,
        currentDifficulty: difficulty,
        failedAttempts: 0,
      })
    }
  }

  // 记录失败
  recordFailure(areaId: string): boolean {
    // 返回是否触发了降级
    const record = this.difficulties.get(areaId)
    if (!record) return false

    record.failedAttempts++

    if (
      record.failedAttempts >= DIFFICULTY_ADJUSTMENT.maxAttemptsBeforeDowngrade &&
      record.currentDifficulty > 1
    ) {
      record.currentDifficulty = (record.currentDifficulty - DIFFICULTY_ADJUSTMENT.downgradeLevel) as 1 | 2 | 3
      record.failedAttempts = 0  // 重置计数
      return true  // 触发了降级
    }

    return false
  }

  // 成功后重置计数
  resetOnSuccess(areaId: string): void {
    const record = this.difficulties.get(areaId)
    if (record) {
      record.failedAttempts = 0
    }
  }

  // 获取当前难度
  getCurrentDifficulty(areaId: string): 1 | 2 | 3 | null {
    return this.difficulties.get(areaId)?.currentDifficulty ?? null
  }

  // 是否已降级
  hasBeenDowngraded(areaId: string): boolean {
    const record = this.difficulties.get(areaId)
    return record ? record.currentDifficulty < record.originalDifficulty : false
  }
}

// 单例
export const difficultyManager = new DifficultyManager()