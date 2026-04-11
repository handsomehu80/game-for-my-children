import type { BattlePlayer } from '../../../game/types'

interface PlayerStatusProps {
  players: BattlePlayer[]
  currentIndex: number
}

export function PlayerStatus({ players, currentIndex }: PlayerStatusProps) {
  return (
    <div className="player-status-bar">
      {players.map((player, idx) => (
        <div
          key={player.id}
          className={`player-status-item ${idx === currentIndex ? 'active' : ''}`}
        >
          <div className="player-avatar">
            {player.avatar ? (
              <img src={player.avatar} alt={player.name} />
            ) : (
              <div className="avatar-placeholder">{player.name[0]}</div>
            )}
          </div>
          <div className="player-info">
            <span className="player-name">{player.name}</span>
            <span className="player-grade">G{player.grade}</span>
          </div>
          {idx === currentIndex && (
            <div className="current-turn-badge">答题中</div>
          )}
        </div>
      ))}
    </div>
  )
}