import { Area } from '../../game/types'

// 东大洋区域布局 (13个区域)
export const eastAreas: Area[] = [
  // 数学区域 (3个难度)
  {
    id: 'east_math_1',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '数学迷宫 - 入门',
    difficulty: 1,
    type: 'normal',
    position: { x: -2, z: 0 },
    requiredKeys: 0,
    monsterId: 'math_slime_1',
    connections: ['east_chinese_1', 'east_english_1'],
  },
  {
    id: 'east_math_2',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '数学迷宫 - 进阶',
    difficulty: 2,
    type: 'normal',
    position: { x: -3, z: 1 },
    requiredKeys: 0,
    monsterId: 'math_slime_2',
    connections: ['east_math_1', 'east_chinese_2'],
  },
  {
    id: 'east_math_3',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '数学迷宫 - 挑战',
    difficulty: 3,
    type: 'normal',
    position: { x: -4, z: 2 },
    requiredKeys: 0,
    monsterId: 'math_slime_3',
    connections: ['east_math_2', 'east_boss'],
  },

  // 语文区域 (3个难度)
  {
    id: 'east_chinese_1',
    oceanId: 'east',
    knowledgeArea: 'chinese',
    name: '文字森林 - 入门',
    difficulty: 1,
    type: 'normal',
    position: { x: 0, z: -1 },
    requiredKeys: 0,
    monsterId: 'chinese_slime_1',
    connections: ['east_math_1', 'east_english_1'],
  },
  {
    id: 'east_chinese_2',
    oceanId: 'east',
    knowledgeArea: 'chinese',
    name: '文字森林 - 进阶',
    difficulty: 2,
    type: 'normal',
    position: { x: 0, z: 1 },
    requiredKeys: 0,
    monsterId: 'chinese_slime_2',
    connections: ['east_chinese_1', 'east_english_2'],
  },
  {
    id: 'east_chinese_3',
    oceanId: 'east',
    knowledgeArea: 'chinese',
    name: '文字森林 - 挑战',
    difficulty: 3,
    type: 'normal',
    position: { x: 0, z: 2 },
    requiredKeys: 0,
    monsterId: 'chinese_slime_3',
    connections: ['east_chinese_2', 'east_boss'],
  },

  // 英语区域 (3个难度)
  {
    id: 'east_english_1',
    oceanId: 'east',
    knowledgeArea: 'english',
    name: '单词海洋 - 入门',
    difficulty: 1,
    type: 'normal',
    position: { x: 2, z: 0 },
    requiredKeys: 0,
    monsterId: 'english_slime_1',
    connections: ['east_math_1', 'east_chinese_1'],
  },
  {
    id: 'east_english_2',
    oceanId: 'east',
    knowledgeArea: 'english',
    name: '单词海洋 - 进阶',
    difficulty: 2,
    type: 'normal',
    position: { x: 3, z: 1 },
    requiredKeys: 0,
    monsterId: 'english_slime_2',
    connections: ['east_english_1', 'east_chinese_2'],
  },
  {
    id: 'east_english_3',
    oceanId: 'east',
    knowledgeArea: 'english',
    name: '单词海洋 - 挑战',
    difficulty: 3,
    type: 'normal',
    position: { x: 4, z: 2 },
    requiredKeys: 0,
    monsterId: 'english_slime_3',
    connections: ['east_english_2', 'east_boss'],
  },

  // 隐藏区域 (需要钥匙)
  {
    id: 'east_hidden_A',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '秘密宝藏室 A',
    difficulty: 2,
    type: 'hidden',
    position: { x: -1, z: -1 },
    requiredKeys: 1,
    monsterId: 'treasure_guardian',
    connections: ['east_math_1'],
  },
  {
    id: 'east_hidden_B',
    oceanId: 'east',
    knowledgeArea: 'chinese',
    name: '秘密宝藏室 B',
    difficulty: 2,
    type: 'hidden',
    position: { x: 1, z: -1 },
    requiredKeys: 1,
    monsterId: 'treasure_guardian',
    connections: ['east_chinese_1'],
  },

  // 宝箱区域
  {
    id: 'east_treasure_1',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '奖励宝箱',
    difficulty: 1,
    type: 'treasure',
    position: { x: -2, z: 2 },
    requiredKeys: 0,
    connections: ['east_math_2'],
  },

  // 大Boss区域
  {
    id: 'east_boss',
    oceanId: 'east',
    knowledgeArea: 'comprehensive',
    name: '东大洋守护者',
    difficulty: 3,
    type: 'boss',
    position: { x: 0, z: 3 },
    requiredKeys: 0,
    monsterId: 'jellyfish_king',
    connections: ['east_math_3', 'east_chinese_3', 'east_english_3'],
  },
]

// 导出所有大洋区域数据
export const areasData: Record<string, Area[]> = {
  east: eastAreas,
  west: [],  // 待实现 - 西洋大洋
  southHot: [],  // 待实现 - 南热大洋
  northIce: [],  // 待实现 - 北冰大洋
  mysterious: [],  // 待实现 - 神秘大洋
}

// 获取指定大洋的区域
export function getAreasByOcean(oceanId: string): Area[] {
  return areasData[oceanId] || []
}

// 获取指定区域
export function getAreaById(areaId: string): Area | undefined {
  for (const areas of Object.values(areasData)) {
    const area = areas.find(a => a.id === areaId)
    if (area) return area
  }
  return undefined
}

// 获取区域的难度标签
export function getDifficultyStars(difficulty: 1 | 2 | 3): string {
  return '⭐'.repeat(difficulty)
}