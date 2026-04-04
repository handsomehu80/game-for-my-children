import React from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  icon?: 'island' | 'warning' | 'treasure'
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  isDanger?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  icon = 'island',
  confirmText = '确定',
  cancelText = '取消',
  onConfirm,
  onCancel,
  isDanger = false,
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (icon) {
      case 'warning': return '⚠️'
      case 'treasure': return '📦'
      default: return '🏝️'
    }
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
      aria-labelledby="confirm-title"
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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{getIcon()}</div>

        <h3
          id="confirm-title"
          style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '24px',
            fontWeight: 600,
            color: '#1E293B',
            marginBottom: '8px',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontFamily: "'Comic Neue', cursive",
            fontSize: '16px',
            color: '#64748b',
            marginBottom: '24px',
          }}
        >
          {message}
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
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
            aria-label={cancelText}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            style={{
              background: isDanger
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, #22c55e, #16a34a)',
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
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>

        <p
          style={{
            fontSize: '12px',
            color: '#94a3b8',
            fontFamily: "'Comic Neue', cursive",
            marginTop: '16px',
          }}
        >
          💡 提示：点击按钮即可选择
        </p>
      </div>
    </div>
  )
}