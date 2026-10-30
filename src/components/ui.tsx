import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type IconName = 'cart' | 'user' | 'phone' | 'search' | 'check' | 'arrow' | 'heart' | 'shield' | 'clock' | 'pin' | 'mail' | 'close' | 'menu' | 'chat' | 'back' | 'plus' | 'minus' | 'trash' | 'star' | 'doc' | 'gift' | 'lock' | 'info'

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const d: Record<IconName, ReactNode> = {
    cart: <><path {...p} d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" /><circle cx="10" cy="20" r="1.4" fill="currentColor" /><circle cx="17" cy="20" r="1.4" fill="currentColor" /></>,
    user: <><circle {...p} cx="12" cy="8" r="4" /><path {...p} d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
    phone: <path {...p} d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z" />,
    search: <><circle {...p} cx="11" cy="11" r="7" /><path {...p} d="m20 20-3.5-3.5" /></>,
    check: <path {...p} d="m5 12 5 5 9-10" />,
    arrow: <path {...p} d="M5 12h14m-6-6 6 6-6 6" />,
    back: <path {...p} d="M19 12H5m6-6-6 6 6 6" />,
    heart: <path {...p} d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />,
    shield: <><path {...p} d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" /><path {...p} d="m9 12 2 2 4-4" /></>,
    clock: <><circle {...p} cx="12" cy="12" r="9" /><path {...p} d="M12 7v5l3 2" /></>,
    pin: <><path {...p} d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z" /><circle {...p} cx="12" cy="9" r="2.5" /></>,
    mail: <><rect {...p} x="3" y="5" width="18" height="14" rx="2" /><path {...p} d="m3 7 9 6 9-6" /></>,
    close: <path {...p} d="M6 6l12 12M18 6 6 18" />,
    menu: <path {...p} d="M4 7h16M4 12h16M4 17h16" />,
    chat: <path {...p} d="M4 5h16v11H9l-5 4z" />,
    plus: <path {...p} d="M12 5v14M5 12h14" />,
    minus: <path {...p} d="M5 12h14" />,
    trash: <path {...p} d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
    star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor" />,
    doc: <><path {...p} d="M7 3h7l5 5v13H7z" /><path {...p} d="M14 3v5h5M10 13h6M10 17h6" /></>,
    gift: <><rect {...p} x="4" y="9" width="16" height="11" rx="1" /><path {...p} d="M12 9v11M4 13h16M12 9c-2-4-6-3-5 0h5zm0 0c2-4 6-3 5 0h-5z" /></>,
    lock: <><rect {...p} x="5" y="11" width="14" height="10" rx="2" /><path {...p} d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
    info: <><circle {...p} cx="12" cy="12" r="9" /><path {...p} d="M12 11v5M12 8h.01" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      {d[name]}
    </svg>
  )
}

export function Stars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span className="stars" aria-label={`Оценка ${value} из 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? '' : 'off'}>
          <Icon name="star" size={size} />
        </span>
      ))}
    </span>
  )
}

export function Crumbs({ items }: { items: { to?: string; label: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Навигация">
      {items.map((it, i) => (
        <span key={i} className="row" style={{ gap: 8 }}>
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && <span aria-hidden>/</span>}
        </span>
      ))}
    </nav>
  )
}

export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="row between" style={{ marginBottom: 12 }}>
          {title ? <h3>{title}</h3> : <span />}
          <button className="btn btn-ghost btn-s" onClick={onClose} aria-label="Закрыть">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Blob({ color = '#ffdf4e', className, style }: { color?: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 200 200" className={className} style={style} aria-hidden="true">
      <path fill={color} d="M44.6,-62.1C57.1,-52.6,66,-38.7,71.2,-23.2C76.4,-7.7,77.9,9.4,72.3,24C66.7,38.6,54,50.8,39.6,59.9C25.2,69,9.1,75,-7.8,76.6C-24.7,78.2,-42.4,75.4,-54.6,65.5C-66.8,55.6,-73.5,38.6,-76.1,21.6C-78.7,4.6,-77.2,-12.4,-70.4,-26.6C-63.6,-40.8,-51.5,-52.2,-38,-61.5C-24.5,-70.8,-9.6,-78,3.4,-82.6C16.4,-87.2,32.1,-71.6,44.6,-62.1Z" transform="translate(100 100)" />
    </svg>
  )
}

export function ScrollTop() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])
  return null
}
