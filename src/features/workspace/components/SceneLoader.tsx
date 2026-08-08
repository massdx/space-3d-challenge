import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'

const BARS = Array.from({ length: 12 })

export function SceneLoader() {
    const { active } = useProgress()
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if (active) {
            setVisible(true)
            return
        }
        const timer = window.setTimeout(() => setVisible(false), 400)
        return () => window.clearTimeout(timer)
    }, [active])

    if (!visible) return null

    return (
        <div
            className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity duration-300"
            style={{ opacity: active ? 1 : 0 }}
        >
            <div className="apple-spinner">
                {BARS.map((_, index) => (
                    <span
                        key={index}
                        style={{
                            transform: `rotate(${index * 30}deg)`,
                            animationDelay: `${-(11 - index) / 12}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
