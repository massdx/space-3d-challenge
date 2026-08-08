import { FLOOR_EDGE, WALL_INNER, WALL_TOP } from '../../workspace/model/floor'
import { CATALOG_BY_ID } from './catalog'
import type { PlacedItem } from './catalogStore'

export type SceneItem = Omit<PlacedItem, 'id'>

const VERSION = 1
const SCALE_MIN = 0.3
const SCALE_MAX = 3

// [modelId, x, y, z, rotationY, scale, locked]
type CompactItem = [string, number, number, number, number, number, 0 | 1]
type Payload = { v: number; i: CompactItem[] }

const round = (n: number) => Math.round(n * 1000) / 1000
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

const toCompact = (item: SceneItem): CompactItem => [
    item.modelId,
    round(item.position[0]),
    round(item.position[1]),
    round(item.position[2]),
    round(item.rotationY),
    round(item.scale),
    item.locked ? 1 : 0,
]

/** Reconstruit un item validé/borné ou null si le modèle est inconnu ou la donnée invalide. */
const fromCompact = (raw: unknown): SceneItem | null => {
    if (!Array.isArray(raw) || raw.length < 4) return null
    const [modelId, x, y, z, rotationY = 0, scale = 1, locked = 0] = raw as CompactItem
    if (typeof modelId !== 'string' || !CATALOG_BY_ID[modelId]) return null
    if ([x, y, z, rotationY, scale].some((n) => typeof n !== 'number' || !Number.isFinite(n))) {
        return null
    }
    return {
        modelId,
        position: [
            clamp(x, WALL_INNER, FLOOR_EDGE),
            clamp(y, 0, WALL_TOP),
            clamp(z, WALL_INNER, FLOOR_EDGE),
        ],
        rotationY,
        scale: clamp(scale, SCALE_MIN, SCALE_MAX),
        locked: locked === 1,
    }
}

const toBase64Url = (bytes: Uint8Array) => {
    let bin = ''
    for (const b of bytes) bin += String.fromCharCode(b)
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

const fromBase64Url = (value: string) => {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/')
    const bin = atob(padded)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return bytes
}

const deflate = async (input: string) => {
    const stream = new Blob([input]).stream().pipeThrough(new CompressionStream('deflate'))
    return new Uint8Array(await new Response(stream).arrayBuffer())
}

const inflate = async (bytes: Uint8Array<ArrayBuffer>) => {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'))
    return new Response(stream).text()
}

export async function encodeScene(items: SceneItem[]): Promise<string> {
    const payload: Payload = { v: VERSION, i: items.map(toCompact) }
    const compressed = await deflate(JSON.stringify(payload))
    return toBase64Url(compressed)
}

export async function decodeScene(code: string): Promise<SceneItem[] | null> {
    try {
        const json = await inflate(fromBase64Url(code))
        const payload = JSON.parse(json) as Payload
        if (!payload || !Array.isArray(payload.i)) return null
        return payload.i.map(fromCompact).filter((item): item is SceneItem => item !== null)
    } catch {
        return null
    }
}

export function exportSceneJson(items: SceneItem[]): string {
    const payload: Payload = { v: VERSION, i: items.map(toCompact) }
    return JSON.stringify(payload, null, 2)
}

export function importSceneJson(text: string): SceneItem[] | null {
    try {
        const payload = JSON.parse(text) as Payload
        if (!payload || !Array.isArray(payload.i)) return null
        return payload.i.map(fromCompact).filter((item): item is SceneItem => item !== null)
    } catch {
        return null
    }
}

export const SHARE_HASH_PREFIX = '#s='

export function buildShareUrl(code: string): string {
    const { origin, pathname } = window.location
    return `${origin}${pathname}${SHARE_HASH_PREFIX}${code}`
}

export function readShareCodeFromHash(): string | null {
    const hash = window.location.hash
    return hash.startsWith(SHARE_HASH_PREFIX) ? hash.slice(SHARE_HASH_PREFIX.length) : null
}
