// Рисованные линейные иллюстрации: тонкий чёрный контур, жёлтые акценты, точечная штриховка.
import { useId, type CSSProperties } from 'react'

export const INK = '#212121'
export const YEL = '#FFDF4E'
export const s = { stroke: INK, strokeWidth: 2.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

/** Узор из точек для теней и штриховки. Возвращает id для fill="url(#id)". */
export function useDots(opacity = 0.45, gap = 5) {
  const raw = useId().replace(/:/g, '')
  const id = `dots${raw}`
  const def = (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse">
      <circle cx={gap / 2} cy={gap / 2} r={0.95} fill={INK} opacity={opacity} />
    </pattern>
  )
  return { id, url: `url(#${id})`, def }
}

/* ---------- Первый экран ---------- */
export function HeroScene({ className }: { className?: string }) {
  const d = useDots(0.4)
  const bg = YEL
  return (
    <svg viewBox="0 0 560 330" className={className} role="img" aria-label="Двое близких сидят рядом за столом и держатся за руки">
      <defs>{d.def}</defs>
      {/* солнце и птицы */}
      <circle cx="468" cy="74" r="36" fill="#fff" {...s} />
      <path d="M392 52 q8 -8 16 0 q8 -8 16 0" fill="none" {...s} />
      <path d="M96 64 q6 -6 12 0 q6 -6 12 0" fill="none" {...s} />
      <path d="M300 30 c-10 0 -12 -12 0 -14 c4 -10 20 -8 20 2 c10 0 10 12 0 12 z" fill="#fff" {...s} />
      {/* растение в горшке */}
      <path d="M70 300 l-6 -44 h40 l-6 44 z" fill="#fff" {...s} />
      <path d="M84 256 c-2 -28 -4 -52 6 -76" fill="none" {...s} />
      <path d="M86 214 c-22 -6 -34 -24 -30 -42 c18 2 30 18 30 42 z" fill="#fff" {...s} />
      <path d="M88 192 c18 -10 32 -30 26 -48 c-18 6 -28 26 -26 48 z" fill="#fff" {...s} />
      <path d="M86 236 c16 -4 28 -16 30 -30 c-14 0 -26 12 -30 30 z" fill="#fff" {...s} />
      {/* тень под столом */}
      <path d="M150 318 c80 10 260 8 340 -8 c-90 -6 -250 -4 -340 8 z" fill={d.url} />
      {/* первый человек */}
      <path d="M120 304 C108 236 128 180 178 162 C198 155 228 155 246 163 C288 181 300 238 292 304 Z" fill={bg} {...s} />
      <path d="M190 162 l20 26 l22 -26" fill="#fff" {...s} />
      <path d="M210 188 v60" fill="none" {...s} />
      <circle cx="210" cy="212" r="2" fill={INK} />
      <circle cx="210" cy="230" r="2" fill={INK} />
      <path d="M190 76 C188 48 236 44 240 74 C244 106 234 144 212 146 C190 148 184 112 190 76 Z" fill="#fff" {...s} />
      <path d="M190 78 c4 -22 10 -30 26 -30 c14 0 22 8 24 26 c-6 -8 -12 -12 -18 -12 c-2 6 -10 8 -16 6 c-6 6 -10 8 -16 10 z" fill={INK} />
      <circle cx="203" cy="98" r="9" fill="none" {...s} strokeWidth={1.8} />
      <circle cx="226" cy="98" r="9" fill="none" {...s} strokeWidth={1.8} />
      <path d="M212 98 h5" {...s} strokeWidth={1.8} />
      <path d="M215 104 q-5 10 1 12" fill="none" {...s} strokeWidth={1.8} />
      <path d="M206 128 q7 5 14 0" fill="none" {...s} strokeWidth={1.8} />
      {/* кружка */}
      <path d="M150 226 c4 26 28 38 54 34" fill="none" {...s} />
      <path d="M200 236 h30 v26 c0 6 -4 8 -8 8 h-14 c-4 0 -8 -2 -8 -8 z" fill="#fff" {...s} />
      <path d="M230 242 c10 0 10 14 0 14" fill="none" {...s} />
      <path d="M208 226 c-4 -6 4 -8 0 -16 M220 226 c-4 -6 4 -8 0 -16" fill="none" {...s} strokeWidth={1.6} />
      {/* второй человек */}
      <path d="M300 304 C296 248 318 210 362 202 C406 196 438 232 442 304 Z" fill="#fff" {...s} />
      <path d="M332 232 c16 14 50 16 80 0" fill="none" {...s} strokeWidth={1.8} />
      <path d="M316 250 c30 18 80 18 116 -4" fill="none" {...s} strokeWidth={1.8} />
      <path d="M352 124 C354 98 400 96 402 124 C404 152 392 180 374 180 C354 180 348 152 352 124 Z" fill="#fff" {...s} />
      <path d="M348 128 C340 100 362 82 386 88 C410 94 414 120 404 132 C396 114 372 110 348 128 Z" fill={INK} />
      <circle cx="398" cy="88" r="12" fill={INK} />
      <path d="M362 138 q5 4 10 0 M382 138 q5 4 10 0" fill="none" {...s} strokeWidth={1.8} />
      <path d="M370 160 q6 4 12 0" fill="none" {...s} strokeWidth={1.8} />
      {/* руки держатся */}
      <path d="M262 218 C270 240 276 252 286 256" fill="none" {...s} />
      <path d="M334 236 C320 250 304 256 290 256" fill="none" {...s} />
      <path d="M278 252 c6 -8 18 -8 22 0 c2 6 -4 12 -12 12 c-8 0 -12 -6 -10 -12 z" fill="#fff" {...s} />
      {/* стол */}
      <path d="M30 304 C180 292 380 282 540 288" fill="none" {...s} strokeWidth={2.6} />
      {/* свеча и фото */}
      <path d="M462 236 h18 v48 h-18 z" fill="#fff" {...s} />
      <path d="M471 236 v-8" {...s} />
      <path d="M471 204 c8 8 8 18 0 22 c-8 -4 -8 -14 0 -22 z" fill="#fff" {...s} />
      <path d="M494 226 l40 -4 l4 54 l-40 4 z" fill="#fff" {...s} />
      <path d="M512 252 c-6 -6 -14 0 -8 8 l8 8 l8 -8 c6 -8 -2 -14 -8 -8 z" fill={INK} />
    </svg>
  )
}

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

export function DotDeco({ style, className }: { style?: CSSProperties; className?: string }) {
  const d = useDots(0.9, 9)
  return (
    <svg viewBox="0 0 400 400" className={className ?? 'dotdeco'} style={style} aria-hidden="true">
      <defs>
        <pattern id={d.id + 'w'} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="2.4" fill="#fff" />
        </pattern>
      </defs>
      <circle cx="200" cy="200" r="200" fill={`url(#${d.id}w)`} />
    </svg>
  )
}

/* ---------- Иллюстрации разделов ---------- */
export function OrganizeArt({ className }: { className?: string }) {
  const d = useDots()
  return (
    <svg viewBox="0 0 260 220" className={className} aria-hidden="true">
      <defs>{d.def}</defs>
      <ellipse cx="130" cy="204" rx="96" ry="10" fill={d.url} />
      <path d="M70 204 C58 150 72 110 112 98 C132 92 160 94 176 104 C206 122 214 160 206 204 Z" fill="#fff" {...s} />
      <path d="M112 40 C110 16 156 14 158 42 C160 72 150 96 134 96 C116 96 108 70 112 40 Z" fill="#fff" {...s} />
      <path d="M112 44 c2 -20 12 -28 26 -28 c14 0 20 10 20 22 c-10 -6 -22 -6 -46 6 z" fill={INK} />
      <circle cx="126" cy="60" r="2" fill={INK} /><circle cx="146" cy="60" r="2" fill={INK} />
      <path d="M134 64 q-4 8 2 10 M128 82 q8 4 14 0" fill="none" {...s} strokeWidth={1.8} />
      <path d="M150 112 l52 -10 l14 82 l-52 10 z" fill="#fff" {...s} />
      <path d="M170 104 l14 -3 l2 8 l-14 3 z" fill={YEL} {...s} />
      <path d="M164 130 l6 6 l10 -12 M168 154 l6 6 l10 -12" fill="none" {...s} />
      <path d="M188 128 l18 -3 M192 152 l18 -3 M196 174 l16 -3" fill="none" {...s} strokeWidth={1.8} />
      <path d="M100 140 c20 18 40 24 56 14" fill="none" {...s} />
      <path d="M40 60 l6 -6 l6 6 l-6 6 z M220 40 l5 -5 l5 5 l-5 5 z" fill={YEL} {...s} strokeWidth={1.6} />
    </svg>
  )
}

export function CatalogArt({ className }: { className?: string }) {
  const d = useDots()
  return (
    <svg viewBox="0 0 260 220" className={className} aria-hidden="true">
      <defs>{d.def}</defs>
      <ellipse cx="130" cy="202" rx="104" ry="10" fill={d.url} />
      {/* венок */}
      <circle cx="80" cy="120" r="46" fill="#fff" {...s} />
      <circle cx="80" cy="120" r="24" fill="#fff" {...s} />
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const x = 80 + 35 * Math.cos((a * Math.PI) / 180), y = 120 + 35 * Math.sin((a * Math.PI) / 180)
        return <g key={a}><circle cx={x} cy={y} r="9" fill="#fff" {...s} strokeWidth={1.8} /><circle cx={x} cy={y} r="3" fill={YEL} /></g>
      })}
      <path d="M68 164 l-10 32 M92 164 l10 32" fill="none" {...s} strokeWidth={4} />
      {/* свеча */}
      <path d="M150 120 h24 v76 h-24 z" fill="#fff" {...s} />
      <path d="M150 140 h24" fill="none" {...s} strokeWidth={1.6} />
      <path d="M162 120 v-10" {...s} />
      <path d="M162 80 c10 10 10 22 0 28 c-10 -6 -10 -18 0 -28 z" fill={YEL} {...s} />
      {/* урна */}
      <path d="M196 136 h34 v8 c14 8 16 22 12 36 c-4 12 -16 16 -29 16 c-13 0 -25 -4 -29 -16 c-4 -14 -2 -28 12 -36 z" fill="#fff" {...s} />
      <path d="M190 164 h46" fill="none" {...s} />
      <path d="M190 164 h46 v8 h-46 z" fill={YEL} {...s} strokeWidth={1.8} />
      <path d="M200 128 h26 v8 h-26 z" fill="#fff" {...s} />
    </svg>
  )
}

