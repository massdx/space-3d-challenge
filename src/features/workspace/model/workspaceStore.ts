import { create } from 'zustand'
import type { WorkspaceState } from './types'

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    environmentPreset: 'sunset',
    toggleEnvironment: () =>
        set((state) => ({
            environmentPreset: state.environmentPreset === 'sunset' ? 'night' : 'sunset',
        })),
    windowSide: 'none',
    setWindowSide: (side) => set({ windowSide: side }),
    surfaceColors: { left: null, right: null, floor: null },
    surfaceTextures: { left: null, right: null, floor: null },
    selectedSurface: null,
    selectSurface: (surface) => set({ selectedSurface: surface }),
    setSurfaceColor: (surface, color) =>
        set((state) => ({ surfaceColors: { ...state.surfaceColors, [surface]: color } })),
    setSurfaceTexture: (surface, texture) =>
        set((state) => ({ surfaceTextures: { ...state.surfaceTextures, [surface]: texture } })),
}))