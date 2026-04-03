import { describe, it, expect } from 'vitest'
import { getAreasByOcean, getAreaById, getDifficultyStars } from './index'

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