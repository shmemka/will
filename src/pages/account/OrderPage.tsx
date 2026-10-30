import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { agencyById, telLink } from '../../data/agencies'
import { SUPPORT_PHONE } from '../../data/guide'
import { getOrder, orderStatus, PART_STATUS, type Order, type PartStatus } from '../../lib/api'
import { dateRu, dateTimeRu, rub } from '../../lib/format'
import { useAuth, useToast } from '../../lib/store'
import { isDemo } from '../../lib/supabase'
import { Crumbs, Icon } from '../../components/ui'

const FLOW: PartStatus[] = ['pending', 'confirmed', 'in_progress', 'done']

export default function OrderPage() {
  const { id = '' } = useParams()
  const { user, ready } = useAuth()
  const toast = useToast()
  const [order, setOrder] = useState<Order | null | undefined>(undefined)
  useEffect(() => {
    getOrder(id).then(setOrder)
  }, [id])

  if (!ready || order === undefined) return <section className="section"><div className="spinner" /></section>
  if (!order || !user || order.customer.email !== user.email.toLowerCase()) {
    return (
      <section className="section">
        <div className="container empty stack" style={{ alignItems: 'center' }}>
          <h2>Заказ не найден</h2>
          <p className="muted">Возможно, вы вошли с другой почтой. Войдите с той, на которую оформляли заказ.</p>
          <Link to="/kabinet" className="btn btn-primary">В личный кабинет</Link>
        </div>
      </section>
    )
  }
  const st = orderStatus(order)
  const d = order.details

  return (
    <section className="section-s">
      <div className="container">
        <Crumbs items={[{ to: '/kabinet', label: 'Личный кабинет' }, { label: `Заказ ${order.number}` }]} />
        <div className="row between" style={{ marginBottom: 20 }}>
          <div className="stack" style={{ gap: 6 }}>
            <h1 style={{ fontSize: 'clamp(26px,3.4vw,38px)' }}>Заказ {order.number}</h1>
            <span className="small muted">Оформлен {dateTimeRu(order.createdAt)}</span>
          </div>
          <span className={'badge ' + st.tone} style={{ fontSize: 15, padding: '6px 14px' }}>{st.label}</span>
        </div>

        <div className="layout-side">
          <div className="stack-l">
            {order.parts.map((p) => {
              const a = agencyById(p.agencyId)!
              const idx = FLOW.indexOf(p.status)
              return (
                <div key={p.id} className="card stack-l">
                  <div className="row between">
                    <Link to={`/sluzhby/${a.slug}`} className="row" style={{ textDecoration: 'none', gap: 10 }}>
                      <div className="seller-ava" style={{ background: a.color, width: 44, height: 44, fontSize: 18, borderRadius: 14 }}>{a.short[0]}</div>
                      <div><b style={{ display: 'block' }}>{a.name}</b><span className="small muted">{a.phones[0].number}</span></div>
                    </Link>
                    <span className={'badge ' + PART_STATUS[p.status].tone}>{PART_STATUS[p.status].label}</span>
                  </div>
                  <p className="small">{PART_STATUS[p.status].text}</p>
                  {p.status !== 'declined' && (
                    <div className="row" style={{ gap: 6 }}>
                      {FLOW.map((s, i) => (
                        <div key={s} style={{ flex: 1 }}>
                          <div style={{ height: 6, borderRadius: 99, background: i <= idx ? 'var(--ink)' : 'var(--sand-2)' }} />
                          <span className="tiny muted">{PART_STATUS[s].label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    {p.items.map((it) => (
                      <div key={it.offerId} className="summary-line">
                        <Link to={`/tovar/${it.offerId}`}>{it.title}{it.qty > 1 ? ` × ${it.qty}` : ''}</Link>
                        <span className="nowrap">{rub(it.price * it.qty)}</span>
                      </div>
                    ))}
                    <div className="summary-line" style={{ fontWeight: 700 }}><span>Итого по службе</span><span>{rub(p.subtotal)}</span></div>
                  </div>
                  <div className="row">
                    <a href={telLink(a.phones[0].number)} className="btn btn-outline btn-s"><Icon name="phone" size={16} /> Позвонить в службу</a>
                    {p.status === 'pending' && <button className="btn btn-ghost btn-s" onClick={() => toast('Мы передали просьбу. Координатор перезвонит, чтобы всё уточнить')}>Отменить эту часть</button>}
                    {p.status === 'done' && <Link to={`/sluzhby/${a.slug}`} className="btn btn-ghost btn-s"><Icon name="star" size={16} /> Оставить отзыв</Link>}
                  </div>
                </div>
              )
            })}
            {isDemo && (
              <div className="notice small">
                <Icon name="info" size={18} />
                <span>В демо-версии статусы меняются в <Link to="/partner" className="link">кабинете службы</Link>: там можно подтвердить заказ от имени службы и посмотреть, как это выглядит для семьи.</span>
              </div>
            )}
          </div>

          <aside className="sticky-side stack">
            <div className="card stack">
              <b>Детали прощания</b>
              <table className="params small">
                <tbody>
                  <tr><td>Близкий человек</td><td>{d.deceasedName || 'Не указано'}</td></tr>
                  <tr><td>Дата</td><td>{d.date ? dateRu(d.date) : 'Уточним'}{d.time ? `, ${d.time}` : ''}</td></tr>
                  <tr><td>Где сейчас</td><td>{d.place || 'Уточним'}</td></tr>
                  <tr><td>Кладбище или крематорий</td><td>{d.cemetery || 'Уточним'}</td></tr>
                  {d.ribbonText && <tr><td>Текст ленты</td><td>{d.ribbonText}</td></tr>}
                  {d.comment && <tr><td>Комментарий</td><td>{d.comment}</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="card stack">
              <b>Оплата</b>
              <div className="summary-line"><span>{order.payment.method === 'card' ? `Карта ··${order.payment.last4}` : 'СБП'}</span><span className="badge badge-green">Оплачено</span></div>
              <div className="summary-total"><span>Сумма</span><span>{rub(order.total)}</span></div>
              <button className="btn btn-ghost btn-s no-print" onClick={() => window.print()}><Icon name="doc" size={16} /> Распечатать или сохранить чек</button>
            </div>
            <div className="card stack">
              <b>Ваш координатор</b>
              <p className="small muted">Он на связи круглосуточно и следит, чтобы все службы приехали вовремя.</p>
              <a href={telLink(SUPPORT_PHONE)} className="btn btn-primary btn-s"><Icon name="phone" size={16} /> {SUPPORT_PHONE}</a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
