# Mysterious Ocean Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Mysterious Ocean (神秘大洋) data - 25 areas, 8 monster types (23 instances), following the ghost sea theme with 7 knowledge chains (chinese, math, english, science, physics, chemistry, history).

**Architecture:** Data-only implementation. Add mystAreas array to areas/index.ts and monster definitions to monsters/index.ts. No core logic changes needed - the existing exploration system will automatically support the new ocean once data is added.

**Tech Stack:** TypeScript, React, Zustand

---

## File Structure

| File | Changes |
|------|---------|
| `src/data/areas/index.ts` | Add `mystAreas` array (25 Area objects) |
| `src/data/monsters/index.ts` | Add 8 new monster types (23 instances total) |

---

## Task 1: Add Mysterious Ocean Areas to areas/index.ts

**Files:**
- Modify: `src/data/areas/index.ts`

### Sub-task 1.1: Add mystAreas array (25 areas)

**语文链（x=1）**
- myst_chinese_1: position (1,1), difficulty 1, monsterId 'ghost_bear_1', connections: [myst_math_1, myst_english_1, myst_science_1, myst_physics_1, myst_chemistry_1, myst_history_1, myst_chinese_2]
- myst_chinese_2: position (1,3), difficulty 2, monsterId 'ghost_bear_2', connections: [myst_math_2, myst_english_2, myst_science_2, myst_physics_2, myst_chemistry_2, myst_history_2, myst_chinese_1, myst_chinese_3]
- myst_chinese_3: position (1,5), difficulty 3, monsterId 'ghost_bear_3', connections: [myst_math_3, myst_english_3, myst_science_3, myst_physics_3, myst_chemistry_3, myst_history_3, myst_chinese_2, myst_boss]

**数学链（x=2.5）**
- myst_math_1: position (2.5,1), difficulty 1, monsterId 'ghost_penguin_1', connections: [myst_chinese_1, myst_english_1, myst_science_1, myst_physics_1, myst_chemistry_1, myst_history_1, myst_math_2]
- myst_math_2: position (2.5,3), difficulty 2, monsterId 'ghost_penguin_2', connections: [myst_chinese_2, myst_english_2, myst_science_2, myst_physics_2, myst_chemistry_2, myst_history_2, myst_math_1, myst_math_3]
- myst_math_3: position (2.5,5), difficulty 3, monsterId 'ghost_penguin_3', connections: [myst_chinese_3, myst_english_3, myst_science_3, myst_physics_3, myst_chemistry_3, myst_history_3, myst_math_2, myst_boss]

**英语链（x=4）**
- myst_english_1: position (4,1), difficulty 1, monsterId 'ghost_seal_1', connections: [myst_chinese_1, myst_math_1, myst_science_1, myst_physics_1, myst_chemistry_1, myst_history_1, myst_english_2]
- myst_english_2: position (4,3), difficulty 2, monsterId 'ghost_seal_2', connections: [myst_chinese_2, myst_math_2, myst_science_2, myst_physics_2, myst_chemistry_2, myst_history_2, myst_english_1, myst_english_3]
- myst_english_3: position (4,5), difficulty 3, monsterId 'ghost_seal_3', connections: [myst_chinese_3, myst_math_3, myst_science_3, myst_physics_3, myst_chemistry_3, myst_history_3, myst_english_2, myst_boss]

**科学链（x=5.5）**
- myst_science_1: position (5.5,1), difficulty 1, monsterId 'ghost_jellyfish_1', connections: [myst_chinese_1, myst_math_1, myst_english_1, myst_physics_1, myst_chemistry_1, myst_history_1, myst_science_2]
- myst_science_2: position (5.5,3), difficulty 2, monsterId 'ghost_jellyfish_2', connections: [myst_chinese_2, myst_math_2, myst_english_2, myst_physics_2, myst_chemistry_2, myst_history_2, myst_science_1, myst_science_3]
- myst_science_3: position (5.5,5), difficulty 3, monsterId 'ghost_jellyfish_3', connections: [myst_chinese_3, myst_math_3, myst_english_3, myst_physics_3, myst_chemistry_3, myst_history_3, myst_science_2, myst_boss]

