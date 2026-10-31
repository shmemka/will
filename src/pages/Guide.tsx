import { Link } from 'react-router-dom'
import { GUIDE_FAQ, GUIDE_STEPS, SUPPORT_PHONE } from '../data/guide'
import { telLink } from '../data/agencies'
import { ScenePhoto } from '../components/ProductArt'
import { SCENE } from '../data/photos'
import { Icon } from '../components/ui'
import PageHead from '../components/PageHead'

export default function Guide() {
  return (
    <>
      <PageHead
        crumbs={[{ to: '/', label: 'Главная' }, { label: 'Что делать сейчас' }]}
        title="Если близкий человек ушёл"
        lead="Нам очень жаль. Эта памятка поможет понять, что делать в первые часы и дни. Читайте в своём темпе, не нужно успеть всё сразу."
        art={<ScenePhoto id={SCENE.guideFirst} ratio="4 / 3" />}
      >
        <div className="row" style={{ marginTop: 24 }}>
          <a href={telLink(SUPPORT_PHONE)} className="btn btn-dark"><Icon name="phone" size={18} /> Позвонить нам</a>
          <Link to="/soprovozhdenie" className="btn btn-white">Помогите всё организовать <Icon name="arrow" /></Link>
        </div>
      </PageHead>

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

      <section className="section bg-soft rule">
        <div className="container" style={{ maxWidth: 860 }}>
          <h2 style={{ marginBottom: 16 }}>Частые вопросы</h2>
          <div>
            {GUIDE_FAQ.map((f) => (
              <details key={f.q} className="faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="guides section">
        <div className="container narrow">
          <div className="guide-card">
            <div className="stack">
              <h3>Не нужно справляться одному</h3>
              <p className="muted">Ответьте на несколько вопросов, и мы предложим варианты с понятной ценой. Или просто позвоните, мы всё сделаем вместе.</p>
              <div className="row" style={{ marginTop: 8 }}>
                <Link to="/soprovozhdenie" className="btn btn-primary">Начать подбор <Icon name="arrow" /></Link>
                <Link to="/kabinet/pamyatka" className="btn btn-outline">Чек-лист в кабинете</Link>
              </div>
            </div>
            <div className="art"><ScenePhoto id={SCENE.guideOrganize} ratio="4 / 3" /></div>
          </div>
        </div>
      </section>
    </>
  )
}
