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


/* ---------- Иллюстрации ---------- */
const S = { stroke: INK, strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const C = {
  yel: YEL, yelBg: '#FFF1B8', yelDeep: '#F6D65A', sage: '#A8CBB7', sageDeep: '#7FAF95', sageBg: '#E4F0E8',
  blue: '#A9C4DD', blueBg: '#E5EDF6', coral: '#F4A28C', cheek: '#F7B9A8', skin: '#F6D2B8', hair: '#4A3B33',
  wood: '#DDB98E', metal: '#9AA7B4', paper: '#FFFFFF', cream: '#FFFDF6',
}
const HEART = 'M0 6 C-6 1 -9 -2 -9 -5.5 C-9 -8.5 -6.8 -10.5 -4.5 -10.5 C-2.6 -10.5 -1 -9.4 0 -7.6 C1 -9.4 2.6 -10.5 4.5 -10.5 C6.8 -10.5 9 -8.5 9 -5.5 C9 -2 6 1 0 6 Z'
const STAR = 'M0 -7 C0.8 -2 2 -0.8 7 0 C2 0.8 0.8 2 0 7 C-0.8 2 -2 0.8 -7 0 C-2 -0.8 -0.8 -2 0 -7 Z'

function Heart({ x, y, s = 1, fill = C.coral }: { x: number; y: number; s?: number; fill?: string }) {
  return <path d={HEART} transform={`translate(${x} ${y}) scale(${s})`} fill={fill} {...S} strokeWidth={2.5 / s} />
}
function Sparkle({ x, y, s = 1, fill = C.paper }: { x: number; y: number; s?: number; fill?: string }) {
  return <path d={STAR} transform={`translate(${x} ${y}) scale(${s})`} fill={fill} {...S} strokeWidth={2 / s} />
}
function Leaf({ x, y, r, len = 11, fill = C.sage }: { x: number; y: number; r: number; len?: number; fill?: string }) {
  return <path d={`M0 0 C${len * 0.3} ${-len * 0.45} ${len * 0.75} ${-len * 0.45} ${len} 0 C${len * 0.75} ${len * 0.45} ${len * 0.3} ${len * 0.45} 0 0 Z`} transform={`translate(${x} ${y}) rotate(${r})`} fill={fill} {...S} strokeWidth={2} />
}
function Flower({ x, y, r, petal = C.paper, center = YEL }: { x: number; y: number; r: number; petal?: string; center?: string }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => {
        const rad = ((a - 90) * Math.PI) / 180
        return <circle key={a} cx={x + Math.cos(rad) * r * 0.62} cy={y + Math.sin(rad) * r * 0.62} r={r * 0.52} fill={petal} {...S} strokeWidth={2} />
      })}
      <circle cx={x} cy={y} r={r * 0.4} fill={center} {...S} strokeWidth={2} />
    </g>
  )
}
function Sprig({ x, y, flip, s = 1 }: { x: number; y: number; flip?: boolean; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 C2 -16 8 -30 18 -42" fill="none" {...S} strokeWidth={2} />
      <Leaf x={3} y={-12} r={-150} len={13} fill={C.sageDeep} />
      <Leaf x={6} y={-20} r={-30} len={13} />
      <Leaf x={11} y={-31} r={-145} len={12} />
      <Leaf x={17} y={-40} r={-60} len={11} fill={C.sageDeep} />
    </g>
  )
}

type IlloProps = { className?: string; title?: string }
function Frame({ vb, bg, className, title, children }: IlloProps & { vb: string; bg: string; children: React.ReactNode }) {
  const [, , w, h] = vb.split(' ').map(Number)
  return (
    <div className={'illo ' + (className ?? '')} style={{ aspectRatio: `${w} / ${h}`, background: bg }}>
      <svg viewBox={vb} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
        {children}
      </svg>
    </div>
  )
}

