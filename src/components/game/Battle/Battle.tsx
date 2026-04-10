// src/components/game/Battle/Battle.tsx
import { useGameStore } from '../../../store/gameStore'
import { useEffect, useState, useRef } from 'react'
import type { QuestionOption, BattleLogEntry } from '../../../game/types'
import DamageNumber from './DamageNumber'
import CorrectFeedback from './CorrectFeedback'
import WrongFeedback from './WrongFeedback'
import { isMultiplayer } from '../../../utils/gameHelpers'
import { TeamHPBar } from './TeamHPBar'
import { PlayerStatus } from './PlayerStatus'
import { CurrentTurnIndicator } from './CurrentTurnIndicator'

export default function Battle() {
  const battle = useGameStore((state) => state.battle)
  const gamePhase = useGameStore((state) => state.gamePhase)
  const explorationBattle = useGameStore((state) => state.explorationBattle)
  const dispatch = useGameStore((state) => state.dispatch)

  // Animation states
  const [showDamageNumber, setShowDamageNumber] = useState(false)
  const [damageValue, setDamageValue] = useState(0)
  const [damageTarget, setDamageTarget] = useState<'monster' | 'player'>('monster')
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false)
  const [showWrongFeedback, setShowWrongFeedback] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null)
  const [monsterHit, setMonsterHit] = useState(false)
  const [playerHit, setPlayerHit] = useState(false)

  const prevHpRef = useRef<{ player: number; monster: number }>({ player: 0, monster: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasEnabledRef = useRef(false)

  // Redirect if no battle
  useEffect(() => {
    if (!battle && gamePhase === 'battle') {
      dispatch({ type: 'RESET_GAME' })
    }
  }, [battle, gamePhase, dispatch])

  // Phase transition: showing_question -> answering (gives player time to read)
  useEffect(() => {
    if (!battle) return

    // Only set timer if phase is showing_question and timer not already set
    if (battle.phase === 'showing_question' && !timerRef.current) {
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'ENABLE_ANSWERING' })
      }, 1000)
    }

    if (battle.phase === 'showing_question' && selectedAnswer !== null) {
      setSelectedAnswer(null)
      setCorrectAnswerIndex(null)
    }

    // Reset flag and timer when leaving showing_question
    if (battle.phase !== 'showing_question') {
      hasEnabledRef.current = false
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [battle?.phase, battle, dispatch, selectedAnswer])

  // Track HP changes for animations - using functional updates to avoid stale closure
  useEffect(() => {
    if (!battle) return

    const { player, monster } = battle
    const prevHp = prevHpRef.current

    // Only process damage if we're in animating_damage phase and HP actually changed
    if (battle.phase === 'animating_damage') {
      const monsterDamage = prevHp.monster - monster.hp
      const playerDamage = prevHp.player - player.hp

      if (monsterDamage > 0) {
        setDamageValue(() => monsterDamage)
        setDamageTarget('monster')
        setShowDamageNumber(true)
        setMonsterHit(true)
        setTimeout(() => setMonsterHit(false), 300)
        setTimeout(() => setShowDamageNumber(false), 800)
      } else if (playerDamage > 0) {
        setDamageValue(() => playerDamage)
        setDamageTarget('player')
        setShowDamageNumber(true)
        setPlayerHit(true)
        setTimeout(() => setPlayerHit(false), 300)
        setTimeout(() => setShowDamageNumber(false), 800)
      }
    }

    // Update ref after processing
    prevHpRef.current = { player: player.hp, monster: monster.hp }
  }, [battle?.phase, battle?.player?.hp, battle?.monster?.hp, battle])

  // After damage animation completes, transition to next state
  useEffect(() => {
    if (!battle) return
    if (battle.phase !== 'animating_damage') return

    // After animation completes (800ms), check if battle is over or get next question
    const timer = setTimeout(() => {
      // Read current state from store to avoid stale closure
      const currentBattle = useGameStore.getState().battle
      if (!currentBattle) return

      if (currentBattle.phase === 'victory' || currentBattle.phase === 'defeat') return

      if (currentBattle.monster.hp <= 0) {
        dispatch({ type: 'END_BATTLE', victory: true })
        return
      }

      if (currentBattle.player.hp <= 0) {
        dispatch({ type: 'END_BATTLE', victory: false })
        return
      }

      dispatch({ type: 'NEXT_QUESTION' })
    }, 850)

    return () => clearTimeout(timer)
  }, [battle?.phase, battle?.monster?.hp, battle?.player?.hp, battle, dispatch])

  if (!battle) return null

  const { player, monster, currentQuestion, phase, battleLog, players, currentPlayerIndex, teamHP, maxTeamHP } = battle
  const isAnswering = phase === 'answering'
  const isAnimating = phase === 'animating_damage'
  const isVictory = phase === 'victory'
  const isDefeat = phase === 'defeat'
  const isShowingQuestion = phase === 'showing_question'

  const handleAnswer = (answerIndex: number) => {
    if (!isAnswering) return
    const correctIdx = currentQuestion?.options.findIndex(opt => opt.isCorrect) ?? null
    setCorrectAnswerIndex(correctIdx)
    setSelectedAnswer(answerIndex)
    dispatch({ type: 'ANSWER_QUESTION', answerIndex })
  }

  // Show feedback after answering
  useEffect(() => {
    if (phase === 'animating_damage' && selectedAnswer !== null) {
      const isCorrect = currentQuestion?.options[selectedAnswer]?.isCorrect
      if (isCorrect) {
        setShowCorrectFeedback(true)
        setTimeout(() => setShowCorrectFeedback(false), 500)
      } else {
        setShowWrongFeedback(true)
        setTimeout(() => setShowWrongFeedback(false), 600)
      }
    }
  }, [phase, selectedAnswer, currentQuestion])

  const handleContinue = () => {
    if (explorationBattle) {
      // Exploration battle - return to exploration map
      dispatch({ type: 'END_EXPLORATION_BATTLE', victory: isVictory })
    } else if (isVictory) {
      dispatch({ type: 'COMPLETE_OCEAN' })
    } else {
      dispatch({ type: 'RESET_GAME' })
    }
  }

  const getOptionClass = (index: number): string => {
    const classes = ['option-btn']
    if (selectedAnswer === index) {
      if (showCorrectFeedback) classes.push('correct')
      if (showWrongFeedback) classes.push('wrong')
    }
    // Highlight correct answer when wrong answer is selected
    if (showWrongFeedback && index === correctAnswerIndex) {
      classes.push('correct')
    }
    return classes.join(' ')
  }

  return (
    <div className={`battle-screen ${showWrongFeedback ? 'red-flash' : ''}`}>
      <div className="battle-header">
        <h2>⚔️ 战斗开始 ⚔️</h2>
      </div>

      <div className="battle-arena">
        {/* Monster Section */}
        <div className={`monster-section ${monsterHit ? 'hit' : ''}`}>
          <h3>{monster.name}</h3>
          <div style={{ fontSize: '64px', textAlign: 'center', margin: '10px 0' }}>
            {monster.sprite || '👹'}
          </div>
          <div className="hp-bar">
            <div
              className={`hp-fill monster ${isAnimating && damageTarget === 'monster' ? 'animating' : ''}`}
              style={{ width: `${(monster.hp / monster.maxHp) * 100}%` }}
            />
          </div>
          <p>HP: {monster.hp} / {monster.maxHp}</p>

          {/* Damage Number */}
          {showDamageNumber && damageTarget === 'monster' && (
            <DamageNumber value={damageValue} target="monster" />
          )}
        </div>

        {/* Team HP Bar - shows shared HP for both players */}
        <TeamHPBar current={teamHP} max={maxTeamHP} />

        {/* Current Turn Indicator - multiplayer only */}
        {isMultiplayer(players) && players[currentPlayerIndex] && (
          <CurrentTurnIndicator
            player={players[currentPlayerIndex]}
            playerIndex={currentPlayerIndex}
          />
        )}

        {/* Player Status - multiplayer only */}
        {isMultiplayer(players) && (
          <PlayerStatus players={players} currentIndex={currentPlayerIndex} />
        )}

        <div className="vs">VS</div>

        {/* Player Section */}
        <div className={`player-section ${playerHit ? 'hit' : ''}`}>
          <h3>{player.name}</h3>
          <div style={{ fontSize: '64px', textAlign: 'center', margin: '10px 0' }}>
            🧒
          </div>
          <div className="hp-bar">
            <div
              className={`hp-fill player ${isAnimating && damageTarget === 'player' ? 'animating' : ''}`}
              style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
            />
          </div>
          <p>HP: {player.hp} / {player.maxHp}</p>

          {/* Damage Number */}
          {showDamageNumber && damageTarget === 'player' && (
            <DamageNumber value={damageValue} target="player" />
          )}
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
                className={getOptionClass(index)}
                onClick={() => handleAnswer(index)}
                disabled={!isAnswering || isAnimating}
              >
                {option.text}
              </button>
            ))}
          </div>

          {/* Correct Feedback Stars */}
          {showCorrectFeedback && <CorrectFeedback />}
        </div>
      )}

      {/* Wrong Feedback */}
      {showWrongFeedback && <WrongFeedback />}

      {/* Battle Result Overlay */}
      {(isVictory || isDefeat) && (
        <div className={`battle-result-overlay ${isVictory ? 'victory' : 'defeat'}`}>
          <div className="battle-result-content">
            <h2>{isVictory ? '🎉 太棒了！🎉' : '💀 再试一次！💀'}</h2>
            <button
              className={`continue-btn ${isVictory ? 'victory' : 'defeat'}`}
              onClick={handleContinue}
            >
              {isVictory ? '继续' : '重新挑战'}
            </button>
          </div>
        </div>
      )}

      {/* Battle Log */}
      <div className="battle-log">
        {battleLog.slice(-3).map((entry: BattleLogEntry, index: number) => (
          <p key={index} className={`log-entry ${entry.type}`}>
            {entry.message}
          </p>
        ))}
      </div>
    </div>
  )
}