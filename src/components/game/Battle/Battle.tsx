import { useGameStore } from '../../../store/gameStore'
import { useEffect } from 'react'
import type { QuestionOption, BattleLogEntry } from '../../../game/types'

export default function Battle() {
  const battle = useGameStore((state) => state.battle)
  const gamePhase = useGameStore((state) => state.gamePhase)
  const dispatch = useGameStore((state) => state.dispatch)

  // Redirect if no battle
  useEffect(() => {
    if (!battle && gamePhase === 'battle') {
      // Battle not initialized - redirect to world map
      dispatch({ type: 'RESET_GAME' })
    }
  }, [battle, gamePhase, dispatch])

  if (!battle) return null

  const { player, monster, currentQuestion, phase, battleLog } = battle
  const isAnswering = phase === 'answering'
  const isAnimating = phase === 'animating_damage'
  const isVictory = phase === 'victory'
  const isDefeat = phase === 'defeat'
  const isShowingQuestion = phase === 'showing_question'

  const handleAnswer = (answerIndex: number) => {
    if (!isAnswering) return
    dispatch({ type: 'ANSWER_QUESTION', answerIndex })
  }

  const handleContinue = () => {
    if (isVictory) {
      dispatch({ type: 'COMPLETE_OCEAN' })
    } else {
      // Restart battle or go back
      dispatch({ type: 'RESET_GAME' })
    }
  }

  return (
    <div className="battle-screen">
      <div className="battle-header">
        <h2>⚔️ 战斗开始 ⚔️</h2>
      </div>

      <div className="battle-arena">
        {/* Monster Section */}
        <div className="monster-section">
          <h3>{monster.name}</h3>
          <div className="hp-bar">
            <div
              className="hp-fill monster"
              style={{ width: `${(monster.hp / monster.maxHp) * 100}%` }}
            />
          </div>
          <p>HP: {monster.hp} / {monster.maxHp}</p>
        </div>

        <div className="vs">VS</div>

        {/* Player Section */}
        <div className="player-section">
          <h3>{player.name}</h3>
          <div className="hp-bar">
            <div
              className="hp-fill player"
              style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
            />
          </div>
          <p>HP: {player.hp} / {player.maxHp}</p>
        </div>
      </div>

      {/* Question Box */}
      {currentQuestion && (isShowingQuestion || isAnswering) && (
        <div className="question-box">
          <h4>问题：</h4>
          <p className="question-content">{currentQuestion.content}</p>
          <div className="options">
            {currentQuestion.options.map((option: QuestionOption, index: number) => (
              <button
                key={index}
                className="option-btn"
                onClick={() => handleAnswer(index)}
                disabled={!isAnswering || isAnimating}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Battle Result Overlay */}
      {(isVictory || isDefeat) && (
        <div className="battle-result-overlay">
          <h2>{isVictory ? '🎉 胜利！' : '💀 失败...'}</h2>
          <button onClick={handleContinue}>
            {isVictory ? '继续' : '重新挑战'}
          </button>
        </div>
      )}

      {/* Battle Log */}
      <div className="battle-log">
        {battleLog.slice(-5).map((entry: BattleLogEntry, index: number) => (
          <p key={index} className={`log-entry ${entry.type}`}>
            {entry.message}
          </p>
        ))}
      </div>
    </div>
  )
}