// src/multiplayer/ReconnectDialog.tsx
// Reconnection dialog component based on design doc Section 7

import { useReconnect } from './useReconnect'

export function ReconnectDialog() {
  const { reconnectAttempt, showReconnectDialog, cancelReconnect } =
    useReconnect()

  if (!showReconnectDialog) return null

  const reconnectDelays = [1, 2, 4, 8, 16, 32]
  const currentDelay = reconnectDelays[Math.min(reconnectAttempt, reconnectDelays.length - 1)]

  return (
    <div className="reconnect-dialog-overlay">
      <div className="reconnect-dialog">
        <div className="reconnect-icon">🔄</div>
        <h2>正在重新连接...</h2>
        <p>
          正在尝试重新连接
          {reconnectAttempt > 0 && ` (第 ${reconnectAttempt} 次尝试)`}
        </p>
        <p className="reconnect-hint">
          预计等待时间: {currentDelay} 秒
        </p>
        {reconnectAttempt >= 3 && (
          <p className="reconnect-warning">
            连接困难，请检查网络
          </p>
        )}
        <button
          className="reconnect-cancel-btn"
          onClick={cancelReconnect}
        >
          取消并返回大厅
        </button>
      </div>

      <style>{`
        .reconnect-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .reconnect-dialog {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 2px solid #4a90d9;
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          color: white;
          max-width: 400px;
        }

        .reconnect-icon {
          font-size: 64px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .reconnect-dialog h2 {
          margin: 16px 0;
          font-size: 24px;
          color: #4a90d9;
        }

        .reconnect-dialog p {
          margin: 8px 0;
          color: #ccc;
        }

        .reconnect-hint {
          font-size: 14px;
          color: #888;
        }

        .reconnect-warning {
          color: #f39c12 !important;
          font-size: 14px;
          margin-top: 8px;
        }

        .reconnect-cancel-btn {
          margin-top: 20px;
          padding: 12px 24px;
          background: #e74c3c;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .reconnect-cancel-btn:hover {
          background: #c0392b;
        }
      `}</style>
    </div>
  )
}
