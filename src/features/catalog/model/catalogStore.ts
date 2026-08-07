import { play } from 'cuelume'
import { create } from 'zustand'
import { clampToRoom } from '../../workspace/model/floor'
import { CATALOG_BY_ID } from './catalog'

export type PlacedItem = {
    id: string
    modelId: string
    position: [number, number, number]
    rotationY: number
    scale: number
    locked: boolean
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
    toggleLock: (id: string) => void
    duplicate: (id: string) => void
    resetTransform: (id: string) => void
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
            play('success')
            return {
                items: [...state.items, { id, modelId, position, rotationY: 0, scale: 1, locked: false }],
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
    toggleLock: (id) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, locked: !item.locked } : item,
            ),
        })),
    duplicate: (id) =>
        set((state) => {
            const source = state.items.find((item) => item.id === id)
            if (!source) return state
            const model = CATALOG_BY_ID[source.modelId]
            const radius = model ? (model.targetSize * source.scale) / 2 : 0
            const [x, z] = clampToRoom(source.position[0] + 0.6, source.position[2] + 0.6, radius)
            const newId = `${source.modelId}-${++counter}`
            return {
                items: [
                    ...state.items,
                    { ...source, id: newId, position: [x, source.position[1], z], locked: false },
                ],
                selectedId: newId,
            }
        }),
    resetTransform: (id) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, rotationY: 0, scale: 1 } : item,
            ),
        })),
    remove: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId,
        })),
    select: (id) =>
        set((state) => {
            if (id && id !== state.selectedId) play('ready')
            return { selectedId: id }
        }),
    clear: () => set({ items: [], selectedId: null }),
}))

export const DRAG_MIME = 'application/x-model-id'
