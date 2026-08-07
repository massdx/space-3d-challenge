import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useTexture } from '@react-three/drei'
import { motion } from 'motion/react'
import { useEffect, type ReactNode } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { TEXTURE_CATALOG } from '../model/textureCatalog'
import { useWorkspaceStore } from '../model/workspaceStore'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

export function TexturePopover({ children }: { children: ReactNode }) {
    const selectedSurface = useWorkspaceStore((state) => state.selectedSurface)
    const surfaceTextures = useWorkspaceStore((state) => state.surfaceTextures)
    const setSurfaceTexture = useWorkspaceStore((state) => state.setSurfaceTexture)

    useEffect(() => {
        TEXTURE_CATALOG.forEach((item) => useTexture.preload(item.url))
    }, [])

    const current = selectedSurface ? surfaceTextures[selectedSurface] : null

    const apply = (id: string | null) => {
        if (selectedSurface) setSurfaceTexture(selectedSurface, id)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>

            <PopoverContent
                asChild
                side="top"
                align="end"
                sideOffset={12}
                className="flex max-h-[70vh] w-50 flex-col  overflow-hidden rounded-3xl border border-white/10 bg-neutral-200/80 p-0 text-slate-900 shadow-none"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    style={{ transformOrigin: 'var(--radix-popover-content-transform-origin)' }}
                >
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto p-3 no-scrollbar">
                        <button
                            type="button"
                            onClick={() => apply(null)}
                            title="Aucune"
                            data-cuelume-press
                            data-cuelume-hover="bloom"
                            className={[
                                'flex aspect-square items-center justify-center rounded-xl border bg-white/40 text-slate-600 transition-colors',
                                current == null
                                    ? 'border-cyan-500/60 ring-2 ring-cyan-300'
                                    : 'border-slate-900/10 hover:border-cyan-500/50 hover:bg-cyan-300/20',
                            ].join(' ')}
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={22} strokeWidth={1.8} />
                        </button>

                        {TEXTURE_CATALOG.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => apply(item.id)}
                                title={item.name}
                                data-cuelume-press
                                data-cuelume-hover="bloom"
                                className={[
                                    ' aspect-square w-5/5 overflow-hidden rounded-xl border transition-colors',
                                    current === item.id
                                        ? 'border-cyan-500/60 ring-2 ring-cyan-300'
                                        : 'border-slate-900/10 hover:border-cyan-500/50',
                                ].join(' ')}
                            >
                                <img
                                    src={item.url}
                                    alt={item.name}
                                    draggable={false}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </PopoverContent>
        </Popover>
    )
}
