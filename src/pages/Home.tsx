import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, OFFERS, offersByCategory, type Offer } from '../data/catalog'
import { AGENCIES } from '../data/agencies'
import { SUPPORT_PHONE } from '../data/guide'
import { telLink } from '../data/agencies'
import ProductCard from '../components/ProductCard'
import { CandleArt, CatalogArt, HandshakeArt, HeroScene, PhoneArt, SupportArt } from '../components/Illustrations'
import { Icon, Stars } from '../components/ui'

export type SortKey = 'popular' | 'cheap' | 'expensive' | 'rating'
export function sortOffers(list: Offer[], sort: SortKey) {
  const l = [...list]
  if (sort === 'cheap') return l.sort((a, b) => a.price - b.price)
  if (sort === 'expensive') return l.sort((a, b) => b.price - a.price)
  if (sort === 'rating') return l.sort((a, b) => b.rating - a.rating)
  return l.sort((a, b) => b.reviews * b.rating - a.reviews * a.rating)
}

export default function Home() {
  const [cat, setCat] = useState<string>('all')
  const [sort, setSort] = useState<SortKey>('popular')
  const [limit, setLimit] = useState(12)
  const list = useMemo(() => sortOffers(cat === 'all' ? OFFERS : offersByCategory(cat), sort), [cat, sort])

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="badge badge-yellow" style={{ marginBottom: 18 }}>
              <Icon name="heart" size={15} /> Москва и область · 16 проверенных служб
            </span>
            <h1>Поможем проститься бережно</h1>
            <p className="lead">
              Соберите всё необходимое для прощания онлайн. Честные фиксированные цены, проверенные службы, никакой спешки и навязанных услуг. Мы рядом на каждом шаге.
            </p>
          </div>
          <HeroScene className="hero-art" />
        </div>
        <div className="container" style={{ marginTop: 8 }}>
          <div className="choice-grid">
            <Link to="/soprovozhdenie" className="choice primary">
              <SupportArt className="choice-art" />
              <div>
                <h3>Помогите всё организовать</h3>
                <p>Ответьте на несколько вопросов, и мы бережно соберём всё необходимое от разных служб.</p>
                <span className="go">Полное сопровождение <Icon name="arrow" size={17} /></span>
              </div>
            </Link>
            <Link to="/katalog" className="choice">
              <CatalogArt className="choice-art" />
              <div>
                <h3>Я знаю, что мне нужно</h3>
                <p>Выберите конкретные товары и услуги и сравните цены у всех служб.</p>
                <span className="go">Перейти в каталог <Icon name="arrow" size={17} /></span>
              </div>
            </Link>
          </div>
          <Link to="/chto-delat" className="notice notice-blue" style={{ marginTop: 18, textDecoration: 'none', alignItems: 'center' }}>
            <Icon name="info" />
            <span>
              <b>Близкий человек ушёл только что?</b> Вот что можно сделать в первые часы. Спокойно и по шагам.
            </span>
            <Icon name="arrow" />
          </Link>
        </div>
      </section>

      <section className="section-s bg-sand">
        <div className="container trust">
          {[
            { ic: 'shield', t: 'Только проверенные службы', s: '16 специализированных служб Москвы' },
            { ic: 'lock', t: 'Цена не изменится', s: 'Вы видите итог до оплаты' },
            { ic: 'heart', t: 'Без навязывания', s: 'Выбираете только то, что нужно вам' },
            { ic: 'clock', t: 'Поддержка 24/7', s: 'Живой человек на связи в любое время' },
          ].map((x) => (
            <div key={x.t} className="trust-item">
              <div className="ic"><Icon name={x.ic as 'shield'} /></div>
              <div>
                <b>{x.t}</b>
                <span>{x.s}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="market">
        <div className="container">
          <div className="section-head">
            <div className="stack" style={{ gap: 8 }}>
              <h2>Все товары и услуги</h2>
              <p className="muted">{OFFERS.length} предложений от {AGENCIES.length} служб. Выберите категорию, чтобы увидеть всё, что в ней есть.</p>
            </div>
            <select className="select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Сортировка">
              <option value="popular">Сначала популярные</option>
              <option value="cheap">Сначала дешевле</option>
              <option value="expensive">Сначала дороже</option>
              <option value="rating">По оценке</option>
            </select>
          </div>
          <div className="chips" role="tablist" aria-label="Категории">
            <button className={'chip' + (cat === 'all' ? ' active' : '')} onClick={() => { setCat('all'); setLimit(12) }}>
              Все <span className="count">{OFFERS.length}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} className={'chip' + (cat === c.id ? ' active' : '')} onClick={() => { setCat(c.id); setLimit(12) }}>
                {c.name} <span className="count">{offersByCategory(c.id).length}</span>
              </button>
            ))}
          </div>
          <div className="products-grid" style={{ marginTop: 14 }}>
            {list.slice(0, limit).map((o) => <ProductCard key={o.id} offer={o} />)}
          </div>
          <div className="row" style={{ justifyContent: 'center', marginTop: 28 }}>
            {limit < list.length && (
              <button className="btn btn-outline" onClick={() => setLimit((l) => l + 12)}>Показать ещё</button>
            )}
            <Link to={cat === 'all' ? '/katalog' : `/katalog?cat=${cat}`} className="btn btn-dark">Открыть каталог</Link>
          </div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <div className="section-head">
            <h2>Как это устроено</h2>
            <p className="muted">Мы не продаём ничего от себя. Мы помогаем выбрать и следим, чтобы всё прошло так, как вы решили.</p>
          </div>
          <div className="grid grid-3 steps3">
            {[
              { t: 'Вы выбираете', s: 'Сами или с нашей помощью. Каждый товар можно сравнить у разных служб, цена указана сразу.' },
              { t: 'Мы передаём заказ службам', s: 'Каждая служба получает свою часть заказа и подтверждает её. Вы видите статусы в личном кабинете.' },
              { t: 'Мы рядом до конца', s: 'Координатор на связи круглосуточно. Если что-то пойдёт не так, мы найдём замену.' },
            ].map((x, i) => (
              <div key={x.t} className="step3">
                <div className="num">{i + 1}</div>
                <h3 style={{ marginBottom: 8 }}>{x.t}</h3>
                <p className="muted">{x.s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="band bg-yellow">
            <div className="stack-l">
              <h2>Мы на связи, когда вы нужны</h2>
              <p className="lead" style={{ color: 'var(--ink)' }}>
                Днём и ночью, в выходные и праздники. Можно просто позвонить и рассказать, что случилось. Мы выслушаем и подскажем, что делать дальше.
              </p>
              <div className="row">
                <a href={telLink(SUPPORT_PHONE)} className="btn btn-dark"><Icon name="phone" size={18} /> {SUPPORT_PHONE}</a>
                <span className="small">Звонок бесплатный</span>
              </div>
              <div className="row">
                <div className="people-row">
                  {['А', 'М', 'Е'].map((l, i) => (
                    <div key={l} className="av" style={{ background: ['#dfeaf7', '#fbe3da', '#dff0e5'][i] }}>{l}</div>
                  ))}
                </div>
                <span className="small">Анна, Михаил и Екатерина сегодня на смене</span>
              </div>
            </div>
            <PhoneArt />
          </div>
        </div>
      </section>

      <section className="section-s">
        <div className="container">
          <div className="section-head">
            <div className="stack" style={{ gap: 8 }}>
              <h2>Службы, с которыми мы работаем</h2>
              <p className="muted">Специализированные службы по вопросам похоронного дела в Москве.</p>
            </div>
            <Link to="/sluzhby" className="btn btn-outline">Все службы</Link>
          </div>
          <div className="grid grid-4">
            {AGENCIES.slice(0, 8).map((a) => (
              <Link key={a.id} to={`/sluzhby/${a.slug}`} className="card card-link stack" style={{ gap: 10 }}>
                <div className="seller-ava" style={{ background: a.color }}>{a.short[0]}</div>
                <b style={{ lineHeight: 1.3 }}>{a.name}</b>
                <div className="row" style={{ gap: 6 }}>
                  <Stars value={a.rating} size={13} />
                  <span className="small muted">{a.rating.toFixed(1)}</span>
                </div>
                <span className="small muted">{a.okrug} · {a.dispatcher24 ? 'круглосуточно' : a.hours.toLowerCase()}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2">
          <div className="band bg-white" style={{ gridTemplateColumns: '1fr auto' }}>
            <div className="stack">
              <h3>Что делать, если близкий человек ушёл</h3>
              <p className="muted">Пошаговая памятка: кому позвонить, какие документы нужны, какие выплаты положены.</p>
              <Link to="/chto-delat" className="link">Открыть памятку</Link>
            </div>
            <CandleArt className="choice-art" />
          </div>
          <div className="band bg-white" style={{ gridTemplateColumns: '1fr auto' }}>
            <div className="stack">
              <h3>Вы ритуальная служба?</h3>
              <p className="muted">Получайте честные заказы без покупки данных. Прозрачная комиссия только с выполненных заказов.</p>
              <Link to="/partneram" className="link">Стать партнёром</Link>
            </div>
            <HandshakeArt className="choice-art" />
          </div>
        </div>
      </section>
    </>
  )
}
