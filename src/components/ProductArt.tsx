// Плоские иллюстрации товаров вместо фотографий (в MVP). Три «ракурса» на каждый товар.
// Когда у служб появятся настоящие фото, их можно хранить в Supabase Storage и подставлять вместо этого компонента.
import type { ArtKind } from '../data/catalog'

const BG = ['#fff3b8', '#dfeaf7', '#dff0e5', '#fbe3da', '#ebe5f7']
const INK = '#23233f'
const WOOD = '#b9825a'
const WOOD_D = '#8d5c3b'
const CLOTH = ['#7a2e3a', '#6b4a3a', '#2f3f66', '#e9e2d4', '#7a2e3a']

function Shape({ kind, p }: { kind: ArtKind; p: number }) {
  const s = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
  switch (kind) {
    case 'coffin':
      return (
        <g {...s}>
          <path d="M40 70 L62 48 H150 L168 62 V86 L150 100 H62 Z" fill={p % 2 ? WOOD : CLOTH[p]} />
          <path d="M62 48 L70 74 H160 L168 62" fill="none" />
          <path d="M70 74 L62 100" fill="none" />
          <rect x="88" y="80" width="10" height="5" rx="2" fill="#e8c46a" />
          <rect x="120" y="80" width="10" height="5" rx="2" fill="#e8c46a" />
        </g>
      )
    case 'coffin-simple':
      return (
        <g {...s}>
          <path d="M42 66 L60 50 H154 L166 62 V88 L152 100 H58 L42 86 Z" fill="#d9b48f" />
          <path d="M60 50 L66 74 H160" fill="none" />
          <path d="M80 74 V100 M110 74 V100 M140 74 V100" fill="none" opacity=".35" />
        </g>
      )
    case 'stretcher':
      return (
        <g {...s}>
          <rect x="44" y="70" width="112" height="18" rx="4" fill={WOOD} />
          <path d="M30 79 H44 M156 79 H172" />
          <path d="M52 70 Q100 40 148 70" fill="#3d7a55" />
          <path d="M60 88 V104 M140 88 V104" />
        </g>
      )
    case 'urn':
      return (
        <g {...s}>
          <path d="M80 44 H120 V52 Q140 62 138 86 Q134 110 100 112 Q66 110 62 86 Q60 62 80 52 Z" fill={['#f4f1ea', '#8a8f9c', '#e3cfae', '#ffffff', '#cdb9a0'][p]} />
          <rect x="84" y="36" width="32" height="10" rx="4" fill="#cfc6b4" />
          <path d="M72 80 H128" opacity=".4" />
          <rect x="88" y="88" width="24" height="10" rx="2" fill="#e8c46a" />
        </g>
      )
    case 'urn-wood':
      return (
        <g {...s}>
          <rect x="66" y="54" width="68" height="56" rx="6" fill={WOOD} />
          <rect x="62" y="46" width="76" height="12" rx="4" fill={WOOD_D} />
          <rect x="82" y="72" width="36" height="18" rx="3" fill="#f2e2c4" />
        </g>
      )
    case 'wreath':
      return (
        <g {...s}>
          <circle cx="100" cy="74" r="36" fill="#3d7a55" />
          <circle cx="100" cy="74" r="18" fill={BG[p]} />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <circle key={a} cx={100 + 27 * Math.cos((a * Math.PI) / 180)} cy={74 + 27 * Math.sin((a * Math.PI) / 180)} r="8" fill={p % 2 ? '#ffffff' : '#c2454f'} />
          ))}
          <path d="M88 108 L80 128 M112 108 L120 128" stroke="#23233f" strokeWidth="6" />
        </g>
      )
    case 'basket':
      return (
        <g {...s}>
          <path d="M56 82 H144 L134 112 H66 Z" fill={WOOD} />
          {[66, 82, 98, 114, 130].map((x, i) => <circle key={x} cx={x + 2} cy={70 - (i % 2) * 8} r="11" fill={i % 2 ? '#ffffff' : '#f3e3a3'} />)}
          <path d="M60 82 Q100 60 140 82" fill="none" stroke="#3d7a55" strokeWidth="5" />
        </g>
      )
    case 'bouquet':
      return (
        <g {...s}>
          <path d="M100 118 L82 66 M100 118 L100 60 M100 118 L118 66" fill="none" stroke="#3d7a55" strokeWidth="3" />
          {[[82, 58], [100, 48], [118, 58], [91, 70], [110, 70]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="10" fill={p % 2 ? '#ffffff' : '#c2454f'} />)}
          <path d="M88 100 L100 120 L112 100 Z" fill={INK} />
        </g>
      )
    case 'ribbon':
      return (
        <g {...s}>
          <path d="M50 60 H150 V82 H50 Z" fill={INK} />
          <path d="M60 70 H140" stroke="#e8c46a" strokeWidth="3" strokeDasharray="10 5" />
          <path d="M70 82 L60 116 L76 108 L84 120 L92 82" fill={INK} />
          <path d="M108 82 L116 120 L124 108 L140 116 L130 82" fill={INK} />
        </g>
      )
    case 'cross-wood':
    case 'cross-metal': {
      const fill = kind === 'cross-wood' ? WOOD : '#4b4f63'
      return (
        <g {...s}>
          <rect x="93" y="28" width="14" height="96" rx="2" fill={fill} />
          <rect x="70" y="48" width="60" height="12" rx="2" fill={fill} />
          <rect x="80" y="84" width="40" height="8" rx="2" transform="rotate(-12 100 88)" fill={fill} />
          <rect x="84" y="64" width="32" height="16" rx="2" fill="#f2e2c4" />
          <path d="M60 124 H140" />
        </g>
      )
    }
    case 'plate':
      return (
        <g {...s}>
          <rect x="62" y="44" width="76" height="52" rx="6" fill="#f4f1ea" />
          <path d="M76 60 H124 M80 72 H120 M88 84 H112" opacity=".5" />
          <path d="M100 96 V124 M70 124 H130" />
        </g>
      )
    case 'stele':
      return (
        <g {...s}>
          <path d="M72 124 V58 Q72 36 100 36 Q128 36 128 58 V124 Z" fill="#8a8f9c" />
          <circle cx="100" cy="64" r="12" fill="#f4f1ea" />
          <path d="M84 90 H116 M88 102 H112" stroke="#f4f1ea" />
          <path d="M60 124 H140" />
        </g>
      )
    case 'textile':
      return (
        <g {...s}>
          <path d="M48 70 Q100 54 152 70 L150 108 Q100 92 50 108 Z" fill="#ffffff" />
          <rect x="60" y="48" width="44" height="26" rx="10" fill="#f3ece0" />
          <path d="M60 90 Q100 78 140 90" opacity=".35" fill="none" />
        </g>
      )
    case 'clothes':
      return (
        <g {...s}>
          <path d="M80 40 L100 50 L120 40 L146 54 L136 72 L126 66 V120 H74 V66 L64 72 L54 54 Z" fill={p % 2 ? '#2f3f66' : '#3a3a48'} />
          <path d="M100 50 L94 70 L100 76 L106 70 Z" fill="#ffffff" />
        </g>
      )
    case 'kit':
      return (
        <g {...s}>
          <rect x="54" y="62" width="40" height="50" rx="3" fill="#f4e7c3" />
          <path d="M74 72 V96 M66 80 H82" stroke="#b8902d" strokeWidth="3" />
          <rect x="102" y="54" width="44" height="58" rx="3" fill="#ffffff" />
          <path d="M110 66 H138 M110 76 H138 M110 86 H130" opacity=".4" />
          <path d="M120 40 V52 M114 46 H126" stroke="#b8902d" strokeWidth="3" />
        </g>
      )
    case 'shroud':
      return (
        <g {...s}>
          <path d="M60 50 H140 L132 116 H68 Z" fill="#ffffff" />
          <path d="M60 50 Q100 66 140 50" fill="none" />
          <path d="M80 70 L76 110 M100 72 V112 M120 70 L124 110" opacity=".25" />
        </g>
      )
    case 'care':
      return (
        <g {...s}>
          <path d="M100 116 C70 96 52 80 52 62 A22 22 0 0 1 100 54 A22 22 0 0 1 148 62 C148 80 130 96 100 116 Z" fill="#ffffff" />
          <path d="M84 70 Q100 86 116 70" fill="none" opacity=".4" />
        </g>
      )
    case 'cold':
      return (
        <g {...s}>
          <path d="M100 36 V116 M66 56 L134 96 M66 96 L134 56" stroke="#2c4f78" strokeWidth="5" />
          <circle cx="100" cy="76" r="10" fill="#ffffff" />
        </g>
      )
    case 'hearse':
      return (
        <g {...s}>
          <path d="M30 96 V72 L56 56 H138 L164 70 V96 Z" fill="#3a3a48" />
          <path d="M62 62 H100 V78 H58 Z M106 62 H134 L150 74 V78 H106 Z" fill="#c9d7e8" />
          <circle cx="62" cy="98" r="12" fill={INK} />
          <circle cx="138" cy="98" r="12" fill={INK} />
          <circle cx="62" cy="98" r="4" fill="#ffffff" />
          <circle cx="138" cy="98" r="4" fill="#ffffff" />
        </g>
      )
    case 'bus':
      return (
        <g {...s}>
          <rect x="34" y="50" width="132" height="50" rx="10" fill="#ffffff" />
          {[46, 72, 98, 124].map((x) => <rect key={x} x={x} y="58" width="20" height="16" rx="3" fill="#c9d7e8" />)}
          <path d="M34 84 H166" stroke="#ffdf4e" strokeWidth="6" />
          <circle cx="64" cy="102" r="11" fill={INK} />
          <circle cx="136" cy="102" r="11" fill={INK} />
        </g>
      )
    case 'people':
      return (
        <g {...s}>
          {[64, 100, 136].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy={56} r={12} fill="#f1d3b9" />
              <path d={`M${x - 20} 116 Q${x - 20} 74 ${x} 74 Q${x + 20} 74 ${x + 20} 116 Z`} fill={i === 1 ? '#3a3a48' : '#2f3f66'} />
            </g>
          ))}
        </g>
      )
    case 'hall':
      return (
        <g {...s}>
          <path d="M40 116 V56 L100 30 L160 56 V116 Z" fill="#ffffff" />
          <path d="M60 116 V70 M80 116 V70 M120 116 V70 M140 116 V70" />
          <rect x="92" y="84" width="16" height="32" fill="#ffdf4e" />
          <path d="M100 84 V72" />
          <circle cx="100" cy="68" r="4" fill="#ffb52e" stroke="none" />
        </g>
      )
    case 'church':
      return (
        <g {...s}>
          <rect x="62" y="70" width="76" height="48" fill="#ffffff" />
          <path d="M80 70 Q80 48 100 44 Q120 48 120 70 Z" fill="#e8c46a" />
          <path d="M100 44 V24 M93 31 H107" />
          <path d="M92 118 V96 Q100 88 108 96 V118" fill="#c9d7e8" />
        </g>
      )
    case 'mosque':
      return (
        <g {...s}>
          <rect x="60" y="72" width="80" height="46" fill="#ffffff" />
          <path d="M70 72 Q70 44 100 40 Q130 44 130 72 Z" fill="#3d7a55" />
          <rect x="146" y="40" width="10" height="78" fill="#ffffff" />
          <path d="M100 40 V28" />
          <path d="M92 118 V98 Q100 88 108 98 V118" fill="#c9d7e8" />
        </g>
      )
    case 'candle':
      return (
        <g {...s}>
          <rect x="88" y="62" width="24" height="56" rx="3" fill="#fff7e0" />
          <path d="M100 62 V54" />
          <path d="M100 30 Q112 44 100 54 Q88 44 100 30 Z" fill="#ffb52e" />
          <path d="M70 118 H130" />
        </g>
      )
    case 'music':
      return (
        <g {...s}>
          <path d="M84 104 V48 L132 38 V94" fill="none" strokeWidth="4" />
          <ellipse cx="74" cy="104" rx="12" ry="9" fill={INK} />
          <ellipse cx="122" cy="94" rx="12" ry="9" fill={INK} />
          <path d="M84 60 L132 50" strokeWidth="4" />
        </g>
      )
    case 'grave':
      return (
        <g {...s}>
          <path d="M40 116 Q100 84 160 116 Z" fill="#8d6b4c" />
          <path d="M100 96 V44 M88 56 H112" stroke={WOOD_D} strokeWidth="6" />
          <circle cx="132" cy="92" r="9" fill="#c2454f" />
          <circle cx="66" cy="96" r="8" fill="#ffffff" />
          <path d="M150 116 V70" stroke="#3d7a55" strokeWidth="4" />
          <circle cx="150" cy="64" r="14" fill="#3d7a55" />
        </g>
      )
    case 'cremation':
      return (
        <g {...s}>
          <rect x="54" y="50" width="92" height="66" rx="8" fill="#ffffff" />
          <path d="M100 66 Q116 84 100 100 Q84 84 100 66 Z" fill="#ffb52e" />
          <path d="M70 50 V38 H130 V50" fill="#e9e2d4" />
        </g>
      )
    case 'docs':
      return (
        <g {...s}>
          <rect x="66" y="34" width="64" height="84" rx="6" fill="#ffffff" transform="rotate(-6 98 76)" />
          <rect x="74" y="40" width="64" height="84" rx="6" fill="#ffffff" />
          <path d="M86 60 H126 M86 72 H126 M86 84 H114" opacity=".4" />
          <circle cx="118" cy="104" r="9" fill="#c2454f" />
        </g>
      )
    case 'portrait':
      return (
        <g {...s}>
          <rect x="64" y="34" width="72" height="88" rx="4" fill={WOOD_D} />
          <rect x="72" y="42" width="56" height="72" fill="#f3ece0" />
          <circle cx="100" cy="68" r="12" fill="#cfc6b4" />
          <path d="M80 112 Q80 86 100 86 Q120 86 120 112" fill="#cfc6b4" />
          <path d="M64 46 L82 34 M64 58 L94 34" stroke={INK} strokeWidth="6" />
        </g>
      )
    case 'dinner':
      return (
        <g {...s}>
          <ellipse cx="100" cy="94" rx="56" ry="16" fill="#ffffff" />
          <ellipse cx="100" cy="88" rx="30" ry="9" fill="#f3e3a3" />
          <path d="M40 60 V108 M34 60 V74 Q40 80 46 74 V60" />
          <path d="M160 60 Q170 72 160 84 V108" fill="none" />
        </g>
      )
    case 'camera':
      return (
        <g {...s}>
          <rect x="52" y="54" width="96" height="62" rx="10" fill="#3a3a48" />
          <rect x="80" y="44" width="40" height="14" rx="4" fill="#3a3a48" />
          <circle cx="100" cy="85" r="20" fill="#c9d7e8" />
          <circle cx="100" cy="85" r="9" fill={INK} />
        </g>
      )
    case 'screen':
      return (
        <g {...s}>
          <rect x="48" y="40" width="104" height="66" rx="6" fill="#ffffff" />
          <path d="M92 60 L114 73 L92 86 Z" fill="#ffdf4e" />
          <path d="M84 120 H116 M100 106 V120" />
        </g>
      )
    case 'leaf':
      return (
        <g {...s}>
          <path d="M60 110 Q50 50 140 40 Q150 110 60 110 Z" fill="#3d7a55" />
          <path d="M66 104 Q100 76 130 50" fill="none" stroke="#dff0e5" />
        </g>
      )
    case 'map':
      return (
        <g {...s}>
          <path d="M40 50 L80 40 L120 54 L160 44 V108 L120 118 L80 104 L40 114 Z" fill="#ffffff" />
          <path d="M80 40 V104 M120 54 V118" opacity=".4" />
          <path d="M60 90 Q100 60 140 80" fill="none" strokeDasharray="6 6" />
          <circle cx="140" cy="80" r="6" fill="#c2454f" />
        </g>
      )
    default:
      return <circle cx="100" cy="76" r="30" fill="#ffffff" stroke={INK} strokeWidth="2.5" />
  }
}

export default function ProductArt({ kind, palette = 0, view = 0, className, label }: { kind: ArtKind; palette?: number; view?: number; className?: string; label?: string }) {
  const bg = BG[(palette + view) % BG.length]
  const transform = view === 1 ? 'translate(-60 -46) scale(1.6)' : view === 2 ? 'translate(18 6) scale(0.82)' : undefined
  return (
    <svg viewBox="0 0 200 150" className={className} role="img" aria-label={label ?? 'Иллюстрация товара'} style={{ width: '100%', height: 'auto', borderRadius: 'inherit' }}>
      <rect width="200" height="150" fill={bg} />
      {view === 2 && (
        <>
          <circle cx="30" cy="30" r="40" fill="#ffffff" opacity=".5" />
          <circle cx="182" cy="128" r="34" fill="#ffffff" opacity=".45" />
          <path d="M0 132 H200" stroke="#23233f" strokeOpacity=".08" strokeWidth="18" />
        </>
      )}
      {view === 0 && <ellipse cx="100" cy="124" rx="70" ry="7" fill="#23233f" opacity=".07" />}
      <g transform={transform}>
        <Shape kind={kind} p={palette % 5} />
      </g>
    </svg>
  )
}
