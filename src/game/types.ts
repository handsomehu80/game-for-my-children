// src/game/types.ts

// 战斗 Phase
export type BattlePhase =
  | 'idle'
  | 'showing_question'
  | 'answering'
  | 'animating_damage'
  | 'showing_skill'
  | 'victory'
  | 'defeat'

// 玩家
export interface Player {
  id: string
  name: string
  hp: number
  maxHp: number
  comboCount: number
}

// 怪物
export interface Monster {
  id: string
  name: string
  hp: number
  maxHp: number
  sprite: string
  skills?: string[]
  drops?: Item[]
}

// 道具
export interface Item {
  id: string
  name: string
  type: 'consumable' | 'equipment' | 'key'
}

// 题目选项
export interface QuestionOption {
  text: string
  isCorrect: boolean
}

// 题目
export interface Question {
  id: string
  content: string
  type: 'single' | 'multiple' | 'fill' | 'image'
  difficulty: 1 | 2 | 3 | 4 | 5
  category: 'math' | 'chinese' | 'english' | 'science' | 'general'
  options: QuestionOption[]
  imageUrl?: string
}

// 海洋区域
export interface OceanZone {
  id: string
  name: string
  description: string
  difficulty: [number, number]
  bossId: string
  monsters: string[]
  unlocked: boolean
  completed: boolean
}

// 战斗日志
export interface BattleLogEntry {
  type: 'correct' | 'wrong' | 'skill_triggered' | 'victory' | 'defeat'
  message: string
  timestamp: number
}

// 激活技能
export interface ActiveSkill {
  skillId: string
  activatedAt: number
  expiresAt: number
}

// 战斗状态
export interface BattleState {
  phase: BattlePhase
  player: Player
  monster: Monster
  currentQuestion: Question | null
  comboCount: number
  isPlayerTurn: boolean
  battleLog: BattleLogEntry[]
  activeSkills: ActiveSkill[]
}

// 技能效果
export type SkillEffect =
  | { type: 'shield'; protectedCount: number }
  | { type: 'double'; duration: number }
  | { type: 'leech'; healPercent: number }
  | { type: 'freeze'; freezeDuration: number }

// 技能定义
export interface Skill {
  id: string
  name: string
  description: string
  icon: string
  triggerThreshold: number
  duration: number
  maxUses?: number
  effect: SkillEffect
}

// 组合技能定义
export interface ComboSkillDefinition {
  id: string
  name: string
  componentSkills: [string, string]
  effect: SkillEffect
}

// 性能追踪器
export interface PerformanceTracker {
  oceanId: string
  playerId: string
  correctCount: number
  wrongCount: number
  consecutiveCorrect: number
  consecutiveWrong: number
  currentDifficulty: number
}

// 游戏状态
export type GamePhase = 'title' | 'world_map' | 'battle' | 'result' | 'game_over' | 'exploration'

export interface GameState {
  gamePhase: GamePhase
  currentOcean: string | null
  players: Player[]
  unlockedOceans: string[]
  completedOceans: string[]
  battle: BattleState | null
  totalScore: number
  exploration: ExplorationState | null
}

// 游戏动作
export type GameAction =
  | { type: 'START_GAME'; players: Player[] }
  | { type: 'SELECT_OCEAN'; ocean: string }
  | { type: 'START_BATTLE'; monster: Monster; question: Question }
  | { type: 'ANSWER_QUESTION'; answerIndex: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'END_BATTLE'; victory: boolean }
  | { type: 'COMPLETE_OCEAN' }
  | { type: 'GAME_OVER' }
  | { type: 'RESET_GAME' }

// ==================== 探索系统类型 ====================

// 探索 Phase
export type ExplorationPhase =
  | 'exploring'        // 选择目的地
  | 'sailing'          // 航行中
  | 'arrived'          // 已到达
  | 'moving'           // 移动动画
  | 'encounter'        // 遭遇判定
  | 'battle'           // 战斗中
  | 'hidden_area'      // 进入隐藏区域
  | 'treasure'         // 宝箱/奖励
  | 'portal_appear'    // 传送门出现
  | 'boss_appearing'   // 大Boss出现
  | 'area_complete'    // 区域完成
  | 'victory'          // 区域胜利
  | 'error'            // 异常状态
  | 'rollback'         // 回滚状态

