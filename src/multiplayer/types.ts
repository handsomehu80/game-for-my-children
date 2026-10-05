// src/multiplayer/types.ts
// Multiplayer-specific type definitions based on design doc

import type { Question } from '../game/types'

// ==================== WebSocket Message ====================

export interface WSMessage<T = unknown> {
  type: string
  roomId: string
  playerId: string
  payload: T
  timestamp: number
  seq: number
}

// ==================== Room Types ====================

export type RoomStatus = 'waiting' | 'ready' | 'battle' | 'finished'

export interface RoomPlayer {
  id: string
  name: string
  grade: number
  avatar?: string
  isReady: boolean
  isConnected: boolean
  isHost: boolean
  reconnectToken?: string
}

export interface RoomSettings {
  maxPlayers: 2 | 3 | 4
  questionCount: number
  timePerQuestion: number
  grade: number
}

export interface Room {
  id: string
  hostId: string
  players: RoomPlayer[]
  status: RoomStatus
  settings: RoomSettings
  battle: BattleRoomState | null
  createdAt: number
  lastActivityAt: number
}

export interface BattleRoomState {
  questionIndex: number
  totalQuestions: number
  monsterHP: number
  teamHP: number
  scores: Record<string, number>
  currentQuestion: Question | null
  phase: BattlePhase
  results: AnswerResult[]
}

export type BattlePhase = 'waiting' | 'question' | 'answering' | 'result' | 'ended'

export interface AnswerResult {
  playerId: string
  isCorrect: boolean
  answerIndex: number
  timeUsed: number
}

// ==================== Reconnect Types ====================

export interface ReconnectToken {
  playerId: string
  roomId: string
  token: string
  expiresAt: number
}

export interface ReconnectState {
  battle: {
    questionIndex: number
    monsterHP: number
    teamHP: number
    scores: Record<string, number>
    currentQuestion: Question | null
    phase: BattlePhase
  }
  room: {
    players: RoomPlayer[]
    status: RoomStatus
  }
}

// ==================== Match Types ====================

export interface MatchQueueEntry {
  playerId: string
  grade: number
  joinedAt: number
}

// ==================== Connection State ====================

export type ConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'error'

// ==================== UI State ====================

export interface MultiplayerUIState {
  phase: 'lobby' | 'room' | 'matchmaking' | 'battle' | 'result'
  room: Room | null
  error: string | null
  reconnecting: boolean
}
