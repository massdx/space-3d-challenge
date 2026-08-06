import type { ThreeEvent } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import { Raycaster } from 'three'
import { useViewportStore } from '../../workspace/model/viewportStore'
import { CATALOG_BY_ID } from '../model/catalog'
import { useCatalogStore } from '../model/catalogStore'
import { resolveDropPosition } from '../model/dropTarget'
import { registerPlaced } from '../model/placedRegistry'
import { FurnitureModel } from './FurnitureModel'

const dragRaycaster = new Raycaster()
const ROTATE_SPEED = 0.01
const SCALE_SPEED = 0.005

export function PlacedFurniture() {
    const items = useCatalogStore((state) => state.items)
    const selectedId = useCatalogStore((state) => state.selectedId)
    const select = useCatalogStore((state) => state.select)
    const moveTo = useCatalogStore((state) => state.moveTo)
    const rotateBy = useCatalogStore((state) => state.rotateBy)
    const scaleBy = useCatalogStore((state) => state.scaleBy)

    const draggingId = useRef<string | null>(null)
    const transformId = useRef<string | null>(null)
    const lastX = useRef(0)
    const grabOffset = useRef<[number, number]>([0, 0])
    const activeKey = useRef<'r' | 's' | null>(null)

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase()
            if (key === 'r') activeKey.current = 'r'
            else if (key === 's') activeKey.current = 's'
        }
        const onKeyUp = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase()
            if (key === activeKey.current) activeKey.current = null
        }
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
        }
    }, [])

    const setOrbitEnabled = (enabled: boolean) => {
        const controls = useViewportStore.getState().controls
        if (controls) controls.enabled = enabled
    }

    return (
        <group>
            {items.map((item) => {
                const model = CATALOG_BY_ID[item.modelId]
                if (!model) return null

                const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
                    event.stopPropagation()
                    select(item.id)
                        ; (event.target as Element).setPointerCapture(event.pointerId)
                    setOrbitEnabled(false)
                    if (activeKey.current) {
                        transformId.current = item.id
                        lastX.current = event.nativeEvent.clientX
                        return
                    }
                    dragRaycaster.ray.copy(event.ray)
                    const hit = resolveDropPosition(dragRaycaster, item.id)
                    grabOffset.current = hit
                        ? [item.position[0] - hit[0], item.position[2] - hit[2]]
                        : [0, 0]
                    draggingId.current = item.id
                }

                const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
                    if (transformId.current === item.id) {
                        event.stopPropagation()
                        const x = event.nativeEvent.clientX
                        const deltaX = x - lastX.current
                        lastX.current = x
                        if (activeKey.current === 's') scaleBy(item.id, 1 + deltaX * SCALE_SPEED)
                        else rotateBy(item.id, deltaX * ROTATE_SPEED)
                        return
                    }
                    if (draggingId.current !== item.id) return
                    event.stopPropagation()
                    dragRaycaster.ray.copy(event.ray)
                    const next = resolveDropPosition(dragRaycaster, item.id)
                    if (next) {
                        const [offsetX, offsetZ] = grabOffset.current
                        moveTo(item.id, [next[0] + offsetX, next[1], next[2] + offsetZ])
                    }
                }

                const onPointerUp = (event: ThreeEvent<PointerEvent>) => {
                    if (transformId.current === item.id) {
                        transformId.current = null
                            ; (event.target as Element).releasePointerCapture(event.pointerId)
                        setOrbitEnabled(true)
                        return
                    }
                    if (draggingId.current !== item.id) return
                    draggingId.current = null
                        ; (event.target as Element).releasePointerCapture(event.pointerId)
                    setOrbitEnabled(true)
                }

                return (
                    <group
                        key={item.id}
                        ref={(node) => registerPlaced(item.id, node)}
                        position={item.position}
                        rotation={[0, item.rotationY, 0]}
                        scale={item.scale}
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                    >
                        <Suspense fallback={null}>
                            <FurnitureModel url={model.url} targetSize={model.targetSize} />
                        </Suspense>

                        {selectedId === item.id && (
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                                <ringGeometry args={[model.targetSize * 0.55, model.targetSize * 0.62, 48]} />
                                <meshBasicMaterial color="#22d3ee" transparent opacity={0.9} />
                            </mesh>
                        )}
                    </group>
                )
            })}
        </group>
    )
}
