import React from 'react'

interface DangerConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export const DangerConfirmDialog: React.FC<DangerConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = '确定退出',
  cancelText = '取消',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>

        <h3
          style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: '24px',
            fontWeight: 600,
            color: '#dc2626',
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
            marginBottom: '16px',
          }}
        >
          {message}
        </p>

        {/* 双重确认提示 */}
        <div
          style={{
            background: '#fef2f2',
            border: '3px dashed #ef4444',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
          }}
        >
          <p
            style={{
              fontFamily: "'Baloo 2', cursive",
              color: '#dc2626',
              fontWeight: 600,
              margin: 0,
            }}
          >
            {title}？确定吗？
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              background: 'linear-gradient(135deg, #94a3b8, #64748b)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '14px 28px',
              fontSize: '16px',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 600,
              boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              minHeight: '56px',
            }}
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '14px 28px',
              fontSize: '16px',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 600,
              boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              minHeight: '56px',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}