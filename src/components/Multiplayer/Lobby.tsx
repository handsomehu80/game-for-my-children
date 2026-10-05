// src/components/Multiplayer/Lobby.tsx
// Multiplayer lobby - entry point for multiplayer mode

import { useState } from 'react'
import { useMultiplayer } from '../../multiplayer/useMultiplayer'
import { RoomList } from './RoomList'
import { Matchmaking } from './Matchmaking'

interface MultiplayerLobbyProps {
  playerName: string
  grade: number
}

export function MultiplayerLobby({ playerName, grade }: MultiplayerLobbyProps) {
  const {
    connectionStatus,
    error,
    uiPhase,
    createRoom,
    joinRoom,
    findMatch,
  } = useMultiplayer()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [roomIdInput, setRoomIdInput] = useState('')

  const isConnected = connectionStatus === 'connected'

  const handleCreateRoom = () => {
    createRoom({
      playerName,
      grade,
      settings: {
        maxPlayers: 4,
        questionCount: 10,
        timePerQuestion: 30,
        grade,
      },
    })
  }

  const handleJoinRoom = () => {
    if (!roomIdInput.trim()) return
    joinRoom({
      roomId: roomIdInput.trim().toUpperCase(),
      playerName,
      grade,
    })
  }

  const handleQuickMatch = () => {
    findMatch({ grade })
  }

  // Show matchmaking UI if in matchmaking phase
  if (uiPhase === 'matchmaking') {
    return <Matchmaking />
  }

  return (
    <div className="multiplayer-lobby">
      <div className="lobby-header">
        <h1>🎮 多人联机</h1>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 已连接' : '🔴 未连接'}
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="lobby-content">
        {/* Quick Match Section */}
        <div className="lobby-section">
          <h2>⚡ 快速匹配</h2>
          <p className="section-desc">自动匹配其他玩家，开始战斗</p>
          <button
            className="btn btn-primary btn-large"
            onClick={handleQuickMatch}
            disabled={!isConnected}
          >
            开始匹配
          </button>
        </div>

        {/* Room Actions */}
        <div className="lobby-section">
          <h2>🏠 房间</h2>
          <div className="room-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowCreateModal(true)}
              disabled={!isConnected}
            >
              创建房间
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowJoinModal(true)}
              disabled={!isConnected}
            >
              加入房间
            </button>
          </div>
        </div>

        {/* Room List */}
        <div className="lobby-section">
          <h2>📋 房间列表</h2>
          <RoomList />
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>创建房间</h2>
            <div className="modal-content">
              <div className="form-group">
                <label>玩家名称</label>
                <input type="text" value={playerName} disabled />
              </div>
              <div className="form-group">
                <label>年级</label>
                <input type="text" value={`${grade} 年级`} disabled />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                取消
              </button>
              <button className="btn btn-primary" onClick={handleCreateRoom}>
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>加入房间</h2>
            <div className="modal-content">
              <div className="form-group">
                <label>房间ID</label>
                <input
                  type="text"
                  placeholder="输入房间ID"
                  value={roomIdInput}
                  onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
                  maxLength={6}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowJoinModal(false)}>
                取消
              </button>
              <button
                className="btn btn-primary"
                onClick={handleJoinRoom}
                disabled={!roomIdInput.trim()}
              >
                加入
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .multiplayer-lobby {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 20px;
          color: white;
        }

        .lobby-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .lobby-header h1 {
          font-size: 28px;
          margin: 0;
        }

        .connection-status {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }

        .connection-status.connected {
          background: rgba(39, 174, 96, 0.2);
          color: #27ae60;
        }

        .connection-status.disconnected {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
        }

        .error-message {
          background: rgba(231, 76, 60, 0.2);
          border: 1px solid #e74c3c;
          color: #e74c3c;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .lobby-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .lobby-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .lobby-section h2 {
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        .section-desc {
          color: #888;
          margin: 0 0 16px 0;
          font-size: 14px;
        }

        .room-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 12px 24px;
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
          flex: 1;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .btn-large {
          width: 100%;
          padding: 16px;
          font-size: 18px;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .modal {
          background: #1a1a2e;
          border: 2px solid #4a90d9;
          border-radius: 16px;
          padding: 24px;
          width: 90%;
          max-width: 400px;
        }

        .modal h2 {
          margin: 0 0 20px 0;
          text-align: center;
        }

        .modal-content {
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          color: #888;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          font-size: 16px;
        }

        .form-group input:focus {
          outline: none;
          border-color: #4a90d9;
        }

        .form-group input:disabled {
          opacity: 0.6;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .modal-actions .btn {
          flex: 1;
        }
      `}</style>
    </div>
  )
}
