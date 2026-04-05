import { Area } from '../../game/types'

// 东大洋区域布局 (13个区域)
// 岛屿位置在1000x600的画布上分布，使用0-10的网格坐标转换为像素
export const eastAreas: Area[] = [
  // 数学区域 - 左侧链条 (从下到上)
  {
    id: 'east_math_1',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '数学迷宫 - 入门',
    difficulty: 1,
    type: 'normal',
    position: { x: 1, z: 1 },
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
    position: { x: 1, z: 3 },
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
    position: { x: 1, z: 5 },
    requiredKeys: 0,
    monsterId: 'math_slime_3',
    connections: ['east_math_2', 'east_boss'],
  },

  // 语文区域 - 中间链条 (从下到上)
  {
    id: 'east_chinese_1',
    oceanId: 'east',
    knowledgeArea: 'chinese',
    name: '文字森林 - 入门',
    difficulty: 1,
    type: 'normal',
    position: { x: 5, z: 1 },
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
    position: { x: 5, z: 3 },
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
    position: { x: 5, z: 5 },
    requiredKeys: 0,
    monsterId: 'chinese_slime_3',
    connections: ['east_chinese_2', 'east_boss'],
  },

  // 英语区域 - 右侧链条 (从下到上)
  {
    id: 'east_english_1',
    oceanId: 'east',
    knowledgeArea: 'english',
    name: '单词海洋 - 入门',
    difficulty: 1,
    type: 'normal',
    position: { x: 9, z: 1 },
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
    position: { x: 9, z: 3 },
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
    position: { x: 9, z: 5 },
    requiredKeys: 0,
    monsterId: 'english_slime_3',
    connections: ['east_english_2', 'east_boss'],
  },

  // 隐藏区域 (需要钥匙) - 分散在角落
  {
    id: 'east_hidden_A',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '秘密宝藏室 A',
    difficulty: 2,
    type: 'hidden',
    position: { x: 3, z: 0 },
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
    position: { x: 7, z: 0 },
    requiredKeys: 1,
    monsterId: 'treasure_guardian',
    connections: ['east_chinese_1'],
  },

  // 宝箱区域 - 分散放置
  {
    id: 'east_treasure_1',
    oceanId: 'east',
    knowledgeArea: 'math',
    name: '奖励宝箱',
    difficulty: 1,
    type: 'treasure',
    position: { x: 3, z: 7 },
    requiredKeys: 0,
    connections: ['east_math_2'],
  },

  // 大Boss区域 - 顶部中央
  {
    id: 'east_boss',
    oceanId: 'east',
    knowledgeArea: 'comprehensive',
    name: '东大洋守护者',
    difficulty: 3,
    type: 'boss',
    position: { x: 5, z: 8 },
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

// 检查区域是否可达（基于当前进度）
export function isAreaReachable(
  areaId: string,
  currentAreaId: string | null,
  defeatedMiniBosses: string[],
  visitedAreas: string[]
): { reachable: boolean; reason?: string } {
  const area = getAreaById(areaId)
  if (!area) return { reachable: false, reason: '区域不存在' }

  // Boss岛屿需要9个岛屿完成后才能访问
  if (area.type === 'boss') {
    if (defeatedMiniBosses.length < 9) {
      return { reachable: false, reason: `需要打败9个岛屿才能挑战Boss (${defeatedMiniBosses.length}/9)` }
    }
    return { reachable: true }
  }

  // 已击败的岛屿可以直接访问
  if (defeatedMiniBosses.includes(areaId)) {
    return { reachable: true }
  }

  // 如果是当前所在岛屿，可以访问
  if (currentAreaId === areaId) {
    return { reachable: true }
  }

  // 首次进入大洋时，所有难度1的普通岛屿都可访问
  if (defeatedMiniBosses.length === 0 && !visitedAreas.some(v => v !== currentAreaId)) {
    if (area.type === 'normal' && area.difficulty === 1) {
      return { reachable: true }
    }
    return { reachable: false, reason: '请先完成初始岛屿' }
  }

  // 获取当前区域
  const currentArea = currentAreaId ? getAreaById(currentAreaId) : null
  if (!currentArea) {
    return { reachable: false, reason: '当前区域未知' }
  }

  // 检查是否是同类型下一阶岛屿
  if (area.knowledgeArea === currentArea.knowledgeArea &&
      area.difficulty === currentArea.difficulty + 1) {
    return { reachable: true }
  }

  // 检查是否是当前岛屿的直接连接
  if (currentArea.connections.includes(areaId)) {
    // 如果目标是更低难度，直接可达
    if (area.difficulty < currentArea.difficulty) {
      return { reachable: true }
    }

    // 如果是同级难度，检查其下方连接是否都已完成
    if (area.difficulty === currentArea.difficulty) {
      const areaConnections = area.connections
        .map(id => getAreaById(id))
        .filter(a => a) as Area[]

      const lowerConnections = areaConnections.filter(a => a && a.difficulty < area.difficulty)
      const allLowerCompleted = lowerConnections.every(a =>
        defeatedMiniBosses.includes(a!.id)
      )

      if (allLowerCompleted) {
        return { reachable: true }
      }
    }
  }

  return { reachable: false, reason: '请先完成前置岛屿' }
}