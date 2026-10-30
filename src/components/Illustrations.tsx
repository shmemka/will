// Тёплые плоские иллюстрации для главных экранов. Оригинальные, в духе мягкой плоской графики.
const INK = '#23233f'
const s = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

export function HeroScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 420" className={className} role="img" aria-label="Двое близких людей сидят рядом за столом при свете свечи">
      <path d="M78 330 C20 250 60 120 180 90 C300 60 470 90 490 220 C505 320 420 380 300 384 C190 388 120 380 78 330 Z" fill="#ffdf4e" />
      <circle cx="420" cy="92" r="26" fill="#fff3b8" />
      {/* окно */}
      <rect x="330" y="120" width="110" height="120" rx="14" fill="#dfeaf7" {...s} />
      <path d="M385 120 V240 M330 180 H440" {...s} />
      {/* растение */}
      <path d="M112 258 V200" {...s} />
      <path d="M112 214 C88 200 84 178 96 166 C112 178 116 196 112 214 Z" fill="#3d7a55" {...s} />
      <path d="M112 226 C134 214 140 192 128 180 C114 192 108 210 112 226 Z" fill="#3d7a55" {...s} />
      <path d="M96 258 H128 L122 290 H102 Z" fill="#fbe3da" {...s} />
      {/* человек слева */}
      <circle cx="200" cy="170" r="30" fill="#f1d3b9" {...s} />
      <path d="M172 160 C172 132 228 128 230 162 C214 150 192 150 172 160 Z" fill="#6b4a3a" {...s} />
      <path d="M146 300 C146 236 170 212 200 212 C232 212 252 236 256 270 L238 300 Z" fill="#2f3f66" {...s} />
      {/* человек справа */}
      <circle cx="310" cy="182" r="28" fill="#e9bf9b" {...s} />
      <path d="M284 176 C280 146 336 142 338 174 C322 164 300 164 284 176 Z" fill="#23233f" {...s} />
      <path d="M262 302 C262 246 284 222 312 222 C342 222 360 248 362 302 Z" fill="#c2454f" {...s} />
      {/* стол */}
      <path d="M110 300 H420" {...s} strokeWidth={5} />
      <path d="M150 300 V360 M380 300 V360" {...s} strokeWidth={5} />
      {/* свеча и чашки */}
      <rect x="244" y="262" width="20" height="38" rx="3" fill="#fff7e0" {...s} />
      <path d="M254 236 C264 248 262 258 254 262 C246 258 244 248 254 236 Z" fill="#ffb52e" {...s} />
      <path d="M180 284 H206 V300 H180 Z" fill="#ffffff" {...s} />
      <path d="M206 288 C214 288 214 296 206 296" fill="none" {...s} />
      <path d="M310 284 H336 V300 H310 Z" fill="#ffffff" {...s} />
      <path d="M180 278 C184 270 178 266 182 258 M322 278 C326 270 320 266 324 258" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" opacity={0.5} />
    </svg>
  )
}

export function SupportArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      <circle cx="120" cy="104" r="86" fill="#fff3b8" />
      <path d="M62 150 C62 100 92 84 120 84 C148 84 178 100 178 150 Z" fill="#dfeaf7" {...s} />
      <path d="M120 140 C96 124 80 112 80 96 A18 18 0 0 1 120 88 A18 18 0 0 1 160 96 C160 112 144 124 120 140 Z" fill="#c2454f" {...s} />
      <path d="M62 150 C74 128 92 122 108 128 M178 150 C166 128 148 122 132 128" fill="#f1d3b9" {...s} />
    </svg>
  )
}

export function CatalogArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      <circle cx="120" cy="104" r="86" fill="#dff0e5" />
      <rect x="62" y="56" width="52" height="52" rx="10" fill="#ffffff" {...s} />
      <rect x="126" y="56" width="52" height="52" rx="10" fill="#ffffff" {...s} />
      <rect x="62" y="118" width="52" height="40" rx="10" fill="#ffffff" {...s} />
      <rect x="126" y="118" width="52" height="40" rx="10" fill="#ffdf4e" {...s} />
      <circle cx="88" cy="82" r="12" fill="#c2454f" {...s} />
      <path d="M140 92 L152 70 L164 92 Z" fill="#3d7a55" {...s} />
      <path d="M140 138 l8 8 16-16" fill="none" {...s} />
    </svg>
  )
}

export function PhoneArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      <circle cx="120" cy="100" r="84" fill="#fbe3da" />
      <rect x="88" y="40" width="64" height="120" rx="12" fill="#ffffff" {...s} />
      <path d="M110 52 H130" {...s} />
      <path d="M100 80 H140 M100 96 H132 M100 112 H136" stroke={INK} strokeWidth={3} strokeLinecap="round" opacity={0.35} />
      <path d="M150 120 C176 112 190 128 182 146 C176 160 156 164 140 160" fill="#f1d3b9" {...s} />
      <circle cx="176" cy="66" r="14" fill="#ffdf4e" {...s} />
      <path d="M170 66 l4 4 8-8" fill="none" {...s} />
    </svg>
  )
}

export function CandleArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      <circle cx="120" cy="104" r="86" fill="#ebe5f7" />
      <rect x="104" y="92" width="32" height="70" rx="4" fill="#fff7e0" {...s} />
      <path d="M120 92 V80" {...s} />
      <path d="M120 44 C138 62 134 76 120 80 C106 76 102 62 120 44 Z" fill="#ffb52e" {...s} />
      <path d="M80 162 H160" {...s} />
    </svg>
  )
}

export function HandshakeArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      <circle cx="120" cy="100" r="84" fill="#dfeaf7" />
      <path d="M40 120 L84 86 L120 100 L156 86 L200 120" fill="none" {...s} />
      <path d="M84 86 C100 76 116 78 128 92 L150 116 C156 124 146 132 138 126 L120 110" fill="#f1d3b9" {...s} />
      <path d="M156 86 C140 76 124 80 112 94 L94 116 C88 124 98 132 106 126 L124 108" fill="#e9bf9b" {...s} />
    </svg>
  )
}
