import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { agencyBySlug, mapLink, telLink } from '../data/agencies'
import { CATEGORIES, demoReviews, offersByAgency, typeById } from '../data/catalog'
import ProductCard from '../components/ProductCard'
import { Crumbs, Icon, Stars } from '../components/ui'
import { localReviews, type UserReview } from '../lib/api'
import { plural, rub } from '../lib/format'
import { Reviews } from './Product'
import NotFound from './NotFound'

export default function AgencyPage() {
  const { slug = '' } = useParams()
  const a = agencyBySlug(slug)
  const [cat, setCat] = useState('all')
  const [tab, setTab] = useState<'goods' | 'about' | 'reviews'>('goods')
  const [mine, setMine] = useState<UserReview[]>(() => localReviews(`agency:${slug}`))
  const demo = useMemo(() => (a ? demoReviews(`agency:${a.id}`, 6) : []), [a])
  if (!a) return <NotFound />
  const offers = offersByAgency(a.id)
  const cats = CATEGORIES.filter((c) => offers.some((o) => typeById(o.typeId)?.category === c.id))
  const list = cat === 'all' ? offers : offers.filter((o) => typeById(o.typeId)?.category === cat)
  const cheapest = Math.min(...offers.map((o) => o.price))

  return (
    <section className="section-s">
      <div className="container">
        <Crumbs items={[{ to: '/', label: 'Главная' }, { to: '/sluzhby', label: 'Службы' }, { label: a.short }]} />
        <div className="agency-head" style={{ background: a.color }}>
          <div className="seller-ava">{a.short[0]}</div>
          <div className="stack" style={{ gap: 8 }}>
            <h1 style={{ fontSize: 'clamp(26px,3.4vw,40px)' }}>{a.name}</h1>
            <div className="row small">
              <Stars value={a.rating} /> <b>{a.rating.toFixed(1)}</b>
              <span className="muted">{a.reviewsCount} {plural(a.reviewsCount, 'отзыв', 'отзыва', 'отзывов')}</span>
              <span className="badge badge-green"><Icon name="shield" size={14} /> Из официального списка служб</span>
              {a.dispatcher24 && <span className="badge">Круглосуточно</span>}
            </div>
            <p style={{ maxWidth: 640 }}>{a.about}</p>
          </div>
          <div className="stack" style={{ minWidth: 220 }}>
            {a.phones.map((p) => (
              <a key={p.number} href={telLink(p.number)} className="btn btn-dark btn-s"><Icon name="phone" size={16} /> {p.number}</a>
            ))}
            <a href={mapLink(a.address)} target="_blank" rel="noreferrer" className="btn btn-outline btn-s"><Icon name="pin" size={16} /> На карте</a>
          </div>
        </div>

        <div className="grid grid-4" style={{ marginTop: 20 }}>
          <div className="stat"><b>{offers.length}</b><span className="small muted">товаров и услуг</span></div>
          <div className="stat"><b>от {rub(cheapest)}</b><span className="small muted">самое доступное</span></div>
          <div className="stat"><b>{a.ordersDone}</b><span className="small muted">заказов выполнено (демо)</span></div>
          <div className="stat"><b>{a.okrug}</b><span className="small muted">основной округ работы</span></div>
        </div>

        <div className="tabs" style={{ marginTop: 32 }}>
          <button className={'tab' + (tab === 'goods' ? ' active' : '')} onClick={() => setTab('goods')}>Товары и услуги</button>
          <button className={'tab' + (tab === 'about' ? ' active' : '')} onClick={() => setTab('about')}>О службе и контакты</button>
          <button className={'tab' + (tab === 'reviews' ? ' active' : '')} onClick={() => setTab('reviews')}>Отзывы</button>
        </div>

        {tab === 'goods' && (
          <>
            <div className="chips">
              <button className={'chip' + (cat === 'all' ? ' active' : '')} onClick={() => setCat('all')}>Все <span className="count">{offers.length}</span></button>
              {cats.map((c) => (
                <button key={c.id} className={'chip' + (cat === c.id ? ' active' : '')} onClick={() => setCat(c.id)}>{c.name}</button>
              ))}
            </div>
            <div className="products-grid" style={{ marginTop: 14 }}>{list.map((o) => <ProductCard key={o.id} offer={o} compact />)}</div>
          </>
        )}

        {tab === 'about' && (
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div className="card stack-l">
              <h3>Контакты</h3>
              <div className="contact-line"><Icon name="pin" /> <div>{a.address}{a.addressNote && <span className="muted"> ({a.addressNote})</span>}<br /><a href={mapLink(a.address)} target="_blank" rel="noreferrer" className="link small">Открыть в Яндекс Картах</a></div></div>
              {a.phones.map((p) => (
                <div key={p.number} className="contact-line"><Icon name="phone" /> <div><a href={telLink(p.number)} style={{ fontWeight: 700 }}>{p.number}</a>{p.note && <span className="muted small"> · {p.note}</span>}</div></div>
              ))}
              {a.email && <div className="contact-line"><Icon name="mail" /> <a href={`mailto:${a.email}`}>{a.email}</a></div>}
              <div className="contact-line"><Icon name="clock" /> {a.hours}</div>
            </div>
            <div className="stack-l">
              <div className="card stack">
                <h3>Чем служба может помочь</h3>
                <ul className="kbd-list" style={{ listStyle: 'none', padding: 0 }}>
                  {a.strengths.map((s) => <li key={s} className="row" style={{ gap: 8 }}><Icon name="check" size={18} /> {s}</li>)}
                </ul>
              </div>
              <div className="card stack">
                <h3>Что важно знать</h3>
                <p className="small">Все цены на странице фиксированные. Служба подтверждает заказ в течение 30 минут и сама связывается с вами, чтобы согласовать время и место.</p>
                <p className="small">Если вы закажете у нескольких служб, координатор От Души проследит, чтобы всё совпало по времени.</p>
              </div>
              <div className="notice">
                <Icon name="info" />
                <span className="small">Описание, часы работы, рейтинг и ассортимент в демо-версии примерные. Контакты взяты из официального списка специализированных служб.</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div style={{ maxWidth: 760 }}>
            <Reviews target={`agency:${a.slug}`} demo={demo} mine={mine} onAdd={(r) => setMine((m) => [r, ...m])} />
          </div>
        )}

        <div className="notice notice-green" style={{ marginTop: 36, alignItems: 'center' }}>
          <Icon name="heart" />
          <span>Можно собрать заказ из товаров разных служб. Мы проследим, чтобы всё было вовремя.</span>
          <Link to="/soprovozhdenie" className="btn btn-dark btn-s" style={{ marginLeft: 'auto' }}>Полное сопровождение</Link>
        </div>
      </div>
    </section>
  )
}
