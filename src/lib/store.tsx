import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { offerById, type Offer } from '../data/catalog'
import { load, save } from './format'
import { getUser, onAuthChange, type SessionUser } from './api'

/* ---------- Корзина ---------- */
export type CartLine = { offerId: string; qty: number; note?: string }
type CartCtx = {
  lines: CartLine[]
  source: 'support' | 'catalog'
  add: (offerId: string, qty?: number) => void
  setQty: (offerId: string, qty: number) => void
  remove: (offerId: string) => void
  clear: () => void
  replaceAll: (lines: CartLine[], source: 'support' | 'catalog') => void
  count: number
  total: number
  items: { line: CartLine; offer: Offer }[]
  has: (offerId: string) => boolean
}
const Cart = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => load('od_cart', []))
  const [source, setSource] = useState<'support' | 'catalog'>(() => load('od_cart_source', 'catalog'))
  useEffect(() => {
    save('od_cart', lines)
  }, [lines])
  useEffect(() => {
    save('od_cart_source', source)
  }, [source])

  const value = useMemo<CartCtx>(() => {
    const items = lines
      .map((line) => ({ line, offer: offerById(line.offerId)! }))
      .filter((x) => x.offer)
    return {
      lines,
      source,
      items,
      count: items.reduce((s, x) => s + x.line.qty, 0),
      total: items.reduce((s, x) => s + x.line.qty * x.offer.price, 0),
      has: (id) => lines.some((l) => l.offerId === id),
      add: (offerId, qty = 1) =>
        setLines((ls) => (ls.some((l) => l.offerId === offerId) ? ls.map((l) => (l.offerId === offerId ? { ...l, qty: l.qty + qty } : l)) : [...ls, { offerId, qty }])),
      setQty: (offerId, qty) => setLines((ls) => ls.map((l) => (l.offerId === offerId ? { ...l, qty: Math.max(1, qty) } : l))),
      remove: (offerId) => setLines((ls) => ls.filter((l) => l.offerId !== offerId)),
      clear: () => setLines([]),
      replaceAll: (next, src) => {
        setLines(next)
        setSource(src)
      },
    }
  }, [lines, source])
  return <Cart.Provider value={value}>{children}</Cart.Provider>
}
export const useCart = () => useContext(Cart)!

/* ---------- Пользователь ---------- */
type AuthCtx = { user: SessionUser | null; ready: boolean; refresh: () => Promise<void> }
const Auth = createContext<AuthCtx>({ user: null, ready: false, refresh: async () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [ready, setReady] = useState(false)
  const refresh = useCallback(async () => {
    setUser(await getUser())
    setReady(true)
  }, [])
  useEffect(() => {
    refresh()
    return onAuthChange(refresh)
  }, [refresh])
  return <Auth.Provider value={{ user, ready, refresh }}>{children}</Auth.Provider>
}
export const useAuth = () => useContext(Auth)

/* ---------- Уведомления ---------- */
const Toast = createContext<(msg: string) => void>(() => {})
export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<{ id: number; msg: string }[]>([])
  const push = useCallback((msg: string) => {
    const id = Date.now() + Math.random()
    setList((l) => [...l, { id, msg }])
    setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 3200)
  }, [])
  return (
    <Toast.Provider value={push}>
      {children}
      <div className="toast-wrap" role="status" aria-live="polite">
        {list.map((t) => (
          <div key={t.id} className="toast">{t.msg}</div>
        ))}
      </div>
    </Toast.Provider>
  )
}
export const useToast = () => useContext(Toast)
