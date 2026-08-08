import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { Box3, Mesh, Vector3 } from 'three'
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { setFootprint } from '../model/footprint'

type FurnitureModelProps = {
    url: string
    targetSize: number
}

export function FurnitureModel({ url, targetSize }: FurnitureModelProps) {
    const { scene } = useGLTF(url)

    const object = useMemo(() => cloneSkeleton(scene), [scene])

    const { scale, offset, footprint } = useMemo(() => {
        const box = new Box3().setFromObject(object)
        const size = new Vector3()
        const center = new Vector3()
        box.getSize(size)
        box.getCenter(center)
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const s = targetSize / maxDim
        return {
            scale: s,
            offset: [-center.x, -box.min.y, -center.z] as [number, number, number],
            footprint: { hx: (size.x * s) / 2, hy: (size.y * s) / 2, hz: (size.z * s) / 2 },
        }
    }, [object, targetSize])

    useEffect(() => {
        setFootprint(url, footprint)
    }, [url, footprint])

    useEffect(() => {
        object.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true
                child.receiveShadow = false
            }
        })
    }, [object])

    return (
        <group scale={scale}>
            <primitive object={object} position={offset} />
        </group>
    )
}
