// src/components/game/BossEntrance.tsx
import { useEffect, useRef, useState } from 'react'

type EntranceStage = 'silhouette' | 'zoom-in' | 'name-reveal' | 'battle-start'

interface BossEntranceProps {
  isActive: boolean
  bossName: string
  bossSprite: string
  isReducedMotion?: boolean
  onComplete: () => void
}

const STAGE_DURATIONS_MS: Record<EntranceStage, number> = {
  silhouette: 600,
  'zoom-in': 500,
  'name-reveal': 500,
  'battle-start': 200,
}

const REDUCED_MOTION_DURATION_MS = 300

/**
 * Boss entrance sequence: silhouette -> zoom-in -> name-reveal -> battle-start -> onComplete.
 * Total duration ~1.8s. Degrades to a single 0.3s fade-in when isReducedMotion is true.
 */
export default function BossEntrance({
  isActive,
  bossName,
  bossSprite,
  isReducedMotion = false,
  onComplete,
}: BossEntranceProps) {
  const [stage, setStage] = useState<EntranceStage>('silhouette')
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!isActive) return

    if (isReducedMotion) {
      const timer = setTimeout(() => onCompleteRef.current(), REDUCED_MOTION_DURATION_MS)
      return () => clearTimeout(timer)
    }

    setStage('silhouette')
    const timers: ReturnType<typeof setTimeout>[] = []
    let elapsed = 0

    const stages: EntranceStage[] = ['zoom-in', 'name-reveal', 'battle-start']
    elapsed += STAGE_DURATIONS_MS.silhouette
    stages.forEach((nextStage) => {
      timers.push(
        setTimeout(() => setStage(nextStage), elapsed)
      )
      elapsed += STAGE_DURATIONS_MS[nextStage]
    })

    timers.push(setTimeout(() => onCompleteRef.current(), elapsed))

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [isActive, isReducedMotion])

  if (!isActive) return null

  if (isReducedMotion) {
    return (
      <div
        className="boss-entrance boss-entrance-reduced"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1100,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: '96px' }}>{bossSprite}</div>
        <div style={{ fontSize: '28px', marginTop: '12px' }}>{bossName}</div>
      </div>
    )
  }

  const isSilhouette = stage === 'silhouette'
  const isNameVisible = stage === 'name-reveal' || stage === 'battle-start'
  const isFadingOut = stage === 'battle-start'

  return (
    <div
      className={`boss-entrance boss-entrance-${stage}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1100,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: 'opacity 0.2s ease-out',
        opacity: isFadingOut ? 0 : 1,
      }}
    >
      <style>
        {`
          @keyframes bossZoomIn {
            0% { transform: scale(0.6); }
            100% { transform: scale(1); }
          }
          @keyframes bossNameSlide {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .boss-entrance-sprite {
            animation: bossZoomIn 0.5s ease-out forwards;
          }
          .boss-entrance-name {
            animation: bossNameSlide 0.5s ease-out forwards;
          }
        `}
      </style>
      <div
        className="boss-entrance-sprite"
        style={{
          fontSize: '96px',
          filter: isSilhouette ? 'brightness(0)' : 'brightness(1)',
          transition: 'filter 0.3s ease-in',
        }}
      >
        {bossSprite}
      </div>
      {isNameVisible && (
        <div className="boss-entrance-name" style={{ fontSize: '28px', marginTop: '12px', color: 'white' }}>
          {bossName}
        </div>
      )}
    </div>
  )
}
