import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, OFFERS, offersByCategory, type Offer } from '../data/catalog'
import { AGENCIES, telLink } from '../data/agencies'
import { SUPPORT_PHONE } from '../data/guide'
import ProductCard from '../components/ProductCard'
import { TornEdge } from '../components/Illustrations'
import { ScenePhoto } from '../components/ProductArt'
import { IlloCall, IlloCatalog, IlloPartners, IlloSupport } from '../components/Illustrations'
import { SCENE } from '../data/photos'
import { Icon } from '../components/ui'

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
        <div className="container hero-in">
          <div className="hero-text">
          <h1>Поможем проститься бережно</h1>
          <p className="lead">
            Всё необходимое для прощания в одном месте. Честные цены от проверенных служб Москвы, без спешки и навязанных услуг.
          </p>
          <div className="hero-actions">
            <Link to="/soprovozhdenie" className="btn btn-white btn-split">
              <span>Помогите всё организовать<small>Ответьте на несколько вопросов, мы соберём всё по шагам</small></span>
              <Icon name="arrow" />
            </Link>
            <Link to="/katalog" className="btn btn-white btn-split">
              <span>Я знаю, что мне нужно<small>Выберите товары и сравните цены у всех служб</small></span>
              <Icon name="arrow" />
            </Link>
          </div>
          <p className="hero-note">
            Близкий человек ушёл только что? <Link to="/chto-delat">Что делать в первые часы</Link>
          </p>
          </div>
          <ScenePhoto id={SCENE.hero} className="hero-photo" alt="Свечи и белые цветы" />
        </div>
        <TornEdge color="#ffdf4e" />
      </section>

      <section className="section-s" id="market">
        <div className="container">
          <div className="section-head">
            <div className="stack">
              <h2>Всё необходимое для прощания</h2>
              <p className="lead">{OFFERS.length} товаров и услуг от {AGENCIES.length} служб Москвы. Цена у каждого предложения фиксированная.</p>
            </div>
            <label className="row small" style={{ gap: 8 }}>
              <span className="muted">Сортировка</span>
              <select className="select" style={{ width: 'auto', minHeight: 44 }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                <option value="popular">Сначала популярные</option>
                <option value="cheap">Сначала дешевле</option>
                <option value="expensive">Сначала дороже</option>
                <option value="rating">По оценке</option>
              </select>
            </label>
          </div>
          <div className="chips" role="tablist" aria-label="Категории">
            <button role="tab" aria-selected={cat === 'all'} className={'chip' + (cat === 'all' ? ' active' : '')} onClick={() => { setCat('all'); setLimit(12) }}>
              Все <span className="count">{OFFERS.length}</span>
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} role="tab" aria-selected={cat === c.id} className={'chip' + (cat === c.id ? ' active' : '')} onClick={() => { setCat(c.id); setLimit(12) }}>
                {c.name} <span className="count">{offersByCategory(c.id).length}</span>
              </button>
            ))}
          </div>
          <div className="products-grid" style={{ marginTop: 28 }}>
            {list.slice(0, limit).map((o) => <ProductCard key={o.id} offer={o} />)}
          </div>
          <div className="row" style={{ justifyContent: 'center', marginTop: 36 }}>
            {limit < list.length && <button className="btn btn-outline" onClick={() => setLimit((l) => l + 12)}>Показать ещё</button>}
            <Link to={cat === 'all' ? '/katalog' : `/katalog?cat=${cat}`} className="btn btn-primary">Открыть каталог <Icon name="arrow" /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stack" style={{ maxWidth: 760, marginBottom: 36 }}>
            <h2>Спокойно, честно и по-человечески</h2>
            <p className="lead">Мы ничего не продаём от себя. Мы помогаем выбрать, передаём заказ службам и следим, чтобы всё прошло так, как решила семья.</p>
          </div>
          <div className="facts">
            <div className="fact"><b>16 служб</b><span>Специализированные службы Москвы из официального списка</span></div>
            <div className="fact"><b>Цена не меняется</b><span>Вы видите итог до оплаты, без доплат на месте</span></div>
            <div className="fact"><b>Без навязывания</b><span>Любой пункт можно пропустить или убрать</span></div>
            <div className="fact"><b>Круглосуточно</b><span>Живой человек на связи днём и ночью</span></div>
          </div>
        </div>
      </section>

      <section className="section bg-soft rule">
        <div className="container grid grid-3">
          <Link to="/soprovozhdenie" className="service">
            <IlloSupport className="service-photo" />
            <h3>Сопровождение</h3>
            <p>Зададим несколько вопросов, предложим три варианта и поможем пройти по шагам.</p>
            <span className="btn btn-primary btn-split">Начать подбор <Icon name="arrow" /></span>
          </Link>
          <Link to="/katalog" className="service">
            <IlloCatalog className="service-photo" />
            <h3>Каталог</h3>
            <p>Гробы, урны, цветы, транспорт и услуги. Сравните цены у всех служб.</p>
            <span className="btn btn-primary btn-split">Перейти в каталог <Icon name="arrow" /></span>
          </Link>
          <Link to="/partneram" className="service">
            <IlloPartners className="service-photo" />
            <h3>Для служб</h3>
            <p>Честные предоплаченные заказы без покупки данных. Комиссия только с выполненных.</p>
            <span className="btn btn-primary btn-split">Стать партнёром <Icon name="arrow" /></span>
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="call">
            <div>
              <h2>Мы на расстоянии одного звонка</h2>
              <p className="lead" style={{ marginTop: 16 }}>Можно просто позвонить и рассказать, что случилось. Мы выслушаем и подскажем, что делать дальше. Днём и ночью, в выходные и праздники.</p>
              <div className="call-line">
                <div className="avatars" aria-hidden>
                  <div className="av">А</div><div className="av">М</div><div className="av">Е</div>
                </div>
                <div className="call-sep" />
                <div className="stack" style={{ gap: 4 }}>
                  <a href={telLink(SUPPORT_PHONE)} className="call-phone"><Icon name="phone" /> {SUPPORT_PHONE}</a>
                  <span className="status-dot">Линия открыта, позвоните нам</span>
                </div>
              </div>
            </div>
            <IlloCall className="call-photo" />
          </div>
          <hr className="divider" style={{ margin: '72px 0' }} />
          <div className="panel center">
            <h2>Службы Москвы в одном месте</h2>
            <p className="lead" style={{ maxWidth: 620, margin: '16px auto 32px' }}>Мы работаем со специализированными службами по вопросам похоронного дела. У каждой своя страница с товарами, контактами и отзывами.</p>
            <div className="row" style={{ justifyContent: 'center', gap: '14px 28px' }}>
              {AGENCIES.slice(0, 9).map((a) => (
                <Link key={a.id} to={`/sluzhby/${a.slug}`} style={{ fontFamily: 'var(--serif)', fontSize: 20, textDecoration: 'none' }}>{a.short}</Link>
              ))}
              <Link to="/sluzhby" className="link">и ещё {AGENCIES.length - 9}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="guides section">
        <div className="container narrow">
          <div className="center stack" style={{ marginBottom: 36 }}>
            <h2>Памятки</h2>
            <p style={{ maxWidth: 560, margin: '0 auto' }}>Собрали самое важное в простые инструкции, чтобы вам не пришлось разбираться одному.</p>
          </div>
          <div className="stack" style={{ gap: 16 }}>
            <Link to="/chto-delat" className="guide-card">
              <div><h3>Что делать, если близкий человек ушёл</h3><span className="more">Читать памятку <Icon name="arrow" size={16} /></span></div>
              <div className="art"><ScenePhoto id={SCENE.guideFirst} ratio="4 / 3" alt="Свеча в ладонях" /></div>
            </Link>
            <Link to="/soprovozhdenie" className="guide-card">
              <div><h3>Как спокойно организовать прощание</h3><span className="more">Начать подбор <Icon name="arrow" size={16} /></span></div>
              <div className="art"><ScenePhoto id={SCENE.guideOrganize} ratio="4 / 3" alt="Зал для прощания" /></div>
            </Link>
            <Link to="/chto-delat" className="guide-card">
              <div><h3>Какие выплаты и бесплатные услуги положены</h3><span className="more">Узнать <Icon name="arrow" size={16} /></span></div>
              <div className="art"><ScenePhoto id={SCENE.guideMoney} ratio="4 / 3" alt="Документы с печатью" /></div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
