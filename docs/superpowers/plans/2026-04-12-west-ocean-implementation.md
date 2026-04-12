# West Ocean Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement West Ocean (西大洋) data - 16 areas, 9 monster types, following the desert island theme with 4 knowledge chains (math, chinese, english, science).

**Architecture:** Data-only implementation. Add westAreas array to areas/index.ts and monster definitions to monsters/index.ts. No core logic changes needed - the existing exploration system, battle system, and save system will automatically support the new ocean once data is added.

**Tech Stack:** TypeScript, React, Zustand

---

## File Structure

| File | Changes |
|------|---------|
| `src/data/areas/index.ts` | Add `westAreas` array (16 Area objects) |
| `src/data/monsters/index.ts` | Add 9 new monster definitions (scorpion, lizard, snake, desert_eagle, desert_guardian, treasure_spirit, sea_serpent_king) |

---

## Task 1: Add West Ocean Areas to areas/index.ts

**Files:**
- Modify: `src/data/areas/index.ts`

### Sub-task 1.1: Add westAreas array

Add the following `westAreas` array after the `eastAreas` definition. Follow the exact same structure as eastAreas but with 16 areas.

**数学链（左侧，x=1）**
```typescript
{
  id: 'west_math_1',
  oceanId: 'west',
  knowledgeArea: 'math',
  name: '沙漠计算站 - 入门',
  difficulty: 1,
  type: 'normal',
  position: { x: 1, z: 1 },
  requiredKeys: 0,
  monsterId: 'scorpion_1',
  connections: ['west_chinese_1', 'west_english_1', 'west_science_1', 'west_math_2'],
},
{
  id: 'west_math_2',
  oceanId: 'west',
  knowledgeArea: 'math',
  name: '沙漠计算站 - 进阶',
  difficulty: 2,
  type: 'normal',
  position: { x: 1, z: 3 },
  requiredKeys: 0,
  monsterId: 'scorpion_2',
  connections: ['west_chinese_2', 'west_english_2', 'west_science_2', 'west_math_1', 'west_math_3'],
},
{
  id: 'west_math_3',
  oceanId: 'west',
  knowledgeArea: 'math',
  name: '沙漠计算站 - 挑战',
  difficulty: 3,
  type: 'normal',
  position: { x: 1, z: 5 },
  requiredKeys: 0,
  monsterId: 'scorpion_3',
  connections: ['west_chinese_3', 'west_english_3', 'west_science_3', 'west_math_2', 'west_boss'],
},
```

**语文链（x=3）**
```typescript
{
  id: 'west_chinese_1',
  oceanId: 'west',
  knowledgeArea: 'chinese',
  name: '沙漠古籍馆 - 入门',
  difficulty: 1,
  type: 'normal',
  position: { x: 3, z: 1 },
  requiredKeys: 0,
  monsterId: 'lizard_1',
  connections: ['west_math_1', 'west_english_1', 'west_science_1', 'west_chinese_2'],
},
// ... west_chinese_2, west_chinese_3 with similar pattern
```

**英语链（x=5）**
```typescript
{
  id: 'west_english_1',
  oceanId: 'west',
  knowledgeArea: 'english',
  name: '商旅语言营 - 入门',
  difficulty: 1,
  type: 'normal',
  position: { x: 5, z: 1 },
  requiredKeys: 0,
  monsterId: 'snake_1',
  connections: ['west_math_1', 'west_chinese_1', 'west_science_1', 'west_english_2'],
},
// ... west_english_2, west_english_3 with similar pattern
```

**科学链（x=7）**
```typescript
{
  id: 'west_science_1',
  oceanId: 'west',
  knowledgeArea: 'science',
  name: '沙漠生态站 - 入门',
  difficulty: 1,
  type: 'normal',
  position: { x: 7, z: 1 },
  requiredKeys: 0,
  monsterId: 'desert_eagle_1',
  connections: ['west_math_1', 'west_chinese_1', 'west_english_1', 'west_science_2'],
},
// ... west_science_2, west_science_3 with similar pattern
```

**隐藏区域（x=2,6，z=0）**
```typescript
{
  id: 'west_hidden_A',
  oceanId: 'west',
  knowledgeArea: 'math',
  name: '沙漠秘密绿洲 A',
  difficulty: 2,
  type: 'hidden',
  position: { x: 2, z: 0 },
  requiredKeys: 1,
  monsterId: 'desert_guardian',
  connections: ['west_math_1'],
},
{
  id: 'west_hidden_B',
  oceanId: 'west',
  knowledgeArea: 'science',
  name: '沙漠秘密绿洲 B',
  difficulty: 2,
  type: 'hidden',
  position: { x: 6, z: 0 },
  requiredKeys: 1,
  monsterId: 'desert_guardian',
  connections: ['west_science_1'],
},
```

