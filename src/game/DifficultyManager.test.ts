import { describe, it, expect } from 'vitest'
import { DifficultyManager } from './DifficultyManager'

describe('DifficultyManager', () => {
  const manager = new DifficultyManager()

  it('应正确初始化区域难度', () => {
    manager.initializeArea('test_area', 2)
    expect(manager.getCurrentDifficulty('test_area')).toBe(2)
  })

  it('失败5次应降级', () => {
    manager.initializeArea('test_area_2', 2)

    // 失败4次不应降级
    for (let i = 0; i < 4; i++) {
      const downgraded = manager.recordFailure('test_area_2')
      expect(downgraded).toBe(false)
    }

    // 第5次失败应降级
    const downgraded = manager.recordFailure('test_area_2')
    expect(downgraded).toBe(true)
    expect(manager.getCurrentDifficulty('test_area_2')).toBe(1)
  })

  it('成功后应重置计数', () => {
    manager.initializeArea('test_area_3', 3)

    // 失败4次
    for (let i = 0; i < 4; i++) {
      manager.recordFailure('test_area_3')
    }

    // 成功
    manager.resetOnSuccess('test_area_3')

    // 再失败4次不应降级（因为计数器被重置）
    for (let i = 0; i < 4; i++) {
      const downgraded = manager.recordFailure('test_area_3')
      expect(downgraded).toBe(false)
    }

    // 第5次失败才会降级
    const downgraded = manager.recordFailure('test_area_3')
    expect(downgraded).toBe(true)
  })

  it('难度1不应再降级', () => {
    manager.initializeArea('test_area_4', 1)

    // 失败5次
    for (let i = 0; i < 5; i++) {
      manager.recordFailure('test_area_4')
    }

    // 难度仍为1
    expect(manager.getCurrentDifficulty('test_area_4')).toBe(1)
  })

  it('hasBeenDowngraded 应正确反映降级状态', () => {
    manager.initializeArea('test_area_5', 2)
    expect(manager.hasBeenDowngraded('test_area_5')).toBe(false)

    // 降级
    for (let i = 0; i < 5; i++) {
      manager.recordFailure('test_area_5')
    }

    expect(manager.hasBeenDowngraded('test_area_5')).toBe(true)
  })
})