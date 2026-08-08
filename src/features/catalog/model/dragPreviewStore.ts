import { create } from 'zustand'

type DragPreviewState = {
    modelId: string | null
    x: number
    y: number
    start: (modelId: string, x: number, y: number) => void
    end: () => void
}

export const useDragPreviewStore = create<DragPreviewState>((set) => ({
    modelId: null,
    x: 0,
    y: 0,
    start: (modelId, x, y) => set({ modelId, x, y }),
    end: () => set({ modelId: null }),
}))
