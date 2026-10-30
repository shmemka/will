import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CATEGORIES, OFFERS, TYPES, categoryById, minPrice, offersByType, typeById } from '../data/catalog'
import { AGENCIES } from '../data/agencies'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import { Crumbs, Icon } from '../components/ui'
import { rub, plural } from '../lib/format'
import { sortOffers, type SortKey } from './Home'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') ?? 'all'
  const q = (params.get('q') ?? '').trim().toLowerCase()
  const view = params.get('view') === 'offers' ? 'offers' : 'types'
  const [agency, setAgency] = useState('all')
  const [maxPrice, setMaxPrice] = useState('')
  const [today, setToday] = useState(false)
  const [sort, setSort] = useState<SortKey>('popular')

  const set = (k: string, v: string | null) => {
    const p = new URLSearchParams(params)
    if (v === null || v === 'all' || v === '') p.delete(k)
    else p.set(k, v)
    setParams(p, { replace: true })
  }

  const types = useMemo(
    () => TYPES.filter((t) => (cat === 'all' || t.category === cat) && (!q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)) && offersByType(t.id).length),
    [cat, q],
  )

  const offers = useMemo(() => {
    let l = OFFERS.filter((o) => {
      const t = typeById(o.typeId)!
      if (cat !== 'all' && t.category !== cat) return false
      if (q && !(t.name.toLowerCase().includes(q) || (o.variant ?? '').includes(q))) return false
      if (agency !== 'all' && o.agencyId !== agency) return false
      if (maxPrice && o.price > Number(maxPrice)) return false
      if (today && o.available !== 'today') return false
      return true
    })
    l = sortOffers(l, sort)
    return l
  }, [cat, q, agency, maxPrice, today, sort])

  const grouped = CATEGORIES.map((c) => ({ c, list: types.filter((t) => t.category === c.id) })).filter((g) => g.list.length)

  return (
    <section className="section-s">
      <div className="container">
        <Crumbs items={[{ to: '/', label: 'Главная' }, { label: 'Каталог' }]} />
        <div className="section-head">
          <div className="stack" style={{ gap: 8 }}>
            <h1 style={{ fontSize: 'clamp(30px,4vw,44px)' }}>{cat === 'all' ? 'Каталог' : categoryById(cat)?.name}</h1>
            <p className="muted">
              Выберите, что вам нужно. Для каждого товара можно сравнить цены и условия у всех служб, где он есть.
            </p>
          </div>
          <div className="tabs" style={{ marginBottom: 0, borderBottom: 0 }}>
            <button className={'tab' + (view === 'types' ? ' active' : '')} onClick={() => set('view', null)}>Основные товары</button>
            <button className={'tab' + (view === 'offers' ? ' active' : '')} onClick={() => set('view', 'offers')}>Все предложения</button>
          </div>
        </div>

        {q && (
          <div className="notice" style={{ marginBottom: 16, alignItems: 'center' }}>
            <Icon name="search" />
            <span>Ищем «{params.get('q')}»</span>
            <button className="link" style={{ marginLeft: 'auto' }} onClick={() => set('q', null)}>Сбросить</button>
          </div>
        )}

        <div className="chips">
          <button className={'chip' + (cat === 'all' ? ' active' : '')} onClick={() => set('cat', null)}>Все</button>
          {CATEGORIES.map((c) => (
            <button key={c.id} className={'chip' + (cat === c.id ? ' active' : '')} onClick={() => set('cat', c.id)}>{c.name}</button>
          ))}
        </div>

        {view === 'types' ? (
          <div className="stack-l" style={{ marginTop: 18 }}>
            {grouped.length === 0 && <Empty />}
            {grouped.map(({ c, list }) => (
              <div key={c.id}>
                {cat === 'all' && (
                  <div className="row between" style={{ marginBottom: 14 }}>
                    <h2 style={{ fontSize: 26 }}>{c.name}</h2>
                    <button className="link small" onClick={() => set('cat', c.id)}>Только эта категория</button>
                  </div>
                )}
                <div className="products-grid">
                  {list.map((t) => {
                    const n = offersByType(t.id).length
                    return (
                      <Link key={t.id} to={`/katalog/${t.id}`} className="pcard card-link">
                        <div className="pcard-img"><ProductArt kind={t.art} palette={t.id.length % 5} label={t.name} /></div>
                        <div className="pcard-body">
                          <span className="pcard-title">{t.name}</span>
                          <span className="small muted">{n} {plural(n, 'служба', 'службы', 'служб')}</span>
                          <div className="pcard-foot">
                            <span className="price">от {rub(minPrice(t.id))}{t.unit && <span className="small muted" style={{ fontWeight: 500 }}> / {t.unit}</span>}</span>
                            <span className="btn btn-s btn-primary">Сравнить</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="row" style={{ margin: '14px 0 18px' }}>
              <select className="select" style={{ width: 'auto' }} value={agency} onChange={(e) => setAgency(e.target.value)} aria-label="Служба">
                <option value="all">Все службы</option>
                {AGENCIES.map((a) => <option key={a.id} value={a.id}>{a.short}</option>)}
              </select>
              <input className="input" style={{ width: 160 }} inputMode="numeric" placeholder="Цена до, ₽" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))} aria-label="Максимальная цена" />
              <label className="checkbox"><input type="checkbox" checked={today} onChange={(e) => setToday(e.target.checked)} /> Можно сегодня</label>
              <select className="select" style={{ width: 'auto', marginLeft: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Сортировка">
                <option value="popular">Сначала популярные</option>
                <option value="cheap">Сначала дешевле</option>
                <option value="expensive">Сначала дороже</option>
                <option value="rating">По оценке</option>
              </select>
            </div>
            <p className="small muted" style={{ marginBottom: 12 }}>{offers.length} {plural(offers.length, 'предложение', 'предложения', 'предложений')}</p>
            {offers.length === 0 ? <Empty /> : (
              <div className="products-grid">{offers.map((o) => <ProductCard key={o.id} offer={o} />)}</div>
            )}
          </>
        )}

        <div className="notice notice-green" style={{ marginTop: 36, alignItems: 'center' }}>
          <Icon name="heart" />
          <span>Не уверены, что именно нужно? В полном сопровождении мы поможем собрать всё по шагам.</span>
          <Link to="/soprovozhdenie" className="btn btn-dark btn-s" style={{ marginLeft: 'auto' }}>Помогите мне</Link>
        </div>
      </div>
    </section>
  )
}

function Empty() {
  return (
    <div className="empty stack" style={{ alignItems: 'center' }}>
      <h3>Ничего не нашлось</h3>
      <p className="muted">Попробуйте другое слово или категорию. Или позвоните нам, мы найдём то, что нужно.</p>
    </div>
  )
}
