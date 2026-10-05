// src/multiplayer/useReconnect.ts
// React Hook: Reconnection handling based on design doc Section 7

import { useState, useEffect, useCallback, useRef } from 'react'
import { getSocketClient } from './socket'
import { useMultiplayerStore } from './multiplayerStore'

// Reconnection delays (exponential backoff) from design doc - reserved for future auto-reconnect
// const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000, 32000]

export function useReconnect() {
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [reconnectAttempt, setReconnectAttempt] = useState(0)
  const [showReconnectDialog, setShowReconnectDialog] = useState(false)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { reconnectToken, setConnectionStatus } = useMultiplayerStore()
  const socketClient = getSocketClient()

  // Start reconnection process
  const startReconnect = useCallback(() => {
    if (!reconnectToken) return

    setIsReconnecting(true)
    setShowReconnectDialog(true)
    setReconnectAttempt(0)

    attemptReconnect()
  }, [reconnectToken])

  // Attempt to reconnect with exponential backoff
  const attemptReconnect = useCallback(() => {
    if (!reconnectToken) {
      setIsReconnecting(false)
      setShowReconnectDialog(false)
      return
    }

    const socket = socketClient.connect()
    setConnectionStatus('reconnecting')

    socket.on('connect', () => {
      // Send reconnect event with token
      socketClient.emit('player:reconnect', {
        playerId: reconnectToken.playerId,
        roomId: reconnectToken.roomId,
        reconnectToken: reconnectToken.token,
      })
    })

    socket.on('player:reconnected', () => {
      setIsReconnecting(false)
      setShowReconnectDialog(false)
      setReconnectAttempt(0)
      setConnectionStatus('connected')
    })

    socket.on('room:error', (data) => {
      // Reconnect failed - token expired or room no longer exists
      console.error('[Reconnect] Failed:', data)
      setIsReconnecting(false)
      setShowReconnectDialog(false)
      setConnectionStatus('disconnected')
      // Clear reconnect token
      useMultiplayerStore.getState().setReconnectToken(null)
    })

    // If connected, trigger reconnect immediately
    if (socket.connected) {
      socketClient.emit('player:reconnect', {
        playerId: reconnectToken.playerId,
        roomId: reconnectToken.roomId,
        reconnectToken: reconnectToken.token,
      })
    }
  }, [reconnectToken, socketClient, setConnectionStatus])

  // Note: scheduleReconnect reserved for future auto-reconnect feature
  // Currently using manual reconnection via startReconnect

  // Cancel reconnection
  const cancelReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    setIsReconnecting(false)
    setShowReconnectDialog(false)
    setReconnectAttempt(0)
  }, [])

  // Auto-start reconnection when token exists and connection is lost
  useEffect(() => {
    const token = useMultiplayerStore.getState().reconnectToken
    const status = useMultiplayerStore.getState().connectionStatus

    if (token && status === 'disconnected') {
      startReconnect()
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [startReconnect])

  // Listen for disconnect events to trigger reconnection
  useEffect(() => {
    const socket = socketClient.connect()

    const handleDisconnect = () => {
      const token = useMultiplayerStore.getState().reconnectToken
      if (token) {
        startReconnect()
      }
    }

    socket.on('disconnect', handleDisconnect)

    return () => {
      socket.off('disconnect', handleDisconnect)
    }
  }, [socketClient, startReconnect])

  return {
    isReconnecting,
    reconnectAttempt,
    showReconnectDialog,
    cancelReconnect,
  }
}
