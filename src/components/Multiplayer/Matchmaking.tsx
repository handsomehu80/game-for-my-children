// src/components/Multiplayer/Matchmaking.tsx
// Matchmaking UI component

import { useEffect, useState } from 'react'
import { useMultiplayer } from '../../multiplayer/useMultiplayer'

export function Matchmaking() {
  const { cancelMatch, error } = useMultiplayer()
  const [searchTime, setSearchTime] = useState(0)

  // Timer for search duration
  useEffect(() => {
    const interval = setInterval(() => {
      setSearchTime((t) => t + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleCancel = () => {
    cancelMatch()
  }

  return (
    <div className="matchmaking-screen">
      <div className="matchmaking-content">
        <div className="search-animation">
          <div className="search-ring"></div>
          <div className="search-ring"></div>
          <div className="search-ring"></div>
        </div>

        <h2>正在匹配对手...</h2>
        <p className="search-time">搜索时间: {formatTime(searchTime)}</p>

        {error && (
          <div className="matchmaking-error">
            ⚠️ {error}
          </div>
        )}

        <div className="matchmaking-tips">
          <p>💡 提示</p>
          <ul>
            <li>正在搜索年级相近的对手</li>
            <li>匹配成功后会自动进入房间</li>
          </ul>
        </div>

        <button className="btn-cancel" onClick={handleCancel}>
          取消匹配
        </button>
      </div>

      <style>{`
        .matchmaking-screen {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .matchmaking-content {
          text-align: center;
          max-width: 400px;
          padding: 40px;
        }

        .search-animation {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 40px;
        }

        .search-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          border: 3px solid transparent;
          border-top-color: #4a90d9;
          border-radius: 50%;
          animation: spin 1.5s linear infinite;
        }

        .search-ring:nth-child(2) {
          width: 80%;
          height: 80%;
          animation-delay: 0.2s;
          border-top-color: #27ae60;
        }

        .search-ring:nth-child(3) {
          width: 60%;
          height: 60%;
          animation-delay: 0.4s;
          border-top-color: #f39c12;
        }

        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        h2 {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .search-time {
          color: #888;
          font-size: 16px;
          margin-bottom: 32px;
        }

        .matchmaking-error {
          background: rgba(231, 76, 60, 0.2);
          border: 1px solid #e74c3c;
          color: #e74c3c;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .matchmaking-tips {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 32px;
          text-align: left;
        }

        .matchmaking-tips p {
          margin: 0 0 8px 0;
          font-weight: bold;
        }

        .matchmaking-tips ul {
          margin: 0;
          padding-left: 20px;
          color: #888;
        }

        .matchmaking-tips li {
          margin: 4px 0;
        }

        .btn-cancel {
          padding: 14px 32px;
          background: rgba(231, 76, 60, 0.8);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-cancel:hover {
          background: #e74c3c;
        }
      `}</style>
    </div>
  )
}
