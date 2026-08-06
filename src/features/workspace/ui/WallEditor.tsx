import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    getTexturePreview,
    TEXTURE_LABEL,
    TEXTURE_OPTIONS,
} from '../model/wallTextures'
import { useWorkspaceStore } from '../model/workspaceStore'

const WALL_COLORS = [
    '#111827',
    '#2563eb',
    '#22c55e',
    '#6366f1',
    '#a855f7',
    '#ec4899',
    '#f97316',
    '#eab308',
    '#8d6e63',
    '#7b3f96',
]

const WALL_LABEL: Record<'left' | 'right', string> = {
    left: 'Mur gauche',
    right: 'Mur droit',
}

export function WallEditor() {
    const selectedWall = useWorkspaceStore((state) => state.selectedWall)
    const selectWall = useWorkspaceStore((state) => state.selectWall)
    const wallColors = useWorkspaceStore((state) => state.wallColors)
    const setWallColor = useWorkspaceStore((state) => state.setWallColor)
    const wallTextures = useWorkspaceStore((state) => state.wallTextures)
    const setWallTexture = useWorkspaceStore((state) => state.setWallTexture)

    if (!selectedWall) return null

    const currentColor = wallColors[selectedWall]
    const currentTexture = wallTextures[selectedWall]

    return (
        <div className="pointer-events-auto absolute right-4 top-1/2 z-30 w-60 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-2xl backdrop-blur sm:right-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white">{WALL_LABEL[selectedWall]}</p>
                <button
                    type="button"
                    onClick={() => selectWall(null)}
                    aria-label="Fermer"
                    title="Fermer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 text-slate-300 transition hover:bg-slate-800/70 hover:text-white"
                >
                    <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={1.8} />
                </button>
            </div>

            <p className="mt-3 text-xs uppercase tracking-[0.3em] text-cyan-300">Couleur</p>
            <div className="mt-3 grid grid-cols-5 gap-3">
                {WALL_COLORS.map((color) => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => setWallColor(selectedWall, color)}
                        aria-label={color}
                        title={color}
                        className={[
                            'h-8 w-8 rounded-full border transition',
                            currentColor === color
                                ? 'border-white ring-2 ring-cyan-300'
                                : 'border-white/20 hover:scale-110',
                        ].join(' ')}
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>

            <p className="mt-4 text-xs uppercase tracking-[0.3em] text-cyan-300">Texture</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
                {TEXTURE_OPTIONS.map((texture) => {
                    const preview = getTexturePreview(texture)
                    const active = currentTexture === texture
                    return (
                        <button
                            key={texture}
                            type="button"
                            onClick={() => setWallTexture(selectedWall, texture)}
                            title={TEXTURE_LABEL[texture]}
                            className={[
                                'flex h-12 items-center justify-center overflow-hidden rounded-lg border bg-slate-900/60 bg-cover bg-center text-[10px] font-medium text-slate-300 transition',
                                active
                                    ? 'border-cyan-400/70 ring-2 ring-cyan-300'
                                    : 'border-white/10 hover:border-white/30',
                            ].join(' ')}
                            style={preview ? { backgroundImage: `url(${preview})` } : undefined}
                        >
                            {preview ? '' : TEXTURE_LABEL[texture]}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

