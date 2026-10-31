import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { useAuth, useToast } from '../../lib/store'
import { authErrorText, deletePlan, listOrders, listPlans, orderStatus, signInWithEmail, signOut, updateProfile, verifyEmailCode, type Order, type SavedPlan } from '../../lib/api'
import { authUrlError, isDemo } from '../../lib/supabase'
import { dateRu, dateTimeRu, isEmail, load, plural, rub, save } from '../../lib/format'
import { agencyById } from '../../data/agencies'
import { CHECKLIST } from '../../data/guide'
import { offerById, offerTitle } from '../../data/catalog'
import { Icon } from '../../components/ui'
import { ScenePhoto } from '../../components/ProductArt'
import { SCENE } from '../../data/photos'

export default function Account() {
  const { user, ready } = useAuth()
  const { tab = 'zakazy' } = useParams()
  if (!ready) return <section className="section"><div className="spinner" /></section>
  if (!user) return <Login />
  return (
    <section className="section-s">
      <div className="container">
        <div className="row between" style={{ marginBottom: 24 }}>
          <div className="stack" style={{ gap: 4 }}>
            <h1 style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>{user.name ? `Здравствуйте, ${user.name}` : 'Личный кабинет'}</h1>
            <span className="muted small">{user.email}</span>
          </div>
        </div>
        <div className="acc-layout">
          <nav className="acc-nav" aria-label="Разделы кабинета">
            <NavLink to="/kabinet/zakazy" className={() => (tab === 'zakazy' ? 'active' : '')}>Мои заказы</NavLink>
            <NavLink to="/kabinet/plany" className={() => (tab === 'plany' ? 'active' : '')}>Сохранённые планы</NavLink>
            <NavLink to="/kabinet/pamyatka" className={() => (tab === 'pamyatka' ? 'active' : '')}>Памятка</NavLink>
            <NavLink to="/kabinet/profil" className={() => (tab === 'profil' ? 'active' : '')}>Профиль</NavLink>
          </nav>
          <div>
            {tab === 'zakazy' && <Orders email={user.email} />}
            {tab === 'plany' && <Plans />}
            {tab === 'pamyatka' && <Checklist />}
            {tab === 'profil' && <Profile />}
          </div>
        </div>
      </div>
    </section>
  )
}

