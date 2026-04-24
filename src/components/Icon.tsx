import { memo, useMemo } from 'react'

const rawModules = import.meta.glob('../assets/icons/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const iconsByName: Record<string, string> = {}
for (const [path, raw] of Object.entries(rawModules)) {
  const name = path.split('/').pop()!.replace(/\.svg$/, '')
  iconsByName[name] = raw
    .replace(/stroke="black"/g, 'stroke="currentColor"')
    .replace(/fill="black"/g, 'fill="currentColor"')
}

export interface IconProps {
  name: string
  size?: number | string
  className?: string
  'aria-label'?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

export const Icon = memo(function Icon({
  name,
  size = 16,
  className,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}: IconProps) {
  const raw = iconsByName[name]
  const html = useMemo(() => {
    if (!raw) return null
    return raw
      .replace(/width="\d+"/, `width="${size}"`)
      .replace(/height="\d+"/, `height="${size}"`)
  }, [raw, size])

  if (!html) return null

  return (
    <span
      className={className}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden ?? (ariaLabel ? undefined : true)}
      style={{ display: 'inline-flex', lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
})
