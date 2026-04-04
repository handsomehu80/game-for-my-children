import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { IslandIcon } from '../../src/components/game/IslandIcon'

describe('IslandIcon', () => {
  it('renders with correct type attribute', () => {
    const { container } = render(<IslandIcon type="normal" />)
    const useElement = container.querySelector('use')
    expect(useElement).not.toBeNull()
    expect(useElement?.getAttribute('href')).toBe('#island-icon-normal')
  })

  it('renders with correct size', () => {
    const { container } = render(<IslandIcon type="boss" size={32} />)
    // Use querySelector on container to avoid picking up hidden SVG sprites
    const svg = container.querySelector('svg:not([style*="display"])')
    expect(svg?.getAttribute('width')).toBe('32')
    expect(svg?.getAttribute('height')).toBe('32')
  })

  it('renders all island types', () => {
    const types: Array<'normal' | 'boss' | 'hidden' | 'treasure'> = ['normal', 'boss', 'hidden', 'treasure']
    types.forEach(type => {
      const { container } = render(<IslandIcon type={type} />)
      const use = container.querySelector('use')
      expect(use?.getAttribute('href')).toBe(`#island-icon-${type}`)
    })
  })
})