import { useTexture } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import {
    AdditiveBlending,
    CanvasTexture,
    ClampToEdgeWrapping,
    type Group,
    type Material,
    MathUtils,
    Mesh,
    type Object3D,
    RepeatWrapping,
    SRGBColorSpace,
} from 'three'
import { TEXTURE_BY_ID } from '../../workspace/model/textureCatalog'
import { useToolWheelStore } from '../../workspace/model/toolWheelStore'
import type { SurfaceId, WallId, WindowSide } from '../../workspace/model/types'
import { useWorkspaceStore } from '../../workspace/model/workspaceStore'

type RoomShellProps = {
    night: boolean
}

type SurfaceHandlers = {
    onPointerDown: (event: ThreeEvent<PointerEvent>) => void
    onPointerMove: (event: ThreeEvent<PointerEvent>) => void
    onPointerUp: (event: ThreeEvent<PointerEvent>) => void
}

const WALL_HEIGHT = 4.6
const ROOM_SIZE = 8
const WALL_THICKNESS = 0.35
const OPEN_W = 3.2
const OPEN_H = 2.2
const SILL = 1
const FRAME_W = 0.14
const LONG_PRESS_MS = 350
const MOVE_CANCEL_PX = 8
const WALL_ASPECT = ROOM_SIZE / WALL_HEIGHT

const resolveTexture = (id: string | null) => {
    const item = id ? TEXTURE_BY_ID[id] : undefined
    return { url: item?.url ?? null, cover: item?.fit === 'cover' }
}

function TextureMaterial({
    url,
    color,
    roughness,
    repeat,
    cover,
    surfaceAspect,
}: {
    url: string
    color: string
    roughness: number
    repeat: [number, number]
    cover: boolean
    surfaceAspect: number
}) {
    const base = useTexture(url)
    // Clone: chaque surface a son propre repeat/offset même si l'image est partagée.
    const texture = useMemo(() => base.clone(), [base])
    useMemo(() => {
        if (cover) {
            texture.wrapS = ClampToEdgeWrapping
            texture.wrapT = ClampToEdgeWrapping
            const image = texture.image as { width?: number; height?: number } | undefined
            const imageAspect =
                image?.width && image?.height ? image.width / image.height : 1
            const ratio = surfaceAspect / imageAspect
            const rx = ratio >= 1 ? 1 : ratio
            const ry = ratio >= 1 ? 1 / ratio : 1
            texture.repeat.set(rx, ry)
            texture.offset.set((1 - rx) / 2, (1 - ry) / 2)
        } else {
            texture.wrapS = RepeatWrapping
            texture.wrapT = RepeatWrapping
            texture.repeat.set(repeat[0], repeat[1])
            texture.offset.set(0, 0)
        }
        texture.colorSpace = SRGBColorSpace
        texture.needsUpdate = true
    }, [texture, repeat, cover, surfaceAspect])
    return <meshStandardMaterial map={texture} color={color} roughness={roughness} />
}

function SurfaceMaterial({
    tint,
    defaultColor,
    url,
    cover = false,
    roughness = 0.85,
    repeat = [1, 1],
    surfaceAspect = 1,
}: {
    tint: string | null
    defaultColor: string
    url: string | null
    cover?: boolean
    roughness?: number
    repeat?: [number, number]
    surfaceAspect?: number
}) {
    return (
        <Suspense
            fallback={<meshStandardMaterial color={tint ?? defaultColor} roughness={roughness} />}
        >
            {url ? (
                <TextureMaterial
                    url={url}
                    color={tint ?? '#ffffff'}
                    roughness={roughness}
                    repeat={repeat}
                    cover={cover}
                    surfaceAspect={surfaceAspect}
                />
            ) : (
                <meshStandardMaterial color={tint ?? defaultColor} roughness={roughness} />
            )}
        </Suspense>
    )
}

export function RoomShell({ night }: RoomShellProps) {
    const windowSide = useWorkspaceStore((state) => state.windowSide)
    const surfaceColors = useWorkspaceStore((state) => state.surfaceColors)
    const surfaceTextures = useWorkspaceStore((state) => state.surfaceTextures)
    const openWheel = useToolWheelStore((state) => state.openAt)

    const press = useRef<{ timer: number | null; x: number; y: number }>({
        timer: null,
        x: 0,
        y: 0,
    })
    const clearPress = () => {
        if (press.current.timer !== null) {
            clearTimeout(press.current.timer)
            press.current.timer = null
        }
    }

    const makeHandlers = (surface: SurfaceId): SurfaceHandlers => ({
        onPointerDown: (event) => {
            event.stopPropagation()
            const { clientX, clientY } = event.nativeEvent
            press.current.x = clientX
            press.current.y = clientY
            clearPress()
            press.current.timer = window.setTimeout(() => {
                press.current.timer = null
                openWheel(clientX, clientY, { kind: 'surface', id: surface })
            }, LONG_PRESS_MS)
        },
        onPointerMove: (event) => {
            if (press.current.timer === null) return
            const dx = event.nativeEvent.clientX - press.current.x
            const dy = event.nativeEvent.clientY - press.current.y
            if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) clearPress()
        },
        onPointerUp: () => clearPress(),
    })

    return (
        <group position={[0, 1, 0]}>
            <Floor
                night={night}
                tint={surfaceColors.floor}
                texture={resolveTexture(surfaceTextures.floor)}
                handlers={makeHandlers('floor')}
            />
            <Walls
                night={night}
                windowSide={windowSide}
                surfaceColors={surfaceColors}
                surfaceTextures={surfaceTextures}
                onSelectWall={makeHandlers}
            />
            <Frame />
            <UnderGlow />
        </group>
    )
}

