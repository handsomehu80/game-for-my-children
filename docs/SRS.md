# 波吉王子海洋探险 - 需求规格说明书 (SRS v1.0)

> 本文档是 game-for-my-children 项目的核心需求规格，定义产品定位、功能需求、非功能需求及验收标准。

---

## 一、产品定位与愿景

### 1.1 产品名称
**波吉王子海洋探险** (Prince Boji's Ocean Adventure)

### 1.2 核心定位
儿童教育游戏 - **帮助孩子真正理解和掌握知识**

### 1.3 差异化价值
> 学习效果可追踪，家长能针对性辅导

### 1.4 目标用户
| 用户 | 说明 |
|------|------|
| 主用户 | 1-9年级孩子（随年龄成长） |
| 使用场景 | 两个孩子（不同年级）合作探险 |
| 家长 | 查看学习报告，了解薄弱点 |

### 1.5 核心场景
```
两个孩子（年龄不同、年级不同）一起玩合作模式
→ 各自回答适配自己年级的题目
→ 共同击败怪物
→ 家长查看学习报告和薄弱点
```

---

## 二、知识体系

### 2.1 L3结构
基于中国9年义务教育课程标准，采用L3知识点结构：

```
L3 = 科目/领域/专题/具体知识点
示例：数学/数与代数/整数/两位数加法
```

详见: `docs/knowledge-taxonomy.json`

### 2.2 覆盖科目

| 科目 | 年级 | 题目数量 | 知识点数 |
|------|------|----------|----------|
| 数学 | 1-9 | ~816 | ~50 |
| 语文 | 1-9 | ~1022 | ~40 |
| 英语 | 3-9 | ~1043 | ~30 |
| 科学(小) | 3-6 | ~288 | ~15 |
| 物理(初) | 8-9 | ~349 | ~15 |
| 化学(初) | 9 | ~350 | ~10 |
| 历史 | 7-9 | ~340 | ~15 |
| **总计** | **1-9** | **~4208** | **~175** |

### 2.3 题目标注
每道题目已标注 `knowledgePointId`，关联知识图谱。

---

## 三、核心功能需求

### 3.1 学习追踪系统

#### 3.1.1 玩家学习画像 (PlayerLearningProfile)
```typescript
interface PlayerLearningProfile {
  playerId: string
  playerName: string
  grade: number                    // 当前年级
  
  knowledgeProfile: {
    [knowledgePointId: string]: {
      totalAttempts: number         // 总答题次数
      correctCount: number          // 正确次数
      masteryRate: number          // 掌握度 (0-1)
      level: '未掌握' | '学习中' | '基本掌握' | '熟练'
      lastPracticed: string         // 上次练习时间
      weakQuestions: string[]       // 错题ID列表
    }
  }
  
  overallStats: {
    totalQuestions: number
    correctRate: number
    strongestSubject: string
    weakestSubject: string
    recommendedFocus: string[]     // 推荐加强的知识点
  }
  
  adaptiveState: {
    currentDifficulty: number        // 系统评估的当前水平
    targetDifficulty: number        // 稳步提升目标
    optimalChallengeRate: number    // 目标正确率 (0.7)
  }
}
```

#### 3.1.2 答题记录 (AnswerRecord)
```typescript
interface AnswerRecord {
  id: string
  playerId: string
  questionId: string
  knowledgePointId: string         // L3知识点ID
  
  isCorrect: boolean
  answerIndex: number
  timeUsed: number                  // 答题用时(ms)
  difficulty: number
  
  battleContext: 'single' | 'co-op'
  coOpRole?: 'solo' | 'primary' | 'secondary'
  
  answeredAt: string                // ISO timestamp
}
```

#### 3.1.3 掌握度计算 (贝叶斯方法)
采用 Beta-Binomial 共轭模型：

```
P(θ) ~ Beta(α, β)
后验: θ | data ~ Beta(α + correct, β + incorrect)

掌握度等级:
- 未掌握: 0.0 - 0.3
- 学习中了: 0.3 - 0.6  
- 基本掌握: 0.6 - 0.8
- 熟练: 0.8 - 1.0
```

时间衰减因子 λ=0.05 模拟遗忘曲线。

---

### 3.2 自适应题目推荐

#### 3.2.1 推荐算法 (UCB + 薄弱点优先)
```typescript
function getRecommendedQuestion(
  playerId: string,
  excludeIds: string[],
  targetCategory?: string
): Question {
  const profile = getLearningProfile(playerId)
  
  // 1. 找薄弱知识点（正确率最低的Top 3）
  const weakKps = profile.getWeakKnowledgePoints(limit=3)
  
  // 2. 从薄弱知识点中选择题目
  const candidates = allQuestions.filter(q =>
    weakKps.includes(q.knowledgePointId) &&
    !excludeIds.includes(q.id) &&
    q.difficulty <= profile.currentDifficulty + 1
  )
  
  // 3. UCB排序（平衡探索与利用）
  const ucbScores = candidates.map(q => {
    constKp = getKnowledgePoint(q.knowledgePointId)
    const ucb = ifKp.masteryRate + 
                 Math.sqrt(2 * Math.log(total) / ifKp.totalAttempts)
    return { question: q, score: ucb }
  })
  
  return ucbScores.sort((a, b) => b.score - a.score)[0].question
}
```

#### 3.2.2 难度动态匹配
- 目标：正确率维持在 **70%**（心流区）
- 连续答对 → 提升推荐难度
- 连续答错 → 降低推荐难度

---

### 3.3 合作模式 (Co-op Battle)

#### 3.3.1 机制设计
```
场景: 7岁(2年级) + 12岁(6年级) 一起探险

┌─────────────────────────────────────────┐
│           怪物: 知识Boss                │
│              HP: 1000                   │
└─────────────────────────────────────────┘

玩家1 (7岁)     玩家2 (12岁)
HP: 100         HP: 100
伤害: 50/题     伤害: 100/题
(基础)          (基础×2)
```

#### 3.3.2 回合流程
1. **玩家1答题** → 玩家2答题 → 玩家1答题 → ...
2. 各自回答适配自己年级的题目
3. 答对 → 扣怪物HP（按题目难度加成）
4. 答错 → 扣自己HP
5. 一人HP归零 → 退出战斗，队友继续
6. 怪物HP归零 → 胜利！

#### 3.3.3 伤害计算
```
基础伤害: P1=50, P2=100
难度加成: 基础伤害 × (1 + difficulty × 0.5)
Combo加成: 连续答对3题 ×1.5
```

#### 3.3.4 合作模式学习追踪
```typescript
interface CoOpSession {
  sessionId: string
  players: {
    playerId: string
    role: 'primary' | 'secondary'  // 按年龄/年级区分
    contribution: number           // 个人贡献分
    questionsAnswered: string[]   // 答题记录IDs
  }[]
  
  monsterDamageDealt: number
  victory: boolean
  startedAt: string
  endedAt: string
}
```

---

### 3.4 家长Dashboard

#### 3.4.1 页面功能
```
┌─────────────────────────────────────────────────────────────┐
│ 👋 欢迎，{家长称呼}                                         │
│ 孩子本周学习报告                          [日期范围选择]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📈 本周概览                                                │
│  答题数 | 正确率 | 用时                                    │
│                                                             │
│  📚 知识点掌握分析                                          │
│  🔴 薄弱 | 🟡 待巩固 | 🟢 熟练                              │
│                                                             │
│  📝 错题本                                                  │
│  本周新错题列表 + 知识点关联                                │
│                                                             │
│  💡 提升建议                                                │
│  针对薄弱点的练习建议                                        │
│                                                             │
│  ⏰ 游戏时间                                                │
│  今日用时 / 上限设置                                        │
└─────────────────────────────────────────────────────────────┘
```

#### 3.4.2 API端点
| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/parent/:playerId/summary` | GET | 本周学习概览 |
| `/api/parent/:playerId/weak-points` | GET | 薄弱知识点列表 |
| `/api/parent/:playerId/progress` | GET | 进步趋势 |
| `/api/parent/:playerId/mistakes` | GET | 错题本 |
| `/api/parent/:playerId/recommendations` | GET | 提升建议 |
| `/api/parent/:playerId/settings` | GET/PUT | 时间设置 |

详见: `docs/learning-tracking-design.md`

---

### 3.5 健康游戏

#### 3.5.1 时长控制
```typescript
interface GamingSession {
  playerId: string
  startTime: string
  accumulatedMinutes: number
  dailyLimitMinutes: number         // 家长设置
  isPaused: boolean
}

// 检查规则
// 45分钟: 提醒休息
// 60分钟: 强制休息30分钟
// 中国《未成年人保护法》合规
```

---

## 四、非功能需求

### 4.1 性能
| 指标 | 要求 |
|------|------|
| 页面加载 | < 3秒 |
| 题目加载 | < 500ms |
| 答题响应 | < 100ms |
| 并发用户 | 支持2-4人合作 |

### 4.2 数据持久化
- 玩家进度: localStorage + 云端同步
- 学习记录: 云端数据库
- 离线支持: 基础功能离线可用

### 4.3 安全
- 儿童内容过滤
- 无广告
- 无内购诱导
- 家长控制机制

---

## 五、技术架构

详见设计文档:
- `docs/multiplayer-battle-technical-design.md` - 多人对战技术设计
- `docs/learning-tracking-design.md` - 学习追踪系统设计
- `docs/knowledge-taxonomy.json` - 知识图谱数据

---

## 六、验收标准

### 6.1 学习追踪
- [ ] 每道答题结果记录到知识点级别
- [ ] 家长Dashboard显示薄弱知识点
- [ ] 掌握度计算正确反映答题历史

### 6.2 自适应
- [ ] 推荐算法优先选择薄弱知识点
- [ ] 难度动态调整，保持~70%正确率

### 6.3 合作模式
- [ ] 两个不同年级孩子可组队
- [ ] 各自获得适配年级的题目
- [ ] 个人HP独立，怪物共享

### 6.4 健康游戏
- [ ] 游戏时长追踪
- [ ] 超时提醒/限制

---

## 版本历史

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| v1.0 | 2026-06-20 | 初始版本，基于需求澄清 |

---

*本文档是 game-for-my-children 项目的核心需求基准，所有开发工作应以此为准。*
