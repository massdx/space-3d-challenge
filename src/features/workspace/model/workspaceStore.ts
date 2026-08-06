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
    wallColors: { left: null, right: null },
    wallTextures: { left: 'none', right: 'none' },
    selectedWall: null,
    selectWall: (wall) => set({ selectedWall: wall }),
    setWallColor: (wall, color) =>
        set((state) => ({ wallColors: { ...state.wallColors, [wall]: color } })),
    setWallTexture: (wall, texture) =>
        set((state) => ({ wallTextures: { ...state.wallTextures, [wall]: texture } })),
}))