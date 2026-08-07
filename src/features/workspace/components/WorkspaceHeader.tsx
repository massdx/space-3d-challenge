import { Camera01Icon, HelpCircleIcon, LinkBackwardIcon, Settings01Icon, Sun02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'
import Button from '../../../components/ui/button'
import { useViewportStore } from '../model/viewportStore'
import { useWorkspaceStore } from '../model/workspaceStore'

export function WorkspaceHeader() {
    const toggleEnvironment = useWorkspaceStore((state) => state.toggleEnvironment)
    const [, setOpen] = useState(false)
    const screenshot = useViewportStore((state) => state.screenshot)
    return (
        <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-6">
            <div>
                <input placeholder='File name' value={"Test micro"} className="border text-xl border-none  focus-within:ring-2 ring-neutral-700 outline-none  text-neutral-900 px-3 font-medium  h-12 rounded-xl  py-1" />
            </div>
            <div className="space-x-2 ">
                <Button onClick={() => screenshot()}>
                    <HugeiconsIcon icon={Camera01Icon} size={20} strokeWidth={1.8} />
                </Button>
                <Button onClick={() => toggleEnvironment()}>
                    <HugeiconsIcon icon={Sun02Icon} size={20} strokeWidth={1.8} />
                </Button>
                <Button onClick={() => setOpen((value) => !value)}>
                    <HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={1.8} />
                </Button>
                <Button onClick={() => setOpen((value) => !value)}>
                    <HugeiconsIcon icon={HelpCircleIcon} size={20} strokeWidth={1.8} />
                </Button>
                <Button onClick={() => { }}>
                    <HugeiconsIcon icon={LinkBackwardIcon} size={20} className='' strokeWidth={1.8} />
                    <span>
                        Share or Export
                    </span>
                </Button>
            </div>
        </div>
    )
}