import { RoundedBox } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import type { Texture } from 'three'
import type { TextureId, WallId, WindowSide } from '../../workspace/model/types'
import { getWallTexture } from '../../workspace/model/wallTextures'
import { useWorkspaceStore } from '../../workspace/model/workspaceStore'

type RoomShellProps = {
    night: boolean
}

const WALL_HEIGHT = 4.6
const ROOM_SIZE = 8
const WALL_THICKNESS = 0.35
const OPEN_W = 3.2
const OPEN_H = 2.2
const SILL = 1
const FRAME_W = 0.14


export function RoomShell({ night }: RoomShellProps) {
    const windowSide = useWorkspaceStore((state) => state.windowSide)
    const wallColors = useWorkspaceStore((state) => state.wallColors)
    const wallTextures = useWorkspaceStore((state) => state.wallTextures)
    const selectWall = useWorkspaceStore((state) => state.selectWall)

    return (
        <group position={[0, 1, 0]}>
            <Floor night={night} />
            <Walls
                night={night}
                windowSide={windowSide}
                wallColors={wallColors}
                wallTextures={wallTextures}
                onSelectWall={selectWall}
            />
            <Frame />
            <UnderGlow />
        </group>
    )
}

function Floor({ night }: { night: boolean }) {
    return (
        <RoundedBox
            args={[ROOM_SIZE, 0.5, ROOM_SIZE]}
            radius={0.05}
            smoothness={2}
            position={[0, 0, 0]}
            receiveShadow
        >
            <meshStandardMaterial color={night ? '#2f2f33' : '#3d3d42'} roughness={1} />
        </RoundedBox>
    )
}

function Walls({
    night,
    windowSide,
    wallColors,
    wallTextures,
    onSelectWall,
}: {
    night: boolean
    windowSide: WindowSide
    wallColors: Record<WallId, string | null>
    wallTextures: Record<WallId, TextureId>
    onSelectWall: (wall: WallId) => void
}) {
    const wallY = WALL_HEIGHT / 2 + 0.25
    const half = ROOM_SIZE / 2
    const leftColor = wallColors.left ?? (night ? '#5b2b74' : '#7b3f96')
    const rightColor = wallColors.right ?? (night ? '#7a4f96' : '#a678c4')
    const leftTexture = getWallTexture(wallTextures.left)
    const rightTexture = getWallTexture(wallTextures.right)

    const onClick = (wall: WallId) => (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation()
        onSelectWall(wall)
    }

    return (
        <group>
            {windowSide === 'left' ? (
                <WallWithWindow
                    orientation="x"
                    position={[-half + 0.17, wallY, 0]}
                    color={leftColor}
                    texture={leftTexture}
                    onClick={onClick('left')}
                />
            ) : (
                <RoundedBox
                    args={[WALL_THICKNESS, WALL_HEIGHT, ROOM_SIZE]}
                    radius={0.05}
                    smoothness={2}
                    position={[-half + 0.17, wallY, 0]}
                    receiveShadow
                    onClick={onClick('left')}
                >
                    <meshStandardMaterial color={leftColor} roughness={0.85} map={leftTexture} />
                </RoundedBox>
            )}

            {windowSide === 'right' ? (
                <WallWithWindow
                    orientation="z"
                    position={[0, wallY, -half + 0.17]}
                    color={rightColor}
                    texture={rightTexture}
                    onClick={onClick('right')}
                />
            ) : (
                <RoundedBox
                    args={[ROOM_SIZE, WALL_HEIGHT, WALL_THICKNESS]}
                    radius={0.05}
                    smoothness={2}
                    position={[0, wallY, -half + 0.17]}
                    receiveShadow
                    onClick={onClick('right')}
                >
                    <meshStandardMaterial color={rightColor} roughness={0.85} map={rightTexture} />
                </RoundedBox>
            )}
        </group>
    )
}

function WallWithWindow({
    orientation,
    position,
    color,
    texture,
    onClick,
}: {
    orientation: 'x' | 'z'
    position: [number, number, number]
    color: string
    texture: Texture | null
    onClick?: (event: ThreeEvent<MouseEvent>) => void
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
        box(0, -halfH + SILL / 2, ROOM_SIZE, SILL),
        box(0, (openTop + halfH) / 2, ROOM_SIZE, halfH - openTop),
        box(-sideU, openCenterY, sideSpan, OPEN_H),
        box(sideU, openCenterY, sideSpan, OPEN_H),
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
        <group position={position} onClick={onClick}>
            {segments.map((segment, index) => (
                <mesh key={index} position={segment.pos} receiveShadow castShadow>
                    <boxGeometry args={segment.args} />
                    <meshStandardMaterial color={color} roughness={0.85} map={texture} />
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

function UnderGlow() {
    const half = ROOM_SIZE / 2
    const t = 0.14
    const y = -0.25

    return (
        <group>
            <GlowBar position={[0, y, half]} args={[ROOM_SIZE, t, t]} />
            <GlowBar position={[0, y, -half]} args={[ROOM_SIZE, t, t]} />
            <GlowBar position={[-half, y, 0]} args={[t, t, ROOM_SIZE]} />
            <GlowBar position={[half, y, 0]} args={[t, t, ROOM_SIZE]} />

            <GlowBar position={[half, y, half]} args={[t, t, t]} />


            <pointLight position={[0, y - 0.3, half]} color="#22d3ee" intensity={6} distance={6} />
            <pointLight position={[half, y - 0.3, 0]} color="#22d3ee" intensity={6} distance={6} />
        </group>
    )
}

function GlowBar({
    position,
    args,
}: {
    position: [number, number, number]
    args: [number, number, number]
}) {
    return (
        <mesh position={position}>
            <boxGeometry args={args} />
            <meshStandardMaterial
                color="#a5f3fc"
                emissive="#22d3ee"
                emissiveIntensity={0.5}
                toneMapped={false}
            />
        </mesh>
    )
}
