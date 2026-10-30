import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AVAILABILITY, agencyOfOffer, categoryById, offersByType, typeById } from '../data/catalog'
import ProductArt from '../components/ProductArt'
import { Crumbs, Icon, Stars } from '../components/ui'
import { plural, rub } from '../lib/format'
import { useCart, useToast } from '../lib/store'
import NotFound from './NotFound'

export default function TypePage() {
  const { typeId = '' } = useParams()
  const type = typeById(typeId)
  const cart = useCart()
  const toast = useToast()
  const [sort, setSort] = useState<'price' | 'rating'>('price')
  if (!type) return <NotFound />
  const cat = categoryById(type.category)!
  const offers = offersByType(type.id).sort((a, b) => (sort === 'price' ? a.price - b.price : b.rating - a.rating))
  const min = Math.min(...offers.map((o) => o.price))
  const max = Math.max(...offers.map((o) => o.price))

  return (
    <section className="section-s">
      <div className="container">
        <Crumbs items={[{ to: '/', label: 'Главная' }, { to: '/katalog', label: 'Каталог' }, { to: `/katalog?cat=${cat.id}`, label: cat.name }, { label: type.name }]} />
        <div className="grid grid-2" style={{ alignItems: 'center', gap: 32 }}>
          <div className="gallery-main"><ProductArt kind={type.art} palette={1} label={type.name} /></div>
          <div className="stack-l">
            <h1 style={{ fontSize: 'clamp(28px,3.6vw,42px)' }}>{type.name}</h1>
            <p className="lead">{type.desc}</p>
            <div className="row">
              <span className="badge badge-green">{offers.length} {plural(offers.length, 'служба', 'службы', 'служб')}</span>
              <span className="badge">{min === max ? rub(min) : `${rub(min)} - ${rub(max)}`}{type.unit ? ` / ${type.unit}` : ''}</span>
            </div>
            <table className="params"><tbody>{type.params.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody></table>
          </div>
        </div>

        <div className="section-head" style={{ marginTop: 48 }}>
          <div className="stack" style={{ gap: 6 }}>
            <h2 style={{ fontSize: 28 }}>Выберите службу</h2>
            <p className="muted">Цены фиксированные. Разница обычно в материалах, сроках и районе работы.</p>
          </div>
          <select className="select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as 'price')} aria-label="Сортировка">
            <option value="price">Сначала дешевле</option>
            <option value="rating">Сначала с лучшей оценкой</option>
          </select>
        </div>
        <div className="stack">
          {offers.map((o, i) => {
            const a = agencyOfOffer(o)
            const inCart = cart.has(o.id)
            return (
              <div key={o.id} className="compare-row">
                <div className="seller-ava">{a.short[0]}</div>
                <div>
                  <Link to={`/sluzhby/${a.slug}`} style={{ fontWeight: 700, textDecoration: 'none' }}>{a.name}</Link>
                  <div className="row small" style={{ gap: 6 }}>
                    <Stars value={o.rating} size={13} /> <span className="muted">{o.rating.toFixed(1)} · {a.okrug}</span>
                    {i === 0 && sort === 'price' && <span className="badge badge-green">Лучшая цена</span>}
                  </div>
                  {o.variant && <span className="small muted">Вариант: {o.variant}</span>}
                </div>
                <span className="small hide-m">{AVAILABILITY[o.available]}</span>
                <span className="price hide-m" style={{ fontSize: 19 }}>{rub(o.price)}</span>
                <div className="row" style={{ gap: 8, justifyContent: 'flex-end' }}>
                  <Link to={`/tovar/${o.id}`} className="btn btn-ghost btn-s">Подробнее</Link>
                  <button className={'btn btn-s ' + (inCart ? 'btn-outline' : 'btn-primary')} onClick={() => { if (!inCart) { cart.add(o.id); toast('Добавили в корзину') } }}>
                    {inCart ? <><Icon name="check" size={16} /> В корзине</> : <>{rub(o.price)}</>}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
