# Save System Design

## Overview

Implement autosave functionality using localStorage with 3 save slots. Auto-save triggers after battle victory, area unlock, and key collection. Title screen shows "Continue" and "New Game" options when saves exist.

---

## 1. Data Model

### SaveSlot Interface

```typescript
interface SaveSlot {
  slotIndex: number           // 0, 1, 2
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
```

### Not Saved (Always Fresh)

- Battle state: `battle`, `teamHP`, `monsterHP`, `comboCount`, `usedQuestionIds`
- Portal state: `availablePortals`, `portalSeed`
- Failed attempts: `failedAttempts`, `battleFailedAttempts`
- Savepoint history: `savepoints`, `lastSavepoint`
- Phase resets to `'exploring'` on load
- `explorationBattle` context - always null on load (battle retries are derived from `currentArea` if player was mid-battle)

---

## 2. Auto-Save Triggers

Save writes to currently selected slot (default: slot 0) after:

| Event | Trigger Action |
|-------|---------------|
| Battle victory | `END_EXPLORATION_BATTLE` with `victory=true` |
| Area unlock | `UNLOCK_AREA` action |
| Key collection | Inside `generatePortals()` when key drops |
| Ocean completion | `COMPLETE_OCEAN` action |

---

## 3. Title Screen UI

### Save Detection

On title screen mount, check all 3 slots for existing save data.

### UI Layout

```
┌─────────────────────────────────┐
│                                 │
│        🏠 标 题 画 面           │
│                                 │
│   [继续游戏 (存档1)]            │
│   [继续游戏 (存档2)]            │
│   [继续游戏 (存档3)]            │
│   [开始新游戏]                  │
│                                 │
└─────────────────────────────────┘
```

### New Game Flow

1. User taps "开始新游戏"
2. If saves exist, show slot selection modal: "覆盖哪个存档?"
3. If no saves, auto-write to slot 0

---

## 4. Load Flow

1. Read `SaveSlot` from localStorage key `ocean_game_save_{slotIndex}`
2. Validate version and data integrity
3. Restore fields to `GameState` and `ExplorationState`
4. Reset transient fields to defaults
5. Set `gamePhase`:
   - If `currentArea` is null: `'world_map'`
   - If `currentArea` is set: `'exploration'`
   - If player was mid-battle (derived: `currentArea` set + player selected it for battle): battle restarts fresh with full team HP

**Battle Retry Derivation:** When loading, if `currentArea` is set and the area has a monster, the player can re-engage that monster. Battle state always starts fresh (full team HP) as per Section 2.

---

## 5. Store Interface Additions

```typescript
interface GameStore extends GameState {
  // ... existing methods
  saveGame: (slotIndex: number) => void
  loadGame: (slotIndex: number) => boolean
  deleteSave: (slotIndex: number) => void
  getSaveSlotInfo: () => SaveSlotInfo[]
  hasSavedGames: () => boolean
  currentSaveSlot: number
}

interface SaveSlotInfo {
  slotIndex: number
  occupied: boolean
  savedAt?: number
  currentOcean?: string
  defeatedCount?: number
}
```

---

## 6. File Changes

| File | Changes |
|------|---------|
| `src/game/types.ts` | Add `SaveSlot`, `SaveSlotInfo` interfaces; `SAVE_GAME`, `LOAD_GAME`, `DELETE_SAVE`, `SELECT_SAVE_SLOT` action types |
| `src/store/gameStore.ts` | Add `saveGame()`, `loadGame()`, `deleteSave()`, `getSaveSlotInfo()`, `hasSavedGames()` methods; add auto-save calls in `END_EXPLORATION_BATTLE`, `UNLOCK_AREA`, `generatePortals()`, `COMPLETE_OCEAN` |
| `src/utils/storage.ts` | Already has `safeSetItem`/`safeGetItem`. Add `listSaveSlots()` helper if needed |
| `src/components/game/TitleScreen.tsx` | Add save slot detection, "Continue"/"New Game" buttons, slot selection modal |
| `src/components/game/SaveSlotModal.tsx` | (Create) Modal for selecting save slot on "New Game" |

---

## 7. localStorage Keys

| Key | Content |
|-----|---------|
| `ocean_game_save_0` | SaveSlot JSON |
| `ocean_game_save_1` | SaveSlot JSON |
| `ocean_game_save_2` | SaveSlot JSON |
| `ocean_game_current_slot` | number (selected slot index) |

---

## 8. Error Handling

- Corrupted save data: Show "存档损坏" message, offer to start new game
- Storage full: Use existing `storage.ts` capacity check, warn user if nearly full
- Version mismatch: Add `version` field, migrate or reset old saves

---

## 9. Testing Considerations

- Test save after battle victory
- Test save after area unlock
- Test load restores correct state
- Test "New Game" overwrites existing save
- Test corrupted save handling
- Test 3 slots independently
