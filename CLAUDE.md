# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An educational adventure game for children. Two children adventure with Prince Boji and his crew in an ocean world featuring 4 oceans (East, West, South, North) and a mysterious ocean. Players battle monster bosses by answering knowledge-based questions - correct answers reduce monster HP, wrong answers reduce player HP. Difficulty increases progressively, with the Mysterious Ocean being the hardest.

## Architecture

### Tech Stack
- **Frontend**: React 18+ with Vite
- **Game Engine**: React-Three-Fiber (R3F) with OrthographicCamera for 2D view
- **State Management**: Zustand for game state
- **Styling**: CSS Modules or styled-components

### Project Structure
```
src/
├── components/          # React UI components
│   ├── game/            # Game-specific components
│   │   ├── Battle/      # Battle system UI
│   │   ├── Ocean/       # Ocean/level components
│   │   └── UI/          # HUD, menus, dialogs
│   └── common/          # Shared components
├── game/                # Core game logic (framework-agnostic)
│   ├── BattleEngine.ts  # Combat mechanics
│   ├── OceanWorld.ts    # World/map logic
│   ├── ExplorationStateMachine.ts  # Exploration state machine
│   ├── QuestionSelector.ts  # Question selection by category+grade+difficulty
│   └── types.ts         # Game type definitions
├── data/                # Data-driven configurations
│   ├── oceans/          # Ocean zone definitions
│   ├── monsters/        # Boss monster configurations
│   ├── questions/       # Question banks
│   │   ├── subjects/    # Category-based question banks (chinese, math, english, science, physics, chemistry, history)
│   │   └── index.ts     # Exports allQuestions aggregated from subjects/
│   └── areas/           # Area/node definitions for exploration
├── store/               # Zustand state management
│   └── gameStore.ts     # Main game state store
├── hooks/               # Custom React hooks
├── utils/               # Helper functions
└── assets/              # Images, audio, sprites, fonts
```

### Question Bank Architecture

**New category-based structure** (`src/data/questions/subjects/`):
- Questions organized by subject: `chinese.ts`, `math.ts`, `english.ts`, `science.ts`, `physics.ts`, `chemistry.ts`, `history.ts`
- Each question has ID format: `{subject}_{grade}_{difficulty}_{seq}` (e.g., `math_3_1_015`)
- All questions aggregated into `allQuestions` via `src/data/questions/index.ts`
- Question selection uses `QuestionSelector.ts`: filters by `category` + `grade` + `difficulty`
- All oceans share the same question pool (oceanId not used for filtering)

**Subject coverage by grade:**
| Subject | Grades | Difficulties |
|---------|--------|--------------|
| math, chinese, english | 1-9 | 1-3 |
| science | 3-6 | 1-3 |
| physics, chemistry, history | 7-9 | 1-3 |

### Key Architectural Principles
- **Rendering abstraction**: Game rendering lives in dedicated components, decoupled from game logic
- **Data-driven design**: Oceans, monsters, and questions defined as configuration data
- **Progressive difficulty**: Question difficulty tied to ocean zone progression
- **Extensible to 3D**: 2D canvas renderer can be swapped with React-Three-Fiber renderer
- **State machine for exploration**: Ocean exploration uses a state machine (`ExplorationPhase`) with clear transitions: `exploring` → `sailing` → `arrived` → `moving` → `encounter` → `battle`/`treasure`/`hidden_area`

### Exploration Battle Flow

When battle is triggered from exploration:
1. `SELECT_AREA` → user selects destination
2. `sailing` → ship moves along path
3. `arrived` → ship arrives at destination
4. `moving` → character moves on island
5. `encounter` → random encounter check (80% battle / 15% treasure / 5% hidden event)
6. `battle` → question selection via `getRandomQuestion({category, grade, difficulty, excludeIds})`
7. `START_BATTLE` → transitions to Battle component
8. Battle completes → `END_EXPLORATION_BATTLE` → returns to exploration

## Development Commands

