export interface TopBarProps {
  title: string
  subtitle?: string
  onExport?: () => void
}

export function TopBar({ title, subtitle, onExport }: TopBarProps) {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-surface-raised border-b border-edge-subtle">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-h3 text-ink">{title}</h1>
        {subtitle ? (
          <p className="text-body-xs text-muted">{subtitle}</p>
        ) : null}
      </div>
      {onExport ? (
        <button
          type="button"
          onClick={onExport}
          className="bg-surface border border-edge-strong rounded-md px-3 py-1.5 text-body-s text-ink hover:bg-surface-muted transition-colors"
        >
          Export
        </button>
      ) : null}
    </header>
  )
}
