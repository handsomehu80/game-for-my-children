import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export default function TitleScreen() {
  const dispatch = useGameStore((state) => state.dispatch)
  const [playerName, setPlayerName] = useState('')
  const [player2Name, setPlayer2Name] = useState('')
  const [isCoop, setIsCoop] = useState(false)

  const handleStart = () => {
    const players = [
      { id: 'p1', name: playerName || '玩家1', hp: 100, maxHp: 100, comboCount: 0 },
    ]
    if (isCoop && player2Name) {
      players.push({ id: 'p2', name: player2Name, hp: 100, maxHp: 100, comboCount: 0 })
    }
    dispatch({ type: 'START_GAME', players })
  }

  return (
    <div className="title-screen">
      <h1>波吉王子海洋探险</h1>
      <p>Prince Boji's Ocean Adventure</p>

      <div className="start-form">
        <input
          type="text"
          placeholder="玩家1名字"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={isCoop}
            onChange={(e) => setIsCoop(e.target.checked)}
          />
          双人模式
        </label>

        {isCoop && (
          <input
            type="text"
            placeholder="玩家2名字"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
          />
        )}

        <button onClick={handleStart} disabled={!playerName && !player2Name}>
          开始冒险
        </button>
      </div>
    </div>
  )
}
