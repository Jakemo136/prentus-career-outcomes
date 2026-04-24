import { SidebarNavItem } from './SidebarNavItem'

export interface SidebarProps {
  /** Key of the currently-active item. Defaults to 'readiness'. */
  activeKey?: string
  /** Called when the user clicks the active (enabled) item. */
  onSelect?: (key: string) => void
}

interface NavItem {
  key: string
  label: string
  disabled?: boolean
  disabledHint?: string
}

const ITEMS: NavItem[] = [
  { key: 'readiness', label: 'Career Outcomes Readiness' },
  { key: 'review-queue', label: 'Review Queue', disabled: true, disabledHint: 'Coming soon' },
  { key: 'verified-earnings', label: 'Verified Earnings', disabled: true, disabledHint: 'Coming soon' },
  { key: 'compliance', label: 'Compliance Reports', disabled: true, disabledHint: 'Coming soon' },
  { key: 'surveys', label: 'Surveys & Outreach', disabled: true, disabledHint: 'Coming soon' },
  { key: 'executive', label: 'Executive Dashboards', disabled: true, disabledHint: 'Coming soon' },
  { key: 'widgets', label: 'Widgets', disabled: true, disabledHint: 'Coming soon' },
]

export function Sidebar({ activeKey = 'readiness', onSelect }: SidebarProps) {
  return (
    <aside
      aria-label="Primary navigation"
      className="w-60 h-screen bg-surface border-r border-edge-subtle flex flex-col gap-4 p-4"
    >
      <div className="flex items-center">
        <img src="/favicon.png" alt="Prentus" className="h-8 w-auto" />
      </div>
      <nav className="flex flex-col gap-1">
        {ITEMS.map((item) => (
          <SidebarNavItem
            key={item.key}
            label={item.label}
            active={item.key === activeKey}
            disabled={item.disabled}
            disabledHint={item.disabledHint}
            onClick={item.disabled ? undefined : () => onSelect?.(item.key)}
          />
        ))}
      </nav>
    </aside>
  )
}
