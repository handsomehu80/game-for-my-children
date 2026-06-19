# 题库重构实现状态报告

> 生成时间: 2026-04-17
> 状态: ⚠️ 进行中（数据质量问题需持续修复）

---

## 1. 实现完成情况

### 已完成的任务

| Task | 状态 | 提交 | 说明 |
|------|------|------|------|
| 1. 创建新题库目录结构 | ✅ | c60df3b | subjects/ 目录创建，index.ts 重构 |
| 2. 创建数学题库 | ✅ | ff8bdf7 | 317题从旧库迁移 |
| 3. 创建语文题库 | ✅ | 6c37748 | 500题从旧库迁移 |
| 4. 创建英语题库 | ✅ | c24e3f6 | 500题从旧库迁移 |
| 5. 创建科学题库 | ✅ | 70d888d | 151题（含去重后126题） |
| 6. 创建物理/化学/历史题库 | ✅ | ef33760 | 各200题 |
| 7. 重写 QuestionSelector | ✅ | 0dad5b1 | 按 category+grade+difficulty 筛选 |
| 8. 更新 ExplorationMap | ✅ | e580c51 | 支持全部7个学科 |
| 9. 答案分布验证测试 | ✅ | 2ace5ba | answerDistribution.test.ts |

### 本次会话额外完成

- Teacher Review: 65aab3c, 65de151 - 发现并修复以下问题：
  - 数学: math_4_2_031 重复答案 "542"
  - 科学: 25道重复题目
  - 历史: 29道D4/D5重复题目
  - 语文: 4大发明选项争议、题目歧义、重复题目
  - 物理: 1道重复热机题目
- 修复 validation.test.ts: c6edbeb - 使用 allQuestions 替代 questionsData
- 修复 math_3_1: 50题→30题，答案分布 A:9 B:8 C:8 D:6 (通过测试)
- 修复 math_4_2: 58题→30题，答案分布均衡 (通过测试)
- 修复 math_7_3: 62题→28题，答案分布 A:9 B:7 C:6 D:6 (通过测试)
- 添加 D3 填空题: math_6 (5题), math_7 (6题), chinese_6 (5题)
- 补充 physics_7_1, chemistry_7_1, history_7_1, history_9_5 各30题
- 修复 chinese_1_1: 答案分布 A:7 B:7 C:7 D:7 (通过测试)
- 修复 chinese_2_1: 答案分布 A:9 B:9 C:9 D:9 (通过测试)
- 修复 build 错误: chemistry/english/history/physics/science test.ts unused combo 变量
- 修复 QuestionSelector.ts: oceanId 改为可选参数

### 待解决问题

⚠️ **chinese_3_1 答案分布问题**: 38题，A=12, B=16, C=10, D=0。要达到6-9需删除2题并转换10+答案，但题目内容不支持。

⚠️ **物理/化学/历史难度值错误**: 存在 difficulty 4/5（应为1-3）。如 physics_9_4, physics_9_5 等。

⚠️ **大量 Combo 缺失**: 当前题库远低于设计目标3600题。

---

## 2. 当前题库规模

| 学科 | 题目数 | Combo数 | 设计Combo | 覆盖年级 |
|------|--------|---------|-----------|----------|
| 数学 | 216 | 7 | 27 | 1-7 部分 |
| 语文 | 503 | 9 | 27 | 1-9 部分 |
| 英语 | 500 | 9 | 27 | 1-9 部分 |
| 科学 | 138 | 4 | 12 | 3-6 部分 |
| 物理 | 214 | 5 | 9 | 7-9 部分 |
| 化学 | 215 | 5 | 9 | 7-9 部分 |
| 历史 | 205 | 5 | 9 | 7-9 部分 |
| **总计** | **1991** | **44** | **120** | |

### 现有 Combo 明细

| 学科 | 现有 Combo |
|------|-----------|
| 数学 | 1_1, 2_1, 3_1, 4_2, 5_2, 6_3, 7_3 |
| 语文 | 1_1, 2_1, 3_1, 4_2, 5_2, 6_3, 7_3, 8_3, 9_3 |
| 英语 | 1_1, 2_1, 3_1, 4_2, 5_2, 6_3, 7_3, 8_3, 9_3 |
| 科学 | 3_1, 4_2, 5_2, 6_3 |
| 物理 | 7_1, 8_2, 8_3, 9_4, 9_5 (⚠️难度4/5无效) |
| 化学 | 7_1, 8_2, 8_3, 9_4, 9_5 (⚠️难度4/5无效) |
| 历史 | 7_1, 8_2, 8_3, 9_4, 9_5 (⚠️难度4/5无效) |

