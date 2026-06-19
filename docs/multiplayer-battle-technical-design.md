# 多人联机对战功能 - 技术设计文档

## 1. 项目现状分析

### 1.1 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | React | 18.3.1 |
| 构建工具 | Vite | 6.0.5 |
| 3D渲染 | React-Three-Fiber | 8.18.0 |
| 状态管理 | Zustand | 5.0.12 |
| 游戏类型 | TypeScript | 5.6.2 |
| 测试框架 | Vitest | 2.1.8 |

### 1.2 现有架构概览

```
┌─────────────────────────────────────────────────────┐
│                    React UI Layer                    │
│  TitleScreen | WorldMap | ExplorationMap | Battle  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              GameStore (Zustand)                     │
│  - gamePhase: title→world_map→exploration→battle  │
│  - players[], battle, exploration, unlockedOceans  │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Core Game Logic (src/game/)            │
│  ExplorationStateMachine.ts  - 探索状态机           │
│  QuestionSelector.ts          - 题目选择器          │
│  DifficultyManager.ts         - 难度管理            │
│  types.ts                     - 类型定义            │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Data Layer (src/data/)                 │
│  areas/ | monsters/ | questions/ | oceans/         │
└─────────────────────────────────────────────────────┘
```

### 1.3 现有战斗流程（单机版）

```
START_BATTLE → showing_question → answering → animating_damage
     ↑                                                     ↓
     └──────────────── NEXT_QUESTION ←────────────────────┘
                            ↓
              (victory: END_BATTLE → result)
```

**战斗核心逻辑**（位于 `gameStore.ts`）:
- `START_BATTLE`: 初始化战斗状态，包含 players[]、currentPlayerIndex、teamHP
- `ANSWER_QUESTION`: 答对 monster HP-20，答错 teamHP-10
- `NEXT_QUESTION`: 切换 currentPlayerIndex（双人模式在0/1之间轮换）
- `END_BATTLE`: 判定胜负

### 1.4 现有网络代码

**无现有网络代码**，但 UI 层已有预留：
- `Battle.tsx` 第214-225行：多人模式 UI 组件（`CurrentTurnIndicator`、`PlayerStatus`）
- `gameHelpers.ts`：`isMultiplayer()`、`getNextPlayerIndex()` 等辅助函数

### 1.5 关键数据类型

```typescript
// 战斗状态（已支持多人）
interface BattleState {
  phase: BattlePhase
  player: Player           // 当前玩家（兼容旧版）
  players: BattlePlayer[]  // 参战玩家列表
  currentPlayerIndex: number  // 0=玩家1, 1=玩家2
  teamHP: number           // 队伍共享HP
  monster: Monster
  currentQuestion: Question | null
  comboCount: number
  usedQuestionIds: string[]
}

// 游戏动作（需要扩展）
type GameAction =
  | { type: 'START_BATTLE'; monster; question; players; currentPlayerIndex? }
  | { type: 'ANSWER_QUESTION'; answerIndex }
  | { type: 'NEXT_QUESTION' }
  | { type: 'END_BATTLE'; victory }
  // 多人模式新增动作
  | { type: 'PLAYER_READY'; playerId }
  | { type: 'SYNC_STATE'; state: Partial<GameState> }
```

---

## 2. 多人联机对战架构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         Game Clients                             │
│  ┌──────────────┐    WebSocket    ┌──────────────┐              │
│  │  Client A    │◄──────────────►│  Client B    │              │
│  │  (玩家1)     │   Room Server   │  (玩家2)     │              │
│  └──────┬───────┘                 └──────┬───────┘              │
│         │                                │                       │
│  Zustand Store ◄──────────────────────► Zustand Store           │
│  (本地状态)     状态同步后           (本地状态)                   │
└─────────┼──────────────────────────────────────┼────────────────┘
          │                                      │
          │         ┌───────────────┐           │
          └────────►│  Game Server  │◄──────────┘
                    │  (房间+状态)  │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │  Redis/内存   │
                    │  (房间存储)   │
                    └───────────────┘
