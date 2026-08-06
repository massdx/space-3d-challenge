import { CatalogPanel } from '../features/catalog/ui/CatalogPanel'
import { WallEditor } from '../features/workspace/ui/WallEditor'
import { WorkspaceControls } from '../features/workspace/ui/WorkspaceControls'
import { WorkspaceHeader } from '../features/workspace/ui/WorkspaceHeader'
import { WorkspaceScene } from '../features/workspace/ui/WorkspaceScene'
import { WorkspaceSettings } from '../features/workspace/ui/WorkspaceSettings'

export function App() {
    return (
        <main
            className="relative h-screen w-screen overflow-hidden text-slate-100"
            style={{
                background:
                    'radial-gradient(120% 100% at 50% 32%, #fbfbfc 0%, #eceef1 45%, #d6d9df 78%, #c3c7cf 100%)',
            }}
        >
            <WorkspaceHeader />
            <WorkspaceScene />
            <CatalogPanel />
            <WorkspaceSettings />
            <WallEditor />
            <WorkspaceControls />
        </main>
    )
}