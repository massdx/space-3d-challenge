import { Plane, Vector3 } from 'three'

export const FLOOR_Y = 1.25
export const FLOOR_MIN = -3.5
export const FLOOR_MAX = 3.7

// Face interne des deux murs (côtés -X et -Z) et bord du sol côtés ouverts (+X, +Z).
export const WALL_INNER = -3.6
export const FLOOR_EDGE = 3.9

// Haut des murs en coordonnées monde (WALL_HEIGHT 4.6 + socle 0.25 + groupe pièce y=1).
export const WALL_TOP = 5.85

// Chevauchement autorisé dans le mur pour les assises plaquées.
export const WALL_OVERLAP = 0.4

export const floorPlane = new Plane(new Vector3(0, 1, 0), -FLOOR_Y)

export const clampFloor = (value: number) => Math.min(FLOOR_MAX, Math.max(FLOOR_MIN, value))

/** Garde le centre d'un objet dans la pièce en tenant compte de son empreinte (par axe). */
export const clampToRoom = (
    x: number,
    z: number,
    radiusX = 0,
    radiusZ = radiusX,
): [number, number] => {
    const clampAxis = (value: number, radius: number) => {
        const lo = WALL_INNER + radius
        const hi = FLOOR_EDGE - radius
        return lo > hi ? (WALL_INNER + FLOOR_EDGE) / 2 : Math.min(hi, Math.max(lo, value))
    }
    return [clampAxis(x, radiusX), clampAxis(z, radiusZ)]
}
