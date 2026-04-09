import { useGameStore } from '../../store/gameStore'
import TitleScreen from './TitleScreen'
import WorldMap from './WorldMap'
import Battle from './Battle/Battle'
import ErrorBoundary from './Battle/ErrorBoundary'
import Result from './Result'
import ExplorationMap from './ExplorationMap'
import { AccessibilityToggle } from './AccessibilityToggle'

export default function Game() {
  const gamePhase = useGameStore((state) => state.gamePhase)
  const startExploration = useGameStore((state) => state.startExploration)

  const handleEnterExploration = (oceanId: string) => {
    startExploration(oceanId)
  }

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
