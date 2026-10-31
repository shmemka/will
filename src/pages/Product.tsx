import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AVAILABILITY, agencyOfOffer, categoryById, demoReviews, offerById, offerTitle, offersByAgency, offersByType, typeById } from '../data/catalog'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import { Crumbs, Icon, Stars } from '../components/ui'
import { rub, plural, dateRu } from '../lib/format'
import { useAuth, useCart, useToast } from '../lib/store'
import { localReviews, saveReview, type UserReview } from '../lib/api'
import NotFound from './NotFound'
import AgencyAva from '../components/AgencyAva'

export default function Product() {
  const { offerId = '' } = useParams()
  const offer = offerById(offerId)
  const [view, setView] = useState(0)
  const [qty, setQty] = useState(() => (typeById(offerById(offerId)?.typeId ?? '')?.perGuest ? 10 : 1))
  const cart = useCart()
  const toast = useToast()
  const nav = useNavigate()
  const [mine, setMine] = useState<UserReview[]>(() => localReviews(offerId))
  const demo = useMemo(() => (offer ? demoReviews(offer.id, offer.reviews) : []), [offer])
  if (!offer) return <NotFound />
  const type = typeById(offer.typeId)!
  const agency = agencyOfOffer(offer)
  const cat = categoryById(type.category)!
  const others = offersByType(type.id).filter((o) => o.id !== offer.id).slice(0, 4)
  const more = offersByAgency(agency.id).filter((o) => o.id !== offer.id && typeById(o.typeId)!.category !== type.category).slice(0, 4)
  const inCart = cart.has(offer.id)
  const q = qty

  const add = () => {
    cart.add(offer.id, q)
    toast('Добавили в корзину')
  }

  return (
    <section className="section-s">
      <div className="container">
        <Crumbs items={[{ to: '/', label: 'Главная' }, { to: '/katalog', label: 'Каталог' }, { to: `/katalog?cat=${cat.id}`, label: cat.name }, { label: type.name }]} />
        <div className="grid grid-2" style={{ gap: 40, alignItems: 'start' }}>
          <div>
            <div className="gallery-main"><ProductArt typeId={type.id} palette={offer.palette} view={view} label={`${type.name}, вид ${view + 1}`} /></div>
            <div className="thumbs">
              {[0, 1, 2].map((v) => (
                <button key={v} className={'thumb' + (v === view ? ' active' : '')} onClick={() => setView(v)} aria-label={`Фото ${v + 1}`}>
                  <ProductArt typeId={type.id} palette={offer.palette} view={v} />
                </button>
              ))}
            </div>
            <p className="tiny muted" style={{ marginTop: 8 }}>Фотографии для примера. Точный вид товара служба покажет при подтверждении заказа.</p>
          </div>

          <div className="stack-l">
            <div className="stack" style={{ gap: 10 }}>
              <h1 style={{ fontSize: 'clamp(26px,3.2vw,38px)' }}>{offerTitle(offer)}</h1>
              <div className="row small">
                <Stars value={offer.rating} /> <b>{offer.rating.toFixed(1)}</b>
                <a href="#reviews" className="muted">{offer.reviews + mine.length} {plural(offer.reviews + mine.length, 'отзыв', 'отзыва', 'отзывов')}</a>
                <span className="badge badge-green">{AVAILABILITY[offer.available]}</span>
              </div>
            </div>

            <Link to={`/sluzhby/${agency.slug}`} className="seller-card">
              <AgencyAva agency={agency} />
              <div style={{ flex: 1 }}>
                <span className="tiny muted">Продавец</span>
                <b style={{ display: 'block' }}>{agency.name}</b>
                <span className="small muted">{agency.rating.toFixed(1)} ★ · {agency.okrug} · {agency.dispatcher24 ? 'круглосуточно' : agency.hours}</span>
              </div>
              <Icon name="arrow" />
            </Link>

            <div className="card stack">
              <div className="row between">
                <span className="price" style={{ fontSize: 34 }}>{rub(offer.price)}{type.unit && <span className="small muted" style={{ fontWeight: 500 }}> / {type.unit}</span>}</span>
                {(type.unit || type.perGuest) && (
                  <div className="qty" aria-label="Количество">
                    <button onClick={() => setQty(Math.max(1, q - 1))} aria-label="Меньше"><Icon name="minus" size={16} /></button>
                    <span>{q}</span>
                    <button onClick={() => setQty(q + 1)} aria-label="Больше"><Icon name="plus" size={16} /></button>
                  </div>
                )}
              </div>
              {(type.unit || type.perGuest) && q > 1 && <span className="small muted">Итого: {rub(offer.price * q)}</span>}
              <div className="row">
                <button className={'btn ' + (inCart ? 'btn-outline' : 'btn-primary')} onClick={inCart ? () => nav('/korzina') : add} style={{ flex: 1 }}>
                  {inCart ? <><Icon name="check" size={18} /> В корзине, перейти</> : <><Icon name="cart" size={18} /> В корзину</>}
                </button>
                {!inCart && (
                  <button className="btn btn-dark" onClick={() => { add(); nav('/oformlenie') }} style={{ flex: 1 }}>Оформить сразу</button>
                )}
              </div>
              <ul className="kbd-list small" style={{ listStyle: 'none', padding: 0 }}>
                <li className="row" style={{ gap: 8 }}><Icon name="lock" size={16} /> Цена фиксированная и не изменится на месте</li>
                <li className="row" style={{ gap: 8 }}><Icon name="shield" size={16} /> Служба подтвердит заказ в течение 30 минут</li>
                <li className="row" style={{ gap: 8 }}><Icon name="heart" size={16} /> Отменить можно бесплатно до подтверждения</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginTop: 48, gap: 40, alignItems: 'start' }}>
          <div className="stack-l">
            <div className="stack">
              <h2 style={{ fontSize: 26 }}>Описание</h2>
              <p>{type.desc}</p>
              {type.id === 'ribbon' && <p className="muted small">Текст для ленты можно указать при оформлении заказа.</p>}
            </div>
            <div className="stack">
              <h2 style={{ fontSize: 26 }}>Параметры</h2>
              <table className="params">
                <tbody>
                  {offer.variant && <tr><td>Вариант</td><td>{offer.variant}</td></tr>}
                  {type.params.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
                  <tr><td>Срок</td><td>{AVAILABILITY[offer.available]}</td></tr>
                  <tr><td>Категория</td><td>{cat.name}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="notice notice-blue">
              <Icon name="info" />
              <span className="small">Доставку к месту прощания служба согласует с вами после подтверждения заказа. Если нужно что-то особенное, напишите об этом в комментарии.</span>
            </div>
          </div>

          <Reviews id="reviews" target={offer.id} demo={demo} mine={mine} onAdd={(r) => setMine((m) => [r, ...m])} />
        </div>

        {others.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <div className="section-head">
              <h2 style={{ fontSize: 26 }}>Этот товар в других службах</h2>
              <Link to={`/katalog/${type.id}`} className="link">Сравнить все</Link>
            </div>
            <div className="products-grid">{others.map((o) => <ProductCard key={o.id} offer={o} />)}</div>
          </div>
        )}
        {more.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div className="section-head">
              <h2 style={{ fontSize: 26 }}>Ещё у службы «{agency.short}»</h2>
              <Link to={`/sluzhby/${agency.slug}`} className="link">Все товары службы</Link>
            </div>
            <div className="products-grid">{more.map((o) => <ProductCard key={o.id} offer={o} compact />)}</div>
          </div>
        )}
      </div>
    </section>
  )
}

