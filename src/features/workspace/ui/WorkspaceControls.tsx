import {
    ArrowTurnBackwardIcon,
    ArrowTurnForwardIcon,
    Camera01Icon,
    Delete02Icon,
    FullScreenIcon,
    Image02Icon,
    Moon02Icon,
    Sofa01Icon,
    Sun03Icon,
    ZoomInAreaIcon,
    ZoomOutAreaIcon,
} from '@hugeicons/core-free-icons'
import { useCatalogStore } from '../../catalog/model/catalogStore'
import { useViewportStore } from '../model/viewportStore'
import { useWorkspaceStore } from '../model/workspaceStore'
import { IconButton } from './controls/IconButton'

export function WorkspaceControls() {
    const environmentPreset = useWorkspaceStore((state) => state.environmentPreset)
    const toggleEnvironment = useWorkspaceStore((state) => state.toggleEnvironment)
    const isNight = environmentPreset === 'night'

    const zoomBy = useViewportStore((state) => state.zoomBy)
    const resetCamera = useViewportStore((state) => state.resetCamera)
    const screenshot = useViewportStore((state) => state.screenshot)

    const catalogOpen = useCatalogStore((state) => state.isOpen)
    const togglePanel = useCatalogStore((state) => state.togglePanel)
    const selectedId = useCatalogStore((state) => state.selectedId)
    const remove = useCatalogStore((state) => state.remove)

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-6">
            <div className="pointer-events-auto flex gap-2">
                <IconButton
                    icon={Sofa01Icon}
                    label="Catalogue d'objets"
                    active={catalogOpen}
                    onClick={togglePanel}
                />
                <IconButton icon={ZoomOutAreaIcon} label="Dézoomer" onClick={() => zoomBy(1.18)} />
                <IconButton icon={ZoomInAreaIcon} label="Zoomer" onClick={() => zoomBy(0.85)} />
                <IconButton icon={FullScreenIcon} label="Recentrer la caméra" onClick={resetCamera} />
            </div>

            <div className="pointer-events-auto flex gap-2 rounded-full border border-white/10 bg-slate-950/50 p-1 backdrop-blur">
                <IconButton icon={ArrowTurnBackwardIcon} label="Annuler" disabled />
                <IconButton icon={ArrowTurnForwardIcon} label="Rétablir" disabled />
            </div>

            <div className="pointer-events-auto flex gap-2">
                <IconButton
                    icon={Delete02Icon}
                    label="Supprimer l'objet sélectionné"
                    disabled={!selectedId}
                    onClick={() => selectedId && remove(selectedId)}
                />
                <IconButton
                    icon={isNight ? Sun03Icon : Moon02Icon}
                    label={isNight ? 'Passer en jour' : 'Passer en nuit'}
                    active={isNight}
                    onClick={toggleEnvironment}
                />
                <IconButton icon={Camera01Icon} label="Capture d'écran" onClick={screenshot} />
                <IconButton icon={Image02Icon} label="Galerie" disabled />
            </div>
        </div>
    )
}
