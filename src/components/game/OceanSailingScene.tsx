// src/components/game/OceanSailingScene.tsx
import { useEffect, useMemo, useRef } from 'react'
import { SeededRandom } from '../../game/utils/seededRandom'

interface Star {
  x: number
  y: number
  size: number
  twinkleDelay: number
}

interface WeatherParticle {
  x: number
  delay: number
  duration: number
}

export type OceanTheme = 'east' | 'west' | 'southHot' | 'northIce' | 'mysterious'

interface OceanSailingSceneProps {
  isActive: boolean
  style: 'minimal' | 'cinematic'
  oceanTheme?: OceanTheme
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
 * Map an ocean id to its sailing animation theme.
 * Falls back to 'east' (dawn) for unrecognized ocean ids.
 */
export function getOceanTheme(oceanId: string): OceanTheme {
  const themes: OceanTheme[] = ['east', 'west', 'southHot', 'northIce', 'mysterious']
  return themes.includes(oceanId as OceanTheme) ? (oceanId as OceanTheme) : 'east'
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
 * Generate fixed 10 weather particles (snowflakes, sparks, etc.) using SeededRandom
 * for reproducible layout - reused across themes that need falling/drifting particles.
 */
function generateWeatherParticles(seed: number): WeatherParticle[] {
  const rng = new SeededRandom(seed + 1) // offset seed so it differs from star layout
  const particles: WeatherParticle[] = []

  for (let i = 0; i < 10; i++) {
    particles.push({
      x: rng.nextInt(0, 99),
      delay: rng.nextInt(0, 3000),
      duration: rng.nextInt(3000, 6000),
    })
  }

  return particles
}

const THEME_GRADIENTS: Record<OceanTheme, string> = {
  east: 'linear-gradient(180deg, #FFB88C 0%, #FF7E5F 45%, #4A90B8 100%)',
  west: 'linear-gradient(180deg, #2C3E50 0%, #E74C3C 40%, #F39C12 100%)',
  southHot: 'linear-gradient(180deg, #00C9A7 0%, #00A8CC 100%)',
  northIce: 'linear-gradient(180deg, #B3E5FC 0%, #81D4FA 50%, #E1F5FE 100%)',
  mysterious: 'linear-gradient(180deg, #2C2C54 0%, #474787 50%, #1B1B2F 100%)',
}

/**
 * Render the ocean-theme-specific backdrop layer: background gradient,
 * weather effects and decorative elements. Rendered above the base gradient
 * and below the ship/island so it doesn't interfere with existing DOM
 * assertions (ocean-sailing-scene container, ship emoji, linear-gradient text).
 */
function renderThemeBackdrop(
  theme: OceanTheme,
  particles: WeatherParticle[],
  isReducedMotion: boolean
): JSX.Element {
  switch (theme) {
    case 'east':
      return (
        <div className="theme-decor theme-east" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {!isReducedMotion && (
            <>
              <span style={{ position: 'absolute', top: '12%', left: '20%', fontSize: '20px', opacity: 0.8 }}>🕊️</span>
              <span style={{ position: 'absolute', top: '18%', left: '35%', fontSize: '16px', opacity: 0.6 }}>🕊️</span>
              <span style={{ position: 'absolute', top: '10%', left: '55%', fontSize: '18px', opacity: 0.7 }}>🕊️</span>
            </>
          )}
        </div>
      )
    case 'west':
      return (
        <div className="theme-decor theme-west" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: '10%',
              width: '80px',
              height: '24px',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '50%',
              filter: 'blur(4px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '15%',
              left: '55%',
              width: '100px',
              height: '30px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '50%',
              filter: 'blur(4px)',
            }}
          />
        </div>
      )
    case 'southHot':
      return (
        <div className="theme-decor theme-southhot" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <span style={{ position: 'absolute', bottom: '22%', left: '8%', fontSize: '40px' }}>🌴</span>
          {!isReducedMotion && (
            <span className="tropical-fish" style={{ position: 'absolute', bottom: '30%', left: '45%', fontSize: '20px' }}>
              🐟
            </span>
          )}
        </div>
      )
    case 'northIce':
      return (
        <div className="theme-decor theme-northice" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              left: '30%',
              width: '60px',
              height: '18px',
              background: '#E1F5FE',
              borderRadius: '40%',
              opacity: 0.9,
            }}
          />
          {particles.map((p, index) => (
            <span
              key={index}
              className="snowflake"
              style={{
                position: 'absolute',
                top: '-5%',
                left: `${p.x}%`,
                fontSize: '10px',
                color: 'white',
                animationDelay: `${p.delay}ms`,
                animationDuration: `${p.duration}ms`,
              }}
            >
              ❄
            </span>
          ))}
        </div>
      )
    case 'mysterious':
      return (
        <div className="theme-decor theme-mysterious" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div className="fog-layer" style={{ position: 'absolute', inset: 0 }} />
          {!isReducedMotion && (
            <>
              <span style={{ position: 'absolute', top: '25%', left: '25%', fontSize: '12px', color: '#a29bfe', opacity: 0.7 }}>✧</span>
              <span style={{ position: 'absolute', top: '40%', left: '60%', fontSize: '10px', color: '#a29bfe', opacity: 0.6 }}>✧</span>
            </>
          )}
        </div>
      )
  }
}

