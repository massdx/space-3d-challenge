import {
    ArrowTurnBackwardIcon,
    ArrowTurnForwardIcon,
    BackgroundIcon,
    Cancel01Icon,
    FullScreenIcon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AnimatePresence, motion } from 'motion/react'
import Button from '../../../components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip'
import { useCatalogStore } from '../../catalog/model/catalogStore'
import { CatalogPopover } from '../../catalog/ui/CatalogPanel'
import { useViewportStore } from '../model/viewportStore'
import { useWorkspaceStore } from '../model/workspaceStore'
import { TexturePopover } from './TexturePopover'

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


    const undo = useCatalogStore((state) => state.undo)
    const redo = useCatalogStore((state) => state.redo)
    const canUndo = useCatalogStore((state) => state.past.length > 0)
    const canRedo = useCatalogStore((state) => state.future.length > 0)
    const historyStarted = canUndo || canRedo

    const selectedSurface = useWorkspaceStore((state) => state.selectedSurface)
    const selectSurface = useWorkspaceStore((state) => state.selectSurface)
    const setSurfaceColor = useWorkspaceStore((state) => state.setSurfaceColor)

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <TooltipProvider delayDuration={200}>
                <motion.div
                    className="pointer-events-auto absolute bottom-0 left-0 flex flex-col gap-2 p-4 sm:p-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
                    }}
                >
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 16, scale: 0.9, filter: 'blur(4px)' },
                            visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
                        }}
                        transition={{ type: 'spring', bounce: 0.35, duration: 0.6 }}
                    >
                        <CatalogPopover>
                            <Button title='Furnitures' shape='circle' className='w-35 h-35'>
                                <img src="/assets/furniture.png" alt="Camera" className="w-25 h-auto object-contain" />
                            </Button>
                        </CatalogPopover>                </motion.div>

                    <motion.div
                        className="space-x-3"
                        variants={{
                            visible: { transition: { staggerChildren: 0.06 } },
                        }}
                    >
                        <motion.span
                            className="inline-block"
                            variants={{
                                hidden: { opacity: 0, y: 12, scale: 0.9, filter: 'blur(4px)' },
                                visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
                            }}
                            transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button shape='circle' size='lg' className='' onClick={() => zoomBy(1.18)} >

                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M17 17L21 21"></path>
                                            <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"></path>
                                            <path d="M7.5 11L14.5 11"></path>
                                        </svg>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Zoom in</TooltipContent>
                            </Tooltip>
                        </motion.span>

                        <motion.span
                            className="inline-block"
                            variants={{
                                hidden: { opacity: 0, y: 12, scale: 0.9, filter: 'blur(4px)' },
                                visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
                            }}
                            transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button shape='circle' size='lg' className='' onClick={() => zoomBy(0.85)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="currentColor" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M17 17L21 21"></path>
                                            <path d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"></path>
                                            <path d="M7.5 11L14.5 11M11 7.5V14.5"></path>
                                        </svg>

                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Zoom out</TooltipContent>
                            </Tooltip>
                        </motion.span>
                        <motion.span
                            className="inline-block"
                            variants={{
                                hidden: { opacity: 0, y: 12, scale: 0.9, filter: 'blur(4px)' },
                                visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
                            }}
                            transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button shape='circle' size='lg' className='' onClick={resetCamera}  >
                                        <HugeiconsIcon icon={FullScreenIcon} size={20} strokeWidth={1.8} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Reset view</TooltipContent>
                            </Tooltip>
                        </motion.span>
                    </motion.div>



                </motion.div>

                <div className="pointer-events-none absolute p-4 sm:p-6 bottom-0 right-0 left-0 flex justify-center">
                    <AnimatePresence>
                        {historyStarted && (
                            <motion.div
                                initial={{ opacity: 0, y: 12, scale: 0.9, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: 12, scale: 0.9, filter: 'blur(4px)' }}
                                transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
                                className="pointer-events-auto space-x-3"
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button disabled={!canUndo} onClick={() => undo()}>
                                            <HugeiconsIcon icon={ArrowTurnBackwardIcon} size={20} strokeWidth={1.8} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Undo</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button disabled={!canRedo} onClick={() => redo()}>
                                            <HugeiconsIcon icon={ArrowTurnForwardIcon} size={20} strokeWidth={1.8} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Redo</TooltipContent>
                                </Tooltip>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pointer-events-auto absolute bottom-0 right-0 flex flex-col items-end gap-2 p-4 sm:p-6">
                    <AnimatePresence>
                        {selectedSurface && (
                            <motion.div
                                className="flex flex-col items-end gap-2"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                    transition={{ type: 'spring', bounce: 0.35, duration: 0.5, delay: 0.12 }}
                                >
                                    <TexturePopover>
                                        <Button className='translate-y-4' shape='circle' size='xl'>
                                            <HugeiconsIcon icon={BackgroundIcon} size={25} strokeWidth={1.8} />
                                        </Button>
                                    </TexturePopover>                            </motion.div>

                                <div className="space-x-6 flex justify-end items-end ">
                                    <motion.div
                                        className="grid grid-cols-5 gap-2"
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={{
                                            visible: { transition: { staggerChildren: 0.01 } },
                                            hidden: { transition: { staggerChildren: 0.01, staggerDirection: -1 } },
                                        }}
                                    >
                                        {BACKGROUND_COLORS.map((color, index) => (
                                            <motion.div
                                                key={index}
                                                variants={{
                                                    hidden: { opacity: 0, x: 10, filter: 'blur(4px)' },
                                                    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
                                                }}
                                                transition={{ type: 'spring', bounce: 0.35, duration: 0.3 }}
                                            >
                                                <Button
                                                    shape="circle"
                                                    size="sm"
                                                    className="border-white/40"
                                                    style={{ background: color }}
                                                    onClick={() =>
                                                        color.startsWith('#') &&
                                                        setSurfaceColor(selectedSurface, color)
                                                    }
                                                />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                        transition={{ type: 'spring', bounce: 0.35, duration: 0.5 }}
                                    >
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button shape='circle' size='lg' className='mr-2 ' onClick={() => selectSurface(null)} >
                                                    <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.8} />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Close</TooltipContent>
                                        </Tooltip>
                                    </motion.div>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </TooltipProvider>
        </div>
    )
}
