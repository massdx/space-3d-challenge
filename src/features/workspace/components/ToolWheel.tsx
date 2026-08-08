import {
    Copy01Icon,
    Delete02Icon,
    PaintBoardIcon,
    PinIcon,
    RefreshIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { play } from 'cuelume'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useCatalogStore } from '../../catalog/model/catalogStore'
import { useToolWheelStore } from '../model/toolWheelStore'
import { useWorkspaceStore } from '../model/workspaceStore'

type Tool = {
    key: string
    icon: typeof PaintBoardIcon
    label: string
    active?: boolean
    onClick: () => void
}

const R = 78
const CENTER_DEG = 270
const MAX_SPAN = 170

function toolPosition(index: number, count: number) {
    const span = count > 1 ? Math.min(MAX_SPAN, (count - 1) * 66) : 0
    const deg = count > 1 ? CENTER_DEG - span / 2 + (span * index) / (count - 1) : CENTER_DEG
    const rad = (deg * Math.PI) / 180
    return { dx: Math.cos(rad) * R, dy: Math.sin(rad) * R }
}

export function ToolWheel() {
    const { open, x, y, target, close } = useToolWheelStore()
    const items = useCatalogStore((state) => state.items)
    const select = useCatalogStore((state) => state.select)
    const remove = useCatalogStore((state) => state.remove)
    const duplicate = useCatalogStore((state) => state.duplicate)
    const toggleLock = useCatalogStore((state) => state.toggleLock)
    const resetTransform = useCatalogStore((state) => state.resetTransform)
    const selectSurface = useWorkspaceStore((state) => state.selectSurface)

    useEffect(() => {
        if (!open) return
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') close()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open, close])

    const run = (action: () => void) => () => {
        action()
        close()
    }

    let tools: Tool[] = []
    if (target?.kind === 'furniture') {
        const item = items.find((entry) => entry.id === target.id)
        tools = [
            {
                key: 'appearance',
                icon: PaintBoardIcon,
                label: 'Apparence',
                onClick: run(() => {
                    select(target.id)
                    selectSurface(null)
                }),
            },
            {
                key: 'pin',
                icon: PinIcon,
                label: item?.locked ? 'Débloquer' : 'Épingler',
                active: item?.locked,
                onClick: run(() => toggleLock(target.id)),
            },
            {
                key: 'duplicate',
                icon: Copy01Icon,
                label: 'Dupliquer',
                onClick: run(() => duplicate(target.id)),
            },
            {
                key: 'reset',
                icon: RefreshIcon,
                label: 'Réinitialiser',
                onClick: run(() => resetTransform(target.id)),
            },
            {
                key: 'delete',
                icon: Delete02Icon,
                label: 'Supprimer',
                onClick: run(() => {
                    play('droplet')
                    remove(target.id)
                }),
            },
        ]
    } else if (target?.kind === 'surface') {
        tools = [
            {
                key: 'appearance',
                icon: PaintBoardIcon,
                label: 'Apparence',
                onClick: run(() => {
                    selectSurface(target.id)
                    select(null)
                }),
            },
        ]
    }

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="pointer-events-none fixed inset-0 z-80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <button
                        type="button"
                        aria-label="Fermer le menu"
                        className="pointer-events-auto absolute inset-0 cursor-default"
                        onClick={close}
                        onContextMenu={(event) => {
                            event.preventDefault()
                            close()
                        }}
                    />

                    <motion.div
                        className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow"
                        style={{ left: x, top: y }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', bounce: 0.5, duration: 0.4 }}
                    />

                    {tools.map((tool, index) => {
                        const { dx, dy } = toolPosition(index, tools.length)
                        return (
                            <motion.button
                                key={tool.key}
                                type="button"
                                title={tool.label}
                                aria-label={tool.label}
                                onClick={tool.onClick}
                                className={`pointer-events-auto absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg  transition-colors ${tool.active
                                    ? 'bg-neutral-700   text-white'
                                    : tool.key === 'delete'
                                        ? 'bg-white text-red-500 ring-black/5 hover:bg-red-50'
                                        : 'bg-white text-neutral-800 ring-black/5 hover:bg-neutral-100'
                                    }`}
                                style={{ left: x, top: y }}
                                initial={{ opacity: 0, scale: 0.2, x: 0, y: 0, filter: 'blur(6px)' }}
                                animate={{ opacity: 1, scale: 1, x: dx, y: dy, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 0.2, x: 0, y: 0, filter: 'blur(4px)' }}
                                transition={{
                                    default: {
                                        type: 'spring',
                                        bounce: 0.45,
                                        duration: 0.55,
                                        delay: index * 0.05,
                                    },
                                    opacity: { duration: 0.18, delay: index * 0.05 },
                                    filter: { duration: 0.25, delay: index * 0.05 },
                                }}
                            >
                                <HugeiconsIcon icon={tool.icon} size={22} strokeWidth={1.8} />
                            </motion.button>
                        )
                    })}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body,
    )
}
