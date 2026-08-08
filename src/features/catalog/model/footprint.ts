export type Footprint = { hx: number; hy: number; hz: number }

const footprints = new Map<string, Footprint>()

export const setFootprint = (url: string, footprint: Footprint) => {
    footprints.set(url, footprint)
}

export const getFootprint = (url: string) => footprints.get(url)

/** Demi-extents alignés sur les axes d'une empreinte tournée de `rotationY` autour de Y. */
export const rotatedExtents = (footprint: Footprint, rotationY: number, scale: number) => {
    const cos = Math.abs(Math.cos(rotationY))
    const sin = Math.abs(Math.sin(rotationY))
    const hx = footprint.hx * scale
    const hz = footprint.hz * scale
    return {
        ex: hx * cos + hz * sin,
        ez: hx * sin + hz * cos,
    }
}
