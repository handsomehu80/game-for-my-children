import { useGame } from '../../context/GameContext'
import { oceansData } from '../../data/oceans'
import { getMonstersByOcean } from '../../data/monsters'
import { getRandomQuestion } from '../../data/questions'

export default function WorldMap() {
  const { state, dispatch } = useGame()

  const handleOceanSelect = (oceanId: string) => {
    const ocean = oceansData[oceanId]
    const monsters = getMonstersByOcean(oceanId)
    if (monsters.length === 0) return

    const randomMonster = monsters[Math.floor(Math.random() * monsters.length)]
    const question = getRandomQuestion(ocean.difficulty)

    dispatch({ type: 'SELECT_OCEAN', ocean: oceanId as any })
    dispatch({ type: 'START_BATTLE', monster: randomMonster, question })
  }

  return (
    <div className="world-map">
      <h2>🗺️ 世界地图</h2>
      <div className="oceans-grid">
        {Object.values(oceansData).map((ocean) => {
          const isUnlocked = state.unlockedOceans.includes(ocean.id as any)
          const isCompleted = state.completedOceans.includes(ocean.id as any)
          const monsters = getMonstersByOcean(ocean.id)
          const bossName = monsters[0]?.name || '???'

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
        {state.players.map((player) => (
          <div key={player.id} className="player-card">
            <span>{player.name}</span>
            <span>HP: {player.hp}/{player.maxHp}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
