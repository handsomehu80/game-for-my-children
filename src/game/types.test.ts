import { describe, it, expect } from 'vitest'
import type { Player, Monster } from './types'

describe('Core Types', () => {
  it('Player should have required fields', () => {
    const player: Player = {
      id: 'p1',
      name: 'Player 1',
      hp: 100,
      maxHp: 100,
      comboCount: 0,
      grade: 1
    }
    expect(player.hp).toBe(100)
    expect(player.maxHp).toBe(100)
  })

  it('Monster should have hp and maxHp', () => {
    const monster: Monster = {
      id: 'm1',
      name: 'Slime',
      hp: 50,
      maxHp: 50,
      sprite: 'slime.png'
    }
    expect(monster.hp).toBe(monster.maxHp)
  })
})