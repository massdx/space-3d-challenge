import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { Box3, Mesh, Vector3 } from 'three'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'

type FurnitureModelProps = {
    url: string
    targetSize: number
}

export function FurnitureModel({ url, targetSize }: FurnitureModelProps) {
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
            scale: targetSize / maxDim,
            offset: [-center.x, -box.min.y, -center.z] as [number, number, number],
        }
    }, [object, targetSize])

    useEffect(() => {
        object.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true
                child.receiveShadow = true
            }
        })
    }, [object])

    return (
        <group scale={scale}>
            <primitive object={object} position={offset} />
        </group>
    )
}
