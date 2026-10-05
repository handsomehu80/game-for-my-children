// src/components/Multiplayer/PlayerCard.tsx
// Player information card component

import type { RoomPlayer } from '../../multiplayer/types'

interface PlayerCardProps {
  player: RoomPlayer
  isCurrentPlayer?: boolean
  showReadyStatus?: boolean
}

export function PlayerCard({ player, isCurrentPlayer = false, showReadyStatus = true }: PlayerCardProps) {
  return (
    <div className={`player-card ${isCurrentPlayer ? 'current' : ''} ${!player.isConnected ? 'disconnected' : ''}`}>
      <div className="player-avatar">
        {player.avatar ? (
          <img src={player.avatar} alt={player.name} />
        ) : (
          <span className="avatar-placeholder">🧒</span>
        )}
        {!player.isConnected && <div className="disconnected-overlay">⚡</div>}
      </div>

      <div className="player-info">
        <div className="player-name">
          {player.name}
          {player.isHost && <span className="host-badge">👑</span>}
          {isCurrentPlayer && <span className="you-badge">你</span>}
        </div>
        <div className="player-grade">年级 {player.grade}</div>
      </div>

      {showReadyStatus && (
        <div className={`player-status ${player.isReady ? 'ready' : 'not-ready'}`}>
          {player.isReady ? '✓ 已准备' : player.isHost ? '房主' : '等待准备...'}
        </div>
      )}

      <style>{`
        .player-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.2s;
        }

        .player-card.current {
          border-color: #4a90d9;
          background: rgba(74, 144, 217, 0.2);
        }

        .player-card.disconnected {
          opacity: 0.6;
        }

        .player-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          background: #2a2a4a;
        }

        .player-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 24px;
        }

        .disconnected-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }

        .player-info {
          flex: 1;
        }

        .player-name {
          font-size: 16px;
          font-weight: bold;
          color: white;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .host-badge {
          font-size: 14px;
        }

        .you-badge {
          font-size: 12px;
          background: #4a90d9;
          padding: 2px 6px;
          border-radius: 4px;
          color: white;
        }

        .player-grade {
          font-size: 12px;
          color: #888;
          margin-top: 2px;
        }

        .player-status {
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: bold;
        }

        .player-status.ready {
          background: #27ae60;
          color: white;
        }

        .player-status.not-ready {
          background: #7f8c8d;
          color: white;
        }
      `}</style>
    </div>
  )
}
