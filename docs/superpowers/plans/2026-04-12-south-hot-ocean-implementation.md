# South Hot Ocean Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement South Hot Ocean (南热洋) data - 19 areas, 7 monster types (17 instances), following the volcanic lava theme with 5 knowledge chains (math, chinese, english, science, history).

**Architecture:** Data-only implementation. Add southAreas array to areas/index.ts and monster definitions to monsters/index.ts. No core logic changes needed - the existing exploration system will automatically support the new ocean once data is added.

**Tech Stack:** TypeScript, React, Zustand

---

## File Structure

| File | Changes |
|------|---------|
| `src/data/areas/index.ts` | Add `southAreas` array (19 Area objects) |
| `src/data/monsters/index.ts` | Add 7 new monster types (17 instances total) |
| `src/game/types.ts` | Add 'history' to KnowledgeArea type |

---

## Task 1: Add History to KnowledgeArea Type

**Files:**
- Modify: `src/game/types.ts`

Add 'history' to KnowledgeArea union type:

```typescript
// 知识区域类型
export type KnowledgeArea = 'math' | 'chinese' | 'english' | 'science' | 'history' | 'comprehensive'
```

---

## Task 2: Add South Hot Ocean Areas to areas/index.ts

**Files:**
- Modify: `src/data/areas/index.ts`

### Sub-task 2.1: Add southAreas array

Add the following `southAreas` array following the same structure as westAreas.

**数学链（x=1）**
```typescript
{
  id: 'south_math_1',
  oceanId: 'southHot',
  knowledgeArea: 'math',
  name: '火山计算站 - 入门',
  difficulty: 1,
  type: 'normal',
  position: { x: 1, z: 1 },
  requiredKeys: 0,
  monsterId: 'flame_fish_1',
  connections: ['south_chinese_1', 'south_english_1', 'south_science_1', 'south_history_1', 'south_math_2'],
},
{
  id: 'south_math_2',
  oceanId: 'southHot',
  knowledgeArea: 'math',
  name: '火山计算站 - 进阶',
  difficulty: 2,
  type: 'normal',
  position: { x: 1, z: 3 },
  requiredKeys: 0,
  monsterId: 'flame_fish_2',
  connections: ['south_chinese_2', 'south_english_2', 'south_science_2', 'south_history_2', 'south_math_1', 'south_math_3'],
},
{
  id: 'south_math_3',
  oceanId: 'southHot',
  knowledgeArea: 'math',
  name: '火山计算站 - 挑战',
  difficulty: 3,
  type: 'normal',
  position: { x: 1, z: 5 },
  requiredKeys: 0,
  monsterId: 'flame_fish_3',
  connections: ['south_chinese_3', 'south_english_3', 'south_science_3', 'south_history_3', 'south_math_2', 'south_boss'],
},
```

**语文链（x=2.5）**
```typescript
{
  id: 'south_chinese_1',
  oceanId: 'southHot',
  knowledgeArea: 'chinese',
  name: '火山古籍馆 - 入门',
  difficulty: 1,
  type: 'normal',
  position: { x: 2.5, z: 1 },
  requiredKeys: 0,
  monsterId: 'lava_turtle_1',
  connections: ['south_math_1', 'south_english_1', 'south_science_1', 'south_history_1', 'south_chinese_2'],
},
// south_chinese_2: position (2.5, 3), difficulty 2, monsterId 'lava_turtle_2', connections: [..., 'south_chinese_1', 'south_chinese_3']
// south_chinese_3: position (2.5, 5), difficulty 3, monsterId 'lava_turtle_3', connections: [..., 'south_chinese_2', 'south_boss']
```

