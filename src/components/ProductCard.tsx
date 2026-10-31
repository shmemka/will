import { Link } from 'react-router-dom'
import { AVAILABILITY, agencyOfOffer, offerTitle, typeById, type Offer } from '../data/catalog'
import { rub } from '../lib/format'
import { useCart, useToast } from '../lib/store'
import ProductArt from './ProductArt'
import { Icon } from './ui'

export default function ProductCard({ offer, compact }: { offer: Offer; compact?: boolean }) {
  const type = typeById(offer.typeId)!
  const agency = agencyOfOffer(offer)
  const cart = useCart()
  const toast = useToast()
  const inCart = cart.has(offer.id)
  return (
    <article className="pcard">
      <Link to={`/tovar/${offer.id}`} className="pcard-img" aria-label={offerTitle(offer)}>
        <ProductArt typeId={type.id} palette={offer.palette} label={type.name} />
        {offer.available === 'today' && <span className="pcard-flag">Можно сегодня</span>}
      </Link>
      <div className="pcard-body">
        <Link to={`/tovar/${offer.id}`} className="pcard-title">{offerTitle(offer)}</Link>
        {!compact && <Link to={`/sluzhby/${agency.slug}`} className="pcard-seller">{agency.short}</Link>}
        <span className="pcard-meta">
          <Icon name="star" size={13} /> {offer.rating.toFixed(1)}
          {offer.available !== 'today' && <> · {AVAILABILITY[offer.available].toLowerCase()}</>}
        </span>
        <div className="pcard-foot">
          <span className="price">
            {rub(offer.price)}
            {type.unit && <span className="small muted" style={{ fontWeight: 400 }}> / {type.unit}</span>}
          </span>
          <button
            className={'btn btn-xs ' + (inCart ? 'btn-outline' : 'btn-primary')}
            onClick={() => {
              if (inCart) return
              cart.add(offer.id)
              toast('Добавили в корзину')
            }}
            aria-label={inCart ? 'Уже в корзине' : 'В корзину'}
          >
            <Icon name={inCart ? 'check' : 'plus'} size={16} />
            <span className="hide-s">{inCart ? 'В корзине' : 'В корзину'}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