```

### 2.2 架构分层

| 层级 | 职责 | 文件位置 |
|------|------|----------|
| **网络层** | WebSocket 连接管理、心跳、重连 | `src/network/` |
| **房间层** | 房间创建、加入、离开、成员管理 | `src/multiplayer/Room.ts` |
| **同步层** | 游戏状态序列化、反序列化、同步策略 | `src/multiplayer/SyncEngine.ts` |
| **业务层** | 战斗逻辑扩展、动作扩展 | `src/multiplayer/MultiplayerBattle.ts` |
| **适配层** | 适配现有 gameStore，统一本地/远程接口 | `src/multiplayer/GameStoreAdapter.ts` |

### 2.3 目录结构

```
src/
├── multiplayer/                    # 多人联机新增模块
│   ├── types.ts                    # 多人模式类型定义
│   ├── constants.ts                # 协议常量（心跳间隔、超时等）
│   ├── Room.ts                     # 房间类（创建/加入/离开/成员）
│   ├── SyncEngine.ts               # 状态同步引擎
│   ├── GameStoreAdapter.ts         # gameStore 适配器
│   ├── MultiplayerBattle.ts        # 多人战斗业务逻辑
│   ├── protocol/                   # 通信协议
│   │   ├── ClientMessage.ts        # 客户端→服务器消息
│   │   └── ServerMessage.ts        # 服务器→客户端消息
│   └── hooks/
│       ├── useMultiplayer.ts       # 多人模式主 hook
│       ├── useRoom.ts              # 房间管理 hook
│       └── useSync.ts              # 同步状态 hook
├── network/
│   ├── WebSocketClient.ts          # WebSocket 客户端封装
│   ├── ReconnectionManager.ts       # 断线重连管理
│   └── MessageQueue.ts             # 消息队列
├── components/
│   └── game/
│       ├── MultiplayerLobby.tsx    # 多人匹配大厅
│       ├── RoomBrowser.tsx          # 房间列表
│       └── Battle/
│           └── MultiplayerBattle.tsx  # 多人战斗界面
└── store/
    └── gameStore.ts                # 扩展以支持多人模式动作
```

---

## 3. WebSocket 房间系统设计

### 3.1 房间状态机

```
                                    ┌─────────────┐
                                    │   EMPTY     │ (无人)
                                    └──────┬──────┘
                                           │ create_room
                    ┌──────────────────────────────────┐
                    │                                  ▼
             ┌──────▼──────┐                   ┌─────────────┐
             │   WAITING   │◄──player_join─────│   WAITING  │ (房主等待)
             │  (1 player) │                   │ (n players) │
             └──────┬──────┘                   └──────┬──────┘
                    │ start_game                      │ start_game
                    ▼                                 ▼
             ┌─────────────┐                   ┌─────────────┐
             │ IN_PROGRESS │◄──player_join─────│ IN_PROGRESS │
             │ (battle已开始)│                  │ (battle已开始)│
             └──────┬──────┘                   └──────┬──────┘
                    │                                   │
                    │ end_game/timeout/all_left         │ end_game/timeout/all_left
                    ▼                                   ▼
             ┌─────────────────────────────────────────────┐
             │                  CLOSED                      │
             │              (房间销毁)                       │
             └─────────────────────────────────────────────┘
```

### 3.2 房间数据结构

```typescript
interface Room {
  id: string                     // 房间唯一ID (UUID)
  code: string                   // 简短邀请码 (6位数字字母)
  hostId: string                // 房主 playerId
  state: RoomState              // 'waiting' | 'in_progress' | 'closed'
  
  players: RoomPlayer[]          // 玩家列表
  
  // 战斗相关（开始战斗后填充）
  battle: RoomBattle | null
  
  // 房间元数据
  settings: RoomSettings
  
  createdAt: number
  lastActivityAt: number
}

interface RoomPlayer {
  playerId: string               // 客户端生成的临时ID
  name: string                   // 玩家名称
  grade: number                  // 年级
  avatar?: string                // 头像
  isReady: boolean               // 是否准备
  isHost: boolean                // 是否房主
  connected: boolean             // 连接状态
  lastPingAt: number             // 最后心跳时间
}

interface RoomSettings {
  maxPlayers: 2 | 4              // 最大玩家数（双人/四人）
  oceanId: string                // 战斗场景
  gradeRange?: [number, number]  // 年级范围限制
}

interface RoomBattle {
  battleId: string
  monsterId: string
  questionIds: string[]          // 已分发的问题ID
  currentQuestionIndex: number
  state: BattleState             // 快照（用于恢复）
}
```

### 3.3 房间生命周期

| 阶段 | 触发条件 | 房主操作 | 其他玩家操作 |
|------|----------|----------|--------------|
| **创建房间** | 玩家点击"创建房间" | 生成 roomCode，等待 | - |
| **等待加入** | 房间已创建 | 可取消/开始游戏 | 输入 roomCode 加入 |
| **开始游戏** | 房主点击"开始" | 同步所有人进入战斗 | 收到 start_game 事件 |
| **战斗中** | 进入 battle phase | - | - |
| **结束游戏** | 胜负已分 | 显示结果，房间关闭 | 收到 result 事件 |

### 3.4 房间容量设计

```
双人模式（默认）:
- Player A (房主) + Player B = 2人
- 战斗：两人轮流答题（当前玩家 currentPlayerIndex 轮换）