export function PhoneArt({ className }: { className?: string }) {
  const d = useDots(0.5)
  return (
    <svg viewBox="0 0 260 240" className={className} aria-hidden="true">
      <defs>{d.def}</defs>
      <ellipse cx="130" cy="222" rx="90" ry="10" fill={d.url} />
      <path d="M58 216 C56 170 82 146 130 146 C178 146 204 170 202 216 Z" fill="#fff" {...s} />
      <circle cx="130" cy="186" r="26" fill="#fff" {...s} />
      <circle cx="130" cy="186" r="9" fill={YEL} {...s} />
      {[0, 45, 90, 135, 180, 225, 270].map((a) => (
        <circle key={a} cx={130 + 18 * Math.cos((a * Math.PI) / 180)} cy={186 + 18 * Math.sin((a * Math.PI) / 180)} r="3.4" fill="#fff" {...s} strokeWidth={1.4} />
      ))}
      <path d="M72 136 C80 110 110 100 130 100 C150 100 180 110 188 136 C190 146 178 150 170 144 C164 134 150 128 130 128 C110 128 96 134 90 144 C82 150 70 146 72 136 Z" fill="#fff" {...s} />
      <path d="M132 100 C130 70 128 40 132 4" fill="none" {...s} />
      <path d="M116 108 c0 -14 8 -20 18 -20 c10 0 16 8 14 20" fill="#fff" {...s} />
      <path d="M200 196 c16 -4 20 -20 10 -30 c-10 -10 0 -24 14 -20" fill="none" {...s} strokeWidth={1.8} strokeDasharray="1 6" />
      <path d="M30 120 c-10 0 -12 -12 0 -14 c4 -10 20 -8 20 2 c10 0 10 12 0 12 z" fill="#fff" {...s} strokeWidth={1.8} />
      <path d="M214 76 c-8 0 -10 -10 0 -11 c3 -8 16 -6 16 2 c8 0 8 9 0 9 z" fill="#fff" {...s} strokeWidth={1.8} />
    </svg>
  )
}

