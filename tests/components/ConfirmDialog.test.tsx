import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ConfirmDialog } from '../../src/components/game/ConfirmDialog'

describe('ConfirmDialog', () => {
  beforeEach(() => {
    cleanup()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders when isOpen is true', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    expect(screen.getByText('Test Title')).toBeTruthy()
    expect(screen.getByText('Test Message')).toBeTruthy()
  })

  it('does not render when isOpen is false', () => {
    render(
      <ConfirmDialog
        isOpen={false}
        title="Test Title"
        message="Test Message"
        onConfirm={() => {}}
        onCancel={() => {}}
      />
    )
    const title = screen.queryByText('Test Title')
    const dialog = screen.queryByRole('dialog')
    expect(title).toBeFalsy()
    expect(dialog).toBeFalsy()
  })

  it('calls onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Message"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    )
    const buttons = screen.getAllByRole('button')
    const confirmBtn = buttons.find(btn => btn.textContent === '确定' && btn.getAttribute('aria-label') === '确定')
    confirmBtn?.click()
    expect(onConfirm).toHaveBeenCalled()
  })

  it('calls onCancel when cancel button clicked', () => {
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        isOpen={true}
        title="Test"
        message="Message"
        onConfirm={() => {}}
        onCancel={onCancel}
      />
    )
    const buttons = screen.getAllByRole('button')
    const cancelBtn = buttons.find(btn => btn.textContent === '取消' && btn.getAttribute('aria-label') === '取消')
    cancelBtn?.click()
    expect(onCancel).toHaveBeenCalled()
  })
})