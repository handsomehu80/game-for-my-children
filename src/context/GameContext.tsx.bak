import { createContext, useContext, useReducer, ReactNode } from 'react'
import { GameState, GameAction, OceanZone, BattleLogEntry } from '../game/types'

const initialState: GameState = {
  currentOcean: null,
  players: [],
  unlockedOceans: ['east'],
  completedOceans: [],
  battle: null,
  gamePhase: 'title',
  totalScore: 0,
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        players: action.players,
        gamePhase: 'world_map',
        currentOcean: 'east',
      }

    case 'SELECT_OCEAN':
      if (!state.unlockedOceans.includes(action.ocean)) return state
      return {
        ...state,
        currentOcean: action.ocean,
      }

    case 'START_BATTLE':
      return {
        ...state,
        gamePhase: 'battle',
        battle: {
          player: state.players[0],
          monster: action.monster,
          currentQuestion: action.question,
          isPlayerTurn: true,
          isAnswering: false,
          battleLog: [],
          isVictory: false,
          isDefeat: false,
        },
      }

    case 'ANSWER_QUESTION': {
      if (!state.battle || !state.battle.currentQuestion) return state
      const selectedOption = state.battle.currentQuestion.options[action.answerIndex]
      const isCorrect = selectedOption?.isCorrect ?? false
      const newBattleLog: BattleLogEntry[] = [
        ...state.battle.battleLog,
        {
          type: (isCorrect ? 'correct' : 'wrong') as BattleLogEntry['type'],
          message: isCorrect ? '回答正确！' : '回答错误！',
          timestamp: Date.now(),
        },
      ]

      if (isCorrect) {
        const newMonsterHp = Math.max(0, state.battle.monster.hp - 20)
        const isVictory = newMonsterHp === 0
        return {
          ...state,
          battle: {
            ...state.battle,
            monster: { ...state.battle.monster, hp: newMonsterHp },
            battleLog: newBattleLog,
            isVictory,
          },
        }
      } else {
        const newPlayerHp = Math.max(0, state.battle.player.hp - 10)
        const isDefeat = newPlayerHp === 0
        return {
          ...state,
          battle: {
            ...state.battle,
            player: { ...state.battle.player, hp: newPlayerHp },
            battleLog: newBattleLog,
            isDefeat,
          },
        }
      }
    }

    case 'END_BATTLE':
      return {
        ...state,
        gamePhase: 'result',
        battle: state.battle
          ? { ...state.battle, isVictory: action.victory, isDefeat: !action.victory }
          : null,
      }

    case 'COMPLETE_OCEAN': {
      if (!state.currentOcean) return state
      const newCompletedOceans = [...state.completedOceans, state.currentOcean]
      const oceanOrder: OceanZone[] = ['east', 'west', 'south', 'north', 'mysterious']
      const currentIndex = oceanOrder.indexOf(state.currentOcean)
      const nextOcean = oceanOrder[currentIndex + 1]
      const newUnlockedOceans = nextOcean && !state.unlockedOceans.includes(nextOcean)
        ? [...state.unlockedOceans, nextOcean]
        : state.unlockedOceans
      return {
        ...state,
        completedOceans: newCompletedOceans,
        unlockedOceans: newUnlockedOceans,
        gamePhase: 'world_map',
        battle: null,
      }
    }

    case 'GAME_OVER':
      return {
        ...initialState,
        gamePhase: 'game_over',
      }

    case 'RESET_GAME':
      return initialState

    default:
      return state
  }
}

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
