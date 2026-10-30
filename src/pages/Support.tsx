import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  buildCheckpoints, buildPackages, defaultOffer, guestsCount, packageEstimate, resolveTradition, visibleQuestions,
  TRADITION_NOTES, type Answers, type PackageId,
} from '../data/flow'
import { AVAILABILITY, agencyOfOffer, offerById, offersByType, typeById } from '../data/catalog'
import ProductArt from '../components/ProductArt'
import { OrganizeArt } from '../components/Illustrations'
import { Icon, Stars } from '../components/ui'
import { load, plural, rub, save, uid } from '../lib/format'
import { useCart, useToast } from '../lib/store'
import { savePlan } from '../lib/api'

type Stage = 'intro' | 'questions' | 'packages' | 'checkpoints' | 'summary'
type Draft = {
  id: string
  stage: Stage
  answers: Answers
  qi: number
  pkg?: PackageId
  picks: Record<string, string> // typeId -> offerId
  qty: Record<string, number>
  done: string[]
  skipped: string[]
  cp: number
}
const KEY = 'od_support_draft'
const fresh = (): Draft => ({ id: uid(), stage: 'intro', answers: {}, qi: 0, picks: {}, qty: {}, done: [], skipped: [], cp: 0 })

export default function Support() {
  const [d, setD] = useState<Draft>(() => {
    const saved = load<Draft | null>(KEY, null)
    return saved ? { ...saved, stage: saved.stage === 'intro' ? 'intro' : saved.stage } : fresh()
  })
  const [hasDraft] = useState(() => !!load<Draft | null>(KEY, null) && load<Draft>(KEY, fresh()).stage !== 'intro')
  const [resumeShown, setResumeShown] = useState(hasDraft)
  useEffect(() => {
    save(KEY, d)
  }, [d])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [d.stage, d.cp, d.qi])

  const up = (patch: Partial<Draft>) => setD((x) => ({ ...x, ...patch }))

  if (d.stage === 'intro' || resumeShown) {
    return (
      <Intro
        resume={resumeShown}
        onStart={() => { setResumeShown(false); setD({ ...fresh(), stage: 'questions' }) }}
        onResume={() => setResumeShown(false)}
      />
    )
  }
  if (d.stage === 'questions') return <Questions d={d} up={up} />
  if (d.stage === 'packages') return <Packages d={d} up={up} />
  if (d.stage === 'checkpoints') return <Checkpoints d={d} up={up} />
  return <Summary d={d} up={up} reset={() => setD(fresh())} />
}

