# 波吉王子海洋探险 - 学习追踪系统架构设计

**Version:** 1.0  
**Date:** 2026-06-20  
**产品背景:** 儿童教育游戏，面向两个自家孩子的个性化学习追踪

---

## 1. 系统概述

### 1.1 设计目标

- 精准追踪L3知识点掌握程度（基于知识图谱中的叶子节点）
- 贝叶斯方法计算知识点掌握概率，支持小样本学习
- 自适应推荐引擎根据薄弱点智能选题
- 家长Dashboard提供清晰的薄弱点视图
- 合作模式（Co-op）下追踪两个孩子的个人贡献

### 1.2 核心模块

```
┌─────────────────────────────────────────────────────────────┐
│                      Learning Tracking System                │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Knowledge   │  Learner     │ Adaptive     │  Parent         │
│  Assessment  │  Profile     │ Recommender  │  Dashboard API  │
│  Engine      │  Manager     │              │                │
│  (Bayesian)  │              │              │                │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                    Data Layer (SQLite + Redis)               │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 数据模型

### 2.1 PlayerLearningProfile（玩家学习画像）

每个玩家一份，存储贝叶斯先验和后验参数。

```json
{
  "profileId": "plp_uuid",
  "playerId": "player_uuid",
  "createdAt": "2026-06-20T10:00:00Z",
  "updatedAt": "2026-06-20T12:30:00Z",
  "gradeLevel": 4,
  "subjects": ["chinese", "math", "english", "science"],

  "knowledgeMastery": {
    "<L3_kp_id>": {
      "attempts": 5,
      "correctCount": 3,
      "lastAttemptAt": "2026-06-20T11:45:00Z",
      "evidenceHistory": [
        {"timestamp": "2026-06-20T10:00:00Z", "result": "correct"},
        {"timestamp": "2026-06-20T10:15:00Z", "result": "incorrect"},
        {"timestamp": "2026-06-20T10:30:00Z", "result": "correct"}
      ],
      "bayesianParams": {
        "alpha": 4.0,
        "beta": 3.0
      },
      "masteryProbability": 0.57
    }
  },

  "sessionStats": {
    "totalSessions": 12,
    "totalQuestions": 145,
    "totalCorrect": 98,
    "averageAccuracy": 0.676,
    "studyTimeMinutes": 185,
    "lastSessionAt": "2026-06-20T11:50:00Z"
  },

  "weakPoints": ["chinese_reading_narrative_para_summary", "math_geometry_area_perimeter"],
  "strongPoints": ["chinese_vocabulary_pinyin", "math_number_arithmetic_multiplication_table"],
  "recommendedNext": ["chinese_reading_narrative_theme"]
}
```

### 2.2 AnswerRecord（答题记录）

每次答题产生一条记录，支持合作模式下的贡献归属。

```json
{
  "recordId": "ar_uuid",
  "playerId": "player_uuid",
  "sessionId": "session_uuid",
  "co-opSessionId": "coop_123",
  "contributionType": "solo | primary | secondary | assisted",
  "assistedBy": null,
  "questionId": "q_uuid",
  "knowledgePointId": "math_geometry_area_perimeter",
  "subject": "math",
  "difficulty": 5,
  "gradeLevel": 4,
  "questionContent": {
    "stem": "一个长方形长8厘米，宽5厘米，它的面积是____平方厘米",
    "options": ["13", "26", "40", "45"],
    "correctAnswer": "C"
  },
  "playerAnswer": "C",
  "isCorrect": true,
  "timeSpentSeconds": 45,
  "hintUsed": false,
  "attemptNumber": 1,
  "answeredAt": "2026-06-20T11:45:00Z",
  "answerSequenceInSession": 7,
  "sessionProgress": 0.65
}
```

### 2.3 Co-opSession（合作会话）

合作模式下的共享会话，关联两个玩家的个人贡献。

```json
{
  "co-opSessionId": "coop_uuid",
  "sessionName": "海洋探险-双人模式-珊瑚礁",
  "startedAt": "2026-06-20T14:00:00Z",
  "endedAt": "2026-06-20T14:35:00Z",
  "players": [
    {"playerId": "player_1", "contributionScore": 85, "questionsAnswered": 12, "correctRate": 0.75},
    {"playerId": "player_2", "contributionScore": 72, "questionsAnswered": 10, "correctRate": 0.60}
  ],
  "sharedKnowledgePoints": ["science_primary_life_animals", "science_primary_earth_structure"],
  "avgDifficulty": 4.5
}
```

---

## 3. 知识点掌握度计算 — 贝叶斯方法

### 3.1 为什么选择贝叶斯而非IRT

| 维度 | IRT | 贝叶斯 |
|------|-----|--------|
| 小样本适应性 | 需要大量数据收敛 | 少量数据即可更新后验 |
| 先验知识融合 | 不支持 | Beta-Binomial共轭自然表达 |
| 计算复杂度 | 高（需要参数估计） | 低（解析解） |
| 实时更新 | 困难 | 简单递归更新 |
| 儿童教育场景 | 过度工程化 | 非常适合 |

### 3.2 Beta-Binomial 模型

每个L3知识点建模为一次**成功率**的贝叶斯推断：

**先验分布：** `θ ~ Beta(α₀, β₀)`  
**默认先验：** `α₀ = 1, β₀ = 1`（均匀先验，对成功率无偏见）

**似然：** 每道题答对/答错服从 Bernoulli  
**后验：** 每次新证据到来后，后验参数更新为：

```
α_posterior = α_prior + correctCount
β_posterior = β_prior + incorrectCount
```

**掌握概率：** `P(mastered) = E[θ | data] = α_posterior / (α_posterior + β_posterior)`

### 3.3 掌握阈值与状态机

| 掌握概率范围 | 状态 | 颜色标识 | 行为 |
|-------------|------|---------|------|
| 0.00 - 0.30 | 未掌握 | 🔴 红色 | 优先推荐，基础难度 |
| 0.30 - 0.60 | 学习中 | 🟡 黄色 | 持续练习，适中难度 |
| 0.60 - 0.80 | 基本掌握 | 🟢 浅绿 | 巩固练习 |
| 0.80 - 1.00 | 熟练掌握 | ✅ 深绿 | 免试，进入下一知识点 |

**向上传播：** 父节点掌握概率 = 所有直接子节点掌握概率的加权平均（权重=题目数量推荐比例）

### 3.4 时间衰减因子

长时间未练习的知识点会逐渐向先验回归，模拟遗忘曲线：

```
decay_factor = exp(-λ * days_since_last_attempt)
mastery_effective = mastery_probability * decay_factor + 0.5 * (1 - decay_factor)
```

其中 `λ = 0.05`（可配置），表示每20天左右遗忘约63%。

### 3.5 合作模式下的贡献分割

合作模式下，一道题可能由两个孩子共同完成。系统记录每次答题的 `contributionType`：

- `solo`: 独立完成
- `primary`: 主要回答者（系统判定谁先选/谁输入答案）
- `secondary`: 辅助者（提供提示或确认）
- `assisted`: 在对方帮助下完成

**个人贡献分计算：**

```
contribution_score = solo_weight * solo_count 
                   + primary_weight * primary_count
                   + secondary_weight * secondary_count 
                   + assisted_weight * assisted_count
