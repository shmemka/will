import { Link } from 'react-router-dom'
import { GUIDE_FAQ, GUIDE_STEPS, SUPPORT_PHONE } from '../data/guide'
import { telLink } from '../data/agencies'
import { CandleArt } from '../components/Illustrations'
import { Crumbs, Icon } from '../components/ui'

export default function Guide() {
  return (
    <>
      <section className="section-s">
        <div className="container">
          <Crumbs items={[{ to: '/', label: 'Главная' }, { label: 'Что делать сейчас' }]} />
          <div className="band bg-white" style={{ gridTemplateColumns: '1.4fr auto' }}>
            <div className="stack-l">
              <h1 style={{ fontSize: 'clamp(30px,4vw,46px)' }}>Если близкий человек ушёл</h1>
              <p className="lead">
                Нам очень жаль. Эта памятка поможет понять, что делать в первые часы и дни. Читайте в своём темпе, не нужно успеть всё сразу.
              </p>
              <div className="row">
                <a href={telLink(SUPPORT_PHONE)} className="btn btn-primary"><Icon name="phone" size={18} /> Позвонить нам</a>
                <Link to="/soprovozhdenie" className="btn btn-outline">Помогите всё организовать</Link>
              </div>
            </div>
            <CandleArt className="hero-art" />
          </div>
        </div>
      </section>

      <section className="section-s">
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="notice notice-pink" style={{ marginBottom: 12 }}>
            <Icon name="phone" />
            <span><b>Если человек ушёл дома и врач ещё не приезжал</b>, позвоните 103 или 112. Это первое, что нужно сделать.</span>
          </div>
          {GUIDE_STEPS.map((s, i) => (
            <div key={s.id} className="guide-step">
              <div className="n">{i + 1}</div>
              <div className="stack">
                <span className="badge badge-yellow" style={{ alignSelf: 'flex-start' }}><Icon name="clock" size={14} /> {s.when}</span>
                <h2 style={{ fontSize: 26 }}>{s.title}</h2>
                {s.text.map((t) => <p key={t}>{t}</p>)}
                {s.tip && <div className="notice notice-blue small"><Icon name="heart" size={18} /> <span>{s.tip}</span></div>}
              </div>
            </div>
          ))}
          <p className="tiny muted" style={{ marginTop: 18 }}>
            Информация общая и действует для Москвы. Правила могут меняться, в сложных случаях мы поможем разобраться по телефону. Размер пособия указан по данным на 2026 год.
          </p>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="container" style={{ maxWidth: 860 }}>
          <h2 style={{ marginBottom: 24 }}>Частые вопросы</h2>
          <div className="stack">
            {GUIDE_FAQ.map((f) => (
              <details key={f.q} className="faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="band bg-yellow">
            <div className="stack-l">
              <h2>Не нужно справляться одному</h2>
              <p style={{ fontSize: 18 }}>Ответьте на несколько вопросов, и мы предложим варианты с понятной ценой. Или просто позвоните, мы всё сделаем вместе.</p>
              <div className="row">
                <Link to="/soprovozhdenie" className="btn btn-dark">Начать подбор</Link>
                <Link to="/kabinet/pamyatka" className="btn btn-outline">Чек-лист в кабинете</Link>
              </div>
            </div>
            <CandleArt />
          </div>
        </div>
      </section>
    </>
  )
}
