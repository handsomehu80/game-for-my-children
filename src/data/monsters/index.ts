import { Monster } from '../../game/types'

export const monstersData: Record<string, Monster> = {
  // 普通怪物 - 东大洋数学区域
  math_slime_1: {
    id: 'math_slime_1',
    name: '数学蟹将',
    hp: 30,
    maxHp: 30,
    sprite: '🦀',
  },
  math_slime_2: {
    id: 'math_slime_2',
    name: '数学蟹将',
    hp: 40,
    maxHp: 40,
    sprite: '🦀',
  },
  math_slime_3: {
    id: 'math_slime_3',
    name: '数学蟹王',
    hp: 50,
    maxHp: 50,
    sprite: '🦞',
  },
  // 普通怪物 - 语文区域
  chinese_slime_1: {
    id: 'chinese_slime_1',
    name: '语文章鱼',
    hp: 30,
    maxHp: 30,
    sprite: '🐙',
  },
  chinese_slime_2: {
    id: 'chinese_slime_2',
    name: '语文章鱼',
    hp: 40,
    maxHp: 40,
    sprite: '🐙',
  },
  chinese_slime_3: {
    id: 'chinese_slime_3',
    name: '语文章鱼长',
    hp: 50,
    maxHp: 50,
    sprite: '🦑',
  },
  // 普通怪物 - 英语区域
  english_slime_1: {
    id: 'english_slime_1',
    name: '英语鲨鱼',
    hp: 30,
    maxHp: 30,
    sprite: '🦈',
  },
  english_slime_2: {
    id: 'english_slime_2',
    name: '英语鲨鱼',
    hp: 40,
    maxHp: 40,
    sprite: '🦈',
  },
  english_slime_3: {
    id: 'english_slime_3',
    name: '英语鲨鱼王',
    hp: 50,
    maxHp: 50,
    sprite: '🐬',
  },
  // 宝箱守护者
  treasure_guardian: {
    id: 'treasure_guardian',
    name: '宝箱守护者',
    hp: 60,
    maxHp: 60,
    sprite: '📦',
  },
  // Boss 怪物
  crab_captain: {
    id: 'crab_captain',
    name: '蟹蟹船长',
    hp: 60,
    maxHp: 60,
    sprite: '🦀',
  },
  jellyfish_king: {
    id: 'jellyfish_king',
    name: '水母国王',
    hp: 80,
    maxHp: 80,
    sprite: '🪼',
  },
  octopus_shaman: {
    id: 'octopus_shaman',
    name: '章鱼萨满',
    hp: 100,
    maxHp: 100,
    sprite: '🐙',
  },
  shark_warlord: {
    id: 'shark_warlord',
    name: '鲨鱼军阀',
    hp: 120,
    maxHp: 120,
    sprite: '🦈',
  },
  sea_serpent: {
    id: 'sea_serpent',
    name: '海蛇',
    hp: 140,
    maxHp: 140,
    sprite: '🐍',
  },
  pirate_ghost: {
    id: 'pirate_ghost',
    name: '海盗幽灵',
    hp: 160,
    maxHp: 160,
    sprite: '👻',
  },
  ice_dragon: {
    id: 'ice_dragon',
    name: '冰龙',
    hp: 180,
    maxHp: 180,
    sprite: '🐉',
  },
  kraken: {
    id: 'kraken',
    name: '克拉肯',
    hp: 200,
    maxHp: 200,
    sprite: '🦑',
  },
  shadow_leviathan: {
    id: 'shadow_leviathan',
    name: '暗影利维坦',
    hp: 250,
    maxHp: 250,
    sprite: '👹',
  },
  // 普通怪物 - 南大洋数学区域
  scorpion_1: {
    id: 'scorpion_1',
    name: '沙漠蝎子',
    hp: 35,
    maxHp: 35,
    sprite: '🦂',
  },
  scorpion_2: {
    id: 'scorpion_2',
    name: '沙漠巨蝎',
    hp: 45,
    maxHp: 45,
    sprite: '🦂',
  },
  scorpion_3: {
    id: 'scorpion_3',
    name: '沙漠蝎王',
    hp: 55,
    maxHp: 55,
    sprite: '🦂',
  },
  // 普通怪物 - 南大洋语文区域
  lizard_1: {
    id: 'lizard_1',
    name: '沙漠蜥蜴',
    hp: 35,
    maxHp: 35,
    sprite: '🦎',
  },
  lizard_2: {
    id: 'lizard_2',
    name: '沙漠巨蜥',
    hp: 45,
    maxHp: 45,
    sprite: '🦎',
  },
  lizard_3: {
    id: 'lizard_3',
    name: '沙漠蜥王',
    hp: 55,
    maxHp: 55,
    sprite: '🦎',
  },
  // 普通怪物 - 南大洋英语区域
  snake_1: {
    id: 'snake_1',
    name: '响尾蛇',
    hp: 35,
    maxHp: 35,
    sprite: '🐍',
  },
  snake_2: {
    id: 'snake_2',
    name: '沙漠蟒蛇',
    hp: 45,
    maxHp: 45,
    sprite: '🐍',
  },
  snake_3: {
    id: 'snake_3',
    name: '响尾蛇王',
    hp: 55,
    maxHp: 55,
    sprite: '🐍',
  },
  // 普通怪物 - 南大洋科学区域
  desert_eagle_1: {
    id: 'desert_eagle_1',
    name: '沙漠鹰',
    hp: 35,
    maxHp: 35,
    sprite: '🦅',
  },
  desert_eagle_2: {
    id: 'desert_eagle_2',
    name: '沙漠巨鹰',
    hp: 45,
    maxHp: 45,
    sprite: '🦅',
  },
  desert_eagle_3: {
    id: 'desert_eagle_3',
    name: '沙漠鹰王',
    hp: 55,
    maxHp: 55,
    sprite: '🦅',
  },
  // 隐藏区域守护者
  desert_guardian: {
    id: 'desert_guardian',
    name: '沙漠守护者',
    hp: 70,
    maxHp: 70,
    sprite: '🗿',
  },
  // 宝藏区域精灵
  treasure_spirit: {
    id: 'treasure_spirit',
    name: '宝藏精灵',
    hp: 50,
    maxHp: 50,
    sprite: '💎',
  },
  // Boss - 南大洋
  sea_serpent_king: {
    id: 'sea_serpent_king',
    name: '海蛇王',
    hp: 130,
    maxHp: 130,
    sprite: '🐉',
  },
  // 普通怪物 - 火焰鱼（数学区域）
  flame_fish_1: {
    id: 'flame_fish_1',
    name: '火焰鱼',
    hp: 40,
    maxHp: 40,
    sprite: '🐟',
  },
  flame_fish_2: {
    id: 'flame_fish_2',
    name: '火焰鳗',
    hp: 50,
    maxHp: 50,
    sprite: '🐟',
  },
  flame_fish_3: {
    id: 'flame_fish_3',
    name: '火焰鱼王',
    hp: 60,
    maxHp: 60,
    sprite: '🐠',
  },
  // 普通怪物 - 熔岩龟（语文区域）
  lava_turtle_1: {
    id: 'lava_turtle_1',
    name: '熔岩龟',
    hp: 40,
    maxHp: 40,
    sprite: '🐢',
  },
  lava_turtle_2: {
    id: 'lava_turtle_2',
    name: '熔岩巨龟',
    hp: 50,
    maxHp: 50,
    sprite: '🐢',
  },
  lava_turtle_3: {
    id: 'lava_turtle_3',
    name: '熔岩神龟',
    hp: 60,
    maxHp: 60,
    sprite: '🐢',
  },
  // 普通怪物 - 岩浆龙虾（英语区域）
  magma_lobster_1: {
    id: 'magma_lobster_1',
    name: '岩浆龙虾',
    hp: 40,
    maxHp: 40,
    sprite: '🦞',
  },
  magma_lobster_2: {
    id: 'magma_lobster_2',
    name: '岩浆巨钳',
    hp: 50,
    maxHp: 50,
    sprite: '🦞',
  },
  magma_lobster_3: {
    id: 'magma_lobster_3',
    name: '岩浆虾王',
    hp: 60,
    maxHp: 60,
    sprite: '🦞',
  },
  // 普通怪物 - 焰鼻鳗（科学区域）
  flame_eel_1: {
    id: 'flame_eel_1',
    name: '焰鼻鳗',
    hp: 40,
    maxHp: 40,
    sprite: '🐍',
  },
  flame_eel_2: {
    id: 'flame_eel_2',
    name: '焰鼻巨鳗',
    hp: 50,
    maxHp: 50,
    sprite: '🐍',
  },
  flame_eel_3: {
    id: 'flame_eel_3',
    name: '焰鼻鳗皇',
    hp: 60,
    maxHp: 60,
    sprite: '🐍',
  },
  // 普通怪物 - 古灵（历史区域）
  ancient_spirit_1: {
    id: 'ancient_spirit_1',
    name: '古灵',
    hp: 40,
    maxHp: 40,
    sprite: '👻',
  },
  ancient_spirit_2: {
    id: 'ancient_spirit_2',
    name: '古灵长',
    hp: 50,
    maxHp: 50,
    sprite: '👻',
  },
  ancient_spirit_3: {
    id: 'ancient_spirit_3',
    name: '古灵王',
    hp: 60,
    maxHp: 60,
    sprite: '👻',
  },
  // 隐藏区域守护者
  lava_guardian: {
    id: 'lava_guardian',
    name: '熔岩守护者',
    hp: 80,
    maxHp: 80,
    sprite: '🗿',
  },
  // Boss - 熔岩巨龙
  lava_dragon_king: {
    id: 'lava_dragon_king',
    name: '熔岩巨龙',
    hp: 150,
    maxHp: 150,
    sprite: '🐉',
  },
  // 北冰洋区域怪物 - 语文
  polar_bear_1: {
    id: 'polar_bear_1',
    name: '北极熊',
    hp: 45,
    maxHp: 45,
    sprite: '🐻‍❄️',
  },
  polar_bear_2: {
    id: 'polar_bear_2',
    name: '北极熊王',
    hp: 55,
    maxHp: 55,
    sprite: '🐻‍❄️',
  },
  polar_bear_3: {
    id: 'polar_bear_3',
    name: '北极熊皇',
    hp: 65,
    maxHp: 65,
    sprite: '🐻‍❄️',
  },
  // 北冰洋区域怪物 - 数学
  penguin_1: {
    id: 'penguin_1',
    name: '企鹅',
    hp: 45,
    maxHp: 45,
    sprite: '🐧',
  },
  penguin_2: {
    id: 'penguin_2',
    name: '帝企鹅',
    hp: 55,
    maxHp: 55,
    sprite: '🐧',
  },
  penguin_3: {
    id: 'penguin_3',
    name: '企鹅王',
    hp: 65,
    maxHp: 65,
    sprite: '🐧',
  },
  // 北冰洋区域怪物 - 英语
  seal_1: {
    id: 'seal_1',
    name: '海豹',
    hp: 45,
    maxHp: 45,
    sprite: '🦭',
  },
  seal_2: {
    id: 'seal_2',
    name: '海豹王',
    hp: 55,
    maxHp: 55,
    sprite: '🦭',
  },
  seal_3: {
    id: 'seal_3',
    name: '海豹皇',
    hp: 65,
    maxHp: 65,
    sprite: '🦭',
  },
  // 北冰洋区域怪物 - 科学
  whale_1: {
    id: 'whale_1',
    name: '鲸鱼',
    hp: 45,
    maxHp: 45,
    sprite: '🐋',
  },
  whale_2: {
    id: 'whale_2',
    name: '蓝鲸',
    hp: 55,
    maxHp: 55,
    sprite: '🐋',
  },
  whale_3: {
    id: 'whale_3',
    name: '鲸鱼王',
    hp: 65,
    maxHp: 65,
    sprite: '🐋',
  },
  // 北冰洋区域怪物 - 物理
  ice_crystal_1: {
    id: 'ice_crystal_1',
    name: '冰晶',
    hp: 45,
    maxHp: 45,
    sprite: '💠',
  },
  ice_crystal_2: {
    id: 'ice_crystal_2',
    name: '大冰晶',
    hp: 55,
    maxHp: 55,
    sprite: '💠',
  },
  ice_crystal_3: {
    id: 'ice_crystal_3',
    name: '冰晶王',
    hp: 65,
    maxHp: 65,
    sprite: '💠',
  },
  // 北冰洋区域怪物 - 化学
  snowflake_1: {
    id: 'snowflake_1',
    name: '雪花',
    hp: 45,
    maxHp: 45,
    sprite: '❄️',
  },
  snowflake_2: {
    id: 'snowflake_2',
    name: '大雪花',
    hp: 55,
    maxHp: 55,
    sprite: '❄️',
  },
  snowflake_3: {
    id: 'snowflake_3',
    name: '雪花王',
    hp: 65,
    maxHp: 65,
    sprite: '❄️',
  },
  // 北冰洋隐藏区域守护者
  ice_guardian: {
    id: 'ice_guardian',
    name: '冰之守护者',
    hp: 90,
    maxHp: 90,
    sprite: '🗿',
  },
  // 北冰洋Boss
  arctic_whale_king: {
    id: 'arctic_whale_king',
    name: '北极巨鲸',
    hp: 180,
    maxHp: 180,
    sprite: '🐋',
  },
}

export function getMonstersByOcean(_ocean: string): Monster[] {
  // Ocean filtering is now handled by the ocean zone configuration
  return Object.values(monstersData)
}
