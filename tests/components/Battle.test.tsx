import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import Battle from '../../src/components/game/Battle/Battle'
import { useGameStore } from '../../src/store/gameStore'

// Mock the Zustand store
vi.mock('../../src/store/gameStore', () => ({
  useGameStore: vi.fn()
}))

const mockBattleState = {
  phase: 'answering' as const,
  player: { id: 'p1', name: '玩家', hp: 50, maxHp: 50, comboCount: 0 },
  monster: { id: 'm1', name: '史莱姆', hp: 80, maxHp: 100, sprite: '👹' },
  currentQuestion: {
    id: 'q1',
    content: '2 + 3 = ?',
    type: 'single' as const,
    difficulty: 1 as const,
    category: 'math' as const,
    options: [
      { text: '4', isCorrect: false },
      { text: '5', isCorrect: true },
      { text: '6', isCorrect: false },
    ],
  },
  comboCount: 0,
  isPlayerTurn: true,
  battleLog: [] as Array<{ type: string; message: string; timestamp: number }>,
  activeSkills: [] as Array<{ skillId: string; activatedAt: number; expiresAt: number }>,
}

const mockDispatch = vi.fn()

describe('Battle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()

    ;(useGameStore as any).mockImplementation((selector: any) => {
      const selectorStr = selector.toString()
      if (selectorStr.includes('battle')) return mockBattleState
      if (selectorStr.includes('gamePhase')) return 'battle'
      if (selectorStr.includes('dispatch')) return mockDispatch
      return vi.fn()
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('renders monster name', () => {
    render(<Battle />)
    expect(screen.getByText('史莱姆')).toBeTruthy()
  })

  it('renders VS text', () => {
    render(<Battle />)
    expect(screen.getByText('VS')).toBeTruthy()
  })

  it('renders question content', () => {
    render(<Battle />)
    expect(screen.getByText('2 + 3 = ?')).toBeTruthy()
  })

  it('renders answer options', () => {
    render(<Battle />)
    expect(screen.getByText('4')).toBeTruthy()
    expect(screen.getByText('5')).toBeTruthy()
    expect(screen.getByText('6')).toBeTruthy()
  })

  it('renders battle header', () => {
    render(<Battle />)
    expect(screen.getByText('⚔️ 战斗开始 ⚔️')).toBeTruthy()
  })

  it('shows victory overlay with continue button', () => {
    const victoryState = { ...mockBattleState, phase: 'victory' as const }
    ;(useGameStore as any).mockImplementation((selector: any) => {
      const selectorStr = selector.toString()
      if (selectorStr.includes('battle')) return victoryState
      if (selectorStr.includes('gamePhase')) return 'battle'
      if (selectorStr.includes('dispatch')) return mockDispatch
      return vi.fn()
    })

    render(<Battle />)
    expect(screen.getByText('🎉 太棒了！🎉')).toBeTruthy()
    expect(screen.getByText('继续')).toBeTruthy()
  })

  it('shows defeat overlay with retry button', () => {
    const defeatState = { ...mockBattleState, phase: 'defeat' as const }
    ;(useGameStore as any).mockImplementation((selector: any) => {
      const selectorStr = selector.toString()
      if (selectorStr.includes('battle')) return defeatState
      if (selectorStr.includes('gamePhase')) return 'battle'
      if (selectorStr.includes('dispatch')) return mockDispatch
      return vi.fn()
    })

    render(<Battle />)
    expect(screen.getByText('💀 再试一次！💀')).toBeTruthy()
    expect(screen.getByText('重新挑战')).toBeTruthy()
  })

  it('returns null when battle is null', () => {
    ;(useGameStore as any).mockImplementation((selector: any) => {
      const selectorStr = selector.toString()
      if (selectorStr.includes('battle')) return null
      if (selectorStr.includes('gamePhase')) return 'battle'
      if (selectorStr.includes('dispatch')) return mockDispatch
      return vi.fn()
    })

    const { container } = render(<Battle />)
    expect(container.firstChild).toBeNull()
  })

  it('renders HP bars with correct structure', () => {
    const { container } = render(<Battle />)
    const hpBars = container.querySelectorAll('.hp-fill')
    expect(hpBars.length).toBe(2) // monster and player HP bars
  })
})
