// Слой данных. Если подключён Supabase, пишем и читаем оттуда, иначе работаем в демо-режиме через localStorage.
import { supabase } from './supabase'
import { load, save, uid } from './format'

export type PartStatus = 'pending' | 'confirmed' | 'in_progress' | 'done' | 'declined'
export type OrderItem = { offerId: string; title: string; price: number; qty: number }
export type OrderPart = { id: string; agencyId: string; status: PartStatus; subtotal: number; items: OrderItem[]; updatedAt: string }
export type OrderDetails = {
  deceasedName?: string
  date?: string
  time?: string
  place?: string
  cemetery?: string
  ribbonText?: string
  comment?: string
  contactWay?: 'call' | 'messenger' | 'email'
  needHelp?: boolean
}
export type Order = {
  id: string
  number: string
  createdAt: string
  customer: { name: string; phone: string; email: string }
  details: OrderDetails
  payment: { method: 'card' | 'sbp'; status: 'paid'; paidAt: string; last4?: string }
  total: number
  source: 'support' | 'catalog'
  parts: OrderPart[]
}

export const PART_STATUS: Record<PartStatus, { label: string; tone: string; text: string }> = {
  pending: { label: 'Ждёт подтверждения', tone: 'badge-yellow', text: 'Служба получила заказ и скоро подтвердит его. Обычно это занимает до 30 минут.' },
  confirmed: { label: 'Подтверждено', tone: 'badge-blue', text: 'Служба подтвердила заказ и свяжется с вами, чтобы согласовать детали.' },
  in_progress: { label: 'В работе', tone: 'badge-blue', text: 'Служба готовит всё к назначенному времени.' },
  done: { label: 'Выполнено', tone: 'badge-green', text: 'Всё сделано. Если что-то было не так, напишите нам.' },
  declined: { label: 'Служба не сможет выполнить', tone: 'badge-pink', text: 'Мы уже подбираем замену и свяжемся с вами. Деньги за эту часть вернутся, если замена не подойдёт.' },
}

export function orderStatus(o: Order) {
  const s = o.parts.map((p) => p.status)
  if (s.every((x) => x === 'done')) return { label: 'Выполнен', tone: 'badge-green' }
  if (s.some((x) => x === 'declined')) return { label: 'Нужна замена', tone: 'badge-pink' }
  if (s.every((x) => x === 'pending')) return { label: 'Оплачен, ждём подтверждения', tone: 'badge-yellow' }
  return { label: 'В работе', tone: 'badge-blue' }
}

const LS = { orders: 'od_orders', session: 'od_session', callbacks: 'od_callbacks', partners: 'od_partner_apps', reviews: 'od_reviews', plans: 'od_plans', profile: 'od_profile' }

export function newOrderNumber() {
  return 'ОД-' + String(Math.floor(100000 + Math.random() * 900000))
}

/* ---------- Авторизация ---------- */
export type SessionUser = { email: string; name?: string; phone?: string }

export async function getUser(): Promise<SessionUser | null> {
  if (supabase) {
    const { data } = await supabase.auth.getUser()
    if (!data.user?.email) return null
    const meta = (data.user.user_metadata ?? {}) as { name?: string; phone?: string }
    return { email: data.user.email, name: meta.name, phone: meta.phone }
  }
  return load<SessionUser | null>(LS.session, null)
}

export function onAuthChange(cb: () => void) {
  if (supabase) {
    const { data } = supabase.auth.onAuthStateChange(() => cb())
    return () => data.subscription.unsubscribe()
  }
  const h = (e: StorageEvent) => e.key === LS.session && cb()
  window.addEventListener('storage', h)
  return () => window.removeEventListener('storage', h)
}

/** Понятный текст ошибки входа */
export function authErrorText(msg?: string | null): string {
  const m = (msg ?? '').toLowerCase()
  if (!m) return 'Не получилось войти. Попробуйте ещё раз или позвоните нам.'
  if (m.includes('invalid login') || m.includes('invalid credentials')) return 'Неверная почта или пароль.'
  if (m.includes('already registered') || m.includes('already been registered') || m.includes('user_already_exists')) return 'На эту почту уже есть кабинет. Введите пароль от него.'
  if (m.includes('password should be') || m.includes('weak password') || m.includes('at least')) return 'Пароль слишком простой: нужно не меньше 6 символов.'
  if (m.includes('email not confirmed')) return 'Почта ещё не подтверждена. Позвоните нам, и мы поможем войти.'
  if (m.includes('email rate limit') || m.includes('sending') && m.includes('email')) return 'Сейчас не получается создать кабинет: сервис пытается отправить письмо для подтверждения почты. Позвоните нам, и мы поможем.'
  if (m.includes('rate limit') || m.includes('security purposes')) return 'Слишком много попыток. Подождите минуту и попробуйте снова.'
  if (m.includes('invalid') && m.includes('email')) return 'Проверьте адрес почты.'
  return 'Не получилось войти: ' + msg
}

