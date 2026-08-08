import { AnimatePresence, motion } from 'motion/react'
import { useHelpStore } from '../model/helpStore'

function MouseWheelIcon() {
    return (
        <svg width="20" height="21" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.3418 8.9998V6.24365L12.3418 6.49975V7.99978L11.8418 9.49981L10.3418 8.9998Z" fill="#79DBFF" />
            <path d="M11.1226 2V6.00007M11.1226 10.0001V12.0002" stroke="currentColor" strokeWidth="1.80003" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.14296 17.0891C4.33282 19.4806 6.22656 21.5114 8.66745 21.8122C9.56505 21.9227 10.4777 22.0004 11.4025 22.0004C12.3272 22.0004 13.2398 21.9227 14.1374 21.8122C16.5784 21.5114 18.472 19.4806 18.6619 17.0891C18.7935 15.4319 18.9026 13.7322 18.9026 12.0002C18.9026 10.2682 18.7935 8.56844 18.6619 6.91127C18.472 4.5197 16.5784 2.48894 14.1374 2.1882C13.2398 2.07762 12.3272 2 11.4025 2C10.4777 2 9.56505 2.07762 8.66745 2.1882C6.22656 2.48894 4.33282 4.5197 4.14296 6.91127C4.01138 8.56844 3.90234 10.2682 3.90234 12.0002C3.90234 13.7322 4.01138 15.4319 4.14296 17.0891Z" stroke="currentColor" strokeWidth="1.80003" />
            <path d="M9.75635 7.50052C9.75635 7.03457 9.75635 6.80159 9.83245 6.61782C9.93395 6.37279 10.1287 6.1781 10.3737 6.07661C10.5575 6.00049 10.7905 6.00049 11.2564 6.00049C11.7223 6.00049 11.9553 6.00049 12.1391 6.07661C12.3841 6.1781 12.5788 6.37279 12.6803 6.61782C12.7564 6.80159 12.7564 7.03457 12.7564 7.50052V8.50053C12.7564 8.96648 12.7564 9.19946 12.6803 9.38323C12.5788 9.62826 12.3841 9.82295 12.1391 9.92444C11.9553 10.0006 11.7223 10.0006 11.2564 10.0006C10.7905 10.0006 10.5575 10.0006 10.3737 9.92444C10.1287 9.82295 9.93395 9.62826 9.83245 9.38323C9.75635 9.19946 9.75635 8.96648 9.75635 8.50053V7.50052Z" stroke="currentColor" strokeWidth="1.80003" />
        </svg>
    )
}

function MouseLeftIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.46667 5L5 12.5H12V10.5L10.6 10L10.1333 7.5L10.6 6L12 5V3L11.0667 2L7.8 2.5L5.46667 5Z" fill="#79DBFF" />
            <path d="M12 2V6M12 10V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.74061 17.0888C4.93047 19.4803 6.82417 21.511 9.26502 21.8118C10.1626 21.9223 11.0752 22 12 22C12.9247 22 13.8373 21.9223 14.7349 21.8118C17.1758 21.511 19.0694 19.4803 19.2593 17.0888C19.3909 15.4317 19.5 13.732 19.5 12C19.5 10.268 19.3909 8.56832 19.2593 6.91118C19.0694 4.51965 17.1758 2.48893 14.7349 2.1882C13.8373 2.07762 12.9247 2 12 2C11.0752 2 10.1626 2.07762 9.26502 2.1882C6.82417 2.48893 4.93047 4.51965 4.74061 6.91118C4.60903 8.56832 4.5 10.268 4.5 12C4.5 13.732 4.60903 15.4317 4.74061 17.0888Z" stroke="currentColor" strokeWidth="1.8" />
            <path d="M10.5 7.5C10.5 7.03406 10.5 6.80109 10.5761 6.61732C10.6776 6.37229 10.8723 6.17761 11.1173 6.07612C11.3011 6 11.5341 6 12 6C12.4659 6 12.6989 6 12.8827 6.07612C13.1277 6.17761 13.3224 6.37229 13.4239 6.61732C13.5 6.80109 13.5 7.03406 13.5 7.5V8.5C13.5 8.96594 13.5 9.19891 13.4239 9.38268C13.3224 9.62771 13.1277 9.82239 12.8827 9.92388C12.6989 10 12.4659 10 12 10C11.5341 10 11.3011 10 11.1173 9.92388C10.8723 9.82239 10.6776 9.62771 10.5761 9.38268C10.5 9.19891 10.5 8.96594 10.5 8.5V7.5Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    )
}

function MouseRightIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5333 5L19 12.5H12V10.5L13.4 10L13.8667 7.5L13.4 6L12 5V3L12.9333 2L16.2 2.5L18.5333 5Z" fill="#79DBFF" />
            <path d="M12 2V6M12 10V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.74061 17.0888C4.93047 19.4803 6.82417 21.511 9.26502 21.8118C10.1626 21.9223 11.0752 22 12 22C12.9247 22 13.8373 21.9223 14.7349 21.8118C17.1758 21.511 19.0694 19.4803 19.2593 17.0888C19.3909 15.4317 19.5 13.732 19.5 12C19.5 10.268 19.3909 8.56832 19.2593 6.91118C19.0694 4.51965 17.1758 2.48893 14.7349 2.1882C13.8373 2.07762 12.9247 2 12 2C11.0752 2 10.1626 2.07762 9.26502 2.1882C6.82417 2.48893 4.93047 4.51965 4.74061 6.91118C4.60903 8.56832 4.5 10.268 4.5 12C4.5 13.732 4.60903 15.4317 4.74061 17.0888Z" stroke="currentColor" strokeWidth="1.8" />
            <path d="M10.5 7.5C10.5 7.03406 10.5 6.80109 10.5761 6.61732C10.6776 6.37229 10.8723 6.17761 11.1173 6.07612C11.3011 6 11.5341 6 12 6C12.4659 6 12.6989 6 12.8827 6.07612C13.1277 6.17761 13.3224 6.37229 13.4239 6.61732C13.5 6.80109 13.5 7.03406 13.5 7.5V8.5C13.5 8.96594 13.5 9.19891 13.4239 9.38268C13.3224 9.62771 13.1277 9.82239 12.8827 9.92388C12.6989 10 12.4659 10 12 10C11.5341 10 11.3011 10 11.1173 9.92388C10.8723 9.82239 10.6776 9.62771 10.5761 9.38268C10.5 9.19891 10.5 8.96594 10.5 8.5V7.5Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
    )
}

function RotateIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.3279 9.62959C18.5665 5.50194 17.5461 2.70014 13.7161 2.5C10.9325 2.55315 8.06104 4.05298 5.76904 6.37325C3.84556 8.32046 1.95168 11.1093 2.64693 13.7635C2.80044 14.3496 3.09977 14.7489 3.57262 15.1246C4.84331 16.1343 6.09056 16.2232 8.49274 15.6335C10.9254 14.8943 12.4336 13.7806 13.7053 12.6413M13.7053 12.6413C13.7066 12.6401 13.7079 12.6389 13.7093 12.6377C13.7117 12.6356 13.7101 12.6315 13.7069 12.6315C13.7045 12.6315 13.7028 12.634 13.7036 12.6363C13.7042 12.638 13.7047 12.6396 13.7053 12.6413ZM13.7053 12.6413C13.9831 13.4627 13.8072 14.1958 13.3289 15.6335" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

const ROWS = [
    { label: 'Zoom camera', badge: [{ kind: 'icon', node: <MouseWheelIcon /> }] },
    { label: 'Object Rotation', badge: [{ kind: 'icon', node: <MouseLeftIcon /> }, { kind: 'text', node: '+ R' }] },
    { label: 'Object Scaling', badge: [{ kind: 'icon', node: <MouseLeftIcon /> }, { kind: 'text', node: '+ S' }] },
    { label: 'Camera movement', badge: [{ kind: 'icon', node: <MouseRightIcon /> }, { kind: 'icon', node: <RotateIcon /> }] },
    { label: 'Object Options', badge: [{ kind: 'text', node: 'Long' }, { kind: 'icon', node: <MouseLeftIcon /> }] },
] as const

export function ControlsLegend() {
    const open = useHelpStore((state) => state.open)

    return (
        <div className="pointer-events-none absolute top-24 right-4 z-20 sm:right-6">
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 16, scale: 0.96, filter: 'blur(4px)' }}
                        transition={{ type: 'spring', bounce: 0.32, duration: 0.3 }}
                        className="pointer-events-auto flex flex-col gap-3  rounded-3xl bg-neutral-200/60  p-4 text-slate-900 shadow-none backdrop-blur"
                    >
                        {ROWS.map((row) => (
                            <div key={row.label} className="flex items-center justify-between gap-6">
                                <div className="flex items-center  w-[150px]  justify-end ">
                                    <span className="text-sm font-semibold  text-slate-900">{row.label}</span>
                                </div>
                                <div className="flex items-center justify-start w-[100px]   gap-1.5">
                                    <span className="flex items-center gap-1.5 rounded-full bg-slate-900/10 px-4 py-2 text-slate-700">
                                        {row.badge.map((part, index) =>
                                            part.kind === 'icon' ? (
                                                <span key={index} className="inline-flex">
                                                    {part.node}
                                                </span>
                                            ) : (
                                                <span key={index} className="text-xs font-semibold">
                                                    {part.node}
                                                </span>
                                            ),
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
