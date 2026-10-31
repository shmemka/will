import type { Agency } from '../data/agencies'

// Логотипы, найденные на официальных сайтах служб. У остальных служб сайта или логотипа нет, показываем первую букву.
const LOGOS: Record<string, string> = {
  'gbu-ritual': 'gbu-ritual.png',
  'ritorg-servis': 'ritorg-servis.png',
  rps: 'rps.png',
}

export function agencyLogo(a: Agency) {
  const f = LOGOS[a.slug]
  return f ? `${import.meta.env.BASE_URL}logos/${f}` : undefined
}

export default function AgencyAva({ agency, small }: { agency: Agency; small?: boolean }) {
  const logo = agencyLogo(agency)
  const cls = 'seller-ava' + (small ? ' sm' : '') + (logo ? ' has-logo' : '')
  return (
    <div className={cls} aria-hidden="true">
      {logo ? <img src={logo} alt="" loading="lazy" /> : agency.short[0]}
    </div>
  )
}
