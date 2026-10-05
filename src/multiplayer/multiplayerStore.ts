// src/multiplayer/multiplayerStore.ts
// Zustand store for multiplayer state

import { create } from 'zustand'
import type {
  Room,
  RoomPlayer,
  ConnectionStatus,
  ReconnectToken,
} from './types'

interface MultiplayerState {
  // Connection
  connectionStatus: ConnectionStatus
  playerId: string | null
  playerName: string | null
  reconnectToken: ReconnectToken | null

  // Room
  currentRoom: Room | null
  isHost: boolean
  error: string | null

  // UI State
  uiPhase: 'lobby' | 'room' | 'matchmaking' | 'battle' | 'result'

  // Battle state (synced from server)
  battleState: import('./types').BattleRoomState | null
  battleResult: 'victory' | 'defeat' | null

  // Actions
  setConnectionStatus: (status: ConnectionStatus) => void
  setPlayer: (id: string, name: string) => void
  setReconnectToken: (token: ReconnectToken | null) => void
  setRoom: (room: Room | null) => void
  updateRoom: (room: Partial<Room>) => void
  setIsHost: (isHost: boolean) => void
  setError: (error: string | null) => void
  setUIPhase: (phase: 'lobby' | 'room' | 'matchmaking' | 'battle' | 'result') => void
  setBattleState: (state: import('./types').BattleRoomState | null) => void
  updateBattleState: (state: Partial<import('./types').BattleRoomState>) => void
  setBattleResult: (result: 'victory' | 'defeat' | null) => void
  updatePlayerReady: (playerId: string, isReady: boolean) => void
  updatePlayerConnected: (playerId: string, isConnected: boolean) => void
  leaveRoom: () => void
  toggleReady: () => void
  startBattle: () => void
  reset: () => void
}

const initialState = {
  connectionStatus: 'disconnected' as ConnectionStatus,
  playerId: null,
  playerName: null,
  reconnectToken: null,
  currentRoom: null,
  isHost: false,
  error: null,
  uiPhase: 'lobby' as const,
  battleState: null,
  battleResult: null,
}

export const useMultiplayerStore = create<MultiplayerState>((set) => ({
  ...initialState,

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setPlayer: (id, name) => set({ playerId: id, playerName: name }),

  setReconnectToken: (token) => set({ reconnectToken: token }),

  setRoom: (room) => set({ currentRoom: room, error: null }),

  updateRoom: (roomUpdate) =>
    set((state) => ({
      currentRoom: state.currentRoom
        ? { ...state.currentRoom, ...roomUpdate }
        : null,
    })),

  setIsHost: (isHost) => set({ isHost }),

  setError: (error) => set({ error }),

  setUIPhase: (phase) => set({ uiPhase: phase }),

  setBattleState: (state) => set({ battleState: state }),

  updateBattleState: (stateUpdate) =>
    set((state) => ({
      battleState: state.battleState
        ? { ...state.battleState, ...stateUpdate }
        : null,
    })),

  setBattleResult: (result) => set({ battleResult: result }),

  updatePlayerReady: (playerId, isReady) =>
    set((state) => {
      if (!state.currentRoom) return state
      const players = state.currentRoom.players.map((p) =>
        p.id === playerId ? { ...p, isReady } : p
      )
      return {
        currentRoom: { ...state.currentRoom, players },
      }
    }),

  updatePlayerConnected: (playerId, isConnected) =>
    set((state) => {
      if (!state.currentRoom) return state
      const players = state.currentRoom.players.map((p) =>
        p.id === playerId ? { ...p, isConnected } : p
      )
      return {
        currentRoom: { ...state.currentRoom, players },
      }
    }),

  leaveRoom: () => set({ currentRoom: null, isHost: false, uiPhase: 'lobby' }),

  toggleReady: () =>
    set((state) => {
      if (!state.currentRoom || !state.playerId) return state
      const player = state.currentRoom.players.find((p) => p.id === state.playerId)
      if (!player || player.isHost) return state
      const players = state.currentRoom.players.map((p) =>
        p.id === state.playerId ? { ...p, isReady: !p.isReady } : p
      )
      return {
        currentRoom: { ...state.currentRoom, players },
      }
    }),

  startBattle: () =>
    set((state) => {
      if (!state.currentRoom) return state
      return {
        currentRoom: { ...state.currentRoom, status: 'battle' },
        uiPhase: 'battle',
      }
    }),

  reset: () => set(initialState),
}))

// Selectors
export const selectIsInRoom = (state: MultiplayerState): boolean =>
  state.currentRoom !== null

export const selectIsHost = (state: MultiplayerState): boolean =>
  state.isHost

export const selectOtherPlayers = (state: MultiplayerState): RoomPlayer[] => {
  if (!state.currentRoom) return []
  return state.currentRoom.players.filter((p) => p.id !== state.playerId)
}

export const selectAllPlayersReady = (state: MultiplayerState): boolean => {
  if (!state.currentRoom) return false
  return state.currentRoom.players.every((p) => p.isReady || p.isHost)
}

export const selectCanStartBattle = (state: MultiplayerState): boolean => {
  if (!state.currentRoom) return false
  const { players, status } = state.currentRoom
  if (status !== 'waiting') return false
  if (players.length < 2) return false
  // All non-host players must be ready
  const nonHostReady = players
    .filter((p) => !p.isHost)
    .every((p) => p.isReady)
  return nonHostReady && players.length >= 2
}
