import type { BattlePlayer, BattleState } from '../game/types'

/**
 * 判断是否为多人模式
 */
export function isMultiplayer(players: BattlePlayer[]): boolean {
  return players.length >= 2
}

/**
 * 获取当前玩家
 */
export function getCurrentPlayer(players: BattlePlayer[], index: number): BattlePlayer {
  return players[index] ?? players[0]
}

/**
 * 切换到下一个玩家
 * 单人模式：返回 0
 * 双人模式：在 0 和 1 之间切换
 */
export function getNextPlayerIndex(players: BattlePlayer[], currentIndex: number): number {
  if (players.length < 2) {
    return 0
  }
  return 1 - currentIndex
}

/**
 * 获取当前玩家名称
 */
export function getCurrentPlayerName(battle: BattleState): string {
  if (isMultiplayer(battle.players)) {
    return battle.players[battle.currentPlayerIndex]?.name ?? '玩家'
  }
  return battle.player?.name ?? '玩家'
}