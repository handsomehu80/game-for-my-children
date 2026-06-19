# 题库重构设计方案

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 重构题库系统，按category构建，每个category+grade+difficulty组合30道题，均匀分布，所有大洋共用。

---

## 1. 背景与问题

### 当前问题
- difficulty 和 grade 混淆：D1只有grade 1-3的题，无法满足"每个grade在每个difficulty下均匀分布"
- 跨大洋题目隔离逻辑复杂
- 选题时参数传递错误（subject vs category）

### 需求
- 7个学科题库：语文、数学、英语、科学、物理、化学、历史
- 每学科覆盖特定年级
- 每个 category+grade+difficulty 组合 = 30道题
- 答案分布均匀（A/B/C/D各25%±2%）
- 跨大洋共用题库，按ID排除已使用题目

---

## 2. 题库结构设计

### 学科覆盖年级

| 学科 | 覆盖年级 | 说明 |
|------|----------|------|
| 语文 | 1-9 | 小学+初中 |
| 数学 | 1-9 | 小学+初中 |
| 英语 | 1-9 | 小学+初中 |
| 科学 | 3-6 | 小学科学 |
| 物理 | 7-9 | 初中物理 |
| 化学 | 7-9 | 初中化学 |
| 历史 | 7-9 | 初中历史 |

### 题目规模估算

| 学科 | 年级数 | 难度数 | 每组合题数 | 小计 |
|------|--------|--------|------------|------|
| 语文 | 9 | 3 | 30 | 810 |
| 数学 | 9 | 3 | 30 | 810 |
| 英语 | 9 | 3 | 30 | 810 |
| 科学 | 4 | 3 | 30 | 360 |
| 物理 | 3 | 3 | 30 | 270 |
| 化学 | 3 | 3 | 30 | 270 |
| 历史 | 3 | 3 | 30 | 270 |
| **总计** | | | | **3600** |

### 题目ID格式

```
{subject}_{grade}_{difficulty}_{seq}
```

示例：
- `chinese_5_1_001` - 语文5年级入门第1题
- `math_8_3_030` - 数学8年级挑战第30题
- `physics_9_2_015` - 物理9年级进阶第15题

### 题目Schema

```typescript
interface Question {
  id: string                    // 格式: {subject}_{grade}_{difficulty}_{seq}
  content: string               // 题目内容
  type: 'single' | 'fill'      // single=单选, fill=填空
  difficulty: 1 | 2 | 3         // 1=入门, 2=进阶, 3=挑战
  category: 'chinese' | 'math' | 'english' | 'science' | 'physics' | 'chemistry' | 'history'
  grade: number                 // 1-9
  options?: QuestionOption[]     // 单选题选项，填空题无此字段
  answer?: string               // 填空题答案
}

interface QuestionOption {
  text: string
  isCorrect: boolean
}
```

### 题型分布

- **D1/D2**：单选题100%，每题4选项
- **D3**：单选题90%，填空题10%（填空题答案必须准确唯一）

---

## 3. 选题逻辑设计

### 选题函数签名

```typescript
function getQuestion(options: {
  category: string      // 学科
  grade: number        // 年级 (1-9)
  difficulty: number   // 难度 (1-3)
  excludeIds?: string[] // 已使用题目ID列表
}): Question | null
```

### 选题流程

1. 根据 category+grade+difficulty 筛选题库
2. 排除 excludeIds 中已使用题目
3. 随机返回一道题
4. 如果该组合无题可返回，尝试降级（同级内grade向下兼容）或返回null

### 岛屿难度与题目难度映射

| 岛屿难度 | 题目difficulty |
|----------|----------------|
| 入门(D1) | 1 |
| 进阶(D2) | 2 |
| 挑战(D3) | 3 |

---

## 4. 答案分布设计

### 单选题答案分布规则

- 每30道题中，A/B/C/D正确答案各约7-8道（允许±2%偏差）
- 即每组合：7-8道选A，7-8道选B，7-8道选C，7-8道选D
- 偏差范围：约23%-27%

### 填空题要求（D3少量）

- 答案必须准确唯一
- 不接受模糊答案
- 示例："秦始皇" ✓，"秦王" ✗

---

## 5. 题库文件结构

### 当前结构（待改造）

```
src/data/questions/
├── ocean/           # 按大洋隔离（需废弃）
│   ├── east.ts
│   ├── west.ts
│   └── ...
├── graded/          # 按年级分类（需废弃）
└── questions.ts     # 旧题库
```