/* В демо-режиме пароли хранятся в браузере в виде хеша, только чтобы показать сценарий */
async function hash(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('od:' + text))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Вход по почте и паролю */
export async function signInWithPassword(email: string, password: string): Promise<{ error?: string }> {
  email = email.trim().toLowerCase()
  if (supabase) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? authErrorText(error.message) : undefined }
  }
  const users = load<Record<string, string>>('od_demo_users', {})
  if (!users[email] || users[email] !== (await hash(password))) return { error: 'Неверная почта или пароль.' }
  save(LS.session, { ...(load<SessionUser | null>(LS.session, null) ?? {}), email })
  return {}
}

/**
 * Создать кабинет с паролем. Если на эту почту кабинет уже есть, пробуем войти с этим паролем.
 * В Supabase должно быть выключено подтверждение почты (Authentication -> Providers -> Email -> Confirm email).
 */
export async function signUpOrSignIn(email: string, password: string, profile?: { name?: string; phone?: string }): Promise<{ error?: string; existed?: boolean }> {
  email = email.trim().toLowerCase()
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: profile } })
    const already = (error && /already|exists/i.test(error.message)) || (!error && data.user && (data.user.identities ?? []).length === 0)
    if (already) {
      const r = await signInWithPassword(email, password)
      return r.error ? { error: 'На эту почту уже есть кабинет, а пароль не подходит. Введите пароль от кабинета.', existed: true } : { existed: true }
    }
    if (error) return { error: authErrorText(error.message) }
    if (!data.session) {
      // подтверждение почты включено: пробуем войти, вдруг уже подтверждено
      const r = await signInWithPassword(email, password)
      if (r.error) return { error: 'Кабинет создан, но войти пока не получилось. Позвоните нам, и мы поможем.' }
    }
    return {}
  }
  const users = load<Record<string, string>>('od_demo_users', {})
  const h = await hash(password)
  if (users[email] && users[email] !== h) return { error: 'На эту почту уже есть кабинет, а пароль не подходит. Введите пароль от кабинета.', existed: true }
  save('od_demo_users', { ...users, [email]: h })
  save(LS.session, { email, ...profile })
  return { existed: !!users[email] }
}

export async function changePassword(password: string): Promise<{ error?: string }> {
  if (supabase) {
    const { error } = await supabase.auth.updateUser({ password })
    return { error: error ? authErrorText(error.message) : undefined }
  }
  const s = load<SessionUser | null>(LS.session, null)
  if (s) save('od_demo_users', { ...load<Record<string, string>>('od_demo_users', {}), [s.email]: await hash(password) })
  return {}
}

export async function updateProfile(p: { name?: string; phone?: string }) {
  if (supabase) {
    await supabase.auth.updateUser({ data: p })
    return
  }
  const cur = load<SessionUser | null>(LS.session, null)
  if (cur) save(LS.session, { ...cur, ...p })
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut()
  else localStorage.removeItem(LS.session)
}

/* ---------- Заказы ---------- */
export async function createOrder(o: Order) {
  // локальная копия нужна всегда: страница успеха и демо-кабинет службы
  const all = load<Order[]>(LS.orders, [])
  save(LS.orders, [o, ...all])
  if (!supabase) return
  const { error } = await supabase.from('orders').insert({
    id: o.id,
    number: o.number,
    created_at: o.createdAt,
    customer_email: o.customer.email.toLowerCase(),
    customer_name: o.customer.name,
    customer_phone: o.customer.phone,
    details: o.details,
    payment: o.payment,
    total: o.total,
    source: o.source,
  })
  if (error) throw new Error(error.message)
  const { error: e2 } = await supabase.from('order_parts').insert(
    o.parts.map((p) => ({ id: p.id, order_id: o.id, agency_id: p.agencyId, status: p.status, subtotal: p.subtotal, items: p.items, updated_at: p.updatedAt })),
  )
  if (e2) throw new Error(e2.message)
}

