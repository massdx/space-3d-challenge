import { create } from 'zustand'

type HelpState = {
    open: boolean
    toggle: () => void
    close: () => void
}

export const useHelpStore = create<HelpState>((set) => ({
    open: false,
    toggle: () => set((state) => ({ open: !state.open })),
    close: () => set({ open: false }),
}))
