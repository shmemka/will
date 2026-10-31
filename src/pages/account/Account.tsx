import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import { useAuth, useToast } from '../../lib/store'
import { changePassword, deletePlan, listOrders, listPlans, orderStatus, signInWithPassword, signOut, signUpOrSignIn, updateProfile, type Order, type SavedPlan } from '../../lib/api'
import { dateRu, dateTimeRu, isEmail, load, plural, rub, save } from '../../lib/format'
import { agencyById } from '../../data/agencies'
import { CHECKLIST } from '../../data/guide'
import { offerById, offerTitle } from '../../data/catalog'
import { Icon } from '../../components/ui'
import { IlloLogin } from '../../components/Illustrations'

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
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const { refresh } = useAuth()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isEmail(email)) return setErr('Проверьте адрес почты')
    if (password.length < 6) return setErr('Пароль должен быть не короче 6 символов')
    setErr('')
    setBusy(true)
    const r = mode === 'login' ? await signInWithPassword(email, password) : await signUpOrSignIn(email, password)
    setBusy(false)
    if (r.error) return setErr(r.error)
    await refresh()
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="card stack-l" style={{ padding: 32 }}>
          <IlloLogin className="intro-photo" />
          <div className="stack" style={{ gap: 6 }}>
            <h1 style={{ fontSize: 32 }}>{mode === 'login' ? 'Вход в личный кабинет' : 'Создать личный кабинет'}</h1>
            <p className="muted">
              {mode === 'login'
                ? 'Введите почту и пароль, которые вы указали при оформлении заказа.'
                : 'Кабинет создаётся автоматически при оформлении заказа. Но его можно создать и заранее, чтобы сохранять планы и памятку.'}
            </p>
          </div>
          {err && <div className="notice notice-pink small"><Icon name="info" size={18} /> <span>{err}</span></div>}
          <form className="stack" onSubmit={submit}>
            <label className="field">
              <span className="label">Почта</span>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <label className="field">
              <span className="label">Пароль</span>
              <div style={{ position: 'relative' }}>
                <input className="input" type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} style={{ paddingRight: 110 }} />
                <button type="button" className="link small" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} onClick={() => setShow((v) => !v)}>{show ? 'Скрыть' : 'Показать'}</button>
              </div>
            </label>
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Минутку...' : mode === 'login' ? 'Войти' : 'Создать кабинет'}</button>
          </form>
          <div className="row between small">
            <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setErr('') }}>
              {mode === 'login' ? 'Ещё нет кабинета? Создать' : 'Уже есть кабинет? Войти'}
            </button>
            {mode === 'login' && <span className="muted">Забыли пароль? Позвоните нам, поможем.</span>}
          </div>
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
      <ChangePassword />
      <hr className="divider" />
      <button className="btn btn-outline" style={{ alignSelf: 'flex-start' }} onClick={async () => { await signOut(); await refresh(); nav('/') }}>Выйти из кабинета</button>
    </div>
  )
}

function ChangePassword() {
  const toast = useToast()
  const [p, setP] = useState('')
  const [err, setErr] = useState('')
  return (
    <form className="stack" onSubmit={async (e) => {
      e.preventDefault()
      if (p.length < 6) return setErr('Пароль должен быть не короче 6 символов')
      const r = await changePassword(p)
      if (r.error) return setErr(r.error)
      setErr(''); setP(''); toast('Пароль изменён')
    }}>
      <b>Сменить пароль</b>
      <input className="input" type="password" placeholder="Новый пароль" value={p} onChange={(e) => setP(e.target.value)} autoComplete="new-password" aria-label="Новый пароль" />
      {err && <span className="error-text">{err}</span>}
      <button className="btn btn-outline" style={{ alignSelf: 'flex-start' }}>Сохранить пароль</button>
    </form>
  )
}
