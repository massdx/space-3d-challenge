

import { forwardRef, type ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'solid' | 'primary' | 'black' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
type ButtonShape = 'pill' | 'circle'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
    shape?: ButtonShape
}

const cn = (...classes: (string | false | null | undefined)[]) =>
    classes.filter(Boolean).join(' ')

const base =
    'inline-flex cursor-pointer select-none items-center justify-center gap-2 font-medium transition ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
    solid: 'bg-neutral-300 border border-neutral-200/70 backdrop-blur-xl text-neutral-800 hover:bg-neutral-300/90 active:bg-neutral-300/70',
    primary: 'bg-cyan-600 text-white hover:bg-cyan-400 active:bg-cyan-600',
    black: 'bg-black text-white hover:bg-neutral-900 active:bg-neutral-800',
    outline: 'border border-neutral-300 bg-transparent text-neutral-800 hover:bg-neutral-100',
    ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-200/70',
}

const sizes: Record<ButtonShape, Record<ButtonSize, string>> = {
    pill: {
        sm: 'h-9 rounded-full px-3 text-sm',
        md: 'h-12 rounded-full px-5 text-sm',
        lg: 'h-13 rounded-full px-7 text-base',
        xl: 'h-15 rounded-full px-9 text-lg',
    },
    circle: {
        sm: 'h-9 w-9 rounded-full',
        md: 'h-11 w-11 rounded-full',
        lg: 'h-13 w-13 rounded-full',
        xl: 'h-18 w-18 rounded-full',
    },
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant = 'solid', size = 'md', shape = 'pill', className, type = 'button', children, ...props },
    ref,
) {
    return (
        <button
            style={{
                // boxShadow: 'inset -1px -1px 1.4px rgba(72, 72, 72, 0.25)',
            }}
            ref={ref}
            type={type}
            data-cuelume-press
            className={cn(base, variants[variant], sizes[shape][size], className)}
            {...props}
        >
            {children}
        </button>
    )
})

export default Button
export type { ButtonProps, ButtonShape, ButtonSize, ButtonVariant }

