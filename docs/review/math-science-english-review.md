# Math, Science, English Question Bank Review

**Review Date:** 2026-04-16
**Reviewer:** Teacher Review
**Files Reviewed:**
- `src/data/questions/subjects/math.ts`
- `src/data/questions/subjects/science.ts`
- `src/data/questions/subjects/english.ts`

---

## Summary

| Subject | Total Issues | Critical | Major | Minor |
|---------|-------------|----------|-------|-------|
| Math | 1 | 0 | 1 | 0 |
| Science | 29 | 0 | 29 | 0 |
| English | 1 | 0 | 1 | 0 |
| **Total** | **31** | **0** | **31** | **0** |

---

## Math 题库错误清单

### 错误 1
- 文件: `src/data/questions/subjects/math.ts`
- 题目ID: `math_4_2_031`
- 题目内容: `1000 - 458 = ?`
- 问题描述: **重复选项错误** - 选项中出现了两个相同的正确答案 "542"
- 建议修复: 将第二个 "542" 选项改为其他干扰项，如 "552" 或 "562"

```typescript
// 当前错误代码
{ id: 'math_4_2_031', content: '1000 - 458 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [
  {text:'542',isCorrect:true},  // 正确答案
  {text:'552',isCorrect:false},
  {text:'562',isCorrect:false},
  {text:'542',isCorrect:false}  // 重复的正确答案！
] }

// 建议修复
{ id: 'math_4_2_031', content: '1000 - 458 = ?', type: 'single', difficulty: 2, category: 'math', grade: 4, options: [
  {text:'542',isCorrect:true},
  {text:'552',isCorrect:false},
  {text:'562',isCorrect:false},
  {text:'532',isCorrect:false}  // 改为不同的干扰项
] }
```

---

## Science 题库错误清单

### 错误 1-3: 重复题目
- 文件: `src/data/questions/subjects/science.ts`
- 题目ID: `science_4_2_002`, `science_4_2_003`, `science_4_2_004`
- 题目内容: `植物的光合作用需要什么？`
- 问题描述: **完全相同的三道题** - 这三道题的内容、选项、答案完全相同
- 建议修复: 删除重复题目，保留一道即可

### 错误 4-5: 重复题目
- 题目ID: `science_4_2_005`, `science_4_2_008`
- 题目内容: `人体的骨骼有多少块？`
- 问题描述: **两题完全相同**
- 建议修复: 删除 `science_4_2_008`

### 错误 6-8: 重复题目
- 题目ID: `science_4_2_011`, `science_4_2_012`, `science_4_2_018`
- 题目内容: `声音是怎么传播的？`
- 问题描述: **三题完全相同** - 都是"通过空气振动"
- 建议修复: 删除 `science_4_2_012` 和 `science_4_2_018`

### 错误 9: 重复题目
- 题目ID: `science_4_2_001`, `science_4_2_024`
- 题目内容: `植物的种子是怎么传播的？`
- 问题描述: **两题完全相同**
- 建议修复: 删除 `science_4_2_024`

### 错误 10-11: 重复题目
- 题目ID: `science_5_2_003`, `science_5_2_004`
- 题目内容: `什么是动物的冬眠？`
- 问题描述: **两题完全相同**
- 建议修复: 删除 `science_5_2_004`

### 错误 12-13: 重复题目
- 题目ID: `science_5_2_007`, `science_5_2_008`
- 题目内容: `电路的基本组成部分是？`
- 问题描述: **两题完全相同**
- 建议修复: 删除 `science_5_2_008`

### 错误 14-15: 重复题目
- 题目ID: `science_5_2_011`, `science_5_2_012`
- 题目内容: `水的循环包括哪三个过程？`
- 问题描述: **两题完全相同**
- 建议修复: 删除 `science_5_2_012`

### 错误 16-17: 重复题目
- 题目ID: `science_3_1_002`, `science_3_1_004`
- 题目内容: `什么能发光？`
- 问题描述: **两题完全相同**
- 建议修复: 删除 `science_3_1_004`

### 错误 18-19: 重复题目
- 题目ID: `science_5_2_026`, `science_5_2_027`
- 题目内容: `什么是导体？`
- 问题描述: **两题几乎相同** - 都是关于导体定义，选项略有不同但正确答案相同
- 建议修复: 删除 `science_5_2_027`

