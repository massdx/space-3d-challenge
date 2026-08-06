import { create } from 'zustand'
import type { WorkspaceState } from './types'

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
    environmentPreset: 'sunset',
    toggleEnvironment: () =>
        set((state) => ({
            environmentPreset: state.environmentPreset === 'sunset' ? 'night' : 'sunset',
        })),
}))