### 与设计目标对比

| 目标 | 设计要求 | 实际数量 | 差距 |
|------|----------|----------|------|
| 每组合30题 | 120 combos × 30 = 3600 | 1991 | 需补充~1609 |
| 答案分布均匀 | A/B/C/D各6-9道 | 1个combo偏斜 | 需修复 chinese_3_1 |

---

## 3. 已验证的问题

### 数据质量问题（需后续修复）

1. **答案分布不均**: math_1_1 组合中A选项为0，B/C偏多
2. **部分组合题数不足**: 8-9年级题库数量较少
3. **D3填空题缺失**: 目前题库几乎无填空题

### Teacher Review 发现的问题（已修复）

| 问题 | 文件 | 修复状态 |
|------|------|----------|
| math_4_2_031 重复答案 | math.ts | ✅ 已修复 |
| 科学25道重复题 | science.ts | ✅ 已删除 |
| 历史29道D4/D5重复 | history.ts | ✅ 已删除 |
| 语文4大发明争议选项 | chinese.ts | ✅ 已修改为"瓷器" |
| 语文唐宋八大家歧义 | chinese.ts | ✅ 已修改措辞 |
| 语文3道《春晓》重复 | chinese.ts | ✅ 已删除2道 |
| 物理1道热机重复题 | physics.ts | ✅ 已删除 |

---

## 4. 代码一致性检查

### QuestionSelector.ts (已清理)

```typescript
// 清理后的导入
import { allQuestions } from '../data/questions'

// 导出类型
export type QuestionCategory = 'math' | 'chinese' | 'english' | 'science' | 'physics' | 'chemistry' | 'history' | 'general'

// 核心函数
export function getRandomQuestion(options: QuestionSelectorOptions): Question | null {
  // 按 category + grade + difficulty 筛选
  // excludeIds 排除已使用题目
}
```

### ExplorationMap.tsx 调用

```typescript
const question = getRandomQuestion({
  oceanId: latestExplorationRef.current.currentOcean || 'east',  // 仅用于日志
  difficulty: area.difficulty ?? null,
  grade: playerGrade,
  category: area.knowledgeArea === 'comprehensive' ? undefined : area.knowledgeArea as 'math' | 'chinese' | 'english' | 'science' | 'physics' | 'chemistry' | 'history',
})
```

---

## 5. 下一步工作

### 短期（数据质量）
- [ ] 修复其他数学Combo答案分布 (math_5_2, math_6_3, math_7_3等)
- [ ] 修复其他学科Combo答案分布 (chinese, english, science等)
- [ ] 补充8-9年级各科题目
- [ ] 添加更多D3填空题（当前仅数学、语文有少量）

### 长期（功能扩展）
- [ ] 添加题目解析字段
- [ ] 实现错题本功能
- [ ] 添加知识点标签

---

## 6. 已知问题

### 答案分布测试失败
- math_5_2: A答案仅1道（需6-9道）
- 预计有更多Combo有类似问题（需全面检查修复）

### D3填空题仍不足
- math_6: 9.3% ✓
- math_7: 8.8% ✓
- chinese_6: 10.4% ✓
- 其他D3 Combo: 0%（需补充）

---

## 6. 关键文件清单

```
src/
├── game/
│   └── QuestionSelector.ts          # 选题器（已重构）
├── data/
│   └── questions/
│       ├── index.ts                 # 统一导出 allQuestions
│       ├── subjects/
│       │   ├── math.ts             # 数学题库
│       │   ├── chinese.ts         # 语文题库
│       │   ├── english.ts          # 英语题库
│       │   ├── science.ts          # 科学题库
│       │   ├── physics.ts          # 物理题库
│       │   ├── chemistry.ts        # 化学题库
│       │   └── history.ts         # 历史题库
│       └── answerDistribution.test.ts  # 答案分布测试
└── components/
    └── game/
        └── ExplorationMap.tsx      # 探索地图（已支持7学科）
```
