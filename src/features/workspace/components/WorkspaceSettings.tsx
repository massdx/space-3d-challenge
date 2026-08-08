import { Moon02Icon, Sun02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import type { WindowSide } from '../model/types'
import { useWorkspaceStore } from '../model/workspaceStore'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const WINDOW_OPTIONS: { value: WindowSide; label: string }[] = [
    { value: 'none', label: 'Aucune' },
    { value: 'left', label: 'Gauche' },
    { value: 'right', label: 'Droite' },
]

export function SettingsPopover({ children }: { children: ReactNode }) {
    const windowSide = useWorkspaceStore((state) => state.windowSide)
    const setWindowSide = useWorkspaceStore((state) => state.setWindowSide)
    const environmentPreset = useWorkspaceStore((state) => state.environmentPreset)
    const toggleEnvironment = useWorkspaceStore((state) => state.toggleEnvironment)

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>

            <PopoverContent
                asChild
                side="bottom"
                align="end"
                sideOffset={12}
                className="w-60 rounded-3xl border border-white/10 bg-neutral-200/80 p-0 text-slate-900 shadow-none"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    style={{ transformOrigin: 'var(--radix-popover-content-transform-origin)' }}
                >
                    <div className="p-4">
                        <p className="text-sm font-medium text-slate-900">Ambiance</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Choisis l'éclairage de la scène.
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            {([
                                { value: 'sunset', label: 'Jour', icon: Sun02Icon },
                                { value: 'night', label: 'Nuit', icon: Moon02Icon },
                            ] as const).map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        if (environmentPreset !== option.value) toggleEnvironment()
                                    }}
                                    className={[
                                        'flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-medium transition-colors',
                                        environmentPreset === option.value
                                            ? 'border-cyan-500/60 bg-cyan-300/30 text-slate-900 ring-2 ring-cyan-300'
                                            : 'border-slate-900/10 bg-white/50 text-slate-600 hover:bg-white/80',
                                    ].join(' ')}
                                >
                                    <HugeiconsIcon icon={option.icon} size={16} strokeWidth={1.8} />
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        <p className="mt-4 text-sm font-medium text-slate-900">Fenêtre de la pièce</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Choisis le mur qui reçoit la fenêtre.
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            {WINDOW_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setWindowSide(option.value)}
                                    className={[
                                        'rounded-xl border px-2 py-2 text-xs font-medium transition-colors',
                                        windowSide === option.value
                                            ? 'border-cyan-500/60 bg-cyan-300/30 text-slate-900 ring-2 ring-cyan-300'
                                            : 'border-slate-900/10 bg-white/50 text-slate-600 hover:bg-white/80',
                                    ].join(' ')}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </PopoverContent>
        </Popover>
    )
}
