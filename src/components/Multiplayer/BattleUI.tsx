// src/components/Multiplayer/BattleUI.tsx
// Online battle UI - shows real-time multi-player battle state

import { useEffect, useState, useCallback } from 'react'
import { useMultiplayerStore } from '../../multiplayer/multiplayerStore'
import { useBattleSync } from '../../multiplayer/useBattleSync'
import { PlayerCard } from './PlayerCard'

export function BattleUI() {
  const {
    currentRoom,
    playerId,
    battleState,
    battleResult,
    uiPhase,
    leaveRoom,
    setUIPhase,
  } = useMultiplayerStore()

  const { submitAnswer } = useBattleSync()

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(30)
  const [showResult, setShowResult] = useState(false)

  // Timer for question
  useEffect(() => {
    if (battleState?.phase === 'question' || battleState?.phase === 'answering') {
      const timeLimit = 30 // Default time limit
      setTimeRemaining(timeLimit)
      setSelectedAnswer(null)
      setShowResult(false)

      const interval = setInterval(() => {
        setTimeRemaining((t) => {
          if (t <= 1) {
            clearInterval(interval)
            return 0
          }
          return t - 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [battleState?.phase, battleState?.questionIndex])

  // Show result when phase changes to 'result'
  useEffect(() => {
    if (battleState?.phase === 'result') {
      setShowResult(true)
    }
  }, [battleState?.phase])

  const handleAnswer = useCallback(
    (answerIndex: number) => {
      if (selectedAnswer !== null) return // Already answered
      setSelectedAnswer(answerIndex)
      submitAnswer(answerIndex, Date.now())
    },
    [selectedAnswer, submitAnswer]
  )

  const handleLeave = () => {
    leaveRoom()
    setUIPhase('lobby')
  }

  if (!currentRoom || !battleState) {
    return (
      <div className="battle-loading">
        <p>加载战斗中...</p>
      </div>
    )
  }

  const { players } = currentRoom
  const { currentQuestion, phase, monsterHP, teamHP, scores, results } = battleState

  return (
    <div className="online-battle">
      {/* Header */}
      <div className="battle-header">
        <h2>⚔️ 联机对战</h2>
        <div className="battle-info">
          <span>题目 {battleState.questionIndex + 1} / {battleState.totalQuestions}</span>
        </div>
      </div>

      {/* Players */}
      <div className="players-section">
        <h3>玩家</h3>
        <div className="players-grid">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isCurrentPlayer={player.id === playerId}
              showReadyStatus={false}
            />
          ))}
        </div>
      </div>

      {/* Scores */}
      <div className="scores-section">
        {players.map((player) => (
          <div key={player.id} className="score-item">
            <span className="score-name">{player.name}</span>
            <span className="score-value">{scores[player.id] || 0} 分</span>
          </div>
        ))}
      </div>

      {/* Battle Arena */}
      <div className="battle-arena">
        {/* Monster HP */}
        <div className="monster-section">
          <h3>Boss</h3>
          <div className="monster-hp-bar">
            <div
              className="hp-fill monster"
              style={{ width: `${(monsterHP / 100) * 100}%` }}
            />
          </div>
          <p>HP: {monsterHP}</p>
        </div>

        {/* Team HP */}
        <div className="team-hp-section">
          <h4>队伍 HP</h4>
          <div className="team-hp-bar">
            <div
              className="hp-fill team"
              style={{ width: `${(teamHP / 100) * 100}%` }}
            />
          </div>
          <p>{teamHP}</p>
        </div>

        {/* Timer */}
        <div className={`timer ${timeRemaining <= 10 ? 'warning' : ''}`}>
          ⏱️ {timeRemaining}s
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="question-section">
          <h3>问题</h3>
          <p className="question-content">{currentQuestion.content}</p>
          <div className="options">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${
                  selectedAnswer === index
                    ? showResult
                      ? option.isCorrect
                        ? 'correct'
                        : 'wrong'
                      : 'selected'
                    : showResult && option.isCorrect
                    ? 'correct'
                    : ''
                }`}
                onClick={() => handleAnswer(index)}
                disabled={phase !== 'answering' || selectedAnswer !== null}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Answer Results */}
      {showResult && results && results.length > 0 && (
        <div className="results-section">
          <h3>本轮结果</h3>
          {results.map((result) => {
            const player = players.find((p) => p.id === result.playerId)
            return (
              <div key={result.playerId} className={`result-item ${result.isCorrect ? 'correct' : 'wrong'}`}>
                <span className="result-player">{player?.name || '未知'}</span>
                <span className="result-status">
                  {result.isCorrect ? '✓ 正确' : '✗ 错误'}
                </span>
                <span className="result-time">{result.timeUsed}ms</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Battle Result Overlay */}
      {uiPhase === 'result' && battleResult && (
        <div className={`battle-result-overlay ${battleResult}`}>
          <div className="result-content">
            <h2>{battleResult === 'victory' ? '🎉 胜利！🎉' : '💀 失败 💀'}</h2>
            <div className="final-scores">
              {players.map((player) => (
                <div key={player.id} className="final-score">
                  <span>{player.name}</span>
                  <span>{scores[player.id] || 0} 分</span>
                </div>
              ))}
            </div>
            <button className="btn-continue" onClick={handleLeave}>
              返回大厅
            </button>
          </div>
        </div>
      )}

      <style>{`
        .online-battle {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 20px;
          color: white;
        }

        .battle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .battle-header h2 {
          margin: 0;
        }

        .battle-info {
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
        }

        .players-section {
          margin-bottom: 16px;
        }

        .players-section h3 {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #888;
        }

        .players-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }

        .scores-section {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .score-item {
          background: rgba(74, 144, 217, 0.2);
          padding: 8px 16px;
          border-radius: 8px;
          display: flex;
          gap: 12px;
        }

        .score-name {
          color: #888;
        }

        .score-value {
          font-weight: bold;
          color: #4a90d9;
        }

        .battle-arena {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          text-align: center;
        }

        .monster-section h3 {
          margin: 0 0 8px 0;
        }

        .monster-hp-bar, .team-hp-bar {
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .hp-fill {
          height: 100%;
          transition: width 0.3s;
        }

        .hp-fill.monster {
          background: linear-gradient(90deg, #e74c3c, #c0392b);
        }

        .hp-fill.team {
          background: linear-gradient(90deg, #27ae60, #2ecc71);
        }

        .team-hp-section {
          margin-top: 16px;
        }

        .team-hp-section h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #888;
        }

        .timer {
          font-size: 24px;
          font-weight: bold;
          margin-top: 16px;
        }

        .timer.warning {
          color: #e74c3c;
          animation: pulse 0.5s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .question-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .question-section h3 {
          margin: 0 0 12px 0;
          color: #888;
        }

        .question-content {
          font-size: 18px;
          margin-bottom: 16px;
        }

        .options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .option-btn {
          padding: 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid transparent;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .option-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          border-color: #4a90d9;
        }

        .option-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .option-btn.selected {
          border-color: #f39c12;
          background: rgba(243, 156, 18, 0.2);
        }

        .option-btn.correct {
          border-color: #27ae60;
          background: rgba(39, 174, 96, 0.3);
        }

        .option-btn.wrong {
          border-color: #e74c3c;
          background: rgba(231, 76, 60, 0.3);
        }

        .results-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .results-section h3 {
          margin: 0 0 12px 0;
          color: #888;
        }

        .result-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 4px;
        }

        .result-item.correct {
          background: rgba(39, 174, 96, 0.2);
        }

        .result-item.wrong {
          background: rgba(231, 76, 60, 0.2);
        }

        .result-player {
          font-weight: bold;
        }

        .result-status {
          flex: 1;
          text-align: center;
        }

        .result-time {
          color: #888;
          font-size: 12px;
        }

        .battle-result-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .battle-result-overlay.victory {
          background: rgba(39, 174, 96, 0.9);
        }

        .battle-result-overlay.defeat {
          background: rgba(231, 76, 60, 0.9);
        }

        .result-content {
          text-align: center;
        }

        .result-content h2 {
          font-size: 48px;
          margin-bottom: 24px;
        }

        .final-scores {
          margin-bottom: 32px;
        }

        .final-score {
          display: flex;
          justify-content: center;
          gap: 24px;
          font-size: 24px;
          margin-bottom: 8px;
        }

        .btn-continue {
          padding: 16px 48px;
          background: white;
          border: none;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-continue:hover {
          transform: scale(1.05);
        }

        .battle-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a2e;
          color: white;
        }
      `}</style>
    </div>
  )
}
