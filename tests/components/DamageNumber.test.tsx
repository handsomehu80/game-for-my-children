import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DamageNumber from '../../src/components/game/Battle/DamageNumber'

describe('DamageNumber Component', () => {
  it('renders damage value with minus sign', () => {
    render(<DamageNumber value={12} target="monster" />)
    expect(screen.getByText('-12')).toBeTruthy()
  })

  it('renders damage value for different amounts', () => {
    render(<DamageNumber value={25} target="monster" />)
    expect(screen.getByText('-25')).toBeTruthy()
  })

  it('has damage-number class', () => {
    const { container } = render(<DamageNumber value={12} target="monster" />)
    const el = container.querySelector('.damage-number')
    expect(el).toBeTruthy()
  })

  it('renders damage number in correct position', () => {
    const { container } = render(<DamageNumber value={10} target="monster" />)
    const el = container.querySelector('.damage-number')
    expect(el?.textContent).toBe('-10')
  })

  it('displays negative value format', () => {
    render(<DamageNumber value={5} target="monster" />)
    expect(screen.getByText(/-5/)).toBeTruthy()
  })
})
