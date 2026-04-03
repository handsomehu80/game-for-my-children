import { useGameStore } from '../../store/gameStore'

export default function Result() {
  const state = useGameStore()
  const dispatch = useGameStore.getState().dispatch

  const battle = state.battle
  const isVictory = battle?.phase === 'victory'

  const handleContinue = () => {
    if (isVictory) {
      dispatch({ type: 'COMPLETE_OCEAN' })
    } else {
      dispatch({ type: 'GAME_OVER' })
    }
  }

  if (!battle) {
    return null
  }

  return (
    <div className="result-screen">
      <h1>{isVictory ? '🎉 胜利！🎉' : '💀 失败 💀'}</h1>
      <div className="result-content">
        {isVictory ? (
          <>
            <p>恭喜你打败了 {battle.monster.name}！</p>
            <p>波吉王子和船员们继续前进！</p>
          </>
        ) : (
          <>
            <p>很遗憾，{battle.player.name}倒下了...</p>
            <p>但是冒险还会继续！</p>
          </>
        )}
      </div>
      <button onClick={handleContinue}>
        {isVictory ? '继续冒险' : '重新开始'}
      </button>
    </div>
  )
}
