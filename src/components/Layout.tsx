import { useEffect, useState, type FormEvent } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useCart } from '../lib/store'
import { Icon } from './ui'
import SupportWidget from './SupportWidget'
import { SUPPORT_PHONE } from '../data/guide'
import { telLink } from '../data/agencies'
import { INK } from './Illustrations'

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="От Души, на главную">
      <svg viewBox="0 0 34 34" width="30" height="30" aria-hidden="true">
        <path d="M17 29 C8 23 3 18 3 12 A7 7 0 0 1 17 9 A7 7 0 0 1 31 12 C31 18 26 23 17 29 Z" fill="none" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M9 13 c1.5 -3 4 -4 6 -2" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="logo-word">От Души</span>
    </Link>
  )
}

const NAV = [
  { to: '/soprovozhdenie', label: 'Сопровождение' },
  { to: '/katalog', label: 'Каталог' },
  { to: '/sluzhby', label: 'Службы' },
  { to: '/chto-delat', label: 'Что делать сейчас' },
  { to: '/partneram', label: 'Для служб' },
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
            <input className="search-input" placeholder="Найти" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Поиск по каталогу" />
          </form>
          <a href={telLink(SUPPORT_PHONE)} className="header-phone" aria-label={`Позвонить ${SUPPORT_PHONE}`}>
            <Icon name="phone" size={18} /> <span>{SUPPORT_PHONE}</span>
          </a>
          <Link to="/kabinet" className="icon-btn" aria-label={user ? 'Личный кабинет' : 'Войти'} title={user ? 'Личный кабинет' : 'Войти'}>
            <Icon name="user" />
          </Link>
          <Link to="/korzina" className="icon-btn" aria-label={`Корзина, ${count}`} title="Корзина">
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
          <div className="container">
            <form className="search search-m" onSubmit={submit} role="search">
              <Icon name="search" size={18} />
              <input className="search-input" placeholder="Найти в каталоге" value={q} onChange={(e) => setQ(e.target.value)} />
            </form>
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="mobile-link">{n.label} <Icon name="arrow" /></Link>
            ))}
            <Link to="/kabinet" className="mobile-link">{user ? 'Личный кабинет' : 'Войти'} <Icon name="arrow" /></Link>
            <a href={telLink(SUPPORT_PHONE)} className="btn btn-dark btn-block" style={{ marginTop: 20 }}>
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
        <div className="footer-top"><Logo /></div>
        <div className="footer-grid">
          <div className="footer-col">
            <h4>О сервисе</h4>
            <Link to="/chto-delat">Что делать, если близкий ушёл</Link>
            <Link to="/sluzhby">Ритуальные службы</Link>
            <Link to="/partneram">Для ритуальных служб</Link>
            <Link to="/partner">Кабинет службы</Link>
            <Link to="/kabinet">Личный кабинет</Link>
          </div>
          <div className="footer-col">
            <h4>Связаться с нами</h4>
            <a href={telLink(SUPPORT_PHONE)} style={{ fontWeight: 700, fontSize: 20 }}>{SUPPORT_PHONE}</a>
            <span className="status-dot" style={{ fontSize: 15 }}>Линия открыта круглосуточно</span>
            <span className="small muted" style={{ marginTop: 6 }}>Звонок бесплатный по всей России</span>
          </div>
          <div className="footer-col footer-big">
            <h4>Чем мы помогаем</h4>
            <Link to="/soprovozhdenie">Сопровождение <Icon name="arrow" /></Link>
            <Link to="/katalog">Каталог <Icon name="arrow" /></Link>
            <Link to="/chto-delat">Памятка <Icon name="arrow" /></Link>
          </div>
        </div>
        <div className="footer-bottom">
          <Link to="/dokumenty/privacy">Политика конфиденциальности</Link>
          <Link to="/dokumenty/terms">Условия сервиса</Link>
        </div>
        <div className="footer-bottom" style={{ borderTop: 0, marginTop: 8, paddingTop: 0 }}>
          <p>© 2026 От Души · Сервис помогает выбрать товары и услуги ритуальных служб Москвы. Услуги оказывают сами службы. Цены, ассортимент и отзывы служб пока указаны для примера. Информация на сайте не является юридической консультацией.</p>
        </div>
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
      <Header />
      <main id="main">
        <div key={loc.pathname} className="page-in">
          <Outlet />
        </div>
      </main>
      <Footer />
      <SupportWidget />
    </>
  )
}
