import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CATEGORIES, OFFERS, TYPES, categoryById, minPrice, offersByType, typeById } from '../data/catalog'
import { AGENCIES } from '../data/agencies'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import { Icon } from '../components/ui'
import PageHead from '../components/PageHead'
import { Dropdown, Switch } from '../components/controls'
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
    <>
    <PageHead
      crumbs={[{ to: '/', label: 'Главная' }, { label: 'Каталог' }]}
      title={cat === 'all' ? 'Каталог' : categoryById(cat)?.name}
      lead="Выберите, что вам нужно. Для каждого товара можно сравнить цены и условия у всех служб, где он есть."
    />
    <section className="section-s" style={{ paddingTop: 16 }}>
      <div className="container">
        <div className="cat-bar">
          <div className="cat-bar-top">
            <div className="seg" role="tablist" aria-label="Как показать каталог">
              <button role="tab" aria-selected={view === 'types'} className={view === 'types' ? 'on' : ''} onClick={() => set('view', null)}>Товары</button>
              <button role="tab" aria-selected={view === 'offers'} className={view === 'offers' ? 'on' : ''} onClick={() => set('view', 'offers')}>Предложения служб</button>
            </div>
            {view === 'offers' && (
              <Dropdown align="right" label="Сначала" value={sort} onChange={setSort} ariaLabel="Сортировка" options={[
                { value: 'popular', label: 'популярные' },
                { value: 'cheap', label: 'дешевле' },
                { value: 'expensive', label: 'дороже' },
                { value: 'rating', label: 'с лучшей оценкой' },
              ]} />
            )}
          </div>
          <p className="small muted" style={{ margin: 0 }}>
            {view === 'types'
              ? 'Выберите товар, и мы покажем, у каких служб он есть и сколько стоит.'
              : 'Все варианты от всех служб сразу. Отберите по службе, цене или сроку.'}
          </p>
          <div className="cat-filters">
            <Dropdown label="Категория" value={cat} onChange={(v) => set('cat', v)} ariaLabel="Категория" options={[{ value: 'all', label: 'Все' }, ...CATEGORIES.map((c) => ({ value: c.id, label: c.name }))]} />
            {view === 'offers' && (
              <>
                <Dropdown label="Служба" value={agency} onChange={setAgency} ariaLabel="Служба" options={[{ value: 'all', label: 'Любая' }, ...AGENCIES.map((a) => ({ value: a.id, label: a.short }))]} />
                <Dropdown label="Цена" value={maxPrice} onChange={setMaxPrice} ariaLabel="Цена" options={[
                  { value: '', label: 'любая' },
                  ...[1000, 3000, 5000, 10000, 20000, 50000].map((n) => ({ value: String(n), label: 'до ' + rub(n) })),
                ]} />
                <Switch checked={today} onChange={setToday}>Можно сегодня</Switch>
              </>
            )}
            {(cat !== 'all' || agency !== 'all' || maxPrice || today) && (
              <button className="link small" style={{ fontSize: 14 }} onClick={() => { set('cat', null); setAgency('all'); setMaxPrice(''); setToday(false) }}>Сбросить</button>
            )}
          </div>
        </div>

        {q && (
          <div className="notice" style={{ marginBottom: 16, alignItems: 'center' }}>
            <Icon name="search" />
            <span>Ищем «{params.get('q')}»</span>
            <button className="link" style={{ marginLeft: 'auto' }} onClick={() => set('q', null)}>Сбросить</button>
          </div>
        )}

        {view === 'types' ? (
          <div className="stack-l" style={{ marginTop: 8, gap: 48 }}>
            {grouped.length === 0 && <Empty />}
            {grouped.map(({ c, list }) => (
              <div key={c.id}>
                {cat === 'all' && (
                  <div className="row between" style={{ marginBottom: 14 }}>
                    <h3>{c.name}</h3>
                    <button className="link small" onClick={() => set('cat', c.id)}>Только эта категория</button>
                  </div>
                )}
                <div className="products-grid">
                  {list.map((t) => {
                    const n = offersByType(t.id).length
                    return (
                      <Link key={t.id} to={`/katalog/${t.id}`} className="pcard card-link">
                        <div className="pcard-img"><ProductArt typeId={t.id} palette={t.id.length % 5} label={t.name} /></div>
                        <div className="pcard-body">
                          <span className="pcard-title">{t.name}</span>
                          <span className="small muted">{n} {plural(n, 'служба', 'службы', 'служб')}</span>
                          <div className="pcard-foot">
                            <span className="price">от {rub(minPrice(t.id))}{t.unit && <span className="small muted" style={{ fontWeight: 500 }}> / {t.unit}</span>}</span>
                            <span className="btn btn-xs btn-primary">Сравнить</span>
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
    </>
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