四人模式（扩展）:
- Player A/B/C/D = 4人
- 战斗：四人按顺序轮流（currentPlayerIndex: 0→1→2→3→0...）
- teamHP 由所有人共享
```

---

## 4. 客户端-服务器通信协议

### 4.1 消息格式

所有消息使用 JSON 格式：

```typescript
interface BaseMessage {
  type: string
  roomId: string
  playerId: string
  timestamp: number
  seq: number  // 消息序列号（用于排序和去重）
}
```

### 4.2 客户端 → 服务器消息

```typescript
// 1. 创建房间
interface CreateRoomRequest {
  type: 'CREATE_ROOM'
  playerName: string
  grade: number
  settings: RoomSettings
}

// 2. 加入房间
interface JoinRoomRequest {
  type: 'JOIN_ROOM'
  roomCode: string
  playerName: string
  grade: number
}

// 3. 离开房间
interface LeaveRoomRequest {
  type: 'LEAVE_ROOM'
  reason?: string
}

// 4. 准备/取消准备
interface PlayerReadyRequest {
  type: 'PLAYER_READY'
  ready: boolean
}

// 5. 房主开始游戏
interface StartGameRequest {
  type: 'START_GAME'
}

// 6. 回答问题（多人同步）
interface AnswerRequest {
  type: 'ANSWER'
  answerIndex: number
  clientTimestamp: number  // 客户端发送时间（用于延迟补偿）
}

// 7. 心跳
interface PingRequest {
  type: 'PING'
}
```

### 4.3 服务器 → 客户端消息

```typescript
// 1. 创建房间响应
interface CreateRoomResponse {
  type: 'ROOM_CREATED'
  room: Room
}

// 2. 加入房间成功
interface JoinRoomResponse {
  type: 'ROOM_JOINED'
  room: Room
  yourPlayerId: string
}

// 3. 玩家加入通知
interface PlayerJoinedNotification {
  type: 'PLAYER_JOINED'
  player: RoomPlayer
  room: Room  // 完整房间状态
}

// 4. 玩家离开通知
interface PlayerLeftNotification {
  type: 'PLAYER_LEFT'
  playerId: string
  reason: string
  room: Room
}

// 5. 玩家准备状态变化
interface PlayerReadyNotification {
  type: 'PLAYER_READY'
  playerId: string
  ready: boolean
}

// 6. 游戏开始
interface GameStartNotification {
  type: 'GAME_START'
  room: Room
  battleState: BattleState  // 初始战斗状态（包含所有玩家）
  firstQuestion: Question    // 第一道题
}

// 7. 问题开始（每轮开始时）
interface QuestionStartNotification {
  type: 'QUESTION_START'
  question: Question
  currentPlayerId: string    // 应该答题的玩家
  roundNumber: number
}

// 8. 玩家回答通知（广播给所有人）
interface AnswerNotification {
  type: 'ANSWER'
  playerId: string
  answerIndex: number
  isCorrect: boolean         // 服务器判定结果
  newMonsterHP: number
  newTeamHP: number
  damage: number             // 伤害值
}

// 9. 下一题/战斗结束
interface RoundEndNotification {
  type: 'ROUND_END'
  result: 'next_question' | 'victory' | 'defeat'
  battleState: BattleState
  nextQuestion?: Question
  finalResult?: {
    winner: 'player' | 'monster'
    score: number
  }
}

// 10. 错误消息
interface ErrorResponse {
  type: 'ERROR'
  code: string
  message: string
}

// 11. 心跳响应
interface PongResponse {
  type: 'PONG'
  serverTime: number
}

