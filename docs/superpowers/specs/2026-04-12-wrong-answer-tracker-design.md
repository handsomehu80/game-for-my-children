# 错题本与知识薄弱点看板 设计规格

## 概述

在答题过程中记录错误题目，并在战斗结算和独立看板中展示玩家的知识薄弱点分析。

---

## 1. 功能范围

| 功能 | 描述 |
|------|------|
| 错题记录 | 战斗中答错的题目自动记录到本地 |
| 知识看板 | 分析各科目掌握度和薄弱知识点 |
| 进步追踪 | 记录正确率历史变化 |

---

## 2. 数据结构

### 2.1 Question 接口扩展

```typescript
// src/game/types.ts

interface Question {
  // ... 现有字段
  knowledgeTag: string  // 新增：知识点标签，如'分数加减'、'力与运动'、'英文语法'
}
```

### 2.2 WrongAnswer 记录

```typescript
// src/game/types.ts

interface WrongAnswer {
  id: string                    // 唯一ID
  timestamp: number             // 记录时间戳

  // 题目信息
  questionId: string
  questionContent: string
  subject: string               // 科目
  knowledgeTag: string          // 知识点
  difficulty: number            // 难度
  grade: number                 // 年级

  // 答题信息
  correctAnswer: string        // 正确答案
  playerAnswer: string          // 玩家答案

  // 上下文
  oceanId: string               // 大洋ID
  areaId: string                // 岛屿ID
}
```

### 2.3 统计摘要

```typescript
// src/game/types.ts

interface KnowledgeStats {
  totalQuestions: number        // 总答题数
  correctCount: number          // 正确数
  wrongCount: number            // 错误数
  accuracy: number             // 正确率 0-100

  // 科目维度
  bySubject: {
    [subject: string]: {
      total: number
      correct: number
      accuracy: number
    }
  }

  // 知识点维度
  byKnowledgeTag: {
    [knowledgeTag: string]: {
      total: number
      wrong: number
      accuracy: number
    }
  }
}
```

---

## 3. 状态管理

### 3.1 Zustand Store 扩展

```typescript
// src/store/gameStore.ts

interface GameState {
  // ... 现有字段

  // 新增：错题记录
  wrongAnswers: WrongAnswer[]

  // 新增：历史统计快照（每次战斗后保存）
  statsHistory: {
    timestamp: number
    accuracy: number
    oceanId: string
  }[]
}

// Actions
type GameAction =
  // ... 现有actions

  | { type: 'RECORD_WRONG_ANSWER'; answer: WrongAnswer }
  | { type: 'CLEAR_WRONG_ANSWERS' }
  | { type: 'GET_KNOWLEDGE_STATS' }  // 返回 KnowledgeStats
```

### 3.2 持久化

```typescript
// 错题记录保存到 localStorage
const WRONG_ANSWERS_KEY = 'ocean_game_wrong_answers'
const STATS_HISTORY_KEY = 'ocean_game_stats_history'

// 最大保存条数：500条（超出时删除最旧的）
const MAX_WRONG_ANSWERS = 500
```

---

## 4. 触发时机

### 4.1 记录时机

| 时机 | 触发条件 | 动作 |
|------|---------|------|
| 答错时 | ANSWER_QUESTION 且答错 | RECORD_WRONG_ANSWER |
| 战斗结束时 | END_BATTLE | 快照本次统计到statsHistory |

### 4.2 展示时机

| 时机 | 内容 |
|------|------|
| 战斗结算后 | 本次战斗答题分析 + 薄弱点提示 |
| 主菜单"错题本" | 完整看板（科目掌握度+薄弱点+历史） |

---

## 5. 看板界面设计

### 5.1 战斗结算分析

```
┌─────────────────────────────────────┐
│         本次战斗分析                  │
├─────────────────────────────────────┤
│  正确率: 70%    用时: 2:30           │
│  ████████████░░░  7/10              │
├─────────────────────────────────────┤
│  ⚠️ 薄弱点提醒：                    │
│  • 分数乘法 - 错误2次                │
│  • 力与运动 - 错误1次               │
├─────────────────────────────────────┤
│  [查看完整报告]  [继续探索]          │
└─────────────────────────────────────┘
```

### 5.2 知识看板（主菜单入口）

```
┌─────────────────────────────────────┐
│  📊 知识掌握看板          [清除记录] │
├─────────────────────────────────────┤
│                                     │
│  【科目掌握度】                      │
│   语文  ████████████░░  80%        │
│   数学  ██████████░░░░  65%        │
│   英语  ██████████████  95%        │
│   科学  ████████░░░░░  55% ← 薄弱  │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  【薄弱知识点 TOP5】                 │
│   1. 分数乘法     - 错误12次         │
│   2. 力与运动     - 错误8次          │
│   3. 英文语法     - 错误6次          │
│   4. 化学反应     - 错误4次          │
│   5. 历史年代     - 错误3次          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  【进步曲线】                        │
│   ↑ 55% → 60% → 65% → 70%          │
│   最近4次战斗正确率持续上升📈         │
│                                     │
└─────────────────────────────────────┘
```

---

## 6. 组件设计

### 6.1 新增组件

| 组件 | 位置 | 职责 |
|------|------|------|
| KnowledgeDashboard | components/game/KnowledgeDashboard | 知识看板主组件 |
| SubjectMasteryChart | components/game/SubjectMasteryChart | 科目掌握度图表 |
| WeakPointList | components/game/WeakPointList | 薄弱点列表 |
| ProgressChart | components/game/ProgressChart | 进步曲线图 |
| BattleAnalysis | components/game/BattleAnalysis | 战斗结算分析弹窗 |

### 6.2 菜单入口

| 入口 | 位置 | 目标组件 |
|------|------|---------|
| 错题本按钮 | 主菜单 | KnowledgeDashboard |

---

## 7. 实施任务

### 7.1 类型定义

- [ ] 扩展 Question 接口添加 knowledgeTag
- [ ] 添加 WrongAnswer 和 KnowledgeStats 类型

### 7.2 状态管理

- [ ] gameStore 添加 wrongAnswers 和 statsHistory
- [ ] 添加 RECORD_WRONG_ANSWER action
- [ ] 添加 CLEAR_WRONG_ANSWERS action
- [ ] 实现持久化逻辑

### 7.3 战斗集成

- [ ] 在 ANSWER_QUESTION 处理中检测错误并记录
- [ ] 在 END_BATTLE 时保存统计快照

### 7.4 UI组件

- [ ] BattleAnalysis 战斗结算弹窗
- [ ] KnowledgeDashboard 主看板
- [ ] SubjectMasteryChart 科目图表
- [ ] WeakPointList 薄弱点列表
- [ ] ProgressChart 进步曲线

### 7.5 菜单集成

- [ ] 主菜单添加"错题本"入口

---

## 8. 验证标准

1. 答错题目后记录正确保存
2. 看板正确显示各科目正确率
3. 薄弱点按错误次数排序
4. 历史曲线正确显示进步趋势
5. localStorage 持久化正常工作
6. 现有测试通过

---

## 9. 完成条件

- [ ] 所有错题正确记录
- [ ] 知识看板完整显示3个分析维度
- [ ] 战斗结算显示本次分析
- [ ] 主菜单入口可用
- [ ] Build 无错误