/**
 * Render minimal style sailing animation.
 * Used for normal islands - 0.8s duration with simple gradient background.
 */
function renderMinimalStyle(
  oceanTheme: OceanTheme,
  particles: WeatherParticle[],
  isReducedMotion: boolean
): JSX.Element {
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
          @keyframes snowFall {
            0% { transform: translateY(0); opacity: 0.9; }
            100% { transform: translateY(60vh); opacity: 0.4; }
          }
          @keyframes fogDrift {
            0% { transform: translateX(-5%); opacity: 0.5; }
            50% { opacity: 0.75; }
            100% { transform: translateX(5%); opacity: 0.5; }
          }
          .minimal-ship {
            position: absolute;
            left: -10%;
            bottom: 35%;
            animation: minimalSail ${animationDuration} ease-out forwards;
          }
          .snowflake { animation: snowFall linear infinite; }
          .fog-layer {
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%);
            animation: fogDrift 5s ease-in-out infinite;
          }
          ${isReducedMotion ? `
            .minimal-ship { animation: none; opacity: 1; left: 65%; bottom: 32%; }
            .snowflake { animation: none; opacity: 0.6; }
            .fog-layer { animation: none; }
          ` : ''}
        `}
      </style>

      {/* 渐变背景 - 大洋主题 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: THEME_GRADIENTS[oceanTheme],
        }}
      />

      {/* 主题装饰层 */}
      {renderThemeBackdrop(oceanTheme, particles, isReducedMotion)}

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
function renderCinematicStyle(
  stars: Star[],
  oceanTheme: OceanTheme,
  particles: WeatherParticle[],
  isReducedMotion: boolean
): JSX.Element {
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
          @keyframes snowFall {
            0% { transform: translateY(0); opacity: 0.9; }
            100% { transform: translateY(60vh); opacity: 0.4; }
          }
          @keyframes fogDrift {
            0% { transform: translateX(-5%); opacity: 0.5; }
            50% { opacity: 0.75; }
            100% { transform: translateX(5%); opacity: 0.5; }
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
          .snowflake { animation: snowFall linear infinite; }
          .fog-layer {
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%);
            animation: fogDrift 5s ease-in-out infinite;
          }
          ${isReducedMotion ? `
            .cinematic-ship { animation: none; left: 75%; bottom: 35%; opacity: 0.8; }
            .star { animation: none; }
            .snowflake { animation: none; opacity: 0.6; }
            .fog-layer { animation: none; }
          ` : ''}
        `}
      </style>

      {/* 深色渐变背景 - 大洋主题（夜间加深处理） */}
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

      {/* 主题装饰层 */}
      {renderThemeBackdrop(oceanTheme, particles, isReducedMotion)}

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
  oceanTheme = 'east',
  seed = Date.now(),
  onArrived,
  isReducedMotion = false,
}: OceanSailingSceneProps) {
  // Generate stars and weather particles once when seed changes (memoized)
  const stars = useMemo(() => generateStars(seed), [seed])
  const particles = useMemo(() => generateWeatherParticles(seed), [seed])

  const onArrivedRef = useRef(onArrived)
  onArrivedRef.current = onArrived

  useEffect(() => {
    if (!isActive) return

    // Animation duration based on style (minimal = 4s = 0.8s * 5, cinematic = 4s)
    const duration = 4000
    const timer = setTimeout(() => {
      onArrivedRef.current()
    }, duration)

    return () => {
      clearTimeout(timer)
    }
  }, [isActive, style])

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
        ? renderMinimalStyle(oceanTheme, particles, isReducedMotion)
        : renderCinematicStyle(stars, oceanTheme, particles, isReducedMotion)
      }
    </div>
  )
}
