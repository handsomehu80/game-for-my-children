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
}

export function getMonstersByOcean(_ocean: string): Monster[] {
  // Ocean filtering is now handled by the ocean zone configuration
  return Object.values(monstersData)
}
