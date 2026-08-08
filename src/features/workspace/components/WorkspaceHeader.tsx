import { Camera01Icon, HelpCircleIcon, LinkBackwardIcon, Settings01Icon, VolumeHighIcon, VolumeOffIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import Button from '../../../components/ui/button'
import { useHelpStore } from '../model/helpStore'
import { useViewportStore } from '../model/viewportStore'
import { ShareDialog } from './ShareDialog'
import { SettingsPopover } from './WorkspaceSettings'

const itemVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.9, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
}

const itemTransition = { type: 'spring', bounce: 0.35, duration: 0.4 } as const

export function WorkspaceHeader() {
    const screenshot = useViewportStore((state) => state.screenshot)
    const toggleHelp = useHelpStore((state) => state.toggle)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [musicPlaying, setMusicPlaying] = useState(false)
    const [shareOpen, setShareOpen] = useState(false)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const play = () =>
            audio
                .play()
                .then(() => setMusicPlaying(true))
                .catch(() => setMusicPlaying(false))

        play()

        // Autoplay avec son est bloqué tant que l'utilisateur n'a pas interagi : on relance au 1er geste.
        const startOnGesture = () => {
            play()
            window.removeEventListener('pointerdown', startOnGesture)
            window.removeEventListener('keydown', startOnGesture)
        }
        window.addEventListener('pointerdown', startOnGesture)
        window.addEventListener('keydown', startOnGesture)

        return () => {
            window.removeEventListener('pointerdown', startOnGesture)
            window.removeEventListener('keydown', startOnGesture)
        }
    }, [])

    const toggleMusic = () => {
        const audio = audioRef.current
        if (!audio) return
        if (musicPlaying) {
            audio.pause()
            setMusicPlaying(false)
        } else {
            audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false))
        }
    }

    return (
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-6">
            <audio ref={audioRef} src="/audio/lofi.webm" loop />
            <div>
                <h1 className="text-3xl text-neutral-900  font-bold instrument-serif-regular">Descraft</h1>
                <p>
                    <span className="text-sm text-neutral-700">A 3D space for your ideas</span>
                </p>
                {/* <p className="text-sm mix-blend-difference text-neutral-700">by <a href="https://descraft.xyz" target="_blank" rel="noopener noreferrer" className="underline">MassHDX</a></p> */}
                <p className="text-sm text-neutral-700"><a href="https://github.com/descraft" target="_blank" rel="noopener noreferrer" className="underline"> GitHub</a></p>
                {/* <input placeholder='File name' value={"Test micro"} className="border text-xl border-none  focus-within:ring-2 ring-neutral-700 outline-none  text-neutral-900 px-3 font-medium  h-12 rounded-xl  py-1" /> */}
            </div>
            <motion.div
                className="space-x-2 "
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
                }}
            >
                <motion.span className="inline-block" variants={itemVariants} transition={itemTransition}>
                    <Button onClick={toggleMusic}>
                        <HugeiconsIcon icon={musicPlaying ? VolumeHighIcon : VolumeOffIcon} size={20} strokeWidth={1.8} />
                    </Button>
                </motion.span>
                <motion.span className="inline-block" variants={itemVariants} transition={itemTransition}>
                    <Button onClick={() => screenshot()}>
                        <HugeiconsIcon icon={Camera01Icon} size={20} strokeWidth={1.8} />
                    </Button>
                </motion.span>
                <motion.span className="inline-block" variants={itemVariants} transition={itemTransition}>
                    <SettingsPopover>
                        <Button>
                            <HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={1.8} />
                        </Button>
                    </SettingsPopover>
                </motion.span>
                <motion.span className="inline-block" variants={itemVariants} transition={itemTransition}>
                    <Button onClick={() => toggleHelp()}>
                        <HugeiconsIcon icon={HelpCircleIcon} size={20} strokeWidth={1.8} />
                    </Button>
                </motion.span>
                <motion.span className="inline-block" variants={itemVariants} transition={itemTransition}>
                    <Button onClick={() => setShareOpen(true)}>
                        <HugeiconsIcon icon={LinkBackwardIcon} size={20} className='' strokeWidth={1.8} />
                        <span>
                            Share or Export
                        </span>
                    </Button>
                </motion.span>
            </motion.div>
            <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} />
        </div>
    )
}