import { Raycaster, Vector3 } from 'three'
import { clampFloor, floorPlane } from '../../workspace/model/floor'
import { getPlacedObjects } from './placedRegistry'

const floorScratch = new Vector3()

/**
 * Résout où poser un objet sous le rayon : sur la surface du meuble le plus proche
 * survolé, sinon sur le sol. Permet l'empilement (ex: l'écran sur la table).
 */
export function resolveDropPosition(
    raycaster: Raycaster,
    excludeId?: string,
): [number, number, number] | null {
    const objects = getPlacedObjects(excludeId)
    const surfaceHits = objects.length ? raycaster.intersectObjects(objects, true) : []
    const floorHit = raycaster.ray.intersectPlane(floorPlane, floorScratch)

    let point: Vector3 | null = null
    if (
        surfaceHits.length &&
        (!floorHit || surfaceHits[0].distance <= raycaster.ray.origin.distanceTo(floorHit))
    ) {
        point = surfaceHits[0].point
    } else if (floorHit) {
        point = floorHit
    }

    if (!point) return null
    return [clampFloor(point.x), point.y, clampFloor(point.z)]
}
