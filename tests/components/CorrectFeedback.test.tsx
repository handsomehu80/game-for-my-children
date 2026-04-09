import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import CorrectFeedback from '../../src/components/game/Battle/CorrectFeedback'

describe('CorrectFeedback Component', () => {
  it('renders container div', () => {
    const { container } = render(<CorrectFeedback />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders star emojis after useEffect runs', () => {
    const { container } = render(<CorrectFeedback />)

    // Stars should be rendered after useEffect runs
    const content = container.textContent
    expect(content).toContain('✨')
  })

  it('each star has unique position', () => {
    const { container } = render(<CorrectFeedback />)

    const starDivs = Array.from(container.querySelectorAll('div'))
    const transforms = starDivs.map(div => div.getAttribute('style'))

    // Each star should have a different transform (position)
    const uniqueTransforms = new Set(transforms)
    expect(uniqueTransforms.size).toBe(starDivs.length)
  })
})
