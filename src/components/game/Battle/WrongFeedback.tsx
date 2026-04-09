// src/components/game/Battle/WrongFeedback.tsx
// WrongFeedback 组件 - 屏幕红色闪烁效果已在 Battle.tsx 的 red-flash class 处理
// 本组件用于显示错误提示文本

export default function WrongFeedback() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#ff4444',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        animation: 'wrongShake 300ms ease-out',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      Wrong!
    </div>
  )
}