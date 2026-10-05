// src/multiplayer/useMultiplayer.ts
// React Hook: Multiplayer state management

import { useEffect, useCallback } from 'react'
import { getSocketClient } from './socket'
import { useMultiplayerStore } from './multiplayerStore'
import type { Room } from './types'
import type {
  RoomCreatePayload,
  RoomJoinPayload,
  MatchFindPayload,
} from './events'

export function useMultiplayer() {
  const socketClient = getSocketClient()

  const {
    connectionStatus,
    playerId,
    currentRoom,
    isHost,
    error,
    uiPhase,
    setConnectionStatus,
    setPlayer,
    setReconnectToken,
    setRoom,
    setIsHost,
    setError,
    setUIPhase,
    reset,
  } = useMultiplayerStore()

  // Setup socket event listeners
  useEffect(() => {
    const socket = socketClient.connect()
    setConnectionStatus('connecting')

    // Connection events
    socket.on('connect', () => {
      setConnectionStatus('connected')
    })

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected')
    })

    // Room events
    socket.on('room:state', (data: { room: Room }) => {
      setRoom(data.room)
      setError(null)
    })

    socket.on('room:created', (data) => {
      setRoom(data.room)
      setPlayer(data.player.id, data.player.name)
      setReconnectToken({
        playerId: data.player.id,
        roomId: data.room.id,
        token: data.reconnectToken,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      })
      setIsHost(true)
      setUIPhase('room')
      setError(null)
    })

    socket.on('room:joined', (data) => {
      setRoom(data.room)
      setPlayer(data.player.id, data.player.name)
      setReconnectToken({
        playerId: data.player.id,
        roomId: data.room.id,
        token: data.reconnectToken,
        expiresAt: Date.now() + 5 * 60 * 1000,
      })
      setIsHost(data.room.hostId === data.player.id)
      setUIPhase('room')
      setError(null)
    })

    socket.on('room:error', (data) => {
      const errorMessages: Record<string, string> = {
        ROOM_NOT_FOUND: '房间不存在',
        ROOM_FULL: '房间已满',
        ALREADY_STARTED: '游戏已开始',
        ALREADY_IN_ROOM: '已在其他房间中',
      }
      setError(errorMessages[data.error] || '加入房间失败')
    })

    socket.on('match:found', (data) => {
      setRoom(data.room)
      setPlayer(data.player.id, data.player.name)
      setReconnectToken({
        playerId: data.player.id,
        roomId: data.room.id,
        token: data.reconnectToken,
        expiresAt: Date.now() + 5 * 60 * 1000,
      })
      setIsHost(data.room.hostId === data.player.id)
      setUIPhase('room')
      setError(null)
    })

    socket.on('match:error', (data) => {
      setError(data.message || '匹配失败')
      setUIPhase('lobby')
    })

    socket.on('player:disconnect', (data) => {
      const { currentRoom: room } = useMultiplayerStore.getState()
      if (room) {
        const updatedPlayers = room.players.map((p) =>
          p.id === data.playerId ? { ...p, isConnected: false } : p
        )
        setRoom({ ...room, players: updatedPlayers })
      }
    })

    socket.on('player:reconnected', (data) => {
      const { currentRoom: room } = useMultiplayerStore.getState()
      if (room) {
        const updatedPlayers = room.players.map((p) =>
          p.id === data.playerId ? { ...p, isConnected: true } : p
        )
        setRoom({ ...room, players: updatedPlayers })
      }
    })

    socket.on('error', (data) => {
      setError(data.message || '发生错误')
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('room:state')
      socket.off('room:created')
      socket.off('room:joined')
      socket.off('room:error')
      socket.off('match:found')
      socket.off('match:error')
      socket.off('player:disconnect')
      socket.off('player:reconnected')
      socket.off('error')
    }
  }, [socketClient, setConnectionStatus, setPlayer, setReconnectToken, setRoom, setIsHost, setError, setUIPhase])

  // Create a new room
  const createRoom = useCallback(
    (payload: RoomCreatePayload) => {
      if (!socketClient.isConnected()) {
        setError('未连接到服务器')
        return
      }
      socketClient.emit('room:create', payload)
    },
    [socketClient, setError]
  )

  // Join an existing room
  const joinRoom = useCallback(
    (payload: RoomJoinPayload) => {
      if (!socketClient.isConnected()) {
        setError('未连接到服务器')
        return
      }
      socketClient.emit('room:join', payload)
    },
    [socketClient, setError]
  )

  // Leave current room
  const leaveRoom = useCallback(() => {
    socketClient.emit('room:leave')
    setRoom(null)
    setIsHost(false)
    setUIPhase('lobby')
  }, [socketClient, setRoom, setIsHost, setUIPhase])

  // Start battle (host only)
  const startBattle = useCallback(() => {
    socketClient.emit('room:start')
  }, [socketClient])

  // Toggle ready state
  const toggleReady = useCallback(() => {
    const state = useMultiplayerStore.getState()
    const player = state.currentRoom?.players.find((p) => p.id === state.playerId)
    if (player) {
      socketClient.emit('player:ready', { ready: !player.isReady })
    }
  }, [socketClient])

  // Find match
  const findMatch = useCallback(
    (payload: MatchFindPayload) => {
      if (!socketClient.isConnected()) {
        setError('未连接到服务器')
        return
      }
      setUIPhase('matchmaking')
      socketClient.emit('match:find', payload)
    },
    [socketClient, setError, setUIPhase]
  )

  // Cancel match
  const cancelMatch = useCallback(() => {
    socketClient.emit('match:cancel')
    setUIPhase('lobby')
  }, [socketClient, setUIPhase])

  // Disconnect
  const disconnect = useCallback(() => {
    socketClient.disconnect()
    reset()
  }, [socketClient, reset])

  return {
    // State
    connectionStatus,
    playerId,
    playerName: useMultiplayerStore((s) => s.playerName),
    currentRoom,
    isHost,
    error,
    uiPhase,

    // Actions
    createRoom,
    joinRoom,
    leaveRoom,
    startBattle,
    toggleReady,
    findMatch,
    cancelMatch,
    disconnect,
  }
}
