import { Canvas } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { useGameStore } from '../../store/gameStore'

export default function Scene() {
  const gamePhase = useGameStore((state) => state.gamePhase)

  if (gamePhase !== 'battle') return null

  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
      {/* Scene content will be added in Phase 2 */}
    </Canvas>
  )
}