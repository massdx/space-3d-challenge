import { PerspectiveCamera, View, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, type RefObject } from 'react'
import { Box3, Mesh, Vector3 } from 'three'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'

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
            <primitive object={object} position={offset} />
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

export function ThumbnailCanvas({ trackRef }: { trackRef: RefObject<HTMLElement | null> }) {
    return (
        <Canvas
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 30 }}
            eventSource={trackRef as RefObject<HTMLElement>}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
        >
            <View.Port />
        </Canvas>
    )
}
