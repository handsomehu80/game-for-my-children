# 西大洋（West Ocean）设计规格

## 概述

在东大洋基础上扩展的新大洋，难度 [2,3]，新增科学学科，采用沙漠海岛主题。

---

## 1. 知识领域

| 学科 | 难度递进 | 主题描述 |
|------|---------|---------|
| 数学 | 1→2→3 | 沙漠商队计算 |
| 语文 | 1→2→3 | 古老沙漠文字 |
| 英语 | 1→2→3 | 沙漠商旅语言 |
| 科学 | 1→2→3 | 沙漠生态知识 |

---

## 2. 区域布局（15区域）

### 2.1 普通区域（12个）

**数学链（左侧）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| west_math_1 | 沙漠计算站 - 入门 | 1 | (1,1) | west_chinese_1, west_english_1, west_science_1, west_math_2 |
| west_math_2 | 沙漠计算站 - 进阶 | 2 | (1,3) | west_chinese_2, west_english_2, west_science_2, west_math_1, west_math_3 |
| west_math_3 | 沙漠计算站 - 挑战 | 3 | (1,5) | west_chinese_3, west_english_3, west_science_3, west_math_2, west_boss |

**语文链**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| west_chinese_1 | 沙漠古籍馆 - 入门 | 1 | (3,1) | west_math_1, west_english_1, west_science_1, west_chinese_2 |
| west_chinese_2 | 沙漠古籍馆 - 进阶 | 2 | (3,3) | west_math_2, west_english_2, west_science_2, west_chinese_1, west_chinese_3 |
| west_chinese_3 | 沙漠古籍馆 - 挑战 | 3 | (3,5) | west_math_3, west_english_3, west_science_3, west_chinese_2, west_boss |

**英语链**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| west_english_1 | 商旅语言营 - 入门 | 1 | (5,1) | west_math_1, west_chinese_1, west_science_1, west_english_2 |
| west_english_2 | 商旅语言营 - 进阶 | 2 | (5,3) | west_math_2, west_chinese_2, west_science_2, west_english_1, west_english_3 |
| west_english_3 | 商旅语言营 - 挑战 | 3 | (5,5) | west_math_3, west_chinese_3, west_science_3, west_english_2, west_boss |

**科学链（右侧）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| west_science_1 | 沙漠生态站 - 入门 | 1 | (7,1) | west_math_1, west_chinese_1, west_english_1, west_science_2 |
| west_science_2 | 沙漠生态站 - 进阶 | 2 | (7,3) | west_math_2, west_chinese_2, west_english_2, west_science_1, west_science_3 |
| west_science_3 | 沙漠生态站 - 挑战 | 3 | (7,5) | west_math_3, west_chinese_3, west_english_3, west_science_2, west_boss |

### 2.2 隐藏区域（2个）

| ID | 名称 | 难度 | 位置(x,z) | 钥匙需求 | 连接 |
|----|------|------|----------|---------|------|
| west_hidden_A | 沙漠秘密绿洲 A | 2 | (2,0) | 1 | west_math_1 |
| west_hidden_B | 沙漠秘密绿洲 B | 2 | (6,0) | 1 | west_science_1 |

### 2.3 特殊宝藏区（1个）

| ID | 名称 | 难度 | 位置(x,z) | 钥匙需求 | 连接 |
|----|------|------|----------|---------|------|
| west_treasure_1 | 沙漠宝藏秘境 | 1 | (4,7) | 2 | west_chinese_2 |

### 2.4 Boss区域（1个）

| ID | 名称 | 难度 | 位置(x,z) | 怪物 | 连接 |
|----|------|------|----------|------|------|
| west_boss | 海蛇王之巢 | 3 | (4,8) | sea_serpent_king | west_math_3, west_chinese_3, west_english_3, west_science_3 |

---

## 3. 怪物映射

| 区域类型 | 怪物ID | 名称 | HP范围 |
|---------|--------|------|--------|
| 数学普通 | scorpion_1/2/3 | 沙漠蝎子 | 35/45/55 |
| 语文普通 | lizard_1/2/3 | 沙漠蜥蜴 | 35/45/55 |
| 英语普通 | snake_1/2/3 | 响尾蛇 | 35/45/55 |
| 科学普通 | desert_eagle_1/2/3 | 沙漠鹰 | 35/45/55 |
| 隐藏区域 | desert_guardian | 沙漠守护者 | 70 |
| 宝藏区域 | treasure_spirit | 宝藏精灵 | 50 |
| Boss | sea_serpent_king | 海蛇王 | 130 |

---

## 4. 视觉设计

### 4.1 岛屿SVG主题
- **沙漠海岛**：沙黄色底色，仙人掌装饰，海洋绿松石海水
- **绿洲岛**：深绿棕榈，蓝色水池
- **火山沙漠**：橙红岩石，蒸汽效果

### 4.2 岛屿类型
- normal：标准沙漠岛屿
- hidden：半透明发光效果（暗示隐藏）
- treasure：金色宝箱图标
- boss：海蛇盘旋造型

---

## 5. 连接规则

与东大洋相同：
- 同级之间横向互联
- 向上纵向一链
- Boss连接所有难度3区域
- 隐藏区域连接相邻学科第1级

---

## 6. 实现任务

### 6.1 数据文件
- [ ] `src/data/areas/index.ts`：添加westAreas数组（15个区域）
- [ ] `src/data/monsters/index.ts`：添加新怪物数据（蝎子、蜥蜴、响尾蛇、沙漠鹰、海蛇王）
- [ ] `src/data/questions/graded.ts`：确保有足够的Grade 1-6科学题目

### 6.2 无需修改
- 核心游戏逻辑（已完成通用化）
- 存档系统（自动兼容新大洋）
- 探索状态机（已支持多大洋）

---

## 7. Boss技能设计

**海蛇王（Sea Serpent King）**
- HP: 130
- 技能1：浪潮冲击（造成50伤害）
- 技能2：海蛇缠绕（减少玩家HP 30）
- 技能3：深海呼唤（连续答对3题触发，回复Boss 20HP）
- 掉落：3钥匙 + 解锁北冰洋

---

## 8. 完成条件

- 击败海蛇王
- 掉落3把钥匙
- 解锁下一大洋：南热洋（southHot）
