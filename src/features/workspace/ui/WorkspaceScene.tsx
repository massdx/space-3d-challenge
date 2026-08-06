import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { DragEvent } from 'react'
import { Raycaster, Vector2, Vector3 } from 'three'
import { CATALOG } from '../../catalog/model/catalog'
import { DRAG_MIME, useCatalogStore } from '../../catalog/model/catalogStore'
import { PlacedFurniture } from '../../catalog/ui/PlacedFurniture'
import { RoomShell } from '../../room/ui/RoomShell'
import { FLOOR_Y, clampFloor, floorPlane } from '../model/floor'
import { useViewportStore, type OrbitLike } from '../model/viewportStore'
import { useWorkspaceStore } from '../model/workspaceStore'

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

        const hit = raycaster.ray.intersectPlane(floorPlane, new Vector3())
        if (!hit) return

        place(modelId, [clampFloor(hit.x), FLOOR_Y, clampFloor(hit.z)])
    }

    return (
        <Canvas
            camera={{ position: [11, 8.2, 11], fov: 34 }}
            shadows
            dpr={[1, 1.5]}
            gl={{ alpha: true, preserveDrawingBuffer: true }}
            style={{ background: 'transparent' }}
            onCreated={({ gl, camera }) => {
                setRenderer(gl)
                setCamera(camera)
            }}
            onPointerMissed={() => select(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDrop}
        >
            <Environment preset="studio" />

            <ambientLight intensity={isNight ? 0.62 : 0.78} />
            <hemisphereLight args={['#f5f7fa', '#d9dde3', 0.35]} />
            <directionalLight
                castShadow
                intensity={isNight ? 1.1 : 1.4}
                position={[9, 11, 8]}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
            />
            <spotLight
                castShadow
                position={[0.2, 7.5, 0.2]}
                angle={0.62}
                penumbra={0.5}
                intensity={isNight ? 15 : 12}
                distance={24}
                decay={1.6}
                color="#fff7ed"
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
                resolution={1024}
                color="#8a8f99"
            />

            <OrbitControls
                ref={(instance) => setControls(instance as unknown as OrbitLike | null)}
                makeDefault
                enableDamping
                minDistance={4.5}
                maxDistance={24}
                minPolarAngle={0.85}
                maxPolarAngle={1.08}
                minAzimuthAngle={Math.PI / 6}
                maxAzimuthAngle={Math.PI / 1.6}
                target={[-1.9, 1.7, -1.9]}
            />

            {/* <EffectComposer>
                <Bloom
                    mipmapBlur
                    intensity={1}
                    luminanceThreshold={0.1}
                    luminanceSmoothing={5}
                />
            </EffectComposer> */}
        </Canvas>
    )
}