function App() {
  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-h1 text-ink">Career Outcomes Readiness</h1>
          <p className="text-body-m text-body mt-2">
            Token smoke test — remove once real layout lands.
          </p>
        </header>

        <section className="bg-surface-raised rounded-md shadow-card p-6 border border-edge">
          <h2 className="text-h3 text-ink">Card surface</h2>
          <p className="text-body-s text-muted mt-1">
            Card with <code className="text-primary-600">shadow-card</code>,
            {' '}
            <code className="text-primary-600">rounded-md</code>,
            {' '}
            <code className="text-primary-600">border-edge</code>.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center rounded-md bg-primary-500 px-4 py-2 text-body-s font-medium text-on-primary hover:bg-primary-600 transition-colors"
          >
            Primary action
          </button>
        </section>

        <section className="space-y-2">
          <div className="flex items-center gap-2 text-body-xs text-muted">
            <div className="w-8 h-8 rounded-sm bg-primary-100 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-primary-300 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-primary-500 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-primary-700 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-primary-900 border border-edge-subtle" />
            <span>primary</span>
          </div>
          <div className="flex items-center gap-2 text-body-xs text-muted">
            <div className="w-8 h-8 rounded-sm bg-green-100 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-green-300 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-green-500 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-green-700 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-green-900 border border-edge-subtle" />
            <span>green</span>
          </div>
          <div className="flex items-center gap-2 text-body-xs text-muted">
            <div className="w-8 h-8 rounded-sm bg-orange-100 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-orange-300 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-orange-500 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-orange-700 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-orange-900 border border-edge-subtle" />
            <span>orange</span>
          </div>
          <div className="flex items-center gap-2 text-body-xs text-muted">
            <div className="w-8 h-8 rounded-sm bg-red-100 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-red-300 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-red-500 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-red-700 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-red-900 border border-edge-subtle" />
            <span>red</span>
          </div>
          <div className="flex items-center gap-2 text-body-xs text-muted">
            <div className="w-8 h-8 rounded-sm bg-grey-50 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-grey-200 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-grey-500 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-grey-700 border border-edge-subtle" />
            <div className="w-8 h-8 rounded-sm bg-grey-900 border border-edge-subtle" />
            <span>grey</span>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
