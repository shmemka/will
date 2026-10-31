// Общие графические элементы: цвета, рваный край жёлтых блоков и несколько тёплых иллюстраций.
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


/* ---------- Иллюстрации: тонкая линия и одно жёлтое пятно ---------- */
const BG = '#FFFFFF'
const L = { fill: 'none', stroke: INK, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

type IlloProps = { className?: string; title?: string }
function Frame({ vb, className, title, children }: IlloProps & { vb: string; children: React.ReactNode }) {
  const [, , w, h] = vb.split(' ').map(Number)
  return (
    <div className={'illo ' + (className ?? '')} style={{ aspectRatio: `${w} / ${h}`, background: BG }}>
      <svg viewBox={vb} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
        {children}
      </svg>
    </div>
  )
}

/** Сопровождение: один человек склонил голову на плечо другому */
export function IlloSupport(p: IlloProps) {
  return (
    <Frame vb="0 0 320 200" {...p}>
      <circle cx="146" cy="104" r="46" fill={YEL} />
      <path d="M108 172 C108 136 120 120 140 120 C160 120 172 136 172 172" {...L} fill={BG} />
      <circle cx="140" cy="94" r="17" {...L} fill={BG} />
      <path d="M162 172 C162 144 172 132 188 132 C204 132 214 144 214 172" {...L} fill={BG} />
      <circle cx="182" cy="110" r="15" {...L} fill={BG} />
      <path d="M92 172 L230 172" {...L} />
    </Frame>
  )
}

/** Каталог: тюльпан и свеча */
export function IlloCatalog(p: IlloProps) {
  return (
    <Frame vb="0 0 320 200" {...p}>
      <circle cx="176" cy="86" r="40" fill={YEL} />
      <path d="M140 66 C132 70 130 88 134 100 C138 110 146 114 150 114 C154 114 162 110 166 100 C170 88 168 70 160 66 L155 78 L150 64 L145 78 Z" {...L} fill={BG} />
      <path d="M150 114 C150 136 148 156 150 172" {...L} />
      <path d="M149 156 C134 150 126 136 128 120 C140 126 147 140 149 156" {...L} fill={BG} />
      <rect x="186" y="122" width="18" height="50" {...L} fill={BG} />
      <path d="M195 122 L195 114" {...L} />
      <path d="M195 94 C200 102 201 106 201 108 C201 112 198 114 195 114 C192 114 189 112 189 108 C189 106 190 102 195 94 Z" {...L} fill={BG} />
      <path d="M108 172 L232 172" {...L} />
    </Frame>
  )
}

/** Для служб: лист договора с отметкой */
export function IlloPartners(p: IlloProps) {
  return (
    <Frame vb="0 0 320 200" {...p}>
      <circle cx="186" cy="130" r="34" fill={YEL} />
      <path d="M128 36 L178 36 L196 54 L196 168 L128 168 Z" {...L} fill={BG} />
      <path d="M178 36 L178 54 L196 54" {...L} />
      <path d="M142 70 L182 70 M142 84 L182 84 M142 98 L170 98" {...L} />
      <path d="M142 140 C148 132 154 148 160 140 C164 134 168 142 172 138" {...L} />
      <path d="M178 128 L186 136 L202 118" {...L} strokeWidth={2.2} />
    </Frame>
  )
}

/** Звонок: трубка и месяц, потому что мы на связи и ночью */
export function IlloCall(p: IlloProps) {
  return (
    <Frame vb="0 0 400 300" {...p}>
      <circle cx="186" cy="160" r="62" fill={YEL} />
      <path d="M150 112 C160 104 172 106 178 116 L188 134 C192 142 190 150 182 154 L172 160 C176 176 190 196 206 206 L214 196 C220 190 228 188 236 194 L252 206 C260 212 262 224 254 232 L244 242 C232 254 210 252 188 236 C160 216 138 188 130 160 C124 140 134 124 150 112 Z" {...L} fill={BG} />
      <path d="M276 76 A24 24 0 1 0 300 110 A18 18 0 1 1 276 76 Z" {...L} />
    </Frame>
  )
}

/** Вход в кабинет: ключ */
export function IlloLogin(p: IlloProps) {
  return (
    <Frame vb="0 0 480 270" {...p}>
      <g transform="translate(-118 -70) scale(1.5)">
        <circle cx="206" cy="128" r="40" fill={YEL} />
        <circle cx="196" cy="138" r="30" {...L} strokeWidth={1.2} />
        <circle cx="196" cy="138" r="9" {...L} strokeWidth={1.2} />
        <path d="M226 138 L318 138 M300 138 L300 158 M284 138 L284 152" {...L} strokeWidth={1.2} />
      </g>
    </Frame>
  )
}