function Login() {
  const pending = (() => { try { return sessionStorage.getItem('od_login_email') ?? '' } catch { return '' } })()
  const [email, setEmail] = useState(pending)
  const [step, setStep] = useState<'email' | 'code'>(pending && !isDemo ? 'code' : 'email')
  const [code, setCode] = useState('')
  const [err, setErr] = useState(authUrlError ? authErrorText(authUrlError.code || authUrlError.description) : '')
  const [busy, setBusy] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const { refresh } = useAuth()
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const send = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!isEmail(email)) return setErr('Проверьте адрес почты')
    setErr('')
    setBusy(true)
    const r = await signInWithEmail(email.trim().toLowerCase())
    setBusy(false)
    if (r.error) return setErr(r.error)
    if (r.checkEmail) { setStep('code'); setCooldown(60) }
    else await refresh()
  }
  const verify = async (e: FormEvent) => {
    e.preventDefault()
    const t = code.replace(/\D/g, '')
    if (t.length < 6) return setErr('Введите код из письма полностью')
    setErr('')
    setBusy(true)
    const r = await verifyEmailCode(email.trim().toLowerCase(), t)
    setBusy(false)
    if (r.error) return setErr(r.error)
    try { sessionStorage.removeItem('od_login_email') } catch { /* ничего */ }
    await refresh()
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="card stack-l" style={{ padding: 32 }}>
          <ScenePhoto id={SCENE.lilies} className="intro-photo" ratio="16 / 9" />
          <div className="stack" style={{ gap: 6 }}>
            <h1 style={{ fontSize: 32 }}>Вход в личный кабинет</h1>
            <p className="muted">
              {step === 'email'
                ? `Укажите почту, на которую оформляли заказ. ${isDemo ? 'В демо-режиме вход происходит сразу.' : 'Мы пришлём письмо со ссылкой и кодом для входа, пароль не нужен.'}`
                : 'Мы отправили письмо. Нажмите на ссылку в нём или введите код из письма здесь.'}
            </p>
          </div>
          {err && <div className="notice notice-pink small"><Icon name="info" size={18} /> <span>{err}</span></div>}
          {step === 'email' ? (
            <form className="stack" onSubmit={send}>
              <input className={'input' + (err ? ' error' : '')} type="email" placeholder="Ваша почта" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-label="Почта" />
              <button className="btn btn-primary" disabled={busy}>{busy ? 'Отправляем...' : isDemo ? 'Войти' : 'Получить письмо для входа'}</button>
            </form>
          ) : (
            <form className="stack" onSubmit={verify}>
              <div className="notice notice-green small"><Icon name="mail" size={18} /> <span>Письмо отправлено на <b>{email}</b>. Если его нет, проверьте папку «Спам» и «Промоакции».</span></div>
              <label className="field">
                <span className="label">Код из письма</span>
                <input className="input" inputMode="numeric" autoComplete="one-time-code" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))} style={{ fontSize: 24, letterSpacing: '0.2em' }} />
              </label>
              <button className="btn btn-primary" disabled={busy}>{busy ? 'Проверяем...' : 'Войти'}</button>
              <div className="row between small">
                <button type="button" className="link" disabled={cooldown > 0 || busy} onClick={() => send()}>
                  {cooldown > 0 ? `Отправить ещё раз через ${cooldown} с` : 'Отправить письмо ещё раз'}
                </button>
                <button type="button" className="link" onClick={() => { setStep('email'); setCode(''); setErr('') }}>Другая почта</button>
              </div>
            </form>
          )}
          <p className="small muted">Личный кабинет создаётся автоматически после первого заказа. Если заказа ещё не было, после входа вы сможете сохранять планы и памятку.</p>
        </div>
      </div>
    </section>
  )
}