function Floor({
    night,
    tint,
    texture,
    handlers,
}: {
    night: boolean
    tint: string | null
    texture: { url: string | null; cover: boolean }
    handlers: SurfaceHandlers
}) {
    return (
        <mesh position={[0, 0, 0]} receiveShadow {...handlers}>
            <boxGeometry args={[ROOM_SIZE, 0.5, ROOM_SIZE]} />
            <SurfaceMaterial
                tint={tint}
                defaultColor={night ? '#2f2f33' : '#3d3d42'}
                url={texture.url}
                cover={texture.cover}
                roughness={1}
                repeat={[4, 4]}
                surfaceAspect={1}
            />
        </mesh>
    )
}

// Opacité originale de chaque matériau, pour ne pas écraser le verre translucide en fondu.
const baseOpacity = new WeakMap<Material, number>()

function applyWallOpacity(root: Object3D, op: number) {
    root.traverse((child) => {
        if (!(child instanceof Mesh)) return
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        for (const m of mats) {
            if (!m) continue
            const base = baseOpacity.get(m) ?? m.opacity
            if (!baseOpacity.has(m)) baseOpacity.set(m, base)
            m.opacity = base * op
            m.transparent = m.opacity < 0.99
            m.depthWrite = m.opacity > 0.99
        }
    })
}

function Walls({
    night,
    windowSide,
    surfaceColors,
    surfaceTextures,
    onSelectWall,
}: {
    night: boolean
    windowSide: WindowSide
    surfaceColors: Record<SurfaceId, string | null>
    surfaceTextures: Record<SurfaceId, string | null>
    onSelectWall: (wall: WallId) => SurfaceHandlers
}) {
    const wallY = WALL_HEIGHT / 2 + 0.25
    const half = ROOM_SIZE / 2
    const leftDefault = night ? '#5b2b74' : '#7b3f96'
    const rightDefault = night ? '#7a4f96' : '#a678c4'
    const left = resolveTexture(surfaceTextures.left)
    const right = resolveTexture(surfaceTextures.right)

    const leftRef = useRef<Group>(null)
    const rightRef = useRef<Group>(null)
    const leftOp = useRef(1)
    const rightOp = useRef(1)

    // Fond un mur quand la caméra passe derrière son plan, pour voir l'intérieur.
    useFrame(({ camera, invalidate }) => {
        const wallCoord = -half + 0.17
        const step = (root: Group | null, camAxis: number, store: { current: number }) => {
            if (!root) return false
            const t = MathUtils.clamp((camAxis - wallCoord) / 1.2, 0, 1)
            const target = 0.1 + 0.9 * t
            store.current = MathUtils.lerp(store.current, target, 0.16)
            applyWallOpacity(root, store.current)
            return Math.abs(store.current - target) > 0.004
        }
        const a = step(leftRef.current, camera.position.x, leftOp)
        const b = step(rightRef.current, camera.position.z, rightOp)
        if (a || b) invalidate()
    })

    return (
        <group>
            <group ref={leftRef}>
                {windowSide === 'left' ? (
                    <WallWithWindow
                        orientation="x"
                        position={[-half + 0.17, wallY, 0]}
                        tint={surfaceColors.left}
                        defaultColor={leftDefault}
                        texture={left}
                        handlers={onSelectWall('left')}
                    />
                ) : (
                    <mesh
                        position={[-half + 0.17, wallY, 0]}
                        receiveShadow
                        {...onSelectWall('left')}
                    >
                        <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, ROOM_SIZE]} />
                        <SurfaceMaterial
                            tint={surfaceColors.left}
                            defaultColor={leftDefault}
                            url={left.url}
                            cover={left.cover}
                            repeat={[3, 2]}
                            surfaceAspect={WALL_ASPECT}
                        />
                    </mesh>
                )}
            </group>

            <group ref={rightRef}>
                {windowSide === 'right' ? (
                    <WallWithWindow
                        orientation="z"
                        position={[0, wallY, -half + 0.17]}
                        tint={surfaceColors.right}
                        defaultColor={rightDefault}
                        texture={right}
                        handlers={onSelectWall('right')}
                    />
                ) : (
                    <mesh
                        position={[0, wallY, -half + 0.17]}
                        receiveShadow
                        {...onSelectWall('right')}
                    >
                        <boxGeometry args={[ROOM_SIZE, WALL_HEIGHT, WALL_THICKNESS]} />
                        <SurfaceMaterial
                            tint={surfaceColors.right}
                            defaultColor={rightDefault}
                            url={right.url}
                            cover={right.cover}
                            repeat={[3, 2]}
                            surfaceAspect={WALL_ASPECT}
                        />
                    </mesh>
                )}
            </group>
        </group>
    )
}

