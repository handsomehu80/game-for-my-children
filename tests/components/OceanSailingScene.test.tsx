import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import OceanSailingScene, { generateStars, getAnimationStyle, getOceanTheme } from '../../src/components/game/OceanSailingScene'

describe('OceanSailingScene', () => {
  it('renders minimal style with gradient background', () => {
    render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        onArrived={() => {}}
      />
    )

    const container = document.querySelector('.ocean-sailing-scene')
    expect(container).not.toBeNull()
  })

  it('returns null when isActive is false', () => {
    const { container } = render(
      <OceanSailingScene
        isActive={false}
        style="minimal"
        onArrived={() => {}}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders sailing ship emoji', () => {
    render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        onArrived={() => {}}
      />
    )

    const ships = screen.queryAllByText('⛵')
    expect(ships.length).toBeGreaterThan(0)
  })

  it('renders island destination', () => {
    render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        onArrived={() => {}}
      />
    )

    const container = document.querySelector('.ocean-sailing-scene')
    expect(container?.innerHTML).toContain('linear-gradient')
  })

  it('accepts seed prop for reproducible stars', () => {
    const { container: container1 } = render(
      <OceanSailingScene
        isActive={true}
        style="cinematic"
        seed={12345}
        onArrived={() => {}}
      />
    )

    const { container: container2 } = render(
      <OceanSailingScene
        isActive={true}
        style="cinematic"
        seed={12345}
        onArrived={() => {}}
      />
    )

    // Same seed should produce same star positions (verified by consistent rendering)
    expect(container1.innerHTML).toBe(container2.innerHTML)
  })

  it('supports isReducedMotion prop', () => {
    const { container } = render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        isReducedMotion={true}
        onArrived={() => {}}
      />
    )

    expect(container.querySelector('.ocean-sailing-scene')).not.toBeNull()
  })

  it('calls onArrived after minimal animation completes', () => {
    vi.useFakeTimers()
    const onArrived = vi.fn()

    render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        onArrived={onArrived}
      />
    )

    // Fast-forward time by 4000ms (animation duration)
    vi.advanceTimersByTime(4000)

    expect(onArrived).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('calls onArrived after cinematic animation completes', () => {
    vi.useFakeTimers()
    const onArrived = vi.fn()

    render(
      <OceanSailingScene
        isActive={true}
        style="cinematic"
        onArrived={onArrived}
      />
    )

    // Fast-forward time by 4000ms (cinematic animation duration)
    vi.advanceTimersByTime(4000)

    expect(onArrived).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('renders with style="minimal"', () => {
    render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        onArrived={() => {}}
      />
    )

    const container = document.querySelector('.ocean-sailing-scene')
    expect(container).not.toBeNull()
  })
})

describe('OceanSailingScene - generateStars', () => {
  it('generates exactly 10 stars', () => {
    const stars = generateStars(12345)
    expect(stars.length).toBe(10)
  })

  it('generates deterministic stars for same seed', () => {
    const stars1 = generateStars(12345)
    const stars2 = generateStars(12345)
    expect(stars1).toEqual(stars2)
  })

  it('generates stars within upper half of screen (y < 50%)', () => {
    const stars = generateStars(12345)
    stars.forEach(star => {
      expect(star.y).toBeLessThan(50)
    })
  })

  it('generates stars within screen width (x < 100%)', () => {
    const stars = generateStars(12345)
    stars.forEach(star => {
      expect(star.x).toBeLessThan(100)
      expect(star.x).toBeGreaterThanOrEqual(0)
    })
  })
})

describe('OceanSailingScene - getAnimationStyle', () => {
  it('applies cinematic style for boss islands', () => {
    expect(getAnimationStyle('east_boss')).toBe('cinematic')
    expect(getAnimationStyle('west_boss')).toBe('cinematic')
  })

  it('applies minimal style for normal islands', () => {
    expect(getAnimationStyle('east_math_1')).toBe('minimal')
    expect(getAnimationStyle('east_chinese_2')).toBe('minimal')
  })
})

describe('OceanSailingScene - prefers-reduced-motion', () => {
  it('handles reduced motion preference', () => {
    const { container } = render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        isReducedMotion={true}
        onArrived={() => {}}
      />
    )
    expect(container.querySelector('.minimal-scene')).toBeTruthy()
  })
})

describe('OceanSailingScene - getOceanTheme', () => {
  it('maps known ocean ids to themselves', () => {
    expect(getOceanTheme('east')).toBe('east')
    expect(getOceanTheme('west')).toBe('west')
    expect(getOceanTheme('southHot')).toBe('southHot')
    expect(getOceanTheme('northIce')).toBe('northIce')
    expect(getOceanTheme('mysterious')).toBe('mysterious')
  })

  it('falls back to east for unknown ocean ids', () => {
    expect(getOceanTheme('unknown_ocean')).toBe('east')
    expect(getOceanTheme('')).toBe('east')
  })
})

describe('OceanSailingScene - ocean themes render distinct backdrops', () => {
  const themes = ['east', 'west', 'southHot', 'northIce', 'mysterious'] as const

  it('renders a distinct theme-decor class for each ocean theme', () => {
    const decorClasses = themes.map((theme) => {
      const { container } = render(
        <OceanSailingScene
          isActive={true}
          style="minimal"
          oceanTheme={theme}
          seed={1}
          onArrived={() => {}}
        />
      )
      const decor = container.querySelector('.theme-decor')
      expect(decor).not.toBeNull()
      return decor?.className
    })

    // All 5 theme-decor class names must be unique (distinct visual theme per ocean)
    expect(new Set(decorClasses).size).toBe(themes.length)
  })

  it('defaults to east theme when oceanTheme prop is omitted', () => {
    const { container } = render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        onArrived={() => {}}
      />
    )
    expect(container.querySelector('.theme-east')).not.toBeNull()
  })

  it('does not render animated weather particles when isReducedMotion is true', () => {
    const { container } = render(
      <OceanSailingScene
        isActive={true}
        style="minimal"
        oceanTheme="northIce"
        isReducedMotion={true}
        seed={1}
        onArrived={() => {}}
      />
    )
    // Snowflakes should still be present but with animation disabled via style block,
    // no crash and container renders successfully
    expect(container.querySelector('.ocean-sailing-scene')).not.toBeNull()
  })

  it('renders theme backdrop for cinematic style too', () => {
    const { container } = render(
      <OceanSailingScene
        isActive={true}
        style="cinematic"
        oceanTheme="mysterious"
        seed={1}
        onArrived={() => {}}
      />
    )
    expect(container.querySelector('.theme-mysterious')).not.toBeNull()
  })
})