```

权重建议：`solo=4, primary=3, secondary=2, assisted=1`

---

## 4. 自适应推荐算法

### 4.1 推荐策略：UCB（Upper Confidence Bound）+ 薄弱点优先

每次选择下一题时，平衡** exploitation（已知薄弱点）** 和 **exploration（探索新领域）**：

```
Score(kp) = mastery_gap * w_gap 
          + sqrt(2 * ln(total_attempts) / attempts_on_kp) * w_ucb
          + novelty_bonus * w_novelty
```

其中：
- `mastery_gap = 1 - mastery_probability`（掌握度缺口，越大越优先）
- `w_gap = 0.5`（掌握度权重）
- `w_ucb = 0.3`（探索置信度权重，防止某知识点刷太多题）
- `w_novelty = 0.2`（新鲜度权重，推荐较少练习的知识点）

### 4.2 难度匹配

根据玩家当前各知识点的平均掌握概率，动态调整推荐题目难度：

```python
def recommend_difficulty(player_profile) -> int:
    avg_mastery = mean([kp['masteryProbability'] 
                        for kp in player_profile['knowledgeMastery'].values()])
    
    if avg_mastery < 0.3:
        return player_profile['gradeLevel']  # 匹配年级难度
    elif avg_mastery < 0.6:
        return player_profile['gradeLevel'] + 1  # 稍高难度
    else:
        return player_profile['gradeLevel'] + 2  # 挑战难度
