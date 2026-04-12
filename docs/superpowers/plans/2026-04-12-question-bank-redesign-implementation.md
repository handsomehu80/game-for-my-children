# 题库重构实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 重构题库为按大洋分离的结构，实现跨大洋题目隔离，配置难度fallback机制

**Architecture:** 新增 `src/data/questions/ocean/` 目录，按大洋组织独立题库。QuestionSelector优先从对应洋题库获取，按难度递减fallback。

**Tech Stack:** TypeScript, React, Zustand

---

## 文件结构

```
src/data/questions/
├── index.ts                      # 统一导出（修改）
├── ocean/                        # 新增目录
│   ├── index.ts                  # 导出各洋题库 + getOceanQuestionBank
│   ├── east.ts                   # 东大洋题库
│   ├── west.ts                   # 西大洋题库
│   ├── southHot.ts               # 南热洋题库
│   ├── northIce.ts               # 北冰洋题库
│   └── mysterious.ts             # 神秘洋题库
└── graded.ts                     # 旧全局题库（保留，不作fallback）
```

---

## Task 1: 创建题库类型定义和ocean目录结构

**Files:**
- Create: `src/data/questions/ocean/index.ts`
- Modify: `src/data/questions/index.ts`

- [ ] **Step 1: Create ocean question bank interface and exports**

```typescript
// src/data/questions/ocean/index.ts

import type { Question } from '../../../game/types'

export interface OceanQuestionBank {
  oceanId: string
  questions: Question[]

  // 按条件筛选题目
  getQuestions(options: {
    subject?: string
    difficulty?: number
    grade?: number
    excludeIds?: string[]
  }): Question[]

  // 获取题目总数
  getTotalCount(): number
}

// 获取指定大洋的题库
export function getOceanQuestionBank(oceanId: string): OceanQuestionBank | null

// 各洋题库导出
export const eastQuestionBank: OceanQuestionBank
export const westQuestionBank: OceanQuestionBank
export const southHotQuestionBank: OceanQuestionBank
export const northIceQuestionBank: OceanQuestionBank
export const mysteriousQuestionBank: OceanQuestionBank
```

- [ ] **Step 2: Modify questions/index.ts to export ocean banks**

```typescript
// src/data/questions/index.ts
export { getOceanQuestionBank, eastQuestionBank, westQuestionBank, southHotQuestionBank, northIceQuestionBank, mysteriousQuestionBank } from './ocean'
```

- [ ] **Step 3: Run build to verify**

Run: `npm run build`
Expected: BUILD SUCCEEDS (会有类型错误，因为eastQuestionBank等是空实现)

- [ ] **Step 4: Commit**

```bash
git add src/data/questions/ocean/ src/data/questions/index.ts
git commit -m "feat(questions): create ocean question bank structure"
```

---

## Task 2: 实现东大洋题库 (east.ts)

**Files:**
- Create: `src/data/questions/ocean/east.ts`

东大洋：3科目 × 100题 = 300题

| 科目 | D1(40) | D2(30) | D3(20) | D4(8) | D5(2) |
|------|--------|--------|--------|-------|-------|
| math | 40 | 30 | 20 | 8 | 2 |
| chinese | 40 | 30 | 20 | 8 | 2 |
| english | 40 | 30 | 20 | 8 | 2 |

- [ ] **Step 1: Create east.ts with basic structure**

```typescript
// src/data/questions/ocean/east.ts
import type { Question } from '../../../game/types'
import { createOceanQuestionBank } from './index'

const eastQuestions: Question[] = [
  // === MATH D1 (40题) ===
  { id: 'east_math_1_001', content: '1 + 1 = ?', type: 'single', difficulty: 1, category: 'math', options: [{text:'1',isCorrect:false},{text:'2',isCorrect:true},{text:'3',isCorrect:false},{text:'4',isCorrect:false}] },
  // ... 更多题目
]

export const eastQuestionBank = createOceanQuestionBank('east', eastQuestions)
```

- [ ] **Step 2: Add 20-30 sample questions per subject (not all 100) for initial testing**

Note: 完整300题将分批添加，此阶段先验证结构正确性

