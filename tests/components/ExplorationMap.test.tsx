import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react'
import ExplorationMap from '../../src/components/game/ExplorationMap'
import { useGameStore } from '../../src/store/gameStore'
import type { ExplorationState } from '../../src/game/types'

vi.mock('../../src/store/gameStore', () => ({
  useGameStore: vi.fn(),
}))

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

const basePlayers = [{ id: 'p1', name: '玩家', hp: 50, maxHp: 50, comboCount: 0, grade: 3 }]

const mockExplorationDispatch = vi.fn()
const mockSelectArea = vi.fn()
const mockGeneratePortals = vi.fn()
const mockDispatch = vi.fn()

function baseExploration(overrides: Partial<ExplorationState>): ExplorationState {
  return {
    phase: 'exploring',
    currentOcean: 'east',
    currentArea: 'east_math_1',
    visitedAreas: [],
    defeatedMiniBosses: [],
    unlockedAreas: [],
    reachableAreas: [],
    collectedKeys: 0,
    collectedItems: [],
    availablePortals: [],
    portalSeed: null,
    failedAttempts: {},
    lastError: null,
    savepoints: [],
    lastSavepoint: null,
    battleFailedAttempts: 0,
    consecutiveVictoriesWithoutKey: 0,
    ...overrides,
  }
}

function setupStore(exploration: ExplorationState) {
  const state = {
    exploration,
    players: basePlayers,
    selectArea: mockSelectArea,
    generatePortals: mockGeneratePortals,
    explorationDispatch: mockExplorationDispatch,
    dispatch: mockDispatch,
  }
  ;(useGameStore as any).mockImplementation((selector: any) => selector(state))
  ;(useGameStore as any).getState = () => state
}

describe('ExplorationMap - portal transition animation (PORTAL-01)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
    mockMatchMedia(false)
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('does not dispatch SELECT_PORTAL immediately on portal click; shows transition animation first', () => {
    vi.useFakeTimers()
    setupStore(
      baseExploration({
        phase: 'portal_appear',
        availablePortals: [{ id: 'portal_1', targetAreaId: 'east_treasure_1', type: 'treasure' }],
      })
    )

    render(<ExplorationMap />)

    const label = screen.getByText('宝藏区域')
    fireEvent.click(label.parentElement as HTMLElement)

    expect(mockExplorationDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: 'SELECT_PORTAL' })
    )
    expect(document.querySelector('.ocean-sailing-scene')).not.toBeNull()
  })

  it('dispatches SELECT_PORTAL only after the transition animation completes', () => {
    vi.useFakeTimers()
    const portal = { id: 'portal_1', targetAreaId: 'east_treasure_1', type: 'treasure' as const }
    setupStore(
      baseExploration({
        phase: 'portal_appear',
        availablePortals: [portal],
      })
    )

    render(<ExplorationMap />)

    fireEvent.click(screen.getByText('宝藏区域').parentElement as HTMLElement)

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(mockExplorationDispatch).toHaveBeenCalledWith({ type: 'SELECT_PORTAL', portal })
  })

  it('uses the vortex style for non-ocean-portal types (treasure/hidden/normal)', () => {
    vi.useFakeTimers()
    setupStore(
      baseExploration({
        phase: 'portal_appear',
        availablePortals: [{ id: 'portal_1', targetAreaId: 'east_treasure_1', type: 'treasure' }],
      })
    )

    render(<ExplorationMap />)
    fireEvent.click(screen.getByText('宝藏区域').parentElement as HTMLElement)

    expect(document.querySelector('.ocean-sailing-scene.vortex-scene')).not.toBeNull()
  })

  it('uses the cinematic style previewing the destination ocean for ocean_portal type', () => {
    vi.useFakeTimers()
    setupStore(
      baseExploration({
        phase: 'portal_appear',
        availablePortals: [{ id: 'portal_1', targetAreaId: 'west', type: 'ocean_portal' }],
      })
    )

    render(<ExplorationMap />)
    fireEvent.click(screen.getByText('跨洋传送').parentElement as HTMLElement)

    expect(document.querySelector('.ocean-sailing-scene.cinematic-scene')).not.toBeNull()
  })
})

describe('ExplorationMap - encounter phase freeze fix (PORTAL-02)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
    mockMatchMedia(false)
  })

  afterEach(() => {
    cleanup()
  })

  it('dispatches a safe fallback ENCOUNTER_RESULT instead of freezing when the area cannot be resolved', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    setupStore(
      baseExploration({
        phase: 'encounter',
        currentOcean: 'east',
        currentArea: 'nonexistent_area_xyz',
      })
    )

    render(<ExplorationMap />)

    expect(mockExplorationDispatch).toHaveBeenCalledWith({ type: 'ENCOUNTER_RESULT', result: 'battle' })
    expect(errorSpy).toHaveBeenCalled()

    errorSpy.mockRestore()
  })
})

describe('ExplorationMap - handleAreaConfirm ordering fix (PORTAL-02)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
    mockMatchMedia(false)
  })

  afterEach(() => {
    cleanup()
  })

  it('does not play the sailing animation when selectArea fails to enter the sailing phase', () => {
    // Simulate selectArea() rejecting the transition (e.g. insufficient keys / boss
    // prerequisites not met): getState().exploration.phase stays 'error', not 'sailing'.
    const exploration = baseExploration({ phase: 'exploring', reachableAreas: ['east_math_1'] })
    const state = {
      exploration,
      players: basePlayers,
      selectArea: mockSelectArea,
      generatePortals: mockGeneratePortals,
      explorationDispatch: mockExplorationDispatch,
      dispatch: mockDispatch,
    }
    mockSelectArea.mockImplementation(() => {
      state.exploration = { ...state.exploration, phase: 'error', lastError: 'Not enough keys' }
    })
    ;(useGameStore as any).mockImplementation((selector: any) => selector(state))
    ;(useGameStore as any).getState = () => state

    render(<ExplorationMap />)

    fireEvent.click(screen.getByLabelText(/数学迷宫 - 入门/))
    fireEvent.click(screen.getByText('要去！出发'))

    expect(mockSelectArea).toHaveBeenCalledWith('east_math_1')
    expect(document.querySelector('.ocean-sailing-scene')).toBeNull()
  })

  it('plays the sailing animation when selectArea succeeds and enters the sailing phase', () => {
    const exploration = baseExploration({ phase: 'exploring', reachableAreas: ['east_math_1'] })
    const state = {
      exploration,
      players: basePlayers,
      selectArea: mockSelectArea,
      generatePortals: mockGeneratePortals,
      explorationDispatch: mockExplorationDispatch,
      dispatch: mockDispatch,
    }
    mockSelectArea.mockImplementation(() => {
      state.exploration = { ...state.exploration, phase: 'sailing', currentArea: 'east_math_1' }
    })
    ;(useGameStore as any).mockImplementation((selector: any) => selector(state))
    ;(useGameStore as any).getState = () => state

    render(<ExplorationMap />)

    fireEvent.click(screen.getByLabelText(/数学迷宫 - 入门/))
    fireEvent.click(screen.getByText('要去！出发'))

    expect(document.querySelector('.ocean-sailing-scene')).not.toBeNull()
  })
})
