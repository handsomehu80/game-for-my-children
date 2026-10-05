// src/multiplayer/events.ts
// Socket.IO event type definitions based on design doc

import type { Room, RoomPlayer, RoomSettings, BattleRoomState, ReconnectState } from './types'
import type { Question } from '../game/types'

// ==================== Room Events ====================

export interface RoomCreatePayload {
  playerName: string
  grade: number
  settings?: Partial<RoomSettings>
}

export interface RoomCreateResponse {
  room: Room
  player: RoomPlayer
  reconnectToken: string
}

export interface RoomJoinPayload {
  roomId: string
  playerName: string
  grade: number
}

export interface RoomJoinResponse {
  room: Room
  player: RoomPlayer
  reconnectToken: string
}

export interface RoomStatePayload {
  room: Room
}

export interface RoomErrorPayload {
  error: 'ROOM_NOT_FOUND' | 'ROOM_FULL' | 'ALREADY_STARTED' | 'ALREADY_IN_ROOM'
}

// ==================== Match Events ====================

export interface MatchFindPayload {
  grade: number
}

export interface MatchFoundPayload {
  room: Room
  player: RoomPlayer
  reconnectToken: string
}

// ==================== Battle Events ====================

export interface BattleStartPayload {
  room: Room
  battle: BattleRoomState
}

export interface BattleQuestionPayload {
  questionIndex: number
  totalQuestions: number
  question: Question
  startTime: number
  timeLimit: number
}

export interface BattleAnswerPayload {
  questionIndex: number
  answerIndex: number
  clientTimestamp: number
}

export interface BattleResultPayload {
  questionIndex: number
  results: Array<{
    playerId: string
    isCorrect: boolean
    answerIndex: number
    timeUsed: number
  }>
  monsterHP: number
  teamHP: number
  scores: Record<string, number>
}

export interface BattleSyncPayload {
  battle: BattleRoomState
}

export interface BattleEndPayload {
  result: 'victory' | 'defeat'
  finalScores: Record<string, number>
}

// ==================== Player Events ====================

export interface PlayerReadyPayload {
  ready: boolean
}

export interface PlayerReconnectPayload {
  playerId: string
  roomId: string
  reconnectToken: string
}

export interface PlayerReconnectResponse {
  success: boolean
  state?: ReconnectState
  error?: string
}

export interface PlayerDisconnectPayload {
  playerId: string
}

// ==================== Error Event ====================

export interface ErrorPayload {
  code: string
  message: string
}

// ==================== All Server Events ====================

export interface ServerEvents {
  'room:state': (payload: RoomStatePayload) => void
  'room:created': (payload: RoomCreateResponse) => void
  'room:joined': (payload: RoomJoinResponse) => void
  'room:error': (payload: RoomErrorPayload) => void
  'match:found': (payload: MatchFoundPayload) => void
  'match:error': (payload: ErrorPayload) => void
  'battle:start': (payload: BattleStartPayload) => void
  'battle:question': (payload: BattleQuestionPayload) => void
  'battle:result': (payload: BattleResultPayload) => void
  'battle:sync': (payload: BattleSyncPayload) => void
  'battle:end': (payload: BattleEndPayload) => void
  'player:disconnect': (payload: PlayerDisconnectPayload) => void
  'player:reconnected': (payload: { playerId: string }) => void
  'error': (payload: ErrorPayload) => void
}

// ==================== All Client Events ====================

export interface ClientEvents {
  'room:create': (payload: RoomCreatePayload) => void
  'room:join': (payload: RoomJoinPayload) => void
  'room:leave': () => void
  'room:start': () => void
  'player:ready': (payload: PlayerReadyPayload) => void
  'player:reconnect': (payload: PlayerReconnectPayload) => void
  'match:find': (payload: MatchFindPayload) => void
  'match:cancel': () => void
  'battle:answer': (payload: BattleAnswerPayload) => void
}