// 12. 房间状态同步（断线重连后）
interface RoomSyncResponse {
  type: 'ROOM_SYNC'
  room: Room
  battleState: BattleState | null
}
```

### 4.4 错误码定义

```typescript
const ErrorCode = {
  // 房间相关 (1xxx)
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',        // 1001
  ROOM_FULL: 'ROOM_FULL',                   // 1002
  ROOM_ALREADY_STARTED: 'ROOM_ALREADY_STARTED', // 1003
  NOT_HOST: 'NOT_HOST',                      // 1004
  ALREADY_IN_ROOM: 'ALREADY_IN_ROOM',        // 1005
  INVALID_ROOM_CODE: 'INVALID_ROOM_CODE',    // 1006
  
  // 游戏相关 (2xxx)
  NOT_YOUR_TURN: 'NOT_YOUR_TURN',            // 2001
  ALREADY_ANSWERED: 'ALREADY_ANSWERED',      // 2002
  INVALID_ANSWER: 'INVALID_ANSWER',          // 2003
  GAME_NOT_IN_PROGRESS: 'GAME_NOT_IN_PROGRESS', // 2004
  
  // 连接相关 (3xxx)
  CONNECTION_TIMEOUT: 'CONNECTION_TIMEOUT',  // 3001
  PLAYER_DISCONNECTED: 'PLAYER_DISCONNECTED', // 3002
  ROOM_CLOSED: 'ROOM_CLOSED',                // 3003
} as const
```

---

## 5. 游戏状态同步策略

### 5.1 同步模式选择

**采用"权威服务器 + 客户端预测"模式**

- 服务器：唯一真相来源（authoritative），所有战斗逻辑在服务器执行
- 客户端：本地预测+平滑插值，提供即时反馈

### 5.2 状态同步时机

```
┌──────────────────────────────────────────────────────────┐
│                     同步事件点                            │
├──────────────────────────────────────────────────────────┤
│ 1. ROOM_SYNC    - 断线重连后全量同步                      │
│ 2. GAME_START   - 游戏开始时全量同步                      │
│ 3. ROUND_END    - 每轮结束后同步 battleState              │
│ 4. PING/PONG    - 心跳（不携带游戏数据）                   │
└──────────────────────────────────────────────────────────┘
```

### 5.3 状态序列化

```typescript
// BattleState 同步时只传输必要字段（最小化带宽）
interface BattleStateSync {
  // 房间标识
  roomId: string
  battleId: string
  
  // 当前回合
  roundNumber: number
  currentPlayerId: string
  phase: BattlePhase
  
  // HP 状态
  monsterHP: number
  monsterMaxHP: number
  teamHP: number
  maxTeamHP: number
  
  // 玩家状态
  players: Array<{
    playerId: string
    name: string
    answeredThisRound: boolean
  }>
  
  // 问题状态
  currentQuestionId: string | null
  usedQuestionIds: string[]
  
  // 时间戳
  serverTime: number
  seq: number
}
```

### 5.4 延迟补偿

```typescript
// 客户端发送 ANSWER 时携带 clientTimestamp
interface AnswerRequest {
  type: 'ANSWER'
  answerIndex: number
  clientTimestamp: number  // Date.now()
}

// 服务器计算延迟
const latency = serverTimestamp - clientTimestamp

// 如果延迟 > 阈值（500ms），记录但不拒绝响应
if (latency > 500) {
  console.warn(`High latency: ${latency}ms from player ${playerId}`)
}

// 服务器按接收顺序处理（先进先出）
```

### 5.5 乐观更新与回滚

客户端在发送 ANSWER 后立即更新本地状态（乐观更新）：

```
客户端                     服务器
  │                          │
  │  ANSWER (answerIndex=2)  │
  │ ───────────────────────► │
  │                          │
  │  [乐观更新：显示动画]     │  [验证答案，计算结果]
  │  [显示"等待"]           │
  │                          │
  │                          │  ANSWER (isCorrect=true, newMonsterHP=80)
  │  ANSWER (服务器确认)     │ ◄───────────────────────
  │ ◄─────────────────────── │
  │                          │
  │  [同步到服务器状态]       │  [无差异，确认乐观更新]
  │  [取消"等待"]            │
```

---

## 6. 断线重连机制

### 6.1 重连流程

```
┌─────────────┐
│  连接正常   │
└──────┬──────┘
       │ 检测到断开（WebSocket onclose）
       ▼
┌─────────────┐
│  断开状态   │
│  启动重连   │
└──────┬──────┘
       │ 指数退避重试 (1s, 2s, 4s, 8s, max 30s)
       │
       ▼
┌─────────────────────────────────────┐
│           尝试重连                    │
│  WebSocket reconnect                 │
└──────┬──────────────────────────────┘
       │
       ├─ 成功 → 发送 ROOM_SYNC 请求
       │          等待 RoomSyncResponse
       │          应用同步状态
       │          恢复游戏
       │
       ├─ 失败 → 继续重试（达到最大次数后提示）
       │
       └─ 房间已关闭 → 提示"房间已解散"