```bash
npm install                    # Install dependencies
npm run dev                   # Start development server (http://localhost:5173)
npm run build                 # Build for production
npm run preview               # Preview production build
npm run lint                  # Run ESLint
npm test                      # Run all tests
npm test -- --run             # Run tests once (no watch)
npm test -- --run src/path    # Run specific test file
```

## Code Conventions

- Use functional components with hooks
- All game state changes flow through Zustand actions
- UI components are separated from game logic
- Game mechanics and rules in `src/game/`
- Learning assessments are defined as data-driven configurations
- Exploration state machine defined in `src/game/ExplorationStateMachine.ts`

## Process Requirements

**红蓝对抗审查要求**：在一个阶段工作完成后要采用红蓝对抗review结果给出优化建议。所有设计决策需要经过红蓝对抗审查后才能开始实现。

---

## Ocean Exploration System Design (海上探险系统设计方案)

### A. 视觉效果 (Visual Effects)

| 编号 | 方案 | 选择 | 说明 |
|------|------|------|------|
| A1 | 岛屿SVG组件 | **A1a** | 每个岛屿类型创建独立 SVG 组件（boss/火山/森林/海滩/灯塔等13种） |
| A2 | 海洋背景 | **A2c** | 多层 CSS 渐变 + 动画实现海洋波浪效果 |
| A3 | 迷雾揭示 | **A3a局部揭示** | 点击岛屿后局部揭示该区域 |

### B. 交互体验 (Interaction Experience)

| 编号 | 方案 | 选择 | 说明 |
|------|------|------|------|
| B1 | 船只动画 | **B1b** | 沿航线路径点移动，更真实的航海体验 |
| B2 | 岛屿点击反馈 | **B2b** | 点击后弹出确认面板 |
| B3 | 传送门交互 | **B3b** | 战斗胜利后传送门以旋转动画出现在屏幕中央 |
| B4 | 战斗衔接 | **B4b** | 探索中遭遇战斗时切换到独立 Battle 界面 |

### C. 游戏逻辑 (Game Logic)

| 编号 | 方案 | 选择 | 说明 |
|------|------|------|------|
| C1 | 岛屿遭遇判定 | **C1b** | 随机遭遇：80%战斗 / 15%宝箱 / 5%隐藏事件 |
| C2 | 钥匙获取机制 | **C2c** | Boss 战斗胜利100%掉落钥匙，普通怪物30%概率 |
| C3 | 岛屿解锁流程 | **C3c** | 收集钥匙后需访问一次隐藏岛屿才能解锁 |
| C4 | 进度保存 | **C4c** | 存档点系统 + localStorage 持久化 |

### D. 性能优化 (Performance Optimization)

| 编号 | 方案 | 选择 | 说明 |
|------|------|------|------|
| D1 | 岛屿渲染优化 | **D1b** | 只渲染可见岛屿 + 视口裁剪 |
| D2 | 动画性能 | **D2b** | 使用 requestAnimationFrame |
| D3 | 状态更新优化 | **D3b** | Zustand selector 精确订阅所需状态字段 |
| D4 | SVG资源 | **D4b** | 岛屿 SVG 内联，其他资源按需加载 |

### E. 全局UI (Global UI Components)

| 编号 | 方案 | 选择 | 说明 |
|------|------|------|------|
| E1 | 顶部 HUD | **E1a** | 固定顶部栏显示玩家状态 |
| E2 | 罗盘组件 | **E2b** | 可点击，点击后旋转指向选中的岛屿方向 |
| E3 | 迷你地图 | **E3b** | 显示岛屿类型颜色 + 船只实时位置 |
| E4 | 底部导航栏 | **E4a** | 固定4按钮：船坞/商店/教堂/港口（暂不实现功能）|

### 设计参考

- HTML 原型文件：`exploration-design-reveal.html`
- 大航海时代风格：复古航海地图 + 精美 SVG 岛屿造型
- 13个岛屿各有独特造型：火山、森林、海滩、灯塔、宝塔、竹林、莲花池、沉船、珊瑚礁等

