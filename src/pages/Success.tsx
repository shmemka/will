import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { agencyById } from '../data/agencies'
import { getOrder, type Order } from '../lib/api'
import { rub } from '../lib/format'
import { ScenePhoto } from '../components/ProductArt'
import { SCENE } from '../data/photos'
import { Icon } from '../components/ui'
import { SUPPORT_PHONE } from '../data/guide'

export default function Success() {
  const { id = '' } = useParams()
  const loc = useLocation()
  const checkEmail = (loc.state as { checkEmail?: boolean } | null)?.checkEmail
  const [order, setOrder] = useState<Order | null>(null)
  useEffect(() => {
    getOrder(id).then(setOrder)
  }, [id])

  return (
    <section className="section">
      <div className="container flow-wrap stack-l">
        <div className="center stack" style={{ alignItems: 'center' }}>
          <ScenePhoto id={SCENE.roses} className="intro-photo" ratio="16 / 9" />
          <h1 style={{ fontSize: 'clamp(30px,4vw,44px)' }}>Спасибо. Заказ принят</h1>
          {order && <span className="badge badge-yellow" style={{ fontSize: 15 }}>Номер заказа {order.number}</span>}
          <p className="lead" style={{ maxWidth: 600 }}>
            Самое сложное позади. Дальше мы всё возьмём на себя и будем держать вас в курсе. Берегите себя.
          </p>
        </div>

        <div className="card stack-l">
          <h3>Что будет дальше</h3>
          <div className="timeline">
            <div className="tl ok"><div className="m"><Icon name="check" size={14} /></div><div><b>Оплата прошла</b><p className="small muted">Деньги хранятся у платёжного сервиса до выполнения заказа.</p></div></div>
            <div className="tl now"><div className="m">2</div><div><b>Службы подтверждают заказ</b><p className="small muted">Обычно это занимает до 30 минут. Мы пришлём уведомление.</p></div></div>
            <div className="tl"><div className="m">3</div><div><b>Координатор позвонит вам</b><p className="small muted">Уточнит время, место и детали. Если удобнее переписка, напишем.</p></div></div>
            <div className="tl"><div className="m">4</div><div><b>Всё будет готово ко времени прощания</b><p className="small muted">Статусы каждой части заказа видны в личном кабинете.</p></div></div>
          </div>
        </div>

        <div className="notice notice-green">
          <Icon name="mail" />
          {checkEmail ? (
            <span>Мы отправили письмо на <b>{order?.customer.email}</b>. Нажмите на ссылку в нём или <Link to="/kabinet" className="link">введите код из письма</Link>, чтобы войти в личный кабинет. Пароль не нужен.</span>
          ) : (
            <span>Мы создали для вас личный кабинет на <b>{order?.customer.email}</b>. Там все заказы, статусы и контакты служб.</span>
          )}
        </div>

        {order && (
          <div className="card stack">
            <b>Состав заказа</b>
            {order.parts.map((p) => (
              <div key={p.id} className="summary-line">
                <span>{agencyById(p.agencyId)?.name} <span className="muted small">· {p.items.length} поз.</span></span>
                <b>{rub(p.subtotal)}</b>
              </div>
            ))}
            <div className="summary-total"><span>Оплачено</span><span>{rub(order.total)}</span></div>
          </div>
        )}

        <div className="row" style={{ justifyContent: 'center' }}>
          {!checkEmail && order && <Link to={`/kabinet/zakaz/${order.id}`} className="btn btn-primary">Открыть заказ в кабинете</Link>}
          <Link to="/chto-delat" className="btn btn-outline">Памятка: что делать дальше</Link>
        </div>
        <p className="center small muted">Если что-то срочное, звоните в любое время: <b>{SUPPORT_PHONE}</b></p>
      </div>
    </section>
  )
}