```

### 6.2 重连状态恢复

```typescript
// 客户端重连后请求同步
interface RoomSyncRequest {
  type: 'ROOM_SYNC'
  roomId: string
  playerId: string
}

// 服务器返回完整状态
interface RoomSyncResponse {
  type: 'ROOM_SYNC'
  room: Room
  battleState: BattleState | null
  yourPlayerId: string
  connectionRestored: boolean
}
```

### 6.3 断线玩家处理

```typescript
// 玩家断线后，服务器标记其状态为 disconnected
// 但保留其在房间中的位置（不立即踢出）
const DISCONNECT_TIMEOUT = 60_000  // 60秒后踢出

// 战斗中，如果当前玩家断线
if (currentPlayer.disconnected) {
  // 自动跳过该玩家（视为答错）
  // 或者给其他玩家提示"等待该玩家重连"
  // 设计决策：采用"自动跳过"
  await simulateAnswer(currentPlayer, { 
    type: 'timeout',
    reason: 'player_disconnected'
  })
}

// 重连后
if (room.state === 'in_progress') {
  // 发送完整状态同步
  // 玩家继续从当前位置开始
}
```

### 6.4 重连策略配置

```typescript
const ReconnectionConfig = {
  maxRetries: 10,
  initialDelay: 1000,      // 1秒
  maxDelay: 30000,          // 30秒
  backoffMultiplier: 2,
  jitter: 0.1,             // ±10% 随机抖动
}
```

---

## 7. 数据模型扩展

### 7.1 多人模式类型定义

```typescript
// src/multiplayer/types.ts

export type RoomState = 'waiting' | 'in_progress' | 'closed'

export interface RoomPlayer {
  playerId: string
  name: string
  grade: number
  avatar?: string
  isReady: boolean
  isHost: boolean
  connected: boolean
  lastPingAt: number
}

export interface RoomSettings {
  maxPlayers: 2 | 4
  oceanId: string
  gradeRange?: [number, number]
}

export interface Room {
  id: string
  code: string
  hostId: string
  state: RoomState
  players: RoomPlayer[]
  battle: RoomBattle | null
  settings: RoomSettings
  createdAt: number
  lastActivityAt: number
}

export interface RoomBattle {
  battleId: string
  monsterId: string
  currentQuestionIndex: number
  battleState: BattleState
  startTime: number
}

// 扩展 GameAction
export type MultiplayerAction =
  | { type: 'JOIN_ROOM'; roomCode: string; playerName: string; grade: number }
  | { type: 'CREATE_ROOM'; playerName: string; grade: number; settings: RoomSettings }
  | { type: 'LEAVE_ROOM' }
  | { type: 'PLAYER_READY'; ready: boolean }
  | { type: 'START_MULTIPLAYER_GAME' }
  | { type: 'SYNC_BATTLE_STATE'; battleState: BattleState }
  | { type: 'REMOTE_ANSWER'; playerId: string; isCorrect: boolean; newMonsterHP: number; newTeamHP: number }
  | { type: 'SET_RECONNECTING'; isReconnecting: boolean }
  | { type: 'SET_CONNECTION_STATE'; state: ConnectionState }

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting'
```

### 7.2 扩展现有类型

```typescript
// src/game/types.ts 扩展

// BattleState 新增字段
export interface BattleState {
  // ... 现有字段 ...
  
  // 多人对战新增
  roomId?: string              // 所属房间ID
  isRemoteUpdate?: boolean     // 是否为远程同步更新
  lastSyncTime?: number       // 最后同步时间
}

// GameAction 新增
export type GameAction =
  // ... 现有动作 ...
  | { type: 'SYNC_FROM_SERVER'; battleState: BattleState }
  | { type: 'SET_REMOTE_PLAYER_ANSWER'; playerId: string; answer: number; isCorrect: boolean }
```

---

## 8. API 设计

### 8.1 WebSocket 连接

```
URL: wss://api.example.com/multiplayer
认证: 通过 URL 参数传递 token?token=xxx
```

### 8.2 消息处理流程

```typescript
// 客户端消息处理
class MessageHandler {
  private handlers: Map<string, Handler>
  
  register(type: string, handler: Handler) {
    this.handlers.set(type, handler)
  }
  
  handle(message: BaseMessage) {
    const handler = this.handlers.get(message.type)
    if (handler) {
      handler(message)
    } else {
      console.warn(`No handler for ${message.type}`)
    }
  }
}

