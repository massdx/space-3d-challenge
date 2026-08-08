import { play } from 'cuelume';
import { create } from 'zustand';
import type { SurfaceId } from './types';

export type WheelTarget =
    | { kind: 'furniture'; id: string }
    | { kind: 'surface'; id: SurfaceId }

type ToolWheelState = {
    open: boolean
    x: number
    y: number
    target: WheelTarget | null
    openAt: (x: number, y: number, target: WheelTarget) => void
    close: () => void
}

export const useToolWheelStore = create<ToolWheelState>((set) => ({
    open: false,
    x: 0,
    y: 0,
    target: null,
    openAt: (x, y, target) => {
        play('bloom')
        set({ open: true, x, y, target })
    },
    close: () => set({ open: false, target: null }),
}))