---

## 题库质量保障经验记录 (Question Bank Quality Assurance)

### 问题发现

在红蓝对抗审查中发现大量数学题目答案错误：
- **Grade 7 Difficulty 1**: 12道方程题答案错误（正确答案是x，但选项标记了x+2）
- **Grade 7 Difficulty 2**: 16道方程题答案错误（正确答案是5，标记为4）
- **Grade 6 Difficulty 2**: 13道题目答案全部反转（正确答案在index 0但标记为index 1，或相反）

### 根本原因分析

1. **批量生成时未验证**：大量题目通过模板批量生成，正确答案位置机械化设置
2. **答案位置偏移**：正确答案应该在index 1（第二位置），但被错误地放在index 2或3
3. **数学概念错误**：
   - `25% of 80 = 20`（不是18）
   - `2³ = 8`（不是6）
   - `√144 = 12`（不是11）
   - `4³ = 64`（不是68）
   - `√169 = 13`（不是11）

### 高质量出题检查清单

#### 1. 数学题必须验证的内容

| 检查项 | 方法 |
|--------|------|
| 正确答案计算 | 用计算器或独立计算验证 |
| 错误选项合理性 | 错误选项应该"看起来合理"但明显错误 |
| 答案位置分布 | 确保A/B/C/D四个位置都有正确答案分布 |
| 单位一致性 | 答案单位与题目一致（如有单位需标注） |

#### 2. 方程题特别检查

```
对于 "x + 9 = 18, x = ?"
- 正确解: x = 9
- 验证: 9 + 9 = 18 ✓
- 错误常见: 把 x+2 当作答案（11）而非正确答案（9）
```

#### 3. 答案分布平衡检查

```typescript
// 每个grade+difficulty组合应该有平衡的答案分布
const dist = [0, 0, 0, 0] // A/B/C/D 各位置计数
questions.forEach(q => {
  const idx = q.options.findIndex(o => o.isCorrect)
  if (idx >= 0) dist[idx]++
})
// 检查: min ≤ 每项 ≤ max (根据题目数量动态计算)
```

#### 4. 批量生成后必须执行

- [ ] 数学计算逐一验证
- [ ] 运行答案分布测试
- [ ] 随机抽查10%题目人工验证
- [ ] 确保正确答案文本与isCorrect标志一致

### 反面案例

**错误示例（Grade 6）**：
```typescript
// 错误：2³ = 8，但选项中8的isCorrect是false
{ content: '2³ = ?', options: [{text:'6',isCorrect:true},{text:'8',isCorrect:false}] }
// 正确：正确答案8应该 isCorrect:true
{ content: '2³ = ?', options: [{text:'6',isCorrect:false},{text:'8',isCorrect:true}] }
```

**错误示例（方程）**：
```typescript
// 错误：x + 9 = 18 正确答案 x=9，但标记为11
{ content: 'x + 9 = 18, x = ?', options: [{text:'7',isCorrect:false},{text:'9',isCorrect:false},{text:'11',isCorrect:true}] }
// 正确：正确答案9应该 isCorrect:true
{ content: 'x + 9 = 18, x = ?', options: [{text:'7',isCorrect:false},{text:'9',isCorrect:true},{text:'11',isCorrect:false}] }
```

### 自动化验证建议

```typescript
// 每个题目应该通过这道检查：
function validateQuestion(q: Question): boolean {
  // 1. 恰好有一个 isCorrect: true
  const correctCount = q.options.filter(o => o.isCorrect).length
  if (correctCount !== 1) return false

  // 2. 数学题验证答案
  if (isMathQuestion(q)) {
    const answer = computeAnswer(q.content)
    const correctOption = q.options.find(o => o.isCorrect)
    return correctOption.text === answer.toString()
  }

  return true
}
```

---

## 各科目出题检查要点

### 数学题