// 服务器消息类型路由
// POST /api/multiplayer/message
// Body: { type: string, ...payload }
// Response: { success: boolean, data?: any, error?: ErrorResponse }
```

### 8.3 REST API（辅助接口）

```typescript
// 获取房间列表（可选，用于大厅展示）
// GET /api/multiplayer/rooms?oceanId=east&limit=20

// 响应
interface RoomListResponse {
  rooms: Array<{
    id: string
    code: string
    hostName: string
    playerCount: number
    maxPlayers: number
    oceanId: string
    createdAt: number
  }>
}

// 验证房间码是否存在
// GET /api/multiplayer/rooms/:code/exists
// 响应: { exists: boolean, roomId?: string }
```

---

## 9. 时序图

### 9.1 完整游戏流程

```
Player A (房主)              Server              Player B
    │                           │                    │
    │ CREATE_ROOM ─────────────►│                    │
    │◄───────── ROOM_CREATED ───│                    │
    │                           │                    │
    │                           │   JOIN_ROOM ──────►│
    │                           │◄─── ROOM_JOINED ────│
    │◄─── PLAYER_JOINED ────────│                    │
    │                           │                    │
    │ [等待玩家]                │ [等待玩家]         │
    │                           │                    │
    │ PLAYER_READY ────────────►│                    │
    │                           │◄─ PLAYER_READY ────│
    │◄─── PLAYER_READY ─────────│                    │
    │                           │                    │
    │                           │    PLAYER_READY ──►│
    │                           │◄──── PLAYER_READY ─│
    │                           │                    │
    │ START_GAME ──────────────►│                    │
    │                           │◄── START_GAME ──────│
    │                           │                    │
    │◄── GAME_START ────────────│                    │
    │   (BattleState)          │◄── GAME_START ─────│
    │   (firstQuestion)         │   (BattleState)   │
    │                           │   (firstQuestion)  │
    │                           │                    │
    │ [Question: "1+1=?"]        │ [Question: "1+1=?"] │
    │                           │                    │
    │ [A 回答: 2]               │ [B 等待 A 回答]    │
    │ ANSWER(answerIndex=2) ───►│                    │
    │                           │                    │
    │ [乐观更新: MonsterHP-20] │ [乐观更新: MonsterHP-20]
    │                           │                    │
    │                           │◄── ANSWER ──────────│
    │◄── ANSWER ────────────────│                    │
    │   (isCorrect=true)        │   (isCorrect=true)│
    │   (newMonsterHP=80)        │   (newMonsterHP=80)│
    │                           │                    │
    │                           │   [Question #2]    │
    │◄── QUESTION_START ─────────│   [轮到 B]        │
    │   (currentPlayer=B)       │◄── QUESTION_START │
    │                           │                    │
    │ [B 回答]                  │ [B 回答: 3]        │
    │                           │ ANSWER(answerIndex=0)
    │                           │ ──────────────────►│
    │                           │                    │
    │                           │◄── ANSWER ─────────│
    │◄── ANSWER ────────────────│                    │
    │   (isCorrect=false)       │   (isCorrect=false)
    │   (newTeamHP=90)          │   (newTeamHP=90)   │
    │                           │                    │
    │ [循环直到胜负]             │                    │
    │                           │                    │
    │◄── ROUND_END ──────────────│                    │
    │   (result='victory')      │◄── ROUND_END ──────│
    │                           │                    │
```

### 9.2 断线重连流程

```
Player A                    Server                  Player B
   │                           │                        │
   │ [游戏进行中]              │                        │
   │                           │                        │
   │ WebSocket 断开            │                        │
   │ ════════════✗             │                        │
   │                           │                        │
   │ [开始重连]                │ [等待 60秒]            │
   │ reconnect (1s) ────────► │                        │
   │ ✗ 失败                    │                        │
   │                           │                        │
   │ reconnect (2s) ────────► │                        │
   │ ✗ 失败                    │                        │
   │                           │                        │
   │ reconnect (4s) ────────► │                        │
   │ ◄── CONNECTION_RESTORED ─│                        │
   │                           │                        │
   │ ROOM_SYNC ─────────────► │                        │
   │   (roomId, playerId)      │                        │
   │                           │                        │
   │◄── ROOM_SYNC ────────────│                        │
   │   (full room state)       │                        │
   │   (current battleState)   │                        │
   │                           │                        │
   │ [恢复游戏画面]            │ [继续正常游戏]         │
   │                           │                        │
   │                           │                        │
   │ (如果超时)                │ [Player A 被标记      │
   │                           │  为 disconnected]      │
   │                           │                        │
```

### 9.3 同步冲突处理

```
客户端                     服务器
  │                          │
  │ [网络延迟较高时]          │
  │                          │
  │ 发送 ANSWER (延迟300ms)  │
  │ ───────────────────────► │
  │                          │  服务器已处理更早的 ANSWER
  │                          │  （来自另一位玩家）
  │                          │
  │                          │  返回 ANSWER (serverTime=早)
  │  ANSWER ──────────────── │ ◄──────────────────────
  │ ◄─────────────────────── │
  │                          │
  │  [客户端用 serverTime    │
  │   校正本地状态]          │
  │                          │
  │  [状态一致，无冲突]      │
```

---

## 10. 服务器实现建议

### 10.1 技术选型

| 组件 | 推荐技术 | 说明 |
|------|----------|------|
| **运行时** | Node.js 20+ | 与前端统一语言 |
| **WebSocket** | ws / Socket.IO | 推荐 Socket.IO（自动重连、房间） |
| **HTTP** | Express / Fastify | REST API 辅助接口 |
| **游戏逻辑** | 复用现有 TypeScript | `src/game/` 可直接复用 |
| **存储** | Redis | 房间临时存储（TTL 自动清理） |
| **部署** | 单进程 + Redis | 水平扩展时用 Redis Pub/Sub |

### 10.2 服务器目录结构

```
server/
├── src/
│   ├── index.ts              # 入口
│   ├── config.ts             # 配置
│   ├── rooms/
│   │   ├── RoomManager.ts    # 房间管理
│   │   └── Room.ts           # 房间实体
│   ├── game/
│   │   ├── GameEngine.ts     # 游戏引擎
│   │   └── QuestionDistributor.ts  # 题目分发
│   ├── network/
│   │   ├── WebSocketServer.ts
│   │   └── MessageRouter.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── rateLimit.ts
│   └── utils/
│       └── codeGenerator.ts
├── package.json
└── tsconfig.json
```

### 10.3 服务器核心逻辑

```typescript
// 伪代码：处理 ANSWER 消息
async function handleAnswer(ws: WebSocket, msg: AnswerRequest) {
  const room = roomManager.getRoom(msg.roomId)
  const player = room.getPlayer(msg.playerId)
  
  // 1. 验证
  if (!player.connected) {
    sendError(ws, 'PLAYER_DISCONNECTED')
    return
  }
  
  if (room.currentPlayerId !== msg.playerId) {
    sendError(ws, 'NOT_YOUR_TURN')
    return
  }
  
  // 2. 获取题目
  const question = room.getCurrentQuestion()
  
  // 3. 判定答案
  const isCorrect = question.options[msg.answerIndex]?.isCorrect ?? false
  
  // 4. 计算伤害
  const damage = isCorrect ? 20 : 10
  const newMonsterHP = isCorrect ? room.battle.monster.hp - damage : room.battle.monster.hp
  const newTeamHP = isCorrect ? room.battle.teamHP : room.battle.teamHP - damage
  
  // 5. 更新状态
  room.battle.monster.hp = newMonsterHP
  room.battle.teamHP = newTeamHP
  
  // 6. 广播给所有人（包括发送者）
  room.broadcast({
    type: 'ANSWER',
    playerId: msg.playerId,
    answerIndex: msg.answerIndex,
    isCorrect,
    newMonsterHP,
    newTeamHP,
    damage,
    seq: incrementSeq(),
  })
  
  // 7. 检查胜负
  if (newMonsterHP <= 0) {
    endBattle(room, 'victory')
  } else if (newTeamHP <= 0) {
    endBattle(room, 'defeat')
  } else {
    // 下一题
    nextRound(room)
  }
}
```

---

## 11. 前端实现建议

### 11.1 新增依赖

```json
{
  "dependencies": {
    "zustand": "^5.0.12",  // 已有
    "immer": "^10.0.0"     // 不可变状态更新
  }
}
```

### 11.2 游戏状态 vs 网络状态分离

建议将网络相关的状态与纯游戏状态分离：

```typescript
// 纯游戏状态（本地，Zustand）
interface GameState {
  gamePhase: GamePhase
  battle: BattleState | null
  // ...
}

// 网络/房间状态（单独 store）
interface NetworkState {
  connectionState: ConnectionState
  room: Room | null
  myPlayerId: string | null
  isHost: boolean
  error: string | null
}
```

### 11.3 UI 组件清单

| 组件 | 用途 |
|------|------|
| `MultiplayerLobby` | 大厅主界面（创建/加入房间） |
| `RoomBrowser` | 房间列表浏览 |
| `WaitingRoom` | 等待房间（显示玩家、准备状态） |
| `MultiplayerBattle` | 多人战斗界面（扩展现有 Battle） |
| `PlayerAvatarList` | 显示所有玩家状态 |
| `TurnIndicator` | 当前回合指示器 |
| `ConnectionStatus` | 连接状态指示器 |

---

## 12. 安全性考虑

### 12.1 房间访问控制

- 房间码：6位随机字母数字，难以猜测
- 房主验证：只有房主可以发送 `START_GAME`
- 玩家验证：每个消息携带 `playerId`，服务器校验

### 12.2 作弊防护

- **答案验证**：答案正确性由服务器判定，客户端不可信
- **状态校验**：服务器定期广播完整状态，客户端可校验一致性
- **频率限制**：限制 ANSWER 消息频率（最少间隔 1 秒）
- **IP 限制**：同一房间同一 IP 限制 2 个连接

### 12.3 数据验证

```typescript
// 服务端验证所有输入
function validateAnswerRequest(msg: unknown): msg is AnswerRequest {
  if (!msg || typeof msg !== 'object') return false
  const m = msg as Record<string, unknown>
  return (
    m.type === 'ANSWER' &&
    typeof m.answerIndex === 'number' &&
    m.answerIndex >= 0 &&
    m.answerIndex < 4  // 假设最多4个选项
  )
}
```

---

## 13. 性能考虑

### 13.1 带宽优化

- **增量同步**：只同步变化的字段
- **消息压缩**：使用 `permessage-deflate` WebSocket 扩展
- **心跳间隔**：30 秒（足够检测断开，不浪费带宽）

### 13.2 服务器容量

| 指标 | 估算 |
|------|------|
| 每房间带宽 | ~1 KB/s (正常游戏) |
| 每服务器房间数 | ~10,000 (受内存限制) |
| 每房间玩家数 | 2-4 |
| 预计并发 | 20,000-40,000 玩家 |

---

## 14. 测试策略

### 14.1 单元测试

- 状态机转换逻辑
- 消息序列化/反序列化
- 答案判定逻辑

### 14.2 集成测试

- 两人同时在线完整流程
- 断线重连
- 房主离开/加入

### 14.3 压力测试

- 模拟 1000+ 房间同时在线
- 网络延迟模拟 (100ms-500ms)
- 弱网环境测试

---

## 15. 实施计划

### Phase 1: 基础设施（1-2周）

- [ ] WebSocket 客户端封装
- [ ] 房间类型定义
- [ ] 基础 roomStore（Zustand）

### Phase 2: 房间系统（1周）

- [ ] 创建房间
- [ ] 加入房间
- [ ] 等待大厅 UI
- [ ] 玩家状态同步

### Phase 3: 多人战斗（2周）

- [ ] 扩展 BattleState
- [ ] 同步 ANSWER 逻辑
- [ ] 多人战斗 UI
- [ ] 胜负判定

### Phase 4: 稳定性（1周）

- [ ] 断线重连
- [ ] 心跳机制
- [ ] 错误处理
- [ ] 边界情况

---

## 附录

### A. 关键文件清单

| 操作 | 文件 | 说明 |
|------|------|------|
| 新增 | `src/multiplayer/types.ts` | 类型定义 |
| 新增 | `src/multiplayer/Room.ts` | 房间管理 |
| 新增 | `src/multiplayer/SyncEngine.ts` | 同步引擎 |
| 新增 | `src/network/WebSocketClient.ts` | WS 客户端 |
| 新增 | `src/store/roomStore.ts` | 房间状态 |
| 扩展 | `src/store/gameStore.ts` | 支持多人动作 |
| 扩展 | `src/game/types.ts` | 扩展类型 |
| 新增 | `src/components/game/MultiplayerLobby.tsx` | 大厅 |
| 新增 | `src/components/game/WaitingRoom.tsx` | 等待房间 |

### B. 参考资料

- [Socket.IO 官方文档](https://socket.io/docs/v4/)
- [Zustand 多人游戏示例](https://github.com/pmndrs/zustand/blob/main/examples/client-side-multiplayer/)
- [游戏同步策略](https://www.gabrielgambetta.com/client-server-game-architecture.html)
