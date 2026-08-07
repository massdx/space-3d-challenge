import { bind } from 'cuelume'
import { useEffect } from 'react'
import { DragPreview, ThumbnailCanvas } from '../features/catalog/ui/CatalogThumbnail'
import { ToolWheel } from '../features/workspace/components/ToolWheel'
import { WorkspaceControls } from '../features/workspace/components/WorkspaceControls'
import { WorkspaceHeader } from '../features/workspace/components/WorkspaceHeader'
import { WorkspaceScene } from '../features/workspace/components/WorkspaceScene'

export function App() {
    useEffect(() => {
        bind()
    }, [])

    return (
        <main
            className="relative h-screen bg-white w-screen overflow-hidden text-slate-100"
            style={{
                // background:
                //     'radial-gradient(120% 100% at 50% 32%, #fbfbfc 0%, #eceef1 45%, #d6d9df 78%, #c3c7cf 100%)',
            }}
        >
            <WorkspaceHeader />
            <WorkspaceScene />
            <WorkspaceControls />
            <ThumbnailCanvas />
            <DragPreview />
            <ToolWheel />
        </main>
    )
}

