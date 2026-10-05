// src/multiplayer/socket.ts
// Socket.IO client singleton based on design doc Section 3

import { io, Socket } from 'socket.io-client'

// Socket.IO server URL - configurable via environment
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

// Heartbeat configuration from design doc: ping every 15s, 45s timeout
const HEARTBEAT_INTERVAL = 15000
const HEARTBEAT_TIMEOUT = 45000

// Reconnection settings from design doc: exponential backoff
const RECONNECT_BASE_DELAY = 1000
const RECONNECT_MAX_DELAY = 32000

// Type for server events (subset for connection management)
type ServerToClientEvents = {
  'room:state': (data: any) => void
  'room:created': (data: any) => void
  'room:joined': (data: any) => void
  'room:error': (data: any) => void
  'match:found': (data: any) => void
  'match:error': (data: any) => void
  'battle:start': (data: any) => void
  'battle:question': (data: any) => void
  'battle:result': (data: any) => void
  'battle:sync': (data: any) => void
  'battle:end': (data: any) => void
  'player:disconnect': (data: any) => void
  'player:reconnected': (data: any) => void
  'error': (data: any) => void
}

// Type for client events
type ClientToServerEvents = {
  'room:create': (data: any) => void
  'room:join': (data: any) => void
  'room:leave': () => void
  'room:start': () => void
  'player:ready': (data: any) => void
  'player:reconnect': (data: any) => void
  'match:find': (data: any) => void
  'match:cancel': () => void
  'battle:answer': (data: any) => void
}

class SocketClient {
  private static instance: SocketClient | null = null
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null
  private reconnectAttempts = 0
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private heartbeatTimeoutTimer: ReturnType<typeof setTimeout> | null = null
  private lastPingTimestamp: number = 0
  private messageSeq: number = 0

  private constructor() {}

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient()
    }
    return SocketClient.instance
  }

  // Connect to Socket.IO server
  connect(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: RECONNECT_BASE_DELAY,
      reconnectionDelayMax: RECONNECT_MAX_DELAY,
      reconnectionAttempts: Infinity,
      timeout: HEARTBEAT_TIMEOUT,
      autoConnect: true,
    })

    this.setupHeartbeat()
    this.setupEventHandlers()

    return this.socket
  }

  // Disconnect from server
  disconnect(): void {
    this.clearHeartbeat()
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    SocketClient.instance = null
  }

  // Get current socket instance
  getSocket(): Socket<ServerToClientEvents, ClientToServerEvents> | null {
    return this.socket
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  // Get estimated round-trip time
  getRTT(): number {
    return Date.now() - this.lastPingTimestamp
  }

  // Get next message sequence number
  nextSeq(): number {
    return ++this.messageSeq
  }

  // Emit event to server
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, data?: any): void {
    if (!this.socket?.connected) {
      console.warn(`[Socket] Cannot emit ${event}: not connected`)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.socket as any).emit(event, data)
  }

  // Listen to event from server
  on<K extends keyof ServerToClientEvents>(
    event: K,
    handler: ServerToClientEvents[K]
  ): void {
    if (this.socket) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.socket as any).on(event, handler)
    }
  }

  // Remove event listener
  off<K extends keyof ServerToClientEvents>(
    event: K,
    handler?: ServerToClientEvents[K]
  ): void {
    if (this.socket) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.socket as any).off(event, handler)
    }
  }

  // Private: Setup heartbeat mechanism
  private setupHeartbeat(): void {
    this.clearHeartbeat()

    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.connected) {
        this.lastPingTimestamp = Date.now()
        // Ping server to measure RTT
        this.socket.emit('ping' as any, { timestamp: this.lastPingTimestamp })

        // Set timeout for pong response
        this.heartbeatTimeoutTimer = setTimeout(() => {
          console.warn('[Socket] Heartbeat timeout, connection may be dead')
        }, HEARTBEAT_TIMEOUT)
      }
    }, HEARTBEAT_INTERVAL)
  }

  private clearHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  // Private: Setup Socket.IO event handlers
  private setupEventHandlers(): void {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket?.id)
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
      this.clearHeartbeat()
    })

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message)
      this.reconnectAttempts++
    })
  }
}

// Export singleton getter
export const getSocketClient = (): SocketClient => SocketClient.getInstance()

// Export typed socket hook helper
export const getSocket = (): Socket<ServerToClientEvents, ClientToServerEvents> | null =>
  SocketClient.getInstance().getSocket()

// Export connection status check
export const isSocketConnected = (): boolean => SocketClient.getInstance().isConnected()
