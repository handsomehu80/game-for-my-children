import { create } from 'zustand'
import type { GameState, GameAction, BattlePhase } from '../game/types'

const initialState: GameState = {
  gamePhase: 'title',
  currentOcean: null,
  players: [],
  unlockedOceans: ['east'],
  completedOceans: [],
  battle: null,
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
          phase: 'showing_question' as BattlePhase,
          player: state.players[0],
          monster: action.monster,
          currentQuestion: action.question,
          comboCount: 0,
          isPlayerTurn: true,
          battleLog: [],
          activeSkills: [],
        },
      }

    case 'ANSWER_QUESTION': {
      if (!state.battle || !state.battle.currentQuestion) return state
      const question = state.battle.currentQuestion
      const isCorrect = question.options[action.answerIndex]?.isCorrect ?? false

      const newBattleLog = [
        ...state.battle.battleLog,
        {
          type: isCorrect ? 'correct' : 'wrong',
          message: isCorrect ? '回答正确！' : '回答错误！',
          timestamp: Date.now(),
        },
      ]

      if (isCorrect) {
        const newMonsterHp = Math.max(0, state.battle.monster.hp - 20)
        const newCombo = state.battle.comboCount + 1
        const isVictory = newMonsterHp === 0
        return {
          ...state,
          battle: {
            ...state.battle,
            monster: { ...state.battle.monster, hp: newMonsterHp },
            comboCount: newCombo,
            battleLog: newBattleLog,
            phase: isVictory ? 'victory' : state.battle.phase,
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
            comboCount: 0,
            battleLog: newBattleLog,
            phase: isDefeat ? 'defeat' : state.battle.phase,
          },
        }
      }
    }

    // 注意: Phase 1 ANSWER_QUESTION 只支持单选题 (answerIndex: number)
    // Phase 3 将扩展为支持多选题 (answerIndices: number[]) 和 fill 类型

    case 'END_BATTLE':
      return {
        ...state,
        gamePhase: 'result',
        battle: state.battle
          ? { ...state.battle, phase: action.victory ? 'victory' : 'defeat' }
          : null,
      }

    case 'COMPLETE_OCEAN': {
      if (!state.currentOcean) return state
      const newCompletedOceans = [...state.completedOceans, state.currentOcean]
      const oceanOrder = ['east', 'west', 'south', 'north', 'mysterious'] as const
      const currentIndex = oceanOrder.indexOf(state.currentOcean as typeof oceanOrder[number])
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

interface GameStore extends GameState {
  dispatch: (action: GameAction) => void
}

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,
  dispatch: (action) => set((state) => gameReducer(state, action)),
}))