function Orders({ email }: { email: string }) {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    listOrders(email).then(setOrders).catch((e) => { setErr(String(e.message ?? e)); setOrders([]) })
  }, [email])
  if (!orders) return <div className="spinner" />
  if (!orders.length) {
    return (
      <div className="card empty stack" style={{ alignItems: 'center' }}>
        <h3>Заказов пока нет</h3>
        <p className="muted">{err || 'Когда вы оформите заказ, он появится здесь со всеми статусами.'}</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to="/soprovozhdenie" className="btn btn-primary">Полное сопровождение</Link>
          <Link to="/katalog" className="btn btn-outline">Каталог</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="stack">
      {orders.map((o) => {
        const st = orderStatus(o)
        return (
          <Link key={o.id} to={`/kabinet/zakaz/${o.id}`} className="card card-link stack">
            <div className="row between">
              <b style={{ fontSize: 18 }}>Заказ {o.number}</b>
              <span className={'badge ' + st.tone}>{st.label}</span>
            </div>
            <span className="small muted">{dateTimeRu(o.createdAt)} · {o.parts.length} {plural(o.parts.length, 'служба', 'службы', 'служб')}{o.details.deceasedName ? ` · ${o.details.deceasedName}` : ''}</span>
            <div className="row">
              {o.parts.map((p) => <span key={p.id} className="badge badge-gray">{agencyById(p.agencyId)?.short}</span>)}
            </div>
            <div className="row between">
              <span className="price">{rub(o.total)}</span>
              <span className="row small" style={{ gap: 4 }}>Подробнее <Icon name="arrow" size={16} /></span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function Plans() {
  const [plans, setPlans] = useState<SavedPlan[]>(() => listPlans())
  if (!plans.length) {
    return (
      <div className="card empty stack" style={{ alignItems: 'center' }}>
        <h3>Сохранённых планов нет</h3>
        <p className="muted">В полном сопровождении можно сохранить план и вернуться к нему, когда будете готовы.</p>
        <Link to="/soprovozhdenie" className="btn btn-primary">Начать подбор</Link>
      </div>
    )
  }
  return (
    <div className="stack">
      {plans.map((p) => {
        const items = Object.values(p.picks).map((id) => offerById(id)).filter(Boolean)
        const total = items.reduce((s, o) => s + (o?.price ?? 0), 0)
        return (
          <div key={p.id} className="card stack">
            <div className="row between">
              <b style={{ fontSize: 18 }}>{p.title}</b>
              <span className="small muted">{dateRu(p.createdAt)}</span>
            </div>
            <span className="small muted">{items.slice(0, 4).map((o) => offerTitle(o!)).join(', ')}{items.length > 4 ? ` и ещё ${items.length - 4}` : ''}</span>
            <div className="row between">
              <span className="price">около {rub(total)}</span>
              <div className="row">
                <button className="btn btn-ghost btn-s" onClick={() => { deletePlan(p.id); setPlans(listPlans()) }}><Icon name="trash" size={16} /> Удалить</button>
                <Link to="/soprovozhdenie" className="btn btn-outline btn-s" onClick={() => save('od_support_draft', { id: p.id, stage: 'summary', answers: p.answers, qi: 0, pkg: p.pkg === 'custom' ? undefined : p.pkg, picks: p.picks, qty: {}, done: p.done, skipped: p.skipped, cp: 0 })}>Открыть</Link>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Checklist() {
  const [done, setDone] = useState<string[]>(() => load('od_checklist', []))
  useEffect(() => {
    save('od_checklist', done)
  }, [done])
  const n = done.length
  return (
    <div className="card stack-l">
      <div className="stack" style={{ gap: 6 }}>
        <h3>Памятка на ближайшие дни</h3>
        <p className="small muted">Отмечайте то, что уже сделано. Не нужно успеть всё сразу.</p>
      </div>
      <div className="progress"><div style={{ width: `${(n / CHECKLIST.length) * 100}%` }} /></div>
      <div className="stack">
        {CHECKLIST.map((c) => (
          <label key={c.id} className="checkbox" style={{ padding: '8px 0', borderBottom: '1px dashed var(--line)' }}>
            <input type="checkbox" checked={done.includes(c.id)} onChange={(e) => setDone((d) => (e.target.checked ? [...d, c.id] : d.filter((x) => x !== c.id)))} />
            <span style={{ textDecoration: done.includes(c.id) ? 'line-through' : 'none', color: done.includes(c.id) ? 'var(--ink-3)' : undefined }}>{c.text}</span>
          </label>
        ))}
      </div>
      <Link to="/chto-delat" className="link small">Подробнее о каждом шаге</Link>
    </div>
  )
}

function Profile() {
  const { user, refresh } = useAuth()
  const toast = useToast()
  const nav = useNavigate()
  const [p, setP] = useState({ name: user?.name ?? '', phone: user?.phone ?? '' })
  return (
    <div className="card stack-l">
      <h3>Профиль</h3>
      <form className="stack" onSubmit={async (e) => { e.preventDefault(); await updateProfile(p); await refresh(); toast('Сохранили') }}>
        <label className="field"><span className="label">Имя</span><input className="input" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></label>
        <label className="field"><span className="label">Телефон</span><input className="input" value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} inputMode="tel" /></label>
        <label className="field"><span className="label">Почта</span><input className="input" value={user?.email ?? ''} disabled /></label>
        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Сохранить</button>
      </form>
      <hr className="divider" />
      <button className="btn btn-outline" style={{ alignSelf: 'flex-start' }} onClick={async () => { await signOut(); await refresh(); nav('/') }}>Выйти из кабинета</button>
    </div>
  )
}
