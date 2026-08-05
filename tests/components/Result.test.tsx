import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import Result from '../../src/components/game/Result'
import { useGameStore } from '../../src/store/gameStore'

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

const baseBattle = {
  phase: 'victory' as const,
  player: { id: 'p1', name: '玩家', hp: 50, maxHp: 50, comboCount: 0 },
  monster: { id: 'jellyfish_king', name: '水母国王', hp: 0, maxHp: 100, sprite: '🪼' },
}

const mockDispatch = vi.fn()

function setupStore(battle: typeof baseBattle | null) {
  ;(useGameStore as any).mockImplementation((selector?: any) => {
    if (!selector) return { battle }
    const selectorStr = selector.toString()
    if (selectorStr.includes('dispatch')) return mockDispatch
    return { battle }
  })
  ;(useGameStore as any).getState = () => ({ dispatch: mockDispatch })
}

describe('Result', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    cleanup()
    mockMatchMedia(false)
  })

  afterEach(() => {
    cleanup()
  })

  it('renders nothing when battle is null', () => {
    setupStore(null)
    const { container } = render(<Result />)
    expect(container.firstChild).toBeNull()
  })

  it('renders victory particle layer when isVictory and not reduced motion', () => {
    setupStore(baseBattle)
    const { container, getByText } = render(<Result />)
    expect(getByText('🎉 胜利！🎉')).toBeTruthy()
    const particles = container.querySelectorAll('.result-particle')
    expect(particles.length).toBe(20)
  })

  it('does not render particle layer when isReducedMotion is true', () => {
    mockMatchMedia(true)
    setupStore(baseBattle)
    const { container } = render(<Result />)
    expect(container.querySelectorAll('.result-particle').length).toBe(0)
  })

  it('applies defeat grayscale animation class when not reduced motion', () => {
    setupStore({ ...baseBattle, phase: 'defeat' as any })
    const { container, getByText } = render(<Result />)
    expect(getByText('💀 失败 💀')).toBeTruthy()
    expect(container.querySelector('.result-defeat-animated')).not.toBeNull()
    expect(getByText('没关系，再试一次一定可以战胜他！')).toBeTruthy()
  })

  it('applies static grayscale filter with no animation class when isReducedMotion is true', () => {
    mockMatchMedia(true)
    setupStore({ ...baseBattle, phase: 'defeat' as any })
    const { container } = render(<Result />)
    expect(container.querySelector('.result-defeat-animated')).toBeNull()
    const screen = container.querySelector('.result-defeat') as HTMLElement
    expect(screen.style.filter).toBe('grayscale(0.7)')
  })

  it('generates deterministic particles for the same monster id', () => {
    setupStore(baseBattle)
    const { container: c1 } = render(<Result />)
    const positions1 = Array.from(c1.querySelectorAll('.result-particle')).map(
      (el) => (el as HTMLElement).style.left
    )
    cleanup()
    const { container: c2 } = render(<Result />)
    const positions2 = Array.from(c2.querySelectorAll('.result-particle')).map(
      (el) => (el as HTMLElement).style.left
    )
    expect(positions1).toEqual(positions2)
  })
})
