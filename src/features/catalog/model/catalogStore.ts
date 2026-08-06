import { create } from 'zustand'

export type PlacedItem = {
    id: string
    modelId: string
    position: [number, number, number]
    rotationY: number
    scale: number
}

type CatalogState = {
    isOpen: boolean
    items: PlacedItem[]
    selectedId: string | null
    openPanel: () => void
    closePanel: () => void
    togglePanel: () => void
    place: (modelId: string, position: [number, number, number]) => void
    moveTo: (id: string, position: [number, number, number]) => void
    rotateBy: (id: string, delta: number) => void
    scaleBy: (id: string, factor: number) => void
    remove: (id: string) => void
    select: (id: string | null) => void
    clear: () => void
}

let counter = 0

const SCALE_MIN = 0.3
const SCALE_MAX = 3

export const useCatalogStore = create<CatalogState>((set) => ({
    isOpen: true,
    items: [],
    selectedId: null,
    openPanel: () => set({ isOpen: true }),
    closePanel: () => set({ isOpen: false }),
    togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
    place: (modelId, position) =>
        set((state) => {
            const id = `${modelId}-${++counter}`
            return {
                items: [...state.items, { id, modelId, position, rotationY: 0, scale: 1 }],
                selectedId: id,
            }
        }),
    moveTo: (id, position) =>
        set((state) => ({
            items: state.items.map((item) => (item.id === id ? { ...item, position } : item)),
        })),
    rotateBy: (id, delta) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, rotationY: item.rotationY + delta } : item,
            ),
        })),
    scaleBy: (id, factor) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id
                    ? { ...item, scale: Math.min(SCALE_MAX, Math.max(SCALE_MIN, item.scale * factor)) }
                    : item,
            ),
        })),
    remove: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId,
        })),
    select: (id) => set({ selectedId: id }),
    clear: () => set({ items: [], selectedId: null }),
}))

export const DRAG_MIME = 'application/x-model-id'
