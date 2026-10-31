import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AVAILABILITY, agencyOfOffer, demoReviews, offerNote, type Offer } from '../data/catalog'
import { localReviews } from '../lib/api'
import { dateRu, plural, rub } from '../lib/format'
import ProductArt from './ProductArt'
import AgencyAva from './AgencyAva'
import { Icon, Modal, Stars } from './ui'

type Props = {
  offers: Offer[]
  /** Режим выбора: одна карточка выбрана, повторное нажатие снимает выбор */
  selectedId?: string
  onSelect?: (id: string) => void
  /** Режим корзины */
  inCart?: (id: string) => boolean
  onAdd?: (id: string) => void
  unit?: string
}

export default function OfferSlider({ offers, selectedId, onSelect, inCart, onAdd, unit }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const [reviewsOf, setReviewsOf] = useState<Offer | null>(null)
  const cheapest = Math.min(...offers.map((o) => o.price))
  const best = Math.max(...offers.map((o) => o.rating))

  const scroll = (dir: number) => {
    const el = track.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.oc')
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 280) + 16), behavior: 'smooth' })
  }

  return (
    <div className="oslider">
      <div className="oslider-head">
        <span className="small muted">{offers.length} {plural(offers.length, 'предложение', 'предложения', 'предложений')}, листайте вбок</span>
        {offers.length > 1 && (
          <div className="row" style={{ gap: 8 }}>
            <button className="oslider-arrow" onClick={() => scroll(-1)} aria-label="Назад"><Icon name="back" size={18} /></button>
            <button className="oslider-arrow" onClick={() => scroll(1)} aria-label="Вперёд"><Icon name="arrow" size={18} /></button>
          </div>
        )}
      </div>
      <div className="oslider-track" ref={track}>
        {offers.map((o) => {
          const a = agencyOfOffer(o)
          const sel = selectedId === o.id
          const added = inCart?.(o.id)
          const count = o.reviews + localReviews(o.id).length
          return (
            <article key={o.id} className={'oc' + (sel ? ' selected' : '')}>
              <div className="oc-art">
                <ProductArt typeId={o.typeId} palette={o.palette} />
                <div className="oc-badges">
                  {o.price === cheapest && <span className="badge badge-green">Лучшая цена</span>}
                  {o.rating === best && offers.length > 2 && <span className="badge badge-yellow">Лучшая оценка</span>}
                </div>
              </div>
              <div className="oc-body">
                <div className="oc-seller">
                  <AgencyAva agency={a} small />
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/sluzhby/${a.slug}`} className="oc-name" target={onSelect ? '_blank' : undefined}>{a.short}</Link>
                    <span className="small muted">{a.okrug}{a.dispatcher24 ? ' · круглосуточно' : ''}</span>
                  </div>
                </div>
                <button className="oc-rating" onClick={() => setReviewsOf(o)}>
                  <Stars value={o.rating} size={14} /> <b>{o.rating.toFixed(1)}</b>
                  <span className="muted">{count ? `${count} ${plural(count, 'отзыв', 'отзыва', 'отзывов')}` : 'отзывов пока нет'}</span>
                </button>
                <p className="oc-note">«{offerNote(o)}»</p>
                <ul className="oc-facts">
                  {o.variant && <li><Icon name="info" size={15} /> {o.variant}</li>}
                  <li><Icon name="clock" size={15} /> {AVAILABILITY[o.available]}</li>
                  <li><Icon name="shield" size={15} /> Цена фиксированная, без доплат</li>
                </ul>
                <div className="oc-foot">
                  <div>
                    <div className="price">{rub(o.price)}</div>
                    {unit && <span className="small muted">за {unit}</span>}
                  </div>
                  <Link to={`/tovar/${o.id}`} className="link small" target={onSelect ? '_blank' : undefined}>Подробнее</Link>
                </div>
                {onSelect && (
                  <button className={'btn ' + (sel ? 'btn-dark' : 'btn-primary')} onClick={() => onSelect(o.id)} aria-pressed={sel}>
                    {sel ? <><Icon name="check" size={16} /> Выбрано</> : 'Выбрать'}
                  </button>
                )}
                {onAdd && (
                  <button className={'btn ' + (added ? 'btn-outline' : 'btn-primary')} onClick={() => !added && onAdd(o.id)}>
                    {added ? <><Icon name="check" size={16} /> В корзине</> : 'В корзину'}
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
      <ReviewsModal offer={reviewsOf} onClose={() => setReviewsOf(null)} />
    </div>
  )
}

function ReviewsModal({ offer, onClose }: { offer: Offer | null; onClose: () => void }) {
  const list = useMemo(() => {
    if (!offer) return []
    return [...localReviews(offer.id), ...demoReviews(offer.id, offer.reviews)]
  }, [offer])
  if (!offer) return null
  const a = agencyOfOffer(offer)
  return (
    <Modal open onClose={onClose} title={`Отзывы: ${a.short}`}>
      <div className="stack">
        <div className="row"><Stars value={offer.rating} size={18} /> <b style={{ fontSize: 20 }}>{offer.rating.toFixed(1)}</b> <span className="muted small">{offer.name}</span></div>
        {offer.reviews > list.length && <p className="small muted" style={{ margin: 0 }}>Последние {list.length} из {offer.reviews + localReviews(offer.id).length} отзывов</p>}
        {list.length === 0 && <p className="muted">Отзывов пока нет. Вы можете стать первым, кто поделится опытом.</p>}
        {list.map((r) => (
          <div key={r.id} className="review-mini">
            <div className="row between"><b>{r.author}</b><span className="small muted">{dateRu(r.date)}</span></div>
            <Stars value={r.rating} size={13} />
            <p>{r.text}</p>
          </div>
        ))}
        <Link to={`/tovar/${offer.id}#reviews`} className="btn btn-outline" onClick={onClose}>Все отзывы и подробности о товаре</Link>
      </div>
    </Modal>
  )
}
