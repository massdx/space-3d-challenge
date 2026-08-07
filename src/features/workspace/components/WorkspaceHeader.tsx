import { Camera01Icon, HelpCircleIcon, LinkBackwardIcon, Settings01Icon, Sun02Icon, VolumeHighIcon, VolumeOffIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useRef, useState } from 'react'
import Button from '../../../components/ui/button'
import { useViewportStore } from '../model/viewportStore'
import { useWorkspaceStore } from '../model/workspaceStore'
import { SettingsPopover } from './WorkspaceSettings'

export function WorkspaceHeader() {
    const toggleEnvironment = useWorkspaceStore((state) => state.toggleEnvironment)
    const [, setOpen] = useState(false)
    const screenshot = useViewportStore((state) => state.screenshot)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [musicPlaying, setMusicPlaying] = useState(false)

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
                <input placeholder='File name' value={"Test micro"} className="border text-xl border-none  focus-within:ring-2 ring-neutral-700 outline-none  text-neutral-900 px-3 font-medium  h-12 rounded-xl  py-1" />
            </div>
            <div className="space-x-2 ">

                <Button onClick={toggleMusic}>
                    <HugeiconsIcon icon={musicPlaying ? VolumeHighIcon : VolumeOffIcon} size={20} strokeWidth={1.8} />
                </Button>
                <Button onClick={() => screenshot()}>
                    <HugeiconsIcon icon={Camera01Icon} size={20} strokeWidth={1.8} />
                </Button>
                <Button onClick={() => toggleEnvironment()}>
                    <HugeiconsIcon icon={Sun02Icon} size={20} strokeWidth={1.8} />
                </Button>
                <SettingsPopover>
                    <Button>
                        <HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={1.8} />
                    </Button>
                </SettingsPopover>
                <Button onClick={() => setOpen((value) => !value)}>
                    <HugeiconsIcon icon={HelpCircleIcon} size={20} strokeWidth={1.8} />
                </Button>
                <Button onClick={() => { }}>
                    <HugeiconsIcon icon={LinkBackwardIcon} size={20} className='' strokeWidth={1.8} />
                    <span>
                        Share or Export
                    </span>
                </Button>
            </div>
        </div>
    )
}