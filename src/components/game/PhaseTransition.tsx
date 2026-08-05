// src/components/game/PhaseTransition.tsx
import type { ReactNode } from 'react'

export type TransitionKind = 'fade-scale' | 'shake-vignette' | 'victory-burst' | 'defeat-fade' | 'none'

interface PhaseTransitionProps {
  transitionKey: string
  kind: TransitionKind
  isReducedMotion?: boolean
  children: ReactNode
}

const DURATIONS: Record<TransitionKind, string> = {
  'fade-scale': '0.5s',
  'shake-vignette': '0.6s',
  'victory-burst': '0.8s',
  'defeat-fade': '0.8s',
  none: '0s',
}

/**
 * Wraps a game-phase screen with a short (<=1s) entrance transition.
 * Re-mounts (via `key`) whenever transitionKey changes to replay the animation.
 * All kinds degrade to an instant, animation-free render when isReducedMotion is true.
 */
export default function PhaseTransition({
  transitionKey,
  kind,
  isReducedMotion = false,
  children,
}: PhaseTransitionProps) {
  const effectiveKind: TransitionKind = isReducedMotion ? 'none' : kind
  const duration = DURATIONS[effectiveKind]

  return (
    <div key={transitionKey} className={`phase-transition phase-transition-${effectiveKind}`}>
      {effectiveKind !== 'none' && (
        <style>
          {`
            @keyframes phaseFadeScale {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            @keyframes phaseShake {
              0% { transform: translate(0, 0); }
              20% { transform: translate(-6px, 0); }
              40% { transform: translate(6px, 0); }
              60% { transform: translate(-4px, 0); }
              80% { transform: translate(4px, 0); }
              100% { transform: translate(0, 0); }
            }
            @keyframes phaseVignette {
              0% { box-shadow: inset 0 0 0 0 rgba(0,0,0,0); }
              100% { box-shadow: inset 0 0 120px 40px rgba(0,0,0,0.5); }
            }
            @keyframes phaseVictoryBurst {
              0% { opacity: 0; filter: brightness(2.2); transform: scale(0.9); }
              40% { opacity: 1; filter: brightness(1.4); }
              100% { opacity: 1; filter: brightness(1); transform: scale(1); }
            }
            @keyframes phaseDefeatFade {
              0% { opacity: 0; filter: brightness(0.3) grayscale(0.6); }
              100% { opacity: 1; filter: brightness(1) grayscale(0); }
            }
            .phase-transition-fade-scale {
              animation: phaseFadeScale ${duration} ease-out both;
            }
            .phase-transition-shake-vignette {
              animation: phaseShake ${duration} ease-in-out both, phaseVignette ${duration} ease-out both;
            }
            .phase-transition-victory-burst {
              animation: phaseVictoryBurst ${duration} ease-out both;
            }
            .phase-transition-defeat-fade {
              animation: phaseDefeatFade ${duration} ease-out both;
            }
          `}
        </style>
      )}
      {children}
    </div>
  )
}
