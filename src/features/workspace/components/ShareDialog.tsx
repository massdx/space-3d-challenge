import { Cancel01Icon, Copy01Icon, Download04Icon, Tick02Icon, Upload04Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import Button from '../../../components/ui/button'
import { useCatalogStore } from '../../catalog/model/catalogStore'
import {
    buildShareUrl,
    encodeScene,
    exportSceneJson,
    importSceneJson,
} from '../../catalog/model/sceneShare'

type Feedback = { tone: 'ok' | 'error'; text: string } | null

export function ShareDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const items = useCatalogStore((state) => state.items)
    const loadItems = useCatalogStore((state) => state.loadItems)
    const [copied, setCopied] = useState(false)
    const [feedback, setFeedback] = useState<Feedback>(null)
    const fileInput = useRef<HTMLInputElement | null>(null)

    const sceneItems = items.map((item) => ({
        modelId: item.modelId,
        position: item.position,
        rotationY: item.rotationY,
        scale: item.scale,
        locked: item.locked,
    }))

    const copyLink = async () => {
        const code = await encodeScene(sceneItems)
        const url = buildShareUrl(code)
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1500)
        } catch {
            setFeedback({ tone: 'error', text: 'Copie bloquée — sélectionne et copie le lien manuellement.' })
        }
    }

    const exportJson = () => {
        const blob = new Blob([exportSceneJson(sceneItems)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'space-scene.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    const onImportFile = async (file: File) => {
        const text = await file.text()
        const parsed = importSceneJson(text)
        if (!parsed) {
            setFeedback({ tone: 'error', text: 'Fichier invalide.' })
            return
        }
        loadItems(parsed)
        setFeedback({ tone: 'ok', text: `${parsed.length} élément(s) importé(s).` })
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        ease: 'easeInOut'
                    }}
                >
                    <div className="absolute inset-0 bg-neutral-600/80 backdrop-blur-sm" onClick={onClose} />
                    <motion.div
                        className="relative w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-2xl"
                        initial={{ opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20, }}
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg instrument-serif-regular font-semibold">Partager la scène</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className="grid h-8 w-8 place-items-center rounded-full text-neutral-500 hover:bg-neutral-100"
                            >
                                <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
                            </button>
                        </div>


                        <div className="mt-5 space-y-3">
                            <Button className="w-full" onClick={copyLink}>
                                <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} size={18} strokeWidth={1.8} />
                                <span>{copied ? 'Lien copié' : 'Copier le lien de partage'}</span>
                            </Button>

                            {/* {link && (
                                <input
                                    readOnly
                                    value={link}
                                    onFocus={(e) => e.currentTarget.select()}
                                    className="w-full truncate rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600 outline-none focus:ring-2 focus:ring-neutral-300"
                                />
                            )} */}

                            <div className="flex gap-2">
                                <Button className="flex-1" variant="outline" onClick={exportJson}>
                                    <HugeiconsIcon icon={Download04Icon} size={18} strokeWidth={1.8} />
                                    <span>Export JSON</span>
                                </Button>
                                <Button
                                    className="flex-1"
                                    variant="outline"
                                    onClick={() => fileInput.current?.click()}
                                >
                                    <HugeiconsIcon icon={Upload04Icon} size={18} strokeWidth={1.8} />
                                    <span>Import JSON</span>
                                </Button>
                            </div>

                            <input
                                ref={fileInput}
                                type="file"
                                accept="application/json,.json"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) onImportFile(file)
                                    e.target.value = ''
                                }}
                            />
                        </div>

                        {feedback && (
                            <p
                                className={`mt-4 text-sm ${feedback.tone === 'error' ? 'text-red-500' : 'text-emerald-600'
                                    }`}
                            >
                                {feedback.text}
                            </p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