type OrderRow = {
  id: string; number: string; created_at: string; customer_email: string; customer_name: string; customer_phone: string
  details: OrderDetails; payment: Order['payment']; total: number; source: Order['source']
  order_parts: { id: string; agency_id: string; status: PartStatus; subtotal: number; items: OrderItem[]; updated_at: string }[]
}
const fromRow = (r: OrderRow): Order => ({
  id: r.id, number: r.number, createdAt: r.created_at,
  customer: { name: r.customer_name, phone: r.customer_phone, email: r.customer_email },
  details: r.details ?? {}, payment: r.payment, total: r.total, source: r.source,
  parts: (r.order_parts ?? []).map((p) => ({ id: p.id, agencyId: p.agency_id, status: p.status, subtotal: p.subtotal, items: p.items, updatedAt: p.updated_at })),
})

export async function listOrders(email: string): Promise<Order[]> {
  if (supabase) {
    const { data, error } = await supabase.from('orders').select('*, order_parts(*)').order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data as OrderRow[]).map(fromRow)
  }
  return load<Order[]>(LS.orders, []).filter((o) => o.customer.email.toLowerCase() === email.toLowerCase())
}

export async function getOrder(id: string): Promise<Order | null> {
  if (supabase) {
    const { data } = await supabase.from('orders').select('*, order_parts(*)').eq('id', id).maybeSingle()
    if (data) return fromRow(data as OrderRow)
  }
  return load<Order[]>(LS.orders, []).find((o) => o.id === id) ?? null
}

/** Демо-кабинет службы: заказы, где есть часть этой службы (из этого браузера). */
export function localOrdersForAgency(agencyId: string): Order[] {
  return load<Order[]>(LS.orders, []).filter((o) => o.parts.some((p) => p.agencyId === agencyId))
}

export async function updatePartStatus(orderId: string, partId: string, status: PartStatus) {
  const all = load<Order[]>(LS.orders, [])
  const now = new Date().toISOString()
  save(LS.orders, all.map((o) => (o.id !== orderId ? o : { ...o, parts: o.parts.map((p) => (p.id === partId ? { ...p, status, updatedAt: now } : p)) })))
  if (supabase) await supabase.from('order_parts').update({ status, updated_at: now }).eq('id', partId)
}

/* ---------- Заявки и отзывы ---------- */
export type CallbackRequest = { name: string; phone: string; when: string; topic?: string }
export async function saveCallback(r: CallbackRequest) {
  const item = { ...r, id: uid(), createdAt: new Date().toISOString() }
  save(LS.callbacks, [item, ...load<unknown[]>(LS.callbacks, [])])
  if (supabase) await supabase.from('callback_requests').insert({ id: item.id, name: r.name, phone: r.phone, preferred_time: r.when, topic: r.topic ?? null })
}

export type PartnerApplication = { company: string; inn: string; contact: string; phone: string; email: string; services: string[]; comment?: string }
export async function savePartnerApplication(a: PartnerApplication) {
  const item = { ...a, id: uid(), createdAt: new Date().toISOString() }
  save(LS.partners, [item, ...load<unknown[]>(LS.partners, [])])
  if (supabase) await supabase.from('partner_applications').insert({ id: item.id, company: a.company, inn: a.inn, contact: a.contact, phone: a.phone, email: a.email, services: a.services, comment: a.comment ?? null })
}

export type UserReview = { id: string; target: string; author: string; rating: number; text: string; date: string; orderId?: string }
export function localReviews(target: string): UserReview[] {
  return load<UserReview[]>(LS.reviews, []).filter((r) => r.target === target)
}
export async function saveReview(r: Omit<UserReview, 'id' | 'date'>) {
  const item: UserReview = { ...r, id: uid(), date: new Date().toISOString().slice(0, 10) }
  save(LS.reviews, [item, ...load<UserReview[]>(LS.reviews, [])])
  if (supabase) await supabase.from('reviews').insert({ id: item.id, target: r.target, author: r.author, rating: r.rating, text: r.text, order_id: r.orderId ?? null })
  return item
}
export function myReviewTargets(): string[] {
  return load<UserReview[]>(LS.reviews, []).map((r) => r.target)
}

/* ---------- Сохранённые планы сопровождения ---------- */
export type SavedPlan = { id: string; title: string; createdAt: string; answers: unknown; pkg: string; picks: Record<string, string>; skipped: string[]; done: string[] }
export function listPlans(): SavedPlan[] {
  return load<SavedPlan[]>(LS.plans, [])
}
export function savePlan(p: SavedPlan) {
  const all = listPlans().filter((x) => x.id !== p.id)
  save(LS.plans, [p, ...all])
}
export function deletePlan(id: string) {
  save(LS.plans, listPlans().filter((x) => x.id !== id))
}
