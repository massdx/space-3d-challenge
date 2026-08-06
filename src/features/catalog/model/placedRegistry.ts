import type { Object3D } from 'three'

const registry = new Map<string, Object3D>()

export const registerPlaced = (id: string, object: Object3D | null) => {
    if (object) registry.set(id, object)
    else registry.delete(id)
}

export const getPlacedObjects = (excludeId?: string) => {
    const objects: Object3D[] = []
    registry.forEach((object, id) => {
        if (id !== excludeId) objects.push(object)
    })
    return objects
}
