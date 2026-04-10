import React from 'react'
import type { BattlePlayer } from '../../game/types'

interface CurrentTurnIndicatorProps {
  player: BattlePlayer
  playerIndex: number
}

export function CurrentTurnIndicator({ player, playerIndex }: CurrentTurnIndicatorProps) {
  return (
    <div className={`current-turn-indicator player-${playerIndex}`}>
      <div className="turn-content">
        <span className="turn-label">轮到</span>
        <span className="player-name">{player.name}</span>
        <span className="turn-label">答题</span>
      </div>
      <div className="grade-badge">G{player.grade}</div>
    </div>
  )
}