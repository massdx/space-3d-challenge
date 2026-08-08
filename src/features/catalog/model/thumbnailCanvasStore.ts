import { create } from 'zustand'

type ThumbnailCanvasState = {
    active: boolean
    setActive: (active: boolean) => void
}

export const useThumbnailCanvasStore = create<ThumbnailCanvasState>((set) => ({
    active: false,
    setActive: (active) => set({ active }),
}))
