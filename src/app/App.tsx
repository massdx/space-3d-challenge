import { DragPreview, ThumbnailCanvas } from '../features/catalog/ui/CatalogThumbnail'
import { WallEditor } from '../features/workspace/components/WallEditor'
import { WorkspaceControls } from '../features/workspace/components/WorkspaceControls'
import { WorkspaceHeader } from '../features/workspace/components/WorkspaceHeader'
import { WorkspaceScene } from '../features/workspace/components/WorkspaceScene'
import { WorkspaceSettings } from '../features/workspace/components/WorkspaceSettings'

export function App() {
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
            <WorkspaceSettings />
            <WallEditor />
            <WorkspaceControls />
            <ThumbnailCanvas />
            <DragPreview />
        </main>
    )
}

