// Atom Ctrl logo component used across the app (header, sidebar, chat)
import { useId } from 'react'

interface AtomLogoProps {
    className?: string
    size?: number
    ariaLabel?: string
    title?: string
}

export function AtomLogo({ className = '', size = 64, ariaLabel, title }: AtomLogoProps) {
    const reactId = useId()
    const uniqueId = `atom-logo-${reactId}`

    return (
        <svg
            viewBox="0 0 64 64"
            width={size}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            role="img"
            aria-label={ariaLabel}>
            {title ? <title>{title}</title> : null}
            <defs>
                <linearGradient id={`${uniqueId}-back`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient id={`${uniqueId}-front`} x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.9" />
                </linearGradient>
            </defs>

            <ellipse
                cx="32"
                cy="32"
                rx="22"
                ry="10"
                stroke={`url(#${uniqueId}-back)`}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                transform="rotate(45 32 32)"
            />

            <ellipse
                cx="32"
                cy="32"
                rx="22"
                ry="10"
                stroke={`url(#${uniqueId}-front)`}
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                transform="rotate(-45 32 32)"
            />
        </svg>
    )
}
