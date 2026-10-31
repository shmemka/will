// Общие графические элементы: цвета и рваный край жёлтых блоков. Иллюстраций на сайте нет, только фотографии.
export const INK = '#212121'
export const YEL = '#FFDF4E'

/** Рваный нижний край жёлтого блока, как в референсе */
const TORN = (() => {
  let seed = 7
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const pts: string[] = []
  for (let x = 0; x <= 1440; x += 9) {
    const arc = Math.sin((x / 1440) * Math.PI) * 34
    const y = 14 + arc + (r() - 0.5) * 7 + (r() > 0.92 ? 5 : 0)
    pts.push(`${x},${y.toFixed(1)}`)
  }
  return `M0,0 L1440,0 L${pts.reverse().join(' L')} Z`
})()
export function TornEdge({ color = YEL, flip, className }: { color?: string; flip?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className={(className ?? 'torn') + (flip ? ' torn-top' : '')} aria-hidden="true">
      <path d={TORN} fill={color} />
    </svg>
  )
}

