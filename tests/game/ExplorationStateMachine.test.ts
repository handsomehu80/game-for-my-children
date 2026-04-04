import { describe, it, expect } from 'vitest'
import { explorationTransition, initialExplorationState } from '../../src/game/ExplorationStateMachine'
import type { ExplorationPhase } from '../../src/game/types'

describe('ExplorationStateMachine', () => {
  describe('Sailing State', () => {
    it('should transition from exploring to sailing on SELECT_AREA', () => {
      const state = { ...initialExplorationState, phase: 'exploring' as ExplorationPhase }
      const newState = explorationTransition(state, { type: 'SELECT_AREA', areaId: 'east_math_1' })
      expect(newState.phase).toBe('sailing')
    })

    it('should transition from sailing to arrived on SAILING_COMPLETE', () => {
      const state = { ...initialExplorationState, phase: 'sailing' as ExplorationPhase }
      const newState = explorationTransition(state, { type: 'SAILING_COMPLETE' })
      expect(newState.phase).toBe('arrived')
    })

    it('should transition from arrived to moving on ARRIVED', () => {
      const state = { ...initialExplorationState, phase: 'arrived' as ExplorationPhase }
      const newState = explorationTransition(state, { type: 'ARRIVED' })
      expect(newState.phase).toBe('moving')
    })

    it('should reset from sailing state on RESET_EXPLORATION', () => {
      const state = { ...initialExplorationState, phase: 'sailing' as ExplorationPhase, currentArea: 'east_math_1' }
      const newState = explorationTransition(state, { type: 'RESET_EXPLORATION' })
      expect(newState.phase).toBe('exploring')
      expect(newState.currentArea).toBe(null)
    })

    it('should reset from arrived state on RESET_EXPLORATION', () => {
      const state = { ...initialExplorationState, phase: 'arrived' as ExplorationPhase, currentArea: 'east_math_1' }
      const newState = explorationTransition(state, { type: 'RESET_EXPLORATION' })
      expect(newState.phase).toBe('exploring')
      expect(newState.currentArea).toBe(null)
    })

    it('should not transition on other actions in sailing state', () => {
      const state = { ...initialExplorationState, phase: 'sailing' as ExplorationPhase }
      const newState = explorationTransition(state, { type: 'MOVE_COMPLETE' })
      expect(newState.phase).toBe('sailing')
    })

    it('should not transition on other actions in arrived state', () => {
      const state = { ...initialExplorationState, phase: 'arrived' as ExplorationPhase }
      const newState = explorationTransition(state, { type: 'SAILING_COMPLETE' })
      expect(newState.phase).toBe('arrived')
    })
  })

  describe('SELECT_AREA transitions', () => {
    it('should set currentArea when transitioning to sailing', () => {
      const state = { ...initialExplorationState, phase: 'exploring' as ExplorationPhase }
      const newState = explorationTransition(state, { type: 'SELECT_AREA', areaId: 'east_math_1' })
      expect(newState.phase).toBe('sailing')
      expect(newState.currentArea).toBe('east_math_1')
    })
  })
})