**英语链（x=4）**
```typescript
{
  id: 'south_english_1',
  oceanId: 'southHot',
  knowledgeArea: 'english',
  name: '火山商旅营 - 入门',
  difficulty: 1,
  type: 'normal',
  position: { x: 4, z: 1 },
  requiredKeys: 0,
  monsterId: 'magma_lobster_1',
  connections: ['south_math_1', 'south_chinese_1', 'south_science_1', 'south_history_1', 'south_english_2'],
},
// south_english_2: position (4, 3), difficulty 2, monsterId 'magma_lobster_2', connections: [..., 'south_english_1', 'south_english_3']
// south_english_3: position (4, 5), difficulty 3, monsterId 'magma_lobster_3', connections: [..., 'south_english_2', 'south_boss']
```

**科学链（x=5.5）**
```typescript
{
  id: 'south_science_1',
  oceanId: 'southHot',
  knowledgeArea: 'science',
  name: '火山生态站 - 入门',
  difficulty: 1,
  type: 'normal',
  position: { x: 5.5, z: 1 },
  requiredKeys: 0,
  monsterId: 'flame_eel_1',
  connections: ['south_math_1', 'south_chinese_1', 'south_english_1', 'south_history_1', 'south_science_2'],
},
// south_science_2: position (5.5, 3), difficulty 2, monsterId 'flame_eel_2', connections: [..., 'south_science_1', 'south_science_3']
// south_science_3: position (5.5, 5), difficulty 3, monsterId 'flame_eel_3', connections: [..., 'south_science_2', 'south_boss']
```

**历史链（x=7）**
```typescript
{
  id: 'south_history_1',
  oceanId: 'southHot',
  knowledgeArea: 'history',
  name: '火山文明馆 - 入门',
  difficulty: 1,
  type: 'normal',
  position: { x: 7, z: 1 },
  requiredKeys: 0,
  monsterId: 'ancient_spirit_1',
  connections: ['south_math_1', 'south_chinese_1', 'south_english_1', 'south_science_1', 'south_history_2'],
},
// south_history_2: position (7, 3), difficulty 2, monsterId 'ancient_spirit_2', connections: [..., 'south_history_1', 'south_history_3']
// south_history_3: position (7, 5), difficulty 3, monsterId 'ancient_spirit_3', connections: [..., 'south_history_2', 'south_boss']
```

**隐藏区域（x=1.5, 6，z=0）**
```typescript
{
  id: 'south_hidden_A',
  oceanId: 'southHot',
  knowledgeArea: 'math',
  name: '熔岩秘密洞穴 A',
  difficulty: 2,
  type: 'hidden',
  position: { x: 1.5, z: 0 },
  requiredKeys: 1,
  monsterId: 'lava_guardian',
  connections: ['south_math_1'],
},
{
  id: 'south_hidden_B',
  oceanId: 'southHot',
  knowledgeArea: 'science',
  name: '熔岩秘密洞穴 B',
  difficulty: 2,
  type: 'hidden',
  position: { x: 6, z: 0 },
  requiredKeys: 1,
  monsterId: 'lava_guardian',
  connections: ['south_science_1'],
},
```

**宝藏区域**
```typescript
{
  id: 'south_treasure_1',
  oceanId: 'southHot',
  knowledgeArea: 'history',
  name: '火山文明遗迹',
  difficulty: 1,
  type: 'treasure',
  position: { x: 4, z: 7 },
  requiredKeys: 2,
  monsterId: 'treasure_spirit',
  connections: ['south_history_2'],
},
```

**Boss区域**
```typescript
{
  id: 'south_boss',
  oceanId: 'southHot',
  knowledgeArea: 'comprehensive',
  name: '熔岩巨龙之巢',
  difficulty: 3,
  type: 'boss',
  position: { x: 4, z: 8 },
  requiredKeys: 0,
  monsterId: 'lava_dragon_king',
  connections: ['south_math_3', 'south_chinese_3', 'south_english_3', 'south_science_3', 'south_history_3'],
},
```

### Sub-task 2.2: Update areasData record

Add `southHot: southAreas` to the areasData object:

