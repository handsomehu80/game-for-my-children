# 南热洋（South Hot Ocean）设计规格

## 概述

难度 [3,4] 的进阶大洋，火山熔岩主题，5知识链（数学、语文、英语、科学、历史），**19个区域**（15普通+2隐藏+1宝藏+1Boss）。

---

## 1. 知识领域

| 学科 | 难度递进 | 主题描述 |
|------|---------|---------|
| 数学 | 1→2→3 | 火山计算 |
| 语文 | 1→2→3 | 火山古籍 |
| 英语 | 1→2→3 | 火山商旅 |
| 科学 | 1→2→3 | 火山生态 |
| 历史 | 1→2→3 | 火山文明 |

> 注：历史为新增学科，难度3开始涉及古代文明、考古知识等

---

## 2. 区域布局（19区域）

### 2.1 普通区域（15个）

**数学链（左侧，x=1）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| south_math_1 | 火山计算站 - 入门 | 1 | (1,1) | south_chinese_1, south_english_1, south_science_1, south_history_1, south_math_2 |
| south_math_2 | 火山计算站 - 进阶 | 2 | (1,3) | south_chinese_2, south_english_2, south_science_2, south_history_2, south_math_1, south_math_3 |
| south_math_3 | 火山计算站 - 挑战 | 3 | (1,5) | south_chinese_3, south_english_3, south_science_3, south_history_3, south_math_2, south_boss |

**语文链（x=2.5）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| south_chinese_1 | 火山古籍馆 - 入门 | 1 | (2.5,1) | south_math_1, south_english_1, south_science_1, south_history_1, south_chinese_2 |
| south_chinese_2 | 火山古籍馆 - 进阶 | 2 | (2.5,3) | south_math_2, south_english_2, south_science_2, south_history_2, south_chinese_1, south_chinese_3 |
| south_chinese_3 | 火山古籍馆 - 挑战 | 3 | (2.5,5) | south_math_3, south_english_3, south_science_3, south_history_3, south_chinese_2, south_boss |

**英语链（x=4）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| south_english_1 | 火山商旅营 - 入门 | 1 | (4,1) | south_math_1, south_chinese_1, south_science_1, south_history_1, south_english_2 |
| south_english_2 | 火山商旅营 - 进阶 | 2 | (4,3) | south_math_2, south_chinese_2, south_science_2, south_history_2, south_english_1, south_english_3 |
| south_english_3 | 火山商旅营 - 挑战 | 3 | (4,5) | south_math_3, south_chinese_3, south_science_3, south_history_3, south_english_2, south_boss |

**科学链（x=5.5）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| south_science_1 | 火山生态站 - 入门 | 1 | (5.5,1) | south_math_1, south_chinese_1, south_english_1, south_history_1, south_science_2 |
| south_science_2 | 火山生态站 - 进阶 | 2 | (5.5,3) | south_math_2, south_chinese_2, south_english_2, south_history_2, south_science_1, south_science_3 |
| south_science_3 | 火山生态站 - 挑战 | 3 | (5.5,5) | south_math_3, south_chinese_3, south_english_3, south_history_3, south_science_2, south_boss |

**历史链（x=7）**
| ID | 名称 | 难度 | 位置(x,z) | 连接 |
|----|------|------|----------|------|
| south_history_1 | 火山文明馆 - 入门 | 1 | (7,1) | south_math_1, south_chinese_1, south_english_1, south_science_1, south_history_2 |
| south_history_2 | 火山文明馆 - 进阶 | 2 | (7,3) | south_math_2, south_chinese_2, south_english_2, south_science_2, south_history_1, south_history_3 |
| south_history_3 | 火山文明馆 - 挑战 | 3 | (7,5) | south_math_3, south_chinese_3, south_english_3, south_science_3, south_history_2, south_boss |

### 2.2 隐藏区域（2个）

