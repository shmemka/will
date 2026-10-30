import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useCart } from '../lib/store'
import { isDemo } from '../lib/supabase'
import { Icon } from './ui'
import SupportWidget from './SupportWidget'
import { SUPPORT_PHONE } from '../data/guide'
import { telLink } from '../data/agencies'
import { CATEGORIES } from '../data/catalog'

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="От Души, на главную">
      <svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
        <rect width="40" height="40" rx="12" fill="#ffdf4e" />
        <path d="M20 30c-6-4-10-7.5-10-12.2A5 5 0 0 1 20 16a5 5 0 0 1 10 1.8C30 22.5 26 26 20 30z" fill="#23233f" />
      </svg>
      <span>От Души</span>
    </Link>
  )
}

const NAV = [
  { to: '/soprovozhdenie', label: 'Полное сопровождение' },
  { to: '/katalog', label: 'Каталог' },
  { to: '/sluzhby', label: 'Службы' },
  { to: '/chto-delat', label: 'Что делать сейчас' },
]

function Header() {
  const { count } = useCart()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const nav = useNavigate()
  const loc = useLocation()
  useEffect(() => {
    setOpen(false)
  }, [loc.pathname])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (q.trim()) nav(`/katalog?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <header className="header">
      <div className="container header-in">
        <Logo />
        <nav className="nav-main" aria-label="Основное меню">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <form className="search" onSubmit={submit} role="search">
            <Icon name="search" size={18} />
            <input className="search-input" placeholder="Поиск" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Поиск по каталогу" />
          </form>
          <a href={telLink(SUPPORT_PHONE)} className="header-phone">
            <span className="tiny muted">Круглосуточно</span>
            <b>{SUPPORT_PHONE}</b>
          </a>
          <Link to="/kabinet" className="icon-btn" aria-label={user ? 'Личный кабинет' : 'Войти'}>
            <Icon name="user" />
          </Link>
          <Link to="/korzina" className="icon-btn" aria-label={`Корзина, ${count}`}>
            <Icon name="cart" />
            {count > 0 && <span className="dot">{count}</span>}
          </Link>
          <button className="icon-btn burger" onClick={() => setOpen((v) => !v)} aria-label="Меню" aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu">
          <div className="container stack">
            <form className="search search-m" onSubmit={submit} role="search">
              <Icon name="search" size={18} />
              <input className="search-input" placeholder="Поиск по каталогу" value={q} onChange={(e) => setQ(e.target.value)} />
            </form>
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="mobile-link">{n.label}</Link>
            ))}
            <Link to="/partneram" className="mobile-link">Для ритуальных служб</Link>
            <Link to="/kabinet" className="mobile-link">{user ? 'Личный кабинет' : 'Войти'}</Link>
            <a href={telLink(SUPPORT_PHONE)} className="btn btn-primary">
              <Icon name="phone" size={18} /> {SUPPORT_PHONE}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="stack">
            <Logo />
            <p className="muted small" style={{ maxWidth: 320 }}>
              Помогаем семьям проститься с близкими бережно, спокойно и по честной цене. Работаем с проверенными службами Москвы.
            </p>
            <a href={telLink(SUPPORT_PHONE)} className="footer-phone">{SUPPORT_PHONE}</a>
            <span className="small muted">Мы на связи круглосуточно</span>
          </div>
          <div className="stack">
            <h4>Помощь</h4>
            <Link to="/soprovozhdenie">Полное сопровождение</Link>
            <Link to="/katalog">Каталог</Link>
            <Link to="/chto-delat">Что делать сейчас</Link>
            <Link to="/sluzhby">Ритуальные службы</Link>
          </div>
          <div className="stack">
            <h4>Категории</h4>
            {CATEGORIES.slice(0, 6).map((c) => (
              <Link key={c.id} to={`/katalog?cat=${c.id}`}>{c.name}</Link>
            ))}
          </div>
          <div className="stack">
            <h4>Сервис</h4>
            <Link to="/kabinet">Личный кабинет</Link>
            <Link to="/partneram">Для ритуальных служб</Link>
            <Link to="/partner">Кабинет службы</Link>
            <Link to="/dokumenty/privacy">Политика конфиденциальности</Link>
            <Link to="/dokumenty/terms">Условия сервиса</Link>
          </div>
        </div>
        <hr className="divider" />
        <p className="tiny muted">
          © 2026 От Души. Сервис помогает выбрать товары и услуги ритуальных служб Москвы. Услуги оказывают сами службы. Информация на сайте не является юридической консультацией.
        </p>
      </div>
    </footer>
  )
}

export default function Layout() {
  const loc = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [loc.pathname])
  return (
    <>
      <a href="#main" className="sr-only">Перейти к содержимому</a>
      {isDemo ? (
        <div className="demo-bar">
          <b>Демо-версия.</b> Товары, цены и отзывы примерные, оплата не списывает деньги.
        </div>
      ) : (
        <div className="demo-bar">
          <b>Тестовый запуск.</b> Товары, цены и отзывы примерные, оплата не списывает деньги.
        </div>
      )}
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <SupportWidget />
    </>
  )
}
