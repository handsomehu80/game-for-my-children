import { useGameStore } from '../../store/gameStore'
import TitleScreen from './TitleScreen'
import WorldMap from './WorldMap'
import Battle from './Battle/Battle'
import Result from './Result'

export default function Game() {
  const gamePhase = useGameStore((state) => state.gamePhase)

  switch (gamePhase) {
    case 'title':
      return <TitleScreen />
    case 'world_map':
      return <WorldMap />
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
