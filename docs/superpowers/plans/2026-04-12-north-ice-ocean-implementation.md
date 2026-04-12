# North Ice Ocean Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement North Ice Ocean (北冰洋) data - 22 areas, 7 monster types (20 instances), plus expand question bank to cover physics, chemistry, science grades 1-7, and history.

**Architecture:** Data implementation with question bank expansion. Add northAreas array, monster definitions, update types, and expand question bank for new subjects.

**Tech Stack:** TypeScript, React, Zustand

---

## File Structure

| File | Changes |
|------|---------|
| `src/game/types.ts` | Add 'physics' and 'chemistry' to KnowledgeArea and Category types |
| `src/data/areas/index.ts` | Add `northAreas` array (22 Area objects) |
| `src/data/monsters/index.ts` | Add 7 new monster types (20 instances) |
| `src/data/questions/graded.ts` | Expand question bank for new subjects |
| `src/game/QuestionSelector.ts` | Update to support new subject categories |

---

## Task 1: Update KnowledgeArea and Category Types

**Files:**
- Modify: `src/game/types.ts`

### Sub-task 1.1: Update KnowledgeArea type
```typescript
export type KnowledgeArea = 'math' | 'chinese' | 'english' | 'science' | 'history' | 'physics' | 'chemistry' | 'comprehensive'
```

### Sub-task 1.2: Update QuestionCategory type (if exists)
Check and update the QuestionCategory type to include:
```typescript
export type QuestionCategory = 'math' | 'chinese' | 'english' | 'science' | 'history' | 'physics' | 'chemistry'
```

---

## Task 2: Add North Ice Ocean Areas to areas/index.ts

**Files:**
- Modify: `src/data/areas/index.ts`

### Sub-task 2.1: Add northAreas array (22 areas)

**语文链（x=1）**
- north_chinese_1: position (1,1), difficulty 1, monsterId 'polar_bear_1', connections: [..., north_math_1, north_chinese_2]
- north_chinese_2: position (1,3), difficulty 2, monsterId 'polar_bear_2', connections: [..., north_math_2, north_chinese_1, north_chinese_3]
- north_chinese_3: position (1,5), difficulty 3, monsterId 'polar_bear_3', connections: [..., north_math_3, north_chinese_2, north_boss]

**数学链（x=2.5）**
- north_math_1: position (2.5,1), difficulty 1, monsterId 'penguin_1', connections: [..., north_math_2]
- north_math_2: position (2.5,3), difficulty 2, monsterId 'penguin_2', connections: [..., north_math_1, north_math_3]
- north_math_3: position (2.5,5), difficulty 3, monsterId 'penguin_3', connections: [..., north_math_2, north_boss]

**英语链（x=4）**
- north_english_1: position (4,1), difficulty 1, monsterId 'seal_1', connections: [..., north_english_2]
- north_english_2: position (4,3), difficulty 2, monsterId 'seal_2', connections: [..., north_english_1, north_english_3]
- north_english_3: position (4,5), difficulty 3, monsterId 'seal_3', connections: [..., north_english_2, north_boss]

**科学链（x=5.5）**
- north_science_1: position (5.5,1), difficulty 1, monsterId 'whale_1', connections: [..., north_science_2]
- north_science_2: position (5.5,3), difficulty 2, monsterId 'whale_2', connections: [..., north_science_1, north_science_3]
- north_science_3: position (5.5,5), difficulty 3, monsterId 'whale_3', connections: [..., north_science_2, north_boss]

**物理链（x=7）**
- north_physics_1: position (7,1), difficulty 1, monsterId 'ice_crystal_1', connections: [..., north_physics_2]
- north_physics_2: position (7,3), difficulty 2, monsterId 'ice_crystal_2', connections: [..., north_physics_1, north_physics_3]
- north_physics_3: position (7,5), difficulty 3, monsterId 'ice_crystal_3', connections: [..., north_physics_2, north_boss]

**化学链（x=8.5）**
- north_chemistry_1: position (8.5,1), difficulty 1, monsterId 'snowflake_1', connections: [..., north_chemistry_2]
- north_chemistry_2: position (8.5,3), difficulty 2, monsterId 'snowflake_2', connections: [..., north_chemistry_1, north_chemistry_3]
- north_chemistry_3: position (8.5,5), difficulty 3, monsterId 'snowflake_3', connections: [..., north_chemistry_2, north_boss]

**隐藏区域（x=1.5, 7.5，z=0）**
- north_hidden_A: position (1.5,0), difficulty 2, type 'hidden', requiredKeys 1, monsterId 'ice_guardian', connections: ['north_chinese_1']
- north_hidden_B: position (7.5,0), difficulty 2, type 'hidden', requiredKeys 1, monsterId 'ice_guardian', connections: ['north_physics_1']

**宝藏区域**
- north_treasure_1: position (4,7), difficulty 1, type 'treasure', requiredKeys 2, monsterId 'treasure_spirit', connections: ['north_chemistry_2']

**Boss区域**
- north_boss: position (4,8), difficulty 3, type 'boss', monsterId 'arctic_whale_king', connections: [all 6 difficulty-3 areas]

### Sub-task 2.2: Update areasData record
Add `northIce: northAreas` to the areasData object.

---

## Task 3: Add North Ice Ocean Monsters to monsters/index.ts

**Files:**
- Modify: `src/data/monsters/index.ts`

Add the following monster entries (7 types, 20 instances):