function WallWithWindow({
    orientation,
    position,
    tint,
    defaultColor,
    texture,
    handlers,
}: {
    orientation: 'x' | 'z'
    position: [number, number, number]
    tint: string | null
    defaultColor: string
    texture: { url: string | null; cover: boolean }
    handlers?: SurfaceHandlers
}) {
    const halfH = WALL_HEIGHT / 2
    const openBottom = -halfH + SILL
    const openTop = openBottom + OPEN_H
    const openCenterY = (openBottom + openTop) / 2
    const sideSpan = ROOM_SIZE / 2 - OPEN_W / 2
    const sideU = OPEN_W / 2 + sideSpan / 2
    const frameN = WALL_THICKNESS + 0.06

    // `u` = position le long du mur, `normal` = épaisseur suivant sa normale.
    const box = (u: number, y: number, span: number, height: number, normal = WALL_THICKNESS) =>
        orientation === 'x'
            ? { pos: [0, y, u] as const, args: [normal, height, span] as const }
            : { pos: [u, y, 0] as const, args: [span, height, normal] as const }

    const segments = [
        { ...box(0, -halfH + SILL / 2, ROOM_SIZE, SILL), span: ROOM_SIZE, height: SILL },
        {
            ...box(0, (openTop + halfH) / 2, ROOM_SIZE, halfH - openTop),
            span: ROOM_SIZE,
            height: halfH - openTop,
        },
        { ...box(-sideU, openCenterY, sideSpan, OPEN_H), span: sideSpan, height: OPEN_H },
        { ...box(sideU, openCenterY, sideSpan, OPEN_H), span: sideSpan, height: OPEN_H },
    ]

    const frame = [
        box(0, openTop - FRAME_W / 2, OPEN_W, FRAME_W, frameN),
        box(0, openBottom + FRAME_W / 2, OPEN_W, FRAME_W, frameN),
        box(-OPEN_W / 2 + FRAME_W / 2, openCenterY, FRAME_W, OPEN_H, frameN),
        box(OPEN_W / 2 - FRAME_W / 2, openCenterY, FRAME_W, OPEN_H, frameN),
        box(0, openCenterY, FRAME_W * 0.7, OPEN_H, frameN),
        box(0, openCenterY, OPEN_W, FRAME_W * 0.7, frameN),
    ]

    const glass = box(0, openCenterY, OPEN_W, OPEN_H, 0.06)
    const lightPos: [number, number, number] =
        orientation === 'x' ? [0.7, openCenterY, 0] : [0, openCenterY, 0.7]

    return (
        <group position={position} {...handlers}>
            {segments.map((segment, index) => (
                <mesh key={index} position={segment.pos} receiveShadow castShadow>
                    <boxGeometry args={segment.args} />
                    <SurfaceMaterial
                        tint={tint}
                        defaultColor={defaultColor}
                        url={texture.url}
                        cover={texture.cover}
                        repeat={[3, 2]}
                        surfaceAspect={segment.span / segment.height}
                    />
                </mesh>
            ))}

            <mesh position={glass.pos}>
                <boxGeometry args={glass.args} />
                <meshStandardMaterial
                    color="#bfe4ff"
                    emissive="#e6f4ff"
                    emissiveIntensity={0.6}
                    transparent
                    opacity={0.35}
                    roughness={0.1}
                    toneMapped={false}
                />
            </mesh>

            {frame.map((bar, index) => (
                <mesh key={index} position={bar.pos}>
                    <boxGeometry args={bar.args} />
                    <meshStandardMaterial color="#eef2f7" roughness={0.6} />
                </mesh>
            ))}

            <pointLight position={lightPos} intensity={6} distance={11} decay={1.5} color="#cfe6ff" />
        </group>
    )
}

function Frame() {

    return (
        <group>

        </group>
    )
}

// Halo doux localisé sous la pièce : glow plein et flouté qui bave sous la plateforme.
const GLOW_PLANE = ROOM_SIZE * 2.25

function useGlowTexture() {
    return useMemo(() => {
        const size = 512
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')!
        // L'empreinte de la pièce occupe la fraction centrale ; le reste laisse baver le halo.
        const inset = size * ((1 - ROOM_SIZE / GLOW_PLANE) / 2)
        const side = size - inset * 2
        const radius = 40
        ctx.fillStyle = '#22d3ee'
        ctx.shadowColor = '#22d3ee'
        for (const blur of [24, 48, 90]) {
            ctx.shadowBlur = blur
            ctx.beginPath()
            ctx.roundRect(inset, inset, side, side, radius)
            ctx.fill()
        }
        const texture = new CanvasTexture(canvas)
        texture.colorSpace = SRGBColorSpace
        return texture
    }, [])
}

function UnderGlow() {
    const y = -0.25
    const glow = useGlowTexture()

    return (
        <mesh position={[0, y - 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[GLOW_PLANE, GLOW_PLANE]} />
            <meshBasicMaterial
                map={glow}
                transparent
                opacity={0.4}
                blending={AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    )
}
