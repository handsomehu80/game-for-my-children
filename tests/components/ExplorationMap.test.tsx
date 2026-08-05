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
