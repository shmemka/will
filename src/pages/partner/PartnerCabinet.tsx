import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AGENCIES, agencyById } from '../../data/agencies'
import { offersByAgency, offerTitle } from '../../data/catalog'
import { localOrdersForAgency, PART_STATUS, updatePartStatus, type Order, type PartStatus } from '../../lib/api'
import { dateRu, dateTimeRu, load, rub, save } from '../../lib/format'
import { useToast } from '../../lib/store'
import { Crumbs, Icon } from '../../components/ui'

const COMMISSION = 0.15
const NEXT: Partial<Record<PartStatus, { to: PartStatus; label: string }>> = {
  pending: { to: 'confirmed', label: 'Подтвердить заказ' },
  confirmed: { to: 'in_progress', label: 'Взять в работу' },
  in_progress: { to: 'done', label: 'Отметить выполненным' },
}

export default function PartnerCabinet() {
  const [agencyId, setAgencyId] = useState<string>(() => load('od_partner_agency', ''))
  const [tab, setTab] = useState<'orders' | 'goods' | 'stats'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const toast = useToast()
  useEffect(() => {
    save('od_partner_agency', agencyId)
  }, [agencyId])
  const reload = () => {
    if (agencyId) setOrders(localOrdersForAgency(agencyId))
  }
  useEffect(reload, [agencyId])

  if (!agencyId) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 560 }}>
          <div className="card stack-l" style={{ padding: 32 }}>
            <span className="badge badge-blue" style={{ alignSelf: 'flex-start' }}>Демо-кабинет службы</span>
            <h1 style={{ fontSize: 30 }}>Вход для ритуальных служб</h1>
            <p className="muted">В рабочей версии служба входит по своей почте. В демо можно выбрать любую службу и посмотреть, как к ней приходят заказы.</p>
            <select className="select" defaultValue="" onChange={(e) => setAgencyId(e.target.value)} aria-label="Служба">
              <option value="" disabled>Выберите службу</option>
              {AGENCIES.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            <Link to="/partneram" className="link small">Как подключиться к От Души</Link>
          </div>
        </div>
      </section>
    )
  }

  const a = agencyById(agencyId)!
  const parts = orders.map((o) => ({ o, p: o.parts.find((x) => x.agencyId === agencyId)! }))
  const done = parts.filter((x) => x.p.status === 'done')
  const revenue = done.reduce((s, x) => s + x.p.subtotal, 0)
  const pendingN = parts.filter((x) => x.p.status === 'pending').length

  const move = async (o: Order, partId: string, to: PartStatus) => {
    await updatePartStatus(o.id, partId, to)
    reload()
    toast(to === 'declined' ? 'Семья получит уведомление, мы подберём замену' : `Статус: ${PART_STATUS[to].label.toLowerCase()}`)
  }

  return (
    <section className="section-s">
      <div className="container">
        <Crumbs items={[{ to: '/partneram', label: 'Для служб' }, { label: 'Кабинет службы' }]} />
        <div className="row between" style={{ marginBottom: 20 }}>
          <div className="row" style={{ gap: 14 }}>
            <div className="seller-ava" style={{ background: a.color }}>{a.short[0]}</div>
            <div>
              <h1 style={{ fontSize: 'clamp(24px,3vw,34px)' }}>{a.name}</h1>
              <span className="small muted">Демо-кабинет службы · заказы из этого браузера</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-s" onClick={() => setAgencyId('')}>Сменить службу</button>
        </div>

        <div className="grid grid-4" style={{ marginBottom: 24 }}>
          <div className="stat"><b>{pendingN}</b><span className="small muted">ждут подтверждения</span></div>
          <div className="stat"><b>{parts.length}</b><span className="small muted">всего заказов</span></div>
          <div className="stat"><b>{rub(revenue)}</b><span className="small muted">выполнено на сумму</span></div>
          <div className="stat"><b>{rub(revenue * (1 - COMMISSION))}</b><span className="small muted">к выплате после комиссии 15%</span></div>
        </div>

        <div className="tabs">
          <button className={'tab' + (tab === 'orders' ? ' active' : '')} onClick={() => setTab('orders')}>Заказы {pendingN > 0 && <span className="badge badge-yellow">{pendingN}</span>}</button>
          <button className={'tab' + (tab === 'goods' ? ' active' : '')} onClick={() => setTab('goods')}>Товары и цены</button>
          <button className={'tab' + (tab === 'stats' ? ' active' : '')} onClick={() => setTab('stats')}>Выплаты</button>
        </div>

        {tab === 'orders' && (
          parts.length === 0 ? (
            <div className="card empty stack" style={{ alignItems: 'center' }}>
              <h3>Заказов пока нет</h3>
              <p className="muted">Оформите тестовый заказ на сайте с товаром этой службы, и он появится здесь.</p>
              <Link to={`/sluzhby/${a.slug}`} className="btn btn-primary">Открыть страницу службы</Link>
            </div>
          ) : (
            <div className="stack">
              {parts.map(({ o, p }) => (
                <div key={o.id} className="card stack">
                  <div className="row between">
                    <b style={{ fontSize: 18 }}>Заказ {o.number}</b>
                    <span className={'badge ' + PART_STATUS[p.status].tone}>{PART_STATUS[p.status].label}</span>
                  </div>
                  <span className="small muted">{dateTimeRu(o.createdAt)} · оплачен</span>
                  <div className="grid grid-2" style={{ gap: 16 }}>
                    <div className="stack" style={{ gap: 4 }}>
                      {p.items.map((it) => (
                        <div key={it.offerId} className="summary-line" style={{ padding: '2px 0' }}><span>{it.title}{it.qty > 1 ? ` × ${it.qty}` : ''}</span><span>{rub(it.price * it.qty)}</span></div>
                      ))}
                      <div className="summary-line" style={{ fontWeight: 700 }}><span>Сумма</span><span>{rub(p.subtotal)}</span></div>
                    </div>
                    <table className="params small">
                      <tbody>
                        <tr><td>Заказчик</td><td>{o.customer.name}, {o.customer.phone}</td></tr>
                        <tr><td>Связь</td><td>{{ call: 'звонок', messenger: 'мессенджер', email: 'почта' }[o.details.contactWay ?? 'call']}</td></tr>
                        <tr><td>Дата</td><td>{o.details.date ? dateRu(o.details.date) : 'уточнить'}{o.details.time ? `, ${o.details.time}` : ''}</td></tr>
                        <tr><td>Где</td><td>{o.details.place || 'уточнить'}</td></tr>
                        {o.details.comment && <tr><td>Комментарий</td><td>{o.details.comment}</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <div className="row">
                    {NEXT[p.status] && <button className="btn btn-primary btn-s" onClick={() => move(o, p.id, NEXT[p.status]!.to)}><Icon name="check" size={16} /> {NEXT[p.status]!.label}</button>}
                    {p.status === 'pending' && <button className="btn btn-ghost btn-s" onClick={() => move(o, p.id, 'declined')}>Не сможем выполнить</button>}
                    <Link to={`/kabinet/zakaz/${o.id}`} className="btn btn-ghost btn-s">Как видит семья</Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'goods' && <Goods agencyId={agencyId} />}

        {tab === 'stats' && (
          <div className="card stack">
            <b>Выплаты</b>
            <p className="small muted">Деньги за выполненную часть заказа переводятся на расчётный счёт службы в течение 3 рабочих дней. Комиссия сервиса 15%.</p>
            {done.length === 0 ? <p className="muted">Выполненных заказов пока нет.</p> : (
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Заказ</th><th>Сумма</th><th>Комиссия</th><th>К выплате</th></tr></thead>
                  <tbody>{done.map(({ o, p }) => <tr key={o.id}><td>{o.number}</td><td>{rub(p.subtotal)}</td><td>{rub(p.subtotal * COMMISSION)}</td><td><b>{rub(p.subtotal * (1 - COMMISSION))}</b></td></tr>)}</tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function Goods({ agencyId }: { agencyId: string }) {
  const key = `od_partner_goods_${agencyId}`
  const [over, setOver] = useState<Record<string, { price?: number; off?: boolean }>>(() => load(key, {}))
  useEffect(() => {
    save(key, over)
  }, [key, over])
  const list = offersByAgency(agencyId)
  return (
    <div className="stack">
      <div className="notice small"><Icon name="info" size={18} /> <span>В демо изменения сохраняются только в этом браузере. В рабочей версии они сразу попадут в каталог.</span></div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Товар или услуга</th><th>Цена, ₽</th><th>В продаже</th></tr></thead>
          <tbody>
            {list.map((o) => {
              const ov = over[o.id] ?? {}
              return (
                <tr key={o.id} style={{ opacity: ov.off ? 0.5 : 1 }}>
                  <td><Link to={`/tovar/${o.id}`}>{offerTitle(o)}</Link></td>
                  <td><input className="input" style={{ width: 120, padding: '8px 12px' }} inputMode="numeric" value={ov.price ?? o.price} onChange={(e) => setOver({ ...over, [o.id]: { ...ov, price: Number(e.target.value.replace(/\D/g, '')) || 0 } })} aria-label="Цена" /></td>
                  <td><label className="checkbox"><input type="checkbox" checked={!ov.off} onChange={(e) => setOver({ ...over, [o.id]: { ...ov, off: !e.target.checked } })} /> {ov.off ? 'Скрыт' : 'Да'}</label></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
