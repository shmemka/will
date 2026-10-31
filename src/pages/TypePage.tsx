import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { categoryById, offersByType, typeById } from '../data/catalog'
import ProductArt from '../components/ProductArt'
import { Crumbs } from '../components/ui'
import { plural, rub } from '../lib/format'
import { useCart, useToast } from '../lib/store'
import NotFound from './NotFound'
import OfferSlider from '../components/OfferSlider'

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
          <div className="gallery-main"><ProductArt typeId={type.id} palette={1} label={type.name} /></div>
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
        <OfferSlider offers={offers} inCart={(id) => cart.has(id)} onAdd={(id) => { cart.add(id); toast('Добавили в корзину') }} unit={type.unit} />
      </div>
    </section>
  )
}
