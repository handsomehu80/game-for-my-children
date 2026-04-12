# 北冰洋（North Ice Ocean）设计规格

## 概述

难度 [4,5] 的高阶大洋，极地冰川主题，6知识链（语文、数学、英语、科学、物理、化学），22个区域。

---

## 1. 知识领域

| 学科 | 难度递进 | 主题描述 |
|------|---------|---------|
| 语文 | 1→2→3 | 冰川古籍 |
| 数学 | 1→2→3 | 冰川计算 |
| 英语 | 1→2→3 | 极地探险语言 |
| 科学 | 1→2→3 | 极地生态 |
| 物理 | 1→2→3 | 冰川物理 |
| 化学 | 1→2→3 | 冰川化学 |

> 注：物理化学为北冰洋特有学科

---

## 2. 区域布局（22区域）

### 2.1 普通区域（18个）

**语文链（x=1）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| north_chinese_1 | 冰川古籍馆 - 入门 | 1 | (1,1) | north_math_1, north_english_1, north_science_1, north_physics_1, north_chemistry_1, north_chinese_2 |
| north_chinese_2 | 冰川古籍馆 - 进阶 | 2 | (1,3) | north_math_2, north_english_2, north_science_2, north_physics_2, north_chemistry_2, north_chinese_1, north_chinese_3 |
| north_chinese_3 | 冰川古籍馆 - 挑战 | 3 | (1,5) | north_math_3, north_english_3, north_science_3, north_physics_3, north_chemistry_3, north_chinese_2, north_boss |

**数学链（x=2.5）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| north_math_1 | 冰川计算站 - 入门 | 1 | (2.5,1) | north_chinese_1, north_english_1, north_science_1, north_physics_1, north_chemistry_1, north_math_2 |
| north_math_2 | 冰川计算站 - 进阶 | 2 | (2.5,3) | north_chinese_2, north_english_2, north_science_2, north_physics_2, north_chemistry_2, north_math_1, north_math_3 |
| north_math_3 | 冰川计算站 - 挑战 | 3 | (2.5,5) | north_chinese_3, north_english_3, north_science_3, north_physics_3, north_chemistry_3, north_math_2, north_boss |

**英语链（x=4）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| north_english_1 | 极地语言营 - 入门 | 1 | (4,1) | north_chinese_1, north_math_1, north_science_1, north_physics_1, north_chemistry_1, north_english_2 |
| north_english_2 | 极地语言营 - 进阶 | 2 | (4,3) | north_chinese_2, north_math_2, north_science_2, north_physics_2, north_chemistry_2, north_english_1, north_english_3 |
| north_english_3 | 极地语言营 - 挑战 | 3 | (4,5) | north_chinese_3, north_math_3, north_science_3, north_physics_3, north_chemistry_3, north_english_2, north_boss |

**科学链（x=5.5）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| north_science_1 | 极地生态站 - 入门 | 1 | (5.5,1) | north_chinese_1, north_math_1, north_english_1, north_physics_1, north_chemistry_1, north_science_2 |
| north_science_2 | 极地生态站 - 进阶 | 2 | (5.5,3) | north_chinese_2, north_math_2, north_english_2, north_physics_2, north_chemistry_2, north_science_1, north_science_3 |
| north_science_3 | 极地生态站 - 挑战 | 3 | (5.5,5) | north_chinese_3, north_math_3, north_english_3, north_physics_3, north_chemistry_3, north_science_2, north_boss |

**物理链（x=7）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| north_physics_1 | 冰川物理站 - 入门 | 1 | (7,1) | north_chinese_1, north_math_1, north_english_1, north_science_1, north_chemistry_1, north_physics_2 |
| north_physics_2 | 冰川物理站 - 进阶 | 2 | (7,3) | north_chinese_2, north_math_2, north_english_2, north_science_2, north_chemistry_2, north_physics_1, north_physics_3 |
| north_physics_3 | 冰川物理站 - 挑战 | 3 | (7,5) | north_chinese_3, north_math_3, north_english_3, north_science_3, north_chemistry_3, north_physics_2, north_boss |

**化学链（x=8.5）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| north_chemistry_1 | 冰川化学站 - 入门 | 1 | (8.5,1) | north_chinese_1, north_math_1, north_english_1, north_science_1, north_physics_1, north_chemistry_2 |
| north_chemistry_2 | 冰川化学站 - 进阶 | 2 | (8.5,3) | north_chinese_2, north_math_2, north_english_2, north_science_2, north_physics_2, north_chemistry_1, north_chemistry_3 |
| north_chemistry_3 | 冰川化学站 - 挑战 | 3 | (8.5,5) | north_chinese_3, north_math_3, north_english_3, north_science_3, north_physics_3, north_chemistry_2, north_boss |

### 2.2 隐藏区域（2个）

| ID | 名称 | 难度 | 位置(x,z) | 钥匙需求 | 连接 |
|----|------|------|----------|---------|------|
| north_hidden_A | 冰洞秘密基地 A | 2 | (1.5,0) | 1 | north_chinese_1 |
| north_hidden_B | 冰洞秘密基地 B | 2 | (7.5,0) | 1 | north_physics_1 |

