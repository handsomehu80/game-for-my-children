# 题库重构实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构题库系统，按category构建，每个category+grade+difficulty组合30道题，均匀分布，所有大洋共用。

**Architecture:** 7个学科题库按category组织，选题器按category+grade+difficulty+excludeIds筛选，老题库数据复用迁移到新结构。

**Tech Stack:** TypeScript, Vitest, React

---

## 文件结构

### 新结构

```
src/data/questions/
├── index.ts                    # 统一导出 allQuestions
├── subjects/
│   ├── chinese.ts              # 语文题库（1-9年级）
│   ├── math.ts                # 数学题库（1-9年级）
│   ├── english.ts             # 英语题库（1-9年级）
│   ├── science.ts             # 科学题库（3-6年级）
│   ├── physics.ts             # 物理题库（7-9年级）
│   ├── chemistry.ts           # 化学题库（7-9年级）
│   └── history.ts             # 历史题库（7-9年级）
└── QuestionSelector.ts         # 选题器（重构）
```

### 需要修改的文件

- `src/game/QuestionSelector.ts` - 重写 getRandomQuestion 函数
- `src/data/questions/index.ts` - 统一导出新题库
- `src/data/questions/subjects/` - 新建7个学科题库文件

---

## 实现步骤

### Task 1: 创建新题库目录结构

**Files:**
- Create: `src/data/questions/subjects/.gitkeep` (占位目录)
- Modify: `src/data/questions/index.ts`

- [ ] **Step 1: 创建 subjects 目录结构**

```bash
mkdir -p src/data/questions/subjects
touch src/data/questions/subjects/.gitkeep
```

- [ ] **Step 2: 修改 index.ts 统一导出新题库**

```typescript
import { chineseQuestions } from './subjects/chinese'
import { mathQuestions } from './subjects/math'
import { englishQuestions } from './subjects/english'
import { scienceQuestions } from './subjects/science'
import { physicsQuestions } from './subjects/physics'
import { chemistryQuestions } from './subjects/chemistry'
import { historyQuestions } from './subjects/history'

export const allQuestions = [
  ...chineseQuestions,
  ...mathQuestions,
  ...englishQuestions,
  ...scienceQuestions,
  ...physicsQuestions,
  ...chemistryQuestions,
  ...historyQuestions,
]

export { getRandomQuestion } from './QuestionSelector'
```

- [ ] **Step 3: Commit**

```bash
git add src/data/questions/subjects/ src/data/questions/index.ts
git commit -m "feat: create new question bank directory structure"
```

---

### Task 2: 创建数学题库（复用老题库数据）

**Files:**
- Create: `src/data/questions/subjects/math.ts`
- Test: `src/data/questions/subjects/math.test.ts`

**数据来源**: 旧题库 `src/data/questions/ocean/east.ts`, `west.ts` 等中的数学题目，按新ID格式 `math_{grade}_{difficulty}_{seq}` 重组

- [ ] **Step 1: 编写数学题库统计测试**

```typescript
// src/data/questions/subjects/math.test.ts
import { describe, it, expect } from 'vitest'
import { mathQuestions } from './math'

describe('math question bank', () => {
  // 验证每组合30道题
  it('should have 30 questions per grade+difficulty combination', () => {
    const combinations: Record<string, number> = {}
    mathQuestions.forEach(q => {
      const key = `${q.grade}_${q.difficulty}`
      combinations[key] = (combinations[key] || 0) + 1
    })
    Object.entries(combinations).forEach(([combo, count]) => {
      expect(count).toBe(30)
    })
  })

  // 验证答案分布
  it('should have balanced answer distribution', () => {
    const combinations: Record<string, number[]> = {}
    mathQuestions.forEach(q => {
      if (q.type === 'single') {
        const key = `${q.grade}_${q.difficulty}`
        const correctIndex = q.options?.findIndex(o => o.isCorrect)
        if (correctIndex !== undefined && correctIndex >= 0) {
          combinations[key] = combinations[key] || []
          combinations[key].push(correctIndex)
        }
      }
    })
    // A=0, B=1, C=2, D=3
    // 每30道题中A/B/C/D各7-8道（±2%）
    Object.entries(combinations).forEach(([combo, indices]) => {
      const dist = [0,0,0,0]
      indices.forEach(i => dist[i] = (dist[i] || 0) + 1)
      dist.forEach(count => {
        expect(count).toBeGreaterThanOrEqual(6)  // 至少6道
        expect(count).toBeLessThanOrEqual(9)      // 最多9道
      })
    })
  })
})
```

- [ ] **Step 2: 运行测试验证（应失败，数据不存在）**

```bash
npx vitest run src/data/questions/subjects/math.test.ts
```

- [ ] **Step 3: 创建 math.ts 文件，从旧题库迁移数据**

根据旧题库 `east_math_*`, `west_math_*` 等，按新格式 `math_{grade}_{difficulty}_{seq}` 重组

- [ ] **Step 4: 再次运行测试验证**

- [ ] **Step 5: Commit**

```bash
git add src/data/questions/subjects/math.ts src/data/questions/subjects/math.test.ts
git commit -m "feat: add math question bank with 270 questions (9 grades x 3 difficulties)"
```

---

### Task 3: 创建语文题库

**Files:**
- Create: `src/data/questions/subjects/chinese.ts`
- Test: `src/data/questions/subjects/chinese.test.ts`

**数据来源**: 旧题库 `east_chinese_*`, `west_chinese_*` 等

---

### Task 4: 创建英语题库

**Files:**
- Create: `src/data/questions/subjects/english.ts`
- Test: `src/data/questions/subjects/english.test.ts`

**数据来源**: 旧题库 `east_english_*`, `west_english_*` 等

---

### Task 5: 创建科学题库