export function Reviews({ id, target, demo, mine, onAdd }: { id?: string; target: string; demo: { id: string; author: string; rating: number; text: string; date: string }[]; mine: UserReview[]; onAdd: (r: UserReview) => void }) {
  const { user } = useAuth()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')
  const [name, setName] = useState(user?.name ?? '')
  const all = [...mine.map((r) => ({ ...r, mineFlag: true })), ...demo.map((r) => ({ ...r, mineFlag: false }))]
  const avg = all.length ? all.reduce((s, r) => s + r.rating, 0) / all.length : 0

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (text.trim().length < 5) return
    const r = await saveReview({ target, author: name.trim() || 'Без имени', rating, text: text.trim() })
    onAdd(r)
    setText('')
    setOpen(false)
    toast('Спасибо, что поделились')
  }

  return (
    <div id={id} className="stack-l">
      <div className="row between">
        <h2 style={{ fontSize: 26 }}>Отзывы</h2>
        <button className="btn btn-outline btn-s" onClick={() => setOpen((v) => !v)}>Оставить отзыв</button>
      </div>
      {all.length > 0 && (
        <div className="row"><Stars value={avg} size={18} /> <b>{avg.toFixed(1)}</b> <span className="muted small">на основе {all.length} {plural(all.length, 'отзыва', 'отзывов', 'отзывов')} на странице</span></div>
      )}
      {open && (
        <form className="card stack" onSubmit={submit}>
          <span className="label">Ваша оценка</span>
          <div className="row" style={{ gap: 4 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <button type="button" key={i} onClick={() => setRating(i)} className="btn-ghost" style={{ border: 0, background: 'none', cursor: 'pointer', color: i <= rating ? '#e9b500' : '#e3dccb', padding: 2 }} aria-label={`${i} из 5`}>
                <Icon name="star" size={28} />
              </button>
            ))}
          </div>
          <input className="input" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea className="textarea" placeholder="Расскажите, как всё прошло. Это поможет другим семьям" value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn btn-dark" disabled={text.trim().length < 5}>Отправить</button>
        </form>
      )}
      {all.length === 0 ? (
        <p className="muted">Пока отзывов нет. Если вы уже пользовались этой услугой, расскажите, как всё прошло.</p>
      ) : (
        <div className="card" style={{ paddingTop: 6, paddingBottom: 6 }}>
          {all.map((r) => (
            <div key={r.id} className="review">
              <div className="row between">
                <div className="row" style={{ gap: 8 }}>
                  <b>{r.author}</b>
                  {r.mineFlag ? <span className="badge badge-yellow">Ваш отзыв</span> : <span className="badge badge-gray">Пример отзыва</span>}
                </div>
                <span className="small muted">{dateRu(r.date)}</span>
              </div>
              <Stars value={r.rating} size={14} />
              <p style={{ marginTop: 6 }}>{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
