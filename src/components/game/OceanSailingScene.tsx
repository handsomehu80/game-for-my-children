// src/components/game/OceanSailingScene.tsx
import { useEffect, useRef } from 'react'

interface OceanSailingSceneProps {
  isActive: boolean
  startPosition: { x: number; y: number }
  endPosition: { x: number; y: number }
  onArrived: () => void
  isReducedMotion?: boolean
}

export default function OceanSailingScene({
  isActive,
  startPosition,
  endPosition,
  onArrived,
  isReducedMotion = false,
}: OceanSailingSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) return

    // 动画持续时间：3秒
    const timer = setTimeout(() => {
      onArrived()
    }, 3000)

    return () => clearTimeout(timer)
  }, [isActive, onArrived])

  if (!isActive) return null

  return (
    <div
      ref={containerRef}
      className="ocean-sailing-scene"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(180deg, #87CEEB 0%, #1E3A5F 50%, #0C2340 100%)',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* CSS 动画样式 */}
      <style>
        {`
          @keyframes waveSlide {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes cloudFloat {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(20px); }
          }
          @keyframes sailBoat {
            0% { left: 15%; bottom: 35%; }
            50% { left: 50%; bottom: 40%; }
            100% { left: 70%; bottom: 35%; }
          }
          @keyframes shipRock {
            0%, 100% { transform: rotate(-2deg); }
            50% { transform: rotate(2deg); }
          }
          .sailing-ship {
            animation: sailBoat 3s ease-in-out forwards, shipRock 2s ease-in-out infinite;
          }
          .wave-layer {
            animation: waveSlide 3s linear infinite;
          }
          .cloud {
            animation: cloudFloat 6s ease-in-out infinite;
          }
          ${isReducedMotion ? `
            .sailing-ship { animation: none; left: 70%; bottom: 35%; }
            .wave-layer { animation: none; }
            .cloud { animation: none; }
          ` : ''}
        `}
      </style>

      {/* 太阳 */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          right: '80px',
          width: '50px',
          height: '50px',
          background: 'radial-gradient(circle, #FFD700, #FFA500)',
          borderRadius: '50%',
          boxShadow: '0 0 40px rgba(255,215,0,0.6)',
        }}
      />

      {/* 云朵 */}
      <div className="cloud" style={{ position: 'absolute', top: '40px', left: '10%', fontSize: '36px', opacity: 0.7 }}>
        ☁️
      </div>
      <div className="cloud" style={{ position: 'absolute', top: '60px', right: '15%', fontSize: '28px', opacity: 0.5, animationDelay: '1s' }}>
        ☁️
      </div>

      {/* 海洋波浪层 */}
      <div
        className="wave-layer"
        style={{
          position: 'absolute',
          bottom: '30%',
          left: 0,
          right: 0,
          height: '30px',
          background: 'repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(255,255,255,0.1) 30px, rgba(255,255,255,0.1) 60px)',
        }}
      />

      {/* 目标岛屿 */}
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '15%',
          width: '100px',
          height: '80px',
        }}
      >
        {/* 岛屿主体 */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100px',
            height: '50px',
            background: 'linear-gradient(135deg, #8B4513, #654321)',
            borderRadius: '50% 50% 40% 40%',
          }}
        />
        {/* 树木1 */}
        <div
          style={{
            position: 'absolute',
            bottom: '35px',
            left: '20px',
            width: '25px',
            height: '45px',
            background: 'linear-gradient(180deg, #228B22, #006400)',
            borderRadius: '50% 50% 20% 20%',
          }}
        />
        {/* 树木2 */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '55px',
            width: '20px',
            height: '35px',
            background: 'linear-gradient(180deg, #32CD32, #228B22)',
            borderRadius: '50% 50% 20% 20%',
          }}
        />
      </div>

      {/* 航行中的船只 */}
      <div
        className="sailing-ship"
        style={{
          position: 'absolute',
          fontSize: '64px',
          filter: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.3))',
          zIndex: 10,
        }}
      >
        ⛵
      </div>

      {/* 路径点轨迹 */}
      <div
        style={{
          position: 'absolute',
          bottom: '32%',
          left: '12%',
          width: '60%',
          height: '4px',
          borderBottom: '2px dashed rgba(255,255,255,0.2)',
        }}
      />

      {/* 状态文字 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.5)',
          padding: '12px 24px',
          borderRadius: '20px',
          color: 'white',
          fontFamily: "'Baloo 2', cursive",
          fontSize: '20px',
        }}
      >
        ⛵ 航行中...
      </div>
    </div>
  )
}