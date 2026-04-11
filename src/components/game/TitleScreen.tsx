import { useState, useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { SaveSlotModal } from './SaveSlotModal'
import type { SaveSlotInfo } from '../../game/types'

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9]

type TitleView = 'main' | 'setup'

export default function TitleScreen() {
  const dispatch = useGameStore((state) => state.dispatch)
  const getSaveSlotInfo = useGameStore((state) => state.getSaveSlotInfo)
  const hasSavedGames = useGameStore((state) => state.hasSavedGames)
  const loadGame = useGameStore((state) => state.loadGame)

  const [view, setView] = useState<TitleView>('main')
  const [showSlotModal, setShowSlotModal] = useState(false)
  const [slotInfo, setSlotInfo] = useState<SaveSlotInfo[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  // Player setup state
  const [player1Name, setPlayer1Name] = useState('')
  const [player1Grade, setPlayer1Grade] = useState<number>(1)
  const [player2Name, setPlayer2Name] = useState('')
  const [player2Grade, setPlayer2Grade] = useState<number>(1)
  const [isCoop, setIsCoop] = useState(false)

  useEffect(() => {
    const info = getSaveSlotInfo()
    setSlotInfo(info)
  }, [getSaveSlotInfo])

  const hasSaves = hasSavedGames()

  const handleContinue = (slotIndex: number) => {
    setLoadError(null)
    const success = loadGame(slotIndex)
    if (!success) {
      setLoadError('存档加载失败，数据可能已损坏')
    }
    // If success, game phase changes to world_map or exploration
  }

  const handleNewGame = () => {
    if (hasSaves) {
      setShowSlotModal(true)
    } else {
      // No saves exist, start fresh in slot 0
      useGameStore.setState({ currentSaveSlot: 0 })
      startGame()
    }
  }

  const handleSelectSlot = (slotIndex: number) => {
    setShowSlotModal(false)
    useGameStore.setState({ currentSaveSlot: slotIndex })
    startGame()
  }

  const startGame = () => {
    const players = [
      { id: 'p1', name: player1Name || '玩家1', hp: 100, maxHp: 100, comboCount: 0, grade: player1Grade },
    ]
    if (isCoop && player2Name) {
      players.push({ id: 'p2', name: player2Name || '玩家2', hp: 100, maxHp: 100, comboCount: 0, grade: player2Grade })
    }
    dispatch({
      type: 'START_GAME',
      players,
      grade: player1Grade,
      subject: 'math',
    })
  }

  const handleBack = () => {
    setView('main')
    setShowSlotModal(false)
    setLoadError(null)
  }

  // Show setup view for configuring new game
  if (view === 'setup') {
    return (
      <div className="title-screen">
        <h1>波吉王子海洋探险</h1>
        <p>Prince Boji's Ocean Adventure</p>

        <div className="start-form">
          <div className="player-input-group">
            <input
              type="text"
              placeholder="玩家1名字"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
            />
            <div className="grade-selector">
              <label>年级:</label>
              <div className="grade-buttons">
                {GRADES.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    className={player1Grade === grade ? 'selected' : ''}
                    onClick={() => setPlayer1Grade(grade)}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <label className="coop-toggle">
            <input
              type="checkbox"
              checked={isCoop}
              onChange={(e) => setIsCoop(e.target.checked)}
            />
            双人模式
          </label>

          {isCoop && (
            <div className="player-input-group">
              <input
                type="text"
                placeholder="玩家2名字"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
              />
              <div className="grade-selector">
                <label>年级:</label>
                <div className="grade-buttons">
                  {GRADES.map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      className={player2Grade === grade ? 'selected' : ''}
                      onClick={() => setPlayer2Grade(grade)}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="button-group">
            <button onClick={handleNewGame} disabled={!player1Name && !player2Name}>
              开始冒险
            </button>
            <button onClick={handleBack} className="secondary">
              返回
            </button>
          </div>
        </div>

        {showSlotModal && (
          <SaveSlotModal
            slots={slotInfo}
            onSelect={handleSelectSlot}
            onCancel={() => setShowSlotModal(false)}
          />
        )}
      </div>
    )
  }

  // Main title view
  return (
    <div className="title-screen">
      <h1>波吉王子海洋探险</h1>
      <p>Prince Boji's Ocean Adventure</p>

      <div className="menu-buttons">
        {hasSaves ? (
          <>
            <p className="subtitle">继续您的冒险</p>
            {slotInfo
              .filter((slot) => slot.occupied)
              .map((slot) => (
                <button
                  key={slot.slotIndex}
                  onClick={() => handleContinue(slot.slotIndex)}
                  className="continue-btn"
                >
                  继续游戏 (存档{slot.slotIndex + 1})
                </button>
              ))}
            <button onClick={() => setView('setup')} className="new-game-btn">
              开始新游戏
            </button>
          </>
        ) : (
          <>
            <p className="subtitle">踏上您的海洋探险之旅</p>
            <button onClick={() => setView('setup')} className="start-btn">
              开始游戏
            </button>
          </>
        )}
      </div>

      {loadError && (
        <div className="error-message">
          <p>{loadError}</p>
          <button onClick={() => setView('setup')}>开始新游戏</button>
        </div>
      )}

      {showSlotModal && (
        <SaveSlotModal
          slots={slotInfo}
          onSelect={handleSelectSlot}
          onCancel={() => setShowSlotModal(false)}
        />
      )}
    </div>
  )
}
