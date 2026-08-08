import { PerspectiveCamera, View, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Box3, Mesh, Vector3 } from 'three'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { CATALOG_BY_ID } from '../model/catalog'
import { useDragPreviewStore } from '../model/dragPreviewStore'
import { useThumbnailCanvasStore } from '../model/thumbnailCanvasStore'

function ThumbModel({ url }: { url: string }) {
    const { scene } = useGLTF(url)
    const object = useMemo(() => cloneSkeleton(scene), [scene])

    const { scale, offset } = useMemo(() => {
        const box = new Box3().setFromObject(object)
        const size = new Vector3()
        const center = new Vector3()
        box.getSize(size)
        box.getCenter(center)
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        return {
            scale: 2 / maxDim,
            offset: [-center.x, -center.y, -center.z] as [number, number, number],
        }
    }, [object])

    useEffect(() => {
        object.traverse((child) => {
            if (child instanceof Mesh) child.frustumCulled = false
        })
    }, [object])

    return (
        <group scale={scale}>
            <primitive object={object} position={offset} dispose={null} />
        </group>
    )
}

export function Thumbnail({ url }: { url: string }) {
    return (
        <View className="h-full w-full">
            <PerspectiveCamera
                makeDefault
                position={[2.6, 1.9, 2.8]}
                fov={35}
                onUpdate={(self) => self.lookAt(0, 0, 0)}
            />
            <ambientLight intensity={0.9} />
            <directionalLight position={[4, 6, 3]} intensity={1.6} />
            <directionalLight position={[-4, 2, -3]} intensity={0.5} />
            <Suspense fallback={null}>
                <ThumbModel url={url} />
            </Suspense>
        </View>
    )
}

export const activeGrid: { current: HTMLElement | null } = { current: null }

export function ThumbnailCanvas() {
    const wrapperRef = useRef<HTMLDivElement>(null)
    const active = useThumbnailCanvasStore((state) => state.active)

    useEffect(() => {
        const wrapper = wrapperRef.current
        if (!active) {
            if (wrapper) wrapper.style.clipPath = 'inset(50%)'
            return
        }
        let frame = 0
        const update = () => {
            const clip = activeGrid.current
            if (wrapper) {
                if (clip) {
                    const rect = clip.getBoundingClientRect()
                    const top = rect.top
                    const left = rect.left
                    const right = window.innerWidth - rect.right
                    const bottom = window.innerHeight - rect.bottom
                    wrapper.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`
                } else {
                    wrapper.style.clipPath = 'inset(50%)'
                }
            }
            frame = requestAnimationFrame(update)
        }
        frame = requestAnimationFrame(update)
        return () => cancelAnimationFrame(frame)
    }, [active])

    return createPortal(
        <div
            ref={wrapperRef}
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 60 }}
        >
            <Canvas
                style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                dpr={[1, 1.5]}
                frameloop={active ? 'always' : 'never'}
                gl={{ alpha: true, antialias: true }}
            >
                <View.Port />
            </Canvas>
        </div>,
        document.body,
    )
}

export function DragPreview() {
    const modelId = useDragPreviewStore((s) => s.modelId)
    const startX = useDragPreviewStore((s) => s.x)
    const startY = useDragPreviewStore((s) => s.y)
    const ref = useRef<HTMLDivElement>(null)
    const url = modelId ? CATALOG_BY_ID[modelId]?.url : null

    useEffect(() => {
        if (!modelId) return
        const onOver = (e: globalThis.DragEvent) => {
            const el = ref.current
            if (el) {
                el.style.left = `${e.clientX}px`
                el.style.top = `${e.clientY}px`
            }
        }
        const end = () => useDragPreviewStore.getState().end()
        document.addEventListener('dragover', onOver)
        document.addEventListener('dragend', end)
        document.addEventListener('drop', end)
        return () => {
            document.removeEventListener('dragover', onOver)
            document.removeEventListener('dragend', end)
            document.removeEventListener('drop', end)
        }
    }, [modelId])

    if (!url) return null

    return createPortal(
        <div
            ref={ref}
            style={{
                position: 'fixed',
                left: startX,
                top: startY,
                transform: 'translate(-50%, -60%)',
                width: 160,
                height: 160,
                pointerEvents: 'none',
                zIndex: 80,
            }}
        >
            <Canvas
                style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                dpr={[1, 1.5]}
                gl={{ alpha: true, antialias: true }}
            >
                <PerspectiveCamera
                    makeDefault
                    position={[2.6, 1.9, 2.8]}
                    fov={35}
                    onUpdate={(self) => self.lookAt(0, 0, 0)}
                />
                <ambientLight intensity={0.9} />
                <directionalLight position={[4, 6, 3]} intensity={1.6} />
                <directionalLight position={[-4, 2, -3]} intensity={0.5} />
                <Suspense fallback={null}>
                    <ThumbModel url={url} />
                </Suspense>
            </Canvas>
        </div>,
        document.body,
    )
}
