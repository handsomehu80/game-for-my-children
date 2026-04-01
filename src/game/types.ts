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
export type GamePhase = 'title' | 'world_map' | 'battle' | 'result' | 'game_over'

export interface GameState {
  gamePhase: GamePhase
  currentOcean: string | null
  players: Player[]
  unlockedOceans: string[]
  completedOceans: string[]
  battle: BattleState | null
  totalScore: number
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