export function CandleArt({ className }: { className?: string }) {
  const d = useDots()
  return (
    <svg viewBox="0 0 260 220" className={className} aria-hidden="true">
      <defs>{d.def}</defs>
      <ellipse cx="130" cy="204" rx="80" ry="9" fill={d.url} />
      <path d="M112 96 h36 v108 h-36 z" fill="#fff" {...s} />
      <path d="M112 116 c12 6 24 6 36 0" fill="none" {...s} strokeWidth={1.6} />
      <path d="M130 96 v-12" {...s} />
      <path d="M130 30 c18 18 18 40 0 50 c-18 -10 -18 -32 0 -50 z" fill={YEL} {...s} />
      <path d="M130 52 c6 6 6 14 0 18 c-6 -4 -6 -12 0 -18 z" fill="#fff" {...s} strokeWidth={1.6} />
      <path d="M70 204 c-4 -22 -10 -40 -24 -56 M70 204 c2 -24 8 -38 18 -50" fill="none" {...s} />
      <circle cx="44" cy="142" r="10" fill="#fff" {...s} /><circle cx="44" cy="142" r="3.5" fill={YEL} />
      <circle cx="90" cy="150" r="9" fill="#fff" {...s} /><circle cx="90" cy="150" r="3" fill={YEL} />
      <path d="M196 204 c0 -20 4 -36 14 -48" fill="none" {...s} />
      <circle cx="212" cy="150" r="10" fill="#fff" {...s} /><circle cx="212" cy="150" r="3.5" fill={YEL} />
    </svg>
  )
}

