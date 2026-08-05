import { describe, it, expect, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import BossEntrance from '../../src/components/game/BossEntrance'

describe('BossEntrance', () => {
  it('renders nothing when isActive is false', () => {
    const { container } = render(
      <BossEntrance
        isActive={false}
        bossName="水母国王"
        bossSprite="🪼"
        onComplete={() => {}}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders boss sprite when active', () => {
    const { getByText } = render(
      <BossEntrance
        isActive={true}
        bossName="水母国王"
        bossSprite="🪼"
        onComplete={() => {}}
      />
    )
    expect(getByText('🪼')).toBeTruthy()
  })

  it('progresses through stages and calls onComplete', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()

    const { container } = render(
      <BossEntrance
        isActive={true}
        bossName="水母国王"
        bossSprite="🪼"
        onComplete={onComplete}
      />
    )

    expect(container.querySelector('.boss-entrance-silhouette')).not.toBeNull()
    expect(onComplete).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(600)
    })
    expect(container.querySelector('.boss-entrance-zoom-in')).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(container.querySelector('.boss-entrance-name-reveal')).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(container.querySelector('.boss-entrance-battle-start')).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(onComplete).toHaveBeenCalled()

    vi.useRealTimers()
  })

  it('degrades to a short single fade-in and calls onComplete quickly when isReducedMotion is true', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()

    render(
      <BossEntrance
        isActive={true}
        bossName="水母国王"
        bossSprite="🪼"
        isReducedMotion={true}
        onComplete={onComplete}
      />
    )

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(onComplete).toHaveBeenCalled()

    vi.useRealTimers()
  })

  it('displays boss name text once reveal stage is reached', () => {
    vi.useFakeTimers()

    const { getByText, queryByText } = render(
      <BossEntrance
        isActive={true}
        bossName="海蛇王"
        bossSprite="🐉"
        onComplete={() => {}}
      />
    )

    expect(queryByText('海蛇王')).toBeNull()

    act(() => {
      vi.advanceTimersByTime(1100)
    })
    expect(getByText('海蛇王')).toBeTruthy()

    vi.useRealTimers()
  })
})
