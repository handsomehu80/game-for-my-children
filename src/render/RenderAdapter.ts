import { Vector3 } from 'three'

export interface CharacterProps {
  id: string
  name: string
  position: Vector3
  sprite: string
  hp: number
  maxHp: number
}

export interface MonsterProps {
  id: string
  name: string
  position: Vector3
  sprite: string
  hp: number
  maxHp: number
}

export interface SkillEffectProps {
  skillId: string
  position: Vector3
  duration: number
}

export interface DamageEffectProps {
  target: 'player' | 'monster'
  amount: number
  position: Vector3
}

export interface RenderAdapter {
  // 角色渲染
  renderCharacter(props: CharacterProps): void
  renderMonster(props: MonsterProps): void
  updateCharacter(id: string, props: Partial<CharacterProps>): void
  updateMonster(id: string, props: Partial<MonsterProps>): void
  removeCharacter(id: string): void
  removeMonster(id: string): void

  // 特效
  playSkillEffect(props: SkillEffectProps): void
  playDamageEffect(props: DamageEffectProps): void

  // 相机控制
  setCamera(mode: '2d' | '3d'): void
  focusOn(position: Vector3): void

  // 生命周期
  dispose(): void
}