- [ ] **Step 3: Run build and test**

Run: `npm run build && npx vitest run --reporter=verbose`
Expected: BUILD SUCCEEDS, tests pass

- [ ] **Step 4: Commit**

```bash
git add src/data/questions/ocean/east.ts
git commit -m "feat(questions): add east ocean question bank (sample)"
```

---

## Task 3: 实现QuestionSelector适配

**Files:**
- Modify: `src/game/QuestionSelector.ts`

- [ ] **Step 1: Update getRandomQuestion to use ocean question banks**

```typescript
// src/game/QuestionSelector.ts

import { getOceanQuestionBank } from '../data/questions/ocean'
import { questionsData } from '../data/questions'

export function getRandomQuestion(options: QuestionSelectorOptions): Question | null {
  const { oceanId, difficulty, category, grade, subject, excludeIds = [] } = options

  // P0-5: Fallback to 1 if difficulty is null/undefined
  const effectiveDifficulty = difficulty ?? 1

  // 获取大洋难度范围
  const ocean = Object.values(oceansData).find(o => o.id === oceanId)
  if (!ocean) return null

  const [minDiff, maxDiff] = difficulty != null
    ? [effectiveDifficulty, effectiveDifficulty]
    : ocean.difficulty

  // 优先从对应大洋题库获取
  const oceanBank = getOceanQuestionBank(oceanId)
  if (oceanBank) {
    const questions = oceanBank.getQuestions({
      subject: subject as string,
      difficulty: effectiveDifficulty,
      grade,
      excludeIds,
    })

    if (questions.length > 0) {
      return questions[Math.floor(Math.random() * questions.length)]
    }

    // Fallback: 同一洋内按难度递减搜索
    for (let diff = effectiveDifficulty - 1; diff >= 1; diff--) {
      const fallback = oceanBank.getQuestions({
        subject: subject as string,
        difficulty: diff,
        grade,
        excludeIds,
      })
      if (fallback.length > 0) {
        return fallback[Math.floor(Math.random() * fallback.length)]
      }
    }

    // 同洋内所有难度都无题，返回null（不跨洋fallback）
    return null
  }

  // 兜底：使用旧题库（无ocean隔离）
  const filtered = questionsData.filter(q => {
    if (q.difficulty < minDiff || q.difficulty > maxDiff) return false
    if (category && category.length > 0) {
      if (q.category !== category) return false
    }
    if (excludeIds.includes(q.id)) return false
    return true
  })

  if (filtered.length === 0) return null
  return filtered[Math.floor(Math.random() * filtered.length)]
}
```

- [ ] **Step 2: Run build and tests**

Run: `npm run build`
Expected: BUILD SUCCEEDS

Run: `npx vitest run`
Expected: All 215 tests pass

- [ ] **Step 3: Commit**

```bash
git add src/game/QuestionSelector.ts
git commit -m "feat(questions): adapt QuestionSelector to use ocean question banks"
```

---

## Task 4: 创建其他大洋题库文件（框架）

**Files:**
- Create: `src/data/questions/ocean/west.ts`
- Create: `src/data/questions/ocean/southHot.ts`
- Create: `src/data/questions/ocean/northIce.ts`
- Create: `src/data/questions/ocean/mysterious.ts`

- [ ] **Step 1: Create west.ts (4科目, 400题)**

| 科目 | D1(30) | D2(28) | D3(25) | D4(12) | D5(5) |
|------|--------|--------|--------|-------|-------|
| math | 30 | 28 | 25 | 12 | 5 |
| chinese | 30 | 28 | 25 | 12 | 5 |
| english | 30 | 28 | 25 | 12 | 5 |
| science | 30 | 28 | 25 | 12 | 5 |

- [ ] **Step 2: Create southHot.ts (5科目, 500题)**

| 科目 | D1(20) | D2(25) | D3(30) | D4(18) | D5(7) |
|------|--------|--------|--------|-------|-------|
| math | 20 | 25 | 30 | 18 | 7 |
| chinese | 20 | 25 | 30 | 18 | 7 |
| english | 20 | 25 | 30 | 18 | 7 |
| science | 20 | 25 | 30 | 18 | 7 |
| history | 20 | 25 | 30 | 18 | 7 |

