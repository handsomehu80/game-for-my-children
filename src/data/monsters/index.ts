import { Monster } from '../../game/types'

export const monstersData: Record<string, Monster> = {
  crab_captain: {
    id: 'crab_captain',
    name: '蟹蟹船长',
    hp: 60,
    maxHp: 60,
    sprite: '/sprites/monsters/crab_captain.png',
  },
  jellyfish_king: {
    id: 'jellyfish_king',
    name: '水母国王',
    hp: 80,
    maxHp: 80,
    sprite: '/sprites/monsters/jellyfish_king.png',
  },
  octopus_shaman: {
    id: 'octopus_shaman',
    name: '章鱼萨满',
    hp: 100,
    maxHp: 100,
    sprite: '/sprites/monsters/octopus_shaman.png',
  },
  shark_warlord: {
    id: 'shark_warlord',
    name: '鲨鱼军阀',
    hp: 120,
    maxHp: 120,
    sprite: '/sprites/monsters/shark_warlord.png',
  },
  sea_serpent: {
    id: 'sea_serpent',
    name: '海蛇',
    hp: 140,
    maxHp: 140,
    sprite: '/sprites/monsters/sea_serpent.png',
  },
  pirate_ghost: {
    id: 'pirate_ghost',
    name: '海盗幽灵',
    hp: 160,
    maxHp: 160,
    sprite: '/sprites/monsters/pirate_ghost.png',
  },
  ice_dragon: {
    id: 'ice_dragon',
    name: '冰龙',
    hp: 180,
    maxHp: 180,
    sprite: '/sprites/monsters/ice_dragon.png',
  },
  kraken: {
    id: 'kraken',
    name: '克拉肯',
    hp: 200,
    maxHp: 200,
    sprite: '/sprites/monsters/kraken.png',
  },
  shadow_leviathan: {
    id: 'shadow_leviathan',
    name: '暗影利维坦',
    hp: 250,
    maxHp: 250,
    sprite: '/sprites/monsters/shadow_leviathan.png',
  },
}

export function getMonstersByOcean(_ocean: string): Monster[] {
  // Ocean filtering is now handled by the ocean zone configuration
  return Object.values(monstersData)
}
