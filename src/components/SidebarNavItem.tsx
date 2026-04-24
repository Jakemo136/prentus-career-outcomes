import type { ReactNode } from 'react'

export interface SidebarNavItemProps {
  label: string
  icon?: ReactNode
  active?: boolean
  disabled?: boolean
  disabledHint?: string
  onClick?: () => void
}

const baseClass =
  'flex items-center gap-2 w-full rounded-md px-3 py-2 text-body-s text-body transition-colors text-left'
const activeClass = 'bg-surface-raised shadow-card text-ink font-medium'
const hoverClass = 'hover:bg-surface-muted'
const disabledClass = 'text-muted opacity-60 cursor-not-allowed'

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="w-3 h-3 text-muted"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export function SidebarNavItem({
  label,
  icon,
  active = false,
  disabled = false,
  disabledHint,
  onClick,
}: SidebarNavItemProps) {
  const classes = [
    baseClass,
    disabled ? disabledClass : active ? activeClass : hoverClass,
  ].join(' ')

  return (
    <button
      type="button"
      className={classes}
      onClick={disabled ? undefined : onClick}
      disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      aria-current={active && !disabled ? 'page' : undefined}
      title={disabled && disabledHint ? disabledHint : undefined}
    >
      {icon ? (
        <span aria-hidden="true" className="flex items-center">
          {icon}
        </span>
      ) : null}
      <span className="flex-1">{label}</span>
      {disabled ? <LockIcon /> : null}
    </button>
  )
}
