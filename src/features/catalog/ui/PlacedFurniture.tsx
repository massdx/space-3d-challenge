import type { ThreeEvent } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { Vector3 } from 'three'
import { clampFloor, FLOOR_Y, floorPlane } from '../../workspace/model/floor'
import { useViewportStore } from '../../workspace/model/viewportStore'
import { CATALOG_BY_ID } from '../model/catalog'
import { useCatalogStore } from '../model/catalogStore'
import { FurnitureModel } from './FurnitureModel'

const dragHit = new Vector3()

export function PlacedFurniture() {
    const items = useCatalogStore((state) => state.items)
    const selectedId = useCatalogStore((state) => state.selectedId)
    const select = useCatalogStore((state) => state.select)
    const moveTo = useCatalogStore((state) => state.moveTo)

    const draggingId = useRef<string | null>(null)

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
                    draggingId.current = item.id
                        ; (event.target as Element).setPointerCapture(event.pointerId)
                    setOrbitEnabled(false)
                }

                const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
                    if (draggingId.current !== item.id) return
                    event.stopPropagation()
                    const hit = event.ray.intersectPlane(floorPlane, dragHit)
                    if (!hit) return
                    moveTo(item.id, [clampFloor(hit.x), FLOOR_Y, clampFloor(hit.z)])
                }

                const onPointerUp = (event: ThreeEvent<PointerEvent>) => {
                    if (draggingId.current !== item.id) return
                    draggingId.current = null
                        ; (event.target as Element).releasePointerCapture(event.pointerId)
                    setOrbitEnabled(true)
                }

                return (
                    <group
                        key={item.id}
                        position={item.position}
                        rotation={[0, item.rotationY, 0]}
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
