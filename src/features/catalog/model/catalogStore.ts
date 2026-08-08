import { play } from 'cuelume'
import { create } from 'zustand'
import { clampToRoom, WALL_OVERLAP } from '../../workspace/model/floor'
import { CATALOG_BY_ID } from './catalog'
import { getFootprint, rotatedExtents } from './footprint'

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
    past: PlacedItem[][]
    future: PlacedItem[][]
    openPanel: () => void
    closePanel: () => void
    togglePanel: () => void
    place: (modelId: string, position: [number, number, number], rotationY?: number) => void
    moveTo: (id: string, position: [number, number, number]) => void
    rotateBy: (id: string, delta: number) => void
    setRotationY: (id: string, value: number) => void
    scaleBy: (id: string, factor: number) => void
    toggleLock: (id: string) => void
    duplicate: (id: string) => void
    resetTransform: (id: string) => void
    remove: (id: string) => void
    select: (id: string | null) => void
    loadItems: (items: Omit<PlacedItem, 'id'>[]) => void
    beginHistory: () => void
    undo: () => void
    redo: () => void
    clear: () => void
}

let counter = 0

const SCALE_MIN = 0.3
const SCALE_MAX = 3
const HISTORY_LIMIT = 50

function pushPast(state: CatalogState) {
    return [...state.past, state.items].slice(-HISTORY_LIMIT)
}

export const useCatalogStore = create<CatalogState>((set) => ({
    isOpen: true,
    items: [],
    selectedId: null,
    past: [],
    future: [],
    openPanel: () => set({ isOpen: true }),
    closePanel: () => set({ isOpen: false }),
    togglePanel: () => set((state) => ({ isOpen: !state.isOpen })),
    place: (modelId, position, rotationY = 0) =>
        set((state) => {
            const id = `${modelId}-${++counter}`
            play('success')
            return {
                items: [...state.items, { id, modelId, position, rotationY, scale: 1, locked: false }],
                selectedId: id,
                past: pushPast(state),
                future: [],
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
    setRotationY: (id, value) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, rotationY: value } : item,
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
            past: pushPast(state),
            future: [],
        })),
    duplicate: (id) =>
        set((state) => {
            const source = state.items.find((item) => item.id === id)
            if (!source) return state
            const model = CATALOG_BY_ID[source.modelId]
            const footprint = model ? getFootprint(model.url) : undefined
            const { ex, ez } = footprint
                ? rotatedExtents(footprint, source.rotationY, source.scale)
                : { ex: model ? (model.targetSize * source.scale) / 2 : 0, ez: model ? (model.targetSize * source.scale) / 2 : 0 }
            const overlap = model?.wallHug ? WALL_OVERLAP : 0
            const [x, z] = clampToRoom(
                source.position[0] + 0.6,
                source.position[2] + 0.6,
                Math.max(0, ex - overlap),
                Math.max(0, ez - overlap),
            )
            const newId = `${source.modelId}-${++counter}`
            return {
                items: [
                    ...state.items,
                    { ...source, id: newId, position: [x, source.position[1], z], locked: false },
                ],
                selectedId: newId,
                past: pushPast(state),
                future: [],
            }
        }),
    resetTransform: (id) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, rotationY: 0, scale: 1 } : item,
            ),
            past: pushPast(state),
            future: [],
        })),
    remove: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId,
            past: pushPast(state),
            future: [],
        })),
    select: (id) =>
        set((state) => {
            if (id && id !== state.selectedId) play('ready')
            return { selectedId: id }
        }),
    loadItems: (incoming) =>
        set((state) => ({
            items: incoming.map((item) => ({ ...item, id: `${item.modelId}-${++counter}` })),
            selectedId: null,
            past: pushPast(state),
            future: [],
        })),
    beginHistory: () => set((state) => ({ past: pushPast(state), future: [] })),
    undo: () =>
        set((state) => {
            if (state.past.length === 0) return state
            const previous = state.past[state.past.length - 1]
            const selectedId =
                state.selectedId && previous.some((item) => item.id === state.selectedId)
                    ? state.selectedId
                    : null
            return {
                items: previous,
                past: state.past.slice(0, -1),
                future: [state.items, ...state.future],
                selectedId,
            }
        }),
    redo: () =>
        set((state) => {
            if (state.future.length === 0) return state
            const next = state.future[0]
            const selectedId =
                state.selectedId && next.some((item) => item.id === state.selectedId)
                    ? state.selectedId
                    : null
            return {
                items: next,
                past: pushPast(state),
                future: state.future.slice(1),
                selectedId,
            }
        }),
    clear: () => set({ items: [], selectedId: null, past: [], future: [] }),
}))

export const DRAG_MIME = 'application/x-model-id'
