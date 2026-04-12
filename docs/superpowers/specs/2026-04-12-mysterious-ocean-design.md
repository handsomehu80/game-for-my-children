# 神秘大洋（Mysterious Ocean）设计规格

## 概述

难度 [5,5] 的终极挑战大洋，幽灵海域主题，7知识链（语文、数学、英语、科学、物理、化学、历史），25个区域。最终BOSS等待玩家征服！

---

## 1. 知识领域

| 学科 | 难度递进 | 主题描述 |
|------|---------|---------|
| 语文 | 1→2→3 | 幽灵古籍 |
| 数学 | 1→2→3 | 幽灵计算 |
| 英语 | 1→2→3 | 幽灵语言 |
| 科学 | 1→2→3 | 幽灵生态 |
| 物理 | 1→2→3 | 幽灵物理 |
| 化学 | 1→2→3 | 幽灵化学 |
| 历史 | 1→2→3 | 幽灵历史 |

> 注：7个学科全面综合，涵盖所有已学知识

---

## 2. 区域布局（25区域）

### 2.1 普通区域（21个）

**语文链（x=1）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| myst_chinese_1 | 幽灵古籍馆 - 入门 | 1 | (1,1) | myst_math_1, myst_english_1, myst_science_1, myst_physics_1, myst_chemistry_1, myst_history_1, myst_chinese_2 |
| myst_chinese_2 | 幽灵古籍馆 - 进阶 | 2 | (1,3) | myst_math_2, myst_english_2, myst_science_2, myst_physics_2, myst_chemistry_2, myst_history_2, myst_chinese_1, myst_chinese_3 |
| myst_chinese_3 | 幽灵古籍馆 - 挑战 | 3 | (1,5) | myst_math_3, myst_english_3, myst_science_3, myst_physics_3, myst_chemistry_3, myst_history_3, myst_chinese_2, myst_boss |

**数学链（x=2.5）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| myst_math_1 | 幽灵计算站 - 入门 | 1 | (2.5,1) | myst_chinese_1, myst_english_1, myst_science_1, myst_physics_1, myst_chemistry_1, myst_history_1, myst_math_2 |
| myst_math_2 | 幽灵计算站 - 进阶 | 2 | (2.5,3) | myst_chinese_2, myst_english_2, myst_science_2, myst_physics_2, myst_chemistry_2, myst_history_2, myst_math_1, myst_math_3 |
| myst_math_3 | 幽灵计算站 - 挑战 | 3 | (2.5,5) | myst_chinese_3, myst_english_3, myst_science_3, myst_physics_3, myst_chemistry_3, myst_history_3, myst_math_2, myst_boss |

**英语链（x=4）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| myst_english_1 | 幽灵语言营 - 入门 | 1 | (4,1) | myst_chinese_1, myst_math_1, myst_science_1, myst_physics_1, myst_chemistry_1, myst_history_1, myst_english_2 |
| myst_english_2 | 幽灵语言营 - 进阶 | 2 | (4,3) | myst_chinese_2, myst_math_2, myst_science_2, myst_physics_2, myst_chemistry_2, myst_history_2, myst_english_1, myst_english_3 |
| myst_english_3 | 幽灵语言营 - 挑战 | 3 | (4,5) | myst_chinese_3, myst_math_3, myst_science_3, myst_physics_3, myst_chemistry_3, myst_history_3, myst_english_2, myst_boss |

**科学链（x=5.5）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| myst_science_1 | 幽灵生态站 - 入门 | 1 | (5.5,1) | myst_chinese_1, myst_math_1, myst_english_1, myst_physics_1, myst_chemistry_1, myst_history_1, myst_science_2 |
| myst_science_2 | 幽灵生态站 - 进阶 | 2 | (5.5,3) | myst_chinese_2, myst_math_2, myst_english_2, myst_physics_2, myst_chemistry_2, myst_history_2, myst_science_1, myst_science_3 |
| myst_science_3 | 幽灵生态站 - 挑战 | 3 | (5.5,5) | myst_chinese_3, myst_math_3, myst_english_3, myst_physics_3, myst_chemistry_3, myst_history_3, myst_science_2, myst_boss |

**物理链（x=7）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| myst_physics_1 | 幽灵物理站 - 入门 | 1 | (7,1) | myst_chinese_1, myst_math_1, myst_english_1, myst_science_1, myst_chemistry_1, myst_history_1, myst_physics_2 |
| myst_physics_2 | 幽灵物理站 - 进阶 | 2 | (7,3) | myst_chinese_2, myst_math_2, myst_english_2, myst_science_2, myst_chemistry_2, myst_history_2, myst_physics_1, myst_physics_3 |
| myst_physics_3 | 幽灵物理站 - 挑战 | 3 | (7,5) | myst_chinese_3, myst_math_3, myst_english_3, myst_science_3, myst_chemistry_3, myst_history_3, myst_physics_2, myst_boss |

**化学链（x=8.5）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| myst_chemistry_1 | 幽灵化学站 - 入门 | 1 | (8.5,1) | myst_chinese_1, myst_math_1, myst_english_1, myst_science_1, myst_physics_1, myst_history_1, myst_chemistry_2 |
| myst_chemistry_2 | 幽灵化学站 - 进阶 | 2 | (8.5,3) | myst_chinese_2, myst_math_2, myst_english_2, myst_science_2, myst_physics_2, myst_history_2, myst_chemistry_1, myst_chemistry_3 |
| myst_chemistry_3 | 幽灵化学站 - 挑战 | 3 | (8.5,5) | myst_chinese_3, myst_math_3, myst_english_3, myst_science_3, myst_physics_3, myst_history_3, myst_chemistry_2, myst_boss |