/** Сопровождение: двое поддерживают друг друга */
export function IlloSupport(p: IlloProps) {
  return (
    <Frame vb="0 0 320 200" bg={C.yelBg} {...p}>
      <circle cx="166" cy="128" r="78" fill={C.yelDeep} opacity=".45" />
      <ellipse cx="166" cy="184" rx="96" ry="7" fill={C.yelDeep} opacity=".7" />
      <Sprig x={44} y={186} />
      <Sprig x={286} y={186} flip />
      {/* правая фигура */}
      <path d="M178 186 C178 152 188 134 210 134 C232 134 242 152 242 186 Z" fill={C.sage} {...S} />
      <g transform="rotate(-14 208 110)">
        <circle cx="208" cy="110" r="21" fill={C.skin} {...S} />
        <path d="M187 109 C186 92 197 86 208 86 C222 86 230 96 229 110 C222 101 212 97 200 100 C194 102 190 105 187 109 Z" fill={C.hair} {...S} />
        <path d="M199 115 q3 3 6 0 M212 115 q3 3 6 0" fill="none" {...S} strokeWidth={2} />
        <circle cx="197" cy="121" r="3.5" fill={C.cheek} />
        <circle cx="221" cy="121" r="3.5" fill={C.cheek} />
      </g>
      {/* рука, обнимающая за плечо */}
      <path d="M150 148 C172 132 200 130 224 144" fill="none" stroke={INK} strokeWidth={15} strokeLinecap="round" />
      <path d="M150 148 C172 132 200 130 224 144" fill="none" stroke={YEL} strokeWidth={10} strokeLinecap="round" />
      <circle cx="227" cy="146" r="7" fill={C.skin} {...S} />
      {/* левая фигура */}
      <path d="M92 186 C92 148 104 126 132 126 C160 126 172 148 172 186 Z" fill={YEL} {...S} />
      <path d="M122 126 L132 140 L142 126" fill="none" {...S} strokeWidth={2} />
      <g transform="rotate(9 132 98)">
        <circle cx="132" cy="98" r="23" fill={C.skin} {...S} />
        <circle cx="131" cy="70" r="9" fill={INK} {...S} />
        <path d="M109 97 C109 79 120 73 132 73 C146 73 156 81 155 98 C147 88 136 85 124 88 C117 90 112 93 109 97 Z" fill={INK} {...S} />
        <path d="M122 102 q3 3 6 0 M136 102 q3 3 6 0" fill="none" {...S} strokeWidth={2} />
        <path d="M128 110 q4 3.5 8 0" fill="none" {...S} strokeWidth={2} />
        <circle cx="119" cy="108" r="3.5" fill={C.cheek} />
        <circle cx="145" cy="108" r="3.5" fill={C.cheek} />
      </g>
      <Heart x={168} y={42} s={1.7} />
      <Sparkle x={108} y={46} s={1.1} />
      <Sparkle x={234} y={56} s={0.9} fill={YEL} />
      <Sparkle x={74} y={96} s={0.7} />
    </Frame>
  )
}

/** Каталог: полка с цветами, свечой и венком */
export function IlloCatalog(p: IlloProps) {
  const ring = Array.from({ length: 16 }, (_, i) => (i / 16) * Math.PI * 2)
  return (
    <Frame vb="0 0 320 200" bg={C.sageBg} {...p}>
      <rect x="22" y="160" width="276" height="11" rx="4" fill={C.wood} {...S} />
      <path d="M44 171 L50 186 M276 171 L270 186" {...S} />
      {/* букет */}
      <path d="M83 110 Q72 88 62 66 M83 110 Q84 80 86 50 M83 110 Q96 90 106 70 M83 110 Q78 96 74 88" fill="none" stroke={C.sageDeep} strokeWidth={3} strokeLinecap="round" />
      <Leaf x={76} y={92} r={-140} len={14} />
      <Leaf x={92} y={88} r={-40} len={14} fill={C.sageDeep} />
      <Flower x={62} y={64} r={13} />
      <Flower x={86} y={46} r={14} petal={C.coral} />
      <Flower x={107} y={68} r={12} />
      <Flower x={73} y={86} r={9} petal={YEL} center={C.coral} />
      <path d="M68 160 C56 150 56 126 70 116 L70 106 L96 106 L96 116 C110 126 110 150 98 160 Z" fill={C.blue} {...S} />
      <path d="M62 136 C74 140 92 140 104 136" fill="none" {...S} strokeWidth={2} />
      {/* свеча */}
      <circle cx="163" cy="98" r="24" fill="#FFF6C9" />
      <rect x="150" y="114" width="26" height="46" rx="4" fill={C.cream} {...S} />
      <path d="M150 122 C156 122 156 130 160 130 C164 130 163 120 176 121" fill="none" {...S} strokeWidth={2} />
      <path d="M163 114 L163 106" {...S} />
      <path d="M163 80 C170 90 172 96 172 100 C172 106 168 109 163 109 C158 109 154 106 154 100 C154 96 156 90 163 80 Z" fill={YEL} {...S} />
      <path d="M163 93 C166 97 166 100 166 101 C166 103 165 104 163 104 C161 104 160 103 160 101 C160 100 160 97 163 93 Z" fill={C.coral} />
      {/* венок */}
      <g>
        {ring.map((a, i) => (
          <Leaf key={i} x={240 + Math.cos(a) * 32} y={114 + Math.sin(a) * 32} r={(a * 180) / Math.PI + 70} len={17} fill={i % 2 ? C.sage : C.sageDeep} />
        ))}
        {[200, 250, 320, 30, 110].map((d, i) => {
          const a = (d * Math.PI) / 180
          return <Flower key={d} x={240 + Math.cos(a) * 34} y={114 + Math.sin(a) * 34} r={8} petal={i % 2 ? C.coral : C.paper} />
        })}
        <path d="M240 150 L226 140 L224 156 Z M240 150 L254 140 L256 156 Z" fill={YEL} {...S} strokeWidth={2} />
        <path d="M236 152 L230 172 M244 152 L250 172" {...S} stroke={INK} strokeWidth={5} />
        <path d="M236 152 L230 172 M244 152 L250 172" stroke={YEL} strokeWidth={2} strokeLinecap="round" />
        <circle cx="240" cy="150" r="5" fill={YEL} {...S} strokeWidth={2} />
      </g>
      <Sparkle x={196} y={50} s={1} />
      <Sparkle x={36} y={44} s={0.8} fill={YEL} />
      <Sparkle x={292} y={64} s={0.7} />
    </Frame>
  )
}