**物理链（x=7）**
- myst_physics_1: position (7,1), difficulty 1, monsterId 'ghost_eagle_1', connections: [myst_chinese_1, myst_math_1, myst_english_1, myst_science_1, myst_chemistry_1, myst_history_1, myst_physics_2]
- myst_physics_2: position (7,3), difficulty 2, monsterId 'ghost_eagle_2', connections: [myst_chinese_2, myst_math_2, myst_english_2, myst_science_2, myst_chemistry_2, myst_history_2, myst_physics_1, myst_physics_3]
- myst_physics_3: position (7,5), difficulty 3, monsterId 'ghost_eagle_3', connections: [myst_chinese_3, myst_math_3, myst_english_3, myst_science_3, myst_chemistry_3, myst_history_3, myst_physics_2, myst_boss]

**化学链（x=8.5）**
- myst_chemistry_1: position (8.5,1), difficulty 1, monsterId 'ghost_turtle_1', connections: [myst_chinese_1, myst_math_1, myst_english_1, myst_science_1, myst_physics_1, myst_history_1, myst_chemistry_2]
- myst_chemistry_2: position (8.5,3), difficulty 2, monsterId 'ghost_turtle_2', connections: [myst_chinese_2, myst_math_2, myst_english_2, myst_science_2, myst_physics_2, myst_history_2, myst_chemistry_1, myst_chemistry_3]
- myst_chemistry_3: position (8.5,5), difficulty 3, monsterId 'ghost_turtle_3', connections: [myst_chinese_3, myst_math_3, myst_english_3, myst_science_3, myst_physics_3, myst_history_3, myst_chemistry_2, myst_boss]

**历史链（x=10）**
- myst_history_1: position (10,1), difficulty 1, monsterId 'ghost_snake_1', connections: [myst_chinese_1, myst_math_1, myst_english_1, myst_science_1, myst_physics_1, myst_chemistry_1, myst_history_2]
- myst_history_2: position (10,3), difficulty 2, monsterId 'ghost_snake_2', connections: [myst_chinese_2, myst_math_2, myst_english_2, myst_science_2, myst_physics_2, myst_chemistry_2, myst_history_1, myst_history_3]
- myst_history_3: position (10,5), difficulty 3, monsterId 'ghost_snake_3', connections: [myst_chinese_3, myst_math_3, myst_english_3, myst_science_3, myst_physics_3, myst_chemistry_3, myst_history_2, myst_boss]

**隐藏区域（2个）**
- myst_hidden_A: position (1.5,0), difficulty 2, type 'hidden', requiredKeys 1, monsterId 'shadow_guardian', connections: ['myst_chinese_1']
- myst_hidden_B: position (9,0), difficulty 2, type 'hidden', requiredKeys 1, monsterId 'shadow_guardian', connections: ['myst_chemistry_1']

**宝藏区域（1个）**
- myst_treasure_1: position (5,7), difficulty 1, type 'treasure', requiredKeys 2, monsterId 'treasure_spirit', connections: ['myst_history_2']

**Boss区域（1个）**
- myst_boss: position (5,8), difficulty 3, type 'boss', monsterId 'kraken_prime', connections: [myst_chinese_3, myst_math_3, myst_english_3, myst_science_3, myst_physics_3, myst_chemistry_3, myst_history_3]

### Sub-task 1.2: Update areasData record

Add `mysterious: mystAreas` to the areasData object (replace the empty array placeholder).

---

## Task 2: Add Mysterious Ocean Monsters to monsters/index.ts

**Files:**
- Modify: `src/data/monsters/index.ts`

Add the following monster entries (8 types, 23 instances total):

**Ghost Bear (语文)**
```typescript
ghost_bear_1: { id: 'ghost_bear_1', name: '幽灵熊', hp: 50, maxHp: 50, sprite: '🐻' },
ghost_bear_2: { id: 'ghost_bear_2', name: '幽灵熊王', hp: 60, maxHp: 60, sprite: '🐻' },
ghost_bear_3: { id: 'ghost_bear_3', name: '幽灵熊皇', hp: 70, maxHp: 70, sprite: '🐻' },
```

