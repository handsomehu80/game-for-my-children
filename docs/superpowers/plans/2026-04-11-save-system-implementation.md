# Save System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement autosave functionality with 3 save slots, auto-save triggers after battle victory/area unlock/key collection/ocean completion, and title screen with Continue/New Game options.

**Architecture:** Save state is extracted from GameState/ExplorationState into a SaveSlot structure stored in localStorage. Auto-save hooks are injected into existing store actions. Title screen detects saves and offers Continue/New Game. Load restores persisted state while resetting transient battle/portal state.

**Tech Stack:** React, Zustand, TypeScript, localStorage (via existing storage.ts utilities)

---

## File Structure

| File | Changes |
|------|---------|
| `src/game/types.ts` | Add `SaveSlot`, `SaveSlotInfo` interfaces; Add `SAVE_GAME`, `LOAD_GAME`, `DELETE_SAVE`, `SELECT_SAVE_SLOT` action types |
| `src/store/gameStore.ts` | Add `saveGame()`, `loadGame()`, `deleteSave()`, `getSaveSlotInfo()`, `hasSavedGames()` methods; add `currentSaveSlot` to store state; inject auto-save in `END_EXPLORATION_BATTLE`, `UNLOCK_AREA`, `generatePortals()`, `COMPLETE_OCEAN` |
| `src/components/game/SaveSlotModal.tsx` | Create new: Modal component for selecting save slot on New Game |
| `src/components/game/TitleScreen.tsx` | Add save slot detection on mount; add Continue/New Game button rendering |

---

## Task 1: Add SaveSlot Types to types.ts

**Files:**
- Modify: `src/game/types.ts`

Add these types to `src/game/types.ts`:

```typescript
// ==================== Save System Types ====================

export interface SaveSlot {
  slotIndex: number
  gameState: {
    currentOcean: string | null
    players: Player[]
    selectedGrade: number
    selectedSubject: 'chinese' | 'math' | 'english' | 'science'
    totalScore: number
  }
  explorationState: {
    currentOcean: string | null
    currentArea: string | null
    visitedAreas: string[]
    defeatedMiniBosses: string[]
    unlockedAreas: string[]
    reachableAreas: string[]
    collectedKeys: number
    collectedItems: Item[]
    consecutiveVictoriesWithoutKey: number
  }
  globalProgress: {
    unlockedOceans: string[]
    completedOceans: string[]
  }
  savedAt: number
  version: number
}

export interface SaveSlotInfo {
  slotIndex: number
  occupied: boolean
  savedAt?: number
  currentOcean?: string
  defeatedCount?: number  // Number of defeatedMiniBosses (mini-boss islands defeated)
}

// Save action types
export type SaveAction =
  | { type: 'SAVE_GAME'; slotIndex: number }
  | { type: 'LOAD_GAME'; slotIndex: number }
  | { type: 'DELETE_SAVE'; slotIndex: number }
  | { type: 'SELECT_SAVE_SLOT'; slotIndex: number }
```

---

## Task 2: Add Save/Load Methods to gameStore

**Files:**
- Modify: `src/store/gameStore.ts`

Add to `GameStore` interface and implement methods:

```typescript
interface GameStore extends GameState {
  // ... existing fields
  currentSaveSlot: number  // Add this field

  // Save methods
  saveGame: (slotIndex: number) => void
  loadGame: (slotIndex: number) => boolean
  deleteSave: (slotIndex: number) => void
  getSaveSlotInfo: () => SaveSlotInfo[]
  hasSavedGames: () => boolean
}
```

Implement `saveGame(slotIndex)`:
1. Build `SaveSlot` object from current `gameState` and `explorationState`
2. Use `safeSetItem('save_' + slotIndex, JSON.stringify(slot))` — `safeSetItem` already prepends `ocean_game_` prefix, so final key is `ocean_game_save_0`
3. Set `currentSaveSlot = slotIndex`

Implement `loadGame(slotIndex)`:
1. Use `safeGetItem('save_' + slotIndex)` to read slot — `safeGetItem` already prepends `ocean_game_` prefix
2. Parse and validate the save data (check version, required fields)
3. If invalid/corrupted, return false
4. Restore: `currentOcean`, `players`, `selectedGrade`, `selectedSubject`, `totalScore`, `unlockedOceans`, `completedOceans`
5. Restore exploration state fields: `visitedAreas`, `defeatedMiniBosses`, `unlockedAreas`, `reachableAreas`, `collectedKeys`, `collectedItems`, `consecutiveVictoriesWithoutKey`
6. **Reset transient fields**:
   - `battle = null`
   - `explorationBattle = null`
   - `availablePortals = []`
   - `portalSeed = null`
   - `failedAttempts = {}`
   - `battleFailedAttempts = 0`
   - `savepoints = []`
   - `lastSavepoint = null`
   - `phase = 'exploring'`
   - **`players` array: each player's `hp` reset to their `maxHp`** (full team HP on continue, as spec requires)