// 知识区域类型
export type KnowledgeArea = 'math' | 'chinese' | 'english' | 'comprehensive'

// 区域
export interface Area {
  id: string
  oceanId: string
  knowledgeArea: KnowledgeArea
  name: string
  difficulty: 1 | 2 | 3  // 1-3星
  type: 'normal' | 'hidden' | 'treasure' | 'boss'
  position: { x: number; z: number }  // 地图坐标
  requiredKeys: number         // 需要钥匙数量 (0 = 不需要)
  monsterId?: string           // 关联怪物
  connections: string[]        // 连接的区域ID
}

// 传送门
export interface Portal {
  id: string
  targetAreaId: string
  type: 'normal' | 'hidden' | 'event' | 'ocean_portal'
}

// 传送门配置
export interface PortalConfig {
  seed: number
  portals: Portal[]
  generatedAt: number
}

// 存档点类型
export type SavepointType = 'battle_win' | 'area_unlock' | 'treasure'

// 存档点
export interface Savepoint {
  type: SavepointType
  createdAt: number
  stateSnapshot: {
    visitedAreas: string[]
    defeatedMiniBosses: string[]
    unlockedAreas: string[]
    collectedKeys: number
    collectedItems: Item[]
  }
}

// 探索状态
export interface ExplorationState {
  phase: ExplorationPhase
  currentOcean: string | null
  currentArea: string | null
  visitedAreas: string[]           // 已访问区域
  defeatedMiniBosses: string[]     // 已击败小boss
  unlockedAreas: string[]          // 已解锁区域（使用钥匙后）
  collectedKeys: number            // 收集的钥匙数量
  collectedItems: Item[]           // 收集的物品
  availablePortals: Portal[]        // 当前可选传送门
  portalSeed: number | null        // 传送门随机种子
  failedAttempts: Record<string, number>  // 每个区域的失败次数
  lastError: string | null         // 最后错误信息
  // 回滚相关
  savepoints: Savepoint[]          // 存档点历史
  lastSavepoint: Savepoint | null  // 上一个存档点
  battleFailedAttempts: number   // 当前区域的失败重试次数 (battle retries, not per-area failedAttempts)
  // P1-2: Track victories for guaranteed key drop
  consecutiveVictoriesWithoutKey: number
}

// 探索动作
export type ExplorationAction =
  | { type: 'START_EXPLORATION'; oceanId: string }
  | { type: 'SELECT_AREA'; areaId: string }
  | { type: 'START_SAILING'; targetAreaId: string }
  | { type: 'SAILING_COMPLETE' }
  | { type: 'ARRIVED' }
  | { type: 'MOVE_COMPLETE' }
  | { type: 'ENCOUNTER_RESULT'; result: 'battle' | 'treasure' | 'hidden_event' }
  | { type: 'BATTLE_WIN'; areaId: string }
  | { type: 'BATTLE_LOSE' }
  | { type: 'OPEN_TREASURE'; treasures: Item[] }
  | { type: 'RECEIVE_KEY'; count: number }
  | { type: 'UNLOCK_AREA'; areaId: string }
  | { type: 'GENERATE_PORTALS'; portals: Portal[]; seed: number }
  | { type: 'SELECT_PORTAL'; portal: Portal }
  | { type: 'BOSS_APPEAR' }
  | { type: 'AREA_COMPLETE' }
  | { type: 'CREATE_SAVEPOINT'; savepointType: SavepointType }
  | { type: 'EXPLORATION_ERROR'; error: string }
  | { type: 'ROLLBACK_TO_SAVEPOINT' }
  | { type: 'RESET_EXPLORATION' }
  | { type: 'RESET_VICTORY_COUNTER' }  // P1-2: Reset victory counter after key drop
  | { type: 'INCREMENT_VICTORY_COUNTER' }  // P1-2: Increment victory counter