```

### 4.3 推荐优先级规则

1. **薄弱点优先：** 掌握概率 < 0.3 的知识点优先推荐
2. **前置知识检查：** 推荐某知识点前，必须确认其父路径上的知识点已达到基本掌握（>0.4）
3. **每日平衡：** 每次会话尽量覆盖2-3个不同知识领域，避免单一领域刷题
4. **合作模式特殊规则：** 合作模式下，推荐同时涉及两个孩子薄弱点的题目

### 4.4 推荐结果缓存（Redis）

```
Key: recommendation:{playerId}:{sessionId}
TTL: 30 minutes
Value: [questionId, questionId, ...] (有序推荐列表)
```

---

## 5. 数据库 Schema

### 5.1 SQLite（持久化存储）

```sql
-- 玩家表
CREATE TABLE players (
    player_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar_id TEXT,
    grade_level INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    parent_user_id TEXT NOT NULL
);

-- 学习画像表
CREATE TABLE learning_profiles (
    profile_id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES players(player_id),
    knowledge_mastery_json TEXT NOT NULL,
    session_stats_json TEXT NOT NULL,
    weak_points_json TEXT NOT NULL,
    strong_points_json TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id)
);

-- 答题记录表
CREATE TABLE answer_records (
    record_id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES players(player_id),
    session_id TEXT,
    co_op_session_id TEXT,
    contribution_type TEXT DEFAULT 'solo',
    assisted_by TEXT,
    question_id TEXT NOT NULL,
    knowledge_point_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    difficulty INTEGER NOT NULL,
    grade_level INTEGER NOT NULL,
    question_content_json TEXT NOT NULL,
    player_answer TEXT NOT NULL,
    is_correct INTEGER NOT NULL,
    time_spent_seconds INTEGER,
    hint_used INTEGER DEFAULT 0,
    attempt_number INTEGER DEFAULT 1,
    answered_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_answer_player ON answer_records(player_id);
CREATE INDEX idx_answer_kp ON answer_records(knowledge_point_id);
CREATE INDEX idx_answer_session ON answer_records(session_id);
CREATE INDEX idx_answer_coop ON answer_records(co_op_session_id);

-- 合作会话表
CREATE TABLE co_op_sessions (
    co_op_session_id TEXT PRIMARY KEY,
    session_name TEXT,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    player_1_id TEXT NOT NULL,
    player_2_id TEXT NOT NULL
);

CREATE INDEX idx_coop_player1 ON co_op_sessions(player_1_id);
CREATE INDEX idx_coop_player2 ON co_op_sessions(player_2_id);

-- 题目表（题库）
CREATE TABLE questions (
    question_id TEXT PRIMARY KEY,
    knowledge_point_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    difficulty INTEGER NOT NULL,
    grade_level INTEGER NOT NULL,
    content_json TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    hint_json TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_question_kp ON questions(knowledge_point_id);
CREATE INDEX idx_question_difficulty ON questions(difficulty);
```

### 5.2 Redis（高频读写缓存）

| Key Pattern | Type | TTL | 用途 |
|------------|------|-----|------|
| `profile:{playerId}` | Hash | 1h | 当前学习画像热缓存 |
| `mastery:{playerId}:{kpId}` | String | 30min | 单知识点掌握概率 |
| `recommend:{playerId}:{sessionId}` | List | 30min | 推荐队列 |
| `session:{sessionId}:questions` | List | 2h | 会话内已出题记录 |
| `coop:{coOpSessionId}:state` | Hash | 4h | 合作会话实时状态 |
| `daily:{playerId}:{date}` | Hash | 48h | 当日学习数据汇总 |

---

## 6. 家长 Dashboard API

### 6.1 认证

所有API需要 `Authorization: Bearer <parent_token>` 头。

### 6.2 API 端点

#### GET /api/v1/dashboard/overview

**描述：** 获取所有孩子的学习总览

**响应：**
```json
{
  "children": [
    {
      "playerId": "player_1",
      "name": "大宝",
      "gradeLevel": 4,
      "todayStats": {
        "questionsAnswered": 25,
        "correctRate": 0.72,
        "studyMinutes": 35,
        "knowledgePointsCovered": 8
      },
      "weakPoints": [
        {
          "knowledgePointId": "chinese_reading_narrative_para_summary",
          "knowledgePointName": "概括段落大意",
          "masteryProbability": 0.22,
          "trend": "declining",
          "lastPracticedAt": "2026-06-19T15:00:00Z"
        }
      ],
      "subjectSummary": [
        {"subject": "chinese", "mastery": 0.65, "todayCorrect": 8, "todayTotal": 12},
        {"subject": "math", "mastery": 0.58, "todayCorrect": 6, "todayTotal": 8},
        {"subject": "english", "mastery": 0.71, "todayCorrect": 5, "todayTotal": 6}
      ]
    }
  ]
}
```

#### GET /api/v1/dashboard/weak-points/{playerId}

**描述：** 获取指定孩子的薄弱点详情

**查询参数：**
- `minThreshold`: float (default 0.3) — 掌握概率低于此值视为薄弱
- `subject`: string (optional) — 按科目过滤
- `limit`: int (default 10) — 返回数量

**响应：**
```json
{
  "playerId": "player_1",
  "weakPoints": [
    {
      "knowledgePointId": "math_geometry_area_perimeter",
      "knowledgePointName": "面积与周长",
      "subject": "math",
      "masteryProbability": 0.18,
      "attempts": 4,
      "correctCount": 1,
      "recentHistory": [
        {"date": "2026-06-20", "result": "incorrect"},
        {"date": "2026-06-20", "result": "incorrect"},
        {"date": "2026-06-19", "result": "correct"},
        {"date": "2026-06-19", "result": "incorrect"}
      ],
      "recommendedPracticeCount": 10,
      "parentGuidance": "建议先复习长方形和正方形的面积公式，再练习组合图形的面积计算。"
    }
  ],
  "totalWeakPoints": 5,
  "generatedAt": "2026-06-20T12:00:00Z"
}
```

#### GET /api/v1/dashboard/progress/{playerId}

**描述：** 获取学习进步趋势

**查询参数：**
- `period`: `week | month | semester` (default: week)
- `granularity`: `daily | subject | kp` (default: daily)

**响应：**
```json
{
  "playerId": "player_1",
  "period": "week",
  "trendData": [
    {"date": "2026-06-14", "avgMastery": 0.52, "questionsAnswered": 18},
    {"date": "2026-06-15", "avgMastery": 0.54, "questionsAnswered": 22},
    {"date": "2026-06-16", "avgMastery": 0.53, "questionsAnswered": 15},
    {"date": "2026-06-17", "avgMastery": 0.56, "questionsAnswered": 20},
    {"date": "2026-06-18", "avgMastery": 0.58, "questionsAnswered": 25},
    {"date": "2026-06-19", "avgMastery": 0.60, "questionsAnswered": 30},
    {"date": "2026-06-20", "avgMastery": 0.62, "questionsAnswered": 12}
  ],
  "improvementRate": "+19.2%",
  "masteredKnowledgePointsThisPeriod": 8,
  "newlyWeakPointsThisPeriod": 3
}
```

#### GET /api/v1/dashboard/compare

**描述：** 对比两个孩子的学习情况

**响应：**
```json
{
  "player1": {
    "playerId": "player_1",
    "name": "大宝",
    "avgMastery": 0.62,
    "strongestSubject": "english",
    "weakestSubject": "math"
  },
  "player2": {
    "playerId": "player_2",
    "name": "二宝",
    "avgMastery": 0.55,
    "strongestSubject": "chinese",
    "weakestSubject": "science"
  },
  "comparison": {
    "coOpSynergy": 0.78,
    "knowledgeOverlapRate": 0.65,
    "suggestions": "两个孩子可在'科学'科目上进行合作学习，互相帮助动物和地球结构知识点。"
  }
}
```

#### POST /api/v1/dashboard/practice-plan

**描述：** 家长手动创建练习计划

**请求：**
```json
{
  "playerId": "player_1",
  "focusKnowledgePoints": [
    "chinese_reading_narrative_para_summary",
    "math_geometry_area_perimeter"
  ],
  "dailyQuestionCount": 15,
  "startDate": "2026-06-21",
  "endDate": "2026-06-27",
  "priorityMode": "weakest_first"
}
```

**响应：**
```json
{
  "planId": "plan_uuid",
  "status": "created",
  "dailyDistribution": [
    {"date": "2026-06-21", "questions": 15, "focusKPs": ["chinese_reading_narrative_para_summary"]},
    {"date": "2026-06-22", "questions": 15, "focusKPs": ["math_geometry_area_perimeter"]},
    {"date": "2026-06-23", "questions": 15, "focusKPs": ["chinese_reading_narrative_para_summary", "math_geometry_area_perimeter"]}
  ]
}
```

#### GET /api/v1/dashboard/knowledge-tree/{playerId}

**描述：** 获取孩子的知识点掌握度树状图（用于可视化）

**响应：**
```json
{
  "playerId": "player_1",
  "knowledgeTree": {
    "id": "math",
    "name": "数学",
    "masteryProbability": 0.58,
    "children": [
      {
        "id": "math_number_algebra",
        "name": "数与代数",
        "masteryProbability": 0.65,
        "children": [
          {
            "id": "math_number_arithmetic",
            "name": "数的运算",
            "masteryProbability": 0.72,
            "children": [
              {
                "id": "math_number_arithmetic_addsub_1digit",
                "name": "一位数加减",
                "masteryProbability": 0.95,
                "status": "mastered"
              },
              {
                "id": "math_number_arithmetic_addsub_2digit",
                "name": "两位数加减",
                "masteryProbability": 0.78,
                "status": "proficient"
              }
            ]
          }
        ]
      },
      {
        "id": "math_geometry",
        "name": "图形与几何",
        "masteryProbability": 0.42,
        "children": [
          {
            "id": "math_geometry_area_perimeter",
            "name": "面积与周长",
            "masteryProbability": 0.18,
            "status": "weak"
          }
        ]
      }
    ]
  }
}
```

---

## 7. 合作模式下的个人贡献追踪

### 7.1 贡献类型判定

合作模式答题时，系统需要判断谁做出了主要贡献：

```python
def determine_contribution(player1_answer_time, player2_answer_time, 
                          player1_input_event, player2_input_event) -> dict:
    """
    判定贡献类型
    时间戳精度: 毫秒
    """
    if abs(player1_answer_time - player2_answer_time) < 500:
        # 几乎同时，以先提交输入为准
        first = player1 if player1_input_event < player2_input_event else player2
        return {"primary": first, "secondary": other}
    else:
        first = player1 if player1_answer_time < player2_answer_time else player2
        second = other
        return {"primary": first, "secondary": second}
```

### 7.2 贡献分数实时计算

合作会话中实时维护每个人的贡献分：

```python
def update_coop_contribution(coop_session_id, player_id, contribution_type):
    weights = {"solo": 4, "primary": 3, "secondary": 2, "assisted": 1}
    score_increment = weights[contribution_type]
    
    # 更新Redis中的合作会话状态
    redis.hincrby(f"coop:{coop_session_id}:scores", player_id, score_increment)
    redis.hincrby(f"coop:{coop_session_id}:counts", player_id, 1)
```

### 7.3 合作会话结束时的个人学习记录归属

当合作会话结束后，系统将答题记录归属到个人画像：

- **primary贡献的答题：** 正常计入个人掌握度计算
- **secondary贡献的答题：** 以0.5权重计入（因为有他人帮助）
- **assisted的答题：** 单独标记，不计入主掌握度（但记录在历史中供分析）

---

## 8. 技术实现建议

### 8.1 推荐题目选取伪代码

```python
def select_next_question(player_id, session_id, exclude_kp_ids=None):
    profile = get_cached_profile(player_id)
    available_kps = get_available_knowledge_points(profile, exclude_kp_ids)
    
    scores = {}
    for kp_id in available_kps:
        mastery = profile.knowledge_mastery.get(kp_id, {}).get('masteryProbability', 0.5)
        attempts = profile.knowledge_mastery.get(kp_id, {}).get('attempts', 0)
        
        gap_score = (1 - mastery) * 0.5
        ucb_score = math.sqrt(2 * math.log(profile.total_questions + 1) / (attempts + 1)) * 0.3
        
        scores[kp_id] = gap_score + ucb_score
    
    target_kp = max(scores, key=scores.get)
    target_difficulty = calculate_difficulty(profile)
    
    candidates = question_db.query(
        knowledge_point_id=target_kp,
        difficulty=target_difficulty,
        not_in_session=session_id
    )
    
    return candidates.random_select()
```

### 8.2 贝叶斯更新伪代码

```python
def update_mastery(player_id, kp_id, is_correct):
    profile = get_profile(player_id)
    kp_data = profile.knowledge_mastery.get(kp_id, {
        'attempts': 0, 'correctCount': 0,
        'bayesianParams': {'alpha': 1.0, 'beta': 1.0}
    })
    
    alpha, beta = kp_data['bayesianParams']['alpha'], kp_data['bayesianParams']['beta']
    new_alpha = alpha + (1 if is_correct else 0)
    new_beta = beta + (0 if is_correct else 1)
    
    mastery_prob = new_alpha / (new_alpha + new_beta)
    
    # 应用时间衰减
    days_since = (now - kp_data['lastAttemptAt']).days
    decay_factor = math.exp(-0.05 * days_since)
    mastery_effective = mastery_prob * decay_factor + 0.5 * (1 - decay_factor)
    
    profile.knowledge_mastery[kp_id] = {
        'attempts': kp_data['attempts'] + 1,
        'correctCount': kp_data['correctCount'] + (1 if is_correct else 0),
        'lastAttemptAt': now,
        'bayesianParams': {'alpha': new_alpha, 'beta': new_beta},
        'masteryProbability': mastery_effective
    }
    
    update_weak_strong_points(profile)
    cache_profile(player_id, profile)
```

---

## 9. 配置参数汇总

| 参数 | 默认值 | 说明 |
|-----|-------|------|
| `bayesian.alpha_prior` | 1.0 | Beta先验 alpha |
| `bayesian.beta_prior` | 1.0 | Beta先验 beta |
| `mastery.threshold.weak` | 0.3 | 未掌握阈值 |
| `mastery.threshold.learning` | 0.6 | 学习中的阈值 |
| `mastery.threshold.proficient` | 0.8 | 熟练阈值 |
| `forget.decay_lambda` | 0.05 | 遗忘曲线衰减率 |
| `forget.half_life_days` | ~14 | 遗忘半衰期 |
| `recommend.gap_weight` | 0.5 | 掌握度缺口权重 |
| `recommend.ucb_weight` | 0.3 | UCB探索权重 |
| `recommend.novelty_weight` | 0.2 | 新鲜度权重 |
| `coop.weights.solo` | 4 | 独立完成权重 |
| `coop.weights.primary` | 3 | 主要贡献权重 |
| `coop.weights.secondary` | 2 | 次要贡献权重 |
| `coop.weights.assisted` | 1 | 辅助完成权重 |
| `cache.profile_ttl` | 3600 | 画像缓存TTL（秒） |
| `cache.recommend_ttl` | 1800 | 推荐缓存TTL（秒） |

---

## 10. 未来扩展

1. **IRT融合：** 当数据量足够大（>500题/玩家）时，可引入IRT替代贝叶斯获得更精准的难度校准
2. **知识图谱增强：** 支持知识点间的先修关系图，用于学习路径推荐
3. **家长辅导建议生成：** 基于薄弱点自动生成辅导提示（可结合LLM）
4. **跨设备同步：** 支持平板、手机、PC间的进度同步
5. **同伴对比：** 与同龄孩子群体的平均掌握度对比（匿名化）

---

*文档结束*