### 新结构

```
src/data/questions/
├── index.ts                    # 统一导出
├── subjects/
│   ├── chinese.ts              # 语文题库（1-9年级）
│   ├── math.ts                # 数学题库（1-9年级）
│   ├── english.ts             # 英语题库（1-9年级）
│   ├── science.ts             # 科学题库（3-6年级）
│   ├── physics.ts             # 物理题库（7-9年级）
│   ├── chemistry.ts           # 化学题库（7-9年级）
│   └── history.ts             # 历史题库（7-9年级）
└── QuestionSelector.ts         # 选题器
```

### 题库文件格式示例

```typescript
// src/data/questions/subjects/math.ts

export const mathQuestions: Question[] = [
  // 一年级数学 - 入门
  { id: 'math_1_1_001', content: '1 + 1 = ?', type: 'single', difficulty: 1, category: 'math', grade: 1, options: [
    { text: '1', isCorrect: false },
    { text: '2', isCorrect: true },  // B
    { text: '3', isCorrect: false },
    { text: '4', isCorrect: false }
  ]},
  // ... 共30道

  // 一年级数学 - 进阶
  { id: 'math_1_2_001', content: '...', type: 'single', difficulty: 2, category: 'math', grade: 1, options: [...] },
  // ... 共30道

  // 一年级数学 - 挑战
  { id: 'math_1_3_001', content: '...', type: 'fill', difficulty: 3, category: 'math', grade: 1, answer: '10' },
  // ... 共30道（含填空题）

  // 二年级数学 - 入门
  { id: 'math_2_1_001', content: '...', type: 'single', difficulty: 1, category: 'math', grade: 2, options: [...] },
  // ... 共30道
]
```

---

## 6. 数据统计验证

### 验证规则（可编写测试）

1. 每个 category+grade+difficulty 组合 = 30道题
2. 单选题有且仅有4个选项
3. 每道单选题有且仅有1个正确答案
4. 每30道单选的答案分布：A/B/C/D各7-8道
5. 填空题有answer字段，非空
6. 所有ID唯一

---

## 7. 兼容性考虑

### 向后兼容

- 现有 `QuestionSelector.ts` 重写逻辑，但保持函数签名兼容
- 现有 battle flow 不需要修改
- `excludeIds` 机制保持不变

### 数据迁移策略

- **不要废弃旧题库**，而是将旧题库数据**复用迁移**到新结构
- 迁移后旧文件可保留引用，但数据逐步迁移

---

## 8. 实现步骤

### Phase 1: 选题器重构
1. 重写 `getRandomQuestion` 函数，按 category+grade+difficulty+excludeIds 筛选
2. 保持接口兼容，不改变外部调用
3. 验证选题逻辑正确

### Phase 2: 复用老题库数据
1. 迁移老题库（ocean/graded）到新结构 subjects/
2. 按新ID格式（`{subject}_{grade}_{difficulty}_{seq}`）重新编号
3. 验证数据完整性

### Phase 3: 数据补全与平衡
1. 补充各学科题库至每组合30道
2. 验证答案分布（A/B/C/D各7-8道）
3. D3添加填空题（10%比例）

### Phase 4: 测试与验证
1. 运行完整测试套件
2. 验证battle flow
3. 验证答案分布规则

---

## 9. 待确认

- [x] D3难度中填空题比例：10%
- [ ] 是否需要添加题目解析/答案提示字段？

---

## 10. 数据复用策略

### 老题库复用

现有题库数据（旧题库在 `ocean/` 和 `graded/`）**不要废弃**，而是迁移复用：

1. **数据迁移**：将老题库按新格式重组到 `subjects/` 目录
2. **格式转换**：
   - 老ID → 新ID（如 `east_math_1_001` → `math_1_1_001`）
   - 保持 difficulty、category、grade 不变
3. **增量补充**：老题库题量不足时，按新格式补充新题

### 迁移映射示例

| 老ID | 新ID | 说明 |
|------|------|------|
| `east_math_1_001` | `math_1_1_001` | 数学1年级入门第1题 |
| `west_chinese_2_015` | `chinese_2_2_015` | 语文2年级进阶第15题 |
| `southHot_science_3_008` | `science_6_3_008` | 科学6年级挑战第8题 |

### 复用优先级

1. **math、chinese、english** - 题量充足，优先复用
2. **science、physics、chemistry、history** - 题量较少，需增量补充