| ID | 名称 | 难度 | 位置(x,z) | 钥匙需求 | 连接 |
|----|------|------|----------|---------|------|
| south_hidden_A | 熔岩秘密洞穴 A | 2 | (1.5,0) | 1 | south_math_1 |
| south_hidden_B | 熔岩秘密洞穴 B | 2 | (6,0) | 1 | south_science_1 |

### 2.3 历史特色宝藏区（1个）

| ID | 名称 | 难度 | 位置(x,z) | 钥匙需求 | 连接 |
|----|------|------|----------|---------|------|
| south_treasure_1 | 火山文明遗迹 | 1 | (4,7) | 2 | south_history_2（连接历史链进阶岛屿）|

### 2.4 Boss区域（1个）

| ID | 名称 | 难度 | 位置(x,z) | 怪物 | 连接 |
|----|------|------|----------|------|------|
| south_boss | 熔岩巨龙之巢 | 3 | (4,8) | lava_dragon_king | south_math_3, south_chinese_3, south_english_3, south_science_3, south_history_3（连接所有难度3岛屿）|

---

## 3. 怪物映射（7种类型共16个实例）

| 区域类型 | 怪物ID | 名称 | HP范围 |
|---------|--------|------|--------|
| 数学普通 | flame_fish_1/2/3 | 火焰鱼 | 40/50/60 |
| 语文普通 | lava_turtle_1/2/3 | 熔岩龟 | 40/50/60 |
| 英语普通 | magma_lobster_1/2/3 | 岩浆龙虾 | 40/50/60 |
| 科学普通 | flame_eel_1/2/3 | 焰鼻鳗 | 40/50/60 |
| 历史普通 | ancient_spirit_1/2/3 | 古灵 | 40/50/60 |
| 隐藏区域 | lava_guardian | 熔岩守护者 | 80 |
| Boss | lava_dragon_king | 熔岩巨龙 | 150 |

> 注：难度[3,4]中的难度4由Boss区域（更高HP150）和难度3怪物（HP60）体现，不单独设置难度4普通怪物

---

## 4. 视觉设计

### 4.1 岛屿SVG主题
- **火山岛屿**：深红/橙黑岩石，熔岩流装饰，蒸汽效果
- **熔岩洞穴**：发光橙红内部，熔岩池
- **历史遗迹**：古代石雕，神秘符文

### 4.2 岛屿类型
- normal：标准火山岛屿（深红/灰黑岩石）
- hidden：半透明橙红发光效果
- treasure：宝箱图标（古代遗迹风格）
- boss：巨龙盘旋造型

---

## 5. 连接规则

**同级互联规则：**
- 同一难度等级的不同学科岛屿之间横向互联
- 5链布局：数学→语文→英语→科学→历史

**纵向升级规则：**
- 同一学科内，难度N岛屿连接到难度N+1岛屿

**Boss解锁规则：**
- Boss区域连接到所有难度3的普通区域
- 必须先击败15个普通区域岛屿才能挑战Boss

**隐藏区域规则：**
- 隐藏区域连接相邻学科的第1级岛屿

---

## 6. 实现任务

### 6.1 数据文件
- [ ] `src/data/areas/index.ts`：添加southAreas数组（19个区域：15普通+2隐藏+1宝藏+1Boss）
- [ ] `src/data/monsters/index.ts`：添加新怪物数据（火焰鱼、熔岩龟、岩浆龙虾、焰鼻鳗、古灵、熔岩守护者、熔岩巨龙）
- [ ] `src/game/types.ts`：确保 'history' 在 KnowledgeArea 类型中

### 6.2 无需修改
- 核心游戏逻辑
- 存档系统
- 探索状态机

---

## 7. Boss技能设计

**熔岩巨龙（Lava Dragon King）**
- HP: 150
- 技能1：火焰喷射（造成60伤害）
- 技能2：熔岩护盾（减免30%伤害）
- 技能3：龙之吐息（连续答对4题触发，全屏攻击减少玩家50HP）
- 掉落：4钥匙 + 解锁北冰洋

---

## 8. 完成条件

- 击败熔岩巨龙
- 掉落4把钥匙
- 解锁下一大洋：北冰洋（northIce）
