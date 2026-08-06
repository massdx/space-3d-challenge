import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from 'three'
import type { TextureId } from './types'

export const TEXTURE_OPTIONS: TextureId[] = [
    'none',
    'stripes',
    'dots',
    'grid',
    'checker',
    'brick',
]

export const TEXTURE_LABEL: Record<TextureId, string> = {
    none: 'Aucune',
    stripes: 'Rayures',
    dots: 'Pois',
    grid: 'Grille',
    checker: 'Damier',
    brick: 'Briques',
}

// Motif en gris translucide sur fond blanc : multiplié par la couleur du mur,
// le blanc garde la teinte et le motif l'assombrit légèrement.
function draw(id: TextureId): HTMLCanvasElement {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    ctx.strokeStyle = 'rgba(0,0,0,0.16)'
    ctx.fillStyle = 'rgba(0,0,0,0.16)'

    switch (id) {
        case 'stripes': {
            ctx.lineWidth = size * 0.12
            for (let i = -size; i < size * 2; i += size * 0.34) {
                ctx.beginPath()
                ctx.moveTo(i, 0)
                ctx.lineTo(i + size, size)
                ctx.stroke()
            }
            break
        }
        case 'dots': {
            const step = size / 4
            for (let y = step / 2; y < size; y += step)
                for (let x = step / 2; x < size; x += step) {
                    ctx.beginPath()
                    ctx.arc(x, y, size * 0.07, 0, Math.PI * 2)
                    ctx.fill()
                }
            break
        }
        case 'grid': {
            ctx.lineWidth = size * 0.05
            const step = size / 4
            for (let i = 0; i <= size; i += step) {
                ctx.beginPath()
                ctx.moveTo(i, 0)
                ctx.lineTo(i, size)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(0, i)
                ctx.lineTo(size, i)
                ctx.stroke()
            }
            break
        }
        case 'checker': {
            const step = size / 4
            for (let y = 0; y < 4; y++)
                for (let x = 0; x < 4; x++)
                    if ((x + y) % 2 === 0) ctx.fillRect(x * step, y * step, step, step)
            break
        }
        case 'brick': {
            const bh = size / 4
            const bw = size / 2
            ctx.lineWidth = size * 0.035
            for (let row = 0; row < 4; row++) {
                const y = row * bh
                const offset = row % 2 === 0 ? 0 : -bw / 2
                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(size, y)
                ctx.stroke()
                for (let x = offset; x <= size; x += bw) {
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                    ctx.lineTo(x, y + bh)
                    ctx.stroke()
                }
            }
            break
        }
    }
    return canvas
}

const textureCache = new Map<TextureId, Texture>()
const previewCache = new Map<TextureId, string>()

export function getWallTexture(id: TextureId): Texture | null {
    if (id === 'none') return null
    const cached = textureCache.get(id)
    if (cached) return cached
    const texture = new CanvasTexture(draw(id))
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(5, 3)
    texture.colorSpace = SRGBColorSpace
    textureCache.set(id, texture)
    return texture
}

export function getTexturePreview(id: TextureId): string | null {
    if (id === 'none') return null
    const cached = previewCache.get(id)
    if (cached) return cached
    const url = draw(id).toDataURL()
    previewCache.set(id, url)
    return url
}
