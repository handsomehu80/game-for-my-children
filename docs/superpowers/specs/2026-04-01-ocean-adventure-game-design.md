# 海洋探险游戏 - 设计规格文档

> **项目**: 波吉王子海洋探险 (Prince Boji's Ocean Adventure)
> **版本**: 1.3
> **日期**: 2026-04-02
> **状态**: Draft (红蓝对抗审查完成，所有 P0/P1/P2 问题已解决)

## 1. 项目概述

### 1.1 目标

为用户的两个孩子（大女儿和小儿子）开发一款教育冒险游戏。玩家与波吉王子和船员一起在海洋世界中冒险，通过回答知识问题与怪物战斗。游戏包含5个海洋区域，难度递进，支持双人合作模式。

### 1.2 核心玩法

- **战斗系统**: 答对问题减少怪物HP，答错减少玩家HP
- **技能系统**: 连续答对触发技能（防护罩、双重回答、生命汲取、时间冻结）
- **双人合作**: 两个玩家协作，共享HP池，组合技能
- **难度适应**: 根据玩家表现动态调整题目难度
- **家长控制**: 配置难度范围、游戏时间、题目来源

---

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **渲染层** | React-Three-Fiber + Drei | 3D渲染，使用OrthographicCamera实现2D视角 |
| **状态管理** | Zustand | 游戏状态管理（替代Context） |
| **游戏逻辑层** | TypeScript (框架无关) | 战斗计算、技能触发、难度调整 |
| **数据层** | JSON配置文件 | 海洋/怪物/题目数据 |
| **构建工具** | Vite | 开发和生产构建 |
| **部署平台** | 网页 (Vercel/Netlify) | Web-only |

### 2.2 分层架构

```
┌─────────────────────────────────────────────────────────────┐
│                     UI Layer (React)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │TitleScreen│ │ WorldMap │ │ Battle   │ │ Parent   │     │
│  │          │ │          │ │ Scene    │ │ Portal   │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
├─────────────────────────────────────────────────────────────┤
│                   Game Layer (TypeScript)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │Battle    │ │ Skill    │ │Question   │ │ Progress  │     │
│  │Engine    │ │ System   │ │ Selector  │ │ Tracker   │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
├─────────────────────────────────────────────────────────────┤
│                  Render Layer (R3F)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │Scene     │ │ Sprite   │ │ Effects   │                   │
│  │Manager   │ │ Renderer │ │ (VFX)     │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
├─────────────────────────────────────────────────────────────┤
│                   Data Layer (JSON)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │
│  │ Oceans   │ │ Monsters │ │ Questions │                   │
│  └──────────┘ └──────────┘ └──────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 项目目录结构

```
src/
├── components/          # React UI组件
│   ├── game/            # 游戏组件
│   │   ├── Battle/      # 战斗系统UI
│   │   ├── Ocean/       # 海洋场景
│   │   └── UI/          # HUD、菜单
│   └── common/          # 共享组件
├── game/                # 核心游戏逻辑（框架无关）
│   ├── BattleEngine.ts  # 战斗引擎
│   ├── SkillSystem.ts   # 技能系统
│   ├── types.ts         # 类型定义
│   └── QuestionSelector.ts  # 题目选择器
├── data/                # 数据配置
│   ├── oceans/          # 海洋区域定义
│   ├── monsters/        # 怪物配置
│   └── questions/       # 题库
├── store/               # Zustand状态管理
├── hooks/               # 自定义React hooks
└── assets/              # 资源文件

docs/superpowers/
├── specs/               # 设计规格文档
└── plans/               # 实施计划
```

### 2.4 渲染策略

- **相机**: OrthographicCamera（2D视角，可升级3D）
- **角色渲染**: Sprite-based（可替换为3D模型）
- **特效**: VFX particles（技能特效）
- **升级路径**: 通过 RenderAdapter 接口切换2D/3D渲染器

**渲染适配器架构**:
```typescript
// 渲染层抽象 - 支持2D/3D切换
interface RenderAdapter {
  // 角色渲染
  renderCharacter(props: CharacterProps): void
  renderMonster(props: MonsterProps): void

  // 特效
  playSkillEffect(skillId: string, position: Vector3): void
  playDamageEffect(target: 'player' | 'monster', amount: number): void

  // 相机控制
  setCamera(mode: '2d' | '3d'): void
  focusOn(target: Vector3): void

  // 生命周期
  dispose(): void
}

// 具体实现
class SpriteRenderAdapter implements RenderAdapter { /* 2D实现 */ }
class ModelRenderAdapter implements RenderAdapter { /* 3D实现 */ }

// 渲染管理器
class RenderManager {
  private adapter: RenderAdapter
  switchRenderer(type: '2d' | '3d'): void {
    this.adapter.dispose()
    this.adapter = type === '2d'
      ? new SpriteRenderAdapter()
      : new ModelRenderAdapter()
  }
}
```

---

## 3. 战斗系统设计

### 3.1 战斗流程状态机

```
IDLE → SHOWING_QUESTION → ANSWERING → ANIMATING_DAMAGE →
  → CHECK_VICTORY → (若未胜利) → SHOWING_QUESTION
  → VICTORY / DEFEAT

转换规则:
- ANSWERING → SHOWING_SKILL (技能触发) → ANSWERING (下一题)
- ANSWERING → ANIMATING_DAMAGE (无技能) → CHECK_VICTORY
- CHECK_VICTORY: monster.hp <= 0 → VICTORY; sharedHp <= 0 → DEFEAT
```

**Phase定义**:
```typescript
type BattlePhase =
  | 'idle'
  | 'showing_question'
  | 'answering'
  | 'animating_damage'
  | 'showing_skill'
  | 'victory'
  | 'defeat'
```

### 3.2 HP伤害计算

| 动作 | 基础伤害 | 说明 |
|------|---------|------|
| 答对 | -20 HP (怪物) | 减少怪物HP |
| 答错 | -10 HP (玩家) | 减少玩家HP |
| 连击加成 | +5% per 10连击 (离散) | 10连击+5%, 20连击+10%, 30连击+15%... |
| 防护罩 | 减免100% | 挡一次答错 |

**连击加成公式**:
```typescript
const getComboBonus = (combo: number): number => {
  const steps = Math.floor(combo / 10)  // 离散台阶
  return steps * 0.05  // 每10连击 +5%
}

// 最终伤害 = 基础伤害 * (1 + 连击加成)
// 例: 10连击时, 答对伤害 = 20 * (1 + 0.05) = 21
```

### 3.3 战斗数据结构

```typescript
interface BattleLogEntry {
  type: 'correct' | 'wrong' | 'skill_triggered' | 'victory' | 'defeat'
  message: string
  timestamp: number
}

interface ActiveSkill {
  skillId: string
  activatedAt: number
  expiresAt: number
}

interface BattleState {
  phase: BattlePhase
  player: Player
  monster: Monster
  currentQuestion: Question | null
  comboCount: number
  isPlayerTurn: boolean
  battleLog: BattleLogEntry[]
  activeSkills: ActiveSkill[]
}

interface Player {
  id: string
  name: string
  hp: number
  maxHp: number
  comboCount: number
}

interface Monster {
  id: string
  name: string
  hp: number
  maxHp: number
  sprite: string
}
```

---

## 4. 技能系统设计

### 4.1 技能列表

| 技能ID | 名称 | 图标 | 触发条件 | 效果 | 持续时间 |
|--------|------|------|---------|------|---------|
| shield | 防护罩 | shield.png | 3连击 | 挡1次答错 | 1次 |
| double | 双重回答 | double.png | 5连击 | 显示2个答案 | 15秒 |
| leech | 生命汲取 | leech.png | 7连击 | 答对回10%HP | 20秒 |
| freeze | 时间冻结 | freeze.png | 10连击 | 怪物停3秒 | 一次性 |

### 4.2 技能数据结构

```typescript
interface Skill {
  id: string
  name: string
  description: string
  icon: string
  triggerThreshold: number
  duration: number
  maxUses?: number
  effect: SkillEffect
}

type SkillEffect =
  | { type: 'shield'; protectedCount: number }
  | { type: 'double'; duration: number }
  | { type: 'leech'; healPercent: number }
  | { type: 'freeze'; freezeDuration: number }
```

### 4.3 组合技能

**触发规则**:
组合技能在满足以下条件时激活：
1. 两个组成技能**同时**处于激活状态（在 `activeSkills` 数组中）
2. 组合效果在两个技能都激活期间**持续有效**
3. 任一技能过期或消耗完毕，组合效果立即结束

**组合技能表**:

| 组合 | 技能1 | 技能2 | 组合效果 | 持续条件 |
|------|-------|-------|---------|---------|
| 超级防护 | 防护罩 | 防护罩 | 可挡2次攻击 | 两技能都激活 |
| 幻影双答 | 双重回答 | 任意技能 | 显示3个选项 | 双重回答激活中 |
| 生命链接 | 生命汲取 | 生命汲取 | HP在两玩家间均衡 | 两技能都激活 |
| 绝对零度 | 时间冻结 | 时间冻结 | 冻结5秒 | 两技能都激活 |

**组合技能数据结构**:
```typescript
interface ComboSkillDefinition {
  id: string
  name: string
  componentSkills: [string, string]  // [技能1ID, 技能2ID]
  effect: SkillEffect                 // 组合后的增强效果
  isActive: (activeSkills: ActiveSkill[]) => boolean
}
```

---

## 5. 题目难度系统

### 5.1 难度等级

| 等级 | 名称 | 颜色 | 描述 | 题目类型 |
|------|------|------|------|---------|
| 1 | 启蒙 | #00ff88 | 看图识物 | 图片题 |
| 2 | 基础 | #00d9ff | 简单问答 | 单选题 |
| 3 | 进阶 | #ffd700 | 多选/填空 | 多选题/填空 |
| 4 | 挑战 | #ff6b6b | 限时/推理 | 限时题 |
| 5 | 大师 | #9b59b6 | 综合应用 | 综合题 |

### 5.2 海洋难度映射

```typescript
const OCEAN_DIFFICULTY = {
  east: [1, 2],      // 东海 - 启蒙/基础
  west: [2, 3],      // 西海 - 基础/进阶
  south: [3, 3],     // 南海 - 进阶
  north: [4, 4],     // 北冰洋 - 挑战
  mysterious: [5, 5], // 神秘海 - 大师
}
```

### 5.3 动态难度调整

```typescript
interface PerformanceTracker {
  oceanId: string
  playerId: string
  correctCount: number
  wrongCount: number
  consecutiveCorrect: number
  consecutiveWrong: number
  currentDifficulty: number  // 当前难度等级
}

const DIFFICULTY_ADJUSTMENT = {
  lowerThreshold: { consecutiveWrong: 2 },  // 连错2题降难度
  upperThreshold: { consecutiveCorrect: 3 }, // 连对3题升难度
  adjustmentRange: { min: -1, max: 1 },
  bounds: { min: 1, max: 5 },

  // 调整后计数器归零，防止振荡
  resetCountersOnAdjustment: true
}

// 调整算法（伪代码）
function adjustDifficulty(tracker: PerformanceTracker): number | null {
  if (tracker.consecutiveWrong >= DIFFICULTY_ADJUSTMENT.lowerThreshold.consecutiveWrong) {
    const newDifficulty = Math.max(bounds.min, tracker.currentDifficulty - 1)
    if (newDifficulty !== tracker.currentDifficulty) {
      tracker.consecutiveCorrect = 0  // 归零
      tracker.consecutiveWrong = 0   // 归零
      return newDifficulty
    }
  }
  if (tracker.consecutiveCorrect >= DIFFICULTY_ADJUSTMENT.upperThreshold.consecutiveCorrect) {
    const newDifficulty = Math.min(bounds.max, tracker.currentDifficulty + 1)
    if (newDifficulty !== tracker.currentDifficulty) {
      tracker.consecutiveCorrect = 0  // 归零
      tracker.consecutiveWrong = 0    // 归零
      return newDifficulty
    }
  }
  return null  // 无需调整
}
```

---

## 6. 双人合作系统

### 6.1 合作机制

- **共享HP池**: 两个玩家共用一个HP池，任一玩家受损都从共享池扣除
  - 初始共享HP = 玩家1 maxHp + 玩家2 maxHp
  - 每个玩家独立位置（sprite），但共享HP数值
  - **共享HP归零 = 战斗失败** (触发 `defeat` 状态)
- **技能组合**: 玩家1技能 + 玩家2技能 = 组合技能（见4.3节）
- **题目分配策略** (当 `assignByDifficulty: true` 时):
  - 难度1-2 → 玩家2 (小儿子)
  - 难度3 → 轮流 (奇数题玩家1, 偶数题玩家2)
  - 难度4-5 → 玩家1 (大女儿)
- **轮流规则** (当 `assignByDifficulty: false` 时):
  - 玩家1和玩家2每题交替回答

### 6.2 合作数据结构

```typescript
interface ComboSkill {
  id: string
  name: string
  effect: SkillEffect
  componentSkills: [string, string]  // 组成该组合的两个技能ID
}

interface CoopState {
  enabled: boolean
  players: [Player, Player]
  sharedHp: { current: number; max: number }
  activeCombos: ComboSkill[]
}

// 战斗结束判定
// 当 sharedHp.current <= 0 时，battle phase 转为 'defeat'
```

---

## 7. 家长控制台

### 7.1 配置选项

```typescript
interface ParentConfig {
  // 题目来源
  questionSource: 'local' | 'online' | 'mixed'

  // 难度范围限制
  difficultyBounds: { min: 1; max: 5 }

  // 每日游戏时间限制
  dailyTimeLimit: { enabled: boolean; minutes: number }

  // 题目类别偏好
  categoryPreferences: {
    math: boolean
    chinese: boolean
    english: boolean
    science: boolean
    general: boolean
  }

  // 双人模式设置
  coopSettings: {
    enabled: boolean
    // true: 按难度自动分配 (难度1-2→玩家2, 3→轮流, 4-5→玩家1)
    // false: 轮流回答
    assignByDifficulty: boolean
  }

  // 自定义题库
  customQuestions?: Question[]
}
```

### 7.2 家长界面功能

- **学习报告**: 查看历史答题数据、正确率统计
- **游戏设置**: 难度/时间/题目来源配置
- **题库管理**: 上传自定义题目
- **孩子档案**: 分别设置两个孩子偏好

---

## 8. 数据模型

### 8.1 海洋数据

```typescript
interface OceanZone {
  id: string
  name: string
  description: string
  difficulty: [number, number]
  bossId: string
  monsters: string[]
  unlocked: boolean
  completed: boolean
}
```

### 8.2 怪物数据

```typescript
interface Item {
  id: string
  name: string
  type: 'consumable' | 'equipment' | 'key'
}

interface Monster {
  id: string
  name: string
  hp: number
  maxHp: number
  sprite: string
  skills?: string[]
  drops?: Item[]
}
```

### 8.3 题目数据

```typescript
interface QuestionOption {
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  content: string
  type: 'single' | 'multiple' | 'fill' | 'image'
  difficulty: 1 | 2 | 3 | 4 | 5
  category: 'math' | 'chinese' | 'english' | 'science' | 'general'
  options: QuestionOption[]  // 每个选项标记是否正确
  imageUrl?: string
}
```

---

## 9. 海上探险系统

> **版本**: 1.2 新增
> **状态**: P0 设计完成，待实现

### 9.1 区域布局（每个大洋）

```
        [隐藏区域H]
            |
    [区域4]─[区域5]─[区域6]
     |   \  |  /   |
[隐藏区域A] [区域7] [隐藏区域B]
     |   /  |  \   |
    [区域1]─[区域2]─[区域3]
              |
         [区域8/boss]
```

| 区域类型 | 数量 | 说明 |
|---------|------|------|
| 小boss区域 | 9个 | 分3组，每组3个，渐进解锁 |
| 隐藏区域 | 3个 | A、B、H，需钥匙解锁 |
| 大boss区域 | 1个 | 9个小boss全清后解锁 |
| **合计** | **13个** | 每个大洋 |

### 9.2 探索状态机

```typescript
type ExplorationPhase =
  | 'exploring'        // 选择目的地
  | 'moving'           // 移动动画
  | 'encounter'        // 遭遇判定
  | 'battle'           // 战斗中
  | 'hidden_area'      // 进入隐藏区域
  | 'treasure'         // 宝箱/奖励
  | 'portal_appear'    // 传送门出现
  | 'boss_appearing'   // 大Boss出现
  | 'victory'          // 区域胜利
  | 'error'            // 异常状态
  | 'rollback'         // 回滚状态
```

**状态转换**:
```
EXPLORING → (点击区域) → MOVING → ENCOUNTER
                                    ↓
              ┌─────────────────────┼─────────────────────┐
              ↓                     ↓                     ↓
          BATTLE              HIDDEN_AREA            TREASURE
       (普通boss)           (有钥匙+隐藏区)          (宝箱)
              ↓                     ↓                     ↓
         VICTORY              VICTORY                VICTORY
              ↓                     ↓                     ↓
       PORTAL_APPEAR ←───── PORTAL_APPEAR ←───── PORTAL_APPEAR
              ↓
         (选择传送门)
              ↓
         EXPLORING
```

### 9.3 钥匙机制

| 属性 | 设计 |
|------|------|
| **来源** | 击败小boss时 30% 概率掉落 |
| **用途** | 解锁隐藏区域入口 |
| **效果** | 永久解锁（消耗钥匙后记录已解锁状态） |

### 9.4 遭遇判定

| 区域类型 | 规则 |
|---------|------|
| **普通小boss区域** | 100% 遭遇小boss |
| **隐藏区域** | 100% 遭遇特殊怪物 |
| **宝箱区域** | 直接获得奖励，无战斗 |
| **隐藏事件** | 20% 概率触发（支线故事/额外奖励） |

### 9.5 传送门机制

**生成规则**:
- 击败小boss后出现 2-3 个传送门
- **约束**: 至少 1 个通向未完成区域（防止卡关）
- 其余传送门通向：已通过区域 / 隐藏区域 / 随机事件

**持久化**: 存储 `portalSeed` 到存档，重启后重建传送门，保证存档一致性

### 9.6 状态机文件结构

```
src/game/
├── ExplorationStateMachine.ts   # 状态机核心（纯函数）
├── types.ts                    # ExplorationPhase 类型定义
└── transitions.ts              # 状态转换规则
```

---

## 10. 技术决策（红蓝对抗后确认）

### 10.1 状态管理

| 项目 | 决策 |
|------|------|
| **方案** | Zustand（统一） |
| **原因** | 代码已迁移，比 Context 更轻量，支持 DevTools |
| **文档更新** | CLAUDE.md 同步更新为 Zustand |

### 10.2 渲染方案

| 项目 | 决策 |
|------|------|
| **方案** | React-Three-Fiber + OrthographicCamera |
| **字体** | 思源黑体 (Source Han Sans) |
| **风险** | troika-three-text 中文支持需提前验证 |
| **验证** | 开发初期搭建 Prototype 验证文字渲染 |

### 10.3 错误处理与回滚

| 项目 | 决策 |
|------|------|
| **异常状态** | 自动回滚到上一个稳定状态 |
| **重试次数** | 最多3次 |
| **回滚目标** | 上一个已完成的区域 |
| **存档点** | 战斗胜利后、区域解锁后、获得宝箱后 |

### 10.4 资源加载策略

| 阶段 | 策略 |
|------|------|
| **首次加载** | 基础资源（UI、字体、通用音效）先加载 |
| **按需加载** | 每个大洋/区域资源使用时再加载 |
| **预加载** | 玩家进入传送门时预加载下一个区域 |

**技术实现**:
- 使用 React Suspense + `useLoader` 懒加载
- 资源缓存到 IndexedDB
- Loading 界面显示进度条

### 10.5 题目系统接口

```typescript
// 题目接口（预留）
interface QuestionProvider {
  getQuestion(params: {
    area: KnowledgeArea
    difficulty: 1 | 2 | 3
    grade: number
  }): Promise<Question>
}

// 实现
class LocalQuestionProvider implements QuestionProvider { /* 本地基座题 */ }
class LLMQuestionProvider implements QuestionProvider { /* 大模型生成 */ }
```

### 10.6 传送门 Seed 机制

```typescript
// 传送门生成
interface PortalConfig {
  seed: number          // 随机种子
  portals: Portal[]      // 生成的传送门
  generatedAt: number    // 生成时间
}

// Seed 生成规则
const generatePortalSeed = (areaId: string, timestamp: number): number => {
  return hashCode(areaId) + timestamp
}
```

### 10.7 UI 交互规则

| 交互 | 状态 |
|------|------|
| **未解锁区域** | 完全隐藏，发现后才显示 |
| **已解锁未完成** | 正常显示，可点击 |
| **已完成** | 正常显示 + ✅ 标记，可重复探索 |
| **选中状态** | 边框高亮 + 放大动画 |
| **悬停状态** | 显示区域名称tooltip |

---

## 11. 知识区域系统

> **版本**: 1.2 新增
> **状态**: P1 设计完成

### 11.1 知识区域定义

每个大洋包含 **4个固定知识区域**：

| 区域 | 难度1 ⭐ | 难度2 ⭐⭐ | 难度3 ⭐⭐⭐ |
|------|---------|---------|-----------|
| **数学 (Math)** | 基础运算 | 应用题 | 综合挑战 |
| **语文 (Chinese)** | 识字 | 阅读理解 | 写作 |
| **英语 (English)** | 单词 | 句子 | 对话 |
| **综合 (Comprehensive)** | 跨领域大boss | - | - |

### 11.2 玩家年龄适配

- 系统根据玩家设置的年龄/年级
- 自动生成对应年级的题目
- 家长可在控制台设置题目难度范围

### 11.3 难度降级机制

| 参数 | 值 |
|------|---|
| **触发条件** | 某个关卡5次不能通过 |
| **降级幅度** | 降1级难度 |
| **最低难度** | 难度1 |

```typescript
const DIFFICULTY_ADJUSTMENT = {
  maxAttemptsBeforeDowngrade: 5,
  downgradeLevel: 1  // 降一级
}
```

---

## 12. 实施阶段

### Phase 1: 基础框架
- 项目初始化（Vite + React + R3F）
- 状态管理（Zustand）
- 数据层（海洋/怪物/题目JSON）
- 标题界面

### Phase 2: 核心战斗
- 战斗场景UI
- 题目显示与答题
- HP伤害计算
- 战斗状态机

### Phase 3: 技能系统
- 技能数据模型
- 技能触发逻辑
- 技能特效（VFX）
- 组合技能

### Phase 4: 难度与合作
- 动态难度调整
- 双人合作模式
- 家长控制台

### Phase 5: 打磨与升级
- 渲染升级路径
- 音效/音乐
- 存档系统

---

## 13. 验收标准

- [ ] 游戏可在浏览器运行
- [ ] 可选择5个海洋区域
- [ ] 战斗系统正确计算HP
- [ ] 技能在正确连击数触发
- [ ] 题目根据难度正确筛选
- [ ] 家长可配置游戏参数
- [ ] 可切换2D/3D渲染（同一场景）
- [ ] 海上探险机制正常运行
- [ ] 知识区域按年龄适配
- [ ] 难度降级机制生效
