import { bind } from 'cuelume'
import { useEffect } from 'react'
import { useCatalogStore } from '../features/catalog/model/catalogStore'
import { decodeScene, readShareCodeFromHash } from '../features/catalog/model/sceneShare'
import { DragPreview, ThumbnailCanvas } from '../features/catalog/ui/CatalogThumbnail'
import { ControlsLegend } from '../features/workspace/components/ControlsLegend'
import { MobileGuard } from '../features/workspace/components/MobileGuard'
import { SceneLoader } from '../features/workspace/components/SceneLoader'
import { ToolWheel } from '../features/workspace/components/ToolWheel'
import { WorkspaceControls } from '../features/workspace/components/WorkspaceControls'
import { WorkspaceHeader } from '../features/workspace/components/WorkspaceHeader'
import { WorkspaceScene } from '../features/workspace/components/WorkspaceScene'

export function App() {
    useEffect(() => {
        bind()
    }, [])

    useEffect(() => {
        const code = readShareCodeFromHash()
        if (!code) return
        let active = true
        decodeScene(code).then((items) => {
            if (active && items && items.length) useCatalogStore.getState().loadItems(items)
        })
        return () => {
            active = false
        }
    }, [])

    return (
        <main
            className="relative h-screen bg-white w-screen overflow-hidden text-slate-100"
            style={{

                background:
                    'radial-gradient(68.02% 68.02% at 50% 50%, #E3E3E3 13.6%, #FFFFFF 100%)',
            }}
        >
            <WorkspaceHeader />
            <WorkspaceScene />
            <WorkspaceControls />
            <ControlsLegend />
            <ThumbnailCanvas />
            <DragPreview />
            <ToolWheel />
            <SceneLoader />
            <MobileGuard />
        </main>
    )
}

