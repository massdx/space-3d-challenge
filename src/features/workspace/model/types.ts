export type EnvironmentPreset = 'sunset' | 'night'

export type WindowSide = 'none' | 'left' | 'right'

export type WallId = 'left' | 'right'

export type SurfaceId = WallId | 'floor'

export type WorkspaceState = {
    environmentPreset: EnvironmentPreset
    toggleEnvironment: () => void
    windowSide: WindowSide
    setWindowSide: (side: WindowSide) => void
    surfaceColors: Record<SurfaceId, string | null>
    surfaceTextures: Record<SurfaceId, string | null>
    selectedSurface: SurfaceId | null
    selectSurface: (surface: SurfaceId | null) => void
    setSurfaceColor: (surface: SurfaceId, color: string) => void
    setSurfaceTexture: (surface: SurfaceId, texture: string | null) => void
}