**Ghost Penguin (数学)**
```typescript
ghost_penguin_1: { id: 'ghost_penguin_1', name: '幽灵企鹅', hp: 50, maxHp: 50, sprite: '🐧' },
ghost_penguin_2: { id: 'ghost_penguin_2', name: '幽灵企鹅王', hp: 60, maxHp: 60, sprite: '🐧' },
ghost_penguin_3: { id: 'ghost_penguin_3', name: '幽灵企鹅皇', hp: 70, maxHp: 70, sprite: '🐧' },
```

**Ghost Seal (英语)**
```typescript
ghost_seal_1: { id: 'ghost_seal_1', name: '幽灵海豹', hp: 50, maxHp: 50, sprite: '🦭' },
ghost_seal_2: { id: 'ghost_seal_2', name: '幽灵海豹王', hp: 60, maxHp: 60, sprite: '🦭' },
ghost_seal_3: { id: 'ghost_seal_3', name: '幽灵海豹皇', hp: 70, maxHp: 70, sprite: '🦭' },
```

**Ghost Jellyfish (科学)**
```typescript
ghost_jellyfish_1: { id: 'ghost_jellyfish_1', name: '幽灵水母', hp: 50, maxHp: 50, sprite: '🪼' },
ghost_jellyfish_2: { id: 'ghost_jellyfish_2', name: '幽灵水母王', hp: 60, maxHp: 60, sprite: '🪼' },
ghost_jellyfish_3: { id: 'ghost_jellyfish_3', name: '幽灵水母皇', hp: 70, maxHp: 70, sprite: '🪼' },
```

**Ghost Eagle (物理)**
```typescript
ghost_eagle_1: { id: 'ghost_eagle_1', name: '幽灵鹰', hp: 50, maxHp: 50, sprite: '🦅' },
ghost_eagle_2: { id: 'ghost_eagle_2', name: '幽灵鹰王', hp: 60, maxHp: 60, sprite: '🦅' },
ghost_eagle_3: { id: 'ghost_eagle_3', name: '幽灵鹰皇', hp: 70, maxHp: 70, sprite: '🦅' },
```

**Ghost Turtle (化学)**
```typescript
ghost_turtle_1: { id: 'ghost_turtle_1', name: '幽灵海龟', hp: 50, maxHp: 50, sprite: '🐢' },
ghost_turtle_2: { id: 'ghost_turtle_2', name: '幽灵海龟王', hp: 60, maxHp: 60, sprite: '🐢' },
ghost_turtle_3: { id: 'ghost_turtle_3', name: '幽灵海龟皇', hp: 70, maxHp: 70, sprite: '🐢' },
```

**Ghost Snake (历史)**
```typescript
ghost_snake_1: { id: 'ghost_snake_1', name: '幽灵蛇', hp: 50, maxHp: 50, sprite: '🐍' },
ghost_snake_2: { id: 'ghost_snake_2', name: '幽灵蛇王', hp: 60, maxHp: 60, sprite: '🐍' },
ghost_snake_3: { id: 'ghost_snake_3', name: '幽灵蛇皇', hp: 70, maxHp: 70, sprite: '🐍' },
```

**Shadow Guardian (隐藏区域)**
```typescript
shadow_guardian: { id: 'shadow_guardian', name: '暗影守护者', hp: 100, maxHp: 100, sprite: '👻' },
```

**Kraken Prime (Boss)**
```typescript
kraken_prime: { id: 'kraken_prime', name: '深海巨妖', hp: 220, maxHp: 220, sprite: '🐙' },
```

---

## Task 3: Verify Build and Tests

- [ ] Run `npm run build` - must pass with no errors
- [ ] Run `npm test` - all tests pass
- [ ] Verify mysterious ocean data loads correctly (areasData['mysterious'].length === 25)

---

## Verification

1. `npm run dev` - navigate to Mysterious Ocean and verify:
   - 25 islands appear on the map
   - 7 chains visible (chinese, math, english, science, physics, chemistry, history)
   - Hidden islands show with glow effect
   - Treasure island shows with chest icon
   - Boss island shows at top center
2. `npm test` passes
3. `npm run build` succeeds
