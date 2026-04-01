import * as THREE from 'three'
import { OrthographicCamera } from 'three'
import { RenderAdapter } from './RenderAdapter'
import { SpriteRenderAdapter } from './SpriteRenderAdapter'

export class RenderManager {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: OrthographicCamera
  private currentAdapter: RenderAdapter
  private adapterType: '2d' | '3d' = '2d'

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.scene = new THREE.Scene()
    this.camera = new OrthographicCamera(-10, 10, 10, -10, 0.1, 1000)
    this.camera.position.z = 10

    this.currentAdapter = new SpriteRenderAdapter(this.scene)
  }

  switchRenderer(type: '2d' | '3d'): void {
    if (type === this.adapterType) return

    this.currentAdapter.dispose()
    this.adapterType = type

    if (type === '2d') {
      this.currentAdapter = new SpriteRenderAdapter(this.scene)
    } else {
      // Future: ModelRenderAdapter
      throw new Error('3D rendering not yet implemented')
    }
  }

  getAdapter(): RenderAdapter {
    return this.currentAdapter
  }

  render(): void {
    this.renderer.render(this.scene, this.camera)
  }

  dispose(): void {
    this.currentAdapter.dispose()
    this.renderer.dispose()
  }
}