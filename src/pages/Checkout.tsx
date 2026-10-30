import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { offerTitle } from '../data/catalog'
import { Crumbs, Icon } from '../components/ui'
import { isEmail, isPhone, rub, uid } from '../lib/format'
import { useAuth, useCart } from '../lib/store'
import { createOrder, newOrderNumber, signInWithEmail, type Order, type OrderDetails } from '../lib/api'
import { isDemo } from '../lib/supabase'
import { groupByAgency } from './Cart'

type Step = 1 | 2 | 3
const STEPS = ['Контакты', 'Детали прощания', 'Оплата']

export default function Checkout() {
  const cart = useCart()
  const { user, refresh } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [c, setC] = useState({ name: user?.name ?? '', phone: user?.phone ?? '', email: user?.email ?? '' })
  const [det, setDet] = useState<OrderDetails>({ contactWay: 'call' })
  const [method, setMethod] = useState<'card' | 'sbp'>('card')
  const [card, setCard] = useState({ num: '4242 4242 4242 4242', exp: '12/28', cvc: '123' })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')

  if (!cart.items.length && !paying) return <Navigate to="/korzina" replace />
  const groups = groupByAgency(cart.items)
  const hasRibbon = cart.items.some((x) => x.offer.typeId === 'ribbon')

  const next1 = (e: FormEvent) => {
    e.preventDefault()
    const er: Record<string, string> = {}
    if (!c.name.trim()) er.name = 'Подскажите, как к вам обращаться'
    if (!isPhone(c.phone)) er.phone = 'Проверьте номер телефона'
    if (!isEmail(c.email)) er.email = 'Проверьте адрес почты'
    setErrors(er)
    if (!Object.keys(er).length) setStep(2)
  }

  const pay = async (e: FormEvent) => {
    e.preventDefault()
    if (!agree) return setErrors({ agree: 'Нужно ваше согласие, чтобы мы могли передать заказ службам' })
    if (method === 'card' && card.num.replace(/\D/g, '').length < 16) return setErrors({ card: 'Проверьте номер карты' })
    setErrors({})
    setPaying(true)
    setPayError('')
    await new Promise((r) => setTimeout(r, 1800)) // имитация оплаты
    const now = new Date().toISOString()
    const order: Order = {
      id: uid(),
      number: newOrderNumber(),
      createdAt: now,
      customer: { name: c.name.trim(), phone: c.phone.trim(), email: c.email.trim().toLowerCase() },
      details: det,
      payment: { method, status: 'paid', paidAt: now, last4: method === 'card' ? card.num.replace(/\D/g, '').slice(-4) : undefined },
      total: cart.total,
      source: cart.source,
      parts: groups.map(({ agency, list }) => ({
        id: uid(),
        agencyId: agency.id,
        status: 'pending',
        subtotal: list.reduce((s, x) => s + x.offer.price * x.line.qty, 0),
        items: list.map((x) => ({ offerId: x.offer.id, title: offerTitle(x.offer), price: x.offer.price, qty: x.line.qty })),
        updatedAt: now,
      })),
    }
    try {
      await createOrder(order)
      const res = await signInWithEmail(order.customer.email, { name: order.customer.name, phone: order.customer.phone })
      await refresh()
      cart.clear()
      nav(`/zakaz-prinyat/${order.id}`, { state: { checkEmail: res.checkEmail } })
    } catch (err) {
      setPaying(false)
      setPayError('Не получилось сохранить заказ. Деньги не списаны. Попробуйте ещё раз или позвоните нам. ' + (err instanceof Error ? err.message : ''))
    }
  }

  if (paying) {
    return (
      <section className="section">
        <div className="container empty stack" style={{ alignItems: 'center' }}>
          <div className="spinner" />
          <h2 style={{ fontSize: 28 }}>Проводим оплату</h2>
          <p className="muted">Это займёт несколько секунд. Пожалуйста, не закрывайте страницу.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-s">
      <div className="container">
        <Crumbs items={[{ to: '/', label: 'Главная' }, { to: '/korzina', label: 'Корзина' }, { label: 'Оформление' }]} />
        <h1 style={{ fontSize: 'clamp(28px,3.6vw,40px)', marginBottom: 20 }}>Оформление заказа</h1>
        <div className="steps-bar" aria-label="Шаги оформления">
          {STEPS.map((s, i) => (
            <span key={s} className="row" style={{ gap: 8 }}>
              <span className={'st' + (step === i + 1 ? ' on' : step > i + 1 ? ' ok' : '')}>
                <span className="n">{step > i + 1 ? <Icon name="check" size={14} /> : i + 1}</span> {s}
              </span>
              {i < STEPS.length - 1 && <span className="sep" />}
            </span>
          ))}
        </div>

        <div className="layout-side">
          <div>
            {step === 1 && (
              <form className="card stack-l" onSubmit={next1} noValidate>
                <div className="stack" style={{ gap: 6 }}>
                  <h3>Как с вами связаться</h3>
                  <p className="small muted">Эти данные получат только службы из вашего заказа и наш координатор.</p>
                </div>
                <Field label="Ваше имя" error={errors.name}>
                  <input className={'input' + (errors.name ? ' error' : '')} value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} autoComplete="name" />
                </Field>
                <div className="grid grid-2" style={{ gap: 16 }}>
                  <Field label="Телефон" error={errors.phone}>
                    <input className={'input' + (errors.phone ? ' error' : '')} value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} inputMode="tel" autoComplete="tel" placeholder="+7" />
                  </Field>
                  <Field label="Почта" error={errors.email} hint="Пришлём подтверждение и доступ в личный кабинет">
                    <input className={'input' + (errors.email ? ' error' : '')} value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} type="email" autoComplete="email" />
                  </Field>
                </div>
                <div className="stack" style={{ gap: 8 }}>
                  <span className="label">Как вам удобнее общаться</span>
                  <div className="row">
                    {([['call', 'Звонок'], ['messenger', 'Мессенджер'], ['email', 'Почта']] as const).map(([v, l]) => (
                      <button type="button" key={v} className={'chip' + (det.contactWay === v ? ' active' : '')} onClick={() => setDet({ ...det, contactWay: v })}>{l}</button>
                    ))}
                  </div>
                </div>
                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Дальше <Icon name="arrow" size={18} /></button>
              </form>
            )}

            {step === 2 && (
              <form className="card stack-l" onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
                <div className="stack" style={{ gap: 6 }}>
                  <h3>Детали прощания</h3>
                  <p className="small muted">Заполните то, что уже известно. Остальное можно уточнить позже с координатором, это нормально.</p>
                </div>
                <Field label="Имя вашего близкого" hint="Нужно для документов, табличек и лент">
                  <input className="input" value={det.deceasedName ?? ''} onChange={(e) => setDet({ ...det, deceasedName: e.target.value })} placeholder="Фамилия, имя, отчество" />
                </Field>
                <div className="grid grid-2" style={{ gap: 16 }}>
                  <Field label="Желаемая дата прощания">
                    <input className="input" type="date" value={det.date ?? ''} onChange={(e) => setDet({ ...det, date: e.target.value })} />
                  </Field>
                  <Field label="Время">
                    <input className="input" type="time" value={det.time ?? ''} onChange={(e) => setDet({ ...det, time: e.target.value })} />
                  </Field>
                </div>
                <Field label="Где сейчас находится ваш близкий" hint="Морг, больница или адрес">
                  <input className="input" value={det.place ?? ''} onChange={(e) => setDet({ ...det, place: e.target.value })} />
                </Field>
                <Field label="Кладбище или крематорий, если уже выбрали">
                  <input className="input" value={det.cemetery ?? ''} onChange={(e) => setDet({ ...det, cemetery: e.target.value })} />
                </Field>
                {hasRibbon && (
                  <Field label="Текст для траурной ленты">
                    <input className="input" value={det.ribbonText ?? ''} onChange={(e) => setDet({ ...det, ribbonText: e.target.value })} placeholder="Например: Любим, помним, скорбим" />
                  </Field>
                )}
                <Field label="Что ещё нам важно знать">
                  <textarea className="textarea" value={det.comment ?? ''} onChange={(e) => setDet({ ...det, comment: e.target.value })} placeholder="Пожелания семьи, особенности, вопросы" />
                </Field>
                <label className="checkbox">
                  <input type="checkbox" checked={!!det.needHelp} onChange={(e) => setDet({ ...det, needHelp: e.target.checked })} />
                  <span>Позвоните мне, пожалуйста, чтобы помочь с деталями</span>
                </label>
                <div className="row">
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}><Icon name="back" size={18} /> Назад</button>
                  <button className="btn btn-primary">Дальше <Icon name="arrow" size={18} /></button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form className="card stack-l" onSubmit={pay}>
                <div className="stack" style={{ gap: 6 }}>
                  <h3>Оплата</h3>
                  <p className="small muted">Деньги хранятся у платёжного сервиса и переходят службе только после того, как она выполнит свою часть.</p>
                </div>
                <div className="notice notice-pink small"><Icon name="info" size={18} /> <span>Это демо-оплата. Деньги не списываются, данные карты нигде не сохраняются.</span></div>
                <div className="pay-methods">
                  <button type="button" className={'option' + (method === 'card' ? ' selected' : '')} onClick={() => setMethod('card')}><span><strong>Банковская карта</strong><span className="sub">Мир, Visa, Mastercard</span></span></button>
                  <button type="button" className={'option' + (method === 'sbp' ? ' selected' : '')} onClick={() => setMethod('sbp')}><span><strong>СБП</strong><span className="sub">Через приложение банка</span></span></button>
                </div>
                {method === 'card' ? (
                  <div className="card-form">
                    <input className="input" value={card.num} onChange={(e) => setCard({ ...card, num: e.target.value })} inputMode="numeric" aria-label="Номер карты" placeholder="Номер карты" />
                    <div className="row" style={{ flexWrap: 'nowrap' }}>
                      <input className="input" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} aria-label="Срок действия" placeholder="ММ/ГГ" />
                      <input className="input" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} aria-label="CVC" placeholder="CVC" />
                    </div>
                    {errors.card && <span className="error-text" style={{ color: '#ffb3a6' }}>{errors.card}</span>}
                  </div>
                ) : (
                  <div className="card-flat row" style={{ gap: 18 }}>
                    <svg viewBox="0 0 29 29" width="110" height="110" aria-label="QR-код для оплаты (демо)">
                      <rect width="29" height="29" fill="#fff" />
                      {Array.from({ length: 29 * 29 }).map((_, i) => ((i * 7919) % 11 < 5 ? <rect key={i} x={i % 29} y={Math.floor(i / 29)} width="1" height="1" fill="#23233f" /> : null))}
                      {[[0, 0], [22, 0], [0, 22]].map(([x, y]) => <g key={`${x}${y}`}><rect x={x} y={y} width="7" height="7" fill="#23233f" /><rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" /><rect x={x + 2} y={y + 2} width="3" height="3" fill="#23233f" /></g>)}
                    </svg>
                    <p className="small">Отсканируйте код в приложении банка. В демо-версии просто нажмите «Оплатить».</p>
                  </div>
                )}
                <label className="checkbox">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span>Я соглашаюсь с <Link to="/dokumenty/terms" target="_blank" className="link">условиями сервиса</Link> и <Link to="/dokumenty/privacy" target="_blank" className="link">обработкой персональных данных</Link></span>
                </label>
                {errors.agree && <span className="error-text">{errors.agree}</span>}
                {payError && <div className="notice notice-pink small">{payError}</div>}
                <div className="row">
                  <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}><Icon name="back" size={18} /> Назад</button>
                  <button className="btn btn-primary"><Icon name="lock" size={18} /> Оплатить {rub(cart.total)}</button>
                </div>
                <p className="tiny muted">
                  После оплаты мы создадим личный кабинет на {c.email || 'вашу почту'}{isDemo ? '' : ' и пришлём ссылку для входа'}. Там будут все заказы, статусы и контакты служб.
                </p>
              </form>
            )}
          </div>

          <aside className="sticky-side stack">
            <div className="card stack">
              <b>Ваш заказ</b>
              {groups.map(({ agency, list }) => (
                <div key={agency.id} className="stack" style={{ gap: 2 }}>
                  <span className="small muted" style={{ fontWeight: 700 }}>{agency.short}</span>
                  {list.map(({ offer, line }) => (
                    <div key={offer.id} className="summary-line" style={{ fontSize: 14.5, padding: '3px 0' }}>
                      <span>{offerTitle(offer)}{line.qty > 1 ? ` × ${line.qty}` : ''}</span>
                      <span className="nowrap">{rub(offer.price * line.qty)}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div className="summary-total"><span>Итого</span><span>{rub(cart.total)}</span></div>
              <Link to="/korzina" className="link small">Изменить состав</Link>
            </div>
            <div className="notice notice-green small"><Icon name="shield" size={18} /> <span>Отменить часть заказа можно бесплатно, пока служба её не подтвердила.</span></div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="field">
      <span className="label">{label}</span>
      {children}
      {error ? <span className="error-text">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </label>
  )
}
