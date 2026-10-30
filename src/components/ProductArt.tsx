// Рисованные картинки товаров (в MVP вместо фотографий). Три «ракурса» на каждый товар.
// Когда у служб появятся настоящие фото, их можно хранить в Supabase Storage и подставлять вместо этого компонента.
import type { ArtKind } from '../data/catalog'
import { INK, YEL, s, useDots } from './Illustrations'

const BG = ['#f9f9f9', '#fffbea', '#f4f4f4', '#fff6cc', '#f6f6f2']
const W = '#ffffff'

function Shape({ kind, p, dots }: { kind: ArtKind; p: number; dots: string }) {
  const accent = p % 2 ? YEL : W
  switch (kind) {
    case 'coffin':
      return (
        <g {...s}>
          <path d="M36 74 L58 52 H150 L170 66 V88 L150 102 H58 L36 90 Z" fill={W} />
          <path d="M58 52 L66 76 H162 L170 66" fill="none" />
          <path d="M36 74 L66 76 L58 102" fill="none" />
          <path d="M66 76 H162 V88 L150 102 H58 Z" fill={dots} stroke="none" />
          <path d="M80 62 h60" fill="none" strokeWidth={1.6} opacity={0.5} />
          <rect x="92" y="84" width="12" height="5" rx="2" fill={YEL} />
          <rect x="124" y="84" width="12" height="5" rx="2" fill={YEL} />
        </g>
      )
    case 'coffin-simple':
      return (
        <g {...s}>
          <path d="M40 70 L58 52 H152 L166 64 V90 L152 102 H56 L40 88 Z" fill={W} />
          <path d="M58 52 L64 76 H160" fill="none" />
          <path d="M84 76 V102 M112 76 V102 M140 76 V102 M72 60 H146" fill="none" strokeWidth={1.6} opacity={0.6} />
        </g>
      )
    case 'stretcher':
      return (
        <g {...s}>
          <path d="M50 62 Q100 34 150 62 V78 H50 Z" fill={accent} />
          <path d="M60 70 q40 -18 80 0" fill="none" strokeWidth={1.6} />
          <rect x="44" y="78" width="112" height="12" rx="3" fill={W} />
          <path d="M26 84 H44 M156 84 H176 M60 90 V110 M140 90 V110" fill="none" />
        </g>
      )
    case 'urn':
      return (
        <g {...s}>
          <path d="M82 40 H118 V50 Q140 60 138 86 Q134 112 100 114 Q66 112 62 86 Q60 60 82 50 Z" fill={W} />
          <path d="M80 30 h40 v10 h-40 z" fill={W} />
          <path d="M64 76 H136 V88 H64 Z" fill={accent === W ? YEL : W} />
          <path d="M70 96 q30 14 60 0" fill="none" strokeWidth={1.6} opacity={0.5} />
          <path d="M108 54 q14 8 16 26" fill="none" strokeWidth={1.6} opacity={0.5} />
        </g>
      )
    case 'urn-wood':
      return (
        <g {...s}>
          <rect x="66" y="56" width="68" height="56" rx="4" fill={W} />
          <rect x="60" y="46" width="80" height="12" rx="3" fill={W} />
          <rect x="82" y="72" width="36" height="18" rx="2" fill={YEL} />
          <path d="M72 100 q12 -4 24 0 t24 0" fill="none" strokeWidth={1.4} opacity={0.5} />
        </g>
      )
    case 'wreath':
      return (
        <g {...s}>
          <circle cx="100" cy="72" r="40" fill={W} />
          <circle cx="100" cy="72" r="20" fill={dots} stroke="none" />
          <circle cx="100" cy="72" r="20" fill="none" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const x = 100 + 30 * Math.cos((a * Math.PI) / 180), y = 72 + 30 * Math.sin((a * Math.PI) / 180)
            return (
              <g key={a}>
                <path d={`M${x - 8} ${y} q8 -8 16 0`} fill="none" strokeWidth={1.4} />
                {a % 90 === 0 && <><circle cx={x} cy={y} r="8" fill={W} strokeWidth={1.8} /><circle cx={x} cy={y} r="3" fill={p % 2 ? YEL : INK} stroke="none" /></>}
              </g>
            )
          })}
          <path d="M88 110 L80 132 M112 110 L120 132" fill="none" strokeWidth={4} />
        </g>
      )
    case 'basket':
      return (
        <g {...s}>
          <path d="M54 80 H146 L134 114 H66 Z" fill={W} />
          <path d="M60 92 H140 M64 104 H136 M80 80 L84 114 M100 80 V114 M120 80 L116 114" fill="none" strokeWidth={1.4} opacity={0.6} />
          {[66, 84, 102, 120, 136].map((x, i) => (
            <g key={x}><circle cx={x} cy={70 - (i % 2) * 10} r="11" fill={W} strokeWidth={1.8} /><circle cx={x} cy={70 - (i % 2) * 10} r="4" fill={i % 2 ? YEL : W} /></g>
          ))}
          <path d="M58 80 Q100 56 142 80" fill="none" />
        </g>
      )
    case 'bouquet':
      return (
        <g {...s}>
          <path d="M100 120 L82 66 M100 120 L100 58 M100 120 L118 66" fill="none" />
          {[[82, 58], [100, 46], [118, 58], [90, 74], [110, 74]].map(([x, y], i) => (
            <g key={i}><circle cx={x} cy={y} r="10" fill={W} /><circle cx={x} cy={y} r="3.5" fill={i % 2 ? INK : YEL} stroke="none" /></g>
          ))}
          <path d="M86 98 L100 124 L114 98 Z" fill={YEL} />
        </g>
      )
    case 'ribbon':
      return (
        <g {...s}>
          <path d="M44 56 H156 V80 H44 Z" fill={W} />
          <path d="M60 68 H140" fill="none" strokeWidth={1.6} strokeDasharray="8 5" />
          <path d="M70 80 L60 118 L76 110 L86 122 L94 80" fill={YEL} />
          <path d="M108 80 L116 122 L124 110 L140 118 L130 80" fill={W} />
        </g>
      )
    case 'cross-wood':
    case 'cross-metal':
      return (
        <g {...s}>
          <rect x="93" y="22" width="14" height="102" rx="1" fill={kind === 'cross-metal' ? dots : W} />
          <rect x="93" y="22" width="14" height="102" rx="1" fill="none" />
          <rect x="68" y="44" width="64" height="12" rx="1" fill={W} />
          <rect x="80" y="84" width="40" height="8" rx="1" transform="rotate(-12 100 88)" fill={W} />
          <rect x="84" y="62" width="32" height="16" rx="1" fill={YEL} />
          {kind === 'cross-wood' && <path d="M97 30 v12 M103 96 v20" fill="none" strokeWidth={1.2} opacity={0.6} />}
          <path d="M56 124 Q100 116 144 124" fill="none" />
        </g>
      )
    case 'plate':
      return (
        <g {...s}>
          <rect x="60" y="40" width="80" height="54" rx="3" fill={W} />
          <path d="M74 56 H126 M80 68 H120 M90 80 H110" fill="none" strokeWidth={1.6} opacity={0.6} />
          <path d="M100 94 V124" fill="none" />
          <path d="M60 124 Q100 116 140 124" fill="none" />
          <circle cx="132" cy="48" r="3" fill={YEL} />
        </g>
      )
    case 'stele':
      return (
        <g {...s}>
          <path d="M70 124 V60 Q70 34 100 34 Q130 34 130 60 V124 Z" fill={W} />
          <path d="M112 40 Q130 46 130 64 V124 H112 Z" fill={dots} stroke="none" />
          <ellipse cx="100" cy="64" rx="12" ry="14" fill={YEL} />
          <path d="M84 92 H116 M88 104 H112" fill="none" strokeWidth={1.6} />
          <path d="M56 126 H144" fill="none" />
        </g>
      )
    case 'textile':
      return (
        <g {...s}>
          <path d="M44 74 Q100 56 156 74 L152 112 Q100 96 48 112 Z" fill={W} />
          <path d="M56 92 Q100 80 144 92 M60 102 Q100 92 140 102" fill="none" strokeWidth={1.4} opacity={0.5} />
          <path d="M58 50 Q80 42 104 50 Q110 62 104 76 Q80 82 58 76 Q52 62 58 50 Z" fill={accent} />
        </g>
      )
    case 'clothes':
      return (
        <g {...s}>
          <path d="M80 36 L100 46 L120 36 L148 52 L138 72 L126 66 V122 H74 V66 L62 72 L52 52 Z" fill={W} />
          <path d="M100 46 L92 70 L100 122 M100 46 L108 70 L100 122" fill="none" />
          <path d="M92 70 L100 80 L108 70" fill={YEL} />
          <circle cx="100" cy="94" r="2" fill={INK} /><circle cx="100" cy="106" r="2" fill={INK} />
        </g>
      )
    case 'kit':
      return (
        <g {...s}>
          <rect x="50" y="58" width="44" height="58" rx="2" fill={YEL} />
          <path d="M72 70 V98 M62 80 H82" fill="none" strokeWidth={2.4} />
          <rect x="104" y="48" width="48" height="66" rx="2" fill={W} />
          <path d="M112 62 H144 M112 72 H144 M112 82 H138 M112 92 H142" fill="none" strokeWidth={1.4} opacity={0.6} />
          <path d="M128 26 V42 M122 32 H134" fill="none" />
        </g>
      )
    case 'shroud':
      return (
        <g {...s}>
          <path d="M58 48 H142 L134 118 H66 Z" fill={W} />
          <path d="M58 48 Q100 66 142 48" fill="none" />
          <path d="M78 70 L74 112 M100 72 V114 M122 70 L126 112" fill="none" strokeWidth={1.4} opacity={0.4} />
          <path d="M66 118 H134 L132 108 H68 Z" fill={dots} stroke="none" />
        </g>
      )
    case 'care':
      return (
        <g {...s}>
          <path d="M100 112 C70 92 54 78 54 60 A22 22 0 0 1 100 52 A22 22 0 0 1 146 60 C146 78 130 92 100 112 Z" fill={YEL} />
          <path d="M30 108 C46 98 62 100 74 112 L96 128 M170 108 C154 98 138 100 126 112 L104 128" fill={W} />
        </g>
      )
    case 'cold':
      return (
        <g {...s}>
          <rect x="54" y="40" width="92" height="76" rx="4" fill={W} />
          <path d="M100 52 V104 M78 64 L122 92 M78 92 L122 64" fill="none" />
          <circle cx="100" cy="78" r="8" fill={YEL} />
        </g>
      )
    case 'hearse':
      return (
        <g {...s}>
          <path d="M26 96 V72 L54 54 H140 L170 70 V96 Z" fill={W} />
          <path d="M60 60 H100 V78 H56 Z M106 60 H136 L152 74 V78 H106 Z" fill={dots} />
          <path d="M26 86 H170" fill="none" strokeWidth={1.6} />
          <circle cx="60" cy="98" r="12" fill={W} /><circle cx="60" cy="98" r="4" fill={YEL} />
          <circle cx="138" cy="98" r="12" fill={W} /><circle cx="138" cy="98" r="4" fill={YEL} />
        </g>
      )
    case 'bus':
      return (
        <g {...s}>
          <rect x="30" y="48" width="140" height="52" rx="8" fill={W} />
          {[42, 68, 94, 120].map((x) => <rect key={x} x={x} y="56" width="20" height="16" rx="2" fill={dots} />)}
          <rect x="146" y="56" width="16" height="30" rx="2" fill={W} />
          <path d="M30 84 H170" fill="none" stroke={YEL} strokeWidth={6} />
          <circle cx="62" cy="102" r="11" fill={W} /><circle cx="140" cy="102" r="11" fill={W} />
        </g>
      )
    case 'people':
      return (
        <g {...s}>
          {[62, 100, 138].map((x, i) => (
            <g key={x}>
              <path d={`M${x - 22} 120 C${x - 24} 90 ${x - 14} 76 ${x} 76 C${x + 14} 76 ${x + 24} 90 ${x + 22} 120 Z`} fill={i === 1 ? YEL : W} />
              <path d={`M${x - 10} 52 C${x - 10} 36 ${x + 12} 36 ${x + 12} 52 C${x + 12} 66 ${x + 6} 72 ${x + 1} 72 C${x - 5} 72 ${x - 10} 66 ${x - 10} 52 Z`} fill={W} />
              <circle cx={x - 2} cy={54} r="1.5" fill={INK} /><circle cx={x + 6} cy={54} r="1.5" fill={INK} />
            </g>
          ))}
        </g>
      )
    case 'hall':
      return (
        <g {...s}>
          <path d="M36 120 V56 L100 30 L164 56 V120 Z" fill={W} />
          <path d="M56 120 V68 M76 120 V68 M124 120 V68 M144 120 V68" fill="none" />
          <rect x="88" y="90" width="24" height="30" fill={YEL} />
          <path d="M92 90 V78 M108 90 V78" fill="none" />
          <path d="M92 70 c3 3 3 6 0 8 c-3 -2 -3 -5 0 -8 z M108 70 c3 3 3 6 0 8 c-3 -2 -3 -5 0 -8 z" fill={YEL} />
        </g>
      )
    case 'church':
      return (
        <g {...s}>
          <rect x="62" y="70" width="76" height="50" fill={W} />
          <path d="M80 70 Q80 46 100 42 Q120 46 120 70 Z" fill={YEL} />
          <path d="M100 42 V22 M93 29 H107" fill="none" />
          <path d="M92 120 V98 Q100 90 108 98 V120" fill={dots} />
          <path d="M72 84 v12 M128 84 v12" fill="none" strokeWidth={1.6} />
        </g>
      )
    case 'mosque':
      return (
        <g {...s}>
          <rect x="58" y="72" width="80" height="48" fill={W} />
          <path d="M68 72 Q68 44 98 40 Q128 44 128 72 Z" fill={YEL} />
          <rect x="146" y="44" width="12" height="76" fill={W} />
          <path d="M146 44 L152 30 L158 44" fill={W} />
          <path d="M98 40 V28" fill="none" />
          <path d="M94 24 a5 5 0 1 0 6 -2 a4 4 0 1 1 -6 2 z" fill={INK} stroke="none" />
          <path d="M90 120 V100 Q98 90 106 100 V120" fill={dots} />
        </g>
      )
    case 'candle':
      return (
        <g {...s}>
          <rect x="88" y="62" width="24" height="56" rx="1" fill={W} />
          <path d="M88 76 c8 4 16 4 24 0" fill="none" strokeWidth={1.4} />
          <path d="M100 62 V54" fill="none" />
          <path d="M100 28 Q114 42 100 54 Q86 42 100 28 Z" fill={YEL} />
          <path d="M66 118 H134" fill="none" />
        </g>
      )
    case 'music':
      return (
        <g {...s}>
          <path d="M84 104 V50 L134 40 V94" fill="none" strokeWidth={3} />
          <path d="M84 62 L134 52" fill="none" strokeWidth={3} />
          <ellipse cx="74" cy="104" rx="12" ry="9" fill={YEL} />
          <ellipse cx="124" cy="94" rx="12" ry="9" fill={W} />
        </g>
      )
    case 'grave':
      return (
        <g {...s}>
          <path d="M36 118 Q100 82 164 118 Z" fill={W} />
          <path d="M60 112 Q100 92 140 112" fill="none" strokeWidth={1.4} opacity={0.5} />
          <path d="M100 98 V40 M86 54 H114" fill="none" strokeWidth={3} />
          <circle cx="132" cy="104" r="7" fill={YEL} /><circle cx="68" cy="106" r="6" fill={W} />
          <path d="M152 118 V74" fill="none" />
          <path d="M152 78 c-14 -2 -20 -14 -12 -24 c4 -10 20 -10 24 0 c8 10 2 22 -12 24 z" fill={W} />
          <path d="M30 120 H170" fill="none" />
        </g>
      )
    case 'cremation':
      return (
        <g {...s}>
          <path d="M50 120 V64 L100 40 L150 64 V120 Z" fill={W} />
          <rect x="128" y="30" width="12" height="28" fill={W} />
          <path d="M134 22 q6 -6 0 -12" fill="none" strokeWidth={1.6} opacity={0.6} />
          <path d="M84 120 V88 Q100 76 116 88 V120" fill={dots} />
          <path d="M100 96 c6 6 6 12 0 16 c-6 -4 -6 -10 0 -16 z" fill={YEL} />
        </g>
      )
    case 'docs':
      return (
        <g {...s}>
          <rect x="64" y="34" width="64" height="84" rx="3" fill={W} transform="rotate(-6 96 76)" />
          <rect x="74" y="40" width="64" height="84" rx="3" fill={W} />
          <path d="M86 58 H126 M86 70 H126 M86 82 H114" fill="none" strokeWidth={1.6} opacity={0.6} />
          <circle cx="120" cy="104" r="10" fill={YEL} />
          <path d="M116 104 l3 3 l6 -6" fill="none" strokeWidth={1.8} />
        </g>
      )
    case 'portrait':
      return (
        <g {...s}>
          <rect x="62" y="30" width="76" height="94" rx="2" fill={W} />
          <rect x="72" y="40" width="56" height="74" fill={dots} />
          <ellipse cx="100" cy="66" rx="12" ry="14" fill={W} />
          <path d="M78 114 Q78 88 100 88 Q122 88 122 114 Z" fill={W} />
          <path d="M62 46 L80 30 M62 60 L94 30" fill="none" strokeWidth={5} />
        </g>
      )
    case 'dinner':
      return (
        <g {...s}>
          <ellipse cx="100" cy="96" rx="58" ry="16" fill={W} />
          <ellipse cx="100" cy="90" rx="32" ry="9" fill={YEL} />
          <path d="M38 60 V112 M32 60 V74 Q38 80 44 74 V60" fill="none" />
          <path d="M162 60 Q172 72 162 84 V112" fill="none" />
        </g>
      )
    case 'camera':
      return (
        <g {...s}>
          <rect x="50" y="52" width="100" height="64" rx="6" fill={W} />
          <rect x="78" y="42" width="40" height="14" rx="3" fill={W} />
          <circle cx="100" cy="84" r="21" fill={YEL} />
          <circle cx="100" cy="84" r="10" fill={W} />
          <circle cx="136" cy="62" r="3" fill={INK} />
        </g>
      )
    case 'screen':
      return (
        <g {...s}>
          <rect x="46" y="36" width="108" height="70" rx="3" fill={W} />
          <path d="M92 58 L116 72 L92 86 Z" fill={YEL} />
          <path d="M34 112 H166 L156 104 H44 Z" fill={W} />
        </g>
      )
    case 'leaf':
      return (
        <g {...s}>
          <path d="M60 112 Q48 50 140 38 Q152 110 60 112 Z" fill={W} />
          <path d="M66 106 Q100 78 132 46" fill="none" />
          <path d="M84 92 l-10 -14 M100 78 l-6 -18 M112 66 l12 4" fill="none" strokeWidth={1.4} />
          <circle cx="150" cy="104" r="8" fill={YEL} />
        </g>
      )
    case 'map':
      return (
        <g {...s}>
          <path d="M36 50 L76 40 L120 54 L164 44 V108 L120 118 L76 104 L36 114 Z" fill={W} />
          <path d="M76 40 V104 M120 54 V118" fill="none" strokeWidth={1.4} opacity={0.5} />
          <path d="M54 92 Q96 56 140 78" fill="none" strokeDasharray="5 6" />
          <circle cx="140" cy="78" r="7" fill={YEL} />
        </g>
      )
    default:
      return <circle cx="100" cy="76" r="30" fill={W} {...s} />
  }
}

export default function ProductArt({ kind, palette = 0, view = 0, className, label }: { kind: ArtKind; palette?: number; view?: number; className?: string; label?: string }) {
  const d = useDots(0.42, 4.5)
  const bg = BG[(palette + view) % BG.length]
  const transform = view === 1 ? 'translate(-58 -44) scale(1.58)' : view === 2 ? 'translate(16 8) scale(0.84)' : undefined
  return (
    <svg viewBox="0 0 200 150" className={className} role="img" aria-label={label ?? 'Иллюстрация товара'} style={{ width: '100%', height: 'auto' }}>
      <defs>{d.def}</defs>
      <rect width="200" height="150" fill={bg} />
      {view === 2 && <circle cx="160" cy="40" r="22" fill={YEL} opacity={0.7} />}
      {view !== 1 && <ellipse cx="100" cy="128" rx="66" ry="7" fill={d.url} />}
      <g transform={transform}>
        <Shape kind={kind} p={palette % 5} dots={d.url} />
      </g>
    </svg>
  )
}