```typescript
export const areasData: Record<string, Area[]> = {
  east: eastAreas,
  west: westAreas,
  southHot: southAreas,  // 添加这行
  northIce: [],
  mysterious: [],
}
```

---

## Task 3: Add South Hot Ocean Monsters to monsters/index.ts

**Files:**
- Modify: `src/data/monsters/index.ts`

Add the following monster entries to `monstersData` object (7 types, 17 instances total):

**Flame Fish (数学)**
```typescript
flame_fish_1: { id: 'flame_fish_1', name: '火焰鱼', hp: 40, maxHp: 40, sprite: '🐟' },
flame_fish_2: { id: 'flame_fish_2', name: '火焰鳗', hp: 50, maxHp: 50, sprite: '🐟' },
flame_fish_3: { id: 'flame_fish_3', name: '火焰鱼王', hp: 60, maxHp: 60, sprite: '🐠' },
```

**Lava Turtle (语文)**
```typescript
lava_turtle_1: { id: 'lava_turtle_1', name: '熔岩龟', hp: 40, maxHp: 40, sprite: '🐢' },
lava_turtle_2: { id: 'lava_turtle_2', name: '熔岩巨龟', hp: 50, maxHp: 50, sprite: '🐢' },
lava_turtle_3: { id: 'lava_turtle_3', name: '熔岩神龟', hp: 60, maxHp: 60, sprite: '🐢' },
```

**Magma Lobster (英语)**
```typescript
magma_lobster_1: { id: 'magma_lobster_1', name: '岩浆龙虾', hp: 40, maxHp: 40, sprite: '🦞' },
magma_lobster_2: { id: 'magma_lobster_2', name: '岩浆巨钳', hp: 50, maxHp: 50, sprite: '🦞' },
magma_lobster_3: { id: 'magma_lobster_3', name: '岩浆虾王', hp: 60, maxHp: 60, sprite: '🦞' },
```

**Flame Eel (科学)**
```typescript
flame_eel_1: { id: 'flame_eel_1', name: '焰鼻鳗', hp: 40, maxHp: 40, sprite: '🐍' },
flame_eel_2: { id: 'flame_eel_2', name: '焰鼻巨鳗', hp: 50, maxHp: 50, sprite: '🐍' },
flame_eel_3: { id: 'flame_eel_3', name: '焰鼻鳗皇', hp: 60, maxHp: 60, sprite: '🐍' },
```

**Ancient Spirit (历史)**
```typescript
ancient_spirit_1: { id: 'ancient_spirit_1', name: '古灵', hp: 40, maxHp: 40, sprite: '👻' },
ancient_spirit_2: { id: 'ancient_spirit_2', name: '古灵长', hp: 50, maxHp: 50, sprite: '👻' },
ancient_spirit_3: { id: 'ancient_spirit_3', name: '古灵王', hp: 60, maxHp: 60, sprite: '👻' },
```

**Lava Guardian (隐藏区域)**
```typescript
lava_guardian: { id: 'lava_guardian', name: '熔岩守护者', hp: 80, maxHp: 80, sprite: '🗿' },
```

**Lava Dragon King (Boss)**
```typescript
lava_dragon_king: { id: 'lava_dragon_king', name: '熔岩巨龙', hp: 150, maxHp: 150, sprite: '🐉' },
```

---

## Task 4: Verify Build and Tests

- [ ] Run `npm run build` - must pass with no errors
- [ ] Run `npm test` - all tests pass
- [ ] Verify southHot ocean data loads correctly by checking areasData['southHot'] length === 19

---

## Verification

1. `npm run dev` - navigate to South Hot Ocean and verify:
   - 19 islands appear on the map
   - 5 chains visible (math, chinese, english, science, history)
   - Hidden islands show with glow effect
   - Treasure island shows with chest icon
   - Boss island shows at top center
2. `npm test` passes
3. `npm run build` succeeds