/* ---------- Вступление ---------- */
function Intro({ resume, onStart, onResume }: { resume: boolean; onStart: () => void; onResume: () => void }) {
  return (
    <section className="section">
      <div className="container flow-wrap stack-l" style={{ alignItems: 'center', textAlign: 'center' }}>
        <OrganizeArt className="intro-art" />
        <h1 style={{ fontSize: 'clamp(30px,4vw,46px)' }}>Мы рядом. Давайте разберёмся вместе</h1>
        <p className="lead" style={{ maxWidth: 620 }}>
          Сначала зададим несколько простых вопросов, чтобы понять вашу ситуацию. Потом предложим три варианта и поможем пройти по шагам: что выбрать, а что можно пропустить.
        </p>
        <div className="row" style={{ justifyContent: 'center', gap: 20 }}>
          <span className="row small" style={{ gap: 6 }}><Icon name="clock" size={18} /> Около 3 минут</span>
          <span className="row small" style={{ gap: 6 }}><Icon name="heart" size={18} /> Всё можно изменить</span>
          <span className="row small" style={{ gap: 6 }}><Icon name="lock" size={18} /> Мы сохраним прогресс</span>
        </div>
        {resume ? (
          <div className="row" style={{ justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={onResume}>Продолжить с того же места</button>
            <button className="btn btn-outline" onClick={onStart}>Начать заново</button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onStart}>Начать <Icon name="arrow" size={18} /></button>
        )}
        <p className="small muted" style={{ maxWidth: 520 }}>
          Если сейчас трудно что-то читать и выбирать, просто позвоните нам. Мы зададим те же вопросы по телефону и всё соберём за вас.
        </p>
      </div>
    </section>
  )
}

/* ---------- Вопросы ---------- */
function Questions({ d, up }: { d: Draft; up: (p: Partial<Draft>) => void }) {
  const qs = visibleQuestions(d.answers)
  const qi = Math.min(d.qi, qs.length - 1)
  const q = qs[qi]
  const value = d.answers[q.key]

  const choose = (v: string) => {
    const answers = { ...d.answers, [q.key]: v } as Answers
    const nextQs = visibleQuestions(answers)
    const idx = nextQs.findIndex((x) => x.key === q.key)
    setTimeout(() => {
      if (idx + 1 >= nextQs.length) up({ answers, stage: 'packages', qi: idx })
      else up({ answers, qi: idx + 1 })
    }, 220)
    up({ answers })
  }

  return (
    <section className="section-s">
      <div className="container flow-wrap">
        <div className="flow-top">
          <button className="btn btn-ghost btn-s" onClick={() => (qi === 0 ? up({ stage: 'intro' }) : up({ qi: qi - 1 }))}>
            <Icon name="back" size={18} /> Назад
          </button>
          <div className="progress" aria-label="Прогресс вопросов"><div style={{ width: `${((qi + 1) / qs.length) * 100}%` }} /></div>
          <span className="small muted nowrap">{qi + 1} из {qs.length}</span>
        </div>
        <div className="stack-l">
          <div className="stack" style={{ gap: 10 }}>
            <h1 style={{ fontSize: 'clamp(26px,3.4vw,38px)' }}>{q.title}</h1>
            {q.hint && <p className="muted">{q.hint}</p>}
          </div>
          <div className="options" role="radiogroup" aria-label={q.title}>
            {q.options.map((o) => (
              <button key={o.value} role="radio" aria-checked={value === o.value} className={'option' + (value === o.value ? ' selected' : '')} onClick={() => choose(o.value)}>
                <span className="radio" aria-hidden />
                <span>
                  <strong>{o.label}</strong>
                  {o.sub && <span className="sub">{o.sub}</span>}
                </span>
              </button>
            ))}
          </div>
          {q.key === 'place' && value === 'home' && (
            <div className="notice notice-blue">
              <Icon name="info" />
              <span>Если врач ещё не приезжал, позвоните 103 или 112. Это первое, что нужно сделать. <Link to="/chto-delat" className="link">Что делать дальше</Link></span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/* ---------- Пакеты ---------- */
function Packages({ d, up }: { d: Draft; up: (p: Partial<Draft>) => void }) {
  const pkgs = useMemo(() => buildPackages(d.answers), [d.answers])
  const rec: PackageId = d.answers.budget === 'low' ? 'min' : d.answers.budget === 'high' ? 'ext' : 'std'
  const tr = resolveTradition(d.answers)
  const cps = buildCheckpoints(d.answers)

  const pick = (id: PackageId | 'custom') => {
    const picks: Record<string, string> = {}
    const qty: Record<string, number> = {}
    if (id !== 'custom') {
      const p = pkgs.find((x) => x.id === id)!
      // Стараемся собрать пакет у меньшего числа служб: если у уже выбранной службы
      // есть тот же товар не дороже чем на 15%, берём его. Так семье проще, а координатору легче.
      const used = new Set<string>()
      for (const t of p.includes) {
        const base = defaultOffer(t, id)
        if (!base) continue
        const near = offersByType(t).filter((o) => used.has(o.agencyId) && o.price <= base.price * 1.15).sort((a, b) => a.price - b.price)[0]
        const o = near ?? base
        picks[t] = o.id
        used.add(o.agencyId)
        if (typeById(t)?.perGuest) qty[t] = guestsCount(d.answers)
      }
    }
    up({ stage: 'checkpoints', pkg: id === 'custom' ? undefined : id, picks, qty, done: [], skipped: [], cp: 0 })
  }

  return (
    <section className="section-s">
      <div className="container">
        <div className="flow-top" style={{ maxWidth: 860, margin: '0 auto 26px' }}>
          <button className="btn btn-ghost btn-s" onClick={() => up({ stage: 'questions' })}><Icon name="back" size={18} /> Изменить ответы</button>
        </div>
        <div className="center stack" style={{ alignItems: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(28px,3.8vw,42px)' }}>Вот что мы можем предложить</h1>
          <p className="lead" style={{ maxWidth: 680 }}>
            Выберите вариант, который кажется ближе. Дальше мы пройдём по {cps.length} {plural(cps.length, 'шагу', 'шагам', 'шагам')}, и в каждом можно что-то поменять, добавить или убрать.
          </p>
        </div>
        {d.answers.situation !== 'existing' && (
          <div className="notice" style={{ maxWidth: 860, margin: '0 auto 26px' }}>
            <Icon name="heart" />
            <span>{TRADITION_NOTES[tr]}</span>
          </div>
        )}
        <div className="pkg-grid">
          {pkgs.map((p) => {
            const est = packageEstimate(p, d.answers)
            const names = p.includes.map((t) => typeById(t)?.name).filter(Boolean) as string[]
            return (
              <div key={p.id} className={'pkg' + (p.id === rec ? ' rec' : '')}>
                {p.id === rec && <span className="rec-flag">Подходит вам</span>}
                <span className="eyebrow">{p.name}</span>
                <h3>{p.title}</h3>
                <p className="muted small">{p.desc}</p>
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
                  <span className="small muted">Ориентировочно</span>
                  <div className="price" style={{ fontSize: 30 }}>{rub(Math.round(est / 1000) * 1000)}</div>
                </div>
                <ul className="check-list">
                  {names.slice(0, 8).map((n) => <li key={n}><Icon name="check" size={16} /> {n}</li>)}
                  {names.length > 8 && <li className="muted">и ещё {names.length - 8}</li>}
                </ul>
                <button className={'btn btn-split ' + (p.id === rec ? 'btn-primary' : 'btn-outline')} style={{ marginTop: 'auto' }} onClick={() => pick(p.id)}>
                  Выбрать «{p.name}» <Icon name="arrow" />
                </button>
              </div>
            )
          })}
        </div>
        <div className="center" style={{ marginTop: 24 }}>
          <button className="link" onClick={() => pick('custom')}>Хочу собрать всё сам, без готового варианта</button>
        </div>
      </div>
    </section>
  )
}

/* ---------- Чекпоинты ---------- */
function Checkpoints({ d, up }: { d: Draft; up: (p: Partial<Draft>) => void }) {
  const cps = useMemo(() => buildCheckpoints(d.answers), [d.answers])
  const cpIndex = Math.min(d.cp, cps.length - 1)
  const cp = cps[cpIndex]
  const [activeType, setActiveType] = useState(cp.types[0])
  useEffect(() => {
    const firstPicked = cp.types.find((t) => d.picks[t])
    setActiveType(firstPicked ?? cp.types[0])
  }, [cp.id])
  const toast = useToast()

  const settled = new Set([...d.done, ...d.skipped])
  const progress = Math.round((cps.filter((c) => settled.has(c.id)).length / cps.length) * 100)
  const total = totalOf(d)
  const offers = offersByType(activeType)
  const type = typeById(activeType)!

  const toggle = (offerId: string) => {
    const picks = { ...d.picks }
    if (picks[activeType] === offerId) delete picks[activeType]
    else picks[activeType] = offerId
    const qty = { ...d.qty }
    if (type.perGuest && !qty[activeType]) qty[activeType] = guestsCount(d.answers)
    up({ picks, qty })
  }

  const goNext = (mark: 'done' | 'skip') => {
    const done = d.done.filter((x) => x !== cp.id)
    const skipped = d.skipped.filter((x) => x !== cp.id)
    let picks = d.picks
    if (mark === 'done') done.push(cp.id)
    else {
      skipped.push(cp.id)
      picks = { ...d.picks }
      cp.types.forEach((t) => delete picks[t])
    }
    if (cpIndex + 1 >= cps.length) up({ done, skipped, picks, stage: 'summary' })
    else up({ done, skipped, picks, cp: cpIndex + 1 })
  }

  const pickedInCp = cp.types.filter((t) => d.picks[t])

  return (
    <section className="section-s">
      <div className="container">
        <div className="flow-top">
          <button className="btn btn-ghost btn-s" onClick={() => (cpIndex === 0 ? up({ stage: 'packages' }) : up({ cp: cpIndex - 1 }))}>
            <Icon name="back" size={18} /> Назад
          </button>
          <div className="progress" aria-label={`Пройдено ${progress}%`}><div style={{ width: `${Math.max(progress, 3)}%` }} /></div>
          <span className="small nowrap"><b>{progress}%</b> <span className="muted">· шаг {cpIndex + 1} из {cps.length}</span></span>
        </div>

        <div className="layout-side">
          <div className="stack-l">
            <div className="stack" style={{ gap: 8 }}>
              <span className="eyebrow">Шаг {cpIndex + 1} из {cps.length}</span>
              <h1 style={{ fontSize: 'clamp(26px,3.4vw,38px)' }}>{cp.title}</h1>
              <p className="muted">{cp.why}</p>
            </div>

            {cp.types.length > 1 && (
              <div className="type-tabs" role="tablist">
                {cp.types.map((t) => (
                  <button key={t} role="tab" aria-selected={activeType === t} className={'type-tab' + (activeType === t ? ' active' : '')} onClick={() => setActiveType(t)}>
                    {d.picks[t] && <span className="tick"><Icon name="check" size={12} /></span>}
                    {typeById(t)?.name}
                  </button>
                ))}
              </div>
            )}

            <div className="card stack">
              <div className="row between">
                <b style={{ fontSize: 18 }}>{type.name}</b>
                <Link to={`/katalog/${type.id}`} target="_blank" className="link small">Подробнее о товаре</Link>
              </div>
              <p className="small muted">{type.desc}</p>
              {type.perGuest && d.picks[activeType] && (
                <div className="row">
                  <span className="small">Сколько гостей:</span>
                  <div className="qty">
                    <button onClick={() => up({ qty: { ...d.qty, [activeType]: Math.max(1, (d.qty[activeType] ?? 1) - 1) } })} aria-label="Меньше"><Icon name="minus" size={16} /></button>
                    <span>{d.qty[activeType] ?? guestsCount(d.answers)}</span>
                    <button onClick={() => up({ qty: { ...d.qty, [activeType]: (d.qty[activeType] ?? guestsCount(d.answers)) + 1 } })} aria-label="Больше"><Icon name="plus" size={16} /></button>
                  </div>
                </div>
              )}
              <span className="small muted">Предложения служб, от доступного к дорогому. Нажмите, чтобы выбрать, и ещё раз, чтобы убрать.</span>
              <div className="stack" style={{ gap: 10 }}>
                {offers.map((o) => {
                  const a = agencyOfOffer(o)
                  const sel = d.picks[activeType] === o.id
                  return (
                    <button key={o.id} className={'offer-pick' + (sel ? ' selected' : '')} onClick={() => toggle(o.id)} aria-pressed={sel}>
                      <div className="art"><ProductArt kind={type.art} palette={o.palette} /></div>
                      <div style={{ minWidth: 0 }}>
                        <b style={{ display: 'block' }}>{a.name}</b>
                        <span className="row small" style={{ gap: 6 }}><Stars value={o.rating} size={12} /> <span className="muted">{o.rating.toFixed(1)} · {AVAILABILITY[o.available].toLowerCase()}</span></span>
                        {o.variant && <span className="small muted">Вариант: {o.variant}</span>}
                      </div>
                      <div className="stack" style={{ alignItems: 'flex-end', gap: 6 }}>
                        <span className="price">{rub(o.price)}</span>
                        <span className={'cp-mark' + (sel ? ' done' : '')}>{sel && <Icon name="check" size={14} />}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="row between">
              <button className="btn btn-ghost" onClick={() => goNext('skip')}>Этот шаг не нужен</button>
              <button className="btn btn-primary" onClick={() => goNext('done')}>
                {pickedInCp.length ? 'Готово, дальше' : 'Решу позже, дальше'} <Icon name="arrow" size={18} />
              </button>
            </div>
          </div>

          <aside className="sticky-side stack">
            <div className="card stack">
              <b>Ваш план</b>
              <div className="cp-list">
                {cps.map((c, i) => {
                  const isDone = d.done.includes(c.id)
                  const isSkip = d.skipped.includes(c.id)
                  const n = c.types.filter((t) => d.picks[t]).length
                  return (
                    <button key={c.id} className={'cp-item' + (i === cpIndex ? ' current' : '')} onClick={() => up({ cp: i })}>
                      <span className={'cp-mark' + (isDone ? ' done' : isSkip ? ' skip' : '')}>{isDone ? <Icon name="check" size={13} /> : isSkip ? <Icon name="minus" size={12} /> : i + 1}</span>
                      <span style={{ flex: 1 }}>{c.title}</span>
                      {n > 0 && <span className="small muted">{n}</span>}
                    </button>
                  )
                })}
              </div>
              <div className="summary-total" style={{ fontSize: 19 }}><span>Сейчас в плане</span><span>{rub(total)}</span></div>
              <button className="btn btn-dark" onClick={() => up({ stage: 'summary' })}>Посмотреть итог</button>
              <button className="btn btn-ghost btn-s" onClick={() => { savePlan(planFromDraft(d)); toast('План сохранён. Он будет в личном кабинете') }}>
                Сохранить и вернуться позже
              </button>
            </div>
            <div className="notice notice-blue small"><Icon name="phone" size={18} /> <span>Сложно выбрать? Позвоните, и мы поможем пройти этот шаг вместе.</span></div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function totalOf(d: Draft) {
  return Object.entries(d.picks).reduce((s, [t, oid]) => {
    const o = offerById(oid)
    return s + (o ? o.price * (typeById(t)?.perGuest ? d.qty[t] ?? 1 : 1) : 0)
  }, 0)
}
function planFromDraft(d: Draft) {
  return { id: d.id, title: d.pkg ? `План: ${{ min: 'Минимум', std: 'Стандарт', ext: 'Расширенный' }[d.pkg]}` : 'Свой план', createdAt: new Date().toISOString(), answers: d.answers, pkg: d.pkg ?? 'custom', picks: d.picks, skipped: d.skipped, done: d.done }
}

/* ---------- Итог ---------- */
function Summary({ d, up, reset }: { d: Draft; up: (p: Partial<Draft>) => void; reset: () => void }) {
  const cps = buildCheckpoints(d.answers)
  const cart = useCart()
  const nav = useNavigate()
  const toast = useToast()
  const total = totalOf(d)
  const agencies = new Set(Object.values(d.picks).map((id) => offerById(id)?.agencyId).filter(Boolean))
  const notDecided = cps.filter((c) => !c.types.some((t) => d.picks[t]) && !d.skipped.includes(c.id))

  const toCart = () => {
    cart.replaceAll(
      [
        ...cart.lines.filter((l) => !Object.values(d.picks).includes(l.offerId)),
        ...Object.entries(d.picks).map(([t, oid]) => ({ offerId: oid, qty: typeById(t)?.perGuest ? d.qty[t] ?? 1 : 1 })),
      ],
      'support',
    )
    savePlan(planFromDraft(d))
    toast('Всё добавили в корзину')
    nav('/oformlenie')
  }

  return (
    <section className="section-s">
      <div className="container">
        <div className="flow-top">
          <button className="btn btn-ghost btn-s" onClick={() => up({ stage: 'checkpoints' })}><Icon name="back" size={18} /> К шагам</button>
          <div className="progress"><div style={{ width: '100%' }} /></div>
          <span className="small nowrap"><b>Готово</b></span>
        </div>
        <div className="layout-side">
          <div className="stack-l">
            <div className="stack" style={{ gap: 8 }}>
              <h1 style={{ fontSize: 'clamp(28px,3.6vw,40px)' }}>Ваш план прощания</h1>
              <p className="muted">Проверьте, всё ли так. Любой пункт можно изменить. После оформления каждая служба подтвердит свою часть.</p>
            </div>
            {notDecided.length > 0 && (
              <div className="notice">
                <Icon name="info" />
                <span>Пока не выбрано: {notDecided.map((c) => c.title.toLowerCase()).join(', ')}. Это можно сделать сейчас или позже вместе с координатором.</span>
              </div>
            )}
            {cps.map((c) => {
              const items = c.types.filter((t) => d.picks[t])
              const idx = cps.indexOf(c)
              return (
                <div key={c.id} className="card stack">
                  <div className="row between">
                    <h4>{c.title}</h4>
                    <button className="link small" onClick={() => up({ stage: 'checkpoints', cp: idx })}>Изменить</button>
                  </div>
                  {items.length === 0 ? (
                    <span className="small muted">{d.skipped.includes(c.id) ? 'Не нужно' : 'Решим позже'}</span>
                  ) : (
                    items.map((t) => {
                      const o = offerById(d.picks[t])!
                      const a = agencyOfOffer(o)
                      const q = typeById(t)?.perGuest ? d.qty[t] ?? 1 : 1
                      return (
                        <div key={t} className="summary-line">
                          <span>
                            {typeById(t)?.name}{q > 1 ? ` × ${q}` : ''}
                            <br />
                            <Link to={`/sluzhby/${a.slug}`} className="small muted">{a.short}</Link>
                          </span>
                          <b className="nowrap">{rub(o.price * q)}</b>
                        </div>
                      )
                    })
                  )}
                </div>
              )
            })}
          </div>
          <aside className="sticky-side stack">
            <div className="card stack">
              <div className="summary-total" style={{ borderTop: 0, marginTop: 0, paddingTop: 0 }}><span>Итого</span><span>{rub(total)}</span></div>
              <span className="small muted">{agencies.size} {plural(agencies.size, 'служба', 'службы', 'служб')} · цена не изменится</span>
              <div className="notice notice-green small"><Icon name="shield" size={18} /> <span>Координатор От Души проследит, чтобы все службы приехали вовремя.</span></div>
              <button className="btn btn-primary" disabled={total === 0} onClick={toCart}>Перейти к оформлению</button>
              <button className="btn btn-ghost btn-s" onClick={() => { savePlan(planFromDraft(d)); toast('План сохранён') }}>Сохранить план</button>
              <button className="btn btn-ghost btn-s" onClick={() => { if (confirmReset()) reset() }}>Начать заново</button>
            </div>
            <p className="small muted">Пособие на погребение и бесплатный перечень услуг: <Link to="/chto-delat" className="link">что положено</Link></p>
          </aside>
        </div>
      </div>
    </section>
  )
}

function confirmReset() {
  return window.confirm('Начать подбор заново? Текущий план останется в сохранённых, если вы его сохраняли.')
}
