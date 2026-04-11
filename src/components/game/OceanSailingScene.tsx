// src/components/game/OceanSailingScene.tsx
import { useEffect, useMemo } from 'react'
import { SeededRandom } from '../../game/utils/seededRandom'

interface Star {
  x: number
  y: number
  size: number
  twinkleDelay: number
}

interface OceanSailingSceneProps {
  isActive: boolean
  style: 'minimal' | 'cinematic'
  seed?: number
  onArrived: () => void
  isReducedMotion?: boolean
}

/**
 * Determine animation style based on island type.
 * Boss islands use cinematic style, normal islands use minimal style.
 */
export function getAnimationStyle(areaId: string): 'minimal' | 'cinematic' {
  if (areaId.includes('boss')) return 'cinematic'
  return 'minimal'
}

/**
 * Generate fixed 10 stars using SeededRandom for reproducible positions.
 * Stars are positioned in the upper half (y: 0-50%) with random sizes and twinkle delays.
 */
export function generateStars(seed: number): Star[] {
  const rng = new SeededRandom(seed)
  const stars: Star[] = []

  for (let i = 0; i < 10; i++) {
    stars.push({
      x: rng.nextInt(0, 99), // 0-99%
      y: rng.nextInt(0, 50), // 0-50%
      size: rng.nextInt(2, 3), // 2-3px
      twinkleDelay: rng.nextInt(0, 2000), // 0-2000ms
    })
  }

  return stars
}

/**
 * Render minimal style sailing animation.
 * Used for normal islands - 0.8s duration with simple gradient background.
 */
function renderMinimalStyle(isReducedMotion: boolean): JSX.Element {
  const animationDuration = '4s'

  return (
    <>
      {/* CSS 动画样式 - Minimal */}
      <style>
        {`
          @keyframes minimalSail {
            0% { left: -10%; bottom: 35%; opacity: 0; }
            10% { opacity: 1; }
            100% { left: 65%; bottom: 32%; opacity: 1; }
          }
          .minimal-ship {
            position: absolute;
            left: -10%;
            bottom: 35%;
            animation: minimalSail ${animationDuration} ease-out forwards;
          }
          ${isReducedMotion ? `
            .minimal-ship { animation: none; opacity: 1; left: 65%; bottom: 32%; }
          ` : ''}
        `}
      </style>

      {/* 渐变背景 - 白天风格 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #87CEEB 0%, #4A90B8 100%)',
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

      {/* 航行中的帆船 */}
      <div
        className="minimal-ship"
        style={{
          fontSize: '64px',
          filter: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.3))',
          zIndex: 10,
        }}
      >
        ⛵
      </div>

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
    </>
  )
}

/**
 * Render cinematic style sailing animation.
 * Used for Boss islands - 4s duration with night sky, stars, moonlight, and cinematic black bars.
 */
function renderCinematicStyle(stars: Star[], isReducedMotion: boolean): JSX.Element {
  const animationDuration = '4s'

  return (
    <>
      {/* CSS 动画样式 - Cinematic */}
      <style>
        {`
          @keyframes cinematicSail {
            0% { left: 5%; bottom: 30%; opacity: 0; }
            10% { opacity: 1; }
            50% { left: 40%; bottom: 35%; }
            90% { opacity: 1; }
            100% { left: 75%; bottom: 35%; opacity: 0.8; }
          }
          @keyframes starTwinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          .cinematic-ship {
            position: absolute;
            left: 5%;
            bottom: 30%;
            animation: cinematicSail ${animationDuration} ease-in-out forwards;
          }
          .star {
            position: absolute;
            border-radius: 50%;
            background: white;
            animation: starTwinkle 2s ease-in-out infinite;
          }
          ${isReducedMotion ? `
            .cinematic-ship { animation: none; left: 75%; bottom: 35%; opacity: 0.8; }
            .star { animation: none; }
          ` : ''}
        `}
      </style>

      {/* 深蓝渐变背景 - 夜间风格 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      />

      {/* 星空 */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.twinkleDelay}ms`,
          }}
        />
      ))}

      {/* 月光 */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '60px',
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, #f5f5dc 0%, #fffacd 50%, transparent 70%)',
          borderRadius: '50%',
          boxShadow: '0 0 60px 20px rgba(255, 250, 205, 0.4)',
        }}
      />

      {/* 岛屿剪影 */}
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '10%',
          width: '120px',
          height: '100px',
          background: '#0a0a15',
          borderRadius: '50% 50% 40% 40%',
          filter: 'blur(1px)',
        }}
      />

      {/* 航行中的帆船 */}
      <div
        className="cinematic-ship"
        style={{
          fontSize: '64px',
          filter: 'drop-shadow(4px 4px 10px rgba(0,0,0,0.5))',
          zIndex: 10,
        }}
      >
        ⛵
      </div>

      {/* 电影黑边 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: '8px solid rgba(0,0,0,0.8)',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      />

      {/* 状态文字 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.7)',
          padding: '12px 24px',
          borderRadius: '20px',
          color: 'white',
          fontFamily: "'Baloo 2', cursive",
          fontSize: '20px',
          zIndex: 101,
        }}
      >
        ⛵ 航行中...
      </div>
    </>
  )
}

export default function OceanSailingScene({
  isActive,
  style,
  seed = Date.now(),
  onArrived,
  isReducedMotion = false,
}: OceanSailingSceneProps) {
  // Generate stars once when seed changes (memoized)
  const stars = useMemo(() => generateStars(seed), [seed])

  useEffect(() => {
    if (!isActive) return

    // Animation duration based on style (minimal = 4s = 0.8s * 5, cinematic = 4s)
    const duration = 4000
    console.log('[DEBUG OceanSailingScene] Timer set for', duration, 'ms, isActive:', isActive)
    const timer = setTimeout(() => {
      console.log('[DEBUG OceanSailingScene] Timer fired!')
      onArrived()
    }, duration)

    return () => {
      console.log('[DEBUG OceanSailingScene] Cleanup called')
      clearTimeout(timer)
    }
  }, [isActive, style, onArrived])

  if (!isActive) return null

  return (
    <div
      className={`ocean-sailing-scene ${style}-scene`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {style === 'minimal'
        ? renderMinimalStyle(isReducedMotion)
        : renderCinematicStyle(stars, isReducedMotion)
      }
    </div>
  )
}