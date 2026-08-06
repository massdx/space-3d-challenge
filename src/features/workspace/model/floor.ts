import { Plane, Vector3 } from 'three'

export const FLOOR_Y = 1.25
export const FLOOR_MIN = -3.5
export const FLOOR_MAX = 3.7

// Face interne des deux murs (côtés -X et -Z) et bord du sol côtés ouverts (+X, +Z).
export const WALL_INNER = -3.6
export const FLOOR_EDGE = 3.9

export const floorPlane = new Plane(new Vector3(0, 1, 0), -FLOOR_Y)

export const clampFloor = (value: number) => Math.min(FLOOR_MAX, Math.max(FLOOR_MIN, value))

/** Garde le centre d'un objet dans la pièce en tenant compte de son empreinte (rayon). */
export const clampToRoom = (
    x: number,
    z: number,
    radius = 0,
): [number, number] => {
    const lo = WALL_INNER + radius
    const hi = FLOOR_EDGE - radius
    const clamp = (value: number) =>
        lo > hi ? (WALL_INNER + FLOOR_EDGE) / 2 : Math.min(hi, Math.max(lo, value))
    return [clamp(x), clamp(z)]
}