**Files:**
- Create: `src/data/questions/subjects/science.ts`
- Test: `src/data/questions/subjects/science.test.ts`

**数据来源**: 旧题库 `southHot_science_*`, `northIce_science_*` 等

---

### Task 6: 创建物理、化学、历史题库

**Files:**
- Create: `src/data/questions/subjects/physics.ts`
- Create: `src/data/questions/subjects/chemistry.ts`
- Create: `src/data/questions/subjects/history.ts`

---

### Task 7: 重写选题器 QuestionSelector

**Files:**
- Modify: `src/game/QuestionSelector.ts`
- Test: `src/game/QuestionSelector.test.ts`

- [ ] **Step 1: 编写选题器测试**

```typescript
describe('getRandomQuestion', () => {
  it('should return question matching category+grade+difficulty', () => {
    const question = getRandomQuestion({
      category: 'math',
      grade: 5,
      difficulty: 2,
    })
    expect(question).toBeDefined()
    expect(question?.category).toBe('math')
    expect(question?.grade).toBe(5)
    expect(question?.difficulty).toBe(2)
  })

  it('should exclude already used questions', () => {
    const q1 = getRandomQuestion({ category: 'math', grade: 5, difficulty: 2 })
    const q2 = getRandomQuestion({
      category: 'math',
      grade: 5,
      difficulty: 2,
      excludeIds: [q1?.id]
    })
    expect(q1?.id).not.toBe(q2?.id)
  })

  it('should return null when no questions available', () => {
    // 使用大量 excludeIds 排除所有题目
    const allIds = Array.from({ length: 30 }, (_, i) => `math_5_2_${String(i+1).padStart(3,'0')}`)
    const result = getRandomQuestion({
      category: 'math',
      grade: 5,
      difficulty: 2,
      excludeIds: allIds
    })
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 2: 运行测试验证（应失败，函数未实现）**

- [ ] **Step 3: 重写 getRandomQuestion 函数**

```typescript
import { allQuestions } from '../data/questions'

export function getRandomQuestion(options: {
  category: string
  grade: number
  difficulty: number
  excludeIds?: string[]
}): Question | null {
  const { category, grade, difficulty, excludeIds = [] } = options

  // 筛选匹配的题目
  const available = allQuestions.filter(q =>
    q.category === category &&
    q.grade === grade &&
    q.difficulty === difficulty &&
    !excludeIds.includes(q.id)
  )

  if (available.length === 0) return null

  // 随机返回一道题
  return available[Math.floor(Math.random() * available.length)]
}
```

- [ ] **Step 4: 运行测试验证**

- [ ] **Step 5: Commit**

---

### Task 8: 更新 ExplorationMap 调用

**Files:**
- Modify: `src/components/game/ExplorationMap.tsx:213-218`

确保调用时传入正确的参数：

```typescript
// ExplorationMap.tsx 中的调用
const question = getRandomQuestion({
  oceanId: latestExplorationRef.current.currentOcean || 'east',
  difficulty: area.difficulty ?? null,
  grade: playerGrade,
  category: area.knowledgeArea === 'comprehensive' ? undefined : area.knowledgeArea as 'math' | 'chinese' | 'english' | 'science' | 'physics' | 'chemistry' | 'history',
})
```

注意：`oceanId` 参数保留但**不参与筛选**，只用于日志/调试

- [ ] **Step 1: 验证 ExplorationMap 调用正确**

- [ ] **Step 2: 运行 Battle Flow 测试**

- [ ] **Step 3: Commit**

---

### Task 9: 验证答案分布测试

**Files:**
- Create: `src/data/questions/answerDistribution.test.ts`

- [ ] **Step 1: 编写答案分布验证测试**

```typescript
import { describe, it, expect } from 'vitest'
import { allQuestions } from './index'

describe('answer distribution', () => {
  it('each grade+difficulty combo should have balanced A/B/C/D', () => {
    const combos = new Map<string, number[]>()

    allQuestions
      .filter(q => q.type === 'single')
      .forEach(q => {
        const key = `${q.category}_${q.grade}_${q.difficulty}`
        const correctIndex = q.options?.findIndex(o => o.isCorrect) ?? -1
        if (correctIndex >= 0) {
          combos.get(key)?.push(correctIndex) ?? combos.set(key, [correctIndex])
        }
      })

    combos.forEach((indices, combo) => {
      const dist = [0,0,0,0]
      indices.forEach(i => dist[i]++)
      dist.forEach(count => {
        expect(count).toBeGreaterThanOrEqual(6)
        expect(count).toBeLessThanOrEqual(9)
      })
    })
  })
})
```

- [ ] **Step 2: 运行测试**

- [ ] **Step 3: 修复不符合分布的组合**

- [ ] **Step 4: Commit**

---

## 迁移映射参考

| 老ID格式 | 新ID格式 | 示例 |
|----------|----------|------|
| `east_math_1_001` | `math_1_1_001` | 数学1年级D1第1题 |
| `west_math_2_015` | `math_4_2_015` | 数学4年级D2第15题 |
| `east_chinese_1_001` | `chinese_1_1_001` | 语文1年级D1第1题 |
| `southHot_science_3_008` | `science_6_3_008` | 科学6年级D3第8题 |

**注意**: 老题库中 difficulty 直接映射新 difficulty，grade 保持不变

---

## 学科覆盖年级参考

| 学科 | 覆盖年级 | 新文件 |
|------|----------|--------|
| 语文 | 1-9 | chinese.ts |
| 数学 | 1-9 | math.ts |
| 英语 | 1-9 | english.ts |
| 科学 | 3-6 | science.ts |
| 物理 | 7-9 | physics.ts |
| 化学 | 7-9 | chemistry.ts |
| 历史 | 7-9 | history.ts |
