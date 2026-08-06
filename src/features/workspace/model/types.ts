export type EnvironmentPreset = 'sunset' | 'night'

export type WindowSide = 'none' | 'left' | 'right'

export type WallId = 'left' | 'right'

export type TextureId = 'none' | 'stripes' | 'dots' | 'grid' | 'checker' | 'brick'

export type WorkspaceState = {
    environmentPreset: EnvironmentPreset
    toggleEnvironment: () => void
    windowSide: WindowSide
    setWindowSide: (side: WindowSide) => void
    wallColors: Record<WallId, string | null>
    wallTextures: Record<WallId, TextureId>
    selectedWall: WallId | null
    selectWall: (wall: WallId | null) => void
    setWallColor: (wall: WallId, color: string) => void
    setWallTexture: (wall: WallId, texture: TextureId) => void
}