7. Set `gamePhase` based on `currentArea`: if null → `'world_map'`, else → `'exploration'`
8. Set `currentSaveSlot = slotIndex`
9. Return true

Implement `deleteSave(slotIndex)`:
1. Remove from localStorage key `ocean_game_save_` + slotIndex

Implement `getSaveSlotInfo()`:
1. Check all 3 slots, return array of `SaveSlotInfo`

Implement `hasSavedGames()`:
1. Return true if any slot is occupied

---

## Task 3: Add Auto-Save Hooks to gameStore

**Files:**
- Modify: `src/store/gameStore.ts`

Auto-save triggers (call `saveGame(currentSaveSlot)` after each):

| Location | Trigger Condition | Implementation |
|----------|------------------|----------------|
| `END_EXPLORATION_BATTLE` case | `action.victory === true` | At end of victory branch, before returning new state |
| `unlockArea()` method | After successful `explorationDispatch({ type: 'UNLOCK_AREA', areaId })` | Call `get().saveGame(get().currentSaveSlot)` after the dispatch |
| `generatePortals()` method | When `keyDrop > 0` | After `explorationDispatch({ type: 'RECEIVE_KEY', count: keyDrop })` is called and `keyDrop > 0` |
| `COMPLETE_OCEAN` case | Always | At end of case before returning new state |

---

## Task 4: Create SaveSlotModal Component

**Files:**
- Create: `src/components/game/SaveSlotModal.tsx`

A modal dialog that:
1. Accepts `slots: SaveSlotInfo[]`, `onSelect: (slotIndex: number) => void`, `onCancel: () => void`
2. Shows list of slots with their info (occupied shows "存档X - savedAt date", empty shows "存档X - 空")
3. For occupied slots, also show current ocean and defeated count
4. "取消" button calls `onCancel()`
5. Follow existing ConfirmDialog styling patterns

---

## Task 5: Update TitleScreen with Save/Continue UI

**Files:**
- Modify: `src/components/game/TitleScreen.tsx`

On component mount:
1. Call `getSaveSlotInfo()` to get all slot data

Render logic:
- If `hasSavedGames()` is true:
  - Show "继续游戏 (存档X)" button for each occupied slot
  - Show "开始新游戏" button
- If no saves:
  - Show "开始游戏" button

"开始新游戏" flow:
- If any saves exist, show `SaveSlotModal` asking "覆盖哪个存档?"
- If no saves, auto-load slot 0 (which is empty) and start fresh

"继续游戏 (存档X)" flow:
- Call `loadGame(slotIndex)`
- If returns false (corrupted), show error toast and offer to start new

---

## Task 6: Add Storage Key Constants and Version

**Files:**
- Modify: `src/game/types.ts`

Add constants:
```typescript
const SAVE_VERSION = 1
const SAVE_KEY_PREFIX = 'ocean_game_save_'
const CURRENT_SLOT_KEY = 'ocean_game_current_slot'
const MAX_SLOTS = 3
```

---

## Task 7: Write Tests for Save System

**Files:**
- Create: `src/store/gameStore.save.test.ts` (or add to existing `src/store/gameStore.test.ts`)

Test cases:
1. `saveGame` stores correct data in localStorage
2. `loadGame` restores state correctly
3. `loadGame` returns false for corrupted/missing data
4. `deleteSave` removes slot from localStorage
5. `getSaveSlotInfo` returns correct slot occupancy
6. `hasSavedGames` returns correct boolean
7. Auto-save fires after `END_EXPLORATION_BATTLE` victory
8. Auto-save fires after area unlock
9. Auto-save fires after key collection
10. Load resets transient state (battle, portals, etc.)
11. Load sets correct `gamePhase` based on `currentArea`

---

## Task 8: Verify Build and Tests

- Run `npm run build` - must pass with no errors
- Run `npm test` - all tests pass (187+)

---

## Verification

1. `npm run dev` - title screen shows Continue/New Game when saves exist
2. Complete a battle victory - auto-save triggers
3. Refresh page - Continue button appears
4. Click Continue - restores to correct position
5. Click New Game (with existing saves) - shows slot selection modal
6. Select slot - starts fresh game and overwrites that slot
7. `npm test` passes
8. `npm run build` succeeds
