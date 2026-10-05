// src/components/Multiplayer/RoomList.tsx
// Room list component for browsing available rooms

import { useState, useEffect } from 'react'
import { useMultiplayer } from '../../multiplayer/useMultiplayer'
import type { Room } from '../../multiplayer/types'

export function RoomList() {
  const { joinRoom, connectionStatus } = useMultiplayer()
  const [rooms, setRooms] = useState<Room[]>([])

  // Poll for room list (simplified - in production would use REST API)
  useEffect(() => {
    if (connectionStatus !== 'connected') return

    // For now, show empty list - rooms would be fetched via REST API
    // GET /api/rooms
    setRooms([])
  }, [connectionStatus])

  const handleJoinRoom = (roomId: string) => {
    // Get player info from localStorage or game store
    const playerName = localStorage.getItem('playerName') || '匿名玩家'
    const grade = parseInt(localStorage.getItem('selectedGrade') || '1', 10)

    joinRoom({
      roomId,
      playerName,
      grade,
    })
  }

  if (connectionStatus !== 'connected') {
    return (
      <div className="room-list-empty">
        <p>连接服务器后查看房间列表...</p>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className="room-list-empty">
        <p>暂无房间，试试创建新房间或快速匹配</p>
      </div>
    )
  }

  return (
    <div className="room-list">
      {rooms.map((room) => (
        <div key={room.id} className="room-item">
          <div className="room-info">
            <div className="room-id">房间号: {room.id}</div>
            <div className="room-players">
              {room.players.length} / {room.settings.maxPlayers} 人
            </div>
            <div className="room-status">
              {room.status === 'waiting' ? '🟢 等待中' : '🔴 游戏中'}
            </div>
          </div>
          <button
            className="btn-join"
            onClick={() => handleJoinRoom(room.id)}
            disabled={room.status !== 'waiting' || room.players.length >= room.settings.maxPlayers}
          >
            加入
          </button>
        </div>
      ))}

      <style>{`
        .room-list-empty {
          text-align: center;
          padding: 20px;
          color: #888;
        }

        .room-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .room-info {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .room-id {
          font-weight: bold;
          color: white;
        }

        .room-players {
          color: #888;
          font-size: 14px;
        }

        .room-status {
          font-size: 12px;
        }

        .btn-join {
          padding: 8px 16px;
          background: #4a90d9;
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-join:hover:not(:disabled) {
          background: #357abd;
        }

        .btn-join:disabled {
          background: #555;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
