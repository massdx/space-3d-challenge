import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { DragEvent } from 'react'
import { Raycaster, Vector2 } from 'three'
import { CATALOG, CATALOG_BY_ID } from '../../catalog/model/catalog'
import { DRAG_MIME, useCatalogStore } from '../../catalog/model/catalogStore'
import { resolveDropPosition } from '../../catalog/model/dropTarget'
import { getFootprint } from '../../catalog/model/footprint'
import { resolveWallHit, wallPlacement } from '../../catalog/model/wallPlacement'
import { PlacedFurniture } from '../../catalog/ui/PlacedFurniture'
import { RoomShell } from '../../room/ui/RoomShell'
import { clampToRoom } from '../model/floor'
import { useViewportStore, type OrbitLike } from '../model/viewportStore'
import { useWorkspaceStore } from '../model/workspaceStore'
import { AZ_STRETCH, CameraController, HARD_MAX_AZ, HARD_MIN_AZ } from './CameraController'

const raycaster = new Raycaster()
const pointer = new Vector2()

export function WorkspaceScene() {
    const environmentPreset = useWorkspaceStore((state) => state.environmentPreset)
    const isNight = environmentPreset === 'night'

    const setControls = useViewportStore((state) => state.setControls)
    const setRenderer = useViewportStore((state) => state.setRenderer)
    const setCamera = useViewportStore((state) => state.setCamera)

    const place = useCatalogStore((state) => state.place)
    const select = useCatalogStore((state) => state.select)
    const selectSurface = useWorkspaceStore((state) => state.selectSurface)

    const clearSelection = () => {
        select(null)
        selectSurface(null)
    }

    const onDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        const modelId = event.dataTransfer.getData(DRAG_MIME)
        if (!CATALOG.some((item) => item.id === modelId)) return

        const { camera, renderer } = useViewportStore.getState()
        if (!camera || !renderer) return

        const rect = renderer.domElement.getBoundingClientRect()
        pointer.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1,
        )
        raycaster.setFromCamera(pointer, camera)

        const model = CATALOG_BY_ID[modelId]
        if (model.placement === 'wall') {
            const footprint = getFootprint(model.url)
            const hit = resolveWallHit(raycaster)
            if (footprint && hit) {
                const { position, rotationY } = wallPlacement(hit, footprint, 1)
                place(modelId, position, rotationY)
                return
            }
            // Empreinte pas encore connue (1er dépôt) : on pose au sol, l'objet se glisse ensuite sur le mur.
        }

        const position = resolveDropPosition(raycaster)
        if (!position) return

        const radius = (CATALOG_BY_ID[modelId].targetSize) / 2
        const [x, z] = clampToRoom(position[0], position[2], radius)
        place(modelId, [x, position[1], z])
    }

    return (
        <Canvas
            camera={{ position: [11, 8.2, 11], fov: 34 }}
            shadows
            dpr={[1, 1.25]}
            frameloop="demand"
            gl={{ alpha: true, preserveDrawingBuffer: true }}
            style={{ background: 'transparent' }}
            onCreated={({ gl, camera }) => {
                setRenderer(gl)
                setCamera(camera)
            }}
            onPointerMissed={() => {
                clearSelection()
            }}
            onDragOver={(event) => event.preventDefault()}
            onContextMenu={(event) => event.preventDefault()}
            onDrop={onDrop}
        >
            <Environment preset="apartment" environmentIntensity={isNight ? 0.52 : 0.90} />

            <ambientLight intensity={isNight ? 0.1 : 0.18} color="#ffe6cc" />
            <hemisphereLight args={['#ffe9d2', '#2b2824', 0.22]} />
            <directionalLight
                castShadow
                intensity={isNight ? 0.18 : 0.4}
                position={[20, 50, 6]}
                color="#ffe4c0"
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0001}
            />
            <spotLight
                position={[1.4, 6.2, 1.4]}
                angle={0.7}
                penumbra={0.85}
                intensity={isNight ? 24 : 17}
                distance={22}
                decay={1.7}
                color="#ffd39a"
                target-position={[0, 0, 0]}
            />

            <RoomShell night={isNight} />

            <PlacedFurniture />

            <ContactShadows
                position={[0, 0.68, 0]}
                scale={18}
                far={4}
                blur={3.5}
                opacity={0.22}
                resolution={512}
                color="#8a8f99"
            />

            <OrbitControls
                ref={(instance) => setControls(instance as unknown as OrbitLike | null)}
                makeDefault
                enableDamping
                minDistance={4.5}
                maxDistance={24}
                minPolarAngle={0.55}
                maxPolarAngle={1.08}
                minAzimuthAngle={HARD_MIN_AZ - AZ_STRETCH}
                maxAzimuthAngle={HARD_MAX_AZ + AZ_STRETCH}
                target={[-1.9, 1.7, -1.9]}
                onStart={clearSelection}
            />

            <CameraController />
        </Canvas>
    )
}