import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { HandshakeArt } from '../components/Illustrations'
import { Crumbs, Icon } from '../components/ui'
import { savePartnerApplication } from '../lib/api'
import { isEmail, isPhone } from '../lib/format'
import { CATEGORIES } from '../data/catalog'

export default function Partners() {
  const [f, setF] = useState({ company: '', inn: '', contact: '', phone: '', email: '', comment: '' })
  const [services, setServices] = useState<string[]>([])
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!f.company.trim() || !f.contact.trim()) return setErr('Укажите название службы и контактное лицо')
    if (f.inn.replace(/\D/g, '').length < 10) return setErr('ИНН должен содержать 10 или 12 цифр')
    if (!isPhone(f.phone) || !isEmail(f.email)) return setErr('Проверьте телефон и почту')
    setErr('')
    await savePartnerApplication({ ...f, services })
    setSent(true)
  }

  return (
    <>
      <section className="section-s">
        <div className="container">
          <Crumbs items={[{ to: '/', label: 'Главная' }, { label: 'Для ритуальных служб' }]} />
          <div className="band bg-white">
            <div className="stack-l">
              <span className="badge badge-blue" style={{ alignSelf: 'flex-start' }}>Для ритуальных служб</span>
              <h1 style={{ fontSize: 'clamp(30px,4vw,46px)' }}>Честные заказы без покупки данных</h1>
              <p className="lead">
                Семьи сами выбирают ваши товары и услуги на сайте и оплачивают заказ заранее. Вы получаете готовый заказ с деталями и платите прозрачную комиссию только с выполненных заказов.
              </p>
              <div className="row">
                <a href="#form" className="btn btn-primary">Оставить заявку</a>
                <Link to="/partner" className="btn btn-outline">Посмотреть кабинет службы</Link>
              </div>
            </div>
            <HandshakeArt />
          </div>
        </div>
      </section>

      <section className="section-s">
        <div className="container grid grid-4">
          {[
            { t: 'Предоплаченные заказы', s: 'Семья оплачивает заказ на сайте. Деньги переводятся вам после выполнения.' },
            { t: 'От 15% с выполненного заказа', s: 'Никаких абонентских плат и оплаты за заявки. Платите только за результат.' },
            { t: 'Без серых схем', s: 'Заказы приходят от семей напрямую, без покупки данных у моргов и больниц.' },
            { t: 'Удобный кабинет', s: 'Подтверждайте заказы, меняйте статусы и цены, отвечайте на отзывы.' },
          ].map((x) => (
            <div key={x.t} className="card stack">
              <Icon name="check" />
              <b>{x.t}</b>
              <p className="small muted">{x.s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container">
          <h2 style={{ marginBottom: 24 }}>Как устроена работа</h2>
          <div className="grid grid-3 steps3">
            {[
              { t: 'Подключение', s: 'Проверяем документы и цены, загружаем ваш каталог. Это занимает 2-3 дня.' },
              { t: 'Заказы', s: 'Приходит уведомление о новом заказе. У вас есть 30 минут, чтобы его подтвердить.' },
              { t: 'Выполнение и выплата', s: 'После выполнения отмечаете заказ, и мы переводим оплату за вычетом комиссии.' },
            ].map((x, i) => (
              <div key={x.t} className="step3"><div className="num">{i + 1}</div><h3 style={{ marginBottom: 8 }}>{x.t}</h3><p className="muted">{x.s}</p></div>
            ))}
          </div>
          <div className="card stack" style={{ marginTop: 24 }}>
            <b>Наш стандарт бережного общения</b>
            <ul className="kbd-list small">
              <li>Фиксированная цена: итог на месте совпадает с ценой на сайте</li>
              <li>Никакого давления и навязывания дополнительных услуг</li>
              <li>Подтверждение заказа в течение 30 минут, звонок семье в течение часа</li>
              <li>Спокойный, уважительный тон в любой ситуации</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" id="form">
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 style={{ marginBottom: 8 }}>Заявка на подключение</h2>
          <p className="muted" style={{ marginBottom: 24 }}>Мы свяжемся в течение рабочего дня и расскажем о следующих шагах.</p>
          {sent ? (
            <div className="notice notice-green"><Icon name="check" /> <span>Спасибо, заявка принята. Мы свяжемся с вами по почте {f.email}.</span></div>
          ) : (
            <form className="card stack-l" onSubmit={submit}>
              <div className="grid grid-2" style={{ gap: 16 }}>
                <label className="field"><span className="label">Название службы</span><input className="input" value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} /></label>
                <label className="field"><span className="label">ИНН</span><input className="input" inputMode="numeric" value={f.inn} onChange={(e) => setF({ ...f, inn: e.target.value })} /></label>
                <label className="field"><span className="label">Контактное лицо</span><input className="input" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} /></label>
                <label className="field"><span className="label">Телефон</span><input className="input" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
              </div>
              <label className="field"><span className="label">Почта</span><input className="input" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
              <div className="stack" style={{ gap: 8 }}>
                <span className="label">Что вы предлагаете</span>
                <div className="row">
                  {CATEGORIES.map((c) => (
                    <button type="button" key={c.id} className={'chip' + (services.includes(c.id) ? ' active' : '')} onClick={() => setServices((s) => (s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id]))}>{c.name}</button>
                  ))}
                </div>
              </div>
              <label className="field"><span className="label">Комментарий</span><textarea className="textarea" value={f.comment} onChange={(e) => setF({ ...f, comment: e.target.value })} /></label>
              {err && <span className="error-text">{err}</span>}
              <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Отправить заявку</button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
