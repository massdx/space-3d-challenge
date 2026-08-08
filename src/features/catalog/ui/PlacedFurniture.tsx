import type { ThreeEvent } from '@react-three/fiber'
import { useThree } from '@react-three/fiber'
import { play } from 'cuelume'
import { Suspense, useEffect, useRef } from 'react'
import { Raycaster } from 'three'
import { clampToRoom, WALL_OVERLAP } from '../../workspace/model/floor'
import { useToolWheelStore } from '../../workspace/model/toolWheelStore'
import { useViewportStore } from '../../workspace/model/viewportStore'
import { useWorkspaceStore } from '../../workspace/model/workspaceStore'
import { CATALOG_BY_ID } from '../model/catalog'
import { useCatalogStore } from '../model/catalogStore'
import { resolveDropPosition } from '../model/dropTarget'
import { getFootprint, rotatedExtents } from '../model/footprint'
import { registerPlaced } from '../model/placedRegistry'
import { resolveWallHit, wallPlacement } from '../model/wallPlacement'
import { FurnitureModel } from './FurnitureModel'

const dragRaycaster = new Raycaster()
const ROTATE_SPEED = 0.01
const SCALE_SPEED = 0.005
const LONG_PRESS_MS = 350
const MOVE_CANCEL_PX = 8

export function PlacedFurniture() {
    const items = useCatalogStore((state) => state.items)
    const selectedId = useCatalogStore((state) => state.selectedId)
    const select = useCatalogStore((state) => state.select)
    const moveTo = useCatalogStore((state) => state.moveTo)
    const rotateBy = useCatalogStore((state) => state.rotateBy)
    const setRotationY = useCatalogStore((state) => state.setRotationY)
    const scaleBy = useCatalogStore((state) => state.scaleBy)
    const beginHistory = useCatalogStore((state) => state.beginHistory)
    const selectSurface = useWorkspaceStore((state) => state.selectSurface)
    const openWheel = useToolWheelStore((state) => state.openAt)
    const invalidate = useThree((state) => state.invalidate)

    const draggingId = useRef<string | null>(null)
    const transformId = useRef<string | null>(null)
    const lastX = useRef(0)
    const grabOffset = useRef<[number, number]>([0, 0])
    const activeKey = useRef<'r' | 's' | null>(null)
    const pressTimer = useRef<number | null>(null)
    const pressStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
    const lockedErrored = useRef(false)
    const gestureSnapshot = useRef(false)

    const clearPress = () => {
        if (pressTimer.current !== null) {
            clearTimeout(pressTimer.current)
            pressTimer.current = null
        }
    }

    useEffect(() => {
        invalidate()
    }, [items, invalidate])

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
                    selectSurface(null)
                    const el = event.target as Element
                    el.setPointerCapture(event.pointerId)
                    setOrbitEnabled(false)

                    pressStart.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY }
                    lockedErrored.current = false
                    gestureSnapshot.current = false
                    clearPress()
                    pressTimer.current = window.setTimeout(() => {
                        pressTimer.current = null
                        draggingId.current = null
                        transformId.current = null
                        try {
                            el.releasePointerCapture(event.pointerId)
                        } catch {
                            // capture peut déjà être relâchée
                        }
                        setOrbitEnabled(true)
                        openWheel(pressStart.current.x, pressStart.current.y, {
                            kind: 'furniture',
                            id: item.id,
                        })
                    }, LONG_PRESS_MS)

                    if (item.locked) return
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
                    if (pressTimer.current !== null) {
                        const dx = event.nativeEvent.clientX - pressStart.current.x
                        const dy = event.nativeEvent.clientY - pressStart.current.y
                        if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) clearPress()
                    }
                    if (item.locked) {
                        const dx = event.nativeEvent.clientX - pressStart.current.x
                        const dy = event.nativeEvent.clientY - pressStart.current.y
                        if (Math.hypot(dx, dy) > MOVE_CANCEL_PX && !lockedErrored.current) {
                            lockedErrored.current = true
                            play('error')
                        }
                        return
                    }
                    if (transformId.current === item.id) {
                        event.stopPropagation()
                        const x = event.nativeEvent.clientX
                        const deltaX = x - lastX.current
                        lastX.current = x
                        if (deltaX !== 0 && !gestureSnapshot.current) {
                            beginHistory()
                            gestureSnapshot.current = true
                        }
                        if (activeKey.current === 's') scaleBy(item.id, 1 + deltaX * SCALE_SPEED)
                        else rotateBy(item.id, deltaX * ROTATE_SPEED)
                        return
                    }
                    if (draggingId.current !== item.id) return
                    event.stopPropagation()
                    dragRaycaster.ray.copy(event.ray)

                    if (model.placement === 'wall') {
                        const footprint = getFootprint(model.url)
                        const hit = resolveWallHit(dragRaycaster)
                        if (hit && footprint) {
                            const { position, rotationY } = wallPlacement(hit, footprint, item.scale)
                            if (!gestureSnapshot.current) {
                                beginHistory()
                                gestureSnapshot.current = true
                            }
                            moveTo(item.id, position)
                            setRotationY(item.id, rotationY)
                        }
                        return
                    }

                    const next = resolveDropPosition(dragRaycaster, item.id)
                    if (next) {
                        const [offsetX, offsetZ] = grabOffset.current
                        const footprint = getFootprint(model.url)
                        let radiusX = (model.targetSize * item.scale) / 2
                        let radiusZ = radiusX
                        if (footprint) {
                            const { ex, ez } = rotatedExtents(footprint, item.rotationY, item.scale)
                            radiusX = ex
                            radiusZ = ez
                        }
                        const overlap = model.wallHug ? WALL_OVERLAP : 0
                        const [x, z] = clampToRoom(
                            next[0] + offsetX,
                            next[2] + offsetZ,
                            Math.max(0, radiusX - overlap),
                            Math.max(0, radiusZ - overlap),
                        )
                        if (!gestureSnapshot.current) {
                            beginHistory()
                            gestureSnapshot.current = true
                        }
                        moveTo(item.id, [x, next[1], z])
                    }
                }

                const onPointerUp = (event: ThreeEvent<PointerEvent>) => {
                    clearPress()
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

                        {(selectedId === item.id || item.locked) && (
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                                <ringGeometry args={[model.targetSize * 0.55, model.targetSize * 0.62, 48]} />
                                <meshBasicMaterial
                                    color={item.locked ? '#f59e0b' : '#22d3ee'}
                                    transparent
                                    opacity={0.9}
                                />
                            </mesh>
                        )}
                    </group>
                )
            })}
        </group>
    )
}
