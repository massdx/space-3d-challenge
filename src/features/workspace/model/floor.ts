import { Plane, Vector3 } from 'three'

export const FLOOR_Y = 1.25
export const FLOOR_MIN = -3.5
export const FLOOR_MAX = 3.7

export const floorPlane = new Plane(new Vector3(0, 1, 0), -FLOOR_Y)

export const clampFloor = (value: number) => Math.min(FLOOR_MAX, Math.max(FLOOR_MIN, value))
