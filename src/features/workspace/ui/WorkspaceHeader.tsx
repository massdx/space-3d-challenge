import { useWorkspaceStore } from '../model/workspaceStore'

export function WorkspaceHeader() {
    const environmentPreset = useWorkspaceStore((state) => state.environmentPreset)
    const toggleEnvironment = useWorkspaceStore((state) => state.toggleEnvironment)

    return (
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-6">
            <div className="max-w-md rounded-2xl border border-white/10 bg-slate-950/65 p-4 shadow-2xl backdrop-blur">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Dev Setup 3D</p>
                <h1 className="mt-2 text-2xl font-semibold text-white sm:text-4xl">Pièce vide prête</h1>
                <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                    Deux murs + surface du sol comme référence. On peut maintenant ajouter les objets.
                </p>
            </div>

            <button
                type="button"
                onClick={toggleEnvironment}
                className="rounded-full border border-cyan-400/40 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/20"
            >
                Ambiance: {environmentPreset}
            </button>
        </div>
    )
}