**宝藏区域**
```typescript
{
  id: 'west_treasure_1',
  oceanId: 'west',
  knowledgeArea: 'math',
  name: '沙漠宝藏秘境',
  difficulty: 1,
  type: 'treasure',
  position: { x: 4, z: 7 },
  requiredKeys: 2,
  monsterId: 'treasure_spirit',
  connections: ['west_chinese_2'],
},
```

**Boss区域**
```typescript
{
  id: 'west_boss',
  oceanId: 'west',
  knowledgeArea: 'comprehensive',
  name: '海蛇王之巢',
  difficulty: 3,
  type: 'boss',
  position: { x: 4, z: 8 },
  requiredKeys: 0,
  monsterId: 'sea_serpent_king',
  connections: ['west_math_3', 'west_chinese_3', 'west_english_3', 'west_science_3'],
},
```

### Sub-task 1.2: Update areasData record

Add `west: westAreas` to the `areasData` record:

```typescript
export const areasData: Record<string, Area[]> = {
  east: eastAreas,
  west: westAreas,  // 添加这行
  southHot: [],
  northIce: [],
  mysterious: [],
}
```

---

## Task 2: Add West Ocean Monsters to monsters/index.ts

**Files:**
- Modify: `src/data/monsters/index.ts`

Add the following monster entries to `monstersData` object:

### 沙漠蝎子（数学）
```typescript
scorpion_1: {
  id: 'scorpion_1',
  name: '沙漠蝎子',
  hp: 35,
  maxHp: 35,
  sprite: '🦂',
},
scorpion_2: {
  id: 'scorpion_2',
  name: '沙漠巨蝎',
  hp: 45,
  maxHp: 45,
  sprite: '🦂',
},
scorpion_3: {
  id: 'scorpion_3',
  name: '沙漠蝎王',
  hp: 55,
  maxHp: 55,
  sprite: '🦂',
},
```

### 沙漠蜥蜴（语文）
```typescript
lizard_1: {
  id: 'lizard_1',
  name: '沙漠蜥蜴',
  hp: 35,
  maxHp: 35,
  sprite: '🦎',
},
lizard_2: {
  id: 'lizard_2',
  name: '沙漠巨蜥',
  hp: 45,
  maxHp: 45,
  sprite: '🦎',
},
lizard_3: {
  id: 'lizard_3',
  name: '沙漠蜥王',
  hp: 55,
  maxHp: 55,
  sprite: '🦎',
},
```

### 响尾蛇（英语）
```typescript
snake_1: {
  id: 'snake_1',
  name: '响尾蛇',
  hp: 35,
  maxHp: 35,
  sprite: '🐍',
},
snake_2: {
  id: 'snake_2',
  name: '沙漠蟒蛇',
  hp: 45,
  maxHp: 45,
  sprite: '🐍',
},
snake_3: {
  id: 'snake_3',
  name: '响尾蛇王',
  hp: 55,
  maxHp: 55,
  sprite: '🐍',
},
```

### 沙漠鹰（科学）
```typescript
desert_eagle_1: {
  id: 'desert_eagle_1',
  name: '沙漠鹰',
  hp: 35,
  maxHp: 35,
  sprite: '🦅',
},
desert_eagle_2: {
  id: 'desert_eagle_2',
  name: '沙漠巨鹰',
  hp: 45,
  maxHp: 45,
  sprite: '🦅',
},
desert_eagle_3: {
  id: 'desert_eagle_3',
  name: '沙漠鹰王',
  hp: 55,
  maxHp: 55,
  sprite: '🦅',
},
```

### 沙漠守护者（隐藏区域）
```typescript
desert_guardian: {
  id: 'desert_guardian',
  name: '沙漠守护者',
  hp: 70,
  maxHp: 70,
  sprite: '🗿',
},
```

### 宝藏精灵（宝藏区域）
```typescript
treasure_spirit: {
  id: 'treasure_spirit',
  name: '宝藏精灵',
  hp: 50,
  maxHp: 50,
  sprite: '💎',
},
```

### 海蛇王（Boss）
```typescript
sea_serpent_king: {
  id: 'sea_serpent_king',
  name: '海蛇王',
  hp: 130,
  maxHp: 130,
  sprite: '🐉',
  skills: ['wave_attack', 'constrict', 'deep_sea_call'],
},
```

---

## Task 3: Verify Build and Tests

- [ ] Run `npm run build` - must pass with no errors
- [ ] Run `npm test` - all tests pass
- [ ] Verify west ocean data loads correctly by checking areasData['west'] length === 16

---

## Verification

1. `npm run dev` - navigate to West Ocean and verify:
   - 16 islands appear on the map
   - 4 chains (math, chinese, english, science) visible
   - Hidden islands show with glow effect
   - Treasure island shows with chest icon
   - Boss island shows at top center
2. `npm test` passes
3. `npm run build` succeeds
