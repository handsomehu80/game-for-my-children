import * as THREE from 'three'
import { RenderAdapter, CharacterProps, MonsterProps, SkillEffectProps, DamageEffectProps } from './RenderAdapter'

export class SpriteRenderAdapter implements RenderAdapter {
  private characters: Map<string, THREE.Sprite> = new Map()
  private monsters: Map<string, THREE.Sprite> = new Map()
  private scene: THREE.Scene

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  renderCharacter(props: CharacterProps): void {
    const sprite = this.createSprite(props.sprite, props.position)
    sprite.userData.id = props.id
    this.characters.set(props.id, sprite)
    this.scene.add(sprite)
  }

  renderMonster(props: MonsterProps): void {
    const sprite = this.createSprite(props.sprite, props.position)
    sprite.userData.id = props.id
    this.monsters.set(props.id, sprite)
    this.scene.add(sprite)
  }

  updateCharacter(id: string, props: Partial<CharacterProps>): void {
    const sprite = this.characters.get(id)
    if (sprite && props.position) {
      sprite.position.copy(props.position)
    }
  }

  updateMonster(id: string, props: Partial<MonsterProps>): void {
    const sprite = this.monsters.get(id)
    if (sprite && props.position) {
      sprite.position.copy(props.position)
    }
  }

  removeCharacter(id: string): void {
    const sprite = this.characters.get(id)
    if (sprite) {
      this.scene.remove(sprite)
      this.characters.delete(id)
    }
  }

  removeMonster(id: string): void {
    const sprite = this.monsters.get(id)
    if (sprite) {
      this.scene.remove(sprite)
      this.monsters.delete(id)
    }
  }

  playSkillEffect(props: SkillEffectProps): void {
    // TODO: Implement VFX particle effect
    console.log(`Playing skill effect: ${props.skillId}`)
  }

  playDamageEffect(props: DamageEffectProps): void {
    // TODO: Implement damage number animation
    console.log(`Playing damage effect: ${props.amount} to ${props.target}`)
  }

  setCamera(_mode: '2d' | '3d'): void {
    // Camera mode switching handled by RenderManager
  }

  focusOn(_position: THREE.Vector3): void {
    // Camera focus handled by RenderManager
  }

  dispose(): void {
    this.characters.forEach((sprite) => this.scene.remove(sprite))
    this.monsters.forEach((sprite) => this.scene.remove(sprite))
    this.characters.clear()
    this.monsters.clear()
  }

  private createSprite(textureUrl: string, position: THREE.Vector3): THREE.Sprite {
    const texture = new THREE.TextureLoader().load(textureUrl)
    const material = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(material)
    sprite.position.copy(position)
    return sprite
  }
}