### 错误 20-22: 重复题目
- 题目ID: `science_6_3_007`, `science_6_3_008`
- 题目内容: `光的折射发生在什么情况下？`
- 问题描述: **两题完全相同**
- 建议修复: 删除 `science_6_3_008`

### 错误 23-25: 重复题目
- 题目ID: `science_6_3_011`, `science_6_3_012`, `science_6_3_021`
- 题目内容: `地球公转一周是多少时间？`
- 问题描述: **三题完全相同**
- 建议修复: 删除 `science_6_3_012` 和 `science_6_3_021`

### 错误 26: 题目内容有误
- 题目ID: `science_6_3_045`
- 题目内容: `太阳系中最大的行星是？`
- 问题描述: **选项有误** - 选项包含"海王星"，但海王星不是最大的行星，木星才是最大的
- 建议修复: 将"海王星"选项改为"天王星"

```typescript
// 当前错误代码
{ id: 'science_6_3_045', content: '太阳系中最大的行星是？', ..., options: [
  {text:'地球',isCorrect:false},
  {text:'土星',isCorrect:false},
  {text:'木星',isCorrect:true},
  {text:'海王星',isCorrect:false}  // 海王星不是最大
] }

// 建议修复
{ id: 'science_6_3_045', content: '太阳系中最大的行星是？', ..., options: [
  {text:'地球',isCorrect:false},
  {text:'土星',isCorrect:false},
  {text:'木星',isCorrect:true},
  {text:'天王星',isCorrect:false}  // 改为天王星
] }
```

### 错误 27-29: 其他重复题目
- `science_5_2_039` 和 `science_5_2_040` 关于动物迁徙和绝缘体
- `science_5_2_046` 和 `science_5_2_047` 关于磁铁和食物链
- `science_5_2_009` 与 `science_5_2_043` 关于水的三态

---

## English 题库错误清单

### 错误 1: 答案标记错误
- 文件: `src/data/questions/subjects/english.ts`
- 题目ID: `english_4_2_northIce_004`
- 题目内容: `There are ___ students in the class.`
- 问题描述: **答案错误** - "students" 是可数名词，应该用 "many" 而不是 "much"
- 建议修复: 将 "much" 的 isCorrect 改为 false，将 "many" 的 isCorrect 改为 true

```typescript
// 当前错误代码
{ id: 'english_4_2_northIce_004', content: 'There are ___ students in the class.', ..., options: [
  {text:'a',isCorrect:false},
  {text:'an',isCorrect:false},
  {text:'many',isCorrect:false},   // 错误：many 是正确的
  {text:'much',isCorrect:true}    // 错误：much 不能修饰可数名词
] }

// 建议修复
{ id: 'english_4_2_northIce_004', content: 'There are ___ students in the class.', ..., options: [
  {text:'a',isCorrect:false},
  {text:'an',isCorrect:false},
  {text:'many',isCorrect:true},   // 正确
  {text:'much',isCorrect:false}   // 错误
] }
```

---

## 问题统计

### 重复题目（影响题库质量）:
1. `science_4_2_002, 003, 004` - 光合作用 (3次)
2. `science_4_2_005, 008` - 骨骼块数 (2次)
3. `science_4_2_011, 012, 018` - 声音传播 (3次)
4. `science_4_2_001, 024` - 种子传播 (2次)
5. `science_5_2_003, 004` - 冬眠 (2次)
6. `science_5_2_007, 008` - 电路组成 (2次)
7. `science_5_2_011, 012` - 水循环 (2次)
8. `science_3_1_002, 004` - 什么能发光 (2次)
9. `science_5_2_026, 027` - 导体 (2次)
10. `science_6_3_007, 008` - 光的折射 (2次)
11. `science_6_3_011, 012, 021` - 地球公转 (3次)

### 选项错误:
1. `math_4_2_031` - 重复选项 "542"
2. `english_4_2_northIce_004` - many/much 答案颠倒

### 内容错误:
1. `science_6_3_045` - 海王星不是最大行星

---

## 修复优先级建议

### P0 (立即修复):
1. `math_4_2_031` - 数学题出现重复答案会直接导致答题系统异常
2. `english_4_2_northIce_004` - 答案错误会导致学生学到错误的语法知识

### P1 (尽快修复):
1. `science_6_3_045` - 科学知识错误
2. 所有完全重复的题目 - 影响题库有效性和多样性

### P2 (优化建议):
1. 题库去重后重新分配 ID
2. 考虑为重复知识点添加不同角度的题目