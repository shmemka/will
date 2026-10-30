import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './ui'
import { SUPPORT_PHONE } from '../data/guide'
import { telLink } from '../data/agencies'
import { saveCallback } from '../lib/api'
import { isPhone } from '../lib/format'
import { useToast } from '../lib/store'

type Msg = { from: 'us' | 'me'; text: string; link?: { to: string; label: string } }

const QUICK: { q: string; a: Msg }[] = [
  { q: 'Близкий человек только что ушёл', a: { from: 'us', text: 'Мне очень жаль. Вы не одни, мы поможем. Сначала главное: если это случилось дома, позвоните 103 или 112. Дальше можно идти по шагам, без спешки.', link: { to: '/chto-delat', label: 'Открыть пошаговую памятку' } } },
  { q: 'Помогите собрать всё необходимое', a: { from: 'us', text: 'Конечно. Ответьте на несколько вопросов, и мы предложим три варианта: минимум, стандарт и расширенный. Всё можно поменять.', link: { to: '/soprovozhdenie', label: 'Начать подбор' } } },
  { q: 'Сколько это стоит?', a: { from: 'us', text: 'Цены фиксированные, вы видите итог до оплаты. Самое необходимое обычно стоит от 40 000 до 60 000 ₽. Также можно получить пособие на погребение.', link: { to: '/katalog', label: 'Посмотреть цены в каталоге' } } },
  { q: 'Вопрос по моему заказу', a: { from: 'us', text: 'Все заказы и их статусы есть в личном кабинете. Если что-то срочное, позвоните нам, мы ответим сразу.', link: { to: '/kabinet', label: 'Открыть кабинет' } } },
]

export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'chat' | 'call'>('chat')
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'us', text: 'Здравствуйте. Мы рядом и поможем с любым вопросом, в любое время. Что сейчас для вас важнее всего?' }])
  const [text, setText] = useState('')
  const [cb, setCb] = useState({ name: '', phone: '', when: 'Как можно скорее' })
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const toast = useToast()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, open])

  const reply = (q: string, a?: Msg) => {
    setMsgs((m) => [...m, { from: 'me', text: q }])
    setTimeout(() => {
      setMsgs((m) => [...m, a ?? { from: 'us', text: 'Спасибо, что написали. Сейчас это демо-чат, поэтому живой ответ не придёт. Чтобы поговорить с человеком прямо сейчас, позвоните нам или оставьте номер, и мы перезвоним.' }])
    }, 600)
  }

  const send = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    reply(text.trim())
    setText('')
  }

  const callback = async (e: FormEvent) => {
    e.preventDefault()
    if (!isPhone(cb.phone)) return setErr('Проверьте номер, пожалуйста')
    setErr('')
    await saveCallback({ name: cb.name, phone: cb.phone, when: cb.when })
    setSent(true)
    toast('Заявка принята. Мы скоро перезвоним')
  }

  return (
    <>
      <button className={'sw-fab' + (open ? ' hidden' : '')} onClick={() => setOpen(true)} aria-label="Открыть поддержку">
        <Icon name="chat" />
        <span>Мы рядом 24/7</span>
      </button>
      {open && (
        <div className="sw-panel" role="dialog" aria-label="Поддержка">
          <div className="sw-head">
            <div>
              <b>Поддержка От Души</b>
              <div className="tiny" style={{ opacity: 0.8 }}>Отвечаем круглосуточно, без выходных</div>
            </div>
            <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Закрыть">
              <Icon name="close" />
            </button>
          </div>
          <div className="sw-tabs">
            <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>Написать</button>
            <button className={tab === 'call' ? 'active' : ''} onClick={() => setTab('call')}>Позвонить</button>
          </div>
          {tab === 'chat' ? (
            <>
              <div className="sw-body" ref={bodyRef}>
                {msgs.map((m, i) => (
                  <div key={i} className={'sw-msg ' + m.from}>
                    <p>{m.text}</p>
                    {m.link && (
                      <Link to={m.link.to} className="link small" onClick={() => setOpen(false)}>{m.link.label}</Link>
                    )}
                  </div>
                ))}
                {msgs.length < 3 && (
                  <div className="stack" style={{ gap: 8, marginTop: 6 }}>
                    {QUICK.map((x) => (
                      <button key={x.q} className="sw-quick" onClick={() => reply(x.q, x.a)}>{x.q}</button>
                    ))}
                  </div>
                )}
              </div>
              <form className="sw-input" onSubmit={send}>
                <input className="input" placeholder="Напишите, что случилось" value={text} onChange={(e) => setText(e.target.value)} aria-label="Сообщение" />
                <button className="btn btn-dark btn-s" aria-label="Отправить"><Icon name="arrow" size={18} /></button>
              </form>
            </>
          ) : (
            <div className="sw-body">
              <a href={telLink(SUPPORT_PHONE)} className="btn btn-primary btn-block">
                <Icon name="phone" size={18} /> {SUPPORT_PHONE}
              </a>
              <p className="small muted center" style={{ margin: '10px 0 18px' }}>Звонок бесплатный. С вами поговорит живой человек.</p>
              {sent ? (
                <div className="notice notice-green">
                  <Icon name="check" />
                  <span>Спасибо. Мы перезвоним {cb.when === 'Как можно скорее' ? 'в течение 10 минут' : cb.when.toLowerCase()}.</span>
                </div>
              ) : (
                <form className="stack" onSubmit={callback}>
                  <b>Или оставьте номер, мы перезвоним</b>
                  <input className="input" placeholder="Как к вам обращаться" value={cb.name} onChange={(e) => setCb({ ...cb, name: e.target.value })} />
                  <input className={'input' + (err ? ' error' : '')} placeholder="Телефон" inputMode="tel" value={cb.phone} onChange={(e) => setCb({ ...cb, phone: e.target.value })} />
                  {err && <span className="error-text">{err}</span>}
                  <select className="select" value={cb.when} onChange={(e) => setCb({ ...cb, when: e.target.value })} aria-label="Когда перезвонить">
                    <option>Как можно скорее</option>
                    <option>Через час</option>
                    <option>Сегодня вечером</option>
                    <option>Завтра утром</option>
                  </select>
                  <button className="btn btn-dark">Жду звонка</button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