**Polar Bear (语文)**
```typescript
polar_bear_1: { id: 'polar_bear_1', name: '北极熊', hp: 45, maxHp: 45, sprite: '🐻‍❄️' },
polar_bear_2: { id: 'polar_bear_2', name: '北极熊王', hp: 55, maxHp: 55, sprite: '🐻‍❄️' },
polar_bear_3: { id: 'polar_bear_3', name: '北极熊皇', hp: 65, maxHp: 65, sprite: '🐻‍❄️' },
```

**Penguin (数学)**
```typescript
penguin_1: { id: 'penguin_1', name: '企鹅', hp: 45, maxHp: 45, sprite: '🐧' },
penguin_2: { id: 'penguin_2', name: '帝企鹅', hp: 55, maxHp: 55, sprite: '🐧' },
penguin_3: { id: 'penguin_3', name: '企鹅王', hp: 65, maxHp: 65, sprite: '🐧' },
```

**Seal (英语)**
```typescript
seal_1: { id: 'seal_1', name: '海豹', hp: 45, maxHp: 45, sprite: '🦭' },
seal_2: { id: 'seal_2', name: '海豹王', hp: 55, maxHp: 55, sprite: '🦭' },
seal_3: { id: 'seal_3', name: '海豹皇', hp: 65, maxHp: 65, sprite: '🦭' },
```

**Whale (科学)**
```typescript
whale_1: { id: 'whale_1', name: '鲸鱼', hp: 45, maxHp: 45, sprite: '🐋' },
whale_2: { id: 'whale_2', name: '蓝鲸', hp: 55, maxHp: 55, sprite: '🐋' },
whale_3: { id: 'whale_3', name: '鲸鱼王', hp: 65, maxHp: 65, sprite: '🐋' },
```

**Ice Crystal (物理)**
```typescript
ice_crystal_1: { id: 'ice_crystal_1', name: '冰晶', hp: 45, maxHp: 45, sprite: '💠' },
ice_crystal_2: { id: 'ice_crystal_2', name: '大冰晶', hp: 55, maxHp: 55, sprite: '💠' },
ice_crystal_3: { id: 'ice_crystal_3', name: '冰晶王', hp: 65, maxHp: 65, sprite: '💠' },
```

**Snowflake (化学)**
```typescript
snowflake_1: { id: 'snowflake_1', name: '雪花', hp: 45, maxHp: 45, sprite: '❄️' },
snowflake_2: { id: 'snowflake_2', name: '大雪花', hp: 55, maxHp: 55, sprite: '❄️' },
snowflake_3: { id: 'snowflake_3', name: '雪花王', hp: 65, maxHp: 65, sprite: '❄️' },
```

**Ice Guardian (隐藏区域)**
```typescript
ice_guardian: { id: 'ice_guardian', name: '冰之守护者', hp: 90, maxHp: 90, sprite: '🗿' },
```

**Arctic Whale King (Boss)**
```typescript
arctic_whale_king: { id: 'arctic_whale_king', name: '北极巨鲸', hp: 180, maxHp: 180, sprite: '🐋' },
```

---

## Task 4: Expand Question Bank

**Files:**
- Modify: `src/data/questions/graded.ts`

### Sub-task 4.1: Add Science Questions (Grade 1-7)
Add science questions for grades 1-7 (each grade needs ~20 questions across difficulties 1-3):
- Grade 1-3: Basic natural phenomena, animals, plants
- Grade 4-5: Earth science, motion, energy
- Grade 6-7: More advanced physics and chemistry basics

### Sub-task 4.2: Add History Questions (Grade 1-9)
Add history questions for grades 1-9 (each grade needs ~15 questions):
- Grade 1-3: Local history, famous historical figures
- Grade 4-6: Chinese history, world history basics
- Grade 7-9: Ancient civilizations, modern history

### Sub-task 4.3: Add Physics Questions (Grade 1-9)
Add physics questions for grades 1-9 (each grade needs ~15 questions):
- Grade 1-3: Motion, forces, simple machines
- Grade 4-6: Energy, electricity, magnetism
- Grade 7-9: Advanced mechanics, waves, optics

### Sub-task 4.4: Add Chemistry Questions (Grade 1-9)
Add chemistry questions for grades 1-9 (each grade needs ~15 questions):
- Grade 1-3: Materials, states of matter
- Grade 4-6: Elements, compounds, reactions
- Grade 7-9: Atomic structure, chemical bonds, reactions

### Sub-task 4.5: Update Question Category
Ensure all new questions use the correct category: 'science', 'history', 'physics', 'chemistry'

---

## Task 5: Update QuestionSelector

**Files:**
- Modify: `src/game/QuestionSelector.ts`

Update the question selection logic to:
1. Support new subject categories: 'physics', 'chemistry', 'history'
2. Map area knowledgeArea to correct question category
3. Ensure fallback logic works for missing question banks

---

## Task 6: Verify Build and Tests

- [ ] Run `npm run build` - must pass with no errors
- [ ] Run `npm test` - all tests pass
- [ ] Verify northIce ocean data loads correctly (areasData['northIce'].length === 22)
- [ ] Verify new monster IDs exist in monstersData

---

## Verification

1. `npm run dev` - navigate to North Ice Ocean and verify:
   - 22 islands appear on the map
   - 6 chains visible (chinese, math, english, science, physics, chemistry)
   - Hidden islands show with glow effect
   - Treasure island shows with chest icon
   - Boss island shows at top center
2. Question bank coverage verified for new subjects
3. `npm test` passes
4. `npm run build` succeeds
