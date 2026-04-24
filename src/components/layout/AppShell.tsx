import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export interface AppShellProps {
  /** Page title rendered by TopBar. */
  pageTitle: string
  /** Optional subtitle / breadcrumb. */
  pageSubtitle?: string
  /** Which sidebar item is active. Defaults to 'readiness'. */
  activeNavKey?: string
  /** Export handler forwarded to TopBar's Export button. Omit to hide. */
  onExport?: () => void
  /** Page body content rendered in the main area below the TopBar. */
  children: ReactNode
}

export function AppShell({
  pageTitle,
  pageSubtitle,
  activeNavKey,
  onExport,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar activeKey={activeNavKey ?? 'readiness'} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={pageTitle} subtitle={pageSubtitle} onExport={onExport} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}