### 2.3 宝藏区域（1个）

| ID | 名称 | 难度 | 位置(x,z) | 钥匙需求 | 连接 |
|----|------|------|----------|---------|------|
| north_treasure_1 | 极地宝藏库 | 1 | (4,7) | 2 | north_chemistry_2（连接化学链进阶岛屿）|

### 2.4 Boss区域（1个）

| ID | 名称 | 难度 | 位置(x,z) | 怪物 | 连接 |
|----|------|------|----------|------|------|
| north_boss | 北极巨鲸之巢 | 3 | (4,8) | arctic_whale_king | north_chinese_3, north_math_3, north_english_3, north_science_3, north_physics_3, north_chemistry_3（连接所有难度3岛屿）|

---

## 3. 怪物映射（7种类型共19个实例）

| 区域类型 | 怪物ID | 名称 | HP范围 |
|---------|--------|------|--------|
| 语文普通 | polar_bear_1/2/3 | 北极熊 | 45/55/65 |
| 数学普通 | penguin_1/2/3 | 企鹅 | 45/55/65 |
| 英语普通 | seal_1/2/3 | 海豹 | 45/55/65 |
| 科学普通 | whale_1/2/3 | 鲸鱼 | 45/55/65 |
| 物理普通 | ice_crystal_1/2/3 | 冰晶 | 45/55/65 |
| 化学普通 | snowflake_1/2/3 | 雪花 | 45/55/65 |
| 隐藏区域 | ice_guardian | 冰之守护者 | 90 |
| Boss | arctic_whale_king | 北极巨鲸 | 180 |

---

## 4. 视觉设计

### 4.1 岛屿SVG主题
- **冰川岛屿**：冰蓝色底色，雪花装饰，极光效果
- **冰洞**：半透明冰晶内部，发光蓝色
- **极光**：紫色/绿色渐变背景效果

### 4.2 岛屿类型
- normal：标准冰川岛屿（冰蓝/白色）
- hidden：半透明冰蓝光效果
- treasure：宝箱图标（冰晶风格）
- boss：巨鲸造型

---

## 5. 连接规则

**同级互联规则：**
- 同一难度等级的不同学科岛屿之间横向互联
- 6链布局：语文→数学→英语→科学→物理→化学

**纵向升级规则：**
- 同一学科内，难度N岛屿连接到难度N+1岛屿

**Boss解锁规则：**
- Boss区域连接到所有难度3的普通区域
- 必须先击败18个普通区域岛屿才能挑战Boss

**隐藏区域规则：**
- 隐藏区域连接相邻学科的第1级岛屿

---

## 6. 实现任务

### 6.1 数据文件
- [ ] `src/data/areas/index.ts`：添加northAreas数组（22个区域）
- [ ] `src/data/monsters/index.ts`：添加新怪物数据
- [ ] `src/game/types.ts`：添加 'physics' 和 'chemistry' 到 KnowledgeArea 类型

### 6.2 题库扩展（关键任务）
- [ ] 添加物理题目（Grade 1-9，各难度）
- [ ] 添加化学题目（Grade 1-9，各难度）
- [ ] 添加科学题目（Grade 1-7，补充缺失）
- [ ] 添加历史题目（Grade 1-9，南热洋使用）
- [ ] 更新 QuestionSelector 支持新学科分类

### 6.3 无需修改
- 核心游戏逻辑（已支持多大洋多学科）
- 存档系统

---

## 7. Boss技能设计

**北极巨鲸（Arctic Whale King）**
- HP: 180
- 技能1：冰浪冲击（造成70伤害）
- 技能2：深海咆哮（减少玩家HP 40）
- 技能3：极地呼唤（连续答对5题触发，全队HP减少60）
- 掉落：5钥匙 + 解锁神秘大洋

---

## 8. 完成条件

- 击败北极巨鲸
- 掉落5把钥匙
- 解锁下一大洋：神秘大洋（mysterious）

---

## 9. 题库扩展详细需求

### 9.1 当前状态
- 语文、数学、英语：Grade 1-9 ✅ 完整
- 科学：仅 Grade 8-9 ⚠️ 缺失1-7
- 历史：完全缺失 ❌
- 物理/化学：已存在但未独立分类 ⚠️

### 9.2 题库扩展目标
为北冰洋物理化学、南热洋历史补充题目：

| 学科 | 需要补充 |
|------|---------|
| 科学 Grade 1-7 | 各20题（难度1-3）|
| 历史 Grade 1-9 | 各15题（难度1-3）|
| 物理 Grade 1-9 | 各15题（难度1-3）|
| 化学 Grade 1-9 | 各15题（难度1-3）|

### 9.3 学科分类更新
更新 types.ts 中的 Category 类型：
```typescript
export type QuestionCategory = 'math' | 'chinese' | 'english' | 'science' | 'history' | 'physics' | 'chemistry'
```
