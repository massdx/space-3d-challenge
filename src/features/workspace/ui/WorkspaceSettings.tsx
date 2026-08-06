import { Settings01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'
import type { WindowSide } from '../model/types'
import { useWorkspaceStore } from '../model/workspaceStore'

const WINDOW_OPTIONS: { value: WindowSide; label: string }[] = [
    { value: 'none', label: 'Aucune' },
    { value: 'left', label: 'Gauche' },
    { value: 'right', label: 'Droite' },
]

export function WorkspaceSettings() {
    const [open, setOpen] = useState(false)
    const windowSide = useWorkspaceStore((state) => state.windowSide)
    const setWindowSide = useWorkspaceStore((state) => state.setWindowSide)

    return (
        <div className="absolute right-4 top-24 z-20 flex flex-col items-end gap-2 sm:right-6">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label="Paramètres de la scène"
                title="Paramètres de la scène"
                className={[
                    'pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur transition',
                    open
                        ? 'border-cyan-400/60 bg-cyan-300/20 text-cyan-100'
                        : 'border-white/10 bg-slate-950/60 text-slate-200 hover:bg-slate-800/70 hover:text-white',
                ].join(' ')}
            >
                <HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={1.8} />
            </button>

            {open && (
                <div className="pointer-events-auto w-56 rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Scène</p>
                    <p className="mt-3 text-sm font-medium text-white">Fenêtre de la pièce</p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        {WINDOW_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setWindowSide(option.value)}
                                className={[
                                    'rounded-lg border px-2 py-2 text-xs font-medium transition',
                                    windowSide === option.value
                                        ? 'border-cyan-400/60 bg-cyan-300/20 text-cyan-100'
                                        : 'border-white/10 bg-slate-900/60 text-slate-300 hover:bg-slate-800/70 hover:text-white',
                                ].join(' ')}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
