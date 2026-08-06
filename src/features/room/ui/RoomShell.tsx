import { RoundedBox } from '@react-three/drei'

type RoomShellProps = {
    night: boolean
}

const WALL_HEIGHT = 4.6
const ROOM_SIZE = 8


export function RoomShell({ night }: RoomShellProps) {
    return (
        <group position={[0, 1, 0]}>
            <Floor night={night} />
            <Walls night={night} />
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
            smoothness={6}
            position={[0, 0, 0]}
            receiveShadow
        >
            <meshStandardMaterial color={night ? '#2f2f33' : '#3d3d42'} roughness={1} />
        </RoundedBox>
    )
}

function Walls({ night }: { night: boolean }) {
    const wallY = WALL_HEIGHT / 2 + 0.25
    const half = ROOM_SIZE / 2

    return (
        <group>
            <RoundedBox
                args={[0.35, WALL_HEIGHT, ROOM_SIZE]}
                radius={0.05}
                smoothness={6}
                position={[-half + 0.17, wallY, 0]}
                receiveShadow
            >
                <meshStandardMaterial color={night ? '#5b2b74' : '#7b3f96'} roughness={0.85} />
            </RoundedBox>

            <RoundedBox
                args={[ROOM_SIZE, WALL_HEIGHT, 0.35]}
                radius={0.05}
                smoothness={6}
                position={[0, wallY, -half + 0.17]}
                receiveShadow
            >
                <meshStandardMaterial color={night ? '#7a4f96' : '#a678c4'} roughness={0.85} />
            </RoundedBox>
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
