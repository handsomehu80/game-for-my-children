import { useGameStore } from '../../store/gameStore'
import TitleScreen from './TitleScreen'
import WorldMap from './WorldMap'
import Battle from './Battle/Battle'
import ErrorBoundary from './Battle/ErrorBoundary'
import Result from './Result'
import ExplorationMap from './ExplorationMap'
import { AccessibilityToggle } from './AccessibilityToggle'
import PhaseTransition, { type TransitionKind } from './PhaseTransition'
import { useAccessibility } from '../../hooks/useAccessibility'
import type { GamePhase } from '../../game/types'

export function getTransitionKind(gamePhase: GamePhase, isVictory: boolean): TransitionKind {
  switch (gamePhase) {
    case 'title':
    case 'world_map':
    case 'exploration':
      return 'fade-scale'
    case 'battle':
      return 'shake-vignette'
    case 'result':
      return isVictory ? 'victory-burst' : 'defeat-fade'
    default:
      return 'fade-scale'
  }
}

export default function Game() {
  const gamePhase = useGameStore((state) => state.gamePhase)
  const battle = useGameStore((state) => state.battle)
  const startExploration = useGameStore((state) => state.startExploration)
  const { isReducedMotion } = useAccessibility()

  const handleEnterExploration = (oceanId: string) => {
    startExploration(oceanId)
  }

  const isVictory = battle?.phase === 'victory'
  const transitionKey = gamePhase === 'result' ? `result-${isVictory ? 'victory' : 'defeat'}` : gamePhase
  const transitionKind = getTransitionKind(gamePhase, isVictory)

  const renderPhase = () => {
    switch (gamePhase) {
      case 'title':
        return (
          <>
            <AccessibilityToggle />
            <TitleScreen />
          </>
        )
      case 'world_map':
        return (
          <>
            <AccessibilityToggle />
            <div>
              <WorldMap onEnterOcean={handleEnterExploration} />
            </div>
          </>
        )
      case 'exploration':
        return (
          <>
            <AccessibilityToggle />
            <ExplorationMap />
          </>
        )
      case 'battle':
        return (
          <>
            <AccessibilityToggle />
            <ErrorBoundary>
              <Battle />
            </ErrorBoundary>
          </>
        )
      case 'result':
        return (
          <>
            <AccessibilityToggle />
            <Result />
          </>
        )
      case 'game_over':
        return (
          <>
            <AccessibilityToggle />
            <TitleScreen />
          </>
        )
      default:
        return (
          <>
            <AccessibilityToggle />
            <TitleScreen />
          </>
        )
    }
  }

  return (
    <PhaseTransition transitionKey={transitionKey} kind={transitionKind} isReducedMotion={isReducedMotion}>
      {renderPhase()}
    </PhaseTransition>
  )
}
