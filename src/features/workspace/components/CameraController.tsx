import { useProgress } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { INITIAL_CAMERA, INITIAL_TARGET } from '../model/viewportStore'

export const HARD_MIN_AZ = Math.PI / 12
export const HARD_MAX_AZ = Math.PI / 1.4
export const AZ_STRETCH = 0.13

const INTRO_MS = 1300
const STIFFNESS = 130
const DAMPING = 13

type OrbitImpl = {
    enabled: boolean
    target: Vector3
    rotateSpeed: number
    minAzimuthAngle: number
    maxAzimuthAngle: number
    getAzimuthalAngle: () => number
    update: () => void
    addEventListener: (type: string, fn: () => void) => void
    removeEventListener: (type: string, fn: () => void) => void
}

type Mode = 'idle' | 'intro' | 'spring'

export function CameraController() {
    const camera = useThree((state) => state.camera)
    const controls = useThree((state) => state.controls) as unknown as OrbitImpl | null
    const invalidate = useThree((state) => state.invalidate)
    const { active } = useProgress()

    const mode = useRef<Mode>('idle')
    const introPlayed = useRef(false)
    const introStart = useRef(new Vector3())
    const introT = useRef(0)
    const dragging = useRef(false)
    const spring = useRef({ x: 0, v: 0, target: 0, side: 'max' as 'max' | 'min' })

    useEffect(() => {
        if (!controls) return
        const onStart = () => {
            dragging.current = true
        }
        const onEnd = () => {
            dragging.current = false
            controls.rotateSpeed = 1
            if (mode.current !== 'idle') return
            const az = controls.getAzimuthalAngle()
            if (az > HARD_MAX_AZ + 1e-3) {
                spring.current = { x: az, v: 0, target: HARD_MAX_AZ, side: 'max' }
                mode.current = 'spring'
                invalidate()
            } else if (az < HARD_MIN_AZ - 1e-3) {
                spring.current = { x: az, v: 0, target: HARD_MIN_AZ, side: 'min' }
                mode.current = 'spring'
                invalidate()
            }
        }
        controls.addEventListener('start', onStart)
        controls.addEventListener('end', onEnd)
        return () => {
            controls.removeEventListener('start', onStart)
            controls.removeEventListener('end', onEnd)
        }
    }, [controls, invalidate])

    useEffect(() => {
        if (!controls || !camera || introPlayed.current || active) return
        introStart.current
            .copy(INITIAL_CAMERA)
            .sub(INITIAL_TARGET)
            .multiplyScalar(1.6)
            .add(INITIAL_TARGET)
            .add(new Vector3(0, 2.4, 0))
        introT.current = 0
        camera.position.copy(introStart.current)
        camera.lookAt(INITIAL_TARGET)
        controls.enabled = false
        mode.current = 'intro'
        introPlayed.current = true
        invalidate()
    }, [active, controls, camera, invalidate])

    useFrame((_, delta) => {
        const c = controls
        if (!c) return
        const dt = Math.min(delta, 1 / 30)

        if (mode.current === 'intro') {
            introT.current += (dt * 1000) / INTRO_MS
            const t = Math.min(introT.current, 1)
            const eased = 1 - Math.pow(1 - t, 3)
            camera.position.lerpVectors(introStart.current, INITIAL_CAMERA, eased)
            camera.lookAt(INITIAL_TARGET)
            if (t >= 1) {
                mode.current = 'idle'
                c.target.copy(INITIAL_TARGET)
                c.enabled = true
                c.update()
            } else {
                invalidate()
            }
            return
        }

        if (mode.current === 'spring') {
            const s = spring.current
            const accel = -STIFFNESS * (s.x - s.target) - DAMPING * s.v
            s.v += accel * dt
            s.x += s.v * dt
            if (s.side === 'max') c.maxAzimuthAngle = s.x
            else c.minAzimuthAngle = s.x
            c.update()
            if (Math.abs(s.x - s.target) < 1e-4 && Math.abs(s.v) < 1e-3) {
                c.maxAzimuthAngle = HARD_MAX_AZ + AZ_STRETCH
                c.minAzimuthAngle = HARD_MIN_AZ - AZ_STRETCH
                c.update()
                mode.current = 'idle'
            } else {
                invalidate()
            }
            return
        }

        if (dragging.current) {
            const az = c.getAzimuthalAngle()
            if (az > HARD_MAX_AZ)
                c.rotateSpeed = 1 - 0.8 * Math.min((az - HARD_MAX_AZ) / AZ_STRETCH, 1)
            else if (az < HARD_MIN_AZ)
                c.rotateSpeed = 1 - 0.8 * Math.min((HARD_MIN_AZ - az) / AZ_STRETCH, 1)
            else c.rotateSpeed = 1
        }
    })

    return null
}
