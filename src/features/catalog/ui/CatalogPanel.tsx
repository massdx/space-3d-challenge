import { useGLTF } from '@react-three/drei'
import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover'
import { CATALOG, type CatalogItem } from '../model/catalog'
import { DRAG_MIME } from '../model/catalogStore'
import { useDragPreviewStore } from '../model/dragPreviewStore'
import { useThumbnailCanvasStore } from '../model/thumbnailCanvasStore'
import { Thumbnail, activeGrid } from './CatalogThumbnail'

type Tab = 'store' | 'upload'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const EMPTY_DRAG_IMAGE =
    typeof Image !== 'undefined'
        ? Object.assign(new Image(), {
            src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        })
        : undefined

export function CatalogPopover({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [tab] = useState<Tab>('store')
    const gridRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        CATALOG.forEach((item) => useGLTF.preload(item.url))
    }, [])

    const registerGrid = useCallback((el: HTMLDivElement | null) => {
        const setActive = useThumbnailCanvasStore.getState().setActive
        if (el) {
            activeGrid.current = el
            setActive(true)
        } else if (activeGrid.current === gridRef.current) {
            activeGrid.current = null
            setActive(false)
        }
        gridRef.current = el
    }, [])

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>

            <PopoverContent
                asChild
                side="top"
                align="start"
                sideOffset={12}
                className=" p-0 shadow-none flex max-h-[70vh] w-50 flex-col overflow-hidden rounded-3xl border border-white/10  text-slate-900  bg-neutral-200/80"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    style={{ transformOrigin: 'var(--radix-popover-content-transform-origin)' }}
                    className=" "
                >


                    {/* <div className="mx-4 mt-3 flex rounded-full bg-slate-900/10 p-1 text-sm">
                        <TabButton active={tab === 'store'} onClick={() => setTab('store')}>
                            Store
                        </TabButton>
                        <TabButton active={tab === 'upload'} onClick={() => setTab('upload')}>
                            Upload
                        </TabButton>
                    </div> */}

                    {tab === 'store' ? (
                        <div
                            ref={registerGrid}
                            className="grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto p-3 no-scrollbar"
                        >
                            {CATALOG.map((item) => (
                                <CatalogCard key={item.id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-slate-500">
                            Import de modèles bientôt disponible.
                        </div>
                    )}


                </motion.div>
            </PopoverContent>
        </Popover>
    )
}

function CatalogCard({ item }: { item: CatalogItem }) {
    const onDragStart = (event: DragEvent<HTMLButtonElement>) => {
        event.dataTransfer.setData(DRAG_MIME, item.id)
        event.dataTransfer.effectAllowed = 'copy'
        useGLTF.preload(item.url)
        if (EMPTY_DRAG_IMAGE) event.dataTransfer.setDragImage(EMPTY_DRAG_IMAGE, 0, 0)
        useDragPreviewStore.getState().start(item.id, event.clientX, event.clientY)
    }

    return (
        <button
            type="button"
            draggable
            onDragStart={onDragStart}
            title={item.name}
            data-cuelume-hover="bloom"
            className="group flex aspect-square w-5/5 cursor-grab flex-col items-center justify-between gap-1 rounded-2xl border border-slate-900/10 bg-white/40 p-2 transition-colors hover:border-cyan-500/50 hover:bg-cyan-300/20 active:cursor-grabbing"
        >
            <div className="pointer-events-none min-h-0 w-full flex-1">
                <Thumbnail url={item.url} />
            </div>
            {/* <span className="line-clamp-2 text-center text-[11px] leading-tight text-slate-600">
                {item.name}
            </span> */}
        </button>
    )
}