**历史链（x=10）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| myst_history_1 | 幽灵历史馆 - 入门 | 1 | (10,1) | myst_chinese_1, myst_math_1, myst_english_1, myst_science_1, myst_physics_1, myst_chemistry_1, myst_history_2 |
| myst_history_2 | 幽灵历史馆 - 进阶 | 2 | (10,3) | myst_chinese_2, myst_math_2, myst_english_2, myst_science_2, myst_physics_2, myst_chemistry_2, myst_history_1, myst_history_3 |
| myst_history_3 | 幽灵历史馆 - 挑战 | 3 | (10,5) | myst_chinese_3, myst_math_3, myst_english_3, myst_science_3, myst_physics_3, myst_chemistry_3, myst_history_2, myst_boss |

### 2.2 隐藏区域（2个）

| ID | 名称 | 难度 | 位置(x,z) | 钥匙需求 | 连接 |
|----|------|------|----------|---------|------|
| myst_hidden_A | 幽灵密室 A | 2 | (1.5,0) | 1 | myst_chinese_1 |
| myst_hidden_B | 幽灵密室 B | 2 | (9,0) | 1 | myst_chemistry_1 |

### 2.3 宝藏区域（1个）

| ID | 名称 | 难度 | 位置(x,z) | 钥匙需求 | 连接 |
|----|------|------|----------|---------|------|
| myst_treasure_1 | 幽灵宝藏库 | 1 | (5,7) | 2 | myst_history_2（连接历史链进阶岛屿）|

### 2.4 Boss区域（1个）

| ID | 名称 | 难度 | 位置(x,z) | 怪物 | 连接 |
|----|------|------|----------|------|------|
| myst_boss | 深海巨妖之巢 | 3 | (5,8) | kraken_prime | myst_chinese_3, myst_math_3, myst_english_3, myst_science_3, myst_physics_3, myst_chemistry_3, myst_history_3（连接所有难度3岛屿）|

---

## 3. 怪物映射（7种类型共22个实例）

| 区域类型 | 怪物ID | 名称 | HP范围 |
|---------|--------|------|--------|
| 语文普通 | ghost_bear_1/2/3 | 幽灵熊 | 50/60/70 |
| 数学普通 | ghost_penguin_1/2/3 | 幽灵企鹅 | 50/60/70 |
| 英语普通 | ghost_seal_1/2/3 | 幽灵海豹 | 50/60/70 |
| 科学普通 | ghost_jellyfish_1/2/3 | 幽灵水母 | 50/60/70 |
| 物理普通 | ghost_eagle_1/2/3 | 幽灵鹰 | 50/60/70 |
| 化学普通 | ghost_turtle_1/2/3 | 幽灵海龟 | 50/60/70 |
| 历史普通 | ghost_snake_1/2/3 | 幽灵蛇 | 50/60/70 |
| 隐藏区域 | shadow_guardian | 暗影守护者 | 100 |
| Boss | kraken_prime | 深海巨妖 | 220 |

---

## 4. 视觉设计

### 4.1 岛屿SVG主题
- **幽灵岛屿**：半透明紫色/蓝色，发光边缘，幽灵火焰
- **幽灵密室**：黑暗中的发光符文
- **幽灵迷雾**：紫色/绿色雾气效果

### 4.2 岛屿类型
- normal：幽灵风格岛屿（半透明、发光）
- hidden：强烈发光效果暗示
- treasure：幽灵宝箱图标
- boss：巨大触手怪物造型

---

## 5. 连接规则

**同级互联规则：**
- 同一难度等级的不同学科岛屿之间横向互联
- 7链布局：语文→数学→英语→科学→物理→化学→历史

**纵向升级规则：**
- 同一学科内，难度N岛屿连接到难度N+1岛屿

**Boss解锁规则：**
- Boss区域连接到所有难度3的普通区域
- 必须先击败21个普通区域岛屿才能挑战Boss

**隐藏区域规则：**
- 隐藏区域连接相邻学科的第1级岛屿

---

## 6. 实现任务

### 6.1 数据文件
- [ ] `src/data/areas/index.ts`：添加mystAreas数组（25个区域）
- [ ] `src/data/monsters/index.ts`：添加新怪物数据
- [ ] `src/data/oceans/index.ts`：确认mysterious已注册（无需修改）

### 6.2 无需修改
- KnowledgeArea和QuestionCategory类型（已包含所有学科）
- 核心游戏逻辑
- 存档系统

---

## 7. Boss技能设计

**深海巨妖（Kraken Prime）**
- HP: 220
- 技能1：巨浪吞噬（造成80伤害）
- 技能2：黑暗触手（减少玩家HP 50）
- 技能3：深渊诅咒（连续答对6题触发，全队HP减少80）
- 技能4：回复（每损失30%HP时回复20点）
- 掉落：通关！游戏胜利！

---

## 8. 完成条件

- 击败深海巨妖
- 游戏通关！
- 显示通关画面和统计

---

## 9. 游戏通关流程

击败深海巨妖后触发：
1. 显示通关动画（巨妖消失，岛屿解放）
2. 显示游戏统计（总得分、击败岛屿数、收集钥匙数）
3. 显示"恭喜通关！"信息
4. 提供"重新开始"或"继续探索"选项
