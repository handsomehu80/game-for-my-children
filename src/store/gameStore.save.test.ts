import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'
import type { SaveSlot } from '../game/types'

// ==================== localStorage Mock ====================

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
    get length() { return Object.keys(store).length },
    key: (index: number) => Object.keys(store)[index] ?? null,
  }
})()

// Replace globalThis localStorage with mock
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
})

// ==================== Tests ====================

describe('Save System', () => {
  beforeEach(() => {
    // Clear localStorage mock before each test
    localStorageMock.clear()
    // Reset store to initial state - note: currentSaveSlot must be >= 0 for autoSave to work
    useGameStore.setState({
      gamePhase: 'title',
      currentOcean: null,
      players: [],
      unlockedOceans: ['east'],
      completedOceans: [],
      battle: null,
      totalScore: 0,
      exploration: null,
      explorationBattle: null,
      selectedGrade: 1,
      selectedSubject: 'math',
      currentSaveSlot: 0,
    })
  })

  describe('saveGame', () => {
    it('should store correct data in localStorage', () => {
      const { saveGame, dispatch, startExploration } = useGameStore.getState()

      // Set up game state with exploration
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      // Set some exploration state
      const { explorationDispatch } = useGameStore.getState()
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_math_1' })
      explorationDispatch({ type: 'SAILING_COMPLETE' })
      explorationDispatch({ type: 'ARRIVED' })
      explorationDispatch({ type: 'MOVE_COMPLETE' })
      explorationDispatch({ type: 'ENCOUNTER_RESULT', result: 'battle' })

      // Save game
      saveGame(0)

      // Verify data was stored
      const storedData = localStorageMock.getItem('ocean_game_save_0')
      expect(storedData).not.toBeNull()

      const parsed = JSON.parse(storedData!) as SaveSlot
      expect(parsed.slotIndex).toBe(0)
      expect(parsed.gameState.currentOcean).toBe('east')
      expect(parsed.gameState.players).toHaveLength(1)
      expect(parsed.gameState.players[0].name).toBe('TestPlayer')
      expect(parsed.explorationState.currentOcean).toBe('east')
      expect(parsed.explorationState.currentArea).toBe('east_math_1')
      expect(parsed.version).toBe(1)
      expect(parsed.savedAt).toBeDefined()
    })

    it('should not save if exploration is null', () => {
      const { saveGame } = useGameStore.getState()

      // Try to save without exploration (should be no-op)
      saveGame(0)

      const storedData = localStorageMock.getItem('ocean_game_save_0')
      expect(storedData).toBeNull()
    })

    it('should update currentSaveSlot after saving', () => {
      const { saveGame, dispatch, startExploration } = useGameStore.getState()

      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      saveGame(2)

      const state = useGameStore.getState()
      expect(state.currentSaveSlot).toBe(2)
    })
  })

  describe('loadGame', () => {
    it('should restore state correctly from localStorage', () => {
      const { saveGame, loadGame, dispatch, startExploration } = useGameStore.getState()

      // Set up and save game - pass grade explicitly to START_GAME
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
        grade: 2,
      })
      startExploration('east')

      const { explorationDispatch } = useGameStore.getState()
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_math_1' })
      explorationDispatch({ type: 'SAILING_COMPLETE' })
      explorationDispatch({ type: 'ARRIVED' })
      explorationDispatch({ type: 'MOVE_COMPLETE' })
      explorationDispatch({ type: 'ENCOUNTER_RESULT', result: 'battle' })
      explorationDispatch({ type: 'BATTLE_WIN', areaId: 'east_math_1' })

      saveGame(0)

      // Reset store
      useGameStore.setState({
        gamePhase: 'title',
        currentOcean: null,
        players: [],
        unlockedOceans: ['east'],
        completedOceans: [],
        battle: null,
        totalScore: 0,
        exploration: null,
        explorationBattle: null,
        selectedGrade: 1,
        selectedSubject: 'math',
        currentSaveSlot: -1,
      })

      // Load game
      const result = loadGame(0)

      expect(result).toBe(true)
      const state = useGameStore.getState()
      expect(state.gamePhase).toBe('exploration')
      expect(state.currentOcean).toBe('east')
      expect(state.players).toHaveLength(1)
      expect(state.players[0].name).toBe('TestPlayer')
      expect(state.selectedGrade).toBe(2)
      expect(state.exploration).not.toBeNull()
      expect(state.exploration?.currentArea).toBe('east_math_1')
      expect(state.currentSaveSlot).toBe(0)
    })

    it('should return false for missing save slot', () => {
      const { loadGame } = useGameStore.getState()

      const result = loadGame(99)

      expect(result).toBe(false)
    })

    it('should return false for corrupted data', () => {
      // Store invalid JSON
      localStorageMock.setItem('ocean_game_save_0', 'not valid json{{{')

      const { loadGame } = useGameStore.getState()
      const result = loadGame(0)

      expect(result).toBe(false)
    })

    it('should return false for invalid save structure', () => {
      // Store valid JSON but wrong structure
      localStorageMock.setItem('ocean_game_save_0', JSON.stringify({
        version: 2, // wrong version
        gameState: {},
        explorationState: {},
        globalProgress: {},
      }))

      const { loadGame } = useGameStore.getState()
      const result = loadGame(0)

      expect(result).toBe(false)
    })

    it('should reset battle and explorationBattle after load', () => {
      const { saveGame, loadGame, dispatch, startExploration } = useGameStore.getState()

      // Set up and save game
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      const { explorationDispatch } = useGameStore.getState()
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_math_1' })
      explorationDispatch({ type: 'SAILING_COMPLETE' })
      explorationDispatch({ type: 'ARRIVED' })
      explorationDispatch({ type: 'MOVE_COMPLETE' })
      explorationDispatch({ type: 'ENCOUNTER_RESULT', result: 'battle' })
      explorationDispatch({ type: 'BATTLE_WIN', areaId: 'east_math_1' })

      saveGame(0)

      // Reset store with battle state
      useGameStore.setState({
        gamePhase: 'battle',
        currentOcean: 'east',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 80, maxHp: 100, comboCount: 0, grade: 1 }],
        unlockedOceans: ['east'],
        completedOceans: [],
        battle: { phase: 'answering' } as any,
        totalScore: 100,
        exploration: null,
        explorationBattle: { areaId: 'east_math_1' } as any,
        selectedGrade: 1,
        selectedSubject: 'math',
        currentSaveSlot: -1,
      })

      // Load should clear battle
      loadGame(0)

      const state = useGameStore.getState()
      expect(state.battle).toBeNull()
      expect(state.explorationBattle).toBeNull()
    })

    it('should set gamePhase to world_map when currentArea is null', () => {
      const { saveGame, loadGame, dispatch, startExploration } = useGameStore.getState()

      // Set up and save game with no currentArea (after completing an ocean)
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      const { explorationDispatch } = useGameStore.getState()
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_math_1' })
      explorationDispatch({ type: 'SAILING_COMPLETE' })
      explorationDispatch({ type: 'ARRIVED' })
      explorationDispatch({ type: 'MOVE_COMPLETE' })
      explorationDispatch({ type: 'ENCOUNTER_RESULT', result: 'battle' })
      explorationDispatch({ type: 'BATTLE_WIN', areaId: 'east_math_1' })

      saveGame(0)

      // Manually modify save to have currentArea as null to test world_map loading
      const storedData = localStorageMock.getItem('ocean_game_save_0')!
      const parsed = JSON.parse(storedData)
      parsed.explorationState.currentArea = null
      localStorageMock.setItem('ocean_game_save_0', JSON.stringify(parsed))

      // Reset store
      useGameStore.setState({
        gamePhase: 'title',
        currentOcean: null,
        players: [],
        unlockedOceans: ['east'],
        completedOceans: [],
        battle: null,
        totalScore: 0,
        exploration: null,
        explorationBattle: null,
        selectedGrade: 1,
        selectedSubject: 'math',
        currentSaveSlot: -1,
      })

      loadGame(0)

      const state = useGameStore.getState()
      expect(state.gamePhase).toBe('world_map')
    })

    it('should reset player HP to maxHp after load', () => {
      const { saveGame, loadGame, dispatch, startExploration } = useGameStore.getState()

      // Set up and save game
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 50, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      const { explorationDispatch } = useGameStore.getState()
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_math_1' })
      explorationDispatch({ type: 'SAILING_COMPLETE' })
      explorationDispatch({ type: 'ARRIVED' })
      explorationDispatch({ type: 'MOVE_COMPLETE' })
      explorationDispatch({ type: 'ENCOUNTER_RESULT', result: 'battle' })
      explorationDispatch({ type: 'BATTLE_WIN', areaId: 'east_math_1' })

      saveGame(0)

      // Reset store
      useGameStore.setState({
        gamePhase: 'title',
        currentOcean: null,
        players: [],
        unlockedOceans: ['east'],
        completedOceans: [],
        battle: null,
        totalScore: 0,
        exploration: null,
        explorationBattle: null,
        selectedGrade: 1,
        selectedSubject: 'math',
        currentSaveSlot: -1,
      })

      loadGame(0)

      const state = useGameStore.getState()
      // HP should be restored to maxHp
      expect(state.players[0].hp).toBe(100)
      expect(state.players[0].maxHp).toBe(100)
    })
  })

  describe('deleteSave', () => {
    it('should remove slot from localStorage', () => {
      const { saveGame, deleteSave, dispatch, startExploration } = useGameStore.getState()

      // Set up and save game
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')
      saveGame(0)

      // Verify it was saved
      expect(localStorageMock.getItem('ocean_game_save_0')).not.toBeNull()

      // Delete save
      deleteSave(0)

      // Verify it was deleted
      expect(localStorageMock.getItem('ocean_game_save_0')).toBeNull()
    })

    it('should not affect other slots when deleting one', () => {
      const { saveGame, deleteSave, dispatch, startExploration } = useGameStore.getState()

      // Set up and save to multiple slots
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')
      saveGame(0)

      // Save to slot 1
      dispatch({ type: 'RESET_GAME' })
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer2', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('west')
      saveGame(1)

      // Verify both exist
      expect(localStorageMock.getItem('ocean_game_save_0')).not.toBeNull()
      expect(localStorageMock.getItem('ocean_game_save_1')).not.toBeNull()

      // Delete slot 0 only
      deleteSave(0)

      // Slot 0 should be gone, slot 1 should remain
      expect(localStorageMock.getItem('ocean_game_save_0')).toBeNull()
      expect(localStorageMock.getItem('ocean_game_save_1')).not.toBeNull()
    })
  })

  describe('getSaveSlotInfo', () => {
    it('should return correct slot occupancy for empty slots', () => {
      const { getSaveSlotInfo } = useGameStore.getState()

      const info = getSaveSlotInfo()

      expect(info).toHaveLength(3)
      expect(info[0].slotIndex).toBe(0)
      expect(info[0].occupied).toBe(false)
      expect(info[1].slotIndex).toBe(1)
      expect(info[1].occupied).toBe(false)
      expect(info[2].slotIndex).toBe(2)
      expect(info[2].occupied).toBe(false)
    })

    it('should return correct slot occupancy for occupied slots', () => {
      const { saveGame, getSaveSlotInfo, dispatch, startExploration } = useGameStore.getState()

      // Save to slot 1
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')
      saveGame(1)

      const info = getSaveSlotInfo()

      expect(info[0].occupied).toBe(false)
      expect(info[1].occupied).toBe(true)
      expect(info[1].currentOcean).toBe('east')
      expect(info[2].occupied).toBe(false)
    })

    it('should return occupied: false for corrupted slots', () => {
      // Store invalid JSON in slot 0
      localStorageMock.setItem('ocean_game_save_0', 'invalid json')

      const { getSaveSlotInfo } = useGameStore.getState()

      const info = getSaveSlotInfo()

      expect(info[0].occupied).toBe(false)
    })
  })

  describe('hasSavedGames', () => {
    it('should return false when no saves exist', () => {
      const { hasSavedGames } = useGameStore.getState()

      expect(hasSavedGames()).toBe(false)
    })

    it('should return true when at least one save exists', () => {
      const { saveGame, hasSavedGames, dispatch, startExploration } = useGameStore.getState()

      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')
      saveGame(0)

      expect(hasSavedGames()).toBe(true)
    })
  })

  describe('auto-save triggers', () => {
    it('should trigger save when autoSave is called with valid slot', () => {
      const { autoSave, dispatch, startExploration } = useGameStore.getState()

      // Start game and exploration
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      // Clear any previous save
      localStorageMock.removeItem('ocean_game_save_0')

      // Manually trigger autoSave
      autoSave()

      // Verify save occurred
      const storedData = localStorageMock.getItem('ocean_game_save_0')
      expect(storedData).not.toBeNull()
    })

    it('should not trigger save when currentSaveSlot is -1', () => {
      const { autoSave, dispatch, startExploration } = useGameStore.getState()

      // Start game and exploration
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      // Set currentSaveSlot to -1 (invalid)
      useGameStore.setState({ currentSaveSlot: -1 })

      // Clear any previous save
      localStorageMock.removeItem('ocean_game_save_0')

      // Manually trigger autoSave
      autoSave()

      // Verify no save occurred
      const storedData = localStorageMock.getItem('ocean_game_save_0')
      expect(storedData).toBeNull()
    })

    it('auto-save uses correct slot index', () => {
      const { autoSave, saveGame, dispatch, startExploration } = useGameStore.getState()

      // Start game and exploration
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      // Save to slot 2 first to set currentSaveSlot
      saveGame(2)

      // Clear all saves
      localStorageMock.removeItem('ocean_game_save_0')
      localStorageMock.removeItem('ocean_game_save_1')
      localStorageMock.removeItem('ocean_game_save_2')

      // Trigger autoSave - should use slot 2
      autoSave()

      // Verify save occurred in slot 2
      expect(localStorageMock.getItem('ocean_game_save_2')).not.toBeNull()
      expect(localStorageMock.getItem('ocean_game_save_0')).toBeNull()
      expect(localStorageMock.getItem('ocean_game_save_1')).toBeNull()
    })

    it('saveGame does not save when exploration is null', () => {
      const { saveGame } = useGameStore.getState()

      // Try to save without exploration
      localStorageMock.removeItem('ocean_game_save_0')
      saveGame(0)

      const storedData = localStorageMock.getItem('ocean_game_save_0')
      expect(storedData).toBeNull()
    })
  })

  describe('loadGame gamePhase determination', () => {
    it('should set gamePhase to exploration when currentArea is non-null', () => {
      const { loadGame, dispatch, startExploration } = useGameStore.getState()

      // Set up minimal game state
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      // Manually set up exploration state with currentArea non-null
      useGameStore.setState({
        exploration: {
          ...useGameStore.getState().exploration!,
          currentArea: 'east_math_1',
          visitedAreas: ['east_math_1'],
        },
        currentSaveSlot: 0,
      })

      // Save game
      const { saveGame } = useGameStore.getState()
      saveGame(0)

      // Reset store completely
      useGameStore.setState({
        gamePhase: 'title',
        currentOcean: null,
        players: [],
        unlockedOceans: ['east'],
        completedOceans: [],
        battle: null,
        totalScore: 0,
        exploration: null,
        explorationBattle: null,
        selectedGrade: 1,
        selectedSubject: 'math',
        currentSaveSlot: -1,
      })

      // Load and verify gamePhase is exploration (not world_map)
      loadGame(0)

      const state = useGameStore.getState()
      expect(state.gamePhase).toBe('exploration')
      expect(state.exploration?.currentArea).toBe('east_math_1')
    })
  })

  describe('UNLOCK_AREA auto-save', () => {
    it('should trigger auto-save when unlockArea is called with sufficient keys', () => {
      const { dispatch, startExploration, unlockArea } = useGameStore.getState()

      // Set up game and exploration
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      // Set collectedKeys to 1 and phase to portal_appear (UNLOCK_AREA only processes in portal_appear phase)
      useGameStore.setState({
        exploration: {
          ...useGameStore.getState().exploration!,
          collectedKeys: 1,
          phase: 'portal_appear' as const,
        },
        currentSaveSlot: 0,
      })

      // Clear any previous save
      localStorageMock.removeItem('ocean_game_save_0')

      // Call unlockArea on a hidden area that requires 1 key
      unlockArea('east_hidden_A')

      // Verify auto-save occurred
      const storedData = localStorageMock.getItem('ocean_game_save_0')
      expect(storedData).not.toBeNull()

      // Verify the save contains the unlocked area
      const parsed = JSON.parse(storedData!)
      expect(parsed.explorationState.unlockedAreas).toContain('east_hidden_A')
      expect(parsed.explorationState.collectedKeys).toBe(0) // Key was consumed
    })

    it('should not trigger auto-save when unlockArea is called without sufficient keys', () => {
      const { dispatch, startExploration, unlockArea } = useGameStore.getState()

      // Set up game and exploration
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      // Set collectedKeys to 0 (not enough) - phase doesn't matter since it returns early
      useGameStore.setState({
        exploration: {
          ...useGameStore.getState().exploration!,
          collectedKeys: 0,
        },
        currentSaveSlot: 0,
      })

      // Clear any previous save
      localStorageMock.removeItem('ocean_game_save_0')

      // Call unlockArea - should not save since no keys
      unlockArea('east_hidden_A')

      // Verify no auto-save occurred
      const storedData = localStorageMock.getItem('ocean_game_save_0')
      expect(storedData).toBeNull()
    })
  })

  describe('key collection auto-save via generatePortals', () => {
    it('should trigger auto-save when generatePortals causes key drop', () => {
      const { dispatch, startExploration, explorationDispatch, generatePortals } = useGameStore.getState()

      // Set up game and exploration
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      // Navigate to an area to build up visitedAreas (needed for generatePortals to not return early)
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_math_1' })
      explorationDispatch({ type: 'SAILING_COMPLETE' })
      explorationDispatch({ type: 'ARRIVED' })
      explorationDispatch({ type: 'MOVE_COMPLETE' })
      explorationDispatch({ type: 'ENCOUNTER_RESULT', result: 'battle' })

      // Set up state for generatePortals to trigger key drop:
      // - currentArea must be non-null (set to boss for guaranteed key drop)
      // - phase must be 'victory' for RECEIVE_KEY to be processed
      // - visitedAreas.length > 1 to bypass isFirstEntry early return
      // - consecutiveVictoriesWithoutKey = 5 to trigger guaranteed key drop
      useGameStore.setState({
        exploration: {
          ...useGameStore.getState().exploration!,
          currentArea: 'east_boss',
          phase: 'victory' as const,
          visitedAreas: ['east_math_1', 'east_math_2'], // length > 1 to bypass isFirstEntry
          consecutiveVictoriesWithoutKey: 5, // Trigger guaranteed key drop
        },
        currentSaveSlot: 0,
      })

      // Clear any previous save
      localStorageMock.removeItem('ocean_game_save_0')

      // Call generatePortals - should trigger auto-save due to key drop
      generatePortals()

      // Verify auto-save occurred
      const storedData = localStorageMock.getItem('ocean_game_save_0')
      expect(storedData).not.toBeNull()

      // Verify the save shows key was collected
      const parsed = JSON.parse(storedData!)
      expect(parsed.explorationState.collectedKeys).toBeGreaterThan(0)
    })
  })

  describe('load resets transient state', () => {
    it('should reset availablePortals and portalSeed after load', () => {
      const { saveGame, loadGame, dispatch, startExploration, explorationDispatch } = useGameStore.getState()

      // Set up and save game
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      // Navigate and win to get portals
      explorationDispatch({ type: 'SELECT_AREA', areaId: 'east_math_1' })
      explorationDispatch({ type: 'SAILING_COMPLETE' })
      explorationDispatch({ type: 'ARRIVED' })
      explorationDispatch({ type: 'MOVE_COMPLETE' })
      explorationDispatch({ type: 'ENCOUNTER_RESULT', result: 'battle' })
      explorationDispatch({ type: 'BATTLE_WIN', areaId: 'east_math_1' })

      // Generate portals to set availablePortals
      const { generatePortals } = useGameStore.getState()
      generatePortals()

      saveGame(0)

      // Load the save
      loadGame(0)

      const state = useGameStore.getState()
      expect(state.exploration?.availablePortals).toEqual([])
      expect(state.exploration?.portalSeed).toBeNull()
    })

    it('should reset failedAttempts after load', () => {
      const { saveGame, loadGame, dispatch, startExploration } = useGameStore.getState()

      // Set up and save game
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      // Manually set some failed attempts
      useGameStore.setState({
        exploration: {
          ...useGameStore.getState().exploration!,
          failedAttempts: { 'east_math_1': 3, 'east_math_2': 5 },
        },
      })

      saveGame(0)

      // Modify failedAttempts after save
      useGameStore.setState({
        exploration: {
          ...useGameStore.getState().exploration!,
          failedAttempts: { 'east_math_1': 10, 'east_math_2': 20 },
        },
      })

      // Load should reset failedAttempts
      loadGame(0)

      const state = useGameStore.getState()
      expect(state.exploration?.failedAttempts).toEqual({})
    })

    it('should reset lastError and lastSavepoint after load', () => {
      const { saveGame, loadGame, dispatch, startExploration } = useGameStore.getState()

      // Set up and save game
      dispatch({
        type: 'START_GAME',
        players: [{ id: 'p1', name: 'TestPlayer', hp: 100, maxHp: 100, comboCount: 0, grade: 1 }],
      })
      startExploration('east')

      saveGame(0)

      // Load should reset error state
      loadGame(0)

      const state = useGameStore.getState()
      expect(state.exploration?.lastError).toBeNull()
      expect(state.exploration?.lastSavepoint).toBeNull()
    })
  })
})