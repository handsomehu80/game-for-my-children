import { useGameStore } from '../../store/gameStore'
import { oceansData } from '../../data/oceans'
import { monstersData } from '../../data/monsters'
import { getRandomQuestion } from '../../game/QuestionSelector'
import type { Player } from '../../game/types'

export default function WorldMap() {
  const state = useGameStore()
  const dispatch = useGameStore.getState().dispatch

  const handleOceanSelect = (oceanId: string) => {
    const ocean = oceansData[oceanId]
    if (!ocean) return

    // Get first monster for this ocean
    const monsterId = ocean.monsters[0]
    const monster = monstersData[monsterId]
    if (!monster) return

    // Get random question for this ocean
    const question = getRandomQuestion({ oceanId })
    if (!question) return

    dispatch({ type: 'SELECT_OCEAN', ocean: oceanId })
    dispatch({ type: 'START_BATTLE', monster, question })
  }

  return (
    <div className="world-map">
      <h2>🗺️ 世界地图</h2>
      <div className="oceans-grid">
        {Object.values(oceansData).map((ocean) => {
          const isUnlocked = state.unlockedOceans.includes(ocean.id)
          const isCompleted = state.completedOceans.includes(ocean.id)
          const monsterId = ocean.monsters[0]
          const monster = monstersData[monsterId]
          const bossName = monster?.name || '???'

          return (
            <div
              key={ocean.id}
              className={`ocean-card ${ocean.id} ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
              onClick={() => isUnlocked && handleOceanSelect(ocean.id)}
            >
              <h3>{ocean.name}</h3>
              <p className="ocean-desc">{ocean.description}</p>
              <p className="boss-info">Boss: {isUnlocked ? bossName : '???'}</p>
              {isCompleted && <span className="badge">已通关</span>}
              {!isUnlocked && <span className="lock">🔒</span>}
            </div>
          )
        })}
      </div>
      <div className="player-status">
        <h3>船员状态</h3>
        {state.players.map((player: Player) => (
          <div key={player.id} className="player-card">
            <span>{player.name}</span>
            <span>HP: {player.hp}/{player.maxHp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
