import { Plane, Vector3, type Raycaster } from 'three'
import { FLOOR_EDGE, FLOOR_Y, WALL_INNER, WALL_TOP } from '../../workspace/model/floor'
import type { Footprint } from './footprint'

const leftPlane = new Plane(new Vector3(1, 0, 0), -WALL_INNER)
const rightPlane = new Plane(new Vector3(0, 0, 1), -WALL_INNER)
const hitLeft = new Vector3()
const hitRight = new Vector3()

export type WallSide = 'left' | 'right'
export type WallHit = { wall: WallSide; x: number; y: number; z: number }

const within = (v: number, lo: number, hi: number) => v >= lo && v <= hi

const clampRange = (v: number, lo: number, hi: number) =>
    lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v))

/** Point d'accroche sur le mur le plus proche sous le rayon, ou null hors des murs. */
export function resolveWallHit(raycaster: Raycaster): WallHit | null {
    const left = raycaster.ray.intersectPlane(leftPlane, hitLeft)
    const right = raycaster.ray.intersectPlane(rightPlane, hitRight)
    const origin = raycaster.ray.origin

    let best: WallHit | null = null
    let bestDist = Infinity

    if (left && within(left.z, WALL_INNER, FLOOR_EDGE) && within(left.y, FLOOR_Y, WALL_TOP)) {
        const dist = origin.distanceTo(left)
        best = { wall: 'left', x: left.x, y: left.y, z: left.z }
        bestDist = dist
    }
    if (right && within(right.x, WALL_INNER, FLOOR_EDGE) && within(right.y, FLOOR_Y, WALL_TOP)) {
        const dist = origin.distanceTo(right)
        if (dist < bestDist) best = { wall: 'right', x: right.x, y: right.y, z: right.z }
    }
    return best
}

/** Position plaquée au mur (dos contre le mur, face vers la pièce) + rotation. */
export function wallPlacement(
    hit: WallHit,
    footprint: Footprint,
    scale: number,
): { position: [number, number, number]; rotationY: number } {
    const hx = footprint.hx * scale
    const hy = footprint.hy * scale
    const hz = footprint.hz * scale
    const y = clampRange(hit.y, FLOOR_Y + hy, WALL_TOP - hy) - hy

    if (hit.wall === 'left') {
        const x = WALL_INNER + hz
        const z = clampRange(hit.z, WALL_INNER + hx, FLOOR_EDGE - hx)
        return { position: [x, y, z], rotationY: Math.PI / 2 }
    }
    const z = WALL_INNER + hz
    const x = clampRange(hit.x, WALL_INNER + hx, FLOOR_EDGE - hx)
    return { position: [x, y, z], rotationY: 0 }
}