/** Для служб: планшет с отметками, ручка и знак доверия */
export function IlloPartners(p: IlloProps) {
  const rows = [74, 104, 134]
  return (
    <Frame vb="0 0 320 200" bg={C.blueBg} {...p}>
      <circle cx="168" cy="108" r="80" fill="#D5E1EE" />
      <Sprig x={38} y={190} />
      <rect x="114" y="30" width="110" height="156" rx="9" fill={C.wood} {...S} />
      <rect x="124" y="46" width="90" height="130" rx="5" fill={C.paper} {...S} />
      <rect x="147" y="22" width="44" height="18" rx="6" fill={C.metal} {...S} />
      {rows.map((y, i) => (
        <g key={y}>
          <rect x="134" y={y - 8} width="16" height="16" rx="4" fill={i < 2 ? YEL : C.paper} {...S} strokeWidth={2} />
          {i < 2 && <path d={`M137 ${y} L141 ${y + 4} L148 ${y - 5}`} fill="none" {...S} strokeWidth={2.2} />}
          <rect x="158" y={y - 7} width="44" height="5" rx="2.5" fill="#CBD6E2" />
          <rect x="158" y={y + 2} width="30" height="5" rx="2.5" fill="#E1E8F0" />
        </g>
      ))}
      <path d="M134 158 C144 150 150 166 160 156 C168 148 174 162 186 154" fill="none" stroke="#5A7EA6" strokeWidth={2.2} strokeLinecap="round" />
      {/* ручка */}
      <g transform="rotate(28 250 118)">
        <rect x="244" y="70" width="13" height="72" rx="4" fill={C.coral} {...S} />
        <rect x="244" y="70" width="13" height="16" rx="4" fill={INK} />
        <path d="M244 142 L250.5 158 L257 142 Z" fill={C.cream} {...S} strokeWidth={2} />
        <path d="M249 154 L250.5 158 L252 154 Z" fill={INK} />
      </g>
      {/* знак доверия */}
      <g transform="translate(88 132)">
        <path d="M-12 18 L-18 46 L-8 40 L-2 50 L2 22 Z M12 18 L18 46 L8 40 L2 50 L-2 22 Z" fill={C.coral} {...S} strokeWidth={2} />
        <path d={Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * Math.PI * 2; const r = i % 2 ? 23 : 27; return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}` }).join(' ') + ' Z'} fill={YEL} {...S} />
        <circle r="16" fill={C.paper} {...S} strokeWidth={2} />
        <Heart x={0} y={2} s={0.95} />
      </g>
      <Sparkle x={262} y={44} s={1.1} />
      <Sparkle x={98} y={58} s={0.8} fill={YEL} />
    </Frame>
  )
}

/** Звонок: телефон, сердечко в облачке и луна, потому что мы на связи и ночью */
export function IlloCall(p: IlloProps) {
  const holes = Array.from({ length: 9 }, (_, i) => ((i / 10) * 300 + 200) * (Math.PI / 180))
  return (
    <Frame vb="0 0 400 300" bg={C.yelBg} {...p}>
      <circle cx="200" cy="180" r="104" fill={C.yelDeep} opacity=".4" />
      <ellipse cx="204" cy="256" rx="118" ry="9" fill={C.yelDeep} opacity=".8" />
      {/* провод */}
      <path d="M122 232 q-8 -7 -14 1 q-6 8 -13 1 q-7 -7 -13 1 q-6 8 -13 1 q-8 -6 -12 10" fill="none" {...S} strokeWidth={2.5} />
      {/* корпус */}
      <path d="M118 236 L140 154 C143 143 151 138 162 138 L242 138 C253 138 261 143 264 154 L286 236 C289 246 282 254 272 254 L132 254 C122 254 115 246 118 236 Z" fill={YEL} {...S} strokeWidth={3} />
      <circle cx="202" cy="200" r="36" fill={C.paper} {...S} />
      {holes.map((a, i) => <circle key={i} cx={202 + Math.cos(a) * 24} cy={200 + Math.sin(a) * 24} r="5" fill={C.yelBg} {...S} strokeWidth={2} />)}
      <circle cx="202" cy="200" r="10" fill={C.coral} {...S} strokeWidth={2} />
      {/* трубка */}
      <path d="M114 134 C104 112 116 94 136 96 L150 98 C157 99 160 105 157 112 L153 121 C151 126 153 128 158 128 L246 128 C251 128 253 126 251 121 L247 112 C244 105 247 99 254 98 L268 96 C288 94 300 112 290 134 C286 144 276 147 264 145 L140 145 C128 147 118 144 114 134 Z" fill={INK} {...S} />
      <path d="M128 110 C130 104 136 102 142 103" fill="none" stroke="#6b6b6b" strokeWidth={3} strokeLinecap="round" />
      {/* облачко с сердцем */}
      <g transform="translate(8 -14)">
      <path d="M286 38 L346 38 C360 38 368 46 368 60 L368 82 C368 96 360 104 346 104 L310 104 L292 120 L294 104 L286 104 C272 104 264 96 264 82 L264 60 C264 46 272 38 286 38 Z" fill={C.paper} {...S} />
      <Heart x={316} y={74} s={1.7} />
      </g>
      {/* луна и звёзды */}
      <path d="M88 44 A30 30 0 1 0 112 96 A23 23 0 1 1 88 44 Z" fill={YEL} {...S} />
      <Sparkle x={136} y={52} s={1} />
      <Sparkle x={52} y={110} s={0.8} />
      <Sparkle x={230} y={74} s={0.9} fill={YEL} />
      <Sprig x={330} y={258} flip s={1.2} />
    </Frame>
  )
}

/** Вход в кабинет: письмо, замок с сердечком и ключ */
export function IlloLogin(p: IlloProps) {
  return (
    <Frame vb="0 0 480 270" bg={C.sageBg} {...p}>
      <circle cx="240" cy="150" r="96" fill="#D2E6DA" />
      <ellipse cx="244" cy="238" rx="150" ry="8" fill="#C9DFD1" />
      <Sprig x={60} y={240} s={1.2} />
      <Sprig x={420} y={240} s={1.2} flip />
      {/* письмо */}
      <g transform="rotate(-10 112 170)">
        <rect x="70" y="140" width="86" height="58" rx="6" fill={C.paper} {...S} />
        <path d="M72 144 L113 174 L154 144" fill="none" {...S} />
        <Heart x={113} y={186} s={0.8} />
      </g>
      {/* замок */}
      <path d="M200 132 L200 106 C200 82 218 66 240 66 C262 66 280 82 280 106 L280 132" fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
      <path d="M200 132 L200 106 C200 82 218 66 240 66 C262 66 280 82 280 106 L280 132" fill="none" stroke={C.metal} strokeWidth={11} strokeLinecap="round" />
      <rect x="176" y="124" width="128" height="104" rx="20" fill={YEL} {...S} strokeWidth={3} />
      <path d="M190 140 L190 170" stroke="#FFF1B8" strokeWidth={6} strokeLinecap="round" />
      <Heart x={240} y={176} s={2.3} />
      {/* ключ */}
      <g transform="rotate(-28 360 168)">
        <circle cx="336" cy="168" r="18" fill={C.paper} {...S} />
        <Heart x={336} y={169} s={0.8} fill={C.sage} />
        <rect x="352" y="163" width="62" height="10" rx="5" fill={C.metal} {...S} strokeWidth={2.2} />
        <path d="M398 173 L398 186 L406 186 L406 173 M386 173 L386 182 L392 182 L392 173" fill={C.metal} {...S} strokeWidth={2.2} />
      </g>
      <Sparkle x={150} y={70} s={1.1} />
      <Sparkle x={336} y={70} s={0.9} fill={YEL} />
      <Sparkle x={400} y={118} s={0.7} />
    </Frame>
  )
}
