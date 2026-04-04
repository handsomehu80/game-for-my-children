import React from 'react'
import { useAccessibility } from '../../hooks/useAccessibility'

export const AccessibilityToggle: React.FC = () => {
  const { highContrast, toggleHighContrast } = useAccessibility()

  return (
    <button
      onClick={toggleHighContrast}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        background: highContrast
          ? 'linear-gradient(135deg, #FFFF00, #FFD700)'
          : 'linear-gradient(135deg, #64748b, #475569)',
        color: highContrast ? '#000' : '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: '14px',
        fontFamily: "'Baloo 2', cursive",
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '4px 4px 8px rgba(0,0,0,0.2)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      aria-label={highContrast ? '关闭高对比度模式' : '开启高对比度模式'}
      aria-pressed={highContrast}
    >
      <span style={{ fontSize: '18px' }}>
        {highContrast ? '◐' : '◑'}
      </span>
      <span>无障碍</span>
    </button>
  )
}