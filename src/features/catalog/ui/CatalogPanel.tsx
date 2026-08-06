import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useGLTF } from '@react-three/drei'
import { useRef, useState, type DragEvent } from 'react'
import { CATALOG, type CatalogItem } from '../model/catalog'
import { DRAG_MIME, useCatalogStore } from '../model/catalogStore'
import { Thumbnail, ThumbnailCanvas } from './CatalogThumbnail'

type Tab = 'store' | 'upload'

export function CatalogPanel() {
    const isOpen = useCatalogStore((state) => state.isOpen)
    const closePanel = useCatalogStore((state) => state.closePanel)
    const [tab, setTab] = useState<Tab>('store')
    const containerRef = useRef<HTMLDivElement>(null)

    if (!isOpen) return null

    return (
        <>
            <div
                ref={containerRef}
                className="pointer-events-auto absolute left-4 top-4 z-20 flex max-h-[calc(100vh-2rem)] w-64 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur-xl sm:left-6 sm:top-6"
            >
                <header className="flex items-center justify-between px-4 pt-4">
                    <h2 className="text-base font-semibold text-white">Furnitures</h2>
                    <button
                        type="button"
                        onClick={closePanel}
                        aria-label="Fermer le catalogue"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                        <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} />
                    </button>
                </header>

                <div className="mx-4 mt-3 flex rounded-full bg-white/5 p-1 text-sm">
                    <TabButton active={tab === 'store'} onClick={() => setTab('store')}>
                        Store
                    </TabButton>
                    <TabButton active={tab === 'upload'} onClick={() => setTab('upload')}>
                        Upload
                    </TabButton>
                </div>

                {tab === 'store' ? (
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto p-4">
                        {CATALOG.map((item) => (
                            <CatalogCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-slate-400">
                        Import de modèles bientôt disponible.
                    </div>
                )}

                <p className="border-t border-white/5 px-4 py-3 text-xs text-slate-400">
                    Glisse un objet sur la scène pour le placer.
                </p>
            </div>

            <ThumbnailCanvas trackRef={containerRef} />
        </>
    )
}

function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                'flex-1 rounded-full px-3 py-1.5 font-medium transition',
                active ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-slate-200',
            ].join(' ')}
        >
            {children}
        </button>
    )
}

function CatalogCard({ item }: { item: CatalogItem }) {
    const onDragStart = (event: DragEvent<HTMLButtonElement>) => {
        event.dataTransfer.setData(DRAG_MIME, item.id)
        event.dataTransfer.effectAllowed = 'copy'
        useGLTF.preload(item.url)
    }

    return (
        <button
            type="button"
            draggable
            onDragStart={onDragStart}
            title={item.name}
            className="group flex aspect-square cursor-grab flex-col items-center justify-between gap-1 rounded-2xl border border-white/10 bg-white/5 p-2 transition hover:border-cyan-400/50 hover:bg-cyan-300/10 active:cursor-grabbing"
        >
            <div className="pointer-events-none min-h-0 w-full flex-1">
                <Thumbnail url={item.url} />
            </div>
            <span className="line-clamp-2 text-center text-[11px] leading-tight text-slate-300">
                {item.name}
            </span>
        </button>
    )
}
