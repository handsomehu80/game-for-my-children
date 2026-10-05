// src/pages/MultiplayerPage.tsx
// Multiplayer mode entry page

import { useState } from 'react'
import { MultiplayerLobby } from '../components/Multiplayer/Lobby'
import { Matchmaking } from '../components/Multiplayer/Matchmaking'
import { BattleUI } from '../components/Multiplayer/BattleUI'
import { ReconnectDialog } from '../multiplayer/ReconnectDialog'
import { useMultiplayer } from '../multiplayer/useMultiplayer'
import { useMultiplayerStore } from '../multiplayer/multiplayerStore'

export function MultiplayerPage() {
  const { } = useMultiplayer()
  const { uiPhase } = useMultiplayerStore()

  // Get player info from localStorage (set during game start)
  const [playerName] = useState(() => {
    return localStorage.getItem('playerName') || '玩家'
  })

  const [grade] = useState(() => {
    return parseInt(localStorage.getItem('selectedGrade') || '1', 10)
  })

  // Render based on UI phase
  const renderContent = () => {
    switch (uiPhase) {
      case 'battle':
        return <BattleUI />
      case 'matchmaking':
        return <Matchmaking />
      case 'room':
        return <RoomView />
      case 'result':
        return <BattleUI />
      case 'lobby':
      default:
        return <MultiplayerLobby playerName={playerName} grade={grade} />
    }
  }

  return (
    <div className="multiplayer-page">
      {renderContent()}
      <ReconnectDialog />
    </div>
  )
}

// Room View - waiting room before battle starts
function RoomView() {
  const {
    currentRoom,
    playerId,
    isHost,
    error,
    toggleReady,
    startBattle,
    leaveRoom,
  } = useMultiplayerStore()

  if (!currentRoom) return null

  const myPlayer = currentRoom.players.find((p) => p.id === playerId)
  const allReady = currentRoom.players
    .filter((p) => !p.isHost)
    .every((p) => p.isReady)
  const canStart = isHost && allReady && currentRoom.players.length >= 2

  const handleStartBattle = () => {
    startBattle()
  }

  const handleLeaveRoom = () => {
    leaveRoom()
  }

  return (
    <div className="room-view">
      <div className="room-header">
        <div className="room-id">
          <h2>房间号</h2>
          <div className="room-code">{currentRoom.id}</div>
        </div>
        <div className="room-settings">
          <span>最大 {currentRoom.settings.maxPlayers} 人</span>
          <span>•</span>
          <span>{currentRoom.settings.questionCount} 题</span>
          <span>•</span>
          <span>每题 {currentRoom.settings.timePerQuestion}s</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="players-section">
        <h3>玩家列表</h3>
        <div className="players-list">
          {currentRoom.players.map((player) => (
            <div
              key={player.id}
              className={`player-item ${player.id === playerId ? 'you' : ''} ${!player.isConnected ? 'offline' : ''}`}
            >
              <div className="player-avatar">
                {player.avatar ? (
                  <img src={player.avatar} alt={player.name} />
                ) : (
                  <span>🧒</span>
                )}
              </div>
              <div className="player-info">
                <div className="player-name">
                  {player.name}
                  {player.isHost && ' 👑'}
                  {player.id === playerId && ' (你)'}
                </div>
                <div className="player-grade">年级 {player.grade}</div>
              </div>
              <div className={`player-status ${player.isReady ? 'ready' : player.isHost ? 'host' : 'waiting'}`}>
                {player.isReady ? '✓ 已准备' : player.isHost ? '房主' : '等待中'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="room-actions">
        {!isHost && (
          <button
            className={`btn ${myPlayer?.isReady ? 'btn-secondary' : 'btn-primary'}`}
            onClick={toggleReady}
          >
            {myPlayer?.isReady ? '取消准备' : '准备'}
          </button>
        )}

        {isHost && (
          <button
            className="btn btn-primary"
            onClick={handleStartBattle}
            disabled={!canStart}
          >
            开始战斗 {!canStart && '(等待其他玩家准备)'}
          </button>
        )}

        <button className="btn btn-danger" onClick={handleLeaveRoom}>
          离开房间
        </button>
      </div>

      <style>{`
        .room-view {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 20px;
          color: white;
        }

        .room-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .room-id {
          text-align: center;
        }

        .room-id h2 {
          margin: 0;
          font-size: 14px;
          color: #888;
        }

        .room-code {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 4px;
          color: #4a90d9;
          margin-top: 4px;
        }

        .room-settings {
          display: flex;
          gap: 8px;
          color: #888;
          font-size: 14px;
        }

        .error-message {
          background: rgba(231, 76, 60, 0.2);
          border: 1px solid #e74c3c;
          color: #e74c3c;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .players-section {
          margin-bottom: 24px;
        }

        .players-section h3 {
          margin: 0 0 12px 0;
          color: #888;
          font-size: 14px;
        }

        .players-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .player-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 2px solid transparent;
        }

        .player-item.you {
          border-color: #4a90d9;
          background: rgba(74, 144, 217, 0.1);
        }

        .player-item.offline {
          opacity: 0.5;
        }

        .player-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #2a2a4a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .player-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .player-info {
          flex: 1;
        }

        .player-name {
          font-weight: bold;
        }

        .player-grade {
          font-size: 12px;
          color: #888;
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

        .player-status.host {
          background: #f39c12;
          color: white;
        }

        .player-status.waiting {
          background: #7f8c8d;
          color: white;
        }

        .room-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #4a90d9;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #357abd;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .btn-danger {
          background: rgba(231, 76, 60, 0.8);
          color: white;
        }

        .btn-danger:hover {
          background: #e74c3c;
        }
      `}</style>
    </div>
  )
}
