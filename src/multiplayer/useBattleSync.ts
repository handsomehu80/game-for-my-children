// src/multiplayer/useBattleSync.ts
// React Hook: Battle synchronization from server

import { useEffect, useCallback } from 'react'
import { getSocketClient } from './socket'
import { useMultiplayerStore } from './multiplayerStore'
import { useGameStore } from '../store/gameStore'
import type { BattleRoomState } from './types'
import type { BattleResultPayload } from './events'
import type { Question } from '../game/types'

export function useBattleSync() {
  const socketClient = getSocketClient()

  const {
    currentRoom,
    battleState,
    setBattleState,
    setBattleResult,
    setUIPhase,
  } = useMultiplayerStore()

  const dispatch = useGameStore((s) => s.dispatch)

  // Setup battle event listeners
  useEffect(() => {
    const socket = socketClient.connect()

    // Battle starts
    socket.on('battle:start', (data: { room: { players: Array<{ id: string; name: string; grade: number }> }; battle: BattleRoomState }) => {
      const { room, battle } = data
      setBattleState(battle)
      setUIPhase('battle')

      dispatch({
        type: 'START_BATTLE',
        monster: {
          id: 'multiplayer-boss',
          name: '知识Boss',
          hp: battle.monsterHP,
          maxHp: battle.monsterHP + 20,
          sprite: '👹',
        },
        question: battle.currentQuestion as Question,
        players: room.players.map((p) => ({
          id: p.id,
          name: p.name,
          grade: p.grade,
        })),
        currentPlayerIndex: 0,
      })
    })

    // New question arrives
    socket.on('battle:question', (data: { questionIndex: number; totalQuestions: number; question: Question }) => {
      const { questionIndex, totalQuestions, question } = data
      setBattleState({
        questionIndex,
        totalQuestions,
        currentQuestion: question,
        phase: 'question',
      } as BattleRoomState)
    })

    // Answer result
    socket.on('battle:result', (data: BattleResultPayload) => {
      const { results, monsterHP, teamHP, scores } = data
      const state = useMultiplayerStore.getState()

      const newBattleState: BattleRoomState = {
        monsterHP,
        teamHP,
        scores,
        results: results.map((r) => ({
          playerId: r.playerId,
          isCorrect: r.isCorrect,
          answerIndex: r.answerIndex,
          timeUsed: r.timeUsed,
        })),
        phase: 'result',
        questionIndex: state.battleState?.questionIndex ?? 0,
        totalQuestions: state.battleState?.totalQuestions ?? 0,
        currentQuestion: state.battleState?.currentQuestion ?? null,
      }

      setBattleState(newBattleState)

      // Update game store with results
      const currentPlayerId = state.playerId
      const myResult = results.find((r) => r.playerId === currentPlayerId)

      if (myResult) {
        dispatch({ type: 'ANSWER_QUESTION', answerIndex: myResult.answerIndex })
      }
    })

    // Battle sync (catch-up state)
    socket.on('battle:sync', (data: { battle: BattleRoomState }) => {
      const { battle } = data
      setBattleState(battle)
    })

    // Battle ends
    socket.on('battle:end', (data: { result: 'victory' | 'defeat' }) => {
      const { result } = data
      setBattleResult(result)
      setUIPhase('result')

      dispatch({
        type: 'END_BATTLE',
        victory: result === 'victory',
      })
    })

    return () => {
      socket.off('battle:start')
      socket.off('battle:question')
      socket.off('battle:result')
      socket.off('battle:sync')
      socket.off('battle:end')
    }
  }, [socketClient, dispatch, setBattleState, setBattleResult, setUIPhase])

  // Submit answer to server
  const submitAnswer = useCallback(
    (answerIndex: number, clientTimestamp: number) => {
      const state = useMultiplayerStore.getState()
      if (!state.battleState) return

      socketClient.emit('battle:answer', {
        questionIndex: state.battleState.questionIndex,
        answerIndex,
        clientTimestamp,
      })
    },
    [socketClient]
  )

  return {
    battleState,
    currentRoom,
    submitAnswer,
  }
}
