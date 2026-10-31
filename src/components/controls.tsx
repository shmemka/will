import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

// Свои элементы форм: выпадающий список, переключатель, выбор даты и времени.
// Все работают с клавиатуры и закрываются по клику мимо или Esc.

export type Opt<T extends string = string> = { value: T; label: string; hint?: string }

function Chevron() {
  return (
    <svg className="dd-chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
function Tick() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

/** Закрывает всплывающее окно по клику мимо */
function useOutside(open: boolean, ref: React.RefObject<HTMLElement>, close: () => void) {
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', h)
    document.addEventListener('touchstart', h)
    return () => {
      document.removeEventListener('mousedown', h)
      document.removeEventListener('touchstart', h)
    }
  }, [open, ref, close])
}

export function Dropdown<T extends string>({
  value, options, onChange, label, ariaLabel, placeholder = 'Выберите', block, align = 'left', size = 'm', className, up,
}: {
  value: T | ''
  options: Opt<T>[]
  onChange: (v: T) => void
  label?: string
  ariaLabel?: string
  placeholder?: string
  block?: boolean
  align?: 'left' | 'right'
  size?: 'm' | 'l'
  className?: string
  /** Открывать список вверх, если снизу мало места */
  up?: boolean
}) {
  const [open, setOpen] = useState(false)
  const idx = Math.max(0, options.findIndex((o) => o.value === value))
  const [hi, setHi] = useState(idx)
  const ref = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const id = useId()
  const current = options.find((o) => o.value === value)
  const close = () => setOpen(false)
  useOutside(open, ref, close)

  useEffect(() => {
    if (open) setHi(idx)
  }, [open, idx])
  useEffect(() => {
    if (!open) return
    list.current?.querySelector<HTMLElement>(`[data-i="${hi}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [hi, open])

  const pick = (o: Opt<T>) => {
    onChange(o.value)
    setOpen(false)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) return setOpen(true)
      setHi((h) => (e.key === 'ArrowDown' ? Math.min(options.length - 1, h + 1) : Math.max(0, h - 1)))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (open) pick(options[hi])
      else setOpen(true)
    } else if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={ref} className={'dd' + (open ? ' open' : '') + (block ? ' dd-block' : '') + (size === 'l' ? ' dd-l' : '') + (className ? ' ' + className : '')}>
      <button
        type="button"
        className="dd-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
      >
        {label && <span className="dd-label">{label}</span>}
        <span className={'dd-value' + (current ? '' : ' dd-ph')}>{current?.label ?? placeholder}</span>
        <Chevron />
      </button>
      {open && (
        <ul ref={list} id={id} className={'dd-pop dd-list' + (align === 'right' ? ' dd-right' : '') + (up ? ' dd-up' : '')} role="listbox">
          {options.map((o, i) => (
            <li
              key={o.value}
              data-i={i}
              role="option"
              aria-selected={o.value === value}
              className={(i === hi ? 'hi' : '') + (o.value === value ? ' sel' : '')}
              onMouseEnter={() => setHi(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(o)}
            >
              <span>
                {o.label}
                {o.hint && <span className="dd-hint">{o.hint}</span>}
              </span>
              {o.value === value && <Tick />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Switch({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <button type="button" role="switch" aria-checked={checked} className={'switch' + (checked ? ' on' : '')} onClick={() => onChange(!checked)}>
      <span className="switch-track"><span className="switch-knob" /></span>
      <span>{children}</span>
    </button>
  )
}

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const MONTHS_GEN = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const WD = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const WD_FULL = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const parse = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function DatePicker({ value, onChange, placeholder = 'Выберите дату', ariaLabel }: { value: string; onChange: (v: string) => void; placeholder?: string; ariaLabel?: string }) {
  const [open, setOpen] = useState(false)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sel = value ? parse(value) : null
  const [month, setMonth] = useState(() => {
    const b = sel ?? today
    return new Date(b.getFullYear(), b.getMonth(), 1)
  })
  const ref = useRef<HTMLDivElement>(null)
  useOutside(open, ref, () => setOpen(false))

  const start = (month.getDay() + 6) % 7
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells: (Date | null)[] = [...Array(start).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1)
  const label = sel ? `${sel.getDate()} ${MONTHS_GEN[sel.getMonth()]}, ${WD_FULL[sel.getDay()]}` : placeholder

  return (
    <div ref={ref} className={'dd dd-block dd-l' + (open ? ' open' : '')}>
      <button type="button" className="dd-btn" aria-haspopup="dialog" aria-expanded={open} aria-label={ariaLabel} onClick={() => setOpen((o) => !o)} onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
        <span className={'dd-value' + (sel ? '' : ' dd-ph')}>{label}</span>
        <Chevron />
      </button>
      {open && (
        <div className="dd-pop cal" role="dialog" aria-label="Выбор даты" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
          <div className="cal-head">
            <button type="button" className="cal-nav" disabled={!canPrev} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Предыдущий месяц">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <b>{MONTHS[month.getMonth()]} {month.getFullYear()}</b>
            <button type="button" className="cal-nav" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Следующий месяц">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
          <div className="cal-grid">
            {WD.map((w) => <span key={w} className="cal-wd">{w}</span>)}
            {cells.map((d, i) =>
              d ? (
                <button
                  type="button"
                  key={i}
                  disabled={d < today}
                  className={'cal-day' + (sel && iso(d) === iso(sel) ? ' sel' : '') + (iso(d) === iso(today) ? ' today' : '')}
                  onClick={() => {
                    onChange(iso(d))
                    setOpen(false)
                  }}
                >
                  {d.getDate()}
                </button>
              ) : (
                <span key={i} />
              ),
            )}
          </div>
          {value && (
            <button type="button" className="link small" onClick={() => { onChange(''); setOpen(false) }}>Пока не знаю</button>
          )}
        </div>
      )}
    </div>
  )
}

const TIMES: Opt[] = [{ value: '', label: 'Пока не знаю' }, ...Array.from({ length: 27 }, (_, i) => {
  const m = 7 * 60 + i * 30
  const t = `${String(Math.floor(m / 60)).padStart(2, '0')}:${m % 60 ? '30' : '00'}`
  return { value: t, label: t }
})]

export function TimePicker({ value, onChange, ariaLabel }: { value: string; onChange: (v: string) => void; ariaLabel?: string }) {
  return <Dropdown block size="l" value={value} options={TIMES} onChange={onChange} placeholder="Выберите время" ariaLabel={ariaLabel} />
}
