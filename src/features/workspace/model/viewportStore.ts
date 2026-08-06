import { Vector3, type Camera, type WebGLRenderer } from 'three'
import { create } from 'zustand'

export type OrbitLike = {
    object: { position: Vector3 }
    target: Vector3
    minDistance: number
    maxDistance: number
    enabled: boolean
    update: () => void
}

export const INITIAL_CAMERA = new Vector3(11, 8.2, 11)
export const INITIAL_TARGET = new Vector3(-1.9, 1.7, -1.9)

type ViewportState = {
    controls: OrbitLike | null
    renderer: WebGLRenderer | null
    camera: Camera | null
    setControls: (controls: OrbitLike | null) => void
    setRenderer: (renderer: WebGLRenderer | null) => void
    setCamera: (camera: Camera | null) => void
    zoomBy: (factor: number) => void
    resetCamera: () => void
    screenshot: () => void
}

export const useViewportStore = create<ViewportState>((set, get) => ({
    controls: null,
    renderer: null,
    camera: null,
    setControls: (controls) => set({ controls }),
    setRenderer: (renderer) => set({ renderer }),
    setCamera: (camera) => set({ camera }),
    zoomBy: (factor) => {
        const controls = get().controls
        if (!controls) return
        const offset = controls.object.position.clone().sub(controls.target)
        const distance = offset.length() * factor
        if (distance < controls.minDistance || distance > controls.maxDistance) return
        offset.multiplyScalar(factor)
        controls.object.position.copy(controls.target.clone().add(offset))
        controls.update()
    },
    resetCamera: () => {
        const controls = get().controls
        if (!controls) return
        controls.object.position.copy(INITIAL_CAMERA)
        controls.target.copy(INITIAL_TARGET)
        controls.update()
    },
    screenshot: () => {
        const renderer = get().renderer
        if (!renderer) return
        const url = renderer.domElement.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = url
        link.download = 'dev-setup-3d.png'
        link.click()
    },
}))
