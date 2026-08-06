import { HugeiconsIcon } from '@hugeicons/react'
import type { ComponentProps } from 'react'

type IconButtonProps = {
    icon: ComponentProps<typeof HugeiconsIcon>['icon']
    label: string
    onClick?: () => void
    active?: boolean
    disabled?: boolean
}

export function IconButton({ icon, label, onClick, active, disabled }: IconButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className={[
                'flex h-11 w-11 items-center justify-center rounded-full border backdrop-blur transition',
                'disabled:cursor-not-allowed disabled:opacity-40',
                active
                    ? 'border-cyan-400/60 bg-cyan-300/20 text-cyan-100'
                    : 'border-white/10 bg-slate-950/60 text-slate-200 hover:bg-slate-800/70 hover:text-white',
            ].join(' ')}
        >
            <HugeiconsIcon icon={icon} size={20} strokeWidth={1.8} />
        </button>
    )
}
