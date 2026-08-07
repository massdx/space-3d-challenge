import {
    ArrowTurnBackwardIcon,
    ArrowTurnForwardIcon,
    BackgroundIcon,
    Cancel01Icon,
    Delete02Icon,
    FullScreenIcon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AnimatePresence, motion } from 'motion/react'
import Button from '../../../components/ui/button'
import { useCatalogStore } from '../../catalog/model/catalogStore'
import { CatalogPopover } from '../../catalog/ui/CatalogPanel'
import { useViewportStore } from '../model/viewportStore'
import { useWorkspaceStore } from '../model/workspaceStore'
import { TexturePopover } from './TexturePopover'

const EASE_OUT = [0.23, 1, 0.32, 1] as const

const BACKGROUND_COLORS = [
    '#111111',
    '#2f88ff',
    '#46c463',
    '#5661d6',
    '#b95fe3',
    '#ef2f63',
    '#f0942e',
    '#f5c518',
    '#9c8767',
    'conic-gradient(from 90deg, #ff004c, #ff8a00, #ffe600, #33d17a, #2f88ff, #8a3ffc, #ff004c)',
]

export function WorkspaceControls() {
    const zoomBy = useViewportStore((state) => state.zoomBy)
    const resetCamera = useViewportStore((state) => state.resetCamera)


    const selectedId = useCatalogStore((state) => state.selectedId)
    const remove = useCatalogStore((state) => state.remove)

    const selectedSurface = useWorkspaceStore((state) => state.selectedSurface)
    const selectSurface = useWorkspaceStore((state) => state.selectSurface)
    const setSurfaceColor = useWorkspaceStore((state) => state.setSurfaceColor)

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-6">
            <div className="pointer-events-auto flex flex-col gap-2">
                <CatalogPopover>
                    <Button shape='circle' className='w-35 h-35'>
                        <img src="/assets/furniture.png" alt="Camera" className="w-25 h-auto object-contain" />
                    </Button>
                </CatalogPopover>

                <div className="space-x-3">
                    <Button shape='circle' size='lg' className='' onClick={() => zoomBy(1.18)} >

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 17L21 21"></path>
                            <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"></path>
                            <path d="M7.5 11L14.5 11"></path>
                        </svg>
                    </Button>


                    <Button shape='circle' size='lg' className='' onClick={() => zoomBy(0.85)} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 17L21 21"></path>
                            <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"></path>
                            <path d="M7.5 11L14.5 11M11 7.5V14.5"></path>
                        </svg>

                    </Button>
                    <Button shape='circle' size='lg' className='' onClick={resetCamera}  >
                        <HugeiconsIcon icon={FullScreenIcon} size={20} strokeWidth={1.8} />
                    </Button>
                </div>



            </div>

            <div className="pointer-events-auto absolute p-4 sm:p-6 bottom-0 right-0 left-0 mx-auto translate-x-1/2 space-x-3">
                <Button >
                    <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={20} strokeWidth={1.8} />
                </Button>

                <Button >
                    <HugeiconsIcon icon={ArrowTurnForwardIcon} size={20} strokeWidth={1.8} />
                </Button>
            </div>

            <div className="pointer-events-auto flex flex-col items-end gap-2">
                <AnimatePresence>
                    {selectedSurface && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                            transition={{ duration: 0.2, ease: EASE_OUT }}
                            className="flex flex-col items-end gap-2"
                        >
                            <TexturePopover>
                                <Button className='translate-y-4' shape='circle' size='xl'>
                                    <HugeiconsIcon icon={BackgroundIcon} size={25} strokeWidth={1.8} />
                                </Button>
                            </TexturePopover>

                            <div className="space-x-6 flex justify-end items-end ">
                                <div className="grid grid-cols-5 gap-2">
                                    {BACKGROUND_COLORS.map((color, index) => (
                                        <Button
                                            key={index}
                                            shape="circle"
                                            size="sm"
                                            className="border-white/40"
                                            style={{ background: color }}
                                            onClick={() =>
                                                color.startsWith('#') &&
                                                setSurfaceColor(selectedSurface, color)
                                            }
                                        />
                                    ))}
                                </div>
                                <Button shape='circle' size='lg' className='mr-2 ' onClick={() => selectSurface(null)} >
                                    <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.8} />
                                </Button>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


                {selectedId && <Button className={"absolute right-0 -translate-y-20"} disabled={!selectedId}>
                    <HugeiconsIcon
                        onClick={() => selectedId && remove(selectedId)} icon={Delete02Icon} size={20} strokeWidth={1.8} />
                </Button>}
            </div>
        </div>
    )
}