export function HandshakeArt({ className }: { className?: string }) {
  const d = useDots()
  return (
    <svg viewBox="0 0 260 200" className={className} aria-hidden="true">
      <defs>{d.def}</defs>
      <ellipse cx="130" cy="186" rx="96" ry="9" fill={d.url} />
      <path d="M10 92 L72 70 L94 120 L34 144 Z" fill={YEL} {...s} />
      <path d="M250 92 L188 70 L166 120 L226 144 Z" fill="#fff" {...s} />
      <path d="M78 82 C102 70 124 74 140 90 L170 120 C178 130 166 140 156 132 L132 112" fill="#fff" {...s} />
      <path d="M182 82 C160 72 140 76 124 92 L98 120 C90 130 100 140 110 134 L136 116" fill="#fff" {...s} />
      <path d="M112 132 c8 8 18 8 22 2 M124 140 c8 6 16 6 20 0" fill="none" {...s} strokeWidth={1.8} />
    </svg>
  )
}

export function BenchArt({ className }: { className?: string }) {
  const d = useDots()
  return (
    <svg viewBox="0 0 300 200" className={className} aria-hidden="true">
      <defs>{d.def}</defs>
      <path d="M150 140 a70 70 0 0 1 140 0 z" fill={YEL} {...s} />
      <path d="M20 140 H290" {...s} />
      <path d="M30 150 c60 14 190 14 250 0 c-60 -6 -190 -6 -250 0 z" fill={d.url} />
      <path d="M60 140 V70" {...s} />
      <path d="M60 80 c-36 -2 -50 -30 -30 -50 c10 -14 36 -16 46 0 c22 4 26 34 8 46 c-6 4 -16 6 -24 4 z" fill="#fff" {...s} />
      <path d="M110 104 h96 M110 116 h96" fill="none" {...s} />
      <path d="M104 128 h108 v6 h-108 z" fill="#fff" {...s} />
      <path d="M114 134 v8 M202 134 v8 M112 104 v24 M204 104 v24" fill="none" {...s} />
      <path d="M210 40 q6 -6 12 0 q6 -6 12 0" fill="none" {...s} />
    </svg>
  )
}

/** Небольшой знак: одна маленькая картинка для пустых состояний */
export function SmallHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <path d="M60 88 C30 70 14 54 14 36 A20 20 0 0 1 60 28 A20 20 0 0 1 106 36 C106 54 90 70 60 88 Z" fill={YEL} {...s} />
      <path d="M40 40 c4 -8 12 -10 18 -6" fill="none" {...s} strokeWidth={1.8} />
    </svg>
  )
}
