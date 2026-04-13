import { describe, it, expect } from 'vitest'
import { getAreasByOcean, getAreaById, getDifficultyStars, isAreaReachable } from './index'

describe('Areas Data', () => {
  it('东大洋应有13个区域', () => {
    const areas = getAreasByOcean('east')
    expect(areas.length).toBe(13)
  })

  it('东大洋应有3个数学、3个语文、3个英语、1个大boss、2个隐藏、1个宝箱', () => {
    const areas = getAreasByOcean('east')
    const mathAreas = areas.filter(a => a.knowledgeArea === 'math' && a.type === 'normal')
    const chineseAreas = areas.filter(a => a.knowledgeArea === 'chinese' && a.type === 'normal')
    const englishAreas = areas.filter(a => a.knowledgeArea === 'english' && a.type === 'normal')
    const bossAreas = areas.filter(a => a.type === 'boss')
    const hiddenAreas = areas.filter(a => a.type === 'hidden')
    const treasureAreas = areas.filter(a => a.type === 'treasure')

    expect(mathAreas.length).toBe(3)
    expect(chineseAreas.length).toBe(3)
    expect(englishAreas.length).toBe(3)
    expect(bossAreas.length).toBe(1)
    expect(hiddenAreas.length).toBe(2)
    expect(treasureAreas.length).toBe(1)
  })

  it('隐藏区域需要钥匙', () => {
    const hiddenArea = getAreaById('east_hidden_A')
    expect(hiddenArea?.requiredKeys).toBe(1)
  })

  it('普通区域不需要钥匙', () => {
    const normalArea = getAreaById('east_math_1')
    expect(normalArea?.requiredKeys).toBe(0)
  })

  it('难度星数正确', () => {
    expect(getDifficultyStars(1)).toBe('⭐')
    expect(getDifficultyStars(2)).toBe('⭐⭐')
    expect(getDifficultyStars(3)).toBe('⭐⭐⭐')
  })
})

describe('isAreaReachable', () => {
  it('已击败的岛屿可以直接访问', () => {
    const result = isAreaReachable('east_math_1', null, ['east_math_1'], [])
    expect(result.reachable).toBe(true)
  })

  it('当前所在岛屿可以访问', () => {
    const result = isAreaReachable('east_math_1', 'east_math_1', [], [])
    expect(result.reachable).toBe(true)
  })

  it('Boss岛屿需要当前大洋所有普通岛屿完成后才能访问', () => {
    // 东大洋有9个普通岛屿（3链×3难度）
    // 8个岛屿不足以挑战boss
    const result = isAreaReachable('east_boss', null, ['east_math_1', 'east_math_2', 'east_math_3', 'east_chinese_1', 'east_chinese_2', 'east_chinese_3', 'east_english_1', 'east_english_2'], [])
    expect(result.reachable).toBe(false)
    expect(result.reason).toContain('9')

    // 9个岛屿后可以挑战boss
    const resultWith9 = isAreaReachable('east_boss', null, ['east_math_1', 'east_math_2', 'east_math_3', 'east_chinese_1', 'east_chinese_2', 'east_chinese_3', 'east_english_1', 'east_english_2', 'east_english_3'], [])
    expect(resultWith9.reachable).toBe(true)
  })

  it('在reachableAreas列表中的岛屿可以直接访问', () => {
    const result = isAreaReachable('east_math_2', null, [], ['east_math_2'])
    expect(result.reachable).toBe(true)
  })

  it('未完成的岛屿且不在reachableAreas中不可访问', () => {
    const result = isAreaReachable('east_math_3', null, ['east_math_1'], [])
    expect(result.reachable).toBe(false)
    expect(result.reason).toContain('前置')
  })

  it('击败math_1后math_2应该可达', () => {
    // math_1被击败后，math_2应该在reachableAreas中（通过BATTLE_WIN添加）
    const result = isAreaReachable('east_math_2', null, ['east_math_1'], ['east_math_2'])
    expect(result.reachable).toBe(true)
  })

  it('击败math_1后chinese_1和english_1应该可达', () => {
    const result1 = isAreaReachable('east_chinese_1', null, ['east_math_1'], ['east_chinese_1'])
    const result2 = isAreaReachable('east_english_1', null, ['east_math_1'], ['east_english_1'])
    expect(result1.reachable).toBe(true)
    expect(result2.reachable).toBe(true)
  })
})