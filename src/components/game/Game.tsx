import { useGameStore } from '../../store/gameStore'
import TitleScreen from './TitleScreen'
import WorldMap from './WorldMap'
import Battle from './Battle/Battle'
import Result from './Result'
import ExplorationMap from './ExplorationMap'

export default function Game() {
  const gamePhase = useGameStore((state) => state.gamePhase)
  const startExploration = useGameStore((state) => state.startExploration)

  const handleEnterExploration = (oceanId: string) => {
    startExploration(oceanId)
  }

  switch (gamePhase) {
    case 'title':
      return <TitleScreen />
    case 'world_map':
      return (
        <div>
          <WorldMap onEnterOcean={handleEnterExploration} />
        </div>
      )
    case 'exploration':
      return <ExplorationMap />
    case 'battle':
      return <Battle />
    case 'result':
      return <Result />
    case 'game_over':
      return <TitleScreen />
    default:
      return <TitleScreen />
  }
}