- [ ] **Step 3: Create northIce.ts (6科目, 600题)**

| 科目 | D1(10) | D2(18) | D3(30) | D4(27) | D5(15) |
|------|--------|--------|--------|-------|-------|
| math | 10 | 18 | 30 | 27 | 15 |
| chinese | 10 | 18 | 30 | 27 | 15 |
| english | 10 | 18 | 30 | 27 | 15 |
| science | 10 | 18 | 30 | 27 | 15 |
| physics | 10 | 18 | 30 | 27 | 15 |
| chemistry | 10 | 18 | 30 | 27 | 15 |

- [ ] **Step 4: Create mysterious.ts (7科目, 700题)**

| 科目 | D1(5) | D2(10) | D3(25) | D4(35) | D5(25) |
|------|-------|--------|--------|-------|-------|
| math | 5 | 10 | 25 | 35 | 25 |
| chinese | 5 | 10 | 25 | 35 | 25 |
| english | 5 | 10 | 25 | 35 | 25 |
| science | 5 | 10 | 25 | 35 | 25 |
| physics | 5 | 10 | 25 | 35 | 25 |
| chemistry | 5 | 10 | 25 | 35 | 25 |
| history | 5 | 10 | 25 | 35 | 25 |

Note: 初期各文件只包含少量sample questions(如5-10题/科目)验证结构，完整题库后续分批添加

- [ ] **Step 5: Run build**

Run: `npm run build`
Expected: BUILD SUCCEEDS

- [ ] **Step 6: Commit**

```bash
git add src/data/questions/ocean/west.ts src/data/questions/ocean/southHot.ts src/data/questions/ocean/northIce.ts src/data/questions/ocean/mysterious.ts
git commit -m "feat(questions): add ocean question bank frameworks (west, southHot, northIce, mysterious)"
```

---

## Task 5: 验证和测试

**Files:**
- Modify: `src/game/QuestionSelector.test.ts`

- [ ] **Step 1: Add tests for ocean isolation**

```typescript
it('should not return questions from different ocean', () => {
  // 东大洋题库不应该返回西大洋的题目
  const eastQuestion = getRandomQuestion({ oceanId: 'east', subject: 'math', difficulty: 1 })
  expect(eastQuestion?.id.startsWith('east_')).toBe(true)
})
```

- [ ] **Step 2: Add tests for difficulty fallback within same ocean**

```typescript
it('should fallback to lower difficulty within same ocean', () => {
  // 东大洋math D5无题时应fallback到D4
  // 需要先验证东大洋确实没有D5 math题目
})
```

- [ ] **Step 3: Run all tests**

Run: `npx vitest run`
Expected: All tests pass including new ones

- [ ] **Step 4: Commit**

```bash
git add src/game/QuestionSelector.test.ts
git commit -m "test(questions): add ocean isolation and fallback tests"
```

---

## 实施顺序

1. **Task 1**: 创建ocean目录结构和类型定义
2. **Task 2**: 实现东大洋题库 (east.ts) - 验证数据结构和API
3. **Task 3**: 适配QuestionSelector - 核心逻辑修改
4. **Task 4**: 创建其他大洋题库框架 - 扩展支持
5. **Task 5**: 验证和测试

---

## 重要说明

**关于2500题目录：**
当前计划只创建包含sample questions的框架文件（约5-10题/科目），验证：
1. 数据结构正确
2. API按ocean+subject+difficulty筛选正常
3. 难度fallback在同一洋内工作

完整2500题将作为后续数据录入任务分批添加，每个大洋独立录入。

**题库录入优先级：**
1. 东大洋 (优先完成，验证流程)
2. 西大洋
3. 南热洋
4. 北冰洋
5. 神秘洋

---

## 验证清单

- [ ] ocean目录结构正确
- [ ] getOceanQuestionBank能正确返回对应大洋题库
- [ ] getRandomQuestion按oceanId隔离
- [ ] 难度fallback在同一洋内发生
- [ ] 现有测试全部通过
- [ ] Build无错误
