# 题库重构设计规格

## 概述

将全局统一题库重构为按大洋分离的独立题库，实现跨大洋题目隔离，避免题目重复。

---

## 1. 核心原则

| 原则 | 说明 |
|------|------|
| 大洋隔离 | 每个大洋有独立题库，东大洋题目不会出现在西大洋 |
| 难度分布 | 各洋难度比例不同，渐进递增 |
| 科目组织 | 每科目独立管理，支持grade细分 |
| 向后兼容 | 保留旧题库作为fallback |

---

## 2. 文件结构

```
src/data/questions/
├── index.ts                    # 统一导出接口
├── ocean/
│   ├── east.ts                 # 东大洋题库（3科目）
│   ├── west.ts                 # 西大洋题库（4科目）
│   ├── southHot.ts             # 南热洋题库（5科目）
│   ├── northIce.ts             # 北冰洋题库（6科目）
│   └── mysterious.ts           # 神秘洋题库（7科目）
└── graded.ts                   # 旧全局题库（保留fallback）
```

---

## 3. 难度分布（方案A - 每科目100题基准）

### 3.1 各洋难度比例

| Ocean | 科目 | D1 | D2 | D3 | D4 | D5 |
|-------|------|----|----|----|----|----|
| East | math, chinese, english | 40 | 30 | 20 | 8 | 2 |
| West | math, chinese, english, science | 30 | 28 | 25 | 12 | 5 |
| South Hot | math, chinese, english, science, history | 20 | 25 | 30 | 18 | 7 |
| North Ice | math, chinese, english, science, physics, chemistry | 10 | 18 | 30 | 27 | 15 |
| Mysterious | math, chinese, english, science, physics, chemistry, history | 5 | 10 | 25 | 35 | 25 |

### 3.2 题目总数

| Ocean | 科目数 | 题目数 |
|-------|--------|--------|
| East | 3 | 300 |
| West | 4 | 400 |
| South Hot | 5 | 500 |
| North Ice | 6 | 600 |
| Mysterious | 7 | 700 |
| **Total** | - | **2500** |

---

## 4. 数据结构

### 4.1 Question ID 格式

```typescript
type QuestionId = `${oceanId}_${subject}_${difficulty}_${index}`
// 示例: east_math_1_001, west_chinese_3_025, mysterious_physics_5_025
```

### 4.2 题目结构

```typescript
interface OceanQuestion {
  id: string           // 格式: ocean_subject_diff_index
  content: string
  type: 'single' | 'multiple' | 'fill' | 'image'
  difficulty: 1 | 2 | 3 | 4 | 5
  category: string      // 科目: math/chinese/english/science/physics/chemistry/history
  grade?: number        // 年级1-9（可选，用于同难度下细分）
  options: QuestionOption[]
}

interface QuestionOption {
  text: string
  isCorrect: boolean
}
```

---

## 5. API 设计

### 5.1 新接口

```typescript
// src/data/questions/ocean/index.ts

interface OceanQuestionBank {
  oceanId: string
  questions: OceanQuestion[]
  getQuestions(options: {
    subject?: string
    difficulty?: number
    grade?: number
    excludeIds?: string[]
  }): OceanQuestion[]
}

// 各洋题库导出
export const eastQuestionBank: OceanQuestionBank
export const westQuestionBank: OceanQuestionBank
export const southHotQuestionBank: OceanQuestionBank
export const northIceQuestionBank: OceanQuestionBank
export const mysteriousQuestionBank: OceanQuestionBank
```

### 5.2 QuestionSelector 适配

```typescript
// src/game/QuestionSelector.ts

interface QuestionSelectorOptions {
  oceanId: string
  difficulty?: number | null
  category?: string        // 科目
  grade?: number          // 年级（可选）
  excludeIds?: string[]
}

export function getRandomQuestion(options: QuestionSelectorOptions): Question | null {
  // 1. 根据oceanId获取对应题库
  // 2. 按subject + difficulty + grade过滤
  // 3. 排除已使用ID
  // 4. 随机返回
  // 5. Fallback: 如果指定难度无题，扩大到同科目相邻难度
}
```

### 5.3 难度Fallback规则（重要！）

**核心原则：永远不跨大洋fallback**

当指定难度无题时，按以下顺序fallback：

```
请求 D5 → 无 → D4 → 无 → D3 → 无 → D2 → 无 → D1 → 返回null
```

**示例：**
- 东大洋math D5无题 → 尝试D4 → 尝试D3 → ...
- 神秘大洋physics D1无题 → 尝试D2 → ...

**禁止：**
- ❌ 跨大洋fallback（如东大洋无题时使用西大洋）
- ❌ fallback到graded.ts（旧题库无ocean标记，破坏隔离原则）

---

## 6. 难度与年级映射

### 6.1 难度分布说明

- **D1 (入门)**: 基础知识，简单概念
- **D2 (进阶)**: 理解应用，中等难度
- **D3 (挑战)**: 综合运用，较复杂问题
- **D4 (拓展)**: 高阶思考，需要推理
- **D5 (极限)**: 专家水平，复杂应用

### 6.2 年级细分（可选）

在同难度下，grade字段用于进一步细分题目，确保同年级学生遇到适合程度的题目：

```typescript
// 示例：东大洋数学难度2的题目
east_math_2_g1_001  // 东大洋数学难度2年级1
east_math_2_g2_001  // 东大洋数学难度2年级2
...
east_math_2_g9_001  // 东大洋数学难度2年级9
```

---

## 7. 实施任务

### 7.1 数据文件创建

- [ ] `src/data/questions/ocean/east.ts` - 东大洋300题
- [ ] `src/data/questions/ocean/west.ts` - 西大洋400题
- [ ] `src/data/questions/ocean/southHot.ts` - 南热洋500题
- [ ] `src/data/questions/ocean/northIce.ts` - 北冰洋600题
- [ ] `src/data/questions/ocean/mysterious.ts` - 神秘洋700题

### 7.2 代码适配

- [ ] `src/data/questions/index.ts` - 添加统一导出
- [ ] `src/data/questions/ocean/index.ts` - 导出各洋题库
- [ ] `src/game/QuestionSelector.ts` - 修改为使用新题库

### 7.3 向后兼容

**重要：不使用graded.ts作为fallback**

graded.ts 是旧全局题库，无oceanId标记，无法保证跨洋隔离。

新系统实现自己的难度fallback机制（同洋内按难度递减搜索），不依赖旧题库。

graded.ts 可保留用于：
1. 旧的Battle模式（非探索模式）
2. 或者在适当时机移除

---

## 8. 验证标准

1. 各洋题库题目数符合预期（总计2500题）
2. 跨洋访问不会产生重复题目（oceanId隔离）
3. 难度分布符合方案A比例
4. 难度fallback在同一洋内发生，不跨洋
5. 现有测试通过
6. Build 无错误

---

## 9. 完成条件

- [ ] 2500题全部录入
- [ ] API 正确按ocean+subject+difficulty+grade筛选
- [ ] 单元测试覆盖新逻辑
- [ ] 向后兼容旧题库
