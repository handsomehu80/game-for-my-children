import { Area } from '../../game/types'

// 东大洋区域布局 (13个区域)
// 岛屿位置在1000x600的画布上分布，使用0-10的网格坐标转换为像素
export const eastAreas: Area[] = [
  // 数学区域 - 左侧链条 (从下到上)
  // 连接规则：同级之间互联，向上一链
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
    connections: ['east_chinese_1', 'east_english_1', 'east_math_2'],  // 同级互联 + 向上一链
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
    connections: ['east_chinese_2', 'east_english_2', 'east_math_1', 'east_math_3'],  // 同级互联 + 下一链 + 上一链
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
    connections: ['east_chinese_3', 'east_english_3', 'east_math_2', 'east_boss'],  // 同级互联 + 下一链 + Boss
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
    connections: ['east_math_1', 'east_english_1', 'east_chinese_2'],  // 同级互联 + 向上一链
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
    connections: ['east_math_2', 'east_english_2', 'east_chinese_1', 'east_chinese_3'],  // 同级互联 + 下一链 + 上一链
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
    connections: ['east_math_3', 'east_english_3', 'east_chinese_2', 'east_boss'],  // 同级互联 + 下一链 + Boss
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
    connections: ['east_math_1', 'east_chinese_1', 'east_english_2'],  // 同级互联 + 向上一链
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
    connections: ['east_math_2', 'east_chinese_2', 'east_english_1', 'east_english_3'],  // 同级互联 + 下一链 + 上一链
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
    connections: ['east_math_3', 'east_chinese_3', 'east_english_2', 'east_boss'],  // 同级互联 + 下一链 + Boss
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

// 西大洋区域布局 (16个区域)
// 沙漠主题：4条知识链 + 隐藏区域 + 宝藏区域 + Boss
export const westAreas: Area[] = [
  // 数学链 - 左侧 (x=1)
  {
    id: 'west_math_1',
    oceanId: 'west',
    knowledgeArea: 'math',
    name: '沙漠数学金字塔',
    difficulty: 1,
    type: 'normal',
    position: { x: 1, z: 1 },
    requiredKeys: 0,
    monsterId: 'scorpion_1',
    connections: ['west_chinese_1', 'west_english_1', 'west_science_1', 'west_math_2'],
  },
  {
    id: 'west_math_2',
    oceanId: 'west',
    knowledgeArea: 'math',
    name: '沙漠数学神殿',
    difficulty: 2,
    type: 'normal',
    position: { x: 1, z: 3 },
    requiredKeys: 0,
    monsterId: 'scorpion_2',
    connections: ['west_chinese_2', 'west_english_2', 'west_science_2', 'west_math_1', 'west_math_3'],
  },
  {
    id: 'west_math_3',
    oceanId: 'west',
    knowledgeArea: 'math',
    name: '沙漠数学秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 1, z: 5 },
    requiredKeys: 0,
    monsterId: 'scorpion_3',
    connections: ['west_chinese_3', 'west_english_3', 'west_science_3', 'west_math_2', 'west_boss'],
  },

  // 语文链 (x=3)
  {
    id: 'west_chinese_1',
    oceanId: 'west',
    knowledgeArea: 'chinese',
    name: '沙漠文字遗迹',
    difficulty: 1,
    type: 'normal',
    position: { x: 3, z: 1 },
    requiredKeys: 0,
    monsterId: 'lizard_1',
    connections: ['west_math_1', 'west_english_1', 'west_science_1', 'west_chinese_2'],
  },
  {
    id: 'west_chinese_2',
    oceanId: 'west',
    knowledgeArea: 'chinese',
    name: '沙漠文字神庙',
    difficulty: 2,
    type: 'normal',
    position: { x: 3, z: 3 },
    requiredKeys: 0,
    monsterId: 'lizard_2',
    connections: ['west_math_2', 'west_english_2', 'west_science_2', 'west_chinese_1', 'west_chinese_3'],
  },
  {
    id: 'west_chinese_3',
    oceanId: 'west',
    knowledgeArea: 'chinese',
    name: '沙漠文字迷宫',
    difficulty: 3,
    type: 'normal',
    position: { x: 3, z: 5 },
    requiredKeys: 0,
    monsterId: 'lizard_3',
    connections: ['west_math_3', 'west_english_3', 'west_science_3', 'west_chinese_2', 'west_boss'],
  },

  // 英语链 (x=5)
  {
    id: 'west_english_1',
    oceanId: 'west',
    knowledgeArea: 'english',
    name: '沙漠英语石碑',
    difficulty: 1,
    type: 'normal',
    position: { x: 5, z: 1 },
    requiredKeys: 0,
    monsterId: 'snake_1',
    connections: ['west_math_1', 'west_chinese_1', 'west_science_1', 'west_english_2'],
  },
  {
    id: 'west_english_2',
    oceanId: 'west',
    knowledgeArea: 'english',
    name: '沙漠英语殿堂',
    difficulty: 2,
    type: 'normal',
    position: { x: 5, z: 3 },
    requiredKeys: 0,
    monsterId: 'snake_2',
    connections: ['west_math_2', 'west_chinese_2', 'west_science_2', 'west_english_1', 'west_english_3'],
  },
  {
    id: 'west_english_3',
    oceanId: 'west',
    knowledgeArea: 'english',
    name: '沙漠英语秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 5, z: 5 },
    requiredKeys: 0,
    monsterId: 'snake_3',
    connections: ['west_math_3', 'west_chinese_3', 'west_science_3', 'west_english_2', 'west_boss'],
  },

  // 科学链 (x=7)
  {
    id: 'west_science_1',
    oceanId: 'west',
    knowledgeArea: 'science',
    name: '沙漠科学祭坛',
    difficulty: 1,
    type: 'normal',
    position: { x: 7, z: 1 },
    requiredKeys: 0,
    monsterId: 'desert_eagle_1',
    connections: ['west_math_1', 'west_chinese_1', 'west_english_1', 'west_science_2'],
  },
  {
    id: 'west_science_2',
    oceanId: 'west',
    knowledgeArea: 'science',
    name: '沙漠科学遗迹',
    difficulty: 2,
    type: 'normal',
    position: { x: 7, z: 3 },
    requiredKeys: 0,
    monsterId: 'desert_eagle_2',
    connections: ['west_math_2', 'west_chinese_2', 'west_english_2', 'west_science_1', 'west_science_3'],
  },
  {
    id: 'west_science_3',
    oceanId: 'west',
    knowledgeArea: 'science',
    name: '沙漠科学秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 7, z: 5 },
    requiredKeys: 0,
    monsterId: 'desert_eagle_3',
    connections: ['west_math_3', 'west_chinese_3', 'west_english_3', 'west_science_2', 'west_boss'],
  },

  // 隐藏区域 (需要钥匙)
  {
    id: 'west_hidden_A',
    oceanId: 'west',
    knowledgeArea: 'math',
    name: '沙漠秘密祭坛 A',
    difficulty: 2,
    type: 'hidden',
    position: { x: 2, z: 0 },
    requiredKeys: 1,
    monsterId: 'desert_guardian',
    connections: ['west_math_1'],
  },
  {
    id: 'west_hidden_B',
    oceanId: 'west',
    knowledgeArea: 'science',
    name: '沙漠秘密祭坛 B',
    difficulty: 2,
    type: 'hidden',
    position: { x: 6, z: 0 },
    requiredKeys: 1,
    monsterId: 'desert_guardian',
    connections: ['west_science_1'],
  },

  // 宝藏区域
  {
    id: 'west_treasure_1',
    oceanId: 'west',
    knowledgeArea: 'chinese',
    name: '沙漠宝藏遗迹',
    difficulty: 1,
    type: 'treasure',
    position: { x: 4, z: 7 },
    requiredKeys: 2,
    monsterId: 'treasure_spirit',
    connections: ['west_chinese_2'],
  },

  // Boss区域
  {
    id: 'west_boss',
    oceanId: 'west',
    knowledgeArea: 'comprehensive',
    name: '西大洋守护者',
    difficulty: 3,
    type: 'boss',
    position: { x: 4, z: 8 },
    requiredKeys: 0,
    monsterId: 'sea_serpent_king',
    connections: ['west_math_3', 'west_chinese_3', 'west_english_3', 'west_science_3'],
  },
]

// 南热大洋区域布局 (19个区域)
// 火山熔岩主题：5条知识链 + 隐藏区域 + 宝藏区域 + Boss
export const southAreas: Area[] = [
  // 数学链 (x=1)
  {
    id: 'south_math_1',
    oceanId: 'southHot',
    knowledgeArea: 'math',
    name: '熔岩数学漩涡',
    difficulty: 1,
    type: 'normal',
    position: { x: 1, z: 1 },
    requiredKeys: 0,
    monsterId: 'flame_fish_1',
    connections: ['south_chinese_1', 'south_english_1', 'south_science_1', 'south_history_1', 'south_math_2'],
  },
  {
    id: 'south_math_2',
    oceanId: 'southHot',
    knowledgeArea: 'math',
    name: '熔岩数学神殿',
    difficulty: 2,
    type: 'normal',
    position: { x: 1, z: 3 },
    requiredKeys: 0,
    monsterId: 'flame_fish_2',
    connections: ['south_chinese_2', 'south_english_2', 'south_science_2', 'south_history_2', 'south_math_1', 'south_math_3'],
  },
  {
    id: 'south_math_3',
    oceanId: 'southHot',
    knowledgeArea: 'math',
    name: '熔岩数学秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 1, z: 5 },
    requiredKeys: 0,
    monsterId: 'flame_fish_3',
    connections: ['south_chinese_3', 'south_english_3', 'south_science_3', 'south_history_3', 'south_math_2', 'south_boss'],
  },

  // 语文链 (x=2.5)
  {
    id: 'south_chinese_1',
    oceanId: 'southHot',
    knowledgeArea: 'chinese',
    name: '熔岩文字遗迹',
    difficulty: 1,
    type: 'normal',
    position: { x: 2.5, z: 1 },
    requiredKeys: 0,
    monsterId: 'lava_turtle_1',
    connections: ['south_math_1', 'south_english_1', 'south_science_1', 'south_history_1', 'south_chinese_2'],
  },
  {
    id: 'south_chinese_2',
    oceanId: 'southHot',
    knowledgeArea: 'chinese',
    name: '熔岩文字神庙',
    difficulty: 2,
    type: 'normal',
    position: { x: 2.5, z: 3 },
    requiredKeys: 0,
    monsterId: 'lava_turtle_2',
    connections: ['south_math_2', 'south_english_2', 'south_science_2', 'south_history_2', 'south_chinese_1', 'south_chinese_3'],
  },
  {
    id: 'south_chinese_3',
    oceanId: 'southHot',
    knowledgeArea: 'chinese',
    name: '熔岩文字迷宫',
    difficulty: 3,
    type: 'normal',
    position: { x: 2.5, z: 5 },
    requiredKeys: 0,
    monsterId: 'lava_turtle_3',
    connections: ['south_math_3', 'south_english_3', 'south_science_3', 'south_history_3', 'south_chinese_2', 'south_boss'],
  },

  // 英语链 (x=4)
  {
    id: 'south_english_1',
    oceanId: 'southHot',
    knowledgeArea: 'english',
    name: '熔岩英语石碑',
    difficulty: 1,
    type: 'normal',
    position: { x: 4, z: 1 },
    requiredKeys: 0,
    monsterId: 'magma_lobster_1',
    connections: ['south_math_1', 'south_chinese_1', 'south_science_1', 'south_history_1', 'south_english_2'],
  },
  {
    id: 'south_english_2',
    oceanId: 'southHot',
    knowledgeArea: 'english',
    name: '熔岩英语殿堂',
    difficulty: 2,
    type: 'normal',
    position: { x: 4, z: 3 },
    requiredKeys: 0,
    monsterId: 'magma_lobster_2',
    connections: ['south_math_2', 'south_chinese_2', 'south_science_2', 'south_history_2', 'south_english_1', 'south_english_3'],
  },
  {
    id: 'south_english_3',
    oceanId: 'southHot',
    knowledgeArea: 'english',
    name: '熔岩英语秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 4, z: 5 },
    requiredKeys: 0,
    monsterId: 'magma_lobster_3',
    connections: ['south_math_3', 'south_chinese_3', 'south_science_3', 'south_history_3', 'south_english_2', 'south_boss'],
  },

  // 科学链 (x=5.5)
  {
    id: 'south_science_1',
    oceanId: 'southHot',
    knowledgeArea: 'science',
    name: '熔岩科学祭坛',
    difficulty: 1,
    type: 'normal',
    position: { x: 5.5, z: 1 },
    requiredKeys: 0,
    monsterId: 'flame_eel_1',
    connections: ['south_math_1', 'south_chinese_1', 'south_english_1', 'south_history_1', 'south_science_2'],
  },
  {
    id: 'south_science_2',
    oceanId: 'southHot',
    knowledgeArea: 'science',
    name: '熔岩科学遗迹',
    difficulty: 2,
    type: 'normal',
    position: { x: 5.5, z: 3 },
    requiredKeys: 0,
    monsterId: 'flame_eel_2',
    connections: ['south_math_2', 'south_chinese_2', 'south_english_2', 'south_history_2', 'south_science_1', 'south_science_3'],
  },
  {
    id: 'south_science_3',
    oceanId: 'southHot',
    knowledgeArea: 'science',
    name: '熔岩科学秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 5.5, z: 5 },
    requiredKeys: 0,
    monsterId: 'flame_eel_3',
    connections: ['south_math_3', 'south_chinese_3', 'south_english_3', 'south_history_3', 'south_science_2', 'south_boss'],
  },

  // 历史链 (x=7)
  {
    id: 'south_history_1',
    oceanId: 'southHot',
    knowledgeArea: 'history',
    name: '熔岩历史遗迹',
    difficulty: 1,
    type: 'normal',
    position: { x: 7, z: 1 },
    requiredKeys: 0,
    monsterId: 'ancient_spirit_1',
    connections: ['south_math_1', 'south_chinese_1', 'south_english_1', 'south_science_1', 'south_history_2'],
  },
  {
    id: 'south_history_2',
    oceanId: 'southHot',
    knowledgeArea: 'history',
    name: '熔岩历史神庙',
    difficulty: 2,
    type: 'normal',
    position: { x: 7, z: 3 },
    requiredKeys: 0,
    monsterId: 'ancient_spirit_2',
    connections: ['south_math_2', 'south_chinese_2', 'south_english_2', 'south_science_2', 'south_history_1', 'south_history_3'],
  },
  {
    id: 'south_history_3',
    oceanId: 'southHot',
    knowledgeArea: 'history',
    name: '熔岩历史秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 7, z: 5 },
    requiredKeys: 0,
    monsterId: 'ancient_spirit_3',
    connections: ['south_math_3', 'south_chinese_3', 'south_english_3', 'south_science_3', 'south_history_2', 'south_boss'],
  },

  // 隐藏区域 (需要钥匙)
  {
    id: 'south_hidden_A',
    oceanId: 'southHot',
    knowledgeArea: 'math',
    name: '熔岩秘密祭坛 A',
    difficulty: 2,
    type: 'hidden',
    position: { x: 1.5, z: 0 },
    requiredKeys: 1,
    monsterId: 'lava_guardian',
    connections: ['south_math_1'],
  },
  {
    id: 'south_hidden_B',
    oceanId: 'southHot',
    knowledgeArea: 'science',
    name: '熔岩秘密祭坛 B',
    difficulty: 2,
    type: 'hidden',
    position: { x: 6, z: 0 },
    requiredKeys: 1,
    monsterId: 'lava_guardian',
    connections: ['south_science_1'],
  },

  // 宝藏区域
  {
    id: 'south_treasure_1',
    oceanId: 'southHot',
    knowledgeArea: 'history',
    name: '熔岩宝藏遗迹',
    difficulty: 1,
    type: 'treasure',
    position: { x: 4, z: 7 },
    requiredKeys: 2,
    monsterId: 'treasure_spirit',
    connections: ['south_history_2'],
  },

  // Boss区域
  {
    id: 'south_boss',
    oceanId: 'southHot',
    knowledgeArea: 'comprehensive',
    name: '南热大洋守护者',
    difficulty: 3,
    type: 'boss',
    position: { x: 4, z: 8 },
    requiredKeys: 0,
    monsterId: 'lava_dragon_king',
    connections: ['south_math_3', 'south_chinese_3', 'south_english_3', 'south_science_3', 'south_history_3'],
  },
]

// 北冰大洋区域布局 (22个区域)
// 寒冰主题：6条知识链 + 隐藏区域 + 宝藏区域 + Boss
export const northAreas: Area[] = [
  // 语文链 (x=1)
  {
    id: 'north_chinese_1',
    oceanId: 'northIce',
    knowledgeArea: 'chinese',
    name: '寒冰文字遗迹',
    difficulty: 1,
    type: 'normal',
    position: { x: 1, z: 1 },
    requiredKeys: 0,
    monsterId: 'polar_bear_1',
    connections: ['north_math_1', 'north_english_1', 'north_science_1', 'north_physics_1', 'north_chemistry_1', 'north_chinese_2'],
  },
  {
    id: 'north_chinese_2',
    oceanId: 'northIce',
    knowledgeArea: 'chinese',
    name: '寒冰文字神庙',
    difficulty: 2,
    type: 'normal',
    position: { x: 1, z: 3 },
    requiredKeys: 0,
    monsterId: 'polar_bear_2',
    connections: ['north_math_2', 'north_english_2', 'north_science_2', 'north_physics_2', 'north_chemistry_2', 'north_chinese_1', 'north_chinese_3'],
  },
  {
    id: 'north_chinese_3',
    oceanId: 'northIce',
    knowledgeArea: 'chinese',
    name: '寒冰文字迷宫',
    difficulty: 3,
    type: 'normal',
    position: { x: 1, z: 5 },
    requiredKeys: 0,
    monsterId: 'polar_bear_3',
    connections: ['north_math_3', 'north_english_3', 'north_science_3', 'north_physics_3', 'north_chemistry_3', 'north_chinese_2', 'north_boss'],
  },

  // 数学链 (x=2.5)
  {
    id: 'north_math_1',
    oceanId: 'northIce',
    knowledgeArea: 'math',
    name: '寒冰数学漩涡',
    difficulty: 1,
    type: 'normal',
    position: { x: 2.5, z: 1 },
    requiredKeys: 0,
    monsterId: 'penguin_1',
    connections: ['north_chinese_1', 'north_english_1', 'north_science_1', 'north_physics_1', 'north_chemistry_1', 'north_math_2'],
  },
  {
    id: 'north_math_2',
    oceanId: 'northIce',
    knowledgeArea: 'math',
    name: '寒冰数学神殿',
    difficulty: 2,
    type: 'normal',
    position: { x: 2.5, z: 3 },
    requiredKeys: 0,
    monsterId: 'penguin_2',
    connections: ['north_chinese_2', 'north_english_2', 'north_science_2', 'north_physics_2', 'north_chemistry_2', 'north_math_1', 'north_math_3'],
  },
  {
    id: 'north_math_3',
    oceanId: 'northIce',
    knowledgeArea: 'math',
    name: '寒冰数学秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 2.5, z: 5 },
    requiredKeys: 0,
    monsterId: 'penguin_3',
    connections: ['north_chinese_3', 'north_english_3', 'north_science_3', 'north_physics_3', 'north_chemistry_3', 'north_math_2', 'north_boss'],
  },

  // 英语链 (x=4)
  {
    id: 'north_english_1',
    oceanId: 'northIce',
    knowledgeArea: 'english',
    name: '寒冰英语石碑',
    difficulty: 1,
    type: 'normal',
    position: { x: 4, z: 1 },
    requiredKeys: 0,
    monsterId: 'seal_1',
    connections: ['north_chinese_1', 'north_math_1', 'north_science_1', 'north_physics_1', 'north_chemistry_1', 'north_english_2'],
  },
  {
    id: 'north_english_2',
    oceanId: 'northIce',
    knowledgeArea: 'english',
    name: '寒冰英语殿堂',
    difficulty: 2,
    type: 'normal',
    position: { x: 4, z: 3 },
    requiredKeys: 0,
    monsterId: 'seal_2',
    connections: ['north_chinese_2', 'north_math_2', 'north_science_2', 'north_physics_2', 'north_chemistry_2', 'north_english_1', 'north_english_3'],
  },
  {
    id: 'north_english_3',
    oceanId: 'northIce',
    knowledgeArea: 'english',
    name: '寒冰英语秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 4, z: 5 },
    requiredKeys: 0,
    monsterId: 'seal_3',
    connections: ['north_chinese_3', 'north_math_3', 'north_science_3', 'north_physics_3', 'north_chemistry_3', 'north_english_2', 'north_boss'],
  },

  // 科学链 (x=5.5)
  {
    id: 'north_science_1',
    oceanId: 'northIce',
    knowledgeArea: 'science',
    name: '寒冰科学祭坛',
    difficulty: 1,
    type: 'normal',
    position: { x: 5.5, z: 1 },
    requiredKeys: 0,
    monsterId: 'whale_1',
    connections: ['north_chinese_1', 'north_math_1', 'north_english_1', 'north_physics_1', 'north_chemistry_1', 'north_science_2'],
  },
  {
    id: 'north_science_2',
    oceanId: 'northIce',
    knowledgeArea: 'science',
    name: '寒冰科学遗迹',
    difficulty: 2,
    type: 'normal',
    position: { x: 5.5, z: 3 },
    requiredKeys: 0,
    monsterId: 'whale_2',
    connections: ['north_chinese_2', 'north_math_2', 'north_english_2', 'north_physics_2', 'north_chemistry_2', 'north_science_1', 'north_science_3'],
  },
  {
    id: 'north_science_3',
    oceanId: 'northIce',
    knowledgeArea: 'science',
    name: '寒冰科学秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 5.5, z: 5 },
    requiredKeys: 0,
    monsterId: 'whale_3',
    connections: ['north_chinese_3', 'north_math_3', 'north_english_3', 'north_physics_3', 'north_chemistry_3', 'north_science_2', 'north_boss'],
  },

  // 物理链 (x=7)
  {
    id: 'north_physics_1',
    oceanId: 'northIce',
    knowledgeArea: 'physics',
    name: '寒冰物理祭坛',
    difficulty: 1,
    type: 'normal',
    position: { x: 7, z: 1 },
    requiredKeys: 0,
    monsterId: 'ice_crystal_1',
    connections: ['north_chinese_1', 'north_math_1', 'north_english_1', 'north_science_1', 'north_chemistry_1', 'north_physics_2'],
  },
  {
    id: 'north_physics_2',
    oceanId: 'northIce',
    knowledgeArea: 'physics',
    name: '寒冰物理遗迹',
    difficulty: 2,
    type: 'normal',
    position: { x: 7, z: 3 },
    requiredKeys: 0,
    monsterId: 'ice_crystal_2',
    connections: ['north_chinese_2', 'north_math_2', 'north_english_2', 'north_science_2', 'north_chemistry_2', 'north_physics_1', 'north_physics_3'],
  },
  {
    id: 'north_physics_3',
    oceanId: 'northIce',
    knowledgeArea: 'physics',
    name: '寒冰物理秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 7, z: 5 },
    requiredKeys: 0,
    monsterId: 'ice_crystal_3',
    connections: ['north_chinese_3', 'north_math_3', 'north_english_3', 'north_science_3', 'north_chemistry_3', 'north_physics_2', 'north_boss'],
  },

  // 化学链 (x=8.5)
  {
    id: 'north_chemistry_1',
    oceanId: 'northIce',
    knowledgeArea: 'chemistry',
    name: '寒冰化学祭坛',
    difficulty: 1,
    type: 'normal',
    position: { x: 8.5, z: 1 },
    requiredKeys: 0,
    monsterId: 'snowflake_1',
    connections: ['north_chinese_1', 'north_math_1', 'north_english_1', 'north_science_1', 'north_physics_1', 'north_chemistry_2'],
  },
  {
    id: 'north_chemistry_2',
    oceanId: 'northIce',
    knowledgeArea: 'chemistry',
    name: '寒冰化学遗迹',
    difficulty: 2,
    type: 'normal',
    position: { x: 8.5, z: 3 },
    requiredKeys: 0,
    monsterId: 'snowflake_2',
    connections: ['north_chinese_2', 'north_math_2', 'north_english_2', 'north_science_2', 'north_physics_2', 'north_chemistry_1', 'north_chemistry_3'],
  },
  {
    id: 'north_chemistry_3',
    oceanId: 'northIce',
    knowledgeArea: 'chemistry',
    name: '寒冰化学秘境',
    difficulty: 3,
    type: 'normal',
    position: { x: 8.5, z: 5 },
    requiredKeys: 0,
    monsterId: 'snowflake_3',
    connections: ['north_chinese_3', 'north_math_3', 'north_english_3', 'north_science_3', 'north_physics_3', 'north_chemistry_2', 'north_boss'],
  },

  // 隐藏区域 (需要钥匙)
  {
    id: 'north_hidden_A',
    oceanId: 'northIce',
    knowledgeArea: 'chinese',
    name: '寒冰秘密祭坛 A',
    difficulty: 2,
    type: 'hidden',
    position: { x: 1.5, z: 0 },
    requiredKeys: 1,
    monsterId: 'ice_guardian',
    connections: ['north_chinese_1'],
  },
  {
    id: 'north_hidden_B',
    oceanId: 'northIce',
    knowledgeArea: 'physics',
    name: '寒冰秘密祭坛 B',
    difficulty: 2,
    type: 'hidden',
    position: { x: 7.5, z: 0 },
    requiredKeys: 1,
    monsterId: 'ice_guardian',
    connections: ['north_physics_1'],
  },

  // 宝藏区域
  {
    id: 'north_treasure_1',
    oceanId: 'northIce',
    knowledgeArea: 'chemistry',
    name: '寒冰宝藏遗迹',
    difficulty: 1,
    type: 'treasure',
    position: { x: 4, z: 7 },
    requiredKeys: 2,
    monsterId: 'treasure_spirit',
    connections: ['north_chemistry_2'],
  },

  // Boss区域
  {
    id: 'north_boss',
    oceanId: 'northIce',
    knowledgeArea: 'comprehensive',
    name: '北冰大洋守护者',
    difficulty: 3,
    type: 'boss',
    position: { x: 4, z: 8 },
    requiredKeys: 0,
    monsterId: 'arctic_whale_king',
    connections: ['north_chinese_3', 'north_math_3', 'north_english_3', 'north_science_3', 'north_physics_3', 'north_chemistry_3'],
  },
]

// 导出所有大洋区域数据
export const areasData: Record<string, Area[]> = {
  east: eastAreas,
  west: westAreas,
  southHot: southAreas,
  northIce: northAreas,
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

// 检查区域是否可达（基于累积的可达区域列表）
export function isAreaReachable(
  areaId: string,
  currentAreaId: string | null,
  defeatedMiniBosses: string[],
  reachableAreas: string[]
): { reachable: boolean; reason?: string } {
  const area = getAreaById(areaId)
  if (!area) return { reachable: false, reason: '区域不存在' }

  // 已击败的岛屿可以直接访问
  if (defeatedMiniBosses.includes(areaId)) {
    return { reachable: true }
  }

  // 如果是当前所在岛屿，可以访问
  if (currentAreaId === areaId) {
    return { reachable: true }
  }

  // Boss岛屿需要9个岛屿完成后才能访问（只计算normal类型岛屿）
  if (area.type === 'boss') {
    // 过滤出normal类型的已击败岛屿
    const defeatedNormalIslands = defeatedMiniBosses.filter(id => {
      const a = getAreaById(id)
      return a && a.type === 'normal'
    })
    if (defeatedNormalIslands.length < 9) {
      return { reachable: false, reason: `需要打败9个岛屿才能挑战Boss (${defeatedNormalIslands.length}/9)` }
    }
    return { reachable: true }
  }

  // 在可达区域列表中的岛屿可以直接访问（累积增长）
  if (reachableAreas.includes(areaId)) {
    return { reachable: true }
  }

  return { reachable: false, reason: '请先完成前置岛屿' }
}