| 检查项 | 方法 |
|--------|------|
| 四则运算 | 用计算器验证每道题 |
| 方程题 | 解方程验证答案正确性 |
| 乘方/根号 | 确认2³=8不是6，√144=12不是11 |
| 百分比 | 25% of 80 = 20，不是18 |

### 英语题

| 检查项 | 方法 |
|--------|------|
| 颜色翻译 | red=红, blue=蓝, green=绿, yellow=黄 |
| 句子类型 | greeting(问候) vs exclamation(感叹) vs question(疑问) |
| 拼写题 | b-o-o-k not b-o-k |
| 翻译题 | "狗" = Dog, "猫" = Cat |

### 语文题

| 检查项 | 方法 |
|--------|------|
| 古诗作者 | 《观沧海》作者是曹操，不是刘邦 |
| 名句出处 | "出淤泥而不染"赞美的是莲花，不是牡丹 |
| 词性判断 | 动词(跑步) vs 形容词(美丽) vs 名词(红色) |

### 物理/化学/历史题

| 检查项 | 方法 |
|--------|------|
| 物理公式 | V=IR, P=I²R 验证计算结果 |
| 化学式 | H₂O是水，不是H₂O₂ |
| 历史人物 | 秦始皇vs刘邦，清朝vs明朝 |
| 选项一致性 | 同一题中不能有重复选项 |

---

## 红蓝对抗审查发现记录

### 本次审查修复的错误

| 科目 | 问题数 | 示例 |
|------|--------|------|
| 数学 | 41 | 方程答案偏移、计算错误 |
| 英语 | 5 | 颜色翻译错误、句子类型判断错误 |
| 语文 | 3 | 莲花/牡丹、古诗作者、动词判断 |
| 物理 | 待深入检查 | 选项计算结果不匹配 |
| 历史 | 1 | 选项重复 |

---

### P0 问题 (阻塞性 - 已优化)

| 问题 | 优化方案 |
|------|----------|
| P0-1: answerIndex 边界未检查 | 添加显式边界检查：`answerIndex = Math.min(Math.max(0, idx), answers.length - 1)` |
| P0-2: encounter 逻辑不一致 | 修正逻辑：hidden 类型区域跳过随机直接触发战斗 |
| P0-3: useEffect 闭包问题 | 使用 ref 存储 latest 值或 useCallback 依赖数组 |
| P0-4: 岛屿解锁状态未验证 | 添加状态验证和重置机制 |
| P0-5: null/undefined 处理不足 | 添加 difficulty 回退和类型守卫 |

### P1 问题 (重要 - 已优化)

| 问题 | 优化方案 |
|------|----------|
| P1-1: localStorage 容量限制 | 添加存储大小检测，超限时清理旧数据并提示 |
| P1-2: 钥匙掉落概率公平性 | 保底机制：每5场胜利必获1钥匙 |
| P1-3: retryCount 混淆 | 统一命名：failedAttempts（失败尝试次数） |
| P1-4: visit-to-unlock 未定义 | 明确规则：访问岛屿时检查钥匙数量，不够则提示 |
| P1-5: 传送门生成种子系统 | 实现 seeded random：基于 oceanId + timestamp 生成 |

### P2 问题 (优化建议)

| 问题 | 优化方案 |
|------|----------|
| P2-1: SVG 加载性能 | 使用 SVG sprites 或 CSS containment 隔离重绘 |
| P2-2: 色盲/视力障碍支持 | 添加高对比度模式 + 图案/纹理辅助辨识 |
| P2-3: 儿童确认面板 | 简化确认流程，使用大按钮 + 重复提示 |
| P2-4: 隐藏岛屿可见性 | 添加微弱发光效果提示（不破坏探索惊喜） |

### 实施优先级

1. **立即实施**：P0 所有问题 + P1-2 保底机制
2. **下一版本**：P1-1, P1-3, P1-4, P1-5 + P2-3
3. **后续迭代**：P2-1, P2-2, P2-4
