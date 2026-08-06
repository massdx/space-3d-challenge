export type EnvironmentPreset = 'sunset' | 'night'

export type WorkspaceState = {
    environmentPreset: EnvironmentPreset
    toggleEnvironment: () => void
}