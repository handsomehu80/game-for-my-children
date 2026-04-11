import React from 'react'
import type { SaveSlotInfo } from '../../game/types'

interface SaveSlotModalProps {
  slots: SaveSlotInfo[]
  onSelect: (slotIndex: number) => void
  onCancel: () => void
}

export const SaveSlotModal: React.FC<SaveSlotModalProps> = ({
  slots,
  onSelect,
  onCancel,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="saveslot-title"
    >
      <div
        style={{
          background: '#F8FAFC',
          borderRadius: '24px',
          padding: '32px',
          boxShadow: '12px 12px 24px rgba(0,0,0,0.3), -6px -6px 16px rgba(255,255,255,0.8)',
          maxWidth: '400px',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="saveslot-title"
          style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '24px',
            fontWeight: 600,
            color: '#1E293B',
            marginBottom: '24px',
          }}
        >
          覆盖哪个存档？
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {slots.map((slot) => (
            <button
              key={slot.slotIndex}
              onClick={() => onSelect(slot.slotIndex)}
              style={{
                background: slot.occupied
                  ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                  : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                border: 'none',
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '4px 4px 8px rgba(0,0,0,0.15)',
                transition: 'transform 0.1s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <div style={{
                fontFamily: "'Baloo 2', cursive",
                fontSize: '18px',
                fontWeight: 600,
                color: '#1E293B',
                marginBottom: '4px',
              }}>
                存档 {slot.slotIndex + 1}
              </div>

              {slot.occupied ? (
                <>
                  <div style={{
                    fontFamily: "'Comic Neue', cursive",
                    fontSize: '14px',
                    color: '#64748b',
                  }}>
                    {formatDate(slot.savedAt!)} - {slot.currentOcean}
                  </div>
                  <div style={{
                    fontFamily: "'Comic Neue', cursive",
                    fontSize: '14px',
                    color: '#16a34a',
                    fontWeight: 600,
                  }}>
                    已击败 {slot.defeatedCount} 个岛屿
                  </div>
                </>
              ) : (
                <div style={{
                  fontFamily: "'Comic Neue', cursive",
                  fontSize: '14px',
                  color: '#94a3b8',
                  fontStyle: 'italic',
                }}>
                  空
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          style={{
            background: 'linear-gradient(135deg, #94a3b8, #64748b)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '16px 32px',
            fontSize: '18px',
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 600,
            boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            minWidth: '120px',
            minHeight: '56px',
          }}
          aria-label="取消"
        >
          取消
        </button>

        <p
          style={{
            fontSize: '12px',
            color: '#94a3b8',
            fontFamily: "'Comic Neue', cursive",
            marginTop: '16px',
          }}
        >
          💡 提示：点击按钮即可选择存档位置
        </p>
      </div>
    </div>
  )
}