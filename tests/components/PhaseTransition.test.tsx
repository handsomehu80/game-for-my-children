import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import PhaseTransition from '../../src/components/game/PhaseTransition'
import { getTransitionKind } from '../../src/components/game/Game'

describe('PhaseTransition', () => {
  it('renders children', () => {
    const { getByText } = render(
      <PhaseTransition transitionKey="title" kind="fade-scale">
        <div>hello</div>
      </PhaseTransition>
    )
    expect(getByText('hello')).toBeTruthy()
  })

  it('applies the animation class matching the given kind', () => {
    const { container } = render(
      <PhaseTransition transitionKey="battle" kind="shake-vignette">
        <div>content</div>
      </PhaseTransition>
    )
    expect(container.querySelector('.phase-transition-shake-vignette')).not.toBeNull()
  })

  it('degrades to "none" kind when isReducedMotion is true', () => {
    const { container } = render(
      <PhaseTransition transitionKey="battle" kind="shake-vignette" isReducedMotion={true}>
        <div>content</div>
      </PhaseTransition>
    )
    expect(container.querySelector('.phase-transition-shake-vignette')).toBeNull()
    expect(container.querySelector('.phase-transition-none')).not.toBeNull()
  })

  it('renders each transition kind with its own class', () => {
    const kinds = ['fade-scale', 'shake-vignette', 'victory-burst', 'defeat-fade', 'none'] as const
    kinds.forEach((kind) => {
      const { container } = render(
        <PhaseTransition transitionKey={kind} kind={kind}>
          <div>content</div>
        </PhaseTransition>
      )
      expect(container.querySelector(`.phase-transition-${kind}`)).not.toBeNull()
    })
  })
})

describe('getTransitionKind', () => {
  it('returns fade-scale for title, world_map, exploration', () => {
    expect(getTransitionKind('title', false)).toBe('fade-scale')
    expect(getTransitionKind('world_map', false)).toBe('fade-scale')
    expect(getTransitionKind('exploration', false)).toBe('fade-scale')
  })

  it('returns shake-vignette for battle', () => {
    expect(getTransitionKind('battle', false)).toBe('shake-vignette')
  })

  it('returns victory-burst for result when isVictory is true', () => {
    expect(getTransitionKind('result', true)).toBe('victory-burst')
  })

  it('returns defeat-fade for result when isVictory is false', () => {
    expect(getTransitionKind('result', false)).toBe('defeat-fade')
  })

  it('falls back to fade-scale for unknown phases', () => {
    expect(getTransitionKind('game_over', false)).toBe('fade-scale')
  })
})
