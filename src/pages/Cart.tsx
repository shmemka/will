import { Link, useNavigate } from 'react-router-dom'
import { agencyById } from '../data/agencies'
import { offerTitle, typeById } from '../data/catalog'
import ProductArt from '../components/ProductArt'
import { CatalogArt } from '../components/Illustrations'
import { Crumbs, Icon } from '../components/ui'
import { plural, rub } from '../lib/format'
import { useCart } from '../lib/store'

export function groupByAgency<T extends { offer: { agencyId: string } }>(items: T[]) {
  const map = new Map<string, T[]>()
  items.forEach((it) => map.set(it.offer.agencyId, [...(map.get(it.offer.agencyId) ?? []), it]))
  return Array.from(map.entries()).map(([agencyId, list]) => ({ agency: agencyById(agencyId)!, list }))
}

export default function Cart() {
  const cart = useCart()
  const nav = useNavigate()
  const groups = groupByAgency(cart.items)

  if (!cart.items.length) {
    return (
      <section className="section">
        <div className="container empty stack" style={{ alignItems: 'center' }}>
          <CatalogArt className="choice-art" />
          <h1 style={{ fontSize: 34 }}>Корзина пока пустая</h1>
          <p className="muted" style={{ maxWidth: 480 }}>Можно выбрать товары в каталоге или пройти полное сопровождение: мы поможем собрать всё по шагам.</p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <Link to="/soprovozhdenie" className="btn btn-primary">Полное сопровождение</Link>
            <Link to="/katalog" className="btn btn-outline">В каталог</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-s">
      <div className="container">
        <Crumbs items={[{ to: '/', label: 'Главная' }, { label: 'Корзина' }]} />
        <h1 style={{ fontSize: 'clamp(28px,3.6vw,40px)', marginBottom: 8 }}>Корзина</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          {cart.count} {plural(cart.count, 'позиция', 'позиции', 'позиций')} от {groups.length} {plural(groups.length, 'службы', 'служб', 'служб')}. Каждая служба подтвердит свою часть заказа отдельно.
        </p>
        <div className="layout-side">
          <div className="stack-l">
            {groups.map(({ agency, list }) => (
              <div key={agency.id} className="card stack">
                <div className="row between">
                  <Link to={`/sluzhby/${agency.slug}`} className="row" style={{ textDecoration: 'none', gap: 10 }}>
                    <div className="seller-ava" style={{ background: agency.color, width: 40, height: 40, fontSize: 16, borderRadius: 12 }}>{agency.short[0]}</div>
                    <b>{agency.name}</b>
                  </Link>
                  <span className="small muted">{rub(list.reduce((s, x) => s + x.offer.price * x.line.qty, 0))}</span>
                </div>
                {list.map(({ line, offer }) => {
                  const t = typeById(offer.typeId)!
                  return (
                    <div key={offer.id} className="offer-pick" style={{ cursor: 'default', gridTemplateColumns: '84px minmax(0,1fr) auto' }}>
                      <Link to={`/tovar/${offer.id}`} className="art"><ProductArt kind={t.art} palette={offer.palette} /></Link>
                      <div className="stack" style={{ gap: 6, minWidth: 0 }}>
                        <Link to={`/tovar/${offer.id}`} style={{ fontWeight: 700, textDecoration: 'none' }}>{offerTitle(offer)}</Link>
                        <div className="row" style={{ gap: 10 }}>
                          <div className="qty">
                            <button onClick={() => cart.setQty(offer.id, line.qty - 1)} aria-label="Меньше"><Icon name="minus" size={15} /></button>
                            <span>{line.qty}</span>
                            <button onClick={() => cart.setQty(offer.id, line.qty + 1)} aria-label="Больше"><Icon name="plus" size={15} /></button>
                          </div>
                          {t.unit && <span className="small muted">{t.unit}</span>}
                          <button className="btn btn-ghost btn-s" onClick={() => cart.remove(offer.id)}><Icon name="trash" size={16} /> Убрать</button>
                        </div>
                      </div>
                      <span className="price nowrap">{rub(offer.price * line.qty)}</span>
                    </div>
                  )
                })}
              </div>
            ))}
            <button className="link small" style={{ alignSelf: 'flex-start' }} onClick={() => { if (window.confirm('Убрать всё из корзины?')) cart.clear() }}>Очистить корзину</button>
          </div>
          <aside className="sticky-side stack">
            <div className="card stack">
              <div className="summary-line"><span>Товары и услуги</span><span>{rub(cart.total)}</span></div>
              <div className="summary-line"><span>Сервис От Души</span><span className="badge badge-green">Бесплатно</span></div>
              <div className="summary-total"><span>Итого</span><span>{rub(cart.total)}</span></div>
              <button className="btn btn-primary" onClick={() => nav('/oformlenie')}>Оформить заказ</button>
              <p className="tiny muted">Цена фиксированная. Отменить часть заказа можно бесплатно, пока служба её не подтвердила.</p>
            </div>
            <div className="notice notice-blue small"><Icon name="heart" size={18} /> <span>Если что-то забыли, координатор подскажет при звонке.</span></div>
          </aside>
        </div>
      </div